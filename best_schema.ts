import {
  int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json
} from "drizzle-orm/mysql-core";

// ─── USERS ────────────────────────────────────────────────────────────────────
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

// ─── USER PROFILES ────────────────────────────────────────────────────────────
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 100 }),
  age: int("age"),
  city: varchar("city", { length: 100 }),
  bio: text("bio"),
  businessInfo: text("businessInfo"),
  avatarUrl: text("avatarUrl"),
  tier: mysqlEnum("tier", ["silver", "gold", "enterprise"]).default("silver").notNull(),
  profileComplete: boolean("profileComplete").default(false).notNull(),
  onboardingComplete: boolean("onboardingComplete").default(false).notNull(),
  consentPdfUrl: text("consentPdfUrl"),
  consentRecordedAt: timestamp("consentRecordedAt"),
  isSubscriber: boolean("isSubscriber").default(false).notNull(),
  subscribedAt: timestamp("subscribedAt"),
  subscriptionRenewalAt: timestamp("subscriptionRenewalAt"),
  monthlyFee: decimal("monthlyFee", { precision: 10, scale: 2 }).default("29.99").notNull(),
  balanceTotal: decimal("balanceTotal", { precision: 12, scale: 2 }).default("0.00").notNull(),
  balanceToday: decimal("balanceToday", { precision: 12, scale: 2 }).default("0.00").notNull(),
  advancedAccessBalance: decimal("advancedAccessBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;

// ─── SOCIAL POSTS ─────────────────────────────────────────────────────────────
export const socialPosts = mysqlTable("social_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  avatarUrl: text("avatarUrl"),
  tier: mysqlEnum("tier", ["silver", "gold", "enterprise"]).default("silver").notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  likeCount: int("likeCount").default(0).notNull(),
  commentCount: int("commentCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialPost = typeof socialPosts.$inferSelect;

// ─── POST COMMENTS ────────────────────────────────────────────────────────────
export const postComments = mysqlTable("post_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  avatarUrl: text("avatarUrl"),
  tier: mysqlEnum("tier", ["silver", "gold", "enterprise"]).default("silver").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── POST LIKES ───────────────────────────────────────────────────────────────
export const postLikes = mysqlTable("post_likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── LIVE MESSAGES ────────────────────────────────────────────────────────────
export const liveMessages = mysqlTable("live_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  avatarUrl: text("avatarUrl"),
  tier: mysqlEnum("tier", ["silver", "gold", "enterprise"]).default("silver").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AFFILIATE PRODUCTS (VAULT) ───────────────────────────────────────────────
export const affiliateProducts = mysqlTable("affiliate_products", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  description: text("description"),
  badge: varchar("badge", { length: 50 }),
  affiliateUrl: text("affiliateUrl").notNull(),
  imageUrl: text("imageUrl"),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("8.00").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AFFILIATE CLICKS ─────────────────────────────────────────────────────────
export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── WALLET TRANSACTIONS ──────────────────────────────────────────────────────
export const walletTransactions = mysqlTable("wallet_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["credit", "debit", "advanced_access", "repayment"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── REAL ESTATE LISTINGS ─────────────────────────────────────────────────────
export const realEstateListings = mysqlTable("real_estate_listings", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["assignment", "airbnb"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  askingPrice: decimal("askingPrice", { precision: 12, scale: 2 }),
  assignmentFee: decimal("assignmentFee", { precision: 12, scale: 2 }),
  monthlyRevenue: decimal("monthlyRevenue", { precision: 12, scale: 2 }),
  description: text("description"),
  status: mysqlEnum("status", ["available", "under_contract", "closed"]).default("available").notNull(),
  submittedBy: int("submittedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── FINANCIAL TRANSACTIONS (ADMIN) ──────────────────────────────────────────
export const financialTransactions = mysqlTable("financial_transactions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["bot_revenue", "tax_deduction", "member_payout", "surplus_transfer", "business_withdrawal"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  category: mysqlEnum("category", ["lock", "feature", "finance", "content"]).default("feature").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
