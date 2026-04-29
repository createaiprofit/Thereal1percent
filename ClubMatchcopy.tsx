import { useState } from "react";
import { Heart, X, Star, Plane, Anchor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { toast } from "sonner";

// Mock preview profiles for the swipe teaser
const PREVIEW_PROFILES = [
  {
    id: 1,
    name: "Jade S.",
    age: 28,
    city: "Dubai",
    tier: "platinum",
    tagline: "Closed $200K last quarter. Yacht dates only.",
    imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    tags: ["Yacht Date", "Private Jet", "Business"],
  },
  {
    id: 2,
    name: "Marcus B.",
    age: 32,
    city: "Monaco",
    tier: "gold",
    tagline: "Supercar collection. Looking for someone who keeps up.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    tags: ["Supercars", "Monaco", "Investor"],
  },
  {
    id: 3,
    name: "Sienna V.",
    age: 26,
    city: "New York",
    tier: "gold",
    tagline: "AI income. Penthouse views. Serious inquiries only.",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    tags: ["Penthouse", "AI Income", "NYC"],
  },
];

const TIER_COLORS: Record<string, string> = {
  silver: "text-gray-300",
  gold: "text-yellow-400",
  platinum: "text-purple-400",
};

export default function ClubMatch() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const profile = PREVIEW_PROFILES[currentIdx % PREVIEW_PROFILES.length];

  const handleSwipe = (dir: "left" | "right") => {
    setSwipeDir(dir);
    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIdx((i) => i + 1);
    }, 400);
    if (dir === "right") toast("Liked! Club Match launches soon — you'll be first to know.");
    else toast("Passed. More matches coming.");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/feed">
            <button className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="text-white font-bold text-lg tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Club Match
            </div>
            <div className="text-white/30 text-xs tracking-widest">Private Dating</div>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-yellow-900/40 to-red-900/40 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
        <div>
          <div className="text-yellow-400 font-semibold text-sm">Coming Soon — Preview Mode</div>
          <div className="text-white/40 text-xs">Swipe to preview. Full launch dropping soon for Club members.</div>
        </div>
      </div>

      {/* Swipe card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div
          className={`relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black transition-all duration-400 ${
            swipeDir === "right" ? "translate-x-32 rotate-12 opacity-0" :
            swipeDir === "left" ? "-translate-x-32 -rotate-12 opacity-0" : ""
          }`}
          style={{ aspectRatio: "3/4" }}
        >
          {/* Profile image */}
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* PG-13 watermark */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white/40 text-xs px-2 py-0.5 rounded border border-white/10">
            PG-13
          </div>

          {/* Tier badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold uppercase tracking-widest ${TIER_COLORS[profile.tier]}`}>
              {profile.tier === "platinum" ? "⚡" : "👑"} {profile.tier}
            </span>
          </div>

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {profile.name}
              </span>
              <span className="text-white/60 text-lg">{profile.age}</span>
            </div>
            <div className="text-white/50 text-sm mb-2">{profile.city}</div>
            <p className="text-white/80 text-sm italic mb-3">"{profile.tagline}"</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {profile.tags.map((tag) => (
                <span key={tag} className="bg-white/10 backdrop-blur-sm text-white/60 text-xs px-2.5 py-1 rounded-full border border-white/10">
                  {tag === "Yacht Date" ? <Anchor className="w-3 h-3 inline mr-1" /> :
                   tag === "Private Jet" ? <Plane className="w-3 h-3 inline mr-1" /> : null}
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe buttons */}
        <div className="flex items-center gap-8 mt-6">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all group"
          >
            <X className="w-7 h-7 text-white/40 group-hover:text-red-400 transition-colors" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all group"
          >
            <Heart className="w-7 h-7 text-white/40 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        <p className="text-white/20 text-xs mt-3 text-center">Preview only — matches go live at launch</p>
      </div>

      {/* Notify me section */}
      <div className="px-4 pb-8">
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
          <div className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Get Early Access
          </div>
          <p className="text-white/40 text-xs mb-3">
            Club Match is invite-only. Yacht dates, jet trips, penthouse meetups — PG-13, verified members only.
          </p>
          {notified ? (
            <div className="text-green-400 text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              You're on the list. We'll notify you at launch.
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 outline-none focus:border-yellow-500/40"
              />
              <Button
                onClick={() => {
                  if (notifyEmail) {
                    setNotified(true);
                    toast.success("You're on the list!");
                  }
                }}
                className="bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0 px-4"
              >
                Notify Me
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
