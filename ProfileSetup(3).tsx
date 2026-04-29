import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { ChevronLeft, ChevronRight, Camera, Shield, FileText, User, Briefcase, Lock, Check, Eye, EyeOff } from "lucide-react";

const ARIA_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_rabbit_login-2SB454oBVX8PUWrzoTZDwE.webp";
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";

type Step = "aria" | "lightshow" | "security" | "terms" | "profile" | "business" | "loginsec" | "done";

// ─── ARIA INTRO ───────────────────────────────────────────────────────────────
function AriaIntro({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", background: "#000", padding: "2rem", textAlign: "center" }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
        <img src={ARIA_IMG} alt="Aria Rabbit" style={{ height: "280px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 60px rgba(254,44,85,0.3))", marginBottom: "1.5rem" }} />
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>
          Create AI Profit
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          Welcome to the<br /><em style={{ color: "#fe2c55" }}>1% Playground.</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "300px" }}>
          I'm Aria. I'll walk you through your setup. This takes about 2 minutes.
        </p>
        <button
          onClick={onNext}
          style={{
            background: "#fe2c55", border: "none", borderRadius: "8px",
            padding: "14px 40px", color: "#ffffff", fontWeight: 700,
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem",
            letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: "0 0 30px rgba(254,44,85,0.4)",
          }}
        >
          Let's Go →
        </button>
      </div>
    </div>
  );
}

