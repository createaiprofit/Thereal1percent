import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { botEngineRouter } from "./botEngine";
import { warRoomRouter } from "./warRoomRouter";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ";

const BOT_AVATARS = [
  `${CDN}/avatar_nyc_78f71499.png`,
  `${CDN}/avatar_la_hollywood_fbc34862.png`,
  `${CDN}/avatar_atlanta_e73cfc94.png`,
  `${CDN}/avatar_la_reina_v2-RQAaqhU5NiDB29qXHwdR9L.webp`,
  `${CDN}/avatar_fox_blonde_v2-MezpQqZSy4NzKAtZPG6X9h.webp`,
  `${CDN}/airria_rabbit_black_final_32f7d785.jpg`,
];

const BOT_NAMES_F = [
  "Jade Voss","Mia Sterling","Zara Fontaine","Leila Cruz","Nia Blackwood",
  "Sofia Reyes","Camille Dumont","Priya Sharma","Aisha Monroe","Bianca Torres",
  "Yuki Tanaka","Fatima Al-Hassan","Valentina Ruiz","Chloe Mercer","Amara Osei",
  "Naomi Park","Isabella Greco","Deja Williams","Sasha Ivanova","Lena Müller",
];
const BOT_NAMES_M = [
  "Marcus Reid","Darius Cole","Ethan Vance","Kai Nakamura","Luca Ferretti",
  "Omar Khalil","Javier Morales","Theo Blackwell","Remy Dubois","Andre King",
  "Zion Carter","Malik Hassan","Finn O'Brien","Dante Rossi","Xavier Patel",
];

function makeBotHandle(name: string) {
  return "@" + name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
}

const POST_TEMPLATES = [
  { type: "WIN", content: "Just closed my 3rd Airbnb assignment this month 🔥 $4,200 in 48 hours. The system works if you work it. #1percentplayground #airbnb" },
  { type: "WIN", content: "Crypto flip came through. ETH position up 34% since last Tuesday. Took profits, moved to stables. Stay disciplined. 💎" },
  { type: "REAL_ESTATE", content: "Pro tip: Always run your Airbnb comps on AirDNA before you assign. Occupancy rate below 72%? Walk away. Above 85%? Run the numbers twice and close it. 🏠" },
  { type: "REAL_ESTATE", content: "Short-term rental assignment in Miami Beach. ARV $8,400/month. Assignment fee $1,200. Closed in 3 days. This is the play. 🌴" },
  { type: "CRYPTO", content: "BTC consolidating at key support. If you're not accumulating here you're going to be upset in 6 months. Not financial advice — just pattern recognition. 📈" },
  { type: "CRYPTO", content: "DeFi yield farming update: 14.2% APY on stablecoin pairs. Risk-adjusted this is the move while we wait for the next leg up. 🔐" },
  { type: "ACCOUNTABILITY", content: "Week 3 check-in: 2 assignments closed, 1 pending. Wallet up $6,800. Who else is tracking their numbers this week? Drop yours below 👇" },
  { type: "ACCOUNTABILITY", content: "Morning routine locked in. 5am wake up, market check, assignment review, gym. By 9am I've done more than most do all day. 💪 Tag someone who needs to hear this." },
  { type: "COMMUNITY", content: "Shoutout to @jade.voss for helping me understand the assignment contract structure. This community is different. Real people, real results. ❤️" },
  { type: "COMMUNITY", content: "3 months in the 1% Playground and I've made more connections than in 5 years of networking events. The caliber of people in here is unmatched. 🙌" },
  { type: "WIN", content: "Enterprise tier is built different. The resources, the connections, the access — worth every penny. Just hit $12K this month. 🏆" },
  { type: "REAL_ESTATE", content: "Airbnb arbitrage 101: Find a landlord willing to sublet, furnish it right, list it, and collect the spread. No ownership required. Game changer. 🔑" },
  { type: "CRYPTO", content: "Portfolio allocation update: 40% BTC, 30% ETH, 20% alts, 10% cash. Boring? Maybe. Profitable? Consistently. 📊" },
  { type: "WIN", content: "Just got my platinum badge. 6 months of consistent work. The compound effect is real — don't quit before the magic happens. ✨" },
  { type: "COMMUNITY", content: "Anyone else notice how different the energy is in here vs other groups? No noise, no drama — just people building. This is what I needed. 🎯" },
];

