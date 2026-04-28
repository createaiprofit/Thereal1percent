/**
 * Bot Engine Control Panel (Admin Only)
 * Full control over the 1% Playground engagement engine:
 * - Live stats: actions today, queue depth, bot count, post/like/comment totals
 * - One-click engagement cycle trigger
 * - Post queue seeding
 * - Recent activity log
 * - Bot roster with toggle
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Zap, Users, MessageSquare, Heart, TrendingUp, RefreshCw,
  Play, ChevronLeft, Activity, List, ToggleLeft, ToggleRight,
  PlusCircle, Eye
} from "lucide-react";

const S = {
  page: {
    background: "#000000", minHeight: "100vh", color: "#ffffff",
    fontFamily: "'Rajdhani', sans-serif", paddingBottom: "40px",
  } as React.CSSProperties,
  header: {
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "1.25rem 1.5rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky" as const, top: 0, background: "#000000", zIndex: 10,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem",
    fontWeight: 300, color: "#ffffff", letterSpacing: "0.05em",
  } as React.CSSProperties,
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1px", background: "rgba(255,255,255,0.04)",
    margin: "1.5rem", borderRadius: "2px",
  } as React.CSSProperties,
  kpi: {
    background: "#000000", padding: "1.25rem",
    display: "flex", flexDirection: "column" as const, gap: "4px",
  },
  kpiLabel: {
    fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
  },
  kpiValue: {
    fontSize: "1.6rem", fontWeight: 700, color: "#ffffff",
    fontFamily: "'Cormorant Garamond', serif",
  } as React.CSSProperties,
  section: {
    margin: "0 1.5rem 1.5rem",
    border: "1px solid rgba(255,255,255,0.06)",
  } as React.CSSProperties,
  sectionHead: {
    padding: "0.85rem 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(255,255,255,0.02)",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "8px",
  },
  btn: (variant: "primary" | "ghost" | "green" | "red" = "primary"): React.CSSProperties => ({
    padding: "0.6rem 1.4rem", cursor: "pointer",
    fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, transition: "opacity 0.2s",
    background:
      variant === "primary" ? "#ffffff" :
      variant === "green" ? "rgba(74,222,128,0.15)" :
      variant === "red" ? "rgba(248,113,113,0.15)" :
      "rgba(255,255,255,0.06)",
    color:
      variant === "primary" ? "#000000" :
      variant === "green" ? "#4ade80" :
      variant === "red" ? "#f87171" :
      "rgba(255,255,255,0.6)",
    border:
      variant === "ghost" ? "1px solid rgba(255,255,255,0.1)" :
      variant === "green" ? "1px solid rgba(74,222,128,0.3)" :
      variant === "red" ? "1px solid rgba(248,113,113,0.3)" :
      "none",
  }),
  logRow: {
    padding: "0.75rem 1.25rem",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    display: "flex", alignItems: "flex-start", gap: "12px",
  } as React.CSSProperties,
  badge: (type: string): React.CSSProperties => ({
    padding: "2px 8px", borderRadius: "3px", fontSize: "0.6rem",
    letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap",
    background:
      type === "reply_to_comment" ? "rgba(59,130,246,0.2)" :
      type === "like_back" ? "rgba(234,179,8,0.2)" :
      type === "comment_on_user" ? "rgba(74,222,128,0.2)" :
      type === "boost_post" ? "rgba(249,115,22,0.2)" :
      type === "follow_user" ? "rgba(168,85,247,0.2)" :
      "rgba(255,255,255,0.1)",
    color:
      type === "reply_to_comment" ? "#93c5fd" :
      type === "like_back" ? "#fde68a" :
      type === "comment_on_user" ? "#86efac" :
      type === "boost_post" ? "#fdba74" :
      type === "follow_user" ? "#d8b4fe" :
      "rgba(255,255,255,0.5)",
  }),
};

const ACTION_LABELS: Record<string, string> = {
  reply_to_comment: "Reply",
  like_back: "Like-Back",
  comment_on_user: "Comment",
  boost_post: "Boost",
  follow_user: "Follow",
  tag_user: "Tag",
};

export default function BotEnginePanel() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "log" | "roster">("overview");
  const [seedCount, setSeedCount] = useState(500);

  if (!user || (user as any).role !== "admin") {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Admin access required.</p>
      </div>
    );
  }

  const statsQ = trpc.botEngine.stats.useQuery(undefined, { refetchInterval: 15000 });
  const logQ = trpc.botEngine.recentLog.useQuery({ limit: 100 }, { refetchInterval: 10000 });
  const rosterQ = trpc.botEngine.roster.useQuery({ limit: 50, offset: 0 }, { enabled: activeTab === "roster" });

  const runCycle = trpc.botEngine.runEngagementCycle.useMutation({
    onSuccess: (data) => {
      statsQ.refetch();
      logQ.refetch();
      alert(`✅ Engagement cycle complete — ${data.actions} actions fired`);
    },
    onError: (e) => alert(`❌ ${e.message}`),
  });

  const runPosts = trpc.botEngine.runPostJob.useMutation({
    onSuccess: (data) => {
      statsQ.refetch();
      alert(`✅ Published ${data.published} posts — ${data.queueRemaining} in queue`);
    },
    onError: (e) => alert(`❌ ${e.message}`),
  });

  const seedQueue = trpc.botEngine.seedQueue.useMutation({
    onSuccess: (data) => {
      statsQ.refetch();
      alert(`✅ Seeded ${data.seeded} posts into queue`);
    },
    onError: (e) => alert(`❌ ${e.message}`),
  });
  const launchBlitz = trpc.botEngine.launchBlitz.useMutation({
    onSuccess: (data) => {
      statsQ.refetch();
      blitzStatusQ.refetch();
      alert(data.message);
    },
    onError: (e) => alert(`❌ ${e.message}`),
  });
  const blitzStatusQ = trpc.botEngine.blitzStatus.useQuery(undefined, { refetchInterval: 30000 });
  const toggleBot = trpc.botEngine.toggleBot.useMutation({
    onSuccess: () => rosterQ.refetch(),
  });;

  const stats = statsQ.data;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "4px" }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div style={S.title}>Bot Engine</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              1% Playground Engagement System
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={S.btn("green")}
            onClick={() => runCycle.mutate()}
            disabled={runCycle.isPending}
          >
            {runCycle.isPending ? <RefreshCw className="w-3 h-3 animate-spin" style={{ display: "inline" }} /> : <Zap className="w-3 h-3" style={{ display: "inline", marginRight: "4px" }} />}
            {runCycle.isPending ? "Running..." : "Run Cycle"}
          </button>
          <button
            style={S.btn("ghost")}
            onClick={() => runPosts.mutate()}
            disabled={runPosts.isPending}
          >
            <Play className="w-3 h-3" style={{ display: "inline", marginRight: "4px" }} />
            {runPosts.isPending ? "Posting..." : "Post Now"}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={S.grid}>
        {[
          { label: "Actions Today", value: stats?.engagement?.totalActions?.toLocaleString() ?? "—", icon: <Activity className="w-4 h-4" /> },
          { label: "Replies", value: stats?.engagement?.replies?.toLocaleString() ?? "—", icon: <MessageSquare className="w-4 h-4" /> },
          { label: "Like-Backs", value: stats?.engagement?.likeBacks?.toLocaleString() ?? "—", icon: <Heart className="w-4 h-4" /> },
          { label: "Comments", value: stats?.engagement?.proactiveComments?.toLocaleString() ?? "—", icon: <MessageSquare className="w-4 h-4" /> },
          { label: "Boosts", value: stats?.engagement?.boosts?.toLocaleString() ?? "—", icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Active Bots", value: stats?.bots?.activeBots?.toLocaleString() ?? "—", icon: <Users className="w-4 h-4" /> },
          { label: "Total Posts", value: stats?.posts?.totalPosts?.toLocaleString() ?? "—", icon: <Eye className="w-4 h-4" /> },
          { label: "Queue Pending", value: stats?.queue?.pending?.toLocaleString() ?? "—", icon: <List className="w-4 h-4" /> },
          { label: "Total Likes", value: stats?.posts?.totalLikes?.toLocaleString() ?? "—", icon: <Heart className="w-4 h-4" /> },
          { label: "Total Comments", value: stats?.posts?.totalComments?.toLocaleString() ?? "—", icon: <MessageSquare className="w-4 h-4" /> },
        ].map((k) => (
          <div key={k.label} style={S.kpi}>
            <div style={{ color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>{k.icon}</div>
            <div style={S.kpiValue}>{k.value}</div>
            <div style={S.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", margin: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(["overview", "log", "roster"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.65rem 1.25rem", background: "none",
              border: "none", cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #ffffff" : "2px solid transparent",
              color: activeTab === tab ? "#ffffff" : "rgba(255,255,255,0.4)",
              fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
              letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {tab === "overview" ? "Overview" : tab === "log" ? "Activity Log" : "Bot Roster"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* 48-HOUR BLITZ PANEL */}
          <div style={{ ...S.section, border: "1px solid rgba(255,200,50,0.25)", background: "rgba(255,200,50,0.03)" }}>
            <div style={S.sectionHead}>
              <div style={{ ...S.sectionTitle, color: "#fbbf24" }}>
                <Zap className="w-3 h-3" style={{ display: "inline", marginRight: "6px", color: "#fbbf24" }} />
                48-HOUR BLITZ — Launch Tonight
              </div>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1rem" }}>
                <strong style={{ color: "#fbbf24" }}>96 scripted posts</strong> · 2/hour · 48 hours straight · Fresh bot every slot<br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Format A: Machiavelli opener + voiceover · Format B: Penthouse/yacht/Lambo flex · Format C (every 3rd): Airbnb affiliate</span><br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>All CTAs → createaiprofit.com invite gate · Bots reply to all comments: "Exactly — step out. DM me."</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  style={{ ...S.btn("primary"), background: "#fbbf24", color: "#000000", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.15em", padding: "0.75rem 2rem" }}
                  onClick={() => launchBlitz.mutate()}
                  disabled={launchBlitz.isPending}
                >
                  {launchBlitz.isPending ? "Launching..." : "🚀 LAUNCH BLITZ"}
                </button>
                {blitzStatusQ.data && (
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                    <span style={{ color: "#4ade80" }}>{blitzStatusQ.data.fired} fired</span>
                    &nbsp;·&nbsp;
                    <span style={{ color: "#fbbf24" }}>{blitzStatusQ.data.pending} pending</span>
                    {blitzStatusQ.data.nextPostAt && (
                      <span style={{ display: "block", marginTop: "2px", color: "rgba(255,255,255,0.3)" }}>
                        Next: {new Date(blitzStatusQ.data.nextPostAt).toLocaleTimeString()}
                        {blitzStatusQ.data.nextCaption && ` — "${blitzStatusQ.data.nextCaption}..."`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Seed Queue */}
          <div style={S.section}>
            <div style={S.sectionHead}>
              <div style={S.sectionTitle}><PlusCircle className="w-3 h-3" /> Seed Post Queue</div>
            </div>
            <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Posts to seed</label>
                <input
                  type="number"
                  value={seedCount}
                  onChange={(e) => setSeedCount(parseInt(e.target.value) || 500)}
                  min={10} max={2000}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff", padding: "0.5rem 0.75rem", width: "120px",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem",
                  }}
                />
              </div>
              <div style={{ paddingTop: "20px" }}>
                <button
                  style={S.btn("primary")}
                  onClick={() => seedQueue.mutate({ count: seedCount })}
                  disabled={seedQueue.isPending}
                >
                  {seedQueue.isPending ? "Seeding..." : `Seed ${seedCount} Posts`}
                </button>
              </div>
              <div style={{ paddingTop: "20px", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                Queue: <strong style={{ color: "#ffffff" }}>{stats?.queue?.pending?.toLocaleString() ?? "—"}</strong> pending
                &nbsp;·&nbsp;
                <strong style={{ color: "#4ade80" }}>{stats?.queue?.posted?.toLocaleString() ?? "—"}</strong> posted
              </div>
            </div>
          </div>

          {/* Engine Status */}
          <div style={S.section}>
            <div style={S.sectionHead}>
              <div style={S.sectionTitle}><Zap className="w-3 h-3" /> Engine Actions</div>
            </div>
            <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Reply to Comments", desc: "Bots reply to every user comment with scripted hooks", action: "reply_to_comment", color: "#93c5fd" },
                { label: "Like-Back Engine", desc: "Bots comment back on every user like on their posts", action: "like_back", color: "#fde68a" },
                { label: "Comment on Users", desc: "2–4 bots proactively comment on every new user post", action: "comment_on_user", color: "#86efac" },
                { label: "Boost Cold Posts", desc: "Bot likes injected on posts with < 10 likes after 30 min", action: "boost_post", color: "#fdba74" },
              ].map((item) => (
                <div key={item.action} style={{
                  padding: "1rem", background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: item.color, marginBottom: "4px", letterSpacing: "0.05em" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Activity Log Tab */}
      {activeTab === "log" && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div style={S.sectionTitle}><Activity className="w-3 h-3" /> Recent Activity ({logQ.data?.length ?? 0})</div>
            <button style={S.btn("ghost")} onClick={() => logQ.refetch()}>
              <RefreshCw className="w-3 h-3" style={{ display: "inline", marginRight: "4px" }} /> Refresh
            </button>
          </div>
          {logQ.isLoading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div>
          ) : logQ.data?.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              No activity yet — run an engagement cycle to populate the log.
            </div>
          ) : (
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {logQ.data?.map((entry) => (
                <div key={entry.id} style={S.logRow}>
                  <span style={S.badge(entry.actionType)}>{ACTION_LABELS[entry.actionType] ?? entry.actionType}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>
                      <strong style={{ color: "#ffffff" }}>{entry.botName ?? "Bot"}</strong>
                      {entry.targetUserId && <span style={{ color: "rgba(255,255,255,0.3)" }}> → User #{entry.targetUserId}</span>}
                      {entry.targetPostId && <span style={{ color: "rgba(255,255,255,0.3)" }}> · Post #{entry.targetPostId}</span>}
                    </div>
                    {entry.body && (
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        "{entry.body}"
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bot Roster Tab */}
      {activeTab === "roster" && (
        <div style={S.section}>
          <div style={S.sectionHead}>
            <div style={S.sectionTitle}><Users className="w-3 h-3" /> Bot Roster ({rosterQ.data?.total?.toLocaleString() ?? "—"} total)</div>
          </div>
          {rosterQ.isLoading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["ID", "Name", "Gender", "Archetype", "City", "Tier", "Followers", "Status"].map((h) => (
                      <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rosterQ.data?.bots.map((bot) => (
                    <tr key={bot.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.3)" }}>#{bot.id}</td>
                      <td style={{ padding: "0.6rem 1rem", color: "#ffffff", fontWeight: 600 }}>{bot.displayName}</td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{bot.gender}</td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)" }}>{bot.archetype}</td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)" }}>{bot.city ?? "—"}</td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "3px", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                          background: bot.tier === "platinum" ? "rgba(168,85,247,0.2)" : bot.tier === "gold" ? "rgba(234,179,8,0.2)" : "rgba(148,163,184,0.2)",
                          color: bot.tier === "platinum" ? "#d8b4fe" : bot.tier === "gold" ? "#fde68a" : "#94a3b8",
                        }}>
                          {bot.tier}
                        </span>
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)" }}>{bot.followerCount.toLocaleString()}</td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <button
                          onClick={() => toggleBot.mutate({ botId: bot.id, active: !bot.active })}
                          style={{ background: "none", border: "none", cursor: "pointer", color: bot.active ? "#4ade80" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          {bot.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {bot.active ? "Active" : "Off"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
