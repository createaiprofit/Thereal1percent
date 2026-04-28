      scheduledAt: new Date(now + i * 2 * 60_000), // stagger 2 min apart
      posted: false,
    }));
    for (let i = 0; i < items.length; i += 100) {
      await db.insert(botPostQueue).values(items.slice(i, i + 100));
    }
    console.log(`[Autopilot] 👾 Avatar wave seeded: ${items.length} Machiavelli posts queued.`);
  } catch (err) {
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
    const items = bots.map((bot, i) => ({
      botId: bot.id,
      caption: RE_CAPTIONS[i % RE_CAPTIONS.length],
      mediaUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      mediaType: "image" as const,
      scheduledAt: new Date(now + i * 90_000),
      posted: false,
    }));
    for (let i = 0; i < items.length; i += 100) {
      await db.insert(botPostQueue).values(items.slice(i, i + 100));
    }
    console.log(`[Autopilot] 🏠 Real-estate wave seeded: ${items.length} cold-call posts queued.`);
  } catch (err) {
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
  runPostJob();

  // Publish due posts every 5 minutes
  setInterval(runPostJob, PUBLISH_MS);

  // Hourly: fresh Machiavelli wave for all 21 avatar bots
  setInterval(seedAvatarWave, HOURLY_MS);

  // Every 30 min: refresh real-estate cold-call queue
  setInterval(seedRealEstateWave, REALSTATE_MS);
}
