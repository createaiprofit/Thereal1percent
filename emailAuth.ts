
      // Send 2FA code
      const code = generate6DigitCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await dbConn.insert(twoFactorCodes).values({
        userId: cred.userId,
        code,
        type: "login",
        expiresAt,
        used: false,
      });

      await sendEmailCode(email, code, "login");

      return { success: true, userId: cred.userId, message: "Verification code sent to your email." };
    }),

  // Step 2 of login: verify 2FA code, create session
  loginVerify: publicProcedure
    .input(z.object({ userId: z.number(), code: z.string().length(6) }))
    .mutation(async ({ input, ctx }) => {
      const now = new Date();
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [record] = await dbConn
        .select()
        .from(twoFactorCodes)
        .where(
          and(
            eq(twoFactorCodes.userId, input.userId),
            eq(twoFactorCodes.code, input.code),
            eq(twoFactorCodes.type, "login"),
            eq(twoFactorCodes.used, false),
            gt(twoFactorCodes.expiresAt, now)
          )
        )
        .limit(1);

      if (!record) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired code." });
      }

      await dbConn.update(twoFactorCodes).set({ used: true }).where(eq(twoFactorCodes.id, record.id));

      const [user] = await dbConn.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      // Update last signed in
      await dbConn.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

      const token = await sdk.createSessionToken(user.openId, { name: user.name || "", expiresInMs: ONE_YEAR_MS });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }),

  // Resend code (for both login and register)
  resendCode: publicProcedure
    .input(z.object({ userId: z.number(), type: z.enum(["login", "register", "reset"]) }))
    .mutation(async ({ input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [user] = await dbConn.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      const code = generate6DigitCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await dbConn.insert(twoFactorCodes).values({
        userId: input.userId,
        code,
        type: input.type,
        expiresAt,
        used: false,
      });

      await sendEmailCode(user.email, code, input.type);
      return { success: true };
    }),

  // Request password reset
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [cred] = await dbConn
        .select()
        .from(emailCredentials)
        .where(eq(emailCredentials.email, email))