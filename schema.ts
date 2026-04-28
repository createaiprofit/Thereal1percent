  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["deal_milestone", "bot_low", "fee_collected", "finance_approved", "system"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info").notNull(),
  read: boolean("read").default(false).notNull(),
  relatedDealId: int("relatedDealId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WarRoomAlert = typeof warRoomAlerts.$inferSelect;
export type InsertWarRoomAlert = typeof warRoomAlerts.$inferInsert;

// ─── BOT ENGAGEMENT ENGINE ───────────────────────────────────────────────────
// Tracks every bot engagement action: reply, like-back, comment-on-user, tag, boost
export const botEngagementLog = mysqlTable("bot_engagement_log", {
  id: int("id").autoincrement().primaryKey(),
  botId: int("botId").notNull(),
  actionType: mysqlEnum("actionType", [
    "reply_to_comment",   // bot replied to a user comment on any post
    "like_back",          // bot liked a user's post after user liked bot's post
    "comment_on_user",    // bot proactively commented on a real user's post
    "tag_user",           // bot tagged a user in a comment
    "boost_post",         // bot liked + commented on a post to boost it
    "follow_user",        // bot followed a user back
  ]).notNull(),
  targetUserId: int("targetUserId"),   // real user being engaged
  targetPostId: int("targetPostId"),   // post being engaged with
  targetCommentId: int("targetCommentId"), // comment being replied to
  body: text("body"),                  // the comment/reply text used
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type BotEngagementLog = typeof botEngagementLog.$inferSelect;
export type InsertBotEngagementLog = typeof botEngagementLog.$inferInsert;

// ─── SITE SETTINGS (admin-controlled locks, toggles, feature flags) ──────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),  // e.g. "lock_social", "lock_vault"
  value: text("value").notNull(),                            // JSON string or boolean string
  label: varchar("label", { length: 200 }),                 // human-readable label
  category: mysqlEnum("category", ["lock", "feature", "finance", "content"]).default("feature").notNull(),
  updatedBy: int("updatedBy"),                              // admin userId
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// ─── FINANCIAL TRANSACTIONS (admin ledger — business checking, payouts, tax) ──