      <Route path={"/bizinvest"} component={() => <ComingSoonTab title="Business & Investment" desc="Deal flow, partnerships, and investment opportunities." />} />

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ─── COMING SOON TAB ─────────────────────────────────────────────────────────
function ComingSoonTab({ title, desc, badge }: { title: string; desc: string; badge?: string }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ background: "#000000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", paddingBottom: "80px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/social")}
        style={{
          position: "fixed", top: "16px", left: "16px",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px", padding: "8px 14px",
          color: "rgba(255,255,255,0.7)", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px",
          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em",
        }}
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {badge && (
        <div style={{
          background: "rgba(254,44,85,0.15)", border: "1px solid rgba(254,44,85,0.4)",
          borderRadius: "20px", padding: "4px 16px", marginBottom: "1.5rem",
          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#fe2c55",
        }}>
          {badge}
        </div>
      )}

      <div style={{
        width: "64px", height: "64px", borderRadius: "16px",
        background: "linear-gradient(135deg, #fe2c55, #25f4ee)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1.5rem",
        boxShadow: "0 0 40px rgba(254,44,85,0.3)",
      }}>
        <span style={{ fontSize: "1.75rem" }}>🔒</span>
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem", textAlign: "center" }}>