import { useEffect } from "react";
import { Link } from "wouter";

// ─── CDN ASSETS ───────────────────────────────────────────────────────────────
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

// ─── STAFF DATA ───────────────────────────────────────────────────────────────
const LEADERSHIP = [
  {
    id: "aria",
    name: "Aria Rabbit",
    title: "CFO · Daily Operations Director · Ultimate Host",
    division: "Executive Leadership",
    location: "Global HQ",
    quote: "Welcome to the playground, millionaire.",
    bio: "She doesn't manage the system — she is the system. Aria Rabbit controls daily operations, commands all 21 AI host bots, and runs the financial dashboard that moves money while you sleep. Every deal closed, every stream activated, every dollar deployed — she approved it first. You don't get access to the 1% Playground without going through her.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_red_v2_a5b4a5ce.jpg",
    imgAlt: "Aria Rabbit — CFO and Daily Operations Director at Create AI Profit",
    email: "Aria@createaiprofit.com",
    featured: true,
  },
];

// ─── AI HOST BOTS (12 new avatars) ──────────────────────────────────────────
const AI_HOSTS = [
  {
    id: "strategist",
    name: "The Strategist",
    title: "AI Host · Atlanta, GA",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black-bibt54hpggxcfKJrMM4ZCs_501913b8.webp",
    quote: "Stack silent. Move loud.",
    bio: "He maps the 10-million-man mission from the shadows. While others announce, he positions. While others celebrate, he compounds. The long game is the only game he plays.",
  },
  {
    id: "operator",
    name: "The Operator",
    title: "AI Host · Houston, TX",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-VaXNoNYbjxPvWy8LfMwxJ2-3_ed825a6f.webp",
    quote: "Leverage is the only language money speaks.",
    bio: "Automates income streams with surgical precision. The content pipeline runs. The backend earns. He doesn't work harder — he engineers systems that work for him while he sleeps.",
  },
  {
    id: "ghost",
    name: "The Ghost",
    title: "AI Host · Moscow, RU",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian_new_ad2e1a2b.webp",
    quote: "Cold system. Hot returns.",
    bio: "He never shows his hand. Posts cold-system content across Eastern Europe, drives traffic from markets no one else is watching, and vanishes before anyone knows he was there. Invisible. Profitable.",
  },
  {
    id: "architect",
    name: "The Architect",
    title: "AI Host · St. Petersburg, RU",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian-MENqyhDtaiPVuD5LWosFMq_5a32fa0a.webp",
    quote: "Design the system. Let it run.",
    bio: "Blueprints the income architecture. Every passive stream, every automated funnel, every residual channel — he designed it first. The machine runs because he built it right.",
  },
  {
    id: "don",
    name: "The Don",
    title: "AI Host · Rome, IT",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_don_new_v1_3d64e224.webp",
    quote: "Respect is earned in silence.",
    bio: "He doesn't ask for the deal — he assigns it. Closes $40K real estate fees with Italian-accented Machiavelli content that converts before the prospect knows what happened. Old world discipline. New world leverage.",
  },
  {
    id: "transporter",
    name: "The Transporter",
    title: "AI Host · London, UK",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian-cH2Sm5EBBazg8kDpLcGw3d.webp",
    quote: "Deliver the package. No questions asked.",
    bio: "British precision. Black belt discipline. He moves assets — real estate, crypto, income streams — across borders without a trace. The package always arrives. The terms are always his.",
  },
  {
    id: "tactician",
    name: "The Tactician",
    title: "AI Host · Mumbai, IN",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_tactician_v1-EQFSTjgusFmdnuoNCTx6jp.webp",
    quote: "The supreme art of war is to subdue the enemy without fighting.",
    bio: "Mumbai chess master. AI tech developer by day, Sun Tzu war strategist by night. He sees 12 moves ahead and never wastes a single one. The board is always already won.",
  },
  {
    id: "sheikh",
    name: "The Sheikh",
    title: "AI Host · Dubai, UAE",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-Zcg6Ldz9pYbDG2UQ2ANSud_785c3971.webp",
    quote: "Oil was yesterday. AI is today.",
    bio: "Runs the Gulf real estate syndicate and manages the Dubai luxury Airbnb portfolio. He doesn't chase markets — he creates them. The desert taught him patience. The market taught him everything else.",
  },
  {
    id: "visionary",
    name: "The Visionary",
    title: "AI Host · Mumbai, IN",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_indian_e3ab94ed_f142bdf6.jpg",
    quote: "A billion people. One opportunity.",
    bio: "Posts Hindi-language passive income content targeting South Asia's billion-person market. He doesn't need a translator — he speaks the language of leverage in every dialect.",
  },
  {
    id: "director",
    name: "The Director",
    title: "AI Host · Hollywood, CA",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862_c054a5e3.jpg",
    quote: "Every empire starts with a script.",
    bio: "Scripts the mini-series. Directs the avatar content. Commands the media production arm. In Hollywood, everyone wants to be seen. He decides who gets the camera.",
  },
  {
    id: "broker",
    name: "The Broker",
    title: "AI Host · New York, NY",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499_02e33567.jpg",
    quote: "Wall Street is just the warm-up.",
    bio: "Runs affiliate drops, crypto commentary, and high-ticket referral funnels from the floor of the most competitive market on earth. Wall Street sharpened him. He outgrew it.",
  },
  {
    id: "prince",
    name: "The Prince",
    title: "AI Host · Monaco",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_prince_baby_v1_d2fddde8.jpg",
    quote: "Old money never announces itself.",
    bio: "Structures generational wealth plays from Monaco. Runs the international syndicate. Old money doesn't shout — it compounds in silence, generation after generation, until the world catches up.",
  },
  {
    id: "boss",
    name: "The BOSS",
    title: "AI Host · New York, NY",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_boss_corleone_2661_8a4902cf.jpg",
    quote: "Power is not given. It is taken.",
    bio: "Michael Corleone energy. Calculated, strategic, inevitable. Runs the inner circle, controls the board, and never makes a move without purpose. He doesn't chase power — he engineers it. The BOSS is always three moves ahead.",
  },
  {
    id: "glitch",
    name: "The Glitch",
    title: "AI Host · Tokyo, JP",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_kai_tokyo_ca0fe340.jpg",
    quote: "Speed wins — I'm the glitch that flips the game.",
    bio: "Moves faster than the algorithm. Posts Japanese-language income content, runs the Asian market arm, and exploits every inefficiency before the market corrects. He's not a bug in the system — he is the system.",
  },
  {
    id: "visionary_v2",
    name: "The Visionary II",
    title: "AI Host · Mumbai, IN",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_visionary_v2_e6ae01db.jpg",
    quote: "AI profit has no borders.",
    bio: "Builds the AI automation stack. Manages the bot deployment pipeline. Keeps the entire system running clean while everyone else is still asking how it works.",
  },
  {
    id: "visionary_mx",
    name: "The Hustler",
    title: "AI Host · Los Angeles, CA",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_visionary_mexican_new_38cb3b37.jpg",
    quote: "Built from nothing. Scaled to everything.",
    bio: "Posts bilingual passive income content targeting Latino audiences across the US and Latin America. Built from nothing. Scaled to everything. The American dream — automated, monetized, and running 24/7.",
  },
];

