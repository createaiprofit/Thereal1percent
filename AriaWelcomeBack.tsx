import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { playVoice } from "@/lib/audioManager";

const ARIA_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/airria_red_757e847f_29dee1ff.jpg";
const ARIA_VOICE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_login_voice_8bfb7b7e.wav";
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

const PROMPTS = [
  {
    id: "social",
    icon: "🏆",
    label: "Enter the Club",
    sub: "Social feed, live events, your earnings dashboard — the full playground.",
    dest: "/social",
    color: "#c9a84c",
    glow: "rgba(201,168,76,0.35)",
  },
  {
    id: "checkmate",
    icon: "♟",
    label: "Watch CheckMate",
    sub: "21-episode mini-series. Eight moguls. One system. No excuses.",
    dest: "/checkmate",
    color: "#7b2d8b",
    glow: "rgba(123,45,139,0.35)",
  },
  {
    id: "vault",
    icon: "💎",
    label: "Hit the Vault",
    sub: "Luxury drops, affiliate income, Club Vault — stack while you browse.",
    dest: "/vault",
    color: "#4a9eff",
    glow: "rgba(74,158,255,0.35)",
  },
];

export default function AriaWelcomeBack() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const [ariaVisible, setAriaVisible] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [promptsVisible, setPromptsVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // Cinematic entrance
  useEffect(() => {
    const t1 = setTimeout(() => setAriaVisible(true), 150);
    const t2 = setTimeout(() => {
      setGreetingVisible(true);
      void playVoice(ARIA_VOICE, 0.9);
    }, 700);
    const t3 = setTimeout(() => setPromptsVisible(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleSelect = (dest: string, id: string) => {
    setSelected(id);
    setTimeout(() => navigate(dest), 600);
  };

  const firstName = user?.name?.split(" ")[0] || "millionaire";

  if (loading) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 30%, rgba(180,140,80,0.08) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* CAP Logo top */}
      <img src={CAP_LOGO} alt="CAP" style={{
        position: "absolute", top: "1.5rem", left: "50%", transform: "translateX(-50%)",
        height: "36px", width: "36px", objectFit: "contain", opacity: 0.6,
      }} />

      {/* Aria image */}
      <div style={{
        opacity: ariaVisible ? 1 : 0,
        transform: ariaVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "1.5rem",
        position: "relative",
      }}>
        {/* Glow ring behind Aria */}
        <div style={{
          position: "absolute", inset: "-12px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
          animation: "ariaGlow 3s ease-in-out infinite",
        }} />
        <img
          src={ARIA_IMG}
          alt="Aria Rabbit"
          style={{
            height: "200px",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 24px rgba(201,168,76,0.3))",
            position: "relative",
          }}
        />
      </div>

      {/* Greeting */}
      <div style={{
        opacity: greetingVisible ? 1 : 0,
        transform: greetingVisible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.6s ease",
        textAlign: "center",
        marginBottom: "2.5rem",
      }}>
        <div style={{
          fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem",
        }}>
          Aria Rabbit · CFO &amp; Daily Operations Director
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: 300, color: "#ffffff",
          letterSpacing: "0.04em", lineHeight: 1.3,
        }}>
          Welcome back,{" "}
          <em style={{ fontStyle: "italic", color: "rgba(201,168,76,0.9)" }}>
            {firstName}.
          </em>
        </div>
        <div style={{
          fontSize: "0.75rem", color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.1em", marginTop: "0.5rem",
        }}>
          Where are we going today?
        </div>
      </div>

      {/* 3 Prompt Cards */}
      <div style={{
        opacity: promptsVisible ? 1 : 0,
        transform: promptsVisible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s ease",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        {PROMPTS.map((p) => {
          const isHovered = hoveredId === p.id;
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.dest, p.id)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: isSelected
                  ? p.color
                  : isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected || isHovered ? p.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s ease",
                boxShadow: isHovered || isSelected ? `0 0 20px ${p.glow}` : "none",
                transform: isSelected ? "scale(0.98)" : "scale(1)",
              }}
            >
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.85rem", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: isSelected ? "#000000" : "#ffffff",
                  marginBottom: "0.2rem",
                }}>
                  {p.label}
                </div>
                <div style={{
                  fontSize: "0.7rem",
                  color: isSelected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.35)",
                  lineHeight: 1.5,
                }}>
                  {p.sub}
                </div>
              </div>
              <span style={{
                fontSize: "0.9rem",
                color: isSelected ? "#000000" : "rgba(255,255,255,0.2)",
                transition: "transform 0.2s ease",
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
              }}>→</span>
            </button>
          );
        })}
      </div>

      {/* Footer skip */}
      <div style={{
        opacity: promptsVisible ? 1 : 0,
        transition: "opacity 0.7s ease 0.3s",
        marginTop: "2rem",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.15)",
        cursor: "pointer",
      }}
        onClick={() => navigate("/social")}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.15)"; }}
      >
        Skip → Enter the Club
      </div>

      <style>{`
        @keyframes ariaGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
