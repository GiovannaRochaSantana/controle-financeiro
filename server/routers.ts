import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Digite um email válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2, "Digite seu nome."),
});

const transactionInputSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().trim().min(1).max(180),
  category: z.string().trim().min(1).max(80),
  amount: z.number().positive().max(100000000),
});

const depositInputSchema = z.object({
  amount: z.number().positive().max(100000000),
});

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}

function emailOpenId(email: string) {
  return `email_${createHash("sha256").update(email).digest("hex").slice(0, 58)}`;
}

function publicUser(user: NonNullable<Awaited<ReturnType<typeof db.getUserByEmail>>>) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    register: publicProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
      const existing = await db.getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Este email já está cadastrado." });
      }

      const user = await db.createEmailUser({
        openId: emailOpenId(input.email),
        email: input.email,
        name: input.name,
        passwordHash: hashPassword(input.password),
      });
      const token = await sdk.createSessionToken(user.openId, { name: user.name ?? input.email });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return publicUser(user);
    }),
    login: publicProcedure.input(credentialsSchema).mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email);
      if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha incorretos." });
      }

      const token = await sdk.createSessionToken(user.openId, { name: user.name ?? input.email });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return publicUser(user);
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  transactions: router({
    list: protectedProcedure.query(({ ctx }) => db.getTransactionsByUser(ctx.user.id)),
    create: protectedProcedure.input(transactionInputSchema).mutation(({ input, ctx }) => db.createTransaction({
      userId: ctx.user.id,
      type: input.type,
      description: input.description,
      category: input.category,
      amountCents: Math.round(input.amount * 100),
    })),
  }),
  savings: router({
    goal: protectedProcedure.query(({ ctx }) => db.getOrCreateSavingsGoal(ctx.user.id)),
    deposit: protectedProcedure.input(depositInputSchema).mutation(async ({ input, ctx }) => {
      const goal = await db.getOrCreateSavingsGoal(ctx.user.id);
      return db.addSavingsDeposit({
        userId: ctx.user.id,
        goalId: goal.id,
        amountCents: Math.round(input.amount * 100),
      });
    }),
  }),
});

export type AppRouter = typeof appRouter;
