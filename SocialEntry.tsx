/**
 * 1% Playground Entry Gate
 * Flow: Age verification → Auth check → Subscriber check → /social
 * Non-subscribers are redirected to /subscribe
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_monogram-eyMrqTsnzb85aGoXmAG5LA.webp";

const CITY_SQUAD_IMGS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_reina_v2-RQAaqhU5NiDB29qXHwdR9L.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_atlanta_e73cfc94.png",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_fox_blonde_v2-MezpQqZSy4NzKAtZPG6X9h.webp",
];

type Step = "age" | "auth" | "checking" | "subscribe" | "enter";

export default function SocialEntry() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>("age");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  const walletQuery = trpc.wallet.balance.useQuery(undefined, {
    enabled: step === "checking" && isAuthenticated,
  });

  // Once wallet data loads, decide where to send the user
  useEffect(() => {
    if (step !== "checking") return;
    if (walletQuery.isLoading) return;
    if (walletQuery.data?.isSubscriber) {
      setStep("enter");
      setTimeout(() => navigate("/social"), 1200);
    } else {
      setStep("subscribe");
    }
  }, [step, walletQuery.isLoading, walletQuery.data]);

  const handleAgeCheck = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() -
      (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
    if (isNaN(age) || age < 16) {
      setError("You must be 16 or older to enter the Club.");
      return;
    }
    sessionStorage.setItem("cap_age_verified", "1");
    if (isAuthenticated) {
      setStep("checking");
    } else {
      setStep("auth");
    }
  };

  // ─── ENTER ────────────────────────────────────────────────────────────────
  if (step === "enter") {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <img src={CAP_LOGO} alt="CAP" style={{ height: "56px", width: "56px", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(200,180,120,0.5))" }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", color: "#ffffff" }}>Welcome back.</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,180,120,0.7)" }}>Entering the 1% Playground…</div>
      </div>
    );
  }

  // ─── CHECKING ─────────────────────────────────────────────────────────────
  if (step === "checking") {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
          Verifying membership…
        </div>
      </div>
    );
  }

  // ─── NOT A SUBSCRIBER ─────────────────────────────────────────────────────
  if (step === "subscribe") {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <img src={CAP_LOGO} alt="CAP" style={{ height: "48px", width: "48px", objectFit: "contain", marginBottom: "2rem", opacity: 0.7 }} />
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(200,180,120,0.6)", marginBottom: "1rem" }}>
          Invite Only
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem", textAlign: "center" }}>
          Membership Required
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", maxWidth: "380px", textAlign: "center", lineHeight: 1.7, marginBottom: "2rem" }}>
          The 1% Playground is a private club. Your monthly subscription is paid from your in-app wallet — funded by the bots.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/subscribe")}
            style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              background: "#ffffff", color: "#000000",
              padding: "0.85rem 2rem", border: "none", cursor: "pointer", fontWeight: 700,
            }}
          >
            Request Access →
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              background: "transparent", color: "rgba(255,255,255,0.4)",
              padding: "0.85rem 1.5rem", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
            }}
          >
            Back to Site
          </button>
        </div>
      </div>
    );
  }

  // ─── AUTH STEP ────────────────────────────────────────────────────────────
  if (step === "auth") {
    return (
      <div style={{ background: "#000000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <img src={CAP_LOGO} alt="CAP" style={{ height: "48px", width: "48px", objectFit: "contain", marginBottom: "2rem", opacity: 0.8 }} />
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(200,180,120,0.6)", marginBottom: "0.75rem" }}>
          Security Verification
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem" }}>
          Identify Yourself.
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem", textAlign: "center", maxWidth: "340px", lineHeight: 1.7 }}>
          Login to verify your membership status and enter the 1% Playground.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem" }}>
          {CITY_SQUAD_IMGS.map((img, i) => (
            <img key={i} src={img} alt="Host" style={{ width: "44px", height: "56px", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(200,180,120,0.25)" }} />
          ))}
        </div>
        <button
          onClick={() => { window.location.href = getLoginUrl(); }}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            background: "#ffffff", color: "#000000",
            padding: "1rem 3rem", border: "none", cursor: "pointer", fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Login to Enter
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            background: "transparent", color: "rgba(255,255,255,0.3)",
            padding: "0.75rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
          }}
        >
          Back to Site
        </button>
      </div>
    );
  }

  // ─── AGE GATE (default) ───────────────────────────────────────────────────
  return (
    <div style={{ background: "#000000", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(200,180,120,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <img src={CAP_LOGO} alt="CAP" style={{ height: "56px", width: "56px", objectFit: "contain", marginBottom: "2rem", filter: "drop-shadow(0 0 16px rgba(200,180,120,0.3))", position: "relative" }} />

      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.7em", textTransform: "uppercase", color: "rgba(200,180,120,0.6)", marginBottom: "0.75rem", position: "relative" }}>
        The 1% Playground
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "#ffffff", marginBottom: "0.5rem", textAlign: "center", position: "relative" }}>
        Private Club.
      </h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginBottom: "3rem", textAlign: "center", maxWidth: "340px", lineHeight: 1.7, position: "relative" }}>
        Invite only. Members only. Age 16 and above.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", position: "relative" }}>
        {CITY_SQUAD_IMGS.map((img, i) => (
          <img key={i} src={img} alt="Host" style={{ width: "48px", height: "62px", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(200,180,120,0.2)" }} />
        ))}
      </div>

      <div style={{
        width: "100%", maxWidth: "320px",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        padding: "2rem", position: "relative",
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
          Age Verification
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          This platform is for members 16 and older. Enter your date of birth to continue.
        </p>
        <label style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "0.5rem" }}>
          Date of Birth
        </label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => { setDob(e.target.value); setError(""); }}
          max={new Date().toISOString().split("T")[0]}
          className="bg-white/5 border-white/10 text-white [color-scheme:dark] mb-3"
        />
        {error && (
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", color: "#f87171", marginBottom: "0.75rem" }}>{error}</p>
        )}
        <button
          onClick={handleAgeCheck}
          style={{
            width: "100%", padding: "0.85rem",
            background: "#ffffff", color: "#000000",
            border: "none", cursor: "pointer",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
          }}
        >
          Enter the Club
        </button>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
          By entering, you agree to our{" "}
          <a href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline" }}>Terms of Service</a>.
        </p>
      </div>
    </div>
  );
}
