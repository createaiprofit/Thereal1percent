import { useState, useEffect } from "react";
import { playVoice, stopVoice } from "@/lib/audioManager";
import { Link } from "wouter";

// ─── CDN ASSETS ───────────────────────────────────────────────────────────────
const WELLNESS_BOTS = [
  {
    id: "dr-max",
    name: "Dr. Max",
    gender: "male",
    tagline: "The Science Guy",
    outfits: {
      science: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_male_labcoat-oYBzDApeQmoveBBTXLNzjY.webp",
      coffee: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_male_robe-bmgrNumYQAW8AEybBnSJR7.webp",
      beauty: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_male_labcoat-oYBzDApeQmoveBBTXLNzjY.webp",
    },
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_wellness_male_a50bb829.wav",
    script: "Okay, real talk. I've been testing NMN for 90 days. Week six — brain fog gone, workouts different. The science is real. Hims charges $49. I found the same formula for $46.55. Link's right here.",
    currentProduct: "NMN 500mg",
    retailPrice: 49.00,
    ourPrice: 46.55,
    affiliateLink: "https://hims.com/nmn-affiliate",
    category: "science",
  },
  {
    id: "dr-luna",
    name: "Dr. Luna",
    gender: "female",
    tagline: "The Glow Expert",
    outfits: {
      science: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_female_labcoat-SD62QzaACTzDNVd5aiokk9.webp",
      coffee: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_female_robe-LLtB6A6RY2XGxRzMCvp34o.webp",
      beauty: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_bot_female_silk-fzWxE4z9WQe3Jp8tsazjRQ.webp",
    },
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_wellness_female_c4468dce.wav",
    script: "This is my skin three weeks ago — dry, dull. This is today. Bakuchiol serum. Sephora charges $68. I found the same active concentration for $64.60. Link below — ships fast.",
    currentProduct: "Bakuchiol Serum",
    retailPrice: 68.00,
    ourPrice: 64.60,
    affiliateLink: "https://foursigmatic.com/affiliate",
    category: "beauty",
  },
];

// ─── TRENDING PRODUCTS (simulated trend scanner) ──────────────────────────────
const TRENDING_PRODUCTS = [
  { name: "NMN 500mg", category: "science", retailer: "Hims", retailPrice: 49.00, trend: "🔥 #1 on TikTok", icon: "🧬" },
  { name: "Lion's Mane Mushroom Coffee", category: "coffee", retailer: "Four Sigmatic", retailPrice: 19.99, trend: "📈 +340% searches", icon: "☕" },
  { name: "Bakuchiol Serum", category: "beauty", retailer: "Sephora", retailPrice: 68.00, trend: "✨ Trending Reddit r/SkincareAddiction", icon: "💧" },
  { name: "Ashwagandha KSM-66", category: "science", retailer: "Hims", retailPrice: 39.00, trend: "🔥 #3 Wellness TikTok", icon: "🌿" },
  { name: "Collagen Peptides", category: "beauty", retailer: "Vital Proteins", retailPrice: 44.00, trend: "📈 +180% YouTube", icon: "✨" },
  { name: "Reishi Mushroom Blend", category: "coffee", retailer: "Four Sigmatic", retailPrice: 29.99, trend: "🌙 Sleep trend rising", icon: "🍄" },
  { name: "Creatine Monohydrate", category: "science", retailer: "Thorne", retailPrice: 34.00, trend: "💪 #2 Fitness TikTok", icon: "⚡" },
  { name: "Retinol Alternative Serum", category: "beauty", retailer: "Drunk Elephant", retailPrice: 88.00, trend: "🔥 Viral before/after", icon: "🌸" },
];

const OUTFIT_LABELS: Record<string, string> = {
  science: "🥼 Lab Coat — Science Mode",
  coffee: "☕ Cozy Robe — Coffee Mode",
  beauty: "✨ Silk Robe — Beauty Mode",
};

