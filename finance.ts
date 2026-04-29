import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { financialTransactions, wallets } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

function r2(n: number) { return Math.round(n * 100) / 100; }

export const financeRouter = {
  allocate: protectedProcedure
    .input(z.object({ amount: z.number().positive(), note: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const now = Date.now();
      const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id));
      const available = wallet ? Number(wallet.balance) : 0;
      if (available < input.amount) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient balance." });
      await db.insert(financialTransactions).values({
        userId: ctx.user.id,
        type: "allocation",
        amount: String(input.amount),
        note: input.note ?? "",
        createdAt: new Date(now),
      });
      return {
        success: true,
        remaining:   r2(available - input.amount),
        note:        input.note,
        at:          now,
      };
    }),

  surplusHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Forbidden");
    const db = await getDb();
    if (!db) return [];
    return db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.type, "surplus_transfer"))
      .orderBy(desc(financialTransactions.createdAt))
      .limit(50);
  }),
};
