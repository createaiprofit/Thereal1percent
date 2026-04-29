import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { playVoice } from "@/lib/audioManager";

const COLOGNE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/confidence_cologne-K4fKhGR4jJ6dvsT5iqjnYh.webp";
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";

const AVATAR_TEASERS = [
  {
    id: "russian",
    title: "The Operator · Moscow",
    quote: "Move before clarity. Position first.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian_v2-Rb6Ap5daUpzAimXZ5VFd9v.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_russian_native_c492bf8e.wav",
  },
  {
    id: "arab",
    title: "The Sheikh · Dubai",
    quote: "Better feared than loved.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-Zcg6Ldz9pYbDG2UQ2ANSud.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_arab_native_1e22c60c.wav",
  },
  {
    id: "romanian",
    title: "The Ghost · Bucharest",
    quote: "Power rewards power. Stack silent.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian_v2-g8bwbMA2VgqXkVAcvEvdWb.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_romanian_native_51def160.wav",
  },
  {
    id: "black",
    title: "The Strategist · Atlanta",
    quote: "Deception is leverage. The blazer hides the knife.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-VaXNoNYbjxPvWy8LfMwxJ2.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_black_3f2a3d7c.wav",
  },
  {
    id: "italian",
    title: "The Architect · Milan",
    quote: "Better feared than loved — if you can't be both.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian_v2-DyN7RbwHLrsM343vrhnLj8.webp",
    voice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/voice_italian_native_8204181c.wav",
  },
];

const NOTES = [
  { top: "Oud & Black Pepper", desc: "Opens sharp. Commands attention." },
  { top: "Sandalwood & Vetiver", desc: "Warm, grounded. Built to last." },
  { top: "Ambergris & Musk", desc: "Lingers. They remember you." },
];

