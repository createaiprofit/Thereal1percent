import { useState } from "react";
import { Link } from "wouter";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";

// ─── EPISODE DATA ─────────────────────────────────────────────────────────────
// Set videoUrl to a YouTube/Vimeo embed URL to make an episode live.
// Leave videoUrl as "" to keep it locked (coming soon).
// Set isFinale: true on ep 21 — The Prince reveal.
const EPISODES = [
  {
    ep: 1,
    title: "The Board Is Set",
    desc: "Every empire starts with a single move. Learn the system that turns AI into passive income — before anyone else sees it coming.",
    videoUrl: "", // paste YouTube embed URL here when ready
    affiliate: { label: "Get the AI Starter Kit", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 2,
    title: "Pawns & Players",
    desc: "Most people are pawns. A few become players. This episode breaks down the difference — and how to switch sides permanently.",
    videoUrl: "",
    affiliate: { label: "Club Vault — Power Tools", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 3,
    title: "The Opening Gambit",
    desc: "Tad and the crew map out the first 90 days. Three income streams. Zero excuses. The game plan is live.",
    videoUrl: "",
    affiliate: { label: "90-Day Blueprint", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 4,
    title: "Control the Center",
    desc: "In chess and in business, whoever controls the center controls the game. This episode is about positioning — before the money moves.",
    videoUrl: "",
    affiliate: { label: "Positioning Course", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 5,
    title: "The Knight's Move",
    desc: "The knight is the only piece that jumps over obstacles. This episode is about unconventional moves that your competition never sees coming.",
    videoUrl: "",
    affiliate: { label: "Crypto Jump-Start Pack", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 6,
    title: "Sacrifice to Win",
    desc: "Every grandmaster knows: sometimes you give up a piece to win the game. What are you willing to sacrifice for financial freedom?",
    videoUrl: "",
    affiliate: { label: "Freedom Framework", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 7,
    title: "The Bishop's Diagonal",
    desc: "Wealth doesn't move in straight lines. It moves diagonally — through relationships, leverage, and timing. Learn to read the board.",
    videoUrl: "",
    affiliate: { label: "Network Leverage Guide", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 8,
    title: "Castling",
    desc: "The only move where two pieces move at once. This episode covers the double-play: protect your assets while advancing your position.",
    videoUrl: "",
    affiliate: { label: "Asset Protection Vault", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 9,
    title: "The Rook's Straight Line",
    desc: "Power moves in straight lines when the path is clear. This episode is about clearing the board — eliminating what's blocking your income.",
    videoUrl: "",
    affiliate: { label: "Income Blocker Audit", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 10,
    title: "Mid-Game Pressure",
    desc: "The mid-game is where most people fold. This episode is about applying relentless pressure — in business, in crypto, in life.",
    videoUrl: "",
    affiliate: { label: "Crypto Pressure Plays", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 11,
    title: "Tempo & Initiative",
    desc: "Whoever has the initiative controls the tempo. Stop reacting — start dictating. This episode is about seizing the moment.",
    videoUrl: "",
    affiliate: { label: "Initiative Playbook", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 12,
    title: "The Passed Pawn",
    desc: "A pawn that can't be stopped becomes a queen. This episode is about identifying your passed pawn — the one asset that changes everything.",
    videoUrl: "",
    affiliate: { label: "Asset Multiplier System", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 13,
    title: "Zugzwang",
    desc: "Sometimes every move your enemy makes hurts them. This episode is about creating situations where your competition has no good options.",
    videoUrl: "",
    affiliate: { label: "Competitive Moat Builder", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 14,
    title: "The Endgame Begins",
    desc: "The endgame is where preparation meets execution. Everything you've built is about to pay off — if you've been paying attention.",
    videoUrl: "",
    affiliate: { label: "Endgame Execution Pack", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 15,
    title: "King & Pawn",
    desc: "Strip away everything — it comes down to the king and a pawn. This episode is about the fundamentals that never change, no matter the market.",
    videoUrl: "",
    affiliate: { label: "Fundamentals Masterclass", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 16,
    title: "Opposition",
    desc: "In chess, opposition is about positioning your king to dominate. In business, it's about being exactly where your competitor isn't.",
    videoUrl: "",
    affiliate: { label: "Market Gap Finder", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 17,
    title: "Promotion",
    desc: "When a pawn reaches the other side, it becomes anything it wants. This episode is about the moment of transformation — and how to trigger it.",
    videoUrl: "",
    affiliate: { label: "Transformation Toolkit", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 18,
    title: "The Quiet Move",
    desc: "The most powerful moves are often the quietest. This episode is about the silent plays that build generational wealth — no announcement needed.",
    videoUrl: "",
    affiliate: { label: "Silent Wealth Strategies", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 19,
    title: "Forced Moves",
    desc: "Sometimes the board forces your hand. This episode is about turning forced moves into opportunities — and why constraints create creativity.",
    videoUrl: "",
    affiliate: { label: "Constraint Advantage Guide", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 20,
    title: "One Move Away",
    desc: "You're one move from checkmate. Everything has been leading here. The Prince has been watching the whole time. Are you ready?",
    videoUrl: "",
    affiliate: { label: "Final Position Prep", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: false,
  },
  {
    ep: 21,
    title: "CheckMate — The Prince Revealed",
    desc: "The finale. The Prince steps out of the shadows. The system is complete. The board is yours.",
    videoUrl: "", // LOCKED until finale — The Prince reveal
    affiliate: { label: "Join the Inner Circle", url: "https://ecapitalventure.com/vault" },
    locked: true,
    isFinale: true,
  },
];

// ─── EPISODE CARD ─────────────────────────────────────────────────────────────
function EpisodeCard({ ep, onSelect }: { ep: typeof EPISODES[0]; onSelect: (ep: typeof EPISODES[0]) => void }) {
  const isLive = !!ep.videoUrl;
  return (
    <div
      onClick={() => onSelect(ep)}
      style={{
        background: ep.isFinale
          ? "linear-gradient(135deg, rgba(180,140,60,0.12) 0%, rgba(0,0,0,0.95) 100%)"
          : "rgba(255,255,255,0.02)",
        border: ep.isFinale
          ? "1px solid rgba(180,140,60,0.4)"
          : isLive
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: "6px",
        padding: "1.25rem",
        cursor: "pointer",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = ep.isFinale ? "rgba(180,140,60,0.7)" : "rgba(255,255,255,0.25)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = ep.isFinale ? "rgba(180,140,60,0.4)" : isLive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Episode number */}
      <div style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "0.75rem",
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: ep.isFinale ? "rgba(180,140,60,0.8)" : "rgba(255,255,255,0.25)",
        marginBottom: "0.4rem",
      }}>
        {ep.isFinale ? "★ FINALE" : `EP ${String(ep.ep).padStart(2, "0")}`}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.05rem",
        fontWeight: 600,
        color: ep.isFinale ? "rgba(220,190,100,1)" : "#ffffff",
        marginBottom: "0.5rem",
        lineHeight: 1.3,
      }}>
        {ep.isFinale ? "??? — The Prince Revealed" : ep.title}
      </div>

      {/* Description */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "0.95rem",
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.6,
        marginBottom: "0.75rem",
      }}>
        {ep.isFinale ? "The finale. The Prince steps out of the shadows. The system is complete. The board is yours." : ep.desc}
      </div>

      {/* Status badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isLive ? (
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#4ade80",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: "3px",
            padding: "0.2rem 0.5rem",
          }}>▶ Watch Now</span>
        ) : (
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: ep.isFinale ? "rgba(180,140,60,0.7)" : "rgba(255,255,255,0.25)",
            background: ep.isFinale ? "rgba(180,140,60,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${ep.isFinale ? "rgba(180,140,60,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "3px",
            padding: "0.2rem 0.5rem",
          }}>{ep.isFinale ? "🔒 Finale — Coming Soon" : "🔒 Coming Soon"}</span>
        )}
      </div>
    </div>
  );
}

// ─── EPISODE MODAL ────────────────────────────────────────────────────────────
function EpisodeModal({ ep, onClose }: { ep: typeof EPISODES[0]; onClose: () => void }) {
  const isLive = !!ep.videoUrl;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0a0a0a",
          border: ep.isFinale ? "1px solid rgba(180,140,60,0.4)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          maxWidth: "720px",
          width: "100%",
          padding: "2rem",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            fontSize: "1.2rem", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif",
          }}
        >✕</button>

        {/* Ep label */}
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase",
          color: ep.isFinale ? "rgba(180,140,60,0.8)" : "rgba(255,255,255,0.3)",
          marginBottom: "0.5rem",
        }}>
          {ep.isFinale ? "★ SERIES FINALE" : `Episode ${ep.ep} of 21`}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 300,
          color: ep.isFinale ? "rgba(220,190,100,1)" : "#ffffff",
          marginBottom: "1rem",
        }}>
          {ep.isFinale ? "CheckMate — The Prince Revealed" : ep.title}
        </h2>

        {/* Video or locked state */}
        {isLive ? (
          <div style={{
            position: "relative", paddingBottom: "56.25%", height: 0,
            overflow: "hidden", borderRadius: "6px", marginBottom: "1.5rem",
            background: "#000",
          }}>
            <iframe
              src={ep.videoUrl}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{
            background: ep.isFinale
              ? "linear-gradient(135deg, rgba(180,140,60,0.08) 0%, rgba(0,0,0,0.9) 100%)"
              : "rgba(255,255,255,0.02)",
            border: ep.isFinale ? "1px solid rgba(180,140,60,0.2)" : "1px solid rgba(255,255,255,0.06)",
            borderRadius: "6px",
            padding: "3rem 2rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              {ep.isFinale ? "♛" : "🔒"}
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem",
              color: ep.isFinale ? "rgba(220,190,100,0.8)" : "rgba(255,255,255,0.4)",
              fontStyle: "italic",
            }}>
              {ep.isFinale
                ? "The Prince has not yet revealed himself. The finale drops when the board is set."
                : "This episode drops soon. The board is being set."}
            </div>
          </div>
        )}

        {/* Description */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.05rem",
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
        }}>
          {ep.desc}
        </p>

        {/* Affiliate CTA */}
        <a
          href={ep.affiliate.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            background: ep.isFinale ? "rgba(180,140,60,0.15)" : "rgba(255,255,255,0.06)",
            border: ep.isFinale ? "1px solid rgba(180,140,60,0.4)" : "1px solid rgba(255,255,255,0.12)",
            color: ep.isFinale ? "rgba(220,190,100,1)" : "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "4px",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {ep.affiliate.label} →
        </a>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CheckMate() {
  const [selectedEp, setSelectedEp] = useState<typeof EPISODES[0] | null>(null);
  const liveCount = EPISODES.filter(e => !!e.videoUrl).length;

  return (
    <div style={{ background: "#000000", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{ height: "36px", width: "36px", objectFit: "contain", cursor: "pointer" }} />
          </Link>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "0.15em",
          }}>
            CheckMate
          </div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}>
            {liveCount}/21 Live
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: "120px",
        paddingBottom: "4rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Gold radial glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse, rgba(180,140,60,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          {/* Chess icon */}
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>♛</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.95rem",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem",
          }}>
            E Capital Venture Presents
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
            lineHeight: 1,
          }}>
            CheckMate
          </h1>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            fontStyle: "italic",
            color: "rgba(220,190,100,0.8)",
            marginBottom: "1.5rem",
          }}>
            A 21-Episode Mini-Series · Coming Soon
          </div>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.55)",
            maxWidth: "560px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.8,
          }}>
            The game was always rigged. CheckMate teaches you how to flip the board — AI income, passive cash flow, and the principles that separate the 1% from everyone else. 21 episodes. One reveal. The Prince has been watching.
          </p>

          {/* Trailer placeholder */}
          <div style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(180,140,60,0.25)",
            borderRadius: "8px",
            padding: "3rem 2rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "rgba(180,140,60,0.6)" }}>▶</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              color: "rgba(220,190,100,0.7)",
              fontStyle: "italic",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}>
              Official Trailer — Coming Soon
            </div>
            <div style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}>
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* The Prince teaser */}
      <section style={{
        padding: "3rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, rgba(180,140,60,0.03) 0%, transparent 100%)",
      }}>
        <div className="container" style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: "80px", height: "80px",
            background: "rgba(180,140,60,0.08)",
            border: "1px solid rgba(180,140,60,0.3)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2rem",
          }}>
            ?
          </div>
          <div style={{
            fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(180,140,60,0.6)", marginBottom: "0.75rem",
          }}>
            Your Host
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 300,
            color: "rgba(220,190,100,0.9)",
            marginBottom: "1rem",
          }}>
            The Prince
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8,
          }}>
            He's been in the room the whole time. Architect. Operator. The man behind the system. His identity stays hidden until the finale — Episode 21. Every episode is a clue. Every move is intentional. The board is set.
          </p>
        </div>
      </section>

      {/* Episode Grid */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem",
            }}>
              All 21 Episodes
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 300,
              color: "#ffffff",
            }}>
              The Full Series
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {EPISODES.map(ep => (
              <EpisodeCard key={ep.ep} ep={ep} onSelect={setSelectedEp} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        padding: "4rem 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
      }}>
        <div className="container">
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
            fontWeight: 300,
            color: "rgba(220,190,100,0.8)",
            marginBottom: "0.5rem",
            fontStyle: "italic",
          }}>
            "The prince who relies on fortune is ruined when she changes."
          </div>
          <div style={{
            fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)", marginBottom: "2rem",
          }}>
            — Machiavelli
          </div>
          <Link href="/vault">
            <button style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              background: "rgba(180,140,60,0.12)",
              border: "1px solid rgba(180,140,60,0.4)",
              color: "rgba(220,190,100,1)",
              padding: "0.85rem 2.5rem",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Enter Club Vault →
            </button>
          </Link>
        </div>
      </section>

      {/* Episode modal */}
      {selectedEp && (
        <EpisodeModal ep={selectedEp} onClose={() => setSelectedEp(null)} />
      )}
    </div>
  );
}
