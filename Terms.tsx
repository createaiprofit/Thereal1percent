import { useLocation } from "wouter";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_monogram-eyMrqTsnzb85aGoXmAG5LA.webp";

const SECTIONS = [
  {
    num: "01",
    title: "Private, Invite-Only Club",
    body: `This is a private, non-public platform. Access is by invitation only. We reserve the right to revoke membership at any time — no notice, no refund, no appeal. By accessing this platform, you agree not to publicly share, screenshot, or leak any content, communications, or materials from within the platform. Violation results in: (1) immediate and permanent ban with no appeal; (2) full forfeiture of your entire wallet balance; (3) potential civil and criminal legal action. Screenshots, leaks, scams, and unauthorized bot activity are all grounds for instant removal. We keep the wallet. You keep the lesson.`,
  },
  {
    num: "02",
    title: "International Users",
    body: `The platform is available worldwide. You are solely responsible for compliance with your local laws and regulations. We collect only the minimum data necessary for login (email or phone). No KYC (Know Your Customer) verification is required unless mandated by applicable law. All disputes are subject to mandatory arbitration in Nevada, USA, under AAA rules. No class actions. No jury trials.`,
  },
  {
    num: "03",
    title: "Social Media & Profiles",
    body: `Profiles, posts, chats, likes, and follows are your content and your risk. We do not moderate content unless it is illegal (including but not limited to nudity involving minors, credible threats of violence, or content prohibited by U.S. federal law). We bear no liability for harassment, scams, or fake profiles. You agree to indemnify and hold harmless Create AI Profit LLC against any claim arising from your interactions with other users. All app-generated content — including avatars, badges, and feed elements — is the sole intellectual property of Create AI Profit LLC.`,
  },
  {
    num: "04",
    title: "Concierge & Hosting",
    body: `We facilitate connections between users for travel and experiences (including but not limited to New York NYE events, Dubai weekends, and private gatherings). This is facilitation only. We bear no liability for safety, accidents, theft, death, injury, or property damage arising from any arranged experience. Hosts and travelers are responsible for their own private contracts and agreements. Our fee structure: 20% platform fee charged to travelers; 10% platform fee charged to hosts. In the event of disputes between hosts and travelers, parties are expected to settle privately. We may mediate at our discretion — our decision is final and binding. No insurance is provided. You are responsible for obtaining your own coverage. If selected for reality show filming, you consent to footage use across YouTube, social media, and promotional materials. We own all edits. No royalties are paid.`,
  },
  {
    num: "05",
    title: "Reality Show & Filming",
    body: `If selected to participate in any Create AI Profit production, you grant Create AI Profit LLC a perpetual, irrevocable, worldwide, royalty-free license to film, edit, distribute, and monetize footage of your likeness, voice, and performance. You waive all privacy and likeness claims related to such footage. Participation is unpaid — compensation is exposure and platform access. We own all intellectual property arising from productions. We bear no liability for on-set incidents including injury, property damage, or personal loss. Consent to filming is collected at signup and is non-revocable once granted.`,
  },
  {
    num: "06",
    title: "Marketplace & Future Store",
    body: `Users may buy and sell luxury goods (including but not limited to watches, vehicles, cigars, and limited-edition merchandise) through the platform marketplace. Create AI Profit LLC takes a 60% commission on every transaction. Sellers are solely responsible for delivery, authenticity verification, and any disputes arising from transactions. No refunds are issued by Create AI Profit LLC. We may list and sell our own items within the marketplace. We bear no liability for counterfeit goods, scams, failed deliveries, or buyer-seller disputes. All disputes are resolved through mandatory arbitration only.`,
  },
  {
    num: "07",
    title: "In-App Wallet & Transfers",
    body: `Your in-app wallet balance is subject to the following structure: 50% of all deposited funds are permanently locked and may be used for platform liquidity and operational investments at our sole discretion — no interest is paid, and no return is guaranteed. The remaining 50% is spendable: available for peer-to-peer transfers (via red dot QR code), NFC payments, and cash advances of up to 50% of your locked balance (interest-free, auto-repaid from future deposits). Create AI Profit LLC owns all wallet technology. This wallet is not a bank account — it is not FDIC-insured, and we do not hold a banking license. We bear no liability for hacks, unauthorized access, system failures, or loss of funds. No interest is paid on any balance, ever. Use of the wallet is entirely at your own risk.`,
  },
  {
    num: "08",
    title: "General Rules & Protection",
    body: `No user data is shared with third parties — ever. All data is private and encrypted. We reserve the right to update these Terms at any time without notice. Continued use of the platform constitutes acceptance of any updated Terms. All disputes are subject to mandatory arbitration under AAA rules in Nevada. You are responsible for your own arbitration fees if you do not prevail. No class actions. No punitive damages. Create AI Profit LLC is not liable for death, injury, fraud, financial loss, or any other damages arising from use of this platform. In the event of a ban, we retain all wallet balances, content, and data. Future rule additions are binding upon publication. It is your responsibility to review Terms regularly.`,
  },
  {
    num: "09",
    title: "Payout Structure & Enterprise Bonus",
    body: `Users receive 40% of gross platform earnings attributed to their account activity. Create AI Profit LLC retains 60%. Payouts are tiered and calculated daily. Enterprise users who maintain a minimum of five (5) hours of active session time and post a minimum of 150 comments per day (30 per hour over a 5-hour window) are eligible for an Enterprise Bonus of $500 USD every three (3) days. Bonus eligibility is verified automatically by the platform. Create AI Profit LLC reserves the right to audit, withhold, or reverse any payout in the event of suspected fraud, bot manipulation by the user, or violation of these Terms. All payout figures are gross estimates and are not guaranteed. Platform earnings fluctuate based on bot activity, ad revenue, and marketplace volume. No minimum payout is guaranteed. Payouts are credited to the in-app wallet only — no cash withdrawals unless explicitly enabled by the platform.`,
  },
  {
    num: "10",
    title: "AI Content Ownership & Intellectual Property",
    body: `All AI-generated content on this platform — including but not limited to avatars, bot profiles, bot posts, video series, scripts, voiceovers, images, and any derivative works — is the sole and exclusive intellectual property of Create AI Profit LLC, regardless of the tools, models, or services used in their creation. Unauthorized duplication, reproduction, redistribution, scraping, or commercial use of any AI-generated content constitutes a material breach of these Terms and will result in: (1) immediate and permanent account ban with full wallet forfeiture; (2) civil legal action for copyright infringement; and (3) pursuit of all available statutory damages. The fact that content was generated by artificial intelligence does not diminish or transfer ownership rights. Create AI Profit LLC owns the story, the characters, the system, and all output. You are a user — not a co-owner. Any attempt to replicate, clone, or commercially exploit this platform's AI-generated assets will be prosecuted to the fullest extent of applicable law.`,
  },
];

