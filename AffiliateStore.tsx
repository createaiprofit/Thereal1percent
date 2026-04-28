import { Link } from "wouter";
import { toast } from "sonner";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_wg_instagram_aefdf251.png";
const COLOGNE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/confidence_cologne-K4fKhGR4jJ6dvsT5iqjnYh.webp";

// ─── STORE CATEGORIES ─────────────────────────────────────────────────────────
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