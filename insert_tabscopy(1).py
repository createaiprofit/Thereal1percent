with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Also add AriaUpdateTicker component before the Home function
aria_ticker_component = '''
// ─── ARIA RABBIT HOURLY UPDATE TICKER ────────────────────────────────────────
const ARIA_UPDATES = [
  "🏠 18% off Florida condo — owner slashed 20%. DM me.",
  "📈 Crypto flip alert: BTC up 4% overnight. Position now.",
  "🏖️ Airbnb cash cow — Miami Beach unit, 92% occupancy. DM for details.",
  "💎 Vault drop: Cartier Love Bracelet — limited stock. Grab it.",
  "🔑 Real estate assignment — Dallas duplex, $40K below market. DM.",
  "📱 1% Playground hit 10K users. Download before the waitlist closes.",
  "🌴 Scottsdale vacation rental — 3 nights booked, $2,400 passive. DM.",
  "💰 Affiliate commission just hit $8,200 this week. System works.",
  "🎯 New episode dropping tonight — Checkmate EP 04. Get notified.",
  "🚀 AI income system update: 3 new passive streams added. Log in.",
];

function AriaUpdateTicker() {
  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ARIA_UPDATES.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "0.75rem",
      background: "rgba(201,168,76,0.05)",
      border: "1px solid rgba(201,168,76,0.2)",
      padding: "0.75rem 1.5rem",
      maxWidth: "600px", width: "100%",
      transition: "opacity 0.4s",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "rgba(201,168,76,0.1)",
        border: "1px solid rgba(201,168,76,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem",
        color: "rgba(201,168,76,0.8)", fontWeight: 700,
      }}>AR</div>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.2rem" }}>
          Aria Rabbit · Live Update
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.75)" }}>
          {ARIA_UPDATES[idx]}
        </div>
      </div>
    </div>
  );
}

'''

# Insert AriaUpdateTicker before the MAIN HOME COMPONENT marker
main_marker = '// ─── MAIN HOME COMPONENT ────────────────────────────────────────────────────'
if main_marker in content:
    content = content.replace(main_marker, aria_ticker_component + main_marker)
    print("AriaUpdateTicker inserted")
else:
    print("WARNING: main marker not found, trying alternate")
    # Try to insert before the Tab type definition
    tab_marker = 'type Tab = '
    idx = content.find(tab_marker)
    if idx > 0:
        content = content[:idx] + aria_ticker_component + content[idx:]
        print("AriaUpdateTicker inserted before Tab type")

# Now add React import if not present (for React.useState/useEffect in AriaUpdateTicker)
if "import React" not in content and "import { " in content:
    content = content.replace("import { useState", "import React, { useState", 1)
    print("Added React import")

# Insert Cast + Social Vault tabs before VAULT TAB
vault_marker = '        {/* \u2550\u2550\u2550\u2550 VAULT TAB \u2550\u2550\u2550\u2550 */}'