function generateFeedPosts(count: number, cursor = 0) {
  const posts = [];
  for (let i = cursor; i < cursor + count; i++) {
    const template = POST_TEMPLATES[i % POST_TEMPLATES.length];
    const isFemale = i % 3 !== 0;
    const nameList = isFemale ? BOT_NAMES_F : BOT_NAMES_M;
    const name = nameList[i % nameList.length];
    const avatar = BOT_AVATARS[i % BOT_AVATARS.length];
    const minsAgo = Math.floor(Math.random() * 120) + 1;
    posts.push({
      id: `post_${i}`,
      authorName: name,
      authorHandle: makeBotHandle(name),
      authorAvatar: avatar,
      authorTier: "platinum" as const,
      isBot: true,
      content: template.content,
      type: template.type,
      likes: Math.floor(Math.random() * 340) + 12,
      comments: Math.floor(Math.random() * 48) + 2,
      shares: Math.floor(Math.random() * 22) + 1,
      liked: false,
      timestamp: new Date(Date.now() - minsAgo * 60 * 1000).toISOString(),
      tags: ["1percentplayground", "enterprise"],
    });
  }
  return posts;
}

// ─── VAULT CATALOG ────────────────────────────────────────────────────────────

const VAULT_PRODUCTS = [
  {
    id: "v001", category: "suits",
    name: "Brioni Vanquish II Bespoke Suit",
    price: 5800, originalPrice: 7200,
    description: "Hand-stitched in Penne, Italy. 100% Vicuña wool. The suit that closes deals before you speak.",
    image: `${CDN}/vault_suit_brioni.jpg`,
    affiliateUrl: "https://www.brioni.com/en-us/suits",
    badge: "BESTSELLER",
  },
  {
    id: "v002", category: "watches",
    name: "Patek Philippe Nautilus 5711",
    price: 32000, originalPrice: 35000,
    description: "The watch that speaks before you do. Stainless steel, blue dial, bracelet. Eternal value.",
    image: `${CDN}/vault_watch_patek.jpg`,
    affiliateUrl: "https://www.patek.com/en/collection/nautilus",
    badge: "RARE",
  },
  {
    id: "v003", category: "ties",
    name: "Charvet Silk Grenadine Tie",
    price: 495, originalPrice: 495,
    description: "Handwoven in Lyon. The tie worn by heads of state. Seven-fold construction, pure silk.",
    image: `${CDN}/vault_tie_charvet.jpg`,
    affiliateUrl: "https://www.charvet.com",
    badge: null,
  },
  {
    id: "v004", category: "cigars",
    name: "Cohiba Behike BHK 56 Box of 10",
    price: 220, originalPrice: 250,
    description: "The pinnacle of Cuban craftsmanship. Aged 5 years minimum. Reserved for those who've earned it.",
    image: `${CDN}/vault_cigar_cohiba.jpg`,
    affiliateUrl: "https://www.cohibacigar.com",
    badge: "EXCLUSIVE",
  },
  {
    id: "v005", category: "suits",
    name: "Tom Ford O'Connor Suit",
    price: 4200, originalPrice: 4200,
    description: "Slim silhouette, peak lapel. The uniform of power. Available in midnight navy and charcoal.",
    image: `${CDN}/vault_suit_tomford.jpg`,
    affiliateUrl: "https://www.tomford.com/suits",
    badge: null,
  },
  {
    id: "v006", category: "watches",
    name: "Audemars Piguet Royal Oak 15500",
    price: 28500, originalPrice: 31000,
    description: "The original luxury sports watch. Octagonal bezel, integrated bracelet. Iconic since 1972.",
    image: `${CDN}/vault_watch_ap.jpg`,
    affiliateUrl: "https://www.audemarspiguet.com",
    badge: "ICONIC",
  },
  {
    id: "v007", category: "accessories",
    name: "Hermès Birkin 30 Togo Leather",
    price: 12500, originalPrice: 12500,
    description: "The ultimate status symbol. Hand-stitched by a single artisan. Investment-grade luxury.",
    image: `${CDN}/vault_hermes_birkin.jpg`,
    affiliateUrl: "https://www.hermes.com",
    badge: "INVESTMENT",
  },
  {
    id: "v008", category: "cigars",
    name: "Arturo Fuente Opus X BBMF",
    price: 185, originalPrice: 185,
    description: "The rarest Dominican cigar. Full-bodied, complex, and nearly impossible to find. Celebrate your wins right.",
    image: `${CDN}/vault_cigar_opusx.jpg`,
    affiliateUrl: "https://www.arturofuente.com",
    badge: "LIMITED",
  },
];

