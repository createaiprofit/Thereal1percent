import { useLocation } from "wouter";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

const CITY_SQUAD = [
  { id: "la", origin: "Hollywood, CA", title: "The Starlet", color: "#c9a96e", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_director_v2_b792c29b.png" },
  { id: "miami", origin: "Miami, FL", title: "La Reina", color: "#e8a87c", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_reina_v2-RQAaqhU5NiDB29qXHwdR9L.webp" },
  { id: "nyc", origin: "New York, NY", title: "The Closer", color: "#a8c5da", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_broker_v2_33e631cb.png" },
  { id: "atl", origin: "Atlanta, GA", title: "The Queen", color: "#d4a0a0", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_king_v2_7b825da9.png" },
  { id: "vegas", origin: "Las Vegas, NV", title: "The Fox", color: "#b8a9d9", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_fox_blonde_v2-MezpQqZSy4NzKAtZPG6X9h.webp" },
];

const EPISODES = [
  { ep: 1, title: "The System Explained", host: CITY_SQUAD[2], tag: "Foundation", desc: "How E Capital Venture works from the ground up — bots, wallets, affiliates, and the 1% Playground." },
  { ep: 2, title: "AI That Pays You", host: CITY_SQUAD[0], tag: "AI Income", desc: "The AI engine that generates passive income 24 hours a day while you sleep, eat, and live." },
  { ep: 3, title: "Affiliate Secrets", host: CITY_SQUAD[1], tag: "Affiliates", desc: "How to earn commissions on luxury goods, wellness products, and real estate without owning anything." },
  { ep: 4, title: "The Wallet Economy", host: CITY_SQUAD[3], tag: "Finance", desc: "Your in-app wallet receives 40% of bot earnings. Subscriptions are paid from your wallet. No credit cards." },
  { ep: 5, title: "Club Vault Breakdown", host: CITY_SQUAD[4], tag: "Luxury", desc: "Inside the Club Vault — curated luxury fashion, watches, and jewelry with tracked affiliate commissions." },
  { ep: 6, title: "Wellness Bots & Passive Income", host: CITY_SQUAD[1], tag: "Wellness", desc: "AI wellness bots pitch supplements and biohacking products at 5% below retail. The spread is yours." },
  { ep: 7, title: "Designer Clothes That Pay", host: CITY_SQUAD[0], tag: "Fashion", desc: "Saint Laurent, Tom Ford, Hermès — the bots wear it, pitch it, and earn on every click." },
  { ep: 8, title: "Jewelry — The Real Investment", host: CITY_SQUAD[3], tag: "Jewelry", desc: "Rolex Daytona, Cartier Love, Tiffany T — affiliate commissions on investment-grade pieces." },
  { ep: 9, title: "Airbnb Sublease Playbook", host: CITY_SQUAD[2], tag: "Real Estate", desc: "Sublease luxury properties in Miami, Hollywood Hills, and Vegas Strip. Collect the spread. No mortgage." },
  { ep: 10, title: "Real Estate Assignments", host: CITY_SQUAD[4], tag: "Real Estate", desc: "Assign contracts on Miami and Atlanta properties. No bank. No mortgage. Pure arbitrage." },
  { ep: 11, title: "The 1% Playground Explained", host: CITY_SQUAD[1], tag: "Club", desc: "The private social club. Invite only. TikTok-style feed. Bot-funded subscriptions. Your 40% share." },
  { ep: 12, title: "Bot Earnings — How It Works", host: CITY_SQUAD[2], tag: "Bots", desc: "The bots post affiliate content on the website every 10 minutes, 24 hours a day. Here's the math." },
  { ep: 13, title: "Your 40% Share", host: CITY_SQUAD[0], tag: "Earnings", desc: "Platform earns, you earn. 40% of backend revenue flows into your in-app wallet automatically." },
  { ep: 14, title: "Confidence Cologne Story", host: CITY_SQUAD[3], tag: "Brand", desc: "The story behind the $300 bottle. Why it exists. What it means. Coming soon." },
  { ep: 15, title: "CheckMate — AI Chess System", host: CITY_SQUAD[4], tag: "AI", desc: "The AI chess coaching system that teaches strategy through the lens of power and business." },
  { ep: 16, title: "Cold Call AI Closer", host: CITY_SQUAD[2], tag: "Sales", desc: "AI-powered cold call scripts that close deals. The system that never sleeps and never flinches." },
  { ep: 17, title: "Dropshipping With AI", host: CITY_SQUAD[1], tag: "E-Commerce", desc: "AI-curated dropshipping products. The bots find the winners. You collect the margin." },
  { ep: 18, title: "Concierge Services Explained", host: CITY_SQUAD[0], tag: "Concierge", desc: "Curated trips, yacht charters, private jets, and galas — booked through the platform." },
  { ep: 19, title: "The App — Full Walkthrough", host: CITY_SQUAD[3], tag: "App", desc: "Every feature of the E Capital Venture app — wallet, social club, affiliate store, bot earnings." },
  { ep: 20, title: "Social Club — Inside Access", host: CITY_SQUAD[4], tag: "Club", desc: "What happens inside the 1% Playground. The feed, the members, the earnings, the culture." },
  { ep: 21, title: "Stack Silent. Move Loud.", host: CITY_SQUAD[2], tag: "Mindset", desc: "The philosophy behind E Capital Venture. Build the system. Let it run. Collect. Repeat." },
];

const TAGS = ["All", "Foundation", "AI Income", "Affiliates", "Finance", "Luxury", "Wellness", "Fashion", "Jewelry", "Real Estate", "Club", "Bots", "Earnings", "Brand", "AI", "Sales", "E-Commerce", "Concierge", "App", "Mindset"];

export default function Episodes() {
  const [, navigate] = useLocation();
  const [activeTag, setActiveTag] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof EPISODES[0] | null>(null);

  const filtered = activeTag === "All" ? EPISODES : EPISODES.filter(e => e.tag === activeTag);

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff", fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{ height: "36px", width: "36px", objectFit: "contain", cursor: "pointer" }} onClick={() => navigate("/")} />
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            The Series
          </div>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            ← Home
          </button>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: "4rem 0 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
          E Capital Venture
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem" }}>
          21 Episodes.
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>
          Every system. Every strategy. Hosted by the city squad.
        </p>
      </div>

      {/* Tag filter */}
      <div className="container" style={{ paddingBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "0.5rem" }}>
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                flexShrink: 0,
                padding: "0.4rem 0.85rem",
                background: activeTag === tag ? "#ffffff" : "rgba(255,255,255,0.04)",
                color: activeTag === tag ? "#000000" : "rgba(255,255,255,0.5)",
                border: activeTag === tag ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Rajdhani', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {tag}
            </button>