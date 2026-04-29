import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";
const ARIA_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_rabbit_login-2SB454oBVX8PUWrzoTZDwE.webp";

const TIER_COLORS: Record<string, string> = {
  silver: "#C0C0C0",
  gold: "#D4AF37",
  platinum: "#E5E4E2",
};

// Simulated viewer count — oscillates realistically
function useViewerCount(base = 1247) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return Math.max(count, 100);
}

export default function Live() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const [message, setMessage] = useState("");
  const [isLive] = useState(true);
  const [streamUrl, setStreamUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const viewerCount = useViewerCount();

  const { data: profile } = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const { data: messages = [], refetch } = trpc.live.getMessages.useQuery(undefined, {
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
  const sendMessage = trpc.live.sendMessage.useMutation({
    onSuccess: () => refetch(),
    onError: () => toast("Failed to send message"),
  });
  const clearMessages = trpc.live.clearMessages.useMutation({
    onSuccess: () => { refetch(); toast("Chat cleared."); },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || sendMessage.isPending) return;
    sendMessage.mutate({ message: trimmed });
    setMessage("");
  };

  const isAdmin = user?.role === "admin";
  const displayName = profile?.displayName ?? user?.name ?? "Member";
  const tier = profile?.tier ?? "silver";

  return (
    <div style={{
      minHeight: "100vh", background: "#000000",
      fontFamily: "'Rajdhani', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── TOP NAV ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.65rem 1rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => navigate("/feed")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
            ← Feed
          </button>
          <img src={CAP_LOGO} alt="CAP" style={{ height: "28px", width: "28px", objectFit: "contain" }} />
        </div>

        {/* LIVE badge + viewer count */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isLive && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#ef4444",
                animation: "livePulse 1.5s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ef4444", fontWeight: 700 }}>
                Live
              </span>
            </div>
          )}
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
            👁 {viewerCount.toLocaleString()}
          </span>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setShowUrlInput(s => !s)}
              style={{
                padding: "0.35rem 0.75rem",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)", cursor: "pointer",
                fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Set Stream
            </button>
            <button
              onClick={() => clearMessages.mutate()}
              style={{
                padding: "0.35rem 0.75rem",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>

      {/* Admin stream URL input */}
      {showUrlInput && isAdmin && (
        <div style={{
          background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0.75rem 1rem", display: "flex", gap: "0.75rem", alignItems: "center",
        }}>
          <input
            value={streamUrl}
            onChange={e => setStreamUrl(e.target.value)}
            placeholder="Paste YouTube/Twitch/Vimeo embed URL…"
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#ffffff", padding: "0.5rem 0.75rem",
              fontSize: "0.8rem", fontFamily: "'Rajdhani', sans-serif", outline: "none",
            }}
          />
          <button
            onClick={() => { setShowUrlInput(false); toast("Stream URL set."); }}
            style={{
              padding: "0.5rem 1.25rem",
              background: "#ffffff", color: "#000000",
              border: "none", cursor: "pointer",
              fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            Set
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT: Stream + Chat ── */}
      <div style={{
        flex: 1, display: "flex",
        flexDirection: "column" as const,
        maxWidth: "960px", width: "100%", margin: "0 auto",
        padding: "0",
      }}>

        {/* ── STREAM AREA ── */}
        <div style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#0a0a0a",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {streamUrl ? (
            <iframe
              src={streamUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Placeholder when no stream is set */
            <div style={{ textAlign: "center", padding: "2rem" }}>
              {/* Animated Aria */}
              <img
                src={ARIA_IMG}
                alt="Aria"
                style={{
                  height: "180px", width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))",
                  animation: "ariaFloat 3s ease-in-out infinite",
                  marginBottom: "1.5rem",
                }}
              />
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem", fontWeight: 300, color: "#ffffff",
                marginBottom: "0.5rem",
              }}>
                Going Live Soon.
              </div>
              <div style={{
                fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}>
                Aria Rabbit · Create AI Profit
              </div>
              {/* Pulsing live dot */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", marginTop: "1.5rem",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#ef4444",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }} />
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                  Standby
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── STREAM INFO BAR ── */}
        <div style={{
          padding: "0.85rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.2rem" }}>
              Create AI Profit — Live
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
              Hosted by Aria Rabbit · AI That Pays You
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Link copied!"); }}
              style={{
                padding: "0.4rem 0.85rem",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)", cursor: "pointer",
                fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              ↗ Share
            </button>
          </div>
        </div>

        {/* ── LIVE CHAT ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column" as const,
          minHeight: "320px",
        }}>
          {/* Chat header */}
          <div style={{
            padding: "0.65rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              Live Chat
            </span>
            <span style={{
              fontSize: "0.55rem", padding: "1px 6px",
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", borderRadius: "2px", letterSpacing: "0.1em",
            }}>
              {messages.length}
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "0.75rem 1rem",
            display: "flex", flexDirection: "column" as const, gap: "0.75rem",
            maxHeight: "360px", scrollbarWidth: "none",
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "2rem",
                fontSize: "0.75rem", color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
              }}>
                Be the first to say something.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: `1px solid ${TIER_COLORS[msg.tier]}`,
                    overflow: "hidden", flexShrink: 0,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {msg.avatarUrl ? (
                      <img src={msg.avatarUrl} alt={msg.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                        {msg.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Message */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: TIER_COLORS[msg.tier] }}>
                        {msg.displayName}
                      </span>
                      <span style={{
                        fontSize: "0.5rem", letterSpacing: "0.15em", textTransform: "uppercase",
                        color: TIER_COLORS[msg.tier], opacity: 0.7,
                      }}>
                        {msg.tier}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.4, margin: 0 }}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div style={{
            padding: "0.75rem 1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: "0.75rem", alignItems: "center",
            background: "rgba(0,0,0,0.5)",
          }}>
            {/* User avatar */}
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1px solid ${TIER_COLORS[tier]}`,
              overflow: "hidden", flexShrink: 0,
              background: "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Say something…"
              maxLength={300}
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff", padding: "0.55rem 0.85rem",
                fontSize: "0.85rem", fontFamily: "'Rajdhani', sans-serif",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              style={{
                padding: "0.55rem 1.25rem",
                background: message.trim() ? "#ffffff" : "rgba(255,255,255,0.08)",
                color: message.trim() ? "#000000" : "rgba(255,255,255,0.25)",
                border: "none", cursor: message.trim() ? "pointer" : "not-allowed",
                fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
                fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes ariaFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
