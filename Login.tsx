import { useEffect, useRef, useState } from "react";
import { playVoice } from "@/lib/audioManager";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

// Aria Rabbit — Coruscant queen. Outfit rotates every 3 days.
const ARIA_OUTFITS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/airria_red_757e847f_29dee1ff.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/airria_red_757e847f_29dee1ff.jpg",
];
const ARIA_IMG = ARIA_OUTFITS[Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 3)) % ARIA_OUTFITS.length];
const ARIA_VOICE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_login_voice_8bfb7b7e.wav";
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

const ECV_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

const ARIA_LINES = [
  "Welcome to the playground,",
  "millionaire.",
];

const POLICY_BULLETS = [
  { icon: "💰", label: "You get 40% of gross.", sub: "We keep 60. Paid to breathe — log in, scroll, cash flows." },
  { icon: "🏆", label: "Enterprise bonus: $500 every 3 days.", sub: "Hit 5 hours active + 150 comments (30/hr). Easy money." },
  { icon: "📵", label: "No screenshots. No leaks. No scams.", sub: "Break it — wallet zero, permanent ban, no appeal." },
  { icon: "🤖", label: "All AI content is ours.", sub: "Avatars, bots, series — copyrighted by E Capital Venture LLC. Steal? We sue." },
  { icon: "🔒", label: "Your data stays private.", sub: "Email, login, scroll time — used for payouts only. Never sold." },
];

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [phase, setPhase] = useState<"aria" | "terms" | "ready">("aria");
  const [termsChecked, setTermsChecked] = useState(false);
  const [ariaVisible, setAriaVisible] = useState(false);
  const [line1Visible, setLine1Visible] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, loading, navigate]);

  // Cinematic entrance sequence
  useEffect(() => {
    const t1 = setTimeout(() => setAriaVisible(true), 200);
    const t2 = setTimeout(() => setLine1Visible(true), 900);
    const t3 = setTimeout(() => setLine2Visible(true), 1600);
    const t4 = setTimeout(() => {
      playVoice(ARIA_VOICE);
      setGlowPulse(true);
    }, 1800);
    const t5 = setTimeout(() => setGlowPulse(false), 3800);
    const t6 = setTimeout(() => setPhase("terms"), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
  }, []);

  const handleEnter = () => {
    if (!termsChecked) return;
    window.location.href = getLoginUrl();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      {/* Ambient glow — pulses when voice fires */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: glowPulse
          ? "radial-gradient(ellipse at 50% 55%, rgba(30,49,64,0.35) 0%, rgba(148,163,170,0.08) 40%, transparent 70%)"
          : "radial-gradient(ellipse at 50% 55%, rgba(30,49,64,0.12) 0%, transparent 70%)",
        transition: "background 1.2s ease",
        pointerEvents: "none",
      }} />

      {/* Scanline overlay — cinematic texture */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* CAP Logo */}
      <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{
        position: "absolute", top: "1.5rem", left: "50%", transform: "translateX(-50%)",
        height: "44px", width: "44px", objectFit: "contain",
        filter: "drop-shadow(0 0 10px rgba(200,210,255,0.25))",
        zIndex: 10,
      }} />

      {/* Aria — full cinematic entrance */}
      <div style={{
        opacity: ariaVisible ? 1 : 0,
        transform: ariaVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
        transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative", zIndex: 5,
        marginBottom: phase === "terms" ? "1.25rem" : "2rem",
      }}>
        {/* Aria image */}
        <img
          src={ARIA_IMG}
          alt="Aria Rabbit"
          style={{
            height: phase === "terms" ? "220px" : "300px",
            width: "auto",
            objectFit: "contain",
            filter: `drop-shadow(0 20px 60px rgba(0,0,0,0.9)) ${glowPulse ? "drop-shadow(0 0 40px rgba(180,140,255,0.25))" : ""}`,
            transition: "height 0.6s ease, filter 0.6s ease",
            display: "block",
          }}
        />
        {/* Floor glow */}
        <div style={{
          position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)",
          width: "140px", height: "16px",
          background: "radial-gradient(ellipse, rgba(148,163,170,0.22) 0%, transparent 70%)",
        }} />
      </div>

      {/* Aria's opening line */}
      <div style={{
        textAlign: "center",
        maxWidth: "420px",
        padding: "0 1.5rem",
        position: "relative", zIndex: 5,
      }}>
        {/* Line 1 */}
        <div style={{
          opacity: line1Visible ? 1 : 0,
          transform: line1Visible ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.7s ease",
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
          fontWeight: 700,
          color: "rgba(233,242,244,0.8)",
          lineHeight: 1.15,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {ARIA_LINES[0]}
        </div>
        {/* Line 2 — gold accent */}
        <div style={{
          opacity: line2Visible ? 1 : 0,
          transition: "all 0.7s ease",
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#E9F2F4",
          lineHeight: 1.1,
          marginBottom: "0.5rem",
          letterSpacing: "0.03em",
          transform: line2Visible ? "translateY(0) skewX(-10deg)" : "translateY(8px) skewX(-10deg)",
          display: "inline-block",
          textShadow: "0 2px 20px rgba(148,163,170,0.3), 0 0 60px rgba(148,163,170,0.1)",
        }}>
          {ARIA_LINES[1]}
        </div>
        <div style={{
          opacity: line2Visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.3s",
          fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase",
          color: "rgba(148,163,170,0.55)", marginBottom: "2rem",
          fontFamily: "'Inter', sans-serif",
        }}>
          — Aria Rabbit · E Capital Venture
        </div>

        {/* ─── TERMS GATE ─────────────────────────────────────────── */}
        {(phase === "terms" || phase === "ready") && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>

            {/* Policy bullets */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "1.25rem 1.25rem 0.75rem",
              marginBottom: "1.25rem",
              textAlign: "left",
            }}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>
                Before you touch anything — read this.
              </div>
              {POLICY_BULLETS.map((b, i) => (
                <div key={i} style={{
                  display: "flex", gap: "0.75rem", alignItems: "flex-start",
                  marginBottom: "0.85rem",
                }}>
                  <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: "1px" }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em", marginBottom: "0.15rem" }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
                      {b.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkbox */}
            <label style={{
              display: "flex", alignItems: "flex-start", gap: "0.75rem",
              cursor: "pointer", marginBottom: "1.25rem", textAlign: "left",
            }}>
              <div
                onClick={() => setTermsChecked(c => !c)}
                style={{
                  width: "18px", height: "18px", flexShrink: 0,
                  border: `1px solid ${termsChecked ? "#ffffff" : "rgba(255,255,255,0.3)"}`,
                  background: termsChecked ? "#ffffff" : "transparent",
                  borderRadius: "2px", marginTop: "2px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {termsChecked && (
                  <span style={{ color: "#000000", fontSize: "11px", fontWeight: 900, lineHeight: 1 }}>✓</span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>
                  Privacy Policy
                </a>
                . Non-negotiable. Break the rules — you're out.
              </span>
            </label>

            {/* CTA */}
            <button
              onClick={handleEnter}
              disabled={!termsChecked}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                background: termsChecked ? "#ffffff" : "rgba(255,255,255,0.06)",
                color: termsChecked ? "#000000" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: termsChecked ? "pointer" : "not-allowed",
                fontSize: "0.8rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: "'Rajdhani', sans-serif",
                transition: "all 0.3s ease",
                marginBottom: "0.75rem",
              }}
              onMouseEnter={e => { if (termsChecked) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {termsChecked ? "Click 'I Agree' — Enter the System →" : "Check the box. Or stay broke."}
            </button>

            <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)", textAlign: "center", lineHeight: 1.6 }}>
              E Capital Venture LLC · Private Platform · All AI content is proprietary
            </div>
          </div>
        )}

        {/* Waiting pulse before terms appear */}
        {phase === "aria" && (
          <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
