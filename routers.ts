import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ttsRouter } from "./ttsRouter";
import { warRoomRouter } from "./warRoomRouter";
import { twilioRouter } from "./twilioRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tts: ttsRouter,
  warRoom: warRoomRouter,
  twilio: twilioRouter,

  // ─── SOCIAL ROUTER ─────────────────────────────────────────────────────────
  social: router({
    getFeed: publicProcedure
      .input(z.object({ cursor: z.number().optional(), limit: z.number().default(20) }))
      .query(() => ({
        items: [] as any[],
        nextCursor: null as number | null,
      })),
    likePost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(() => ({ success: true })),
    addComment: protectedProcedure
      .input(z.object({ postId: z.number(), content: z.string().optional(), body: z.string().optional() }))
      .mutation(() => ({ success: true })),
    getEvents: publicProcedure
      .query(() => [] as any[]),
    getWallet: protectedProcedure
      .query(() => ({
        balance: 0,
        tier: "silver" as const,
        spendable: 0,
        locked: 0,
        transactions: [] as any[],
      })),
    getListings: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
      }))
      .query(() => ({ items: [] as any[], total: 0 })),
    placeBid: protectedProcedure
      .input(z.object({ listingId: z.number(), amount: z.number(), note: z.string().optional() }))
      .mutation(() => ({ success: true })),
  }),

  // ─── LIVE ROUTER ───────────────────────────────────────────────────────────
  live: router({
    getMessages: publicProcedure
      .query(() => [] as any[]),
    sendMessage: protectedProcedure
      .input(z.object({ content: z.string().optional(), message: z.string().optional() }))
      .mutation(() => ({ success: true })),
    clearMessages: protectedProcedure
      .mutation(() => ({ success: true })),
  }),

  // ─── WALLET ROUTER ─────────────────────────────────────────────────────────
  wallet: router({
    balance: protectedProcedure
      .query(() => ({
        balance: 0,
        tier: "silver" as const,
        totalEarned: 0,
        pendingPayout: 0,
        isSubscriber: false,
        monthlyFee: "29.99",
      })),
    history: protectedProcedure
      .query(() => [] as any[]),
    subscribe: protectedProcedure
      .input(z.object({ plan: z.string() }).optional())
      .mutation(() => ({ success: true })),
  }),

  // ─── PROFILE ROUTER ────────────────────────────────────────────────────────
  profile: router({
    get: protectedProcedure
      .query(() => null as any),
    upsert: protectedProcedure
      .input(z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        city: z.string().optional(),
        businessName: z.string().optional(),
        instagramHandle: z.string().optional(),
        tiktokHandle: z.string().optional(),
        age: z.number().optional(),
        avatarUrl: z.string().optional(),
      }))
      .mutation(() => ({ success: true })),
    uploadAvatar: protectedProcedure
      .input(z.object({ dataUrl: z.string().optional(), base64: z.string().optional() }))
      .mutation(() => ({ url: "" })),
    saveConsent: protectedProcedure
      .input(z.object({
        consented: z.boolean(),
        pdfBase64: z.string().optional(),
        spouseConsent: z.boolean().optional(),
      }))
      .mutation(() => ({ success: true })),
  }),

  // ─── VAULT ROUTER ──────────────────────────────────────────────────────────
  vault: router({
    trackClick: protectedProcedure
      .input(z.object({ productId: z.string(), category: z.string() }))
      .mutation(({ input }) => ({ success: true, url: "" })),
  }),

  // ─── BOT ENGINE ROUTER (Admin) ─────────────────────────────────────────────
  botEngine: router({
    stats: protectedProcedure
      .query(() => ({
        engagement: {
          totalActions: 0,
          actionsToday: 0,
          likes: 0,
          comments: 0,
          boosts: 0,
          replies: 0,
          likeBacks: 0,
          proactiveComments: 0,
        },
        bots: {
          activeBots: 0,
          totalBots: 0,
        },
        posts: {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
        },
        queue: {
          pending: 0,
          posted: 0,
        },
        lastCycleAt: null as Date | null,
      })),
    recentLog: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(() => [] as any[]),
    roster: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(() => ({ bots: [] as any[], total: 0 })),
    runEngagementCycle: protectedProcedure
      .mutation(() => ({ success: true, actionsRun: 0, actions: 0 })),
    runPostJob: protectedProcedure
      .mutation(() => ({ success: true, postsCreated: 0, published: 0, queueRemaining: 0 })),
    seedQueue: protectedProcedure
      .input(z.object({ count: z.number().optional() }))
      .mutation(() => ({ success: true, seeded: 0 })),
    launchBlitz: protectedProcedure
      .input(z.object({ durationMinutes: z.number().default(30) }).optional())
      .mutation(() => ({ success: true, blitzId: "", message: "Blitz launched!" })),
    blitzStatus: protectedProcedure
      .query(() => ({
        active: false,
        blitzId: null as string | null,
        endsAt: null as Date | null,
        fired: 0,
        pending: 0,
        nextPostAt: null as Date | null,
        nextCaption: null as string | null,
      })),
    toggleBot: protectedProcedure
      .input(z.object({ botId: z.string(), active: z.boolean() }))
      .mutation(() => ({ success: true })),
  }),
});

export type AppRouter = typeof appRouter;