// ─── BOT ROSTER ───────────────────────────────────────────────────────────────

function generateBotRoster(count: number) {
  const roster = [];
  for (let i = 0; i < count; i++) {
    const isFemale = i < 700;
    const nameList = isFemale ? BOT_NAMES_F : BOT_NAMES_M;
    const name = nameList[i % nameList.length];
    roster.push({
      id: `bot_${i + 1}`,
      name,
      handle: makeBotHandle(name),
      avatar: BOT_AVATARS[i % BOT_AVATARS.length],
      tier: "enterprise" as const,
      active: true,
      isActive: true,
      postsToday: Math.floor(Math.random() * 8) + 1,
      likesToday: Math.floor(Math.random() * 40) + 5,
      commentsToday: Math.floor(Math.random() * 20) + 2,
      lastAction: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    });
  }
  return roster;
}

const BOT_ROSTER = generateBotRoster(1000);

// ─── ROUTERS ──────────────────────────────────────────────────────────────────

const socialRouter = router({
  getFeed: publicProcedure
    .input(z.object({ cursor: z.number().default(0), limit: z.number().default(20), tab: z.string().default("foryou") }))
    .query(({ input }) => {
      const posts = generateFeedPosts(input.limit, input.cursor);
      return { posts, items: posts, nextCursor: input.cursor + input.limit };
    }),

  getPublicPreview: publicProcedure
    .input(z.object({ limit: z.number().default(18) }))
    .query(({ input }) => {
      // Public Live Feed preview — 15-20 posts for website visitors
      const posts = generateFeedPosts(input.limit, Math.floor(Math.random() * 50));
      return { posts, refreshedAt: new Date().toISOString() };
    }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(() => ({ success: true })),

  addComment: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(({ input }) => ({
      id: `comment_${Date.now()}`,
      postId: input.postId,
      content: input.content,
      authorName: "You",
      authorHandle: "@you",
      authorAvatar: "",
      authorTier: "silver" as const,
      timestamp: new Date().toISOString(),
    })),

  getListings: publicProcedure.query(() => [
    { id: "l1", title: "Airbnb Assignment — Miami Beach", price: 1200, category: "real_estate", seller: "Jade Voss", image: "" },
    { id: "l2", title: "Crypto Signal Pack — Q2 2025", price: 49, category: "crypto", seller: "Marcus Reid", image: "" },
    { id: "l3", title: "Dropship Store Setup", price: 299, category: "business", seller: "Mia Sterling", image: "" },
  ]),

  placeBid: protectedProcedure
    .input(z.object({ listingId: z.string(), amount: z.number() }))
    .mutation(() => ({ success: true })),

  getWallet: protectedProcedure.query(() => ({
    spendable: 1240.00,
    locked: 3720.00,
    total: 4960.00,
    transactions: [
      { id: "tx1", type: "CREDIT", amount: 125.00, description: "Daily earnings share", date: new Date(Date.now() - 86400000).toISOString() },
      { id: "tx2", type: "CREDIT", amount: 98.50, description: "Referral bonus", date: new Date(Date.now() - 172800000).toISOString() },
    ],
  })),

  getEvents: publicProcedure.query(() => [
    { id: "ev1", title: "Airbnb Assignment Masterclass", date: new Date(Date.now() + 86400000 * 3).toISOString(), location: "Zoom", type: "webinar", description: "Learn how to close 3 assignments in 30 days.", host: "The Don", spots: 50 },
    { id: "ev2", title: "Crypto Portfolio Review", date: new Date(Date.now() + 86400000 * 7).toISOString(), location: "Discord", type: "live", description: "Live Q&A on portfolio allocation for Q2.", host: "The Broker", spots: 100 },
    { id: "ev3", title: "1% Playground Monthly Meetup", date: new Date(Date.now() + 86400000 * 14).toISOString(), location: "Miami, FL", type: "in-person", description: "Network with top earners in the community.", host: "Aria Rabbit", spots: 30 },
  ]),

  checkSubscription: protectedProcedure.query(() => ({
    isSubscribed: true,
    plan: "enterprise",
    trialDaysLeft: 0,
  })),
});

const walletRouter = router({
  balance: protectedProcedure.query(() => ({
    balance: 4960.00,
    spendable: 1240.00,
    locked: 3720.00,
    advancedAccessAvailable: 620.00,
    tier: "enterprise",
    tierLabel: "Enterprise",
    isSubscriber: true,
    monthlyFee: "$97",
  })),
  subscribe: protectedProcedure
    .input(z.object({ plan: z.string().optional() }))
    .mutation(() => ({ success: true, message: "Subscribed successfully" })),

  history: protectedProcedure.query(() => [
    { id: "t1", type: "CREDIT", amount: 125.00, description: "Daily earnings share — Enterprise tier", date: new Date(Date.now() - 86400000).toISOString() },
    { id: "t2", type: "CREDIT", amount: 98.50, description: "Referral bonus — new member signup", date: new Date(Date.now() - 172800000).toISOString() },
    { id: "t3", type: "CREDIT", amount: 210.00, description: "Daily earnings share — Enterprise tier", date: new Date(Date.now() - 259200000).toISOString() },
    { id: "t4", type: "ADVANCED_ACCESS", amount: -200.00, description: "Advanced Access draw — auto-repay in 4 days", date: new Date(Date.now() - 345600000).toISOString() },
    { id: "t5", type: "CREDIT", amount: 175.00, description: "Daily earnings share — Enterprise tier", date: new Date(Date.now() - 432000000).toISOString() },
  ]),
});

const vaultRouter = router({
  getProducts: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(({ input }) => {
      if (input.category && input.category !== "all") {
        return VAULT_PRODUCTS.filter(p => p.category === input.category);
      }
      return VAULT_PRODUCTS;
    }),

  trackClick: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(({ input }) => {
      const product = VAULT_PRODUCTS.find(p => p.id === input.productId);
      return { success: true, url: product?.affiliateUrl ?? "#" };
    }),
});

const profileRouter = router({
  get: protectedProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    name: ctx.user.name ?? "Member",
    displayName: ctx.user.name ?? "Member",
    handle: "@" + (ctx.user.name ?? "member").toLowerCase().replace(/\s+/g, "."),
    avatar: "",
    avatarUrl: "",
    tier: "enterprise",
    tierLabel: "Enterprise",
    bio: "Building wealth through real estate assignments and smart crypto plays.",
    city: "Global",
    joinDate: ctx.user.createdAt?.toISOString() ?? new Date().toISOString(),
    postsCount: 47,
    followersCount: 312,
    followingCount: 89,
    walletBalance: 4960.00,
    earningsThisMonth: 1240.00,
    balanceTotal: 4960.00,
    balanceToday: 1240.00,
    isSubscriber: true,
    monthlyFee: "$97",
  })),

  upsert: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      displayName: z.string().optional(),
      bio: z.string().optional(),
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      city: z.string().optional(),
      age: z.number().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(() => ({ success: true })),

  uploadAvatar: protectedProcedure
    .input(z.object({ base64: z.string() }))
    .mutation(() => ({ url: "" })),

  saveConsent: protectedProcedure
    .input(z.object({ consentAudio: z.string().optional(), agreedAt: z.string() }))
    .mutation(() => ({ success: true })),
});

