function AlertsTab() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data: alerts = [], isLoading, refetch } = trpc.warRoom.alerts.list.useQuery({ unreadOnly, limit: 50 });
  const markRead = trpc.warRoom.alerts.markRead.useMutation({ onSuccess: () => refetch() });
  const markAllRead = trpc.warRoom.alerts.markAllRead.useMutation({ onSuccess: () => refetch() });

  const SEVERITY_COLOR: Record<string, string> = {
    info: "rgba(59,130,246,0.2)", warning: "rgba(234,179,8,0.2)", critical: "rgba(248,113,113,0.2)",
  };
  const SEVERITY_TEXT: Record<string, string> = {
    info: "#60a5fa", warning: "#eab308", critical: "#f87171",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <SectionHeader label="System Alerts" title="War Room Notifications" inline />
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            style={{ ...S.btn("ghost"), padding: "0.4rem 0.85rem", fontSize: "0.75rem", background: unreadOnly ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)" }}
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? "Show All" : "Unread Only"}
          </button>
          <button style={S.btn("ghost")} onClick={() => markAllRead.mutate()}>Mark All Read</button>
        </div>
      </div>

      {isLoading ? <Loader /> : alerts.length === 0 ? <Empty text="No alerts. All clear." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: alert.read ? "#000000" : "rgba(255,255,255,0.02)",
                padding: "1rem 1.25rem",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
                opacity: alert.read ? 0.5 : 1,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                  <span style={{ ...S.badge(SEVERITY_COLOR[alert.severity] ?? "rgba(255,255,255,0.1)"), color: SEVERITY_TEXT[alert.severity] ?? "#ffffff" }}>
                    {alert.severity}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#ffffff", fontWeight: 600 }}>{alert.title}</span>
                  {!alert.read && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  )}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginBottom: "0.25rem" }}>{alert.message}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
              {!alert.read && (
                <button style={{ ...S.btn("ghost"), padding: "0.3rem 0.75rem", fontSize: "0.75rem", flexShrink: 0 }} onClick={() => markRead.mutate({ id: alert.id })}>
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FINANCE TAB ─────────────────────────────────────────────────────────────
/**
 * MONEY FLOW:
 * Gross → Taxes (~46.6%) → After-Tax → 40% Member Wallets / 40% Surplus / 20% Business Checking
 * NO WITHDRAWALS from in-app wallet by anyone, ever.
 */
function FinanceTab() {
  const [grossInput, setGrossInput] = useState("");
  const [grossRevenue, setGrossRevenue] = useState<number | null>(null);
  const [note, setNote] = useState("");