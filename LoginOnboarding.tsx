import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import jsPDF from "jspdf";
import { trpc } from "@/lib/trpc";

// ─── CDN ASSETS ──────────────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ";

const ASSETS = {
  ariaBlack:  `${CDN}/airria_rabbit_black_final_32f7d785.jpg`,
  ariaRed:    `${CDN}/airria_red_757e847f_4c88d980.jpg`,
  ariaLimo:   `${CDN}/shot3_aria_limo_d55906ca.png`,
  tableScene: `${CDN}/shot2_table_scene_d5cec33b.png`,
  shadow:     `${CDN}/finance_the_shadow_c1f98e58.png`,
  capLogo:    `${CDN}/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp`,
  capQR:      `${CDN}/cap_qr_1024_bc19a70c.png`,
  neonBg:     `${CDN}/pexels-einfoto-3143990_0340b88e.jpg`,
};

// ─── LEGAL COPY ──────────────────────────────────────────────────────────────
const ARIA_TERMS_SCRIPT = `Welcome. I am Aria Rabbit — CFO and Daily Operations Director of Create AI Profit.
Before you enter, you must understand the terms.
Create AI Profit owns the platform, the systems, and all intellectual property within it. You own nothing inside this system except your personal earnings.
Your wallet funds are protected by our internal escrow. No third party — including a spouse, partner, or legal representative — has any claim to funds held within this platform.
By joining, you agree to zero tolerance for bots, scams, or fraudulent activity. Violations result in immediate termination and forfeiture of all pending earnings.
You are entering a 10-day trial period. On day 10, you will receive a text message to select your tier. Enterprise members receive 25% earnings share. All other tiers receive 10 to 15 percent.
All money earned is held in-app. 50% of your balance becomes withdrawable after the trial period ends.
These terms cover all current and future features — including the social platform, concierge services, dating, and any future add-ons.
Do you agree to these terms? Please say: Yes, I agree.`;

const TERMS_TEXT = `CREATE AI PROFIT — MEMBERSHIP TERMS & CONDITIONS

1. OWNERSHIP
Create AI Profit LLC owns the platform, all systems, intellectual property, and content within it. Members own only their personal earnings balance.

2. WALLET & FUNDS PROTECTION
Wallet funds are held in internal escrow. No third party — including spouses, partners, or legal representatives — has any claim to funds held within this platform. This agreement supersedes any domestic financial claims.

3. ZERO TOLERANCE POLICY
Bots, scams, fraudulent activity, or manipulation of any kind results in immediate account termination and forfeiture of all pending earnings.

4. TRIAL PERIOD
Members enter a 10-day trial period upon joining. On day 10, a text message will be sent to select a membership tier.

5. EARNINGS TIERS
- Enterprise: 25% earnings share
- Standard tiers: 10–15% earnings share

6. WITHDRAWALS
All earnings are held in-app. 50% of balance becomes withdrawable after the trial period ends.

7. SCOPE
These terms cover all current and future features including: social platform, concierge services, dating, business opportunities, and any future add-ons.

8. UPDATES
Terms are updateable. Members will be notified of changes via in-app notification.

By providing voice consent, you agree to all terms above.`;

// ─── THREE.JS HOLOGRAM ───────────────────────────────────────────────────────
function HologramParticles({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 4000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 2.5;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3]     = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.cos(p) * 1.8;
    pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.15;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = active ? 0.75 + Math.sin(s.clock.elapsedTime * 5) * 0.25 : 0;
  });
  if (!active) return null;
  return (
    <Points ref={ref} positions={pos} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00ffcc" size={0.018} sizeAttenuation depthWrite={false} opacity={0.8} />
    </Points>
  );
}

function ScanLine({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current || !active) return;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 1.8) * 2.8;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(s.clock.elapsedTime * 10) * 0.15;
  });
  if (!active) return null;
  return (
    <mesh ref={ref}>
      <planeGeometry args={[4, 0.025]} />
      <meshBasicMaterial color="#00ffcc" transparent opacity={0.35} />
    </mesh>
  );
}

