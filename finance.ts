        remaining:   r2(available - input.amount),
        note:        input.note,
        at:          now,
      };
    }),

  // ─── SURPLUS TRANSFER HISTORY ────────────────────────────────────────────
  surplusHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Forbidden");
    const db = await getDb();
    if (!db) return [];
    // Return all surplus entries (positive = inflow, negative = outflow)
    return db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.type, "surplus_transfer"))
      .orderBy(desc(financialTransactions.createdAt))
      .limit(50);
  }),
});
