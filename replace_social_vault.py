with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'r') as f:
    content = f.read()

start_marker = '        {/* \u2550\u2550\u2550\u2550 SOCIAL VAULT TAB \u2550\u2550\u2550\u2550 */}'
end_marker = '        {/* \u2550\u2550\u2550\u2550 VAULT TAB \u2550\u2550\u2550\u2550 */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: start={start_idx}, end={end_idx}")
    exit(1)

print(f"Found Social Vault tab: chars {start_idx} to {end_idx}")

new_social_vault = '''        {/* \u2550\u2550\u2550\u2550 SOCIAL VAULT TAB \u2550\u2550\u2550\u2550 */}
        {activeTab === "social-vault" && (
          <section style={{ minHeight: "calc(100vh - 64px)", background: "#000000", padding: "4rem 1.5rem 6rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: "0.75rem" }}>
                  E Capital Venture \xb7 Social Vault
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem" }}>
                  2,900 Clips. 15 Hosts. One Mission.
                </h2>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
                  Manual approve \u2192 post \u2192 log. Every clip directs to app download.
                </div>
              </div>

              {/* Aria Ticker */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                <AriaUpdateTicker />
              </div>

              {/* Video Format */}
              <div style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", padding: "2rem", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Video Script Format \xb7 No 41-Second Base Junk
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { step: "01", label: "Intro (Accent Matched)", desc: "I\u2019m The Don. [Italian accent] Love the bling? Ice? Drip? We got it all \u2014 DM for discount." },
                    { step: "02", label: "Machiavelli Quote", desc: "Raw quote in character. Pause. Modern spin \u2014 crypto, real estate, AI income." },
                    { step: "03", label: "Market Application", desc: "How Machiavelli games today\u2019s market. BTC position, Airbnb assignment, AI tool flip." },
                    { step: "04", label: "15-20 Sec Promo Close", desc: "Mindset clip, affiliate drop, mini-series outtake, or app tease. Ends: Download 1% Playground." },
                  ].map(s => (
                    <div key={s.step}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "rgba(201,168,76,0.2)", marginBottom: "0.25rem" }}>{s.step}</div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{s.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Post Log */}
              <SocialVaultPostLog />

              {/* Platforms */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Distributing To
                </div>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook"].map(p => (
                    <div key={p} style={{ padding: "0.6rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{p}</div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <div style={{ textAlign: "center" }}>
                <button onClick={() => setActiveTab("download")} style={{ padding: "1rem 3rem", background: "rgba(201,168,76,0.1)", color: "rgba(201,168,76,0.9)", border: "1px solid rgba(201,168,76,0.4)", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.35em", textTransform: "uppercase", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.1)"; }}
                >
                  Download 1% Playground Now
                </button>
              </div>
            </div>
          </section>
        )}
        '''

content = content[:start_idx] + new_social_vault + content[end_idx:]

with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("Social Vault tab replaced successfully")
print(f"New line count: {content.count(chr(10))}")
