import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { socialRouter } from "./routers/social";
import { emailAuthRouter } from "./routers/emailAuth";
import { financeRouter } from "./routers/finance";
import { warRoomRouter } from "./routers/warRoom";
import { botEngineRouter } from "./routers/botEngine";
import { realEstateRouter } from "./routers/realEstate";
import { getDb } from "./db";
import { userProfiles, liveMessages, affiliateProducts, affiliateClicks, walletTransactions } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  emailAuth: emailAuthRouter,
  social: socialRouter,
  warRoom: warRoomRouter,
  botEngine: botEngineRouter,
  realEstate: realEstateRouter,
  finance: financeRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    // Returns whether the current user has an active monthly subscription
    checkSubscription: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { isSubscriber: false, subscribedAt: null };
      const result = await db
        .select({ isSubscriber: userProfiles.isSubscriber, subscribedAt: userProfiles.subscribedAt })
        .from(userProfiles)
        .where(eq(userProfiles.userId, ctx.user.id))
        .limit(1);
      return {
        isSubscriber: result[0]?.isSubscriber ?? false,
        subscribedAt: result[0]?.subscribedAt ?? null,
      };
    }),

    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      return result[0] ?? null;
    }),

    upsert: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1).max(100),
        age: z.number().int().min(13).max(120),
        city: z.string().min(1).max(100),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(userProfiles).values({
          userId: ctx.user.id,
          displayName: input.displayName,
          age: input.age,
          city: input.city,
          bio: input.bio ?? null,
          avatarUrl: input.avatarUrl ?? null,
          profileComplete: true,
        }).onDuplicateKeyUpdate({
          set: {
            displayName: input.displayName,
            age: input.age,
            city: input.city,
            bio: input.bio ?? null,
            avatarUrl: input.avatarUrl ?? null,
            profileComplete: true,
          },
        });
        const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
        return result[0];
      }),

    uploadAvatar: protectedProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string().default("image/jpeg"),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const ext = input.mimeType === "image/png" ? "png" : "jpg";
        const key = `avatars/${ctx.user.id}-${nanoid(8)}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url };
      }),

    // Save voice consent PDF to S3 and mark onboarding complete
    saveConsent: protectedProcedure
      .input(z.object({
        pdfBase64: z.string(),
        spouseConsent: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const pdfBuffer = Buffer.from(input.pdfBase64, "base64");
        const key = `consent-pdfs/${ctx.user.id}-${Date.now()}.pdf`;
        const { url } = await storagePut(key, pdfBuffer, "application/pdf");
        await db.insert(userProfiles).values({
          userId: ctx.user.id,
          consentPdfUrl: url,
          consentRecordedAt: new Date(),
          onboardingComplete: true,
        }).onDuplicateKeyUpdate({
          set: {
            consentPdfUrl: url,
            consentRecordedAt: new Date(),
            onboardingComplete: true,
          },
        });
        return { success: true, pdfUrl: url };
      }),
  }),

  vault: router({
    // List all active products, optionally filtered by category
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const { and, eq: eqOp } = await import("drizzle-orm");
        const conditions = [eqOp(affiliateProducts.active, true)];
        if (input.category) conditions.push(eqOp(affiliateProducts.category, input.category));
        return db.select().from(affiliateProducts).where(and(...conditions));
      }),

    // Track a click and redirect
    trackClick: publicProcedure
      .input(z.object({ productId: z.number().int(), sessionId: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        const products = await db.select().from(affiliateProducts).where(eq(affiliateProducts.id, input.productId)).limit(1);
        const product = products[0];
        if (!product) return { success: false, url: null };
        await db.insert(affiliateClicks).values({
          productId: input.productId,
          userId: ctx.user?.id ?? null,
          sessionId: input.sessionId ?? null,
        });
        return { success: true, url: product.affiliateUrl };
      }),

    // Admin: get click stats
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Forbidden");
      const db = await getDb();
      if (!db) return [];
      const { count } = await import("drizzle-orm");
      return db.select({
        productId: affiliateClicks.productId,
        clicks: count(affiliateClicks.id),
      }).from(affiliateClicks).groupBy(affiliateClicks.productId);
    }),
  }),

  wallet: router({
    // Get current wallet balance for the logged-in user
    balance: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { balance: 0, isSubscriber: false, renewalAt: null, monthlyFee: "29.99" };
      const result = await db
        .select({
          balanceTotal: userProfiles.balanceTotal,
          isSubscriber: userProfiles.isSubscriber,
          subscriptionRenewalAt: userProfiles.subscriptionRenewalAt,
          monthlyFee: userProfiles.monthlyFee,
        })
        .from(userProfiles)
        .where(eq(userProfiles.userId, ctx.user.id))
        .limit(1);
      const p = result[0];
      return {
        balance: parseFloat(p?.balanceTotal ?? "0"),
        isSubscriber: p?.isSubscriber ?? false,
        renewalAt: p?.subscriptionRenewalAt ?? null,
        monthlyFee: p?.monthlyFee ?? "29.99",
      };
    }),

    // Subscribe: deduct monthly fee from wallet, activate subscription
    subscribe: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      const profile = profiles[0];
      if (!profile) throw new Error("Profile not found — complete setup first");
      const balance = parseFloat(profile.balanceTotal);
      const fee = parseFloat(profile.monthlyFee);
      if (balance < fee) throw new Error(`Insufficient wallet balance. Need $${fee.toFixed(2)}, have $${balance.toFixed(2)}.`);
      const now = new Date();
      const renewal = new Date(now);
      renewal.setMonth(renewal.getMonth() + 1);
      // Deduct fee and activate subscription
      await db.update(userProfiles).set({
        balanceTotal: (balance - fee).toFixed(2),
        isSubscriber: true,
        subscribedAt: now,
        subscriptionRenewalAt: renewal,
      }).where(eq(userProfiles.userId, ctx.user.id));
      // Log wallet transaction
      await db.insert(walletTransactions).values({
        userId: ctx.user.id,
        type: "debit",
        amount: fee.toFixed(2),
        description: `1% Playground monthly subscription — renews ${renewal.toLocaleDateString()}`,
      });
      return { success: true, renewalAt: renewal };
    }),

    // Admin: credit a user wallet from bot earnings pool
    credit: protectedProcedure
      .input(z.object({ targetUserId: z.number().int(), amount: z.number().positive(), description: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Forbidden");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.targetUserId)).limit(1);
        const profile = profiles[0];
        if (!profile) throw new Error("User profile not found");
        const newBalance = parseFloat(profile.balanceTotal) + input.amount;
        const todayBalance = parseFloat(profile.balanceToday) + input.amount;
        await db.update(userProfiles).set({
          balanceTotal: newBalance.toFixed(2),
          balanceToday: todayBalance.toFixed(2),
        }).where(eq(userProfiles.userId, input.targetUserId));
        await db.insert(walletTransactions).values({
          userId: input.targetUserId,
          type: "credit",
          amount: input.amount.toFixed(2),
          description: input.description ?? "Bot earnings — 40% share",
        });
        return { success: true, newBalance };
      }),

    // Get transaction history for the logged-in user
    history: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(walletTransactions)
        .where(eq(walletTransactions.userId, ctx.user.id))
        .orderBy(desc(walletTransactions.createdAt))
        .limit(50);
    }),
  }),

  live: router({
    getMessages: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const msgs = await db.select().from(liveMessages).orderBy(desc(liveMessages.createdAt)).limit(80);
      return msgs.reverse();
    }),

    sendMessage: protectedProcedure
      .input(z.object({ message: z.string().min(1).max(300) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
        const profile = profiles[0];
        await db.insert(liveMessages).values({
          userId: ctx.user.id,
          displayName: profile?.displayName ?? ctx.user.name ?? "Member",
          avatarUrl: profile?.avatarUrl ?? null,
          message: input.message,
          tier: profile?.tier ?? "silver",
        });
        return { success: true };
      }),

    clearMessages: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new Error("Forbidden");
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(liveMessages);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
