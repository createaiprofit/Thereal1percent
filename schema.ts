import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// War Room PIN storage
export const warRoomSettings = mysqlTable("war_room_settings", {
  id: int("id").autoincrement().primaryKey(),
  pinHash: varchar("pinHash", { length: 256 }).notNull(),
  adminEmail: varchar("adminEmail", { length: 320 }).notNull().default("ernest@createaiprofit.com"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// PIN reset tokens (one-time use, expire after 15 min)
export const pinResetTokens = mysqlTable("pin_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  used: int("used").default(0).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WarRoomSettings = typeof warRoomSettings.$inferSelect;
export type PinResetToken = typeof pinResetTokens.$inferSelect;

// ─── DEALS ────────────────────────────────────────────────────────────────────
export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  propertyAddress: varchar("propertyAddress", { length: 500 }).notNull(),
  ownerName: varchar("ownerName", { length: 200 }),
  ownerPhone: varchar("ownerPhone", { length: 30 }),
  stage: mysqlEnum("stage", ["cold", "pitched", "negotiating", "assigned", "closed", "lost"]).default("cold").notNull(),
  assignedBotName: varchar("assignedBotName", { length: 100 }),
  feeProjected: decimal("feeProjected", { precision: 12, scale: 2 }),
  feeCollected: decimal("feeCollected", { precision: 12, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Deal = typeof deals.$inferSelect;

// ─── CALL LOGS ────────────────────────────────────────────────────────────────
export const callLogs = mysqlTable("call_logs", {
  id: int("id").autoincrement().primaryKey(),
  botName: varchar("botName", { length: 100 }).notNull(),
  botVoice: varchar("botVoice", { length: 100 }),
  toNumber: varchar("toNumber", { length: 30 }).notNull(),
  fromNumber: varchar("fromNumber", { length: 30 }),
  twilioSid: varchar("twilioSid", { length: 64 }),
  outcome: mysqlEnum("outcome", ["connected", "voicemail", "no_answer", "interested", "assigned", "rejected", "error"]).default("connected"),
  durationSeconds: int("durationSeconds"),
  scriptUsed: text("scriptUsed"),
  dealId: int("dealId"),
  calledAt: timestamp("calledAt").defaultNow().notNull(),
});
export type CallLog = typeof callLogs.$inferSelect;

// ─── WAR ROOM ALERTS ──────────────────────────────────────────────────────────
export const warRoomAlerts = mysqlTable("war_room_alerts", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["deal_milestone", "bot_low", "fee_collected", "finance_approved", "system", "call_placed", "call_connected"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info").notNull(),
  read: boolean("read").default(false).notNull(),
  relatedDealId: int("relatedDealId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type WarRoomAlert = typeof warRoomAlerts.$inferSelect;

// ─── BOT PERFORMANCE ──────────────────────────────────────────────────────────
export const botPerformance = mysqlTable("bot_performance", {
  id: int("id").autoincrement().primaryKey(),
  botName: varchar("botName", { length: 100 }).notNull(),
  callsToday: int("callsToday").default(0).notNull(),
  callsWeek: int("callsWeek").default(0).notNull(),
  pitchedCount: int("pitchedCount").default(0).notNull(),
  assignedCount: int("assignedCount").default(0).notNull(),
  feesGenerated: decimal("feesGenerated", { precision: 12, scale: 2 }).default("0.00"),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0.00"),
  topMarket: varchar("topMarket", { length: 200 }),
  alertFlag: boolean("alertFlag").default(false).notNull(),
  snapshotDate: timestamp("snapshotDate").defaultNow().notNull(),
});
export type BotPerformance = typeof botPerformance.$inferSelect;