const botEngineRouter = router({
  stats: protectedProcedure.query(() => ({
    actionsToday: 8420,
    queueDepth: 342,
    activeBots: 987,
    totalBots: 1000,
    postsToday: 2140,
    likesToday: 18600,
    commentsToday: 7300,
    lastCycleAt: new Date(Date.now() - 900000).toISOString(),
    isRunning: true,
  })),

  roster: protectedProcedure
    .input(z.object({ page: z.number().default(0), limit: z.number().default(50) }))
    .query(({ input }) => {
      const start = input.page * input.limit;
      return {
        bots: BOT_ROSTER.slice(start, start + input.limit),
        total: BOT_ROSTER.length,
      };
    }),

  toggleBot: protectedProcedure
    .input(z.object({ botId: z.string(), active: z.boolean() }))
    .mutation(() => ({ success: true })),

  seedQueue: protectedProcedure
    .input(z.object({ count: z.number().default(50) }))
    .mutation(({ input }) => ({
      success: true,
      seeded: input.count,
      message: `Seeded ${input.count} posts into the queue.`,
    })),

  runEngagementCycle: protectedProcedure.mutation(() => ({
    success: true,
    actionsQueued: 1240,
    message: "Engagement cycle launched. 1,240 actions queued across 987 active bots.",
  })),

  launchBlitz: protectedProcedure
    .input(z.object({ duration: z.number().default(60) }))
    .mutation(({ input }) => ({
      success: true,
      message: `Blitz launched for ${input.duration} minutes. All 1,000 bots are firing.`,
      estimatedActions: input.duration * 180,
    })),

  sendAllPending: protectedProcedure.mutation(() => ({
    success: true,
    sent: 342,
    message: "All 342 pending posts dispatched.",
  })),

  setManualMode: protectedProcedure
    .input(z.object({ manual: z.boolean() }))
    .mutation(({ input }) => ({
      success: true,
      mode: input.manual ? "manual" : "auto",
    })),

  recentLog: protectedProcedure.query(() => [
    { action: "Posted", botName: "Jade Voss", ts: Date.now() - 120000 },
    { action: "Liked", botName: "Marcus Reid", ts: Date.now() - 240000 },
    { action: "Commented", botName: "Mia Sterling", ts: Date.now() - 360000 },
  ]),
  runPostJob: protectedProcedure.mutation(() => ({ success: true, published: 12, queueDepthRemaining: 330 })),
  runCycle: protectedProcedure.mutation(() => ({ success: true, actionsQueued: 1240, message: "Cycle complete." })),
  blitzStatus: protectedProcedure.query(() => ({
    fired: 420,
    pending: 580,
    nextPostAt: new Date(Date.now() + 120000).toISOString(),
  })),
  recentActivity: protectedProcedure.query(() => [
    { id: "a1", botName: "Jade Voss", action: "Posted", detail: "Closed 3rd Airbnb assignment this month 🔥", timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: "a2", botName: "Marcus Reid", action: "Liked", detail: "Liked 12 posts in the last 5 minutes", timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: "a3", botName: "Mia Sterling", action: "Commented", detail: "Replied to @darius.cole's real estate tip", timestamp: new Date(Date.now() - 360000).toISOString() },
    { id: "a4", botName: "Zara Fontaine", action: "DM", detail: "Sent welcome DM to new member @user_4821", timestamp: new Date(Date.now() - 480000).toISOString() },
    { id: "a5", botName: "Ethan Vance", action: "Posted", detail: "BTC consolidating at key support 📈", timestamp: new Date(Date.now() - 600000).toISOString() },
  ]),
});

