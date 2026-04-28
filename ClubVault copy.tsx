import { useState, useEffect, useRef } from "react";
import { playVoice as playVaultVoice, stopVoice as stopVaultVoice } from "@/lib/audioManager";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

// ─── AVATAR DATA (matches Home.tsx) ──────────────────────────────────────────
const AVATARS: Record<string, { img: string; voice: string; name: string }> = {
  black: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-DLBJbpjbQJvFmqJV8bpTBt.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_black-wGBpZkXFMKgqBjLpJNHqFM.wav",
    name: "Atlanta",
  },
  russian: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian_v2-FvQCJCLfRkQ8RzxqHLkVFB.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_russian-TkBPmJhDQRnLqXzVWgNpYc.wav",
    name: "Moscow",
  },
  italian: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian_v2-GhKLmNpQrStUvWxYzAbCd.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_italian-EfGhIjKlMnOpQrStUvWxYz.wav",
    name: "Milan",
  },
  arab: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-AbCdEfGhIjKlMnOpQrStUv.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_arab-WxYzAbCdEfGhIjKlMnOpQr.wav",
    name: "Dubai",
  },
  indian: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_indian-StUvWxYzAbCdEfGhIjKlMn.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_indian-OpQrStUvWxYzAbCdEfGhIj.wav",
    name: "Delhi",
  },
  chinese_girl: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_chinese_girl-jQQNHKbvoHFxSPus4zFc8J.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_chinese_girl_v2_dc344fce.wav",
    name: "Shanghai",
  },
  american_italian_girl: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_american_italian_girl-fjjTigraJ5xeqNC7VF6XWf.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_american_italian_girl_v2_648eefe7.wav",
    name: "New York",
  },
  french_girl: {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_french_girl-32X2x6Z3veiHpgWcZKhRCm.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_french_girl_00fd7457.wav",
    name: "Paris",
  },
};