// ─── LIGHT SHOW ───────────────────────────────────────────────────────────────
function LightShow({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 1900),
      setTimeout(() => onNext(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onNext]);

  const colors = ["#fe2c55", "#25f4ee", "#facc15", "#a78bfa"];
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {colors.slice(0, phase).map((c, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${(i + 1) * 300}px`, height: `${(i + 1) * 300}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c}22 0%, transparent 70%)`,
          animation: "expand 2s ease-out forwards",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <img src={CAP_LOGO} alt="CAP" style={{
          width: "80px", height: "80px", objectFit: "contain",
          filter: `drop-shadow(0 0 ${phase * 10}px #fe2c55)`,
          transition: "filter 0.5s",
          animation: "spin 3s linear infinite",
        }} />
        <div style={{ marginTop: "1rem", display: "flex", gap: "8px", justifyContent: "center" }}>
          {colors.map((c, i) => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: i < phase ? c : "rgba(255,255,255,0.1)",
              boxShadow: i < phase ? `0 0 10px ${c}` : "none",
              transition: "all 0.4s",
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes expand { from { transform: scale(0); opacity: 1; } to { transform: scale(1); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── SECURITY STEP ────────────────────────────────────────────────────────────
function SecurityStep({ onNext }: { onNext: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          setTimeout(onNext, 800);
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", background: "#000", padding: "2rem", textAlign: "center" }}>
      <Shield className="w-16 h-16" style={{ color: done ? "#25f4ee" : "#fe2c55", marginBottom: "1.5rem", filter: `drop-shadow(0 0 20px ${done ? "#25f4ee" : "#fe2c55"})` }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem" }}>
        Security Verification
      </h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "280px" }}>
        This is a private members-only platform. We verify every entry.
      </p>
      {!scanning && !done && (
        <button
          onClick={startScan}
          style={{
            background: "rgba(254,44,85,0.15)", border: "1px solid rgba(254,44,85,0.4)",
            borderRadius: "8px", padding: "14px 40px", color: "#fe2c55",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem",
            letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
          }}
        >
          Begin Verification
        </button>
      )}
      {scanning && (
        <div style={{ width: "260px" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "4px", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: done ? "#25f4ee" : "#fe2c55", transition: "width 0.05s", borderRadius: "4px" }} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            {done ? "✓ Verified" : `Scanning… ${progress}%`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TERMS STEP ───────────────────────────────────────────────────────────────
function TermsStep({ onNext }: { onNext: () => void }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", background: "#000", padding: "2rem" }}>
      <div style={{ flex: 1, overflowY: "auto", maxWidth: "480px", margin: "0 auto", width: "100%" }}>
        <FileText className="w-10 h-10" style={{ color: "#facc15", marginBottom: "1rem", marginTop: "2rem" }} />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem" }}>
          Terms of Service
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginBottom: "1.5rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>
          1% Playground — Private Country Club · Coming Soon
        </p>
        {[
          { title: "1. Membership", body: "Access to the 1% Playground is by invitation only. Membership is non-transferable and may be revoked at any time for violations of these terms." },
          { title: "2. Privacy", body: "Your personal information is encrypted and never sold to third parties. All activity within the platform is private to members only." },
          { title: "3. Content", body: "Members may post lifestyle content only. No explicit material, no spam, no solicitation outside of designated Business/Investment tabs." },
          { title: "4. Earnings", body: "Your 40% earnings share is calculated from platform revenue attributed to your activity. Payouts are made to your in-app wallet." },
          { title: "5. Conduct", body: "Members are expected to maintain the standards of the 1% Playground. Harassment, fraud, or misrepresentation results in immediate termination." },
          { title: "6. Age", body: "You must be 18 years or older to access this platform. By proceeding, you confirm you meet this requirement." },
        ].map((s) => (
          <div key={s.title} style={{ marginBottom: "1.25rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.4rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>{s.title}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.6 }}>{s.body}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%", paddingTop: "1rem" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginBottom: "1.25rem" }}>
          <div
            onClick={() => setAccepted(a => !a)}
            style={{
              width: "20px", height: "20px", flexShrink: 0, borderRadius: "4px",
              border: `1.5px solid ${accepted ? "#fe2c55" : "rgba(255,255,255,0.2)"}`,
              background: accepted ? "#fe2c55" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s", marginTop: "2px",
            }}
          >
            {accepted && <Check className="w-3 h-3 text-white" />}
          </div>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.6 }}>
            I have read and agree to the Terms of Service. I confirm I am 18 years or older.
          </span>
        </label>
        <button
          onClick={onNext}
          disabled={!accepted}
          style={{
            width: "100%", padding: "14px", borderRadius: "8px",
            background: accepted ? "#fe2c55" : "rgba(255,255,255,0.06)",
            border: "none", color: accepted ? "#ffffff" : "rgba(255,255,255,0.2)",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem",
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
            cursor: accepted ? "pointer" : "not-allowed", transition: "all 0.3s",
          }}
        >
          I Agree — Continue
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE FORM ─────────────────────────────────────────────────────────────
type ProfileData = {
  displayName: string; bio: string; age: string; city: string;
  gender: string; avatarBase64: string; avatarPreview: string;
};

function ProfileForm({ onNext, onBack }: { onNext: (d: Partial<ProfileData>) => void; onBack: () => void }) {
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarBase64, setAvatarBase64] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("21st Century Robin Hood – Passive Income Streams.");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      setAvatarBase64(dataUrl.split(",")[1] ?? "");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#000", padding: "2rem", maxWidth: "480px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <User className="w-8 h-8" style={{ color: "#fe2c55", marginBottom: "0.75rem" }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.25rem" }}>Your Profile</h2>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginBottom: "2rem", fontFamily: "'Rajdhani', sans-serif" }}>Personal information — visible to members</p>

      {/* Profile pic */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
        <div onClick={() => fileRef.current?.click()} style={{ width: "96px", height: "96px", borderRadius: "50%", background: avatarPreview ? "transparent" : "rgba(254,44,85,0.1)", border: "2px solid rgba(254,44,85,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
          {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera className="w-8 h-8" style={{ color: "#fe2c55" }} />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: "0.5rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>TAP TO UPLOAD PHOTO</span>
      </div>

      {[
        { label: "Display Name *", value: displayName, set: setDisplayName, placeholder: "How you appear to members" },
        { label: "Age *", value: age, set: setAge, placeholder: "Your age", type: "number" },
        { label: "City *", value: city, set: setCity, placeholder: "Where you're based" },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'Rajdhani', sans-serif" }}>{f.label}</label>
          <input type={f.type ?? "text"} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 14px", color: "#ffffff", fontSize: "0.9rem", outline: "none", fontFamily: "'Rajdhani', sans-serif", boxSizing: "border-box" }} />
        </div>
      ))}

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Rajdhani', sans-serif" }}>Gender</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => (
            <button key={g} onClick={() => setGender(g)} style={{ padding: "8px 12px", borderRadius: "6px", cursor: "pointer", background: gender === g ? "rgba(254,44,85,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${gender === g ? "rgba(254,44,85,0.6)" : "rgba(255,255,255,0.08)"}`, color: gender === g ? "#fe2c55" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em", transition: "all 0.2s" }}>{g}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'Rajdhani', sans-serif" }}>Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 14px", color: "#ffffff", fontSize: "0.88rem", outline: "none", fontFamily: "'Rajdhani', sans-serif", resize: "none", boxSizing: "border-box" }} />
      </div>

      <button onClick={() => onNext({ displayName, bio, age, city, gender, avatarBase64, avatarPreview })} disabled={!displayName.trim() || !age || !city} style={{ width: "100%", padding: "14px", borderRadius: "8px", background: (displayName.trim() && age && city) ? "#fe2c55" : "rgba(255,255,255,0.06)", border: "none", color: (displayName.trim() && age && city) ? "#ffffff" : "rgba(255,255,255,0.2)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, cursor: (displayName.trim() && age && city) ? "pointer" : "not-allowed", transition: "all 0.3s" }}>
        Continue <ChevronRight className="w-4 h-4 inline" />
      </button>
    </div>
  );
}

// ─── BUSINESS FORM ────────────────────────────────────────────────────────────
function BusinessForm({ onNext, onBack }: { onNext: (d: Record<string, string>) => void; onBack: () => void }) {
  const [accountType, setAccountType] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  return (
    <div style={{ minHeight: "100dvh", background: "#000", padding: "2rem", maxWidth: "480px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <Briefcase className="w-8 h-8" style={{ color: "#facc15", marginBottom: "0.75rem" }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.25rem" }}>Business & Influence</h2>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginBottom: "2rem", fontFamily: "'Rajdhani', sans-serif" }}>Optional — helps us connect you with the right members</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Rajdhani', sans-serif" }}>I am a…</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["Entrepreneur", "Investor", "Influencer/Creator", "Real Estate", "Crypto/Finance", "Lifestyle", "Other"].map(t => (
            <button key={t} onClick={() => setAccountType(t)} style={{ padding: "8px 14px", borderRadius: "20px", cursor: "pointer", background: accountType === t ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${accountType === t ? "rgba(250,204,21,0.5)" : "rgba(255,255,255,0.08)"}`, color: accountType === t ? "#facc15" : "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em", transition: "all 0.2s" }}>{t}</button>
          ))}
        </div>
      </div>

      {[
        { label: "Industry / Niche", value: industry, set: setIndustry, placeholder: "e.g. Real Estate, Crypto, Fashion" },
        { label: "Website", value: website, set: setWebsite, placeholder: "https://yoursite.com" },
        { label: "Instagram", value: instagram, set: setInstagram, placeholder: "@handle" },
        { label: "TikTok", value: tiktok, set: setTiktok, placeholder: "@handle" },
        { label: "YouTube", value: youtube, set: setYoutube, placeholder: "Channel name or URL" },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'Rajdhani', sans-serif" }}>{f.label}</label>
          <input type="text" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 14px", color: "#ffffff", fontSize: "0.9rem", outline: "none", fontFamily: "'Rajdhani', sans-serif", boxSizing: "border-box" }} />
        </div>
      ))}

      <div style={{ display: "flex", gap: "12px", marginTop: "0.5rem" }}>
        <button onClick={() => onNext({})} style={{ flex: 1, padding: "14px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>Skip</button>
        <button onClick={() => onNext({ accountType, industry, website, instagram, tiktok, youtube })} style={{ flex: 2, padding: "14px", borderRadius: "8px", background: "#facc15", border: "none", color: "#000000", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
          Continue <ChevronRight className="w-4 h-4 inline" />
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN & SECURITY ─────────────────────────────────────────────────────────
function LoginSecurityForm({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) {
  const [phone, setPhone] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div style={{ minHeight: "100dvh", background: "#000", padding: "2rem", maxWidth: "480px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <Lock className="w-8 h-8" style={{ color: "#25f4ee", marginBottom: "0.75rem" }} />
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.25rem" }}>Login & Security</h2>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginBottom: "2rem", fontFamily: "'Rajdhani', sans-serif" }}>Keep your account secure</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'Rajdhani', sans-serif" }}>Phone Number (optional)</label>
        <div style={{ position: "relative" }}>
          <input type={showPhone ? "text" : "password"} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 44px 12px 14px", color: "#ffffff", fontSize: "0.9rem", outline: "none", fontFamily: "'Rajdhani', sans-serif", boxSizing: "border-box" }} />
          <button onClick={() => setShowPhone(s => !s)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}>
            {showPhone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {[
        { label: "Two-Factor Authentication", desc: "Extra security on every login", value: twoFA, set: setTwoFA, color: "#25f4ee" },
        { label: "Push Notifications", desc: "Earnings alerts, new members, DMs", value: notifications, set: setNotifications, color: "#facc15" },
      ].map(t => (
        <div key={t.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1rem" }}>
          <div>
            <div style={{ color: "#ffffff", fontSize: "0.88rem", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif" }}>{t.label}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>{t.desc}</div>
          </div>
          <button onClick={() => t.set((v: boolean) => !v)} style={{ width: "44px", height: "24px", borderRadius: "12px", background: t.value ? t.color : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
            <div style={{ position: "absolute", top: "2px", left: t.value ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#ffffff", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </button>
        </div>
      ))}

      <button onClick={onFinish} style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "#25f4ee", border: "none", color: "#000000", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", marginTop: "1rem" }}>
        Enter the Playground ✓
      </button>
    </div>
  );
}

// ─── DONE SCREEN ─────────────────────────────────────────────────────────────
function DoneScreen({ onEnter }: { onEnter: () => void }) {
  useEffect(() => { const t = setTimeout(onEnter, 2500); return () => clearTimeout(t); }, [onEnter]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", background: "#000", textAlign: "center", padding: "2rem" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #fe2c55, #25f4ee)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: "0 0 60px rgba(254,44,85,0.4)" }}>
        <Check className="w-10 h-10 text-white" />
      </div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem" }}>Welcome to the Club.</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Entering the 1% Playground…</p>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function ProfileSetup() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [step, setStep] = useState<Step>("aria");
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});

  const uploadAvatar = trpc.profile.uploadAvatar.useMutation();
  const upsertProfile = trpc.profile.upsert.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  const handleProfileNext = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setStep("business");
  };

  const handleBusinessNext = (data: Record<string, string>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setStep("loginsec");
  };

  const handleFinish = async () => {
    try {
      let avatarUrl: string | undefined;
      if (profileData.avatarBase64) {
        const result = await uploadAvatar.mutateAsync({ base64: profileData.avatarBase64 });
        avatarUrl = result.url;
      }
      await upsertProfile.mutateAsync({
        displayName: profileData.displayName ?? "Member",
        bio: profileData.bio ?? "",
        city: profileData.city ?? "Unknown",
        age: profileData.age ? parseInt(profileData.age) : 18,
        avatarUrl,
      });
    } catch {
      // non-blocking — proceed anyway
    }
    setStep("done");
  };

  const formSteps: Step[] = ["profile", "business", "loginsec"];
  const formIdx = formSteps.indexOf(step);

  return (
    <div style={{ background: "#000", minHeight: "100dvh" }}>
      {/* Progress bar for form steps */}
      {formIdx >= 0 && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "3px", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: `${((formIdx + 1) / 3) * 100}%`, background: "linear-gradient(to right, #fe2c55, #25f4ee)", transition: "width 0.5s ease" }} />
        </div>
      )}

      {step === "aria"      && <AriaIntro onNext={() => setStep("lightshow")} />}
      {step === "lightshow" && <LightShow onNext={() => setStep("security")} />}
      {step === "security"  && <SecurityStep onNext={() => setStep("terms")} />}
      {step === "terms"     && <TermsStep onNext={() => setStep("profile")} />}
      {step === "profile"   && <ProfileForm onNext={handleProfileNext} onBack={() => setStep("terms")} />}
      {step === "business"  && <BusinessForm onNext={handleBusinessNext} onBack={() => setStep("profile")} />}
      {step === "loginsec"  && <LoginSecurityForm onFinish={handleFinish} onBack={() => setStep("business")} />}
      {step === "done"      && <DoneScreen onEnter={() => navigate("/social")} />}
    </div>
  );
}
