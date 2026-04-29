with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Find the exact Coming Soon tab section
start_marker = '        {/* \u2550\u2550\u2550\u2550 COMING SOON TAB \u2550\u2550\u2550\u2550 */}'
end_marker = '        {/* \u2550\u2550\u2550\u2550 HOST TAB \u2550\u2550\u2550\u2550 */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: start={start_idx}, end={end_idx}")
    exit(1)

print(f"Found Coming Soon tab: lines {start_idx} to {end_idx}")

# The new Coming Soon tab
new_coming_soon = '''        {/* \u2550\u2550\u2550\u2550 COMING SOON TAB \u2550\u2550\u2550\u2550 */}
        {activeTab === "coming-soon" && (
          <section style={{
            minHeight: "calc(100vh - 64px)",
            background: "#000000",
            padding: "4rem 1.5rem 6rem",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>

              {/* ── MISSION HEADER ── */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: "1rem" }}>
                  E Capital Venture \xb7 The Company
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#ffffff", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  Create AI Profit
                </h2>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem" }}>
                  Position &gt; Effort. Fish, don\u2019t eat.
                </div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(201,168,76,0.06)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  padding: "0.6rem 2rem",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem",
                  letterSpacing: "0.4em", textTransform: "uppercase",
                  color: "rgba(201,168,76,0.7)",
                }}>
                  Mission: Free 10 Million Men From The Cage
                </div>
              </div>

              {/* ── AVATAR OF THE DAY ── */}
              <AvatarOfTheDay />

              {/* ── ALL 15 AVATARS GRID ── */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  The Company \xb7 15 Hosts \xb7 Armani French-Cut \xb7 Rolex \xb7 Medallions \xb7 Cigars
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
                  {HOSTS.map((h, i) => {
                    const MACH_QUOTES = [
                      { quote: "It is better to be feared than loved, if you cannot be both.", spin: "Power isn\u2019t given. It\u2019s built. Position yourself before the market moves." },
                      { quote: "The lion cannot protect himself from traps, and the fox cannot defend himself from wolves.", spin: "In crypto: be the fox. Read the chart. Don\u2019t be the lion who charges blind." },
                      { quote: "Never attempt to win by force what can be won by deception.", spin: "Real estate: buy the assignment, not the property. Leverage beats labor." },
                      { quote: "Whosoever desires constant success must change his conduct with the times.", spin: "AI changed the game. Those who adapted in 2024 are cashing in 2025." },
                      { quote: "The first method for estimating the intelligence of a ruler is to look at the men he has around him.", spin: "Your network is your net worth. Surround yourself with builders, not consumers." },
                      { quote: "Men in general judge more from appearances than from reality.", spin: "Brand first. Revenue follows. The 1% understand optics before operations." },
                      { quote: "It is not titles that honor men, but men that honor titles.", spin: "Don\u2019t chase the title. Build the empire. The title follows the work." },
                      { quote: "One change always leaves the way open for the establishment of others.", spin: "One passive stream opens the door to ten. Start with one. Scale from there." },
                      { quote: "The wise man does at once what the fool does finally.", spin: "Stop waiting for the perfect moment. The market doesn\u2019t wait for you." },
                      { quote: "Whoever wishes to foresee the future must consult the past.", spin: "Bitcoin 2017. NFTs 2021. AI 2024. The pattern is clear. Position now." },
                      { quote: "Never do an enemy a small injury.", spin: "In business: go all in or don\u2019t go. Half measures lose money and time." },
                      { quote: "The promise given was a necessity of the past: the word broken is a necessity of the present.", spin: "Adapt your strategy as the market shifts. Loyalty is to the outcome, not the method." },
                      { quote: "It is double pleasure to deceive the deceiver.", spin: "When the market fakes a move, the smart money already knows. Read between the candles." },
                      { quote: "There is no other way to guard yourself against flattery than by making men understand that telling you the truth will not offend you.", spin: "Surround yourself with people who tell you the truth about your business, not what you want to hear." },
                      { quote: "A prince never lacks legitimate reasons to break his promise.", spin: "Pivot fast. The market rewards those who adapt, not those who stay loyal to a losing position." },
                    ];
                    const mq = MACH_QUOTES[i % MACH_QUOTES.length];
                    const outfitSlot = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 3)) % 3;
                    const outfitLabel = ["Armani French-Cut · Black", "Armani French-Cut · Navy", "Armani French-Cut · Charcoal"][outfitSlot];
                    return (
                      <div key={h.id} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        padding: "1rem 0.75rem 1.25rem",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                        onClick={() => setActiveTab("host")}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}
                      >
                        <img src={h.img} alt={h.title} style={{
                          width: "100%", height: "160px",
                          objectFit: "cover", objectPosition: "top",
                          marginBottom: "0.75rem",
                        }} />
                        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{h.title}</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.4rem" }}>{h.origin}</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>{outfitLabel}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)", lineHeight: 1.4, marginBottom: "0.4rem" }}>
                          \u201c{mq.quote}\u201d
                        </div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", color: "rgba(201,168,76,0.4)", lineHeight: 1.4 }}>
                          {mq.spin}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── VIDEO SCRIPT FORMAT ── */}
              <div style={{
                background: "rgba(201,168,76,0.03)",
                border: "1px solid rgba(201,168,76,0.1)",
                padding: "2rem",
                marginBottom: "3rem",
              }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1.5rem", textAlign: "center" }}>
                  2,900 Queued Clips \xb7 Video Script Format
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { step: "01", label: "Intro (Accent Matched)", desc: "I\u2019m The Don. [Italian accent] Love the bling? Ice? Drip? We got it all \u2014 DM for discount." },
                    { step: "02", label: "Machiavelli Quote", desc: "Raw quote delivered in character. Pause. Then the modern spin \u2014 crypto, real estate, AI income." },
                    { step: "03", label: "Market Application", desc: "How Machiavelli would game today\u2019s market. Specific: BTC position, Airbnb assignment, AI tool flip." },
                    { step: "04", label: "15-20 Sec Promo Close", desc: "Mindset clip, affiliate drop, mini-series outtake, or app tease. Always ends: Download 1% Playground." },
                  ].map(s => (
                    <div key={s.step}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "rgba(201,168,76,0.2)", marginBottom: "0.25rem" }}>{s.step}</div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{s.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── OUTFIT ROTATION NOTICE ── */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.75rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "0.75rem 2rem",
                }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                    Outfit Rotation: Every 3 Days \xb7 All 15 Avatars Swap Simultaneously \xb7 Posted as Avatar of the Day
                  </div>
                </div>
              </div>

              {/* ── BOTTOM NAV HINTS ── */}
              <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {NAV_TABS.slice(1).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem",
                      letterSpacing: "0.3em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.18)", padding: "0.25rem 0.5rem",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,168,76,0.6)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.18)"}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        '''

content = content[:start_idx] + new_coming_soon + content[end_idx:]

with open('/home/ubuntu/createaiprofit/client/src/pages/Home.tsx', 'w') as f:
    f.write(content)

print("Coming Soon tab replaced successfully")
print(f"New line count: {content.count(chr(10))}")
