import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertTransaction, InsertUser, savingsDeposits, savingsGoals, transactions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not configured");
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function createEmailUser(input: {
  openId: string;
  email: string;
  name: string;
  passwordHash: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not configured");
  }

  const [created] = await db.insert(users).values({
    openId: input.openId,
    email: input.email,
    name: input.name,
    passwordHash: input.passwordHash,
    loginMethod: "email",
  }).$returningId();

  return getUserByOpenId(input.openId).then((user) => {
    if (!user || !created) throw new Error("User could not be created");
    return user;
  });
}

export async function getTransactionsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.transactionDate), desc(transactions.createdAt));
}

export async function createTransaction(input: Omit<InsertTransaction, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const [created] = await db.insert(transactions).values(input).$returningId();
  if (!created) throw new Error("Transaction could not be created");
  const result = await db.select().from(transactions).where(eq(transactions.id, created.id)).limit(1);
  return result[0];
}

export async function getOrCreateSavingsGoal(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  let [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId)).limit(1);
  if (!goal) {
    await db.insert(savingsGoals).values({ userId });
    [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId)).limit(1);
  }
  if (!goal) throw new Error("Savings goal could not be created");
  return goal;
}

export async function addSavingsDeposit(input: { userId: number; goalId: number; amountCents: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const [goal] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, input.goalId)).limit(1);
  if (!goal || goal.userId !== input.userId) throw new Error("Savings goal not found");
  const [created] = await db.insert(savingsDeposits).values(input).$returningId();
  await db.update(savingsGoals).set({ currentAmountCents: goal.currentAmountCents + input.amountCents }).where(eq(savingsGoals.id, input.goalId));
  if (!created) throw new Error("Savings deposit could not be created");
  return getOrCreateSavingsGoal(input.userId);
}
