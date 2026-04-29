                />
              </div>

              {/* Info */}
              <div>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.75rem" }}>
                  {person.division} · {person.location}
                </p>
                <h3
                  itemProp="name"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, color: "#ffffff", letterSpacing: "0.08em", marginBottom: "0.5rem" }}
                >
                  {person.name}
                </h3>
                <p
                  itemProp="jobTitle"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}
                >
                  {person.title}
                </p>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.35rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.65)",
                  paddingLeft: "1.25rem",
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "1.75rem",
                  lineHeight: 1.5,
                }}>
                  "{person.quote}"
                </blockquote>
                <p
                  itemProp="description"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.85, marginBottom: "1.5rem" }}
                >
                  {person.bio}
                </p>
                <a
                  href={`mailto:${person.email}`}
                  itemProp="email"
                  aria-label={`Email ${person.name}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                >
                  {person.email}
                </a>
                <meta itemProp="worksFor" content="Create AI Profit" />
              </div>
            </article>
          ))}
        </section>

        {/* ── DIVIDER ── */}
        <div role="separator" style={{ maxWidth: "1200px", margin: "0 auto 4rem", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", margin: 0 }}>
              Real Estate Division · Airbnb Portfolio · Short-Term Rentals
            </p>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>

        {/* ── REAL ESTATE STAFF ── */}
        <section
          aria-labelledby="realestate-heading"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 6rem" }}
        >
          <h2
            id="realestate-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "3.5rem" }}
          >
            Real Estate Division
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            {REAL_ESTATE_STAFF.map((person) => (
              <article
                key={person.id}
                itemScope
                itemType="https://schema.org/Person"
                style={{
                  padding: "2.5rem 0",
                  textAlign: "center",
                }}
              >
                <img
                  src={person.img}
                  alt={person.imgAlt}
                  itemProp="image"
                  loading="lazy"
                  width={320}
                  height={420}
                  style={{ width: "100%", maxHeight: "420px", objectFit: "cover", objectPosition: "top", display: "block", marginBottom: "1.75rem" }}
                />
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.5rem" }}>
                  {person.location}
                </p>
                <h3
                  itemProp="name"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.35rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.08em", marginBottom: "0.35rem" }}
                >
                  {person.name}
                </h3>
                <p
                  itemProp="jobTitle"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(255,255,255,0.28)", marginBottom: "1.25rem" }}
                >
                  {person.title}
                </p>
                <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                  "{person.quote}"
                </blockquote>
                <p
                  itemProp="description"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginBottom: "1.25rem" }}
                >
                  {person.bio}
                </p>
                <a
                  href={`mailto:${person.email}`}
                  itemProp="email"
                  aria-label={`Email ${person.name}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
                >
                  {person.email}
                </a>
                <meta itemProp="worksFor" content="Create AI Profit" />
              </article>
            ))}
          </div>
        </section>

        {/* ── AI HOST BOTS GRID ── */}
        <section aria-labelledby="ai-hosts-heading" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 6rem" }}>
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", margin: 0 }}>AI Host Network · 21 Multilingual Bots</p>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
          </div>
          <h2 id="ai-hosts-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "3.5rem" }}>The AI Host Network</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "2rem" }}>
            {AI_HOSTS.map((h) => (
              <div key={h.id} style={{ textAlign: "center" }}>
                <img
                  src={h.img}
                  alt={h.name}
                  loading="lazy"
                  style={{ width: "100%", maxWidth: "320px", height: "260px", objectFit: "contain", objectPosition: "center", display: "block", margin: "0 auto 1rem" }}
                />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>{h.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", fontWeight: 300, color: "rgba(148,163,170,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>{h.title}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>"{h.quote}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          role="contentinfo"
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <Link href="/" aria-label="Create AI Profit — Home">
            <img src={CAP_LOGO} alt="Create AI Profit" width={36} height={36} style={{ objectFit: "contain", marginBottom: "1rem", cursor: "pointer", opacity: 0.5 }} />
          </Link>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", fontWeight: 300, letterSpacing: "0.25em", color: "rgba(255,255,255,0.18)" }}>
            © 2026 Create AI Profit LLC · All Rights Reserved
          </p>
        </footer>

      </main>
    </div>
  );
}
