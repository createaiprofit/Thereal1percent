import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";

const CITY_SQUAD_IMGS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_miami_5df563af.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_atlanta_e73cfc94.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_vegas_54c9303f.png",
];

const PERKS = [
  { icon: "◈", label: "Private TikTok-Style Feed", desc: "Lifestyle posts, money talk, and Machiavellian moves — members only." },
  { icon: "◇", label: "40% Earnings Share", desc: "Bot revenue flows into your in-app wallet automatically. No work required." },
  { icon: "✦", label: "Affiliate Store Access", desc: "Wellness, designer fashion, jewelry, real estate — all tracked and commissioned." },
  { icon: "⬡", label: "Real Estate & Airbnb", desc: "Assignment contracts and sublease plays — no mortgage, no bank." },
  { icon: "◉", label: "Confidence Cologne Pre-Order", desc: "Members get first access to the $300 bottle before public launch." },
  { icon: "⌂", label: "Concierge Services", desc: "Yachts, jets, private galas — curated by the platform for members." },
];

export default function Subscribe() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const walletQuery = trpc.wallet.balance.useQuery(undefined, { enabled: isAuthenticated });
  const subscribeMutation = trpc.wallet.subscribe.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => navigate("/social"), 2000);
    },
    onError: (err) => setError(err.message),
  });

  const balance = walletQuery.data?.balance ?? 0;
  const fee = parseFloat(walletQuery.data?.monthlyFee ?? "29.99");
  const isSubscriber = walletQuery.data?.isSubscriber ?? false;
  const canAfford = balance >= fee;

  if (success) {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#ffffff", marginBottom: "0.5rem" }}>Welcome to the Club.</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,180,120,0.8)" }}>Entering the 1% Playground…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={CAP_LOGO} alt="CAP" style={{ height: "36px", width: "36px", objectFit: "contain", cursor: "pointer" }} onClick={() => navigate("/")} />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Membership
          </div>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            ← Home
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "5rem 0 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Velvet glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(200,180,120,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.7em", textTransform: "uppercase", color: "rgba(200,180,120,0.6)", marginBottom: "1rem" }}>
            Invite Only
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem", lineHeight: 1.1 }}>
            The 1% Playground
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Private country club. Bot-funded subscriptions. Your 40% share — paid into your wallet. No credit card needed.
          </p>

          {/* Avatar row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "3rem" }}>
            {CITY_SQUAD_IMGS.map((img, i) => (
              <img key={i} src={img} alt="Host" style={{
                width: "60px", height: "78px", objectFit: "cover", objectPosition: "top",
                border: "1px solid rgba(200,180,120,0.3)",
                filter: "brightness(0.9)",
              }} />
            ))}
          </div>

          {/* Velvet rope divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,180,120,0.4))" }} />
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,180,120,0.5)" }}>
              ◈ Members Only ◈
            </div>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,180,120,0.4))" }} />
          </div>
        </div>
      </div>

      {/* Main content: perks + subscription card */}
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "start", paddingBottom: "5rem", maxWidth: "900px", margin: "0 auto" }}>

        {/* Perks */}
        <div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1.5rem" }}>
            What's Inside
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
            {PERKS.map(perk => (
              <div key={perk.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgba(200,180,120,0.7)", flexShrink: 0, width: "24px", textAlign: "center" }}>{perk.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff", marginBottom: "0.2rem" }}>{perk.label}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{perk.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription card */}
        <div style={{
          width: "280px", flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(200,180,120,0.25)",
          padding: "2rem",
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,180,120,0.6)", marginBottom: "1rem" }}>
            Monthly Access
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", color: "#ffffff", marginBottom: "0.25rem" }}>
            ${fee.toFixed(2)}
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}>
            Per Month · Auto-renewed from wallet
          </div>

          {/* Wallet balance */}
          {isAuthenticated && (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              padding: "0.75rem", marginBottom: "1.25rem",
            }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.3rem" }}>
                Your Wallet Balance
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: canAfford ? "#4ade80" : "#f87171" }}>
                ${balance.toFixed(2)}
              </div>
              {!canAfford && (
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", color: "rgba(248,113,113,0.8)", marginTop: "0.3rem" }}>
                  Need ${(fee - balance).toFixed(2)} more — bots are earning for you
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", color: "#f87171", marginBottom: "1rem", padding: "0.5rem", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
              {error}
            </div>
          )}

          {isSubscriber ? (
            <button
              onClick={() => navigate("/social")}
              style={{
                width: "100%", padding: "0.9rem",
                background: "#ffffff", color: "#000000",
                border: "none", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Enter the Club →
            </button>
          ) : isAuthenticated ? (
            <button
              onClick={() => { setError(null); subscribeMutation.mutate(); }}
              disabled={subscribeMutation.isPending || !canAfford}
              style={{
                width: "100%", padding: "0.9rem",
                background: canAfford ? "#ffffff" : "rgba(255,255,255,0.1)",
                color: canAfford ? "#000000" : "rgba(255,255,255,0.3)",
                border: canAfford ? "none" : "1px solid rgba(255,255,255,0.1)",
                cursor: canAfford ? "pointer" : "not-allowed",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginBottom: "0.75rem",
                transition: "all 0.2s",
              }}
            >
              {subscribeMutation.isPending ? "Processing…" : canAfford ? "Activate Membership" : "Insufficient Balance"}
            </button>
          ) : (
            <button
              onClick={() => { window.location.href = getLoginUrl(); }}
              style={{
                width: "100%", padding: "0.9rem",
                background: "#ffffff", color: "#000000",
                border: "none", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Login to Join
            </button>
          )}

          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
            No credit card. Subscription paid from your in-app wallet. Bots fund your balance.
          </div>
        </div>
      </div>
    </div>
  );
}
