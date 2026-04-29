            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Product", "Link", "Commission", "Action"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AFFILIATE_LINKS.map(link => (
                  <tr key={link.key} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem" }}>{link.label}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontFamily: "monospace" }}>{link.url}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "#4ade80", fontSize: "0.8rem" }}>20%</td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <button onClick={() => { navigator.clipboard.writeText(link.url); toast.success("Link copied!"); }} style={{
                        background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.5)", padding: "0.3rem 0.75rem",
                        fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
                      }}>
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOTS TAB */}
        {activeTab === "bots" && (
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Female-Only Bot Roster — 8 Active · Scale to 50 on Traffic Spike
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {FEMALE_AVATARS.map(av => {
                const outfit = getCurrentOutfit(av.id);
                return (
                  <div key={av.id} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    padding: "1.25rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{av.name}</div>
                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem" }}>{av.city}</div>
                      </div>
                      <span style={{ color: av.active ? "#4ade80" : "#f87171", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
                        ● {av.active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
                      Platform: {av.platform}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>
                      Wearing: {outfit.tag}
                    </div>
                    <button
                      onClick={() => toast.info(`${av.name} ${av.active ? "paused" : "resumed"}. Connect platform APIs to activate live posting.`)}
                      style={{
                        width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.5)", padding: "0.5rem",
                        fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
                      }}
                    >
                      {av.active ? "Pause Bot" : "Resume Bot"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
              Scale rule: when daily traffic exceeds 10,000 unique visitors, auto-scale to 50 bots. Each new bot inherits the female-only roster, outfit rotation, and affiliate link assignment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