function PortalVortex({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 2.5;
    const sc = active ? 1 + Math.sin(s.clock.elapsedTime * 4) * 0.08 : 0;
    ref.current.scale.setScalar(sc);
  });
  if (!active) return null;
  return (
    <group ref={ref}>
      <mesh><torusGeometry args={[1.8, 0.04, 8, 80]} /><meshBasicMaterial color="#8800ff" transparent opacity={0.8} /></mesh>
      <mesh><torusGeometry args={[1.4, 0.025, 8, 64]} /><meshBasicMaterial color="#cc00ff" transparent opacity={0.5} /></mesh>
      <mesh><torusGeometry args={[0.9, 0.015, 8, 48]} /><meshBasicMaterial color="#ff00cc" transparent opacity={0.4} /></mesh>
    </group>
  );
}

// ─── STAGE TYPE ──────────────────────────────────────────────────────────────
type Stage = "instructions" | "countdown" | "hologram" | "portal" | "walkin" | "sit" | "terms" | "consent" | "signing" | "complete";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LoginOnboarding() {
  const [stage, setStage] = useState<Stage>("instructions");
  const [countdown, setCountdown] = useState(15);
  const [spouseDetected, setSpouseDetected] = useState(false);
  const [consentRecorded, setConsentRecorded] = useState(false);
  const [spouseConsentRecorded, setSpouseConsentRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFor, setRecordingFor] = useState<"self" | "spouse">("self");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [ttsActive, setTtsActive] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [portalActive, setPortalActive] = useState(false);

  const saveConsentMutation = trpc.profile.saveConsent.useMutation();
  const containerRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const ariaImgRef = useRef<HTMLImageElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ── Siren ─────────────────────────────────────────────────────────────────
  const playSiren = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 2);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 4);
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 6);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 10);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 5);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 15);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 15);
    } catch { /* blocked */ }
  }, []);

  const vibrate = useCallback(() => {
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 500, 200, 1000]);
  }, []);

  // ── Countdown → hologram → portal → walkin ────────────────────────────────
  const startCountdown = useCallback(() => {
    setStage("countdown");
    playSiren();
    vibrate();
    let n = 15;
    setCountdown(n);
    const tick = setInterval(() => {
      n--;
      setCountdown(n);
      if ("vibrate" in navigator) navigator.vibrate(40);
      if (countdownRef.current) {
        gsap.fromTo(countdownRef.current,
          { scale: 1.4, color: n <= 5 ? "#ff4444" : "#ffffff" },
          { scale: 1, color: n <= 5 ? "#ff4444" : "#ffffff", duration: 0.5, ease: "power2.out" }
        );
      }
      if (n <= 0) {
        clearInterval(tick);
        // Hologram flash
        setStage("hologram");
        setHologramActive(true);
        if (containerRef.current) {
          gsap.fromTo(containerRef.current,
            { filter: "brightness(4) saturate(4)" },
            { filter: "brightness(1) saturate(1)", duration: 2, ease: "power3.out" }
          );
        }
        // After 4s → portal
        setTimeout(() => {
          setHologramActive(false);
          setPortalActive(true);
          setStage("portal");
          // Portal suck-in
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              scale: 0.04, opacity: 0, duration: 1.4, ease: "power4.in",
              onComplete: () => {
                setPortalActive(false);
                gsap.set(containerRef.current, { scale: 1, opacity: 1 });
                setStage("walkin");
              }
            });
          }
        }, 4000);
      }
    }, 1000);
  }, [playSiren, vibrate]);

  // ── Walk-in animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (stage === "walkin" && ariaImgRef.current) {
      gsap.fromTo(ariaImgRef.current,
        { y: 100, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power3.out",
          onComplete: () => { setTimeout(() => setStage("sit"), 2500); }
        }
      );
    }
  }, [stage]);

  // ── Sit → terms ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage === "sit") {
      setTimeout(() => { setStage("terms"); setTtsActive(true); speakTerms(); }, 2200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speakTerms = useCallback(() => {
    if (!("speechSynthesis" in window)) { setTimeout(() => setStage("consent"), 3000); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(ARIA_TERMS_SCRIPT);
    utter.rate = 0.88; utter.pitch = 0.85; utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith("en") && (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("victoria")))
      || voices.find(v => v.lang.startsWith("en-GB")) || voices[0];
    if (v) utter.voice = v;
    utter.onend = () => { setTtsActive(false); setStage("consent"); };
    utter.onerror = () => { setTtsActive(false); setStage("consent"); };
    window.speechSynthesis.speak(utter);
  }, []);

  // ── Recording ─────────────────────────────────────────────────────────────
  const startRecording = useCallback(async (forWhom: "self" | "spouse") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        if (forWhom === "self") setConsentRecorded(true);
        else setSpouseConsentRecorded(true);
        setIsRecording(false);
        setStatusMsg(forWhom === "self" ? "✓ Your consent captured." : "✓ Spouse consent captured.");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecordingFor(forWhom);
      setIsRecording(true);
      setStatusMsg(`Recording ${forWhom === "self" ? "your" : "spouse"} consent — say "Yes, I agree"`);
      setTimeout(() => recorder.stop(), 6000);
    } catch { setStatusMsg("Microphone access denied — tap to retry."); }
  }, []);

  // ── PDF ───────────────────────────────────────────────────────────────────
  const generatePDF = useCallback(async () => {
    setSaving(true); setStatusMsg("Generating consent PDF...");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 50;
    const pw = doc.internal.pageSize.getWidth();
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("CREATE AI PROFIT", margin, 60);
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    doc.text("MEMBERSHIP CONSENT & TERMS AGREEMENT", margin, 80);
    doc.setLineWidth(0.5); doc.line(margin, 90, pw - margin, 90);
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(`Effective Date: ${new Date().toLocaleDateString()}\n\n${TERMS_TEXT}`, pw - margin * 2);
    doc.text(lines, margin, 110);
    const sigY = doc.internal.pageSize.getHeight() - 150;
    doc.line(margin, sigY, pw - margin, sigY);
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("ELECTRONIC CONSENT RECORD", margin, sigY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(`Timestamp: ${new Date().toISOString()}`, margin, sigY + 30);
    doc.text(`Device Hash: ${btoa(navigator.userAgent).slice(0, 40)}`, margin, sigY + 45);
    doc.text(`Platform: ${navigator.platform}`, margin, sigY + 60);
    doc.text(`Self Consent Recorded: ${consentRecorded ? "YES — Voice captured" : "NO"}`, margin, sigY + 75);
    doc.text(`Spouse Consent Recorded: ${spouseConsentRecorded ? "YES — Voice captured" : "N/A"}`, margin, sigY + 90);
    doc.text("By voice consent, member agrees to all terms above.", margin, sigY + 110);
    doc.text("Signed electronically via Create AI Profit onboarding system.", margin, sigY + 125);
    const url = URL.createObjectURL(doc.output("blob"));
    setPdfUrl(url); setSaving(false); setStatusMsg("Consent PDF ready.");
    return url;
  }, [consentRecorded, spouseConsentRecorded]);

  // ── Complete ──────────────────────────────────────────────────────────────
  const completeOnboarding = useCallback(async () => {
    setStage("signing");
    const url = await generatePDF();
    const a = document.createElement("a");
    a.href = url; a.download = `CAP_Consent_${Date.now()}.pdf`; a.click();
    try {
      const blob = await (await fetch(url)).blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await saveConsentMutation.mutateAsync({ pdfBase64: base64, spouseConsent: spouseConsentRecorded });
      };
      reader.readAsDataURL(blob);
    } catch { /* non-blocking */ }
    setStage("complete");
    setTimeout(() => { window.location.href = "/profile-setup"; }, 3000);
  }, [generatePDF, saveConsentMutation, spouseConsentRecorded]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", fontFamily: "'Cormorant Garamond', serif",
        color: "#fff", zIndex: 9999,
      }}
    >
      {/* Neon background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${ASSETS.neonBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.07, filter: "blur(3px)",
      }} />

      {/* Three.js canvas — hologram + portal stages */}
      {(stage === "hologram" || stage === "portal") && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <HologramParticles active={hologramActive} />
            <ScanLine active={hologramActive} />
            <PortalVortex active={portalActive} />
          </Canvas>
          {hologramActive && (
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at center, rgba(0,255,200,0.18) 0%, transparent 70%)",
              animation: "holoPulse 0.5s ease-in-out infinite alternate",
              pointerEvents: "none",
            }} />
          )}
          {portalActive && (
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at center, rgba(136,0,255,0.35) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
          )}
        </div>
      )}

      {/* ── INSTRUCTIONS ── */}
      {stage === "instructions" && (
        <div style={{ textAlign: "center", maxWidth: "440px", padding: "2rem", position: "relative", zIndex: 10 }}>
          <img src={ASSETS.capLogo} alt="CAP" style={{ width: 80, marginBottom: "2rem", filter: "drop-shadow(0 0 20px rgba(200,210,255,0.4))" }} />
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
            Create AI Profit — Secure Onboarding
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 300, fontStyle: "italic", marginBottom: "1.5rem", lineHeight: 1.3 }}>
            Enter the System
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, marginBottom: "2rem", fontStyle: "italic" }}>
            You are about to enter a secure onboarding experience. Find a dark, quiet room. Enable your speaker and microphone. Aria Rabbit will read your membership terms aloud.
          </p>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            padding: "1rem 1.5rem", marginBottom: "2rem",
            fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic", lineHeight: 1.8,
          }}>
            📱 Scan QR code to open on mobile<br />
            🔊 Enable sound — terms read aloud by Aria<br />
            🎤 Microphone required for voice consent<br />
            🌑 Dark room recommended for full effect
          </div>
          <button
            onClick={startCountdown}
            style={{
              background: "#fff", color: "#000", border: "none",
              padding: "1rem 3rem", fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.85rem", letterSpacing: "0.3em",
              textTransform: "uppercase", fontWeight: 700, cursor: "pointer",
            }}
          >
            Begin Onboarding
          </button>
          {/* Fixed QR + logo */}
          <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", textAlign: "center", zIndex: 20 }}>
            <img src={ASSETS.capQR} alt="QR" style={{ width: 70, opacity: 0.65 }} />
            <div style={{ fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "0.3rem" }}>createaiprofit.com</div>
          </div>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {stage === "countdown" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(255,68,68,0.8)", marginBottom: "1.5rem", animation: "blink 1s step-end infinite" }}>
            ⚠ INITIATING SECURE CHANNEL
          </div>
          <div
            ref={countdownRef}
            style={{
              fontSize: "clamp(6rem, 20vw, 12rem)", fontWeight: 300, lineHeight: 1,
              color: countdown <= 5 ? "#ff4444" : "#fff",
              textShadow: countdown <= 5 ? "0 0 60px rgba(255,68,68,0.8)" : "0 0 40px rgba(255,255,255,0.3)",
            }}
          >
            {countdown}
          </div>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "1rem" }}>
            Aria Rabbit is connecting...
          </div>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300, height: 300, borderRadius: "50%",
            border: "1px solid rgba(255,68,68,0.25)",
            animation: "ringPulse 1s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        </div>
      )}

      {/* ── HOLOGRAM ── */}
      {stage === "hologram" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(0,255,200,0.85)", marginBottom: "2rem", animation: "blink 0.5s step-end infinite" }}>
            ◈ HOLOGRAM LINK ESTABLISHED
          </div>
          <div style={{ fontSize: "1.5rem", fontStyle: "italic", color: "rgba(0,255,200,0.9)" }}>
            Aria Rabbit is materializing...
          </div>
        </div>
      )}

      {/* ── PORTAL ── */}
      {stage === "portal" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(136,0,255,0.9)", animation: "blink 0.3s step-end infinite" }}>
            ◈ PORTAL OPENING
          </div>
        </div>
      )}

      {/* ── WALK-IN ── */}
      {stage === "walkin" && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", overflow: "hidden" }}>
          <img
            ref={ariaImgRef}
            src={ASSETS.ariaLimo}
            alt="Aria Rabbit"
            style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              height: "95vh", width: "auto",
              objectFit: "contain", objectPosition: "bottom",
              opacity: 0,
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "2.5rem", width: "100%", textAlign: "center",
            fontSize: "0.68rem", letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}>
            Aria Rabbit — CFO, Create AI Profit
          </div>
        </div>
      )}

      {/* ── SIT ── */}
      {stage === "sit" && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", overflow: "hidden" }}>
          <img
            src={ASSETS.tableScene}
            alt="The Table"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", animation: "fadeIn 1.5s ease forwards" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "3rem", width: "100%", textAlign: "center", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.65)" }}>
            The council is assembled. Aria is ready.
          </div>
        </div>
      )}

      {/* ── TERMS ── */}
      {stage === "terms" && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 680, padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <img
              src={ASSETS.ariaBlack}
              alt="Aria Rabbit"
              style={{
                width: 130, height: 130, borderRadius: "50%",
                objectFit: "cover", objectPosition: "top",
                border: `2px solid ${ttsActive ? "rgba(200,160,60,0.8)" : "rgba(200,160,60,0.4)"}`,
                boxShadow: ttsActive ? "0 0 30px rgba(200,160,60,0.5)" : "none",
                transition: "box-shadow 0.5s, border-color 0.5s",
              }}
            />
            {ttsActive && (
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                border: "2px solid rgba(200,160,60,0.35)",
                animation: "ringPulse 1.2s ease-in-out infinite",
              }} />
            )}
          </div>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,160,60,0.7)", marginBottom: "0.5rem" }}>
            {ttsActive ? "▶ Aria Rabbit is speaking..." : "Terms delivered"}
          </div>
          <h2 style={{ fontSize: "1.3rem", fontStyle: "italic", fontWeight: 300, marginBottom: "1.5rem", textAlign: "center" }}>
            Membership Terms & Conditions
          </h2>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            padding: "1.5rem", maxHeight: "38vh", overflowY: "auto",
            fontSize: "0.78rem", lineHeight: 1.9, color: "rgba(255,255,255,0.55)",
            fontStyle: "italic", scrollbarWidth: "thin",
            scrollbarColor: "rgba(200,160,60,0.3) transparent",
            marginBottom: "1.5rem", width: "100%",
          }}>
            {TERMS_TEXT}
          </div>
          {!ttsActive && (
            <button
              onClick={() => setStage("consent")}
              style={{
                background: "rgba(200,160,60,0.12)", border: "1px solid rgba(200,160,60,0.4)",
                color: "#c9a84c", padding: "0.875rem 2.5rem",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem",
                letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              I Have Heard the Terms — Proceed to Consent
            </button>
          )}
        </div>
      )}

      {/* ── CONSENT ── */}
      {stage === "consent" && (
        <div style={{ textAlign: "center", maxWidth: 500, padding: "2rem", position: "relative", zIndex: 10 }}>
          <img
            src={ASSETS.ariaRed}
            alt="Aria Rabbit"
            style={{
              width: 100, height: 100, borderRadius: "50%",
              objectFit: "cover", objectPosition: "top",
              border: "2px solid rgba(255,68,68,0.5)",
              marginBottom: "1.5rem",
            }}
          />
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,68,68,0.7)", marginBottom: "1rem" }}>
            Voice Consent — Legal Record
          </div>
          <h2 style={{ fontSize: "1.5rem", fontStyle: "italic", fontWeight: 300, marginBottom: "0.5rem" }}>
            Say: <span style={{ color: "#c9a84c" }}>"Yes, I agree"</span>
          </h2>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginBottom: "1.5rem" }}>
            Your voice is your signature. This recording is stored as a legal record.
          </p>
          {statusMsg && (
            <div style={{ fontSize: "0.83rem", color: "rgba(0,255,200,0.8)", marginBottom: "1rem", fontStyle: "italic" }}>
              {statusMsg}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {!consentRecorded ? (
              <button
                onClick={() => startRecording("self")}
                disabled={isRecording}
                style={{
                  background: isRecording ? "rgba(255,68,68,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isRecording ? "#ff4444" : "rgba(255,255,255,0.18)"}`,
                  color: isRecording ? "#ff4444" : "#fff",
                  padding: "0.875rem 2rem", fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.8rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", cursor: isRecording ? "default" : "pointer", width: 300,
                }}
              >
                {isRecording && recordingFor === "self" ? "🔴 Recording... (6s)" : "🎤 Record My Consent"}
              </button>
            ) : (
              <div style={{ color: "#4ade80", fontSize: "0.9rem", fontStyle: "italic" }}>✓ Your consent recorded</div>
            )}
            {consentRecorded && !spouseDetected && (
              <button
                onClick={() => setSpouseDetected(true)}
                style={{
                  background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.28)", fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.8rem", fontStyle: "italic", cursor: "pointer", textDecoration: "underline",
                }}
              >
                + Add spouse consent
              </button>
            )}
            {spouseDetected && !spouseConsentRecorded && consentRecorded && (
              <button
                onClick={() => startRecording("spouse")}
                disabled={isRecording}
                style={{
                  background: isRecording ? "rgba(255,68,68,0.12)" : "rgba(200,160,60,0.07)",
                  border: `1px solid ${isRecording ? "#ff4444" : "rgba(200,160,60,0.3)"}`,
                  color: isRecording ? "#ff4444" : "#c9a84c",
                  padding: "0.875rem 2rem", fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.8rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", cursor: isRecording ? "default" : "pointer", width: 300,
                }}
              >
                {isRecording && recordingFor === "spouse" ? "🔴 Recording Spouse... (6s)" : "🎤 Record Spouse Consent"}
              </button>
            )}
            {spouseDetected && spouseConsentRecorded && (
              <div style={{ color: "#4ade80", fontSize: "0.9rem", fontStyle: "italic" }}>✓ Spouse consent recorded</div>
            )}
            {consentRecorded && (!spouseDetected || spouseConsentRecorded) && (
              <button
                onClick={completeOnboarding}
                disabled={saving}
                style={{
                  background: "#fff", color: "#000", border: "none",
                  padding: "1rem 2.5rem", fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.85rem", letterSpacing: "0.25em",
                  textTransform: "uppercase", fontWeight: 700,
                  cursor: saving ? "default" : "pointer", marginTop: "0.5rem",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Generating PDF..." : "Complete — Enter the System"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SIGNING ── */}
      {stage === "signing" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,160,60,0.7)", marginBottom: "2rem", animation: "blink 1s step-end infinite" }}>
            ◈ GENERATING CONSENT RECORD
          </div>
          <div style={{ fontSize: "1.5rem", fontStyle: "italic", color: "rgba(255,255,255,0.65)" }}>
            Notarizing your agreement...
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.83rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{statusMsg}</div>
        </div>
      )}

      {/* ── COMPLETE ── */}
      {stage === "complete" && (
        <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", overflow: "hidden" }}>
          <img
            src={ASSETS.shadow}
            alt="Welcome"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", animation: "fadeIn 1.5s ease forwards" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "4rem", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "#4ade80", marginBottom: "1rem" }}>
              ✓ Consent Recorded & Notarized
            </div>
            <div style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontStyle: "italic", fontWeight: 300 }}>
              Welcome to Create AI Profit
            </div>
            <div style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.38)", fontStyle: "italic" }}>
              Redirecting to profile setup...
            </div>
            {pdfUrl && (
              <a href={pdfUrl} download={`CAP_Consent_${Date.now()}.pdf`}
                style={{ display: "block", marginTop: "1rem", color: "#c9a84c", fontSize: "0.78rem", fontStyle: "italic" }}>
                Download your consent PDF
              </a>
            )}
          </div>

        </div>
      )}

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes holoPulse { from { opacity: 0.6; } to { opacity: 1; } }
        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(1.35); opacity: 0; }
        }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
      `}</style>
    </div>
  );
}
