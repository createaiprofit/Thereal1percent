const COOKIE_NAME = 'app_session_id';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { user as users, twoFactorCodes, emailCredentials } from '../drizzle/schema';
import { eq, and, gt } from "drizzle-orm";
import { setSessionCookie } from './_core/cookies';
import { setSessionCookie } from './_core/cookies';

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmailCode(email: string, code: string, type: string) {
  console.log(`[EmailAuth] Send \${type} code \${code} to \${email}`);
}

export const emailAuthRouter = {
  login: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
      const { email } = input;
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [cred] = await dbConn.select().from(emailCredentials).where(eq(emailCredentials.email, email));
      if (!cred) throw new TRPCError({ code: "NOT_FOUND", message: "No account found with that email." });

      // Send 2FA code
      const code = generate6DigitCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // @ts-ignore
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
    .mutation(async ({ input, ctx }: { input: any; ctx: any }) => {
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

      // @ts-ignore
      await dbConn.update(twoFactorCodes).set({ used: true }).where(eq(twoFactorCodes.id, record.id));

      const [user] = await dbConn.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      // Update last signed in
      // @ts-ignore
      await dbConn.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

      const token = user.openId + '_' + Date.now();
      ctx.res.cookie(COOKIE_NAME, token, { httpOnly: true, maxAge: ONE_YEAR_MS });

      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }),

  // Resend code (for both login and register)
  resendCode: publicProcedure
    .input(z.object({ userId: z.number(), type: z.enum(["login", "register", "reset"]) }))
    .mutation(async ({ input }: { input: any }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [user] = await dbConn.select().from(users).where(eq(users.id, input.userId)).limit(1);
      if (!user || !user.email) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      const code = generate6DigitCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // @ts-ignore
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
    .mutation(async ({ input }: { input: any }) => {
      const email = input.email.toLowerCase().trim();
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable." });

      const [cred] = await dbConn
        .select()
        .from(emailCredentials)
        .where(eq(emailCredentials.email, email));
    }),
};