export default function Terms() {
  const [, navigate] = useLocation();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      fontFamily: "'Rajdhani', sans-serif",
      color: "#ffffff",
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1rem 0",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={CAP_LOGO} alt="CAP" style={{ height: "32px", width: "32px", objectFit: "contain" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              Terms of Service
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.4rem 1rem", fontFamily: "'Rajdhani', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>
          Private Country Club · Coming Soon
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 300, lineHeight: 1.15,
          color: "#ffffff", marginBottom: "1rem",
        }}>
          Create AI Profit LLC<br />
          <em style={{ fontStyle: "italic", color: "rgba(220,225,255,0.6)" }}>Terms of Service</em>
        </h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: "560px" }}>
          This is a private system. These rules protect it. Read them. Agree to them. Or don't enter.
        </p>
        <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.15)", margin: "2rem 0" }} />
      </div>

      {/* Sections */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 1.5rem 6rem" }}>
        {SECTIONS.map((s, i) => (
          <div
            key={s.num}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "2.5rem 0",
            }}
          >
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.2)", fontWeight: 700,
                paddingTop: "0.35rem", flexShrink: 0, width: "28px",
              }}>
                {s.num}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem", fontWeight: 400,
                  color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2,
                }}>
                  {s.title}
                </h2>
                <p style={{
                  fontSize: "0.875rem", color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.9,
                }}>
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Final divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.8 }}>
            Create AI Profit LLC · EIN 39-3867807 · 580 California St, San Francisco, CA 94104<br />
            These Terms are subject to change. Continued use of the platform constitutes acceptance.
          </p>
        </div>

        {/* CTA back to login */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "#ffffff", color: "#000000",
              border: "none", cursor: "pointer",
              fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase",
              fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
              padding: "0.9rem 2.5rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            I've Read It — Enter the System →
          </button>
        </div>
      </div>
    </div>
  );
}