const CATEGORY_COLORS: Record<string, string> = {
  science: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  coffee: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  beauty: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

// ─── WELLNESS BOT CARD ────────────────────────────────────────────────────────
function WellnessBotCard({ bot }: { bot: typeof WELLNESS_BOTS[0] }) {
  const [playing, setPlaying] = useState(false);
  const [outfit, setOutfit] = useState<"science" | "coffee" | "beauty">(bot.category as "science" | "coffee" | "beauty");
  const ourPrice = (bot.retailPrice * 0.95).toFixed(2);
  const savings = (bot.retailPrice - parseFloat(ourPrice)).toFixed(2);

  const handlePlay = () => {
    if (playing) {
      stopVoice();
      setPlaying(false);
    } else {
      playVoice(bot.voice);
      setPlaying(true);
      // auto-reset after ~20 seconds
      setTimeout(() => setPlaying(false), 20000);
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      {/* Avatar */}
      <div style={{ position: "relative" }}>
        <img
          src={bot.outfits[outfit]}
          alt={bot.name}
          style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", top: "0.75rem", left: "0.75rem",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          borderRadius: "20px", padding: "0.25rem 0.75rem",
          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80",
        }}>
          🟢 LIVE
        </div>
        <button
          onClick={handlePlay}
          style={{
            position: "absolute", bottom: "0.75rem", right: "0.75rem",
            width: "44px", height: "44px", borderRadius: "50%",
            background: playing ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.9)",
            border: "none", cursor: "pointer", fontSize: "1.1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {playing ? "⏹" : "▶"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#fff", fontWeight: 600 }}>
              {bot.name}
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              {bot.tagline}
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded border ${CATEGORY_COLORS[outfit]}`} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em" }}>
            {outfit.toUpperCase()}
          </span>
        </div>

        {/* Outfit switcher */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {(["science", "coffee", "beauty"] as const).map(o => (
            <button
              key={o}
              onClick={() => setOutfit(o)}
              style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "0.3rem 0.6rem", borderRadius: "4px", cursor: "pointer",
                border: `1px solid ${outfit === o ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                background: outfit === o ? "rgba(255,255,255,0.1)" : "transparent",
                color: outfit === o ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
              }}
            >
              {o === "science" ? "🥼" : o === "coffee" ? "☕" : "✨"} {o}
            </button>
          ))}
        </div>

        {/* Current product */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: "8px",
          padding: "0.75rem", marginBottom: "0.75rem",
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.4rem" }}>
            Today's Product
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#fff", marginBottom: "0.4rem" }}>
            {bot.currentProduct}
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>
              ${bot.retailPrice.toFixed(2)} retail
            </span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem", color: "#4ade80", fontWeight: 700 }}>
              ${ourPrice} ours
            </span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", color: "#fbbf24" }}>
              Save ${savings}
            </span>
          </div>
        </div>

        {/* Script preview */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem",
          fontStyle: "italic", color: "rgba(255,255,255,0.5)",
          marginBottom: "1rem", lineHeight: 1.5,
        }}>
          "{bot.script}"
        </div>

        {/* CTA */}
        <a
          href={bot.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", textAlign: "center",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            background: "#ffffff", color: "#000000",
            padding: "0.75rem", textDecoration: "none",
            fontWeight: 700, borderRadius: "4px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Buy Now — 5% Cheaper
        </a>
      </div>
    </div>
  );
}

// ─── TREND SCANNER ────────────────────────────────────────────────────────────
function TrendScanner() {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("Today, 6:00 AM");
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct(i => (i + 1) % TRENDING_PRODUCTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLastScan("Just now");
    }, 2500);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px", padding: "1.5rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#fff", fontWeight: 600 }}>
            Trend Scanner
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            TikTok · Reddit · YouTube · Last scan: {lastScan}
          </div>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            background: scanning ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
            color: scanning ? "rgba(255,255,255,0.4)" : "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "0.5rem 1rem", borderRadius: "4px", cursor: scanning ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {scanning ? "⟳ Scanning..." : "⟳ Scan Now"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {TRENDING_PRODUCTS.map((product, i) => {
          const ourPrice = (product.retailPrice * 0.95).toFixed(2);
          const isActive = i === activeProduct;
          return (
            <div
              key={product.name}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem",
                background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                borderRadius: "8px",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}`,
                transition: "all 0.4s",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{product.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", color: "#fff", fontWeight: 600 }}>
                  {product.name}
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  {product.trend}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>
                  ${product.retailPrice.toFixed(2)}
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", color: "#4ade80", fontWeight: 700 }}>
                  ${ourPrice}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded border ${CATEGORY_COLORS[product.category]}`} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                {product.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function WellnessBots() {
  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#ffffff", paddingTop: "80px" }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            ← Back
          </Link>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#fff", letterSpacing: "0.1em" }}>
            Wellness Bots
          </div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            background: "rgba(74,222,128,0.15)", color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.3)",
            padding: "0.25rem 0.75rem", borderRadius: "20px",
          }}>
            🟢 2 Bots Active
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
            Chameleon Mode · 24/7 · Auto-Rotate
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#ffffff", marginBottom: "1rem" }}>
            Wellness Bots
          </h1>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            Two AI avatars that wake up daily, scan trending wellness products, dress the part, and pitch the best deal — always 5% cheaper than retail.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1px", background: "rgba(255,255,255,0.06)",
          borderRadius: "8px", overflow: "hidden", marginBottom: "3rem",
        }}>
          {[
            { label: "Active Bots", value: "2" },
            { label: "Products Tracked", value: "8" },
            { label: "Avg Savings", value: "5%" },
            { label: "Post Interval", value: "10 min" },
            { label: "Platforms", value: "TikTok / IG / YT" },
            { label: "Mode", value: "Chameleon" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#000", padding: "1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#fff", fontWeight: 600 }}>{stat.value}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bot cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {WELLNESS_BOTS.map(bot => (
            <WellnessBotCard key={bot.id} bot={bot} />
          ))}
        </div>

        {/* Trend Scanner */}
        <TrendScanner />

        {/* Cologne teaser */}
        <div style={{
          marginTop: "3rem", textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", padding: "2.5rem",
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
            Coming Soon
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#fff", marginBottom: "0.5rem" }}>
            Confidence Cologne
          </h2>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>
            2 oz · $300 · Black matte bottle · Gold cap · Velvet box
          </p>
          <Link href="/cologne" style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "0.75rem 2rem", textDecoration: "none",
            borderRadius: "4px", display: "inline-block",
            transition: "all 0.2s",
          }}>
            Pre-Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
