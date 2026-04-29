import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";
const ARIA_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/airria_red_757e847f_29dee1ff.jpg";

const AVATARS = [
  { id: "black", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_strategist_v2_f604e7ae.png", handle: "@cap.atlanta" },
  { id: "russian", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_ghost_v2_9e1a75d9.png", handle: "@cap.moscow" },
  { id: "italian", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_consigliere_v2_53216103.png", handle: "@cap.milan" },
  { id: "mexican", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_mexican_v2_66a744ae.png", handle: "@cap.mexico" },
  { id: "romanian", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_phantom_new_d9d4d3e3.jpg", handle: "@cap.bucharest" },
  { id: "visionary_mx", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_visionary_mexican_new_38cb3b37.jpg", handle: "@cap.losangeles" },
];

const POSTS = [
  { avatar: AVATARS[0], text: "AI doesn't sleep. Your income shouldn't either. Position yourself before the app drops. #CreateAIProfit", likes: "12.4K", time: "2m ago" },
  { avatar: AVATARS[1], text: "Cold system. Hot returns. The flywheel is already spinning — you just need to plug in. #CAP", likes: "8.7K", time: "5m ago" },
  { avatar: AVATARS[2], text: "Design the system. Let it run. Every hour you wait is an hour someone else is stacking. #AIProfit", likes: "21.1K", time: "9m ago" },
  { avatar: AVATARS[3], text: "Build what pays you while you sleep. The app is almost here. Get positioned first. #CreateAIProfit", likes: "15.3K", time: "14m ago" },
  { avatar: AVATARS[4], text: "Three moves ahead. Always. The ones who win are the ones who moved early. #CAP", likes: "9.9K", time: "18m ago" },
  { avatar: AVATARS[5], text: "Built from nothing. Scaled to everything. The American dream doesn't wait — it's automated. #CreateAIProfit", likes: "18.6K", time: "21m ago" },
  { avatar: AVATARS[0], text: "Stack silent. Move loud. The system rewards the bold. #CreateAIProfit", likes: "33.2K", time: "22m ago" },
  { avatar: AVATARS[1], text: "Passive income isn't lazy — it's leverage. Understand the difference. #CAP", likes: "7.1K", time: "28m ago" },
  { avatar: AVATARS[2], text: "The app is coming. Your spot is not guaranteed. #AIProfit", likes: "44.8K", time: "35m ago" },
];

const ARIA_POPINS = [
  "Hey… balance is up. Keep scrolling.",
  "We're jumping on a real estate play — not advice, just intel.",
  "Your tier is almost Gold. One more move.",
  "The system is working. You just need to stay in it.",
  "Power isn't given. It's taken. You're in the right place.",
];

const TIER_COLORS: Record<string, string> = {
  silver: "#C0C0C0",
  gold: "#D4AF37",
  platinum: "#E5E4E2",
};

const FEATURE_LINKS = [
  { label: "Live", icon: "📡", coming: false, href: "/live" },
  { label: "Club Vault", icon: "💎", coming: false, href: "/vault" },
  { label: "Concierge", icon: "🎩", coming: true },
  { label: "Real Estate", icon: "🏛", coming: true },
  { label: "Dating 25 & Under", icon: "🌟", coming: true },
  { label: "Dating 55+", icon: "🥂", coming: true },
  { label: "DM / Chat", icon: "✉️", coming: true },
];

export default function Feed() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [scrollCount, setScrollCount] = useState(0);
  const [ariaPopIn, setAriaPopIn] = useState<string | null>(null);
  const [ariaVisible, setAriaVisible] = useState(false);
  const lastScrollRef = useRef(0);
  const popInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: profile } = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });

  // Authenticated subscribers go straight to the social club — Feed is a public preview
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/social");
    }
  }, [isAuthenticated, loading, navigate]);

  // Redirect to profile setup if not complete
  useEffect(() => {
    if (!loading && isAuthenticated && profile !== undefined && profile !== null && !profile.profileComplete) {
      navigate("/setup");
    }
    if (!loading && isAuthenticated && profile === null) {
      navigate("/setup");
    }
  }, [profile, loading, isAuthenticated]);

  // Aria pop-in on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrolled = Math.floor(el.scrollTop / 300);
    if (scrolled !== lastScrollRef.current) {
      const delta = scrolled - lastScrollRef.current;
      lastScrollRef.current = scrolled;
      setScrollCount(c => {
        const next = c + delta;
        // Show Aria every ~7 scroll units
        if (next % 7 === 0 && next > 0) {
          const msg = ARIA_POPINS[Math.floor(Math.random() * ARIA_POPINS.length)];
          setAriaPopIn(msg);
          setAriaVisible(true);
          if (popInTimerRef.current) clearTimeout(popInTimerRef.current);
          popInTimerRef.current = setTimeout(() => setAriaVisible(false), 4000);
        }
        return next;
      });
    }
  };

  const tier = profile?.tier ?? "silver";
  const balanceToday = parseFloat(profile?.balanceToday ?? "0");
  const displayName = profile?.displayName ?? user?.name ?? "Member";
  const avatarUrl = profile?.avatarUrl;

  return (
    <div style={{
      minHeight: "100vh", background: "#000000",
      fontFamily: "'Rajdhani', sans-serif",
      display: "flex", flexDirection: "column",
      maxWidth: "480px", margin: "0 auto",
      position: "relative",
    }}>
      {/* ── TOP NAV ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 1rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{ height: "32px", width: "32px", objectFit: "contain" }} />
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          CAP Feed
        </div>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em" }}
        >
          ← Home
        </button>
      </div>

      {/* ── USER PROFILE STRIP ── */}
      <div style={{
        padding: "1.25rem 1rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: "1rem",
      }}>
        {/* Avatar */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          border: `2px solid ${TIER_COLORS[tier]}`,
          overflow: "hidden", flexShrink: 0,
          background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.3)" }}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name + tier */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>{displayName}</span>
            <span style={{
              fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: TIER_COLORS[tier], border: `1px solid ${TIER_COLORS[tier]}`,
              padding: "1px 6px", borderRadius: "2px",
            }}>
              {tier} ✓
            </span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
            {profile?.city ?? ""}
          </div>
        </div>

        {/* Balance ticker */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.2rem" }}>
            Today
          </div>
          <div style={{
            fontSize: "1.1rem", fontWeight: 700,
            color: balanceToday > 0 ? "#4ade80" : "rgba(255,255,255,0.6)",
            fontVariantNumeric: "tabular-nums",
          }}>
            ${balanceToday.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ── FEATURE LINKS ── */}
      <div style={{
        padding: "1rem",
        display: "flex", gap: "0.5rem", overflowX: "auto",
        scrollbarWidth: "none",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {FEATURE_LINKS.map(link => (
          <button
            key={link.label}
            onClick={() => {
              if (!link.coming && (link as any).href) {
                navigate((link as any).href);
              } else {
                toast(`${link.label} — Coming Soon`);
              }
            }}
            style={{
              flexShrink: 0,
              padding: "0.5rem 0.85rem",
              background: link.coming ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
              border: link.coming ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.2)",
              color: link.coming ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)",
              fontSize: "0.75rem", letterSpacing: "0.1em",
              fontFamily: "'Rajdhani', sans-serif",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = link.coming ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = link.coming ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)";
            }}
          >
            {link.icon} {link.label}{!link.coming && " ●"}
          </button>
        ))}
      </div>

      {/* ── FEED ── */}
      <div
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}
      >
        {POSTS.map((post, i) => (
          <div key={i} style={{
            padding: "1.25rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <img
                src={post.avatar.img}
                alt={post.avatar.handle}
                style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em" }}>{post.avatar.handle}</span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{post.time}</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{post.text}</p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <button
                    onClick={() => setLiked(l => ({ ...l, [i]: !l[i] }))}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: liked[i] ? "#ffffff" : "rgba(255,255,255,0.35)",
                      fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", padding: 0,
                      display: "flex", alignItems: "center", gap: "0.35rem",
                    }}
                  >
                    {liked[i] ? "♥" : "♡"} {post.likes}
                  </button>
                  <button
                    onClick={() => toast("Share link copied!")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", padding: 0 }}
                  >
                    ↗ Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>
            More content dropping daily
          </div>
        </div>
      </div>

      {/* ── ARIA POP-IN ── */}
      <div style={{
        position: "fixed", bottom: "1.5rem", right: "1rem",
        display: "flex", alignItems: "flex-end", gap: "0.75rem",
        zIndex: 100,
        opacity: ariaVisible ? 1 : 0,
        transform: ariaVisible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: ariaVisible ? "auto" : "none",
      }}>
        <div style={{
          maxWidth: "220px",
          background: "rgba(10,10,10,0.95)",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "0.75rem 1rem",
          fontSize: "0.8rem", color: "rgba(255,255,255,0.85)",
          lineHeight: 1.5,
          position: "relative",
        }}>
          {ariaPopIn}
          {/* Tail */}
          <div style={{
            position: "absolute", bottom: "12px", right: "-6px",
            width: "12px", height: "12px",
            background: "rgba(10,10,10,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            transform: "rotate(45deg)",
            borderLeft: "none", borderTop: "none",
          }} />
        </div>
        <img
          src={ARIA_IMG}
          alt="Aria"
          style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}
        />
      </div>
    </div>
  );
}