// ─── STATIC PRODUCT CATALOG (affiliate links are placeholders — swap for real) ─
const VAULT_CATALOG = [
  // WATCHES
  { id: 1, category: "watches", brand: "Rolex", name: "Daytona Cosmograph", price: "$28,500+", commission: "5%", desc: "The ultimate chronograph. Ceramic bezel, Oysterflex bracelet.", affiliateUrl: "https://www.rolex.com/watches/cosmograph-daytona.html", avatarId: "black", quote: "It is better to be feared than loved… and this Daytona? It commands both. Link below. Commission hits your wallet." },
  { id: 2, category: "watches", brand: "Patek Philippe", name: "Nautilus 5711", price: "$120,000+", commission: "5%", desc: "The most coveted sports watch on earth. Waitlist years. We have access.", affiliateUrl: "https://www.patek.com/en/collection/nautilus", avatarId: "italian", quote: "The prince who relies on fortune is lost when it changes. Patek Philippe never changes. Secure yours." },
  // FASHION — WOMEN
  { id: 3, category: "fashion", brand: "Christian Dior", name: "Lady Dior Bag", price: "$5,500", commission: "8%", desc: "Cannage stitching. Lambskin. The bag that defines a room.", affiliateUrl: "https://www.dior.com/en_us/fashion/womens-fashion/handbags", avatarId: "arab", quote: "The prince dresses his queen… this Dior is her throne. Link here. Buy it. Commission hits." },
  { id: 4, category: "fashion", brand: "Chanel", name: "Classic Flap Bag", price: "$10,200", commission: "8%", desc: "Quilted caviar leather. Gold chain. Timeless.", affiliateUrl: "https://www.chanel.com/us/fashion/handbags/", avatarId: "italian", quote: "Men who desire extraordinary things never take ordinary paths. Neither does she. Chanel." },
  { id: 5, category: "fashion", brand: "Hermès", name: "Birkin 30", price: "$12,000+", commission: "8%", desc: "The most recognizable bag in the world. Investment-grade.", affiliateUrl: "https://www.hermes.com/us/en/category/women/bags-and-small-leather-goods/bags/", avatarId: "russian", quote: "Cold system. Hot returns. A Birkin appreciates 14% per year. Buy it. Wear it. Profit." },
  { id: 6, category: "fashion", brand: "Louboutin", name: "So Kate 120mm Heels", price: "$795", commission: "10%", desc: "The red sole. The power walk. The statement.", affiliateUrl: "https://us.christianlouboutin.com/", avatarId: "indian", quote: "There is nothing more dangerous than a woman who knows her power. These heels remind her." },
  { id: 7, category: "fashion", brand: "La Perla", name: "Signature Lace Set", price: "$650", commission: "12%", desc: "Italian craftsmanship. Pure silk and lace. The luxury standard.", affiliateUrl: "https://www.laperla.com/us/", avatarId: "italian", quote: "The architect designs what others only dream. La Perla is the blueprint." },
  { id: 8, category: "fashion", brand: "Cartier", name: "Love Bracelet", price: "$7,350", commission: "8%", desc: "Yellow, white, or rose gold. The bracelet that locks.", affiliateUrl: "https://www.cartier.com/en-us/collections/jewelry/collections/love/bracelets/", avatarId: "arab", quote: "Position yourself now. Clarity follows decision. This bracelet is a decision." },
  // FASHION — MEN
  { id: 9, category: "fashion", brand: "Versace", name: "Medusa Head Suit", price: "$4,200", commission: "8%", desc: "Black wool. Gold Medusa buttons. Power personified.", affiliateUrl: "https://www.versace.com/us/en/men/clothing/suits/", avatarId: "black", quote: "Stack silent. Move loud. This suit does both." },
  { id: 10, category: "fashion", brand: "Prada", name: "Re-Nylon Bomber", price: "$2,800", commission: "8%", desc: "Regenerated nylon. Triangular logo. The uniform of the elite.", affiliateUrl: "https://www.prada.com/us/en/mens/ready_to_wear/jackets_and_outerwear.html", avatarId: "russian", quote: "Cold system. Hot returns. Prada bomber, passive income. Same energy." },
  { id: 11, category: "fashion", brand: "Armani", name: "Emporio Tuxedo", price: "$3,500", commission: "8%", desc: "Silk lapels. Perfect drape. For the room that matters.", affiliateUrl: "https://www.armani.com/en-us/giorgio-armani/man/suits-and-tuxedos", avatarId: "italian", quote: "Design the system. Let it run. Dress for the system you're building." },
  { id: 12, category: "fashion", brand: "Gucci", name: "GG Canvas Loafers", price: "$890", commission: "8%", desc: "The original flex. Horsebit hardware. Genuine Gucci.", affiliateUrl: "https://www.gucci.com/us/en/ca/men/shoes-for-men-c-men-shoes", avatarId: "mexican", quote: "Build what pays you while you sleep. These Guccis walk so your money runs." },
  // CIGARS
  { id: 13, category: "cigars", brand: "Davidoff", name: "Winston Churchill The Late Hour", price: "$48/cigar", commission: "15%", desc: "Full-bodied. Dominican. The cigar of decisions.", affiliateUrl: "https://www.davidoff.com/en-us/cigars/", avatarId: "black", quote: "Power rewards power. Light one. Let the system work. Commission hits." },
  { id: 14, category: "cigars", brand: "Habanos", name: "Cohiba Behike BHK 56", price: "$95/cigar", commission: "15%", desc: "The rarest Cuban. Medio Tiempo leaf. Smoke it when the deal closes.", affiliateUrl: "https://www.habanos.com/en/", avatarId: "arab", quote: "It is better to be feared than loved. This cigar? Both. Buy it. Link below." },
  // CARS & RENTALS
  { id: 15, category: "cars", brand: "Ferrari", name: "SF90 Stradale — Day Rental", price: "$3,500/day", commission: "15%", desc: "986hp hybrid. 0-60 in 2.5s. Via Turo Exotic.", affiliateUrl: "https://turo.com/us/en/search?country=US&type=EXOTIC", avatarId: "italian", quote: "The architect designs what others only dream. Drive it. Film it. Post it. Commission hits." },
  { id: 16, category: "cars", brand: "Lamborghini", name: "Urus — Weekend Rental", price: "$2,800/day", commission: "15%", desc: "Super SUV. 641hp. The content creator's weapon.", affiliateUrl: "https://turo.com/us/en/search?country=US&type=EXOTIC", avatarId: "russian", quote: "Move before clarity. Position first. Rent the Urus. Shoot the content. Stack the views." },
  { id: 17, category: "cars", brand: "Bugatti", name: "Chiron — Enquire", price: "POA", commission: "5%", desc: "1,479hp. 261mph. $3.2M. We facilitate. You commission.", affiliateUrl: "https://www.bugatti.com/chiron/", avatarId: "arab", quote: "A Bugatti commission is $200,000. One sale. One link. That is power." },
  // JETS & YACHTS
  { id: 18, category: "jets", brand: "NetJets", name: "Citation Longitude — Charter", price: "$8,500/hr", commission: "10%", desc: "8 passengers. Transcontinental range. Book by the hour.", affiliateUrl: "https://www.netjets.com/en-us/", avatarId: "arab", quote: "The wise man does at once what the fool does finally. Book the jet. Close the deal in the air." },
  { id: 19, category: "yachts", brand: "Burgess Yachts", name: "Superyacht Charter — Mediterranean", price: "$150,000/week", commission: "10%", desc: "60m+ yachts. Full crew. Mediterranean or Caribbean.", affiliateUrl: "https://www.burgessyachts.com/en/charter/", avatarId: "italian", quote: "Design the system. Let it run. Charter a yacht. Film the content. Passive income from the sea." },
  { id: 20, category: "yachts", brand: "Fraser Yachts", name: "Day Charter — Miami", price: "$12,000/day", commission: "10%", desc: "Luxury day charters. Perfect for content, events, or deals.", affiliateUrl: "https://www.fraseryachts.com/en/charter/", avatarId: "black", quote: "Stack silent. Move loud. Day charter. Shoot the reel. Link in bio. Commission loops back." },
  // WOMEN'S POWER WARDROBE
  { id: 24, category: "power_wardrobe", brand: "Saint Laurent", name: "Le Smoking Tuxedo Blazer", price: "$3,900", commission: "10%", desc: "The original power suit. Black wool. Satin lapels. Worn by women who close.", affiliateUrl: "https://www.ysl.com/en-us/clothing/blazers", avatarId: "american_italian_girl", quote: "The prince — or princess — does not ask. She takes. This Saint Laurent suit is my armor. I closed three deals today before you finished your coffee. My fit. Buy yours — Club Vault." },
  { id: 25, category: "power_wardrobe", brand: "Tom Ford", name: "Velvet Evening Blazer", price: "$4,200", commission: "10%", desc: "Midnight velvet. Peak lapel. The blazer that hides the knife.", affiliateUrl: "https://www.tomford.com/clothing/women/blazers-and-jackets/", avatarId: "chinese_girl", quote: "Deception is leverage. This Tom Ford blazer hides the knife. I do not raise my voice. I do not need to. Power is quiet. And expensive. My fit. Buy yours — Club Vault." },
  { id: 26, category: "power_wardrobe", brand: "Hermès", name: "Silk Carré Scarf", price: "$495", commission: "8%", desc: "90x90cm silk twill. The original status signal. Investment-grade accessory.", affiliateUrl: "https://www.hermes.com/us/en/category/women/accessories/scarves-and-stoles/", avatarId: "french_girl", quote: "The lion cannot protect himself from traps. So I became the fox. In Paris, the trap is looking like you are trying. I never try. My fit. Buy yours — Club Vault." },
  { id: 27, category: "power_wardrobe", brand: "Loro Piana", name: "Cashmere Overcoat", price: "$6,800", commission: "8%", desc: "Baby cashmere. Unstructured drape. The coat that whispers old money.", affiliateUrl: "https://www.loropiana.com/en/eshop/women/coats", avatarId: "french_girl", quote: "Power is quiet. And expensive. This Loro Piana coat costs more than most people's rent. Wear it like you don't notice. My fit. Buy yours — Club Vault." },
  { id: 28, category: "power_wardrobe", brand: "Brioni", name: "Women's Tailored Suit", price: "$7,500", commission: "8%", desc: "Hand-stitched in Rome. The most expensive suit in the room. Always.", affiliateUrl: "https://www.brioni.com/en-us/women/suits", avatarId: "american_italian_girl", quote: "Never attempt to win by force what can be won by strategy. This Brioni suit is the strategy. My fit. Buy yours — Club Vault." },
  { id: 29, category: "power_wardrobe", brand: "Charvet", name: "Bespoke Silk Blouse", price: "$1,200", commission: "8%", desc: "Place Vendôme, Paris. The shirt that royalty orders. Bespoke silk.", affiliateUrl: "https://www.charvet.com/en/women", avatarId: "french_girl", quote: "The fox sees the trap. The lion takes the position. I do both. Charvet silk. Club Vault. Link right here." },
  // CONTENT PODS
  { id: 21, category: "content_pods", brand: "CAP Content Pods", name: "Downtown Penthouse Pod — NYC", price: "$500/hr", commission: "15%", desc: "Floor-to-ceiling windows. Skyline backdrop. Pro lighting, mics, 4K cameras. Book like Airbnb.", affiliateUrl: "#book-pod", avatarId: "black", quote: "Build what pays you while you sleep. Rent this pod for an hour. Shoot 30 reels. Sleep. Profit." },
  { id: 22, category: "content_pods", brand: "CAP Content Pods", name: "Rooftop Studio Pod — Miami", price: "$400/hr", commission: "15%", desc: "Ocean view. Golden hour light. Ring lights, teleprompter, green screen.", affiliateUrl: "#book-pod", avatarId: "mexican", quote: "Never attempt to win by force what can be won by strategy. This pod is the strategy." },
  { id: 23, category: "content_pods", brand: "CAP Content Pods", name: "Dark Luxury Studio — LA", price: "$350/hr", commission: "15%", desc: "All-black interior. Neon accents. Perfect for the CAP aesthetic.", affiliateUrl: "#book-pod", avatarId: "russian", quote: "Cold system. Hot returns. One hour in this studio. Twenty pieces of content. Commission loops." },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "watches", label: "Watches" },
  { id: "fashion", label: "Fashion" },
  { id: "cigars", label: "Cigars" },
  { id: "cars", label: "Cars" },
  { id: "jets", label: "Jets" },
  { id: "yachts", label: "Yachts" },
  { id: "content_pods", label: "Content Pods" },
  { id: "power_wardrobe", label: "Power Wardrobe" },
];

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_wg_instagram_aefdf251.png";

