import { createHash, randomBytes } from "crypto";
import { eq, and, gt, desc, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "./db";
import {
  warRoomSettings,
  pinResetTokens,
  callLogs,
  warRoomAlerts,
  botPerformance,
} from "../drizzle/schema";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";

const ADMIN_EMAIL = "ernest@createaiprofit.com";
const RESET_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

function hashPin(pin: string): string {
  return createHash("sha256").update(pin + "warroom_salt_2024").digest("hex");
}

async function getOrInitSettings() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

  const rows = await db.select().from(warRoomSettings).limit(1);
  if (rows.length > 0) return rows[0];

  // Initialize with default PIN 0824
  // @ts-ignore
  await db.insert(warRoomSettings).values({
    value: hashPin("0824"),
    adminEmail: ADMIN_EMAIL,
  });
  const newRows = await db.select().from(warRoomSettings).limit(1);
  return newRows[0];
}

export const warRoomRouter = router({
  // ─── PIN MANAGEMENT ──────────────────────────────────────────────────────
  verifyPin: protectedProcedure
    .input(z.object({ pin: z.string().min(4).max(8) }))
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const settings = await getOrInitSettings();
      const valid = settings!.value === hashPin(input.pin);
      return { valid };
    }),

  requestReset: protectedProcedure
    .mutation(async ({ ctx }: { ctx: any }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_EXPIRY_MS);

      // @ts-ignore
      await db.insert((pinResetTokens as any)).values({ token, expiresAt });

      const resetUrl = `/war-room?reset_token=${token}`;
      await notifyOwner({
        title: "War Room PIN Reset",
        content: `A PIN reset was requested.\n\nClick to reset your PIN (expires in 15 minutes):\n\n${resetUrl}\n\nIf you did not request this, ignore this message.`,
      });

      return { sent: true, email: ADMIN_EMAIL };
    }),

  confirmReset: protectedProcedure
    .input(z.object({ token: z.string(), newPin: z.string().min(4).max(8) }))
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const now = new Date();
      const tokenRows = await db
        .select()
        .from((pinResetTokens as any))
        .where(
          and(
            eq((pinResetTokens as any).token, input.token),
            eq((pinResetTokens as any).used, 0),
            gt((pinResetTokens as any).expiresAt, now)
          )
        )
        .limit(1);

      if (tokenRows.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired reset token." });
      }

      // @ts-ignore
      await db.update((pinResetTokens as any)).set({ used: 1 }).where(eq((pinResetTokens as any).token, input.token));

      const settings = await getOrInitSettings();
      await db
        .update(warRoomSettings)
        // @ts-ignore
        .set({ value: hashPin(input.newPin) })
        .where(eq(warRoomSettings.id, settings!.id));

      return { success: true };
    }),

  changePin: protectedProcedure
    .input(z.object({ currentPin: z.string().min(4).max(8), newPin: z.string().min(4).max(8) }))
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const settings = await getOrInitSettings();
      if (settings!.value !== hashPin(input.currentPin)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current PIN is incorrect." });
      }
      const db = await getDb();
      await db!
        .update(warRoomSettings)
        // @ts-ignore
        .set({ value: hashPin(input.newPin) })
        .where(eq(warRoomSettings.id, settings!.id));
      return { success: true };
    }),

  // ─── CALL LOGS ────────────────────────────────────────────────────────────
  calls: {
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(200).default(50),
          botName: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }: { ctx: any; input: any }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const db = await getDb();
        if (!db) return [];
        const conditions = input.botName ? [eq(callLogs.botName, input.botName)] : [];
        return db
          .select()
          .from(callLogs)
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(callLogs.calledAt))
          .limit(input.limit);
      }),

    log: protectedProcedure
      .input(
        z.object({
          botName: z.string(),
          botVoice: z.string().optional(),
          toNumber: z.string(),
          fromNumber: z.string().optional(),
          twilioSid: z.string().optional(),
          outcome: z
            .enum(["connected", "voicemail", "no_answer", "interested", "assigned", "rejected", "error"])
            .optional(),
          durationSeconds: z.number().optional(),
          scriptUsed: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.insert(callLogs).values(input);
        // Auto-create alert for every logged call
        // @ts-ignore
        await db.insert(warRoomAlerts).values({
          type: "call_placed",
          title: `${input.botName} — Call Placed`,
          message: `${input.botName} called ${input.toNumber}. SID: ${input.twilioSid ?? "N/A"}. Outcome: ${input.outcome ?? "connected"}.`,
          severity: "info",
        });
        return { success: true };
      }),
  },

  // ─── ALERTS ───────────────────────────────────────────────────────────────
  alerts: {
    list: protectedProcedure
      .input(
        z.object({
          unreadOnly: z.boolean().default(false),
          limit: z.number().min(1).max(100).default(30),
        })
      )
      .query(async ({ ctx, input }: { ctx: any; input: any }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const db = await getDb();
        if (!db) return [];
        const conditions = input.unreadOnly ? [eq(warRoomAlerts.read, false)] : [];
        return db
          .select()
          .from(warRoomAlerts)
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(warRoomAlerts.createdAt))
          .limit(input.limit);
      }),

    markRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        // @ts-ignore
        await db.update(warRoomAlerts).set({ read: true }).where(eq(warRoomAlerts.id, input.id));
        return { success: true };
      }),

    markAllRead: protectedProcedure.mutation(async ({ ctx }: { ctx: any }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // @ts-ignore
      await db.update(warRoomAlerts).set({ read: true });
      return { success: true };
    }),

    unreadCount: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
      if (ctx.user.role !== "admin") return 0;
      const db = await getDb();
      if (!db) return 0;
      const [result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(warRoomAlerts)
        .where(eq(warRoomAlerts.read, false));
      return result.count;
    }),
  },

  // ─── OVERVIEW ─────────────────────────────────────────────────────────────
  overview: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = await getDb();
    if (!db) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [callStats] = await db
      .select({
        callsToday: sql<number>`COUNT(*)`,
        assignedToday: sql<number>`SUM(CASE WHEN outcome = 'assigned' THEN 1 ELSE 0 END)`,
        interestedToday: sql<number>`SUM(CASE WHEN outcome = 'interested' THEN 1 ELSE 0 END)`,
      })
      .from(callLogs)
      .where(gte(callLogs.calledAt, today));

    const [allTimeStats] = await db
      .select({ totalCalls: sql<number>`COUNT(*)` })
      .from(callLogs);

    const [unreadAlerts] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(warRoomAlerts)
      .where(eq(warRoomAlerts.read, false));

    const topBots = await db
      .select()
      .from(botPerformance)
      .orderBy(desc(botPerformance.feesGenerated))
      .limit(5);

    const recentCalls = await db
      .select()
      .from(callLogs)
      .orderBy(desc(callLogs.calledAt))
      .limit(5);

    return {
      calls: { ...callStats, totalCalls: allTimeStats.totalCalls },
      unreadAlerts: unreadAlerts.count,
      topBots,
      recentCalls,
    };
  }),
});