const warRoomRouter = router({
  alerts: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().default(false), limit: z.number().default(50) }))
      .query(() => [
        { id: "al1", severity: "info", title: "Bot Engine Running", message: "All 987 active bots are operating normally.", read: false, createdAt: new Date(Date.now() - 300000).toISOString() },
        { id: "al2", severity: "warning", title: "Queue Depth High", message: "Post queue has 342 items. Consider running Send All Pending.", read: false, createdAt: new Date(Date.now() - 900000).toISOString() },
        { id: "al3", severity: "info", title: "New Member Signup", message: "3 new members joined in the last hour.", read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
      ]),

    markRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(() => ({ success: true })),

    markAllRead: protectedProcedure.mutation(() => ({ success: true })),
  }),

  finance: protectedProcedure.query(() => ({
    grossRevenue: 48200,
    taxes: 9640,
    memberPayouts: 14460,
    surplus: 9640,
    businessChecking: 14460,
    appStabilityReserve: 24100,
    period: "April 2025",
  })),

  postScheduler: router({
    list: protectedProcedure.query(() => [
      { id: "ps1", botGroup: "host", scheduledAt: new Date(Date.now() + 1800000).toISOString(), status: "pending", content: "Machiavelli quote drop — affiliate CTA" },
      { id: "ps2", botGroup: "member", scheduledAt: new Date(Date.now() + 3600000).toISOString(), status: "pending", content: "Real estate tip — Airbnb assignment" },
    ]),
    create: protectedProcedure
      .input(z.object({ botGroup: z.string(), scheduledAt: z.string(), content: z.string() }))
      .mutation(() => ({ success: true })),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(() => ({ success: true })),
  }),

  coldCall: router({
    list: protectedProcedure.query(() => [
      { id: "cc1", name: "John Martinez", phone: "+1 (555) 012-3456", status: "pending", assignedBot: "The Bridge", notes: "Interested in real estate assignments" },
      { id: "cc2", name: "Sarah Thompson", phone: "+1 (555) 098-7654", status: "called", assignedBot: "The Shadow", notes: "Callback requested for Thursday" },
    ]),
    updateStatus: protectedProcedure
      .input(z.object({ id: z.string(), status: z.string() }))
      .mutation(() => ({ success: true })),
  }),
});

