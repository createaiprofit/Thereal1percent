import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_wg_instagram_aefdf251.png";
const COLOGNE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/confidence_cologne-K4fKhGR4jJ6dvsT5iqjnYh.webp";

type Category = "all" | "wellness" | "fashion" | "jewelry" | "realestate" | "airbnb" | "cologne";

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "all",        label: "All",          icon: "✦" },
  { id: "wellness",   label: "Wellness",     icon: "🌿" },
  { id: "fashion",    label: "Fashion",      icon: "👗" },
  { id: "jewelry",    label: "Jewelry",      icon: "💎" },
  { id: "realestate", label: "Real Estate",  icon: "🏙️" },
  { id: "airbnb",     label: "Airbnb",       icon: "🏡" },
  { id: "cologne",    label: "Cologne",      icon: "🖤" },
];

interface Product {
  id: string;
  category: Category;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  desc: string;
  url: string;
  avatar: string;
  avatarName: string;
  commission: string;
  tag: string;
}

const PRODUCTS: Product[] = [
  // ── WELLNESS ──
  {
    id: "nmn",
    category: "wellness",
    name: "NMN 500mg — Anti-Aging",
    brand: "Hims",
    price: "$46.55",
    originalPrice: "$49.00",
    badge: "5% OFF",
    desc: "#1 TikTok wellness supplement. NAD+ booster. Cellular energy.",
    url: "https://hims.com/nmn-affiliate",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499.png",
    avatarName: "The Closer · NYC",
    commission: "15%",
    tag: "🔥 Trending",
  },
  {
    id: "lions_mane",
    category: "wellness",
    name: "Lion's Mane Mushroom Coffee",
    brand: "Four Sigmatic",
    price: "$18.99",
    originalPrice: "$19.99",
    badge: "5% OFF",
    desc: "+340% search growth. Focus, clarity, no crash.",
    url: "https://foursigmatic.com/affiliate",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_reina_v2-RQAaqhU5NiDB29qXHwdR9L.webp",
    avatarName: "La Reina · Miami",
    commission: "15%",
    tag: "📈 Rising",
  },
  {
    id: "bakuchiol",
    category: "wellness",
    name: "Bakuchiol Serum",
    brand: "Sephora",
    price: "$64.60",
    originalPrice: "$68.00",
    badge: "5% OFF",
    desc: "Natural retinol alternative. Trending r/SkincareAddiction.",
    url: "https://www.sephora.com/search?keyword=bakuchiol",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862.png",
    avatarName: "The Starlet · Hollywood",
    commission: "12%",
    tag: "💄 Beauty",
  },
  // ── FASHION ──
  {
    id: "saint_laurent",
    category: "fashion",
    name: "YSL Slim-Fit Blazer",
    brand: "Saint Laurent",
    price: "$1,890",
    badge: "VIP",
    desc: "Power dressing. The uniform of the 1%. Worn by The Don.",
    url: "https://www.ysl.com/en-us/blazers",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_don_new_v1_3d64e224.webp",
    avatarName: "The Don · Rome",
    commission: "8%",
    tag: "🖤 Luxury",
  },
  {
    id: "tom_ford_suit",
    category: "fashion",
    name: "Tom Ford O'Connor Suit",
    brand: "Tom Ford",
    price: "$4,490",
    badge: "ELITE",
    desc: "The suit that closes deals. Cold system. Hot returns.",
    url: "https://www.tomford.com/suits",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_ghost_new_v2-Mf3sRJXSELBxuGBjRj3Qxk.webp",
    avatarName: "The Ghost · Moscow",
    commission: "8%",
    tag: "🖤 Luxury",
  },
  // ── JEWELRY ──
  {
    id: "cartier_love",
    category: "jewelry",
    name: "Cartier Love Bracelet",
    brand: "Cartier",
    price: "$6,900",
    badge: "ICONIC",
    desc: "The bracelet that signals arrival. Generational flex.",
    url: "https://www.cartier.com/en-us/jewelry/bracelets/love-bracelet",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_dubai_chic_v1-Vc7fKqLkSdMjHpNxRtWyZe.webp",
    avatarName: "Dubai Chic · Dubai",
    commission: "5%",
    tag: "💎 Iconic",
  },
  // ── REAL ESTATE ──
  {
    id: "re_assignment",
    category: "realestate",
    name: "Real Estate Assignment Deal",
    brand: "CAP Syndicate",
    price: "$40,000+",
    badge: "HOT",
    desc: "Find the deal. Assign the contract. Collect the fee. No license needed.",
    url: "https://createaiprofit.com/vault",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_don_new_v1_3d64e224.webp",
    avatarName: "The Don · Rome",
    commission: "Varies",
    tag: "🏙️ Assignment",
  },
  // ── AIRBNB ──
  {
    id: "airbnb_arb",
    category: "airbnb",
    name: "Airbnb Arbitrage Blueprint",
    brand: "CAP Syndicate",
    price: "$297",
    badge: "BEST SELLER",
    desc: "Rent low. List high. Automate. The Builder's proven system.",
    url: "https://createaiprofit.com/vault",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_builder_new_d75ef2b8.jpg",
    avatarName: "The Builder · Spain",
    commission: "20%",
    tag: "🏡 Passive",
  },
  // ── COLOGNE ──
  {
    id: "confidence_cologne",
    category: "cologne",
    name: "Confidence Cologne",
    brand: "CAP",
    price: "$89",
    badge: "EXCLUSIVE",
    desc: "The scent of the 1%. Power. Precision. Presence.",
    url: "/confidence-cologne",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian_v2-Rb6Ap5daUpzAimXZ5VFd9v.webp",
    avatarName: "The Operator · Moscow",
    commission: "25%",
    tag: "🖤 Exclusive",
  },
];