// ─── AUDIO: uses shared audioManager singleton (see @/lib/audioManager.ts) ───────────────────────
// ─── AVATAR INTRO OVERLAY ─────────────────────────────────────────────
function AvatarIntro({ product, onClose }: { product: typeof VAULT_CATALOG[0]; onClose: () => void }) {
  const avatar = AVATARS[product.avatarId] ?? AVATARS.black;

  useEffect(() => {
    playVaultVoice(avatar.voice, 0.9);
    const timer = setTimeout(onClose, 11000);
    return () => { stopVaultVoice(); clearTimeout(timer); };
  }, [avatar.voice, onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        maxWidth: "480px", width: "90%",
        background: "#000", border: "1px solid rgba(255,255,255,0.1)",
        padding: "2.5rem 2rem", textAlign: "center", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          background: "none", border: "none", color: "rgba(255,255,255,0.4)",
          cursor: "pointer", fontSize: "1.2rem",
        }}>×</button>
        <img src={avatar.img} alt={avatar.name} style={{
          width: "120px", height: "160px", objectFit: "cover", objectPosition: "top",
          marginBottom: "1.5rem",
        }} />
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>
          CAP · {avatar.name}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(220,220,255,0.9)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          "{product.quote}"
        </div>
        <button
          onClick={onClose}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.25em", textTransform: "uppercase",
            background: "#ffffff", color: "#000000",
            padding: "0.75rem 2rem", border: "none", cursor: "pointer", fontWeight: 700,
          }}
        >
          View Product →
        </button>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect }: { product: typeof VAULT_CATALOG[0]; onSelect: () => void }) {
  const trackClick = trpc.vault.trackClick.useMutation();

  const handleBuy = async () => {
    const result = await trackClick.mutateAsync({ productId: product.id });
    if (result?.url && result.url !== "#book-pod") {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "border-color 0.25s",
        display: "flex", flexDirection: "column", gap: "0.75rem",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
    >
      {/* Brand + Category badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
          {product.brand}
        </span>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.15rem 0.5rem" }}>
          {product.commission} commission
        </span>
      </div>

      {/* Product name */}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#ffffff", lineHeight: 1.3 }}>
        {product.name}
      </div>

      {/* Description */}
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
        {product.desc}
      </div>

      {/* Price + Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
          {product.price}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onSelect}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.4rem 0.75rem", cursor: "pointer" }}
          >
            ▶ Intro
          </button>
          <button
            onClick={handleBuy}
            style={{ background: "#ffffff", color: "#000000", border: "none", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.4rem 0.75rem", cursor: "pointer", fontWeight: 700 }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ClubVault() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof VAULT_CATALOG[0] | null>(null);
  const [activeBrand, setActiveBrand] = useState("all");
  const [priceMax, setPriceMax] = useState(200000);
  const [, navigate] = useLocation();

  // Extract unique brands from catalog
  const BRANDS = ["All Brands", ...Array.from(new Set(VAULT_CATALOG.map(p => p.brand))).sort()];

  // Parse price string to number for filtering
  const parsePrice = (priceStr: string): number => {
    const clean = priceStr.replace(/[^0-9.]/g, "");
    return clean ? parseFloat(clean) : 0;
  };

  const filtered = VAULT_CATALOG.filter(p => {
    const catMatch = activeCategory === "all" || p.category === activeCategory;
    const brandMatch = activeBrand === "all" || p.brand === activeBrand;
    const price = parsePrice(p.price);
    const priceMatch = price === 0 || price <= priceMax; // POA items always show
    return catMatch && brandMatch && priceMatch;
  });

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={CAP_LOGO} alt="CAP" style={{ height: "36px", width: "36px", objectFit: "contain" }} />
          </button>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            Club Vault · Luxury Affiliate
          </div>
          <button onClick={() => navigate("/feed")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.4rem 1rem", cursor: "pointer" }}>
            ← Feed
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: "100px", paddingBottom: "3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container">
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
            Private Members Only
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "#ffffff", lineHeight: 1.1, marginBottom: "1rem" }}>
            The Club Vault
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.35)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.8 }}>
            Real brands. Real commissions. No fakes. No bust-downs. Every click tracked. Every sale deposited.
          </p>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            21st Century Robin Hood · Free 100,000 dads from the 9-5 cage
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <div style={{ position: "sticky", top: "60px", zIndex: 50, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.75rem 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Category chips */}
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "0.1rem" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  background: activeCategory === cat.id ? "#ffffff" : "transparent",
                  color: activeCategory === cat.id ? "#000000" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${activeCategory === cat.id ? "#ffffff" : "rgba(255,255,255,0.12)"}`,
                  padding: "0.35rem 0.9rem", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Brand filter chips */}
          <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", scrollbarWidth: "none", alignItems: "center", paddingBottom: "0.1rem" }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>Brand</span>
            {BRANDS.map(brand => {
              const key = brand === "All Brands" ? "all" : brand;
              const active = activeBrand === key;
              return (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(key)}
                  style={{
                    flexShrink: 0,
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem",
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    background: active ? "rgba(212,175,55,0.15)" : "transparent",
                    color: active ? "#d4af37" : "rgba(255,255,255,0.3)",
                    border: `1px solid ${active ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.08)"}`,
                    padding: "0.25rem 0.7rem", cursor: "pointer",
                    borderRadius: "2px",
                    transition: "all 0.2s",
                  }}
                >
                  {brand}
                </button>
              );
            })}
            {activeBrand !== "all" && (
              <button
                onClick={() => { setActiveBrand("all"); setPriceMax(200000); }}
                style={{ flexShrink: 0, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(254,44,85,0.7)", background: "transparent", border: "1px solid rgba(254,44,85,0.3)", padding: "0.25rem 0.7rem", cursor: "pointer", borderRadius: "2px" }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Price range slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>Max Price</span>
            <input
              type="range"
              min={0}
              max={200000}
              step={500}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#d4af37", cursor: "pointer", maxWidth: "200px" }}
            />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", flexShrink: 0, minWidth: "80px" }}>
              {priceMax >= 200000 ? "No limit" : `$${priceMax.toLocaleString()}`}
            </span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="container" style={{ padding: "3rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(255,255,255,0.25)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic" }}>
            No products in this category yet. Coming soon.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>
          © 2026 Create AI Profit LLC · All affiliate links tracked · Commissions auto-deposited
        </div>
      </footer>

      {/* AVATAR INTRO OVERLAY */}
      {selectedProduct && (
        <AvatarIntro
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