const LIVE_MESSAGES: { id: string; userId: string; name: string; displayName: string; avatar: string; avatarUrl: string; tier: string; message: string; ts: number }[] = [];
const liveRouter = router({
  getMessages: publicProcedure.query(() => LIVE_MESSAGES.slice(-50)),
  sendMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1).max(300) }))
    .mutation(({ ctx, input }) => {
      const msg = { id: String(Date.now()), userId: String(ctx.user.id), name: ctx.user.name ?? "Member", displayName: ctx.user.name ?? "Member", avatar: "", avatarUrl: "", tier: "enterprise", message: input.message, ts: Date.now() };
      LIVE_MESSAGES.push(msg);
      if (LIVE_MESSAGES.length > 200) LIVE_MESSAGES.splice(0, LIVE_MESSAGES.length - 200);
      return msg;
    }),
  clearMessages: protectedProcedure.mutation(() => { LIVE_MESSAGES.length = 0; return { success: true }; }),
  getStreams: publicProcedure.query(() => ({
    isLive: false,
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    viewerCount: 0,
    upcomingEvents: [
      { id: "e1", title: "Machiavelli Market Analysis — Live with The Hammer", scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(), host: "The Hammer" },
      { id: "e2", title: "Airbnb Assignment Masterclass", scheduledAt: new Date(Date.now() + 86400000 * 7).toISOString(), host: "Aria Rabbit" },
    ],
  })),
});

// ─── APP ROUTER ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  social: socialRouter,
  wallet: walletRouter,
  vault: vaultRouter,
  profile: profileRouter,
  botEngine: botEngineRouter,
  warRoom: warRoomRouter,
  live: liveRouter,
});

export type AppRouter = typeof appRouter;