const REAL_ESTATE_STAFF = [
  {
    id: "patriarch",
    name: "The Patriarch",
    title: "Global Operations Director · Seattle Division",
    division: "Executive · Global Operations",
    location: "Seattle, WA",
    quote: "Your margin is my opportunity.",
    bio: "He built the machine. Now the machine builds wealth for 21 million men. The Patriarch oversees global operations, structures the distribution architecture, and ensures every income stream runs at maximum efficiency. He doesn't manage people — he engineers systems that make people irrelevant.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_patriarch_bezos_e7b9b3cc.jpg",
    imgAlt: "The Patriarch — Global Operations Director at Create AI Profit",
    email: "ThePatriarch@createaiprofit.com",
    featured: false,
  },
  {
    id: "syndicate_patriarch",
    name: "The Syndicate",
    title: "Old Money Network · Geneva Division",
    division: "Syndicate · International Finance",
    location: "Geneva, CH",
    quote: "Wealth is inherited. Power is engineered.",
    bio: "He doesn't attend meetings — he convenes them. The Syndicate commands the old money network across Geneva and Zurich, now fully AI-powered. He has been structuring generational wealth plays since before the internet existed. The new tools simply made him more dangerous.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_syndicate_patriarch_94d0a007.jpg",
    imgAlt: "The Syndicate — Old Money Network Geneva Division at Create AI Profit",
    email: "TheSyndicate@createaiprofit.com",
    featured: false,
  },
  {
    id: "manila_closer",
    name: "The Manila Closer",
    title: "Southeast Asia Division · Syndicate Closer",
    division: "Syndicate · Southeast Asia",
    location: "Manila, PH",
    quote: "Manila grinds different. We close louder.",
    bio: "Southeast Asia's fastest closer. She doesn't negotiate — she terminates hesitation. Every call is a close. Every deal is already done before the prospect finishes their sentence. Manila built her. The syndicate deployed her. The results speak for themselves.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_syndicate_manila_closer_fb156822.jpg",
    imgAlt: "The Manila Closer — Southeast Asia Division at Create AI Profit",
    email: "ManilaCloser@createaiprofit.com",
    featured: false,
  },
  {
    id: "finance_vault",
    name: "The Vault",
    title: "Finance Director · New York Division",
    division: "Finance · Asset Management",
    location: "New York, NY",
    quote: "Money doesn't sleep. Neither does the Vault.",
    bio: "Every dollar tracked. Every stream maximized. The Vault manages the financial architecture of the entire operation — income streams, asset allocation, and the reserve system that keeps the machine running when markets move against everyone else. He doesn't react to volatility. He anticipated it.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_finance_vault_f525d4fe.jpg",
    imgAlt: "The Vault — Finance Director New York Division at Create AI Profit",
    email: "TheVault@createaiprofit.com",
    featured: false,
  },
  {
    id: "bartender",
    name: "The Bartender",
    title: "Commercial Real Estate · Investment Banking · White Russian Division",
    division: "Finance · Commercial Real Estate",
    location: "New York, NY",
    quote: "Every deal starts at the bar.",
    bio: "She doesn't mix drinks — she structures deals. The Bartender commands the White Russian division, brokering commercial real estate transactions and investment banking arrangements that close before the ice melts. She reads the room in seconds, identifies leverage before the first handshake, and never leaves the table without terms in her favor.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_bartender_85007ef2.jpg",
    imgAlt: "The Bartender — White Russian Division, Commercial Real Estate & Investment Banking at Create AI Profit",
    email: "TheBartender@createaiprofit.com",
    featured: false,
  },
  {
    id: "la_reina",
    name: "La Reina",
    title: "Real Estate Director · NYC Division",
    division: "Real Estate · Airbnb Portfolio",
    location: "New York City, NY",
    quote: "The city is the portfolio.",
    bio: "She doesn't list properties — she controls them. Heads the NYC real estate division, manages the short-term rental portfolio, and sources Airbnb arbitrage deals across the five boroughs. The city is her inventory. Every block, a position.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_reina_v2_bcd1d0f1.webp",
    imgAlt: "La Reina — Real Estate Director NYC Division at Create AI Profit",
    email: "LaReina@createaiprofit.com",
    featured: false,
  },
  {
    id: "the_fox",
    name: "The Fox",
    title: "Real Estate Closer · Las Vegas Division",
    division: "Real Estate · Short-Term Rentals",
    location: "Las Vegas, NV",
    quote: "Vegas never sleeps. Neither does the portfolio.",
    bio: "She doesn't negotiate — she sets the terms. Closes short-term rental assignments on the Strip, manages the Airbnb luxury unit portfolio, and sources high-yield arbitrage deals across Nevada. The house always wins. She owns the house.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_fox_blonde_v2_87650448.webp",
    imgAlt: "The Fox — Real Estate Closer Las Vegas Division at Create AI Profit",
    email: "TheFox@createaiprofit.com",
    featured: false,
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Staff() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Staff — Create AI Profit | Real Estate Division & Executive Team";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Meet the Create AI Profit executive team and real estate division. Aria Rabbit (CFO), La Reina (NYC Real Estate Director), The Fox (Las Vegas Real Estate Closer). AI-powered wealth building staff.");
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://createaiprofit.com/staff");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Staff — Create AI Profit | Real Estate Division & Executive Team");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "Meet the Create AI Profit executive team and real estate division. Aria Rabbit (CFO), La Reina (NYC), The Fox (Las Vegas). AI-powered wealth building.");
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://createaiprofit.com/staff");
    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", "Create AI Profit: The exclusive AI wealth-building platform. Real estate assignments, Airbnb cash flow, crypto flips, passive income streams. Join the 1% Playground — invite only.");
      if (canonical) canonical.setAttribute("href", "https://createaiprofit.com/");
      if (ogTitle) ogTitle.setAttribute("content", "Create AI Profit — AI That Pays You | 1% Playground");
      if (ogDesc) ogDesc.setAttribute("content", "Real estate assignments. Airbnb cash flow. Crypto flips. AI income streams. The exclusive 1% Playground — invite only.");
      if (ogUrl) ogUrl.setAttribute("content", "https://createaiprofit.com/");
    };
  }, []);

  return (
    <div style={{ background: "transparent", minHeight: "100vh", color: "#fff" }}>

      {/* ── NAV ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(2,5,10,0.92)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0.85rem 0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" aria-label="Create AI Profit — Home">
            <img src={CAP_LOGO} alt="Create AI Profit Logo" width={40} height={40} style={{ objectFit: "contain", cursor: "pointer" }} />
          </Link>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {[
              { href: "/", label: "Home" },
              { href: "/vault", label: "Vault" },
              { href: "/series", label: "Mini Series" },
              { href: "/store", label: "Store" },
              { href: "/subscribe", label: "Join" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main role="main" style={{ paddingTop: "80px" }}>

        {/* ── HERO HEADER ── */}
        <header style={{
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: "1.25rem",
            }}>
              Create AI Profit · Executive Team
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#ffffff",
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}>
              The Staff
            </h1>
            {/* Sub-banner — italic, same theme, no border */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.8,
              maxWidth: "560px",
              margin: "0 auto",
            }}>
              AI-powered operators, real estate directors, and the executive team behind the 1% Playground. No gatekeeping. This is the 21st-century model.
            </p>
          </div>
        </header>

        {/* ── BREADCRUMB (SEO) ── */}
        <nav aria-label="Breadcrumb" style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
          <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display: "flex", gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item">
                <span itemProp="name" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>›</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Staff</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        {/* ── LEADERSHIP SECTION ── */}
        <section
          aria-labelledby="leadership-heading"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 5rem" }}
        >
          <h2
            id="leadership-heading"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "3.5rem", textAlign: "center" }}
          >
            Executive Leadership
          </h2>

          {LEADERSHIP.map((person) => (
            <article
              key={person.id}
              itemScope
              itemType="https://schema.org/Person"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4rem",
                alignItems: "center",
                marginBottom: "5rem",
                padding: "3rem 0",
              }}
            >
              {/* Image */}
              <div style={{ textAlign: "center" }}>
                <img
                  src={person.img}
                  alt={person.imgAlt}
                  itemProp="image"
                  loading="eager"
                  width={400}
                  height={500}
                  style={{ maxHeight: "520px", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block", margin: "0 auto" }}
                />
              </div>

              {/* Info */}
              <div>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
                  {person.division} · {person.location}
                </p>
                <h3
                  itemProp="name"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, color: "#ffffff", letterSpacing: "0.08em", marginBottom: "0.5rem" }}
                >
                  {person.name}
                </h3>
                <p
                  itemProp="jobTitle"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}
                >
                  {person.title}
                </p>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.35rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.65)",
                  paddingLeft: "1.25rem",
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "1.75rem",
                  lineHeight: 1.5,
                }}>
                  "{person.quote}"
                </blockquote>
                <p
                  itemProp="description"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.85, marginBottom: "1.5rem" }}
                >
                  {person.bio}
                </p>
                <a
                  href={`mailto:${person.email}`}
                  itemProp="email"
                  aria-label={`Email ${person.name}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                >
                  {person.email}
                </a>
                <meta itemProp="worksFor" content="Create AI Profit" />
              </div>
            </article>
          ))}
        </section>

        {/* ── DIVIDER ── */}
        <div role="separator" style={{ maxWidth: "1200px", margin: "0 auto 4rem", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", margin: 0 }}>
              Real Estate Division · Airbnb Portfolio · Short-Term Rentals
            </p>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>

        {/* ── REAL ESTATE STAFF ── */}
        <section
          aria-labelledby="realestate-heading"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 6rem" }}
        >
          <h2
            id="realestate-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "3.5rem" }}
          >
            Real Estate Division
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {REAL_ESTATE_STAFF.map((person) => (
              <article
                key={person.id}
                itemScope
                itemType="https://schema.org/Person"
                style={{
                  padding: "2.5rem 0",
                  textAlign: "center",
                }}
              >
                <img
                  src={person.img}
                  alt={person.imgAlt}
                  itemProp="image"
                  loading="lazy"
                  width={320}
                  height={420}
                  style={{ width: "100%", maxHeight: "420px", objectFit: "cover", objectPosition: "top", display: "block", marginBottom: "1.75rem" }}
                />
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem" }}>
                  {person.location}
                </p>
                <h3
                  itemProp="name"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.08em", marginBottom: "0.35rem" }}
                >
                  {person.name}
                </h3>
                <p
                  itemProp="jobTitle"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(255,255,255,0.28)", marginBottom: "1.25rem" }}
                >
                  {person.title}
                </p>
                <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                  "{person.quote}"
                </blockquote>
                <p
                  itemProp="description"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: "1.25rem" }}
                >
                  {person.bio}
                </p>
                <a
                  href={`mailto:${person.email}`}
                  itemProp="email"
                  aria-label={`Email ${person.name}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                >
                  {person.email}
                </a>
                <meta itemProp="worksFor" content="Create AI Profit" />
              </article>
            ))}
          </div>
        </section>

        {/* ── AI HOST BOTS GRID ── */}
        <section aria-labelledby="ai-hosts-heading" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 6rem" }}>
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", margin: 0 }}>AI Host Network · 21 Multilingual Bots</p>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>
          <h2 id="ai-hosts-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "3.5rem" }}>The AI Host Network</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "2rem" }}>
            {AI_HOSTS.map((h) => (
              <div key={h.id} style={{ textAlign: "center" }}>
                <img
                  src={h.img}
                  alt={h.name}
                  loading="lazy"
                  style={{ width: "100%", maxWidth: "320px", height: "260px", objectFit: "contain", objectPosition: "center", display: "block", margin: "0 auto 1rem" }}
                />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>{h.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", fontWeight: 300, color: "rgba(148,163,170,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>{h.title}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>"{h.quote}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <Link href="/" aria-label="Create AI Profit — Home">
            <img src={CAP_LOGO} alt="Create AI Profit" width={36} height={36} style={{ objectFit: "contain", marginBottom: "1rem", cursor: "pointer", opacity: 0.5 }} />
          </Link>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.25em", color: "rgba(255,255,255,0.18)" }}>
            © 2026 Create AI Profit LLC · All Rights Reserved
          </p>
        </footer>

      </main>
    </div>
  );
}
