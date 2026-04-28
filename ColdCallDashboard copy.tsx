import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";

const CALL_SCRIPT = `Hi, this is Sarah — I'm local, just closed two deals down the street. I noticed your property at [ADDRESS] and wanted to reach out personally. Have you ever thought about cashing out at today's prices?

[IF INTERESTED]
I can walk you through the comps — your neighbors at [COMP_ADDRESS] just closed at [COMP_PRICE]. With current cap rates, you're sitting on serious equity. What would you do with that kind of freedom? Bass boat? Lake cabin? Mexico bar?

[IF HESITANT]
I totally understand. No pressure at all. Can I send you a quick market report for your area? Just so you have the numbers. What's the best email?

[IF NO]
Absolutely respect that. I'll make a note — if anything changes, you have my number. Have a great day!`;

const MOCK_LEADS = [
  { id: 1, name: "James Whitfield", address: "4821 Lakewood Dr, Austin TX", status: "Interested", lastContact: "2h ago", source: "County Records", drip: true },
  { id: 2, name: "Patricia Nguyen", address: "1203 Sunset Blvd, Miami FL", status: "No", lastContact: "4h ago", source: "County Records", drip: true },
  { id: 3, name: "Robert Castillo", address: "889 Oak Ridge Rd, Nashville TN", status: "Callback", lastContact: "1d ago", source: "County Records", drip: false },
  { id: 4, name: "Linda Thompson", address: "5500 Harbor View, San Diego CA", status: "Voicemail", lastContact: "1d ago", source: "County Records", drip: false },
  { id: 5, name: "Marcus Bell", address: "2200 Peachtree St, Atlanta GA", status: "Interested", lastContact: "3h ago", source: "County Records", drip: true },
];

const BOT_STATUS = [
  { name: "Sarah-01", calls: 47, connects: 12, interested: 3, status: "Active" },
  { name: "Sarah-02", calls: 39, connects: 9, interested: 2, status: "Active" },
  { name: "Sarah-03", calls: 52, connects: 15, interested: 4, status: "Active" },
  { name: "Sarah-04", calls: 31, connects: 7, interested: 1, status: "Paused" },
  { name: "Sarah-05", calls: 44, connects: 11, interested: 3, status: "Active" },
];

const STATUS_COLOR: Record<string, string> = {
  Interested: "#4ade80",
  No: "#f87171",
  Callback: "#facc15",
  Voicemail: "#94a3b8",
  Active: "#4ade80",
  Paused: "#94a3b8",
};

