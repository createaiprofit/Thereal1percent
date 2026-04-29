  const [glitch, setGlitch] = useState(false);
  const [activeTab, setActiveTab] = useState<"stars" | "costars">("stars");
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [hookIdx, setHookIdx] = useState(0);
  const [cameoPlaying, setCameoPlaying] = useState<string | null>(null);
  const cameoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHookIdx(i => (i + 1) % TRAILER_HOOKS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const playCameoIntro = (id: string) => {
    setCameoPlaying(id);
    if (cameoTimerRef.current) clearTimeout(cameoTimerRef.current);
    cameoTimerRef.current = setTimeout(() => setCameoPlaying(null), 10000);
    // Siren-style audio for Kobe; funky bass for Katt
    try {
      const ctx = new AudioContext();
      if (id === "kobe") {
        // Deep dramatic bass hit
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
        osc.start(); osc.stop(ctx.currentTime + 3);
      } else {
        // Funky wah-wah for Katt
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.type = "sawtooth"; osc.frequency.setValueAtTime(110, ctx.currentTime);
        filter.type = "bandpass"; filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.setValueAtTime(1200, ctx.currentTime + 0.3);
        filter.frequency.setValueAtTime(400, ctx.currentTime + 0.6);
        filter.frequency.setValueAtTime(1200, ctx.currentTime + 0.9);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
        osc.start(); osc.stop(ctx.currentTime + 3);
      }
    } catch { /* blocked */ }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      color: "#ffffff",
      fontFamily: "'Cormorant Garamond', serif",
      paddingTop: "64px",
    }}>
      {/* ── CHECKERBOARD — full opacity, glides behind Aria ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.055) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.055) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.055) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.055) 75%)",
        backgroundSize: "60px 60px",
        backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
        animation: "chessGlide 18s linear infinite",
      }} />
      {/* Chess pieces floating layer */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        display: "flex", flexWrap: "wrap", alignContent: "flex-start",
        fontSize: "2.2rem",
        gap: "3.5rem",
        padding: "2rem",
        animation: "chessGlide 22s linear infinite reverse",
        overflow: "hidden",
      }}>
        {["♟","♞","♝","♜","♛","♚","♙","♘","♗","♖","♕","♔","♟","♞","♝","♜","♛","♚","♙","♘","♗","♖","♕","♔","♟","♞","♝","♜","♛","♚","♙","♘","♗","♖","♕","♔"].map((p, i) => (
          <span key={i} style={{ color: i % 2 === 0 ? "rgba(255,255,255,0.18)" : "rgba(200,160,60,0.22)", userSelect: "none" }}>{p}</span>
        ))}
      </div>
      {/* Aria Rabbit — top-center, 70% width, 0.60 opacity, red hair filter, full scene */}
      <div style={{
        position: "fixed", top: 0, left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1, pointerEvents: "none",
        width: "70vw", maxWidth: "700px", minWidth: "280px",
        opacity: 0.60,
      }}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_rabbit_redhead_2767_4703dc41.jpg"
          alt="Aria Rabbit"
          style={{
            width: "100%",
            objectFit: "contain",
            objectPosition: "top center",
            display: "block",
            filter: "hue-rotate(320deg) saturate(2.5) brightness(0.95)",
          }}
        />
      </div>
      {/* Radial glow */}
      <div style={{
        position: "fixed", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "700px", height: "700px",
        background: "radial-gradient(circle, rgba(120,0,0,0.10) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />