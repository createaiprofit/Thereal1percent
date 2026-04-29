/**
 * In-App Wallet — 1% Playground
 *
 * RULES (immutable):
 * • CAP owns 100% of all funds.
 * • This balance is a display-only earnings score — not withdrawable.
 * • The system is a closed loop. No withdrawals. No transfers. No exceptions.
 * • Funds stay in-app to support app stability and future growth.
 */
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, Wallet, TrendingUp, Lock, Shield, Star } from "lucide-react";
import { TierBadge } from "@/components/TierBadge";

export default function InAppWallet() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const walletQ   = trpc.wallet.balance.useQuery(undefined, { enabled: !!user });
  const historyQ  = trpc.wallet.history.useQuery(undefined, { enabled: !!user });

  const balance = walletQ.data?.balance ?? 0;
  const history = historyQ.data ?? [];

  return (
    <div style={{
      background: "#000000", minHeight: "100vh", color: "#ffffff",
      fontFamily: "'Rajdhani', sans-serif", paddingBottom: "100px",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, background: "#000000", zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1rem 1.25rem",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <button
          onClick={() => navigate("/social")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, fontStyle: "italic", letterSpacing: "0.05em" }}>
            Earnings Vault
          </div>
          <TierBadge tier={walletQ.data?.isSubscriber ? "gold" : "silver"} size="md" />
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div style={{
        margin: "1.5rem",
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "2rem 1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "160px", height: "160px",
          background: "radial-gradient(circle, rgba(200,210,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ fontSize: "0.55rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
          Your Earnings Score
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", fontWeight: 300, color: "#ffffff", lineHeight: 1, marginBottom: "1.5rem" }}>
          {walletQ.isLoading ? (
            <span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.3)" }}>Loading...</span>
          ) : (
            <>
              <span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.35)", marginRight: "4px" }}>$</span>
              {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Your Share</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "rgba(200,215,240,0.9)" }}>50%</div>
          </div>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Status</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: walletQ.data?.isSubscriber ? "rgba(200,215,240,0.9)" : "#fde68a" }}>
              {walletQ.data?.isSubscriber ? "Active Member" : "Inactive"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Type</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Display Only</div>
          </div>
        </div>
      </div>

      {/* ── CLOSED LOOP NOTICE ── */}
      <div style={{
        margin: "0 1.5rem 1.5rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "1.25rem",
        display: "flex", gap: "12px", alignItems: "flex-start",
      }}>
        <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: "4px", letterSpacing: "0.05em" }}>
            Closed-Loop System
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
            All funds remain inside the system to support app stability and future growth.
            This balance is your earnings score — a record of your contribution to the 1% Playground.
            CreateAIProfit LLC retains ownership of all in-app funds.
          </div>
        </div>
      </div>

      {/* ── HOW EARNINGS WORK ── */}
      <div style={{ margin: "0 1.5rem 1.5rem" }}>
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
          How Your Score Grows
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
          {[
            {
              icon: <TrendingUp className="w-4 h-4" />,
              label: "Daily Revenue Share",
              desc: "50% of your tier allocation credited daily when admin runs the split",
              color: "rgba(200,215,240,0.8)",
            },
            {
              icon: <Star className="w-4 h-4" />,
              label: "Tier Multiplier",
              desc: "Silver 10% · Gold 15% · Platinum 25% of the daily user pool",
              color: "rgba(200,215,240,0.8)",
            },
            {
              icon: <Shield className="w-4 h-4" />,
              label: "CAP Stability Fund",
              desc: "The other 50% of every credit funds app development and server costs",
              color: "rgba(255,255,255,0.3)",
            },
            {
              icon: <Wallet className="w-4 h-4" />,
              label: "Lifetime Score",
              desc: "Your total accumulates over time — a permanent record of membership value",
              color: "rgba(255,255,255,0.3)",
            },
          ].map((item) => (
            <div key={item.label} style={{ background: "#000000", padding: "1.25rem" }}>
              <div style={{ color: item.color, marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#ffffff", marginBottom: "4px", letterSpacing: "0.03em" }}>{item.label}</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.55 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRANSACTION HISTORY ── */}
      <div style={{ margin: "0 1.5rem" }}>
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
          Credit History
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {historyQ.isLoading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Loading...</div>
          ) : history.length === 0 ? (
            <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>
                No credits yet
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                Credits appear here after each daily split
              </div>
            </div>
          ) : (
            history.map((tx) => (
              <div key={tx.id} style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: "rgba(200,215,240,0.06)",
                  border: "1px solid rgba(200,215,240,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "rgba(200,215,240,0.6)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.78rem", color: "#ffffff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.description ?? "Earnings credit"}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)" }}>
                    {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div style={{
                  fontSize: "1rem", fontWeight: 700,
                  color: "rgba(200,215,240,0.85)",
                  fontFamily: "'Cormorant Garamond', serif",
                }}>
                  +${parseFloat(tx.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