export default function ConfidenceCologne() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);

  const handlePreorder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleAvatarPlay = (av: typeof AVATAR_TEASERS[0]) => {
    setActiveAvatar(av.id);
    playVoice(av.voice, 0.9);
    setTimeout(() => setActiveAvatar(null), 12000);
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <img src={CAP_LOGO} alt="CAP" style={{ height: "40px", width: "40px", objectFit: "contain", cursor: "pointer" }} />
          </Link>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Confidence Cologne · Coming Soon
          </div>
          <Link href="/checkmate">
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,175,55,0.8)", cursor: "pointer" }}>
              ♛ CheckMate
            </span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        paddingTop: "80px", position: "relative", overflow: "hidden",
      }}>
        {/* Gold radial glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Tagline */}
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)", marginBottom: "1rem" }}>
          Create AI Profit · Signature Fragrance
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, letterSpacing: "0.1em", textAlign: "center", marginBottom: "0.5rem", lineHeight: 1 }}>
          Confidence
        </h1>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 300, letterSpacing: "0.1em", textAlign: "center", marginBottom: "2rem", lineHeight: 1, color: "rgba(212,175,55,0.9)" }}>
          Cologne
        </h1>

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "3rem" }}>
          2oz · $300 · Black Matte · Gold Cap · Velvet Box
        </div>

        {/* Product Image */}
        <div style={{ position: "relative", marginBottom: "3rem" }}>
          <img
            src={COLOGNE_IMG}
            alt="Confidence Cologne"
            style={{
              width: "280px", height: "280px", objectFit: "contain",
              filter: "drop-shadow(0 0 40px rgba(212,175,55,0.3))",
            }}
          />
          <div style={{
            position: "absolute", bottom: "-12px", left: "50%", transform: "translateX(-50%)",
            background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)",
            padding: "0.3rem 1.2rem", borderRadius: "2px",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(212,175,55,0.9)", whiteSpace: "nowrap",
          }}>
            Coming Soon
          </div>
        </div>

        {/* Tagline quote */}
        <p style={{ fontSize: "1.3rem", fontStyle: "italic", color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: "480px", marginBottom: "3rem", lineHeight: 1.6 }}>
          "Smell like you already won."
        </p>

        {/* Pre-order form */}
        {!submitted ? (
          <form onSubmit={handlePreorder} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1rem" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              required
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff", padding: "0.85rem 1.5rem", fontSize: "0.85rem",
                fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em",
                outline: "none", width: "280px",
              }}
            />
            <button type="submit" style={{
              background: "rgba(212,175,55,0.9)", color: "#000000",
              border: "none", padding: "0.85rem 2rem",
              fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem",
              letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700,
              cursor: "pointer",
            }}>
              Reserve My Bottle
            </button>
          </form>
        ) : (
          <div style={{
            background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
            padding: "1rem 2rem", marginBottom: "1rem", textAlign: "center",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em",
            color: "rgba(212,175,55,0.9)",
          }}>
            ✓ You're on the list. We'll notify you first.
          </div>
        )}

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          Limited first run · No mass production · Members only
        </div>
      </section>

      {/* TRAILER SECTION */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#000" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
            The Trailer
          </div>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300, marginBottom: "2rem" }}>
            Bangkok. Shanghai. New York.
          </h2>
          {/* Trailer placeholder — swap src for YouTube embed when ready */}
          <div style={{
            width: "100%", paddingBottom: "56.25%", position: "relative",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "1rem",
            }}>
              <div style={{ fontSize: "3rem", opacity: 0.15 }}>▶</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Trailer Dropping Soon
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", color: "rgba(255,255,255,0.2)", maxWidth: "300px", textAlign: "center" }}>
                6'10" · 310 lbs · One spray · No explanation needed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENT NOTES */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
              The Formula
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300 }}>Three Notes. One Statement.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {NOTES.map((note, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                padding: "2rem 1.5rem", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)", marginBottom: "0.75rem" }}>
                  Note {i + 1}
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 300, marginBottom: "0.5rem" }}>{note.top}</div>
                <div style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>{note.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVATAR TEASERS */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
              Who Wears It
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300 }}>Five Cities. One Scent.</h2>
          </div>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollbarWidth: "none", justifyContent: "center", flexWrap: "wrap" }}>
            {AVATAR_TEASERS.map(av => (
              <div
                key={av.id}
                onClick={() => handleAvatarPlay(av)}
                style={{
                  flex: "0 0 160px", textAlign: "center", cursor: "pointer",
                  background: activeAvatar === av.id ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activeAvatar === av.id ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.06)"}`,
                  padding: "1.25rem 0.75rem",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { if (activeAvatar !== av.id) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { if (activeAvatar !== av.id) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <img src={av.img} alt={av.title} style={{ width: "90px", height: "120px", objectFit: "cover", objectPosition: "top", marginBottom: "0.75rem" }} />
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.4rem" }}>
                  {av.title}
                </div>
                <div style={{ fontStyle: "italic", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
                  "{av.quote}"
                </div>
                <div style={{ marginTop: "0.75rem", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: activeAvatar === av.id ? "rgba(212,175,55,0.8)" : "rgba(255,255,255,0.2)" }}>
                  {activeAvatar === av.id ? "▶ Playing..." : "▶ Hear It"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: "1rem" }}>
            $300. 2oz. <em style={{ color: "rgba(212,175,55,0.9)" }}>Limited.</em>
          </h2>
          <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem", fontSize: "1.1rem" }}>
            "The prince who relies on fortune is ruined when she changes."<br />
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)" }}>— Machiavelli</span>
          </p>
          {!submitted ? (
            <form onSubmit={handlePreorder} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                required
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff", padding: "0.85rem 1.5rem", fontSize: "0.85rem",
                  fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em",
                  outline: "none", width: "260px",
                }}
              />
              <button type="submit" style={{
                background: "#ffffff", color: "#000000", border: "none",
                padding: "0.85rem 2.5rem", fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase",
                fontWeight: 700, cursor: "pointer",
              }}>
                Reserve Now
              </button>
            </form>
          ) : (
            <div style={{ color: "rgba(212,175,55,0.9)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.2em", fontSize: "0.9rem" }}>
              ✓ Reserved. You'll be first.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 0", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
        <Link href="/">
          <img src={CAP_LOGO} alt="CAP" style={{ height: "32px", width: "32px", objectFit: "contain", opacity: 0.4, cursor: "pointer" }} />
        </Link>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", marginTop: "0.75rem" }}>
          © 2025 Create AI Profit · All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