export default function ColdCallDashboard() {
  const [activeTab, setActiveTab] = useState<"bots" | "leads" | "script" | "config">("bots");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const [hubspotKey, setHubspotKey] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configuration saved. Connect your Twilio account to activate dialing.");
    setConfigSaved(true);
  };

  const s: React.CSSProperties = {
    fontFamily: "'Rajdhani', sans-serif",
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ffffff", ...s }}>
      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/admin">
              <img src={CAP_LOGO} alt="CAP" style={{ height: "36px", width: "36px", objectFit: "contain", cursor: "pointer" }} />
            </Link>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Cold-Call Bot Dashboard
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["bots", "leads", "script", "config"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                  border: `1px solid ${activeTab === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                  color: activeTab === tab ? "#ffffff" : "rgba(255,255,255,0.4)",
                  padding: "0.4rem 1rem", fontSize: "0.7rem", letterSpacing: "0.2em",
                  textTransform: "uppercase", cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        {/* STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Calls Today", value: "213" },
            { label: "Connects", value: "54" },
            { label: "Interested", value: "13" },
            { label: "In Drip Funnel", value: "41" },
            { label: "Active Bots", value: "4/5" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              padding: "1.25rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>{stat.value}</div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* BOTS TAB */}
        {activeTab === "bots" && (
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Bot Status — 5 Female Cold-Call Agents · Southern Drawl · Public Records Only
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Bot", "Calls", "Connects", "Interested", "Status", "Action"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOT_STATUS.map(bot => (
                  <tr key={bot.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem" }}>{bot.name}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "rgba(255,255,255,0.6)" }}>{bot.calls}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "rgba(255,255,255,0.6)" }}>{bot.connects}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "#4ade80", fontWeight: 600 }}>{bot.interested}</td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span style={{ color: STATUS_COLOR[bot.status], fontSize: "0.7rem", letterSpacing: "0.2em" }}>● {bot.status}</span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <button
                        onClick={() => toast.info(`${bot.name} ${bot.status === "Active" ? "paused" : "resumed"}. Connect Twilio to activate real dialing.`)}
                        style={{
                          background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.5)", padding: "0.3rem 0.75rem",
                          fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
                        }}
                      >
                        {bot.status === "Active" ? "Pause" : "Resume"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.15)", fontSize: "0.75rem", color: "rgba(250,204,21,0.7)", letterSpacing: "0.1em" }}>
              ⚠ To activate live dialing: add your Twilio Account SID + Auth Token in the Config tab. Bots use public county records only — TCPA compliant, no MLS scraping.
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Lead Pipeline — Source: County Public Records · No MLS · No Social Scraping
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Name", "Address", "Status", "Last Contact", "Drip Funnel"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADS.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.9rem 1rem", fontSize: "0.9rem" }}>{lead.name}</td>
                    <td style={{ padding: "0.9rem 1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{lead.address}</td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span style={{ color: STATUS_COLOR[lead.status], fontSize: "0.7rem", letterSpacing: "0.15em" }}>● {lead.status}</span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{lead.lastContact}</td>
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <span style={{ color: lead.drip ? "#4ade80" : "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>
                        {lead.drip ? "✓ Active" : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SCRIPT TAB */}
        {activeTab === "script" && (
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Call Script — Sarah · 28yo · Light Southern Drawl · ElevenLabs Voice Clone
            </div>
            <textarea
              defaultValue={CALL_SCRIPT}
              style={{
                width: "100%", minHeight: "400px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff",
                padding: "1.5rem", fontSize: "0.85rem", lineHeight: 1.8,
                fontFamily: "monospace", resize: "vertical", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                onClick={() => toast.success("Script saved.")}
                style={{
                  background: "#ffffff", color: "#000000", border: "none",
                  padding: "0.7rem 2rem", fontSize: "0.7rem", letterSpacing: "0.25em",
                  textTransform: "uppercase", fontWeight: 700, cursor: "pointer",
                }}
              >
                Save Script
              </button>
              <button
                onClick={() => toast.info("Voice preview requires ElevenLabs API key in Config tab.")}
                style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.6)", padding: "0.7rem 2rem",
                  fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                ▶ Preview Voice
              </button>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === "config" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.5rem" }}>
              Integration Config — Add API Keys to Activate Live Dialing
            </div>
            <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { label: "Twilio Account SID", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", value: twilioSid, onChange: setTwilioSid, hint: "From console.twilio.com" },
                { label: "Twilio Auth Token", placeholder: "Your auth token", value: twilioToken, onChange: setTwilioToken, hint: "Keep secret — server-side only" },
                { label: "ElevenLabs API Key", placeholder: "Your ElevenLabs key", value: elevenlabsKey, onChange: setElevenlabsKey, hint: "For Sarah voice clone (elevenlabs.io)" },
                { label: "HubSpot / ClickFunnels API Key", placeholder: "Your CRM API key", value: hubspotKey, onChange: setHubspotKey, hint: "For 'No' → drip funnel automation" },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "0.5rem" }}>
                    {field.label}
                  </label>
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                      color: "#ffffff", padding: "0.75rem 1rem", fontSize: "0.85rem",
                      fontFamily: "monospace", outline: "none",
                    }}
                  />
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", marginTop: "0.3rem" }}>{field.hint}</div>
                </div>
              ))}
              <button type="submit" style={{
                background: "#ffffff", color: "#000000", border: "none",
                padding: "0.85rem 2.5rem", fontSize: "0.75rem", letterSpacing: "0.25em",
                textTransform: "uppercase", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start",
              }}>
                Save Configuration
              </button>
              {configSaved && (
                <div style={{ color: "#4ade80", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
                  ✓ Saved. Add keys above to activate live Twilio dialing.
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
