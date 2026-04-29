import { getDb } from "./db";
import { botAccounts, botPostQueue } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { RE_CAPTIONS } from "./botEngine";

let autopilotRunning = false;
const PUBLISH_MS   = 5  * 60 * 1000;
const HOURLY_MS    = 60 * 60 * 1000;
const REALSTATE_MS = 30 * 60 * 1000;

const MACHIAVELLI_CAPTIONS = [
  "Power is not given. It is taken.",
  "The one percent move in silence.",
  "Build systems, not excuses.",
  "Leverage is the only language money speaks.",
  "Stack silent. Move loud.",
  "Discipline is the bridge between goals and accomplishment.",
  "Your network is your net worth.",
  "Automate everything. Own your time.",
  "The market rewards the prepared.",
  "21 million men. One mission. Freedom.",
];

async function seedAvatarWave() {
  try {
    const db = await getDb();
    if (!db) return;
    const bots = await db.select({ id: botAccounts.id }).from(botAccounts)
      .where(eq(botAccounts.active, true)).orderBy(sql`RAND()`).limit(100);
    if (!bots.length) return;
    const now = Date.now();
    const items = bots.map((bot: any, i: number) => ({
      botId: bot.id,
      caption: MACHIAVELLI_CAPTIONS[i % MACHIAVELLI_CAPTIONS.length],
      mediaUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      mediaType: "image" as const,
      scheduledAt: new Date(now + i * 2 * 60_000),
      posted: false,
    }));
    for (let i = 0; i < items.length; i += 100) {
      await db.insert(botPostQueue).values(items.slice(i, i + 100));
    }
    console.log(`[Autopilot] 👾 Avatar wave seeded: ${items.length} Machiavelli posts queued.`);
  } catch (err: any) {
    console.error("[Autopilot] Avatar wave error:", err);
  }
}

// Seed real-estate cold-call posts
async function seedRealEstateWave() {
  try {
    const db = await getDb();
    if (!db) return;
    const bots = await db.select({ id: botAccounts.id }).from(botAccounts).where(eq(botAccounts.active, true)).orderBy(sql`RAND()`).limit(50);
    if (!bots.length) return;
    const now = Date.now();
    const items = bots.map((bot: any, i: number) => ({
      mediaType: "image" as const,
      scheduledAt: new Date(now + i * 90_000),
      posted: false,
    }));
    for (let i = 0; i < items.length; i += 100) {
      await db.insert(botPostQueue).values(items.slice(i, i + 100));
    }
    console.log(`[Autopilot] 🏠 Real-estate wave seeded: ${items.length} cold-call posts queued.`);
  } catch (err: any) {
    console.error("[Autopilot] Real-estate wave error:", err);
  }
}

export function startAutopilot() {
  if (autopilotRunning) return;
  autopilotRunning = true;

  console.log("[Autopilot] 🚀 LAUNCHED — 21 avatar bots hourly + real-estate 30min + publisher 5min.");

  // IMMEDIATE: seed first wave right now
  seedAvatarWave();
  seedRealEstateWave();

  // Publish due posts every 5 minutes
  setInterval(publishDuePosts, PUBLISH_MS);

  // Hourly: fresh Machiavelli wave for all 21 avatar bots
  setInterval(seedAvatarWave, HOURLY_MS);

  // Every 30 min: refresh real-estate cold-call queue
  setInterval(seedRealEstateWave, REALSTATE_MS);
}
