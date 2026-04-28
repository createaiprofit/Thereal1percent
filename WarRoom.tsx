import { useState, useRef } from "react";
import { STAFF_BOTS, HOST_BOTS } from "@/data/bots";
import type { Bot } from "@/data/bots";
import { trpc } from "@/lib/trpc";

// ─── PIN Gate ────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const verifyMutation = trpc.warRoom.verifyPin.useMutation({
    onSuccess: (data) => {
      if (data.valid) { onUnlock(); }
      else { setError("Incorrect PIN. Try again."); setPin(""); }
    },
    onError: () => { setError("Verification failed. Please try again."); setPin(""); },
  });
  const requestResetMutation = trpc.warRoom.requestReset.useMutation({
    onSuccess: () => setResetSent(true),
    onError: () => setError("Could not send reset. Try again."),
  });
  const handleVerify = () => {
    if (!pin || pin.length < 4) return;
    setError("");
    verifyMutation.mutate({ pin });
  };
  const s: Record<string, React.CSSProperties> = {
    wrap: { minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" },
    box: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "40px 48px", width: 320, textAlign: "center" },
    title: { color: "#d4af37", fontSize: 11, letterSpacing: 4, fontWeight: 700, marginBottom: 8 },
    sub: { color: "#444", fontSize: 9, letterSpacing: 2, marginBottom: 28 },
    input: { width: "100%", background: "#111", border: "1px solid #222", borderRadius: 4, color: "#fff", fontFamily: "monospace", fontSize: 22, letterSpacing: 8, textAlign: "center", padding: "10px 0", outline: "none", marginBottom: 16 },
    btn: { width: "100%", background: "#d4af37", border: "none", borderRadius: 4, color: "#000", fontFamily: "monospace", fontSize: 11, letterSpacing: 3, fontWeight: 700, padding: "12px 0", cursor: "pointer", marginBottom: 12 },
    link: { color: "#444", fontSize: 9, letterSpacing: 1, cursor: "pointer", textDecoration: "underline", background: "none", border: "none", fontFamily: "monospace", marginTop: 8 },
    err: { color: "#ff4444", fontSize: 10, marginBottom: 12 },
    ok: { color: "#44ff88", fontSize: 10, marginBottom: 12 },
  };
  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.title}>🔐 WAR ROOM</div>
        <div style={s.sub}>ENTER PIN TO CONTINUE</div>
        {error && <div style={s.err}>{error}</div>}
        {!resetSent ? (
          <>
            <input style={s.input} type="password" maxLength={8} value={pin}
              onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerify()}
              placeholder="••••" autoFocus disabled={verifyMutation.isPending} />
            <button style={s.btn} onClick={handleVerify} disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "VERIFYING..." : "ENTER"}
            </button>
            <button style={s.link} onClick={() => requestResetMutation.mutate()} disabled={requestResetMutation.isPending}>
              {requestResetMutation.isPending ? "SENDING..." : "Forgot PIN? Send reset to ernest@createaiprofit.com"}
            </button>
          </>
        ) : (
          <div style={s.ok}>Reset link sent to ernest@createaiprofit.com<br /><br />Check your email and click the link to set a new PIN.</div>
        )}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { data, isLoading } = trpc.warRoom.overview.useQuery();
  const statBox = (label: string, value: string | number, color = "#d4af37") => (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "20px 24px", textAlign: "center" }}>
      <div style={{ color, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{value}</div>
      <div style={{ color: "#555", fontSize: 9, letterSpacing: 2 }}>{label}</div>
    </div>
  );
  if (isLoading) return <div style={{ color: "#444", fontSize: 10, letterSpacing: 2, padding: 20 }}>LOADING OVERVIEW...</div>;
  const d = data;
  return (
    <div>
      <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 20, fontWeight: 700 }}>SYSTEM OVERVIEW</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {statBox("CALLS TODAY", d?.calls?.callsToday ?? 0)}
        {statBox("TOTAL CALLS", d?.calls?.totalCalls ?? 0)}
        {statBox("INTERESTED", d?.calls?.interestedToday ?? 0, "#44ff88")}
        {statBox("ASSIGNED", d?.calls?.assignedToday ?? 0, "#4caf50")}
        {statBox("UNREAD ALERTS", d?.unreadAlerts ?? 0, d?.unreadAlerts ? "#ff4444" : "#555")}
      </div>
      {/* Recent Calls */}
      <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ color: "#d4af37", fontSize: 10, letterSpacing: 3, marginBottom: 14, fontWeight: 700 }}>RECENT CALLS</div>
        {(!d?.recentCalls || d.recentCalls.length === 0) ? (
          <div style={{ color: "#333", fontSize: 10, letterSpacing: 2 }}>NO CALLS YET</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {d.recentCalls.map((call: any) => (
              <div key={call.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#080808", border: "1px solid #111", borderRadius: 4 }}>
                <div>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{call.botName}</span>
                  <span style={{ color: "#555", fontSize: 9, marginLeft: 10 }}>→ {call.toNumber}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: call.outcome === "interested" ? "#44ff88" : call.outcome === "assigned" ? "#4caf50" : "#555", fontSize: 9, letterSpacing: 2 }}>
                    {(call.outcome ?? "connected").toUpperCase()}
                  </span>
                  <span style={{ color: "#333", fontSize: 9 }}>{new Date(call.calledAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Call Log Tab ─────────────────────────────────────────────────────────────
function CallLogTab() {
  const [botFilter, setBotFilter] = useState("");
  const { data: calls, isLoading } = trpc.warRoom.calls.list.useQuery({ limit: 100, botName: botFilter || undefined });

  const outcomeColor = (o?: string | null) => {
    if (o === "interested" || o === "assigned") return "#44ff88";
    if (o === "error") return "#ff4444";
    return "#555";
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, fontWeight: 700 }}>CALL LOG</div>
        <input
          placeholder="Filter by bot name..."
          value={botFilter}
          onChange={e => setBotFilter(e.target.value)}
          style={{ background: "#111", border: "1px solid #222", borderRadius: 4, color: "#fff", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, padding: "6px 12px", outline: "none", width: 200 }}
        />
      </div>
      {isLoading ? (
        <div style={{ color: "#444", fontSize: 10, letterSpacing: 2 }}>LOADING CALLS...</div>
      ) : !calls || calls.length === 0 ? (
        <div style={{ color: "#333", fontSize: 10, letterSpacing: 2 }}>NO CALLS LOGGED YET</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {calls.map((call: any) => (
            <div key={call.id} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 6, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{call.botName}</span>
                  {call.botVoice && <span style={{ color: "#444", fontSize: 9, marginLeft: 10, letterSpacing: 1 }}>{call.botVoice}</span>}
                </div>
                <span style={{ color: outcomeColor(call.outcome), fontSize: 9, letterSpacing: 2, border: `1px solid ${outcomeColor(call.outcome)}22`, padding: "2px 8px", borderRadius: 3 }}>
                  {(call.outcome ?? "connected").toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <span style={{ color: "#555", fontSize: 9 }}>TO: <span style={{ color: "#888" }}>{call.toNumber}</span></span>
                <span style={{ color: "#555", fontSize: 9 }}>FROM: <span style={{ color: "#888" }}>{call.fromNumber ?? "—"}</span></span>
                {call.durationSeconds && <span style={{ color: "#555", fontSize: 9 }}>DURATION: <span style={{ color: "#888" }}>{call.durationSeconds}s</span></span>}
                <span style={{ color: "#555", fontSize: 9 }}>SID: <span style={{ color: "#333" }}>{call.twilioSid ?? "—"}</span></span>
                <span style={{ color: "#555", fontSize: 9 }}>{new Date(call.calledAt).toLocaleString()}</span>
              </div>
              {call.scriptUsed && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ color: "#444", fontSize: 9, letterSpacing: 2, cursor: "pointer" }}>VIEW SCRIPT</summary>
                  <div style={{ color: "#666", fontSize: 10, lineHeight: 1.6, marginTop: 6, padding: "8px 12px", background: "#080808", borderRadius: 4, borderLeft: "2px solid #d4af3733" }}>
                    {call.scriptUsed}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alerts Tab ───────────────────────────────────────────────────────────────
function AlertsTab() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const utils = trpc.useUtils();
  const { data: alerts, isLoading } = trpc.warRoom.alerts.list.useQuery({ unreadOnly, limit: 50 });
  const markReadMutation = trpc.warRoom.alerts.markRead.useMutation({
    onSuccess: () => utils.warRoom.alerts.list.invalidate(),
  });
  const markAllMutation = trpc.warRoom.alerts.markAllRead.useMutation({
    onSuccess: () => utils.warRoom.alerts.list.invalidate(),
  });

  const severityColor = (s: string) => s === "critical" ? "#ff4444" : s === "warning" ? "#ffaa00" : "#44aaff";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, fontWeight: 700 }}>ALERTS</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ color: "#555", fontSize: 9, letterSpacing: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} />
            UNREAD ONLY
          </label>
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#888", fontFamily: "monospace", fontSize: 9, letterSpacing: 2, padding: "5px 12px", cursor: "pointer" }}
          >
            MARK ALL READ
          </button>
        </div>
      </div>
      {isLoading ? (
        <div style={{ color: "#444", fontSize: 10, letterSpacing: 2 }}>LOADING ALERTS...</div>
      ) : !alerts || alerts.length === 0 ? (
        <div style={{ color: "#333", fontSize: 10, letterSpacing: 2 }}>NO ALERTS</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {alerts.map((alert: any) => (
            <div key={alert.id} style={{
              background: alert.read ? "#080808" : "#0a0a0a",
              border: `1px solid ${alert.read ? "#111" : "#1a1a1a"}`,
              borderLeft: `3px solid ${severityColor(alert.severity)}`,
              borderRadius: 6,
              padding: "12px 16px",
              opacity: alert.read ? 0.6 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{alert.title}</div>
                  <div style={{ color: "#777", fontSize: 10, lineHeight: 1.5 }}>{alert.message}</div>
                  <div style={{ color: "#333", fontSize: 9, marginTop: 6 }}>{new Date(alert.createdAt).toLocaleString()}</div>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => markReadMutation.mutate({ id: alert.id })}
                    disabled={markReadMutation.isPending}
                    style={{ background: "none", border: "1px solid #222", borderRadius: 3, color: "#444", fontFamily: "monospace", fontSize: 8, letterSpacing: 2, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap", marginLeft: 12 }}
                  >
                    MARK READ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// War Room — Admin Only
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "call-log", label: "Call Log" },
  { id: "alerts", label: "Alerts" },
  { id: "real-estate-projects", label: "Real Estate Projects" },
  { id: "web-content", label: "Web Content" },
  { id: "affiliate-team", label: "Affiliate Team" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const REAL_ESTATE_SECTIONS = [
  "Airbnb Sublease",
  "Commercial Property Above $10M",
  "Commercial Property Below $10M",
  "Apartment Complexes Above 100 Units",
  "Vacation Properties",
  "Residential Income Above 100 Units",
  "Real Estate Investment",
  "Residential Income Under 100 Units (incl. Duplexes)",
  "Land Development",
  "Single-Family Residence",
];

const GOLDEN_VAULT_PRODUCTS = [
  { id: "gv-1", name: "Golden Vault Membership — Basic", price: "$29/mo", category: "Membership" },
  { id: "gv-2", name: "Golden Vault Membership — Business", price: "$79/mo", category: "Membership" },
  { id: "gv-3", name: "Golden Vault Membership — Enterprise", price: "$199/mo", category: "Membership" },
  { id: "gv-4", name: "Club Vault Luxury Access Pass", price: "$499", category: "Access" },
  { id: "gv-5", name: "AI Profit Starter Kit", price: "$97", category: "Digital" },
  { id: "gv-6", name: "Real Estate Arbitrage Blueprint", price: "$147", category: "Digital" },
  { id: "gv-7", name: "Airbnb Sublease Masterclass", price: "$197", category: "Course" },
  { id: "gv-8", name: "Passive Income Automation Bundle", price: "$297", category: "Bundle" },
  { id: "gv-9", name: "CreateAIProfit VIP Coaching Call", price: "$350", category: "Service" },
  { id: "gv-10", name: "Dropship Launch Package", price: "$249", category: "Bundle" },
];

// ─── Voice Preview Hook ───────────────────────────────────────────────────────
function useBotVoicePreview() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewMutation = trpc.tts.preview.useMutation();

  const playVoice = async (bot: Bot) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (playingId === bot.id) { setPlayingId(null); return; }
    setLoadingId(bot.id);
    try {
      const result = await previewMutation.mutateAsync({ voiceId: bot.voiceId, text: bot.bio });
      const audioSrc = `data:${result.mimeType};base64,${result.audio}`;
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setPlayingId(bot.id);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      await audio.play();
    } catch { setPlayingId(null); }
    finally { setLoadingId(null); }
  };

  return { playingId, loadingId, playVoice };
}

// ─── Bot Card ─────────────────────────────────────────────────────────────────
function BotCard({ bot, accentColor, playingId, loadingId, onPlay }: {
  bot: Bot; accentColor: string; playingId: string | null; loadingId: string | null; onPlay: (bot: Bot) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isPlaying = playingId === bot.id;
  const isLoading = loadingId === bot.id;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#000000", border: `1px solid ${hovered ? "rgba(148,163,170,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 0, overflow: "hidden", transition: "border-color 0.3s", position: "relative" }}>
      <div style={{ width: "100%", height: 220, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        {bot.image ? (
          <img src={bot.image} alt={bot.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        ) : (
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.12)" }}>PHOTO</div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.72)", padding: "6px 14px", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: accentColor === "#94A3AA" ? "#94A3AA" : "rgba(201,168,76,0.8)" }}>
          {bot.title}
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.06em", margin: "0 0 4px 0" }}>{bot.name}</h3>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(148,163,170,0.7)", margin: "0 0 10px 0" }}>{bot.role}</p>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", margin: "0 0 12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>{bot.email}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, color: hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)", lineHeight: 1.75, margin: "0 0 16px 0" }}>{bot.bio}</p>
        <button
          onClick={() => onPlay(bot)}
          disabled={isLoading}
          style={{ width: "100%", background: isPlaying ? "#1a0a0a" : "#0a0a0a", border: `1px solid ${isPlaying ? accentColor : "rgba(255,255,255,0.08)"}`, borderRadius: 0, color: isPlaying ? accentColor : "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", padding: "10px 0", cursor: isLoading ? "wait" : "pointer", transition: "all 0.2s" }}>
          {isLoading ? "LOADING..." : isPlaying ? "◼ STOP" : "▶ PREVIEW VOICE"}
        </button>
      </div>
    </div>
  );
}

// ─── Main War Room ────────────────────────────────────────────────────────────
const SESSION_KEY = "war_room_unlocked";

export default function WarRoom() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  });

  const handleUnlock = () => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    setUnlocked(true);
  };
  const handleLock = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    setUnlocked(false);
  };

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [changingPin, setChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin2, setNewPin2] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const { playingId, loadingId, playVoice } = useBotVoicePreview();
  const changePinMutation = trpc.warRoom.changePin.useMutation();

  if (!unlocked) return <PinGate onUnlock={handleUnlock} />;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "monospace" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔐</span>
          <div>
            <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, fontWeight: 700 }}>WAR ROOM</div>
            <div style={{ color: "#444", fontSize: 10, letterSpacing: 2 }}>ADMIN ACCESS ONLY</div>
          </div>
        </div>
        <button onClick={handleLock} style={{ background: "#1a0000", border: "1px solid #330000", borderRadius: 4, color: "#ff4444", fontFamily: "monospace", fontSize: 9, letterSpacing: 2, padding: "6px 14px", cursor: "pointer" }}>
          🔒 LOCK
        </button>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", borderBottom: "1px solid #111", overflowX: "auto" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "12px 20px", background: "none", border: "none", whiteSpace: "nowrap",
            borderBottom: activeTab === tab.id ? "2px solid #d4af37" : "2px solid transparent",
            color: activeTab === tab.id ? "#d4af37" : "#555",
            fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "monospace",
            fontWeight: activeTab === tab.id ? 700 : 400, transition: "all 0.2s",
          }}>
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "24px" }}>
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && <OverviewTab />}

        {/* ── CALL LOG ── */}
        {activeTab === "call-log" && <CallLogTab />}

        {/* ── ALERTS ── */}
        {activeTab === "alerts" && <AlertsTab />}

        {/* ── REAL ESTATE PROJECTS ── */}
        {activeTab === "real-estate-projects" && (
          <div>
            <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 20, fontWeight: 700 }}>
              REAL ESTATE PROJECTS — VIEW ONLY
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {REAL_ESTATE_SECTIONS.map(section => (
                <div key={section}>
                  <button
                    onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                    style={{ width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 6, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#ccc", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 }}>
                    <span>{section}</span>
                    <span style={{ color: "#444", fontSize: 10 }}>{expandedSection === section ? "▲" : "▼"}</span>
                  </button>
                  {expandedSection === section && (
                    <div style={{ background: "#080808", border: "1px solid #111", borderTop: "none", borderRadius: "0 0 6px 6px", padding: "14px 18px" }}>
                      <div style={{ color: "#444", fontSize: 10, letterSpacing: 2 }}>NO ACTIVE PROJECTS — ASSIGN A BOT TO BEGIN</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WEB CONTENT ── */}
        {activeTab === "web-content" && (
          <div>
            <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 20, fontWeight: 700 }}>
              WEB CONTENT — STAFF BOTS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1 }}>
              {STAFF_BOTS.map(bot => (
                <BotCard key={bot.id} bot={bot} accentColor="#d4af37" playingId={playingId} loadingId={loadingId} onPlay={playVoice} />
              ))}
            </div>
            <div style={{ marginTop: 32, color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 16, fontWeight: 700 }}>
              HOST BOTS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1 }}>
              {HOST_BOTS.map(bot => (
                <BotCard key={bot.id} bot={bot} accentColor="#94A3AA" playingId={playingId} loadingId={loadingId} onPlay={playVoice} />
              ))}
            </div>
          </div>
        )}

        {/* ── AFFILIATE TEAM ── */}
        {activeTab === "affiliate-team" && (
          <div>
            <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 4, fontWeight: 700 }}>
              AFFILIATE TEAM
            </div>
            <div style={{ color: "#444", fontSize: 10, letterSpacing: 2, marginBottom: 20 }}>
              GOLDEN VAULT PRODUCTS — ALL AFFILIATES
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {GOLDEN_VAULT_PRODUCTS.map(product => (
                <div key={product.id} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 6, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#ccc", fontSize: 12 }}>{product.name}</div>
                    <div style={{ color: "#555", fontSize: 9, letterSpacing: 2, marginTop: 3 }}>{product.category}</div>
                  </div>
                  <div style={{ color: "#d4af37", fontSize: 13, fontWeight: 700 }}>{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <div>
            <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, marginBottom: 20, fontWeight: 700 }}>SETTINGS</div>
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 3, marginBottom: 4, fontWeight: 700 }}>REAL ESTATE TEAM</div>
              <div style={{ color: "#444", fontSize: 9, letterSpacing: 2, marginBottom: 16 }}>FULL ACCESS — STAFF BOTS ONLY</div>
              <div style={{ display: "grid", gap: 8 }}>
                {STAFF_BOTS.map(bot => (
                  <div key={bot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#080808", border: "1px solid #1a1a1a", borderRadius: 6 }}>
                    <div>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{bot.name}</span>
                      <span style={{ color: "#555", fontSize: 9, marginLeft: 10 }}>{bot.role}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#333", fontSize: 9 }}>{bot.email}</span>
                      <span style={{ background: "#0d2b0d", color: "#4caf50", fontSize: 8, letterSpacing: 2, padding: "2px 8px", borderRadius: 3, border: "1px solid #1a3d1a" }}>FULL ACCESS</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, color: "#2a2a2a", fontSize: 9, letterSpacing: 2 }}>SARAH 1–5 REMOVED</div>
            </div>

            {/* Change PIN */}
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 3, marginBottom: 4, fontWeight: 700 }}>CHANGE PIN</div>
              <div style={{ color: "#444", fontSize: 9, letterSpacing: 2, marginBottom: 16 }}>UPDATE YOUR WAR ROOM ACCESS PIN</div>
              {pinMsg && <div style={{ color: pinMsg.includes("updated") ? "#44ff88" : "#ff4444", fontSize: 10, marginBottom: 12 }}>{pinMsg}</div>}
              {!changingPin ? (
                <button onClick={() => setChangingPin(true)} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#d4af37", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, padding: "10px 20px", cursor: "pointer" }}>
                  CHANGE PIN
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 280 }}>
                  <input type="password" maxLength={8} placeholder="Current PIN" value={currentPin}
                    onChange={e => setCurrentPin(e.target.value)}
                    style={{ background: "#111", border: "1px solid #222", borderRadius: 4, color: "#fff", fontFamily: "monospace", fontSize: 16, letterSpacing: 6, textAlign: "center", padding: "8px 0", outline: "none" }} />
                  <input type="password" maxLength={8} placeholder="New PIN" value={newPin2}
                    onChange={e => setNewPin2(e.target.value)}
                    style={{ background: "#111", border: "1px solid #222", borderRadius: 4, color: "#fff", fontFamily: "monospace", fontSize: 16, letterSpacing: 6, textAlign: "center", padding: "8px 0", outline: "none" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={async () => {
                      setPinMsg("");
                      try {
                        await changePinMutation.mutateAsync({ currentPin, newPin: newPin2 });
                        setPinMsg("PIN updated successfully.");
                        setChangingPin(false); setCurrentPin(""); setNewPin2("");
                      } catch { setPinMsg("Incorrect current PIN."); }
                    }} disabled={changePinMutation.isPending}
                      style={{ flex: 1, background: "#d4af37", border: "none", borderRadius: 4, color: "#000", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, fontWeight: 700, padding: "10px 0", cursor: "pointer" }}>
                      {changePinMutation.isPending ? "SAVING..." : "SAVE"}
                    </button>
                    <button onClick={() => { setChangingPin(false); setCurrentPin(""); setNewPin2(""); setPinMsg(""); }}
                      style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#888", fontFamily: "monospace", fontSize: 10, letterSpacing: 2, padding: "10px 0", cursor: "pointer" }}>
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