export default function AffiliateStore() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const filtered = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Lato', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/"><img src={CAP_LOGO} alt="CAP" style={{ height: "40px", objectFit: "contain" }} /></Link>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontStyle: "italic", color: "rgba(201,168,76,0.9)" }}>The Affiliate Store</div>
        <Link href="/club-vault" style={{ fontSize: "0.8rem", color: "rgba(201,168,76,0.6)", textDecoration: "none", letterSpacing: "0.1em" }}>VAULT →</Link>
      </div>

      {/* Category Filter */}
      <div style={{ padding: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "2rem",
              border: activeCategory === cat.id ? "1px solid rgba(201,168,76,0.8)" : "1px solid rgba(255,255,255,0.1)",
              background: activeCategory === cat.id ? "rgba(201,168,76,0.15)" : "transparent",
              color: activeCategory === cat.id ? "rgba(201,168,76,0.9)" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 6rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {filtered.map(product => (
          <div key={product.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={product.avatar} alt={product.avatarName} style={{ width: "60px", height: "80px", objectFit: "contain" }} />
              <div>
                <div style={{ fontSize: "0.75rem", color: "rgba(201,168,76,0.7)", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>{product.avatarName}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{product.tag}</div>
              </div>
              {product.badge && (
                <div style={{ marginLeft: "auto", padding: "0.2rem 0.6rem", background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "4px", fontSize: "0.65rem", color: "rgba(201,168,76,0.9)", letterSpacing: "0.1em" }}>
                  {product.badge}
                </div>
              )}
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{product.brand}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>{product.name}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1rem" }}>{product.desc}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "rgba(201,168,76,0.9)" }}>{product.price}</span>
                  {product.originalPrice && (
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through", marginLeft: "0.5rem" }}>{product.originalPrice}</span>
                  )}
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                  Commission: <span style={{ color: "rgba(201,168,76,0.7)" }}>{product.commission}</span>
                </div>
              </div>
              <a
                href={product.url}
                target={product.url.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={() => toast.success(`Opening ${product.name}`)}
                style={{ display: "block", textAlign: "center", padding: "0.75rem", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "8px", color: "rgba(201,168,76,0.9)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                VIEW PRODUCT →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Cologne Feature */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4rem 2rem", textAlign: "center" }}>
        <img src={COLOGNE_IMG} alt="Confidence Cologne" style={{ height: "200px", objectFit: "contain", marginBottom: "1.5rem" }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontStyle: "italic", color: "rgba(201,168,76,0.9)", marginBottom: "0.5rem" }}>Confidence Cologne</div>
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>The scent of the 1%. Exclusive to CAP members.</div>
        <Link href="/confidence-cologne" style={{ padding: "0.75rem 2rem", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.5)", borderRadius: "8px", color: "rgba(201,168,76,0.9)", textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
          SHOP COLOGNE →
        </Link>
      </div>
    </div>
  );
}