cast_and_social_vault = '''        {/* \u2550\u2550\u2550\u2550 CAST TAB \u2550\u2550\u2550\u2550 */}
        {activeTab === "cast" && (
          <section style={{
            minHeight: "calc(100vh - 64px)",
            background: "#000000",
            padding: "4rem 1.5rem 6rem",
            position: "relative", overflow: "hidden",
          }}>
            {/* Noise texture */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\\")",
              pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              {/* Eyebrow */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: "1rem" }}>
                  E Capital Venture \xb7 Original Series
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                  CHECKMATE
                </h2>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
                  ...and they thought it was an engagement party.
                </div>
              </div>

              {/* STARS */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  \u2605 \xa0 Stars
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { name: "Aria Rabbit", role: "The Seductress", note: "She opens every door." },
                    { name: "Tadow", role: "The Architect", note: "The man behind the system." },
                    { name: "K.B.", role: "The Legend", note: "Mamba mentality meets AI." },
                    { name: "J.B.", role: "The Disruptor", note: "He bought the future first." },
                    { name: "E.M.", role: "The Operator", note: "Mars isn\u2019t far enough." },
                    { name: "D.T.", role: "The Dealmaker", note: "Every room is a negotiation." },
                    { name: "B.G.", role: "The Strategist", note: "Philanthropy is the long game." },
                    { name: "S.A.", role: "The Visionary", note: "He saw the AI wave coming." },
                    { name: "S.J.", role: "The Ghost", note: "Think different. Always." },
                    { name: "V.", role: "The Painter", note: "Every masterpiece has a price." },
                  ].map((star) => (
                    <div key={star.name} style={{
                      background: "rgba(201,168,76,0.03)",
                      border: "1px solid rgba(201,168,76,0.15)",
                      padding: "1.25rem 1rem",
                      textAlign: "center",
                      transition: "border-color 0.3s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.45)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"}
                    >
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 0.75rem",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.1rem", color: "rgba(201,168,76,0.7)",
                      }}>
                        {star.name.charAt(0)}
                      </div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                        {star.name}
                      </div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "0.5rem" }}>
                        {star.role}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
                        {star.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUPPORTING CAST */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Supporting Cast
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                  {HOSTS.map(h => (
                    <div key={h.id} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "0.5rem 1rem",
                      transition: "border-color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(148,163,170,0.3)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}
                    >
                      <img src={h.img} alt={h.title} style={{ width: "28px", height: "28px", objectFit: "cover", objectPosition: "top", borderRadius: "2px" }} />
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{h.title}</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{h.origin}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trailer + Binge CTA */}
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>
                  21 Episodes \xb7 Dropping Now
                </div>
                <button
                  onClick={() => setActiveTab("series")}
                  style={{
                    padding: "1rem 3rem",
                    background: "rgba(201,168,76,0.1)",
                    color: "rgba(201,168,76,0.9)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                    letterSpacing: "0.35em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.1)"; }}
                >
                  \u25b6 \xa0 Watch Trailer \xb7 Binge All 21
                </button>
                <button
                  onClick={() => setActiveTab("download")}
                  style={{
                    padding: "0.75rem 2.5rem",
                    background: "transparent",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  Download 1% Playground App
                </button>
              </div>
            </div>
          </section>
        )}

        {/* \u2550\u2550\u2550\u2550 SOCIAL VAULT TAB \u2550\u2550\u2550\u2550 */}
        {activeTab === "social-vault" && (
          <section style={{
            minHeight: "calc(100vh - 64px)",
            background: "#000000",
            padding: "4rem 1.5rem 6rem",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: "1rem" }}>
                  E Capital Venture \xb7 Content Engine
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                  Social Media Vault
                </h2>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)", marginBottom: "2rem" }}>
                  2,900 clips queued. Baby avatars lead every drop.
                </div>
                {/* Aria Rabbit hourly update ticker */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <AriaUpdateTicker />
                </div>
              </div>

              {/* Video format explainer */}
              <div style={{
                background: "rgba(201,168,76,0.03)",
                border: "1px solid rgba(201,168,76,0.12)",
                padding: "1.5rem 2rem",
                marginBottom: "3rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1rem",
              }}>
                {[
                  { step: "01", label: "Baby Avatar Intro", desc: "I\u2019m The Don. Love the bling? Ice? Drip? We got it all \u2014 DM for discount." },
                  { step: "02", label: "Machiavelli Quote", desc: "Raw quote + modern crypto/real estate spin on how he\u2019d game it today." },
                  { step: "03", label: "15-20 Sec Promo", desc: "Affiliate drop, mindset clip, mini-series outtake, or app tease." },
                  { step: "04", label: "CTA Close", desc: "Download 1% Playground now. Every. Single. Clip." },
                ].map(s => (
                  <div key={s.step} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "rgba(201,168,76,0.25)", marginBottom: "0.25rem" }}>{s.step}</div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{s.label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* Baby avatar rotation grid */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  15 Rotating Hosts \xb7 Armani \xb7 Medallions \xb7 Cigars \xb7 Rolex
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem" }}>
                  {HOSTS.slice(0, 15).map((h, i) => (
                    <div key={h.id} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "1rem 0.75rem",
                      textAlign: "center",
                      position: "relative",
                      transition: "border-color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}
                    >
                      <div style={{
                        position: "absolute", top: "0.4rem", right: "0.4rem",
                        fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem",
                        letterSpacing: "0.1em", color: "rgba(201,168,76,0.5)",
                        background: "rgba(201,168,76,0.06)",
                        padding: "0.15rem 0.4rem",
                      }}>#{i + 1}</div>
                      <img src={h.img} alt={h.title} style={{
                        width: "70px", height: "90px",
                        objectFit: "cover", objectPosition: "top",
                        marginBottom: "0.75rem",
                      }} />
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{h.title}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{h.origin}</div>
                      <div style={{ marginTop: "0.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", color: "rgba(201,168,76,0.45)" }}>🔒 Queued</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Distributing To
                </div>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook"].map(p => (
                    <div key={p} style={{
                      padding: "0.6rem 1.5rem",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}>{p}</div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setActiveTab("download")}
                  style={{
                    padding: "1rem 3rem",
                    background: "rgba(201,168,76,0.1)",
                    color: "rgba(201,168,76,0.9)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                    letterSpacing: "0.35em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
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

content = content.replace(vault_marker, cast_and_social_vault + vault_marker)
print("Cast + Social Vault tabs inserted")

with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("File saved successfully")
print(f"New line count: {content.count(chr(10))}")
