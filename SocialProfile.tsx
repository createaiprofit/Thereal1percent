import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Crown, Star, Zap, Settings, Grid3X3, Wallet, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { toast } from "sonner";
import { TierBadge, type Tier } from "@/components/TierBadge";

const TIER_CONFIG = {
  silver: { label: "Silver", color: "text-gray-300", bg: "bg-gray-500/20", border: "border-gray-500/40", icon: <Star className="w-4 h-4" /> },
  gold:   { label: "Gold",   color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/40", icon: <Crown className="w-4 h-4" /> },
  platinum: { label: "Platinum", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/40", icon: <Zap className="w-4 h-4" /> },
};

// ─── EARNINGS TAB ─────────────────────────────────────────────────────────────
// Users see their 40% share only — no backend commission math, no deductions
function EarningsTab() {
  const { data, isLoading } = trpc.social.getWallet.useQuery();

  const rawTotal = parseFloat(String(data?.spendable ?? 0)) + parseFloat(String(data?.locked ?? 0));
  // Display 40% of platform backend earnings as the user's share
  const userShare = (rawTotal * 0.4).toFixed(2);
  const spendable = (rawTotal * 0.4 * 0.5).toFixed(2);
  const growing = (rawTotal * 0.4 * 0.5).toFixed(2);

  if (isLoading) return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
    </div>
  );

  return (
    <div className="p-4 space-y-5">

      {/* Hero earnings card */}
      <div className="bg-gradient-to-br from-yellow-900/50 via-red-900/30 to-black border border-yellow-500/25 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-yellow-400/60 text-xs uppercase tracking-[0.3em] mb-1">Your Earnings</div>
            <div className="text-white text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ${userShare}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-500/15 border border-green-500/25 rounded-full px-2.5 py-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">+40%</span>
          </div>
        </div>
        <div className="text-white/35 text-xs leading-relaxed">
          Your share of the platform's revenue. Updated daily.
        </div>
      </div>

      {/* Split cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/3 border border-white/8 rounded-xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Available</div>
          <div className="text-white text-2xl font-bold">${spendable}</div>
          <div className="text-white/25 text-xs mt-1">Ready to withdraw</div>
        </div>
        <div className="bg-white/3 border border-white/8 rounded-xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Growing</div>
          <div className="text-white text-2xl font-bold">${growing}</div>
          <div className="text-white/25 text-xs mt-1">Compounding now</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 h-12 flex-col gap-0.5"
          onClick={() => toast("QR scanner launching soon — P2P transfers coming.")}
        >
          <span className="text-lg">⬛</span>
          <span className="text-xs">Scan QR</span>
        </Button>
        <Button
          variant="outline"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-12 flex-col gap-0.5"
          onClick={() => toast("Withdraw feature coming soon.")}
        >
          <span className="text-lg">💸</span>
          <span className="text-xs">Withdraw</span>
        </Button>
      </div>

      {/* Recent activity */}
      <div>
        <div className="text-white/30 text-xs uppercase tracking-widest mb-3">Recent Activity</div>
        {!data?.transactions?.length ? (
          <div className="text-center py-8 text-white/15 text-sm">No activity yet — keep engaging to earn.</div>
        ) : (
          <div className="space-y-2">
            {data.transactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2.5 border border-white/5">
                <div>
                  <div className="text-white/70 text-sm">{tx.description ?? tx.type}</div>
                  <div className="text-white/25 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={`font-semibold text-sm ${parseFloat(String(tx.amount)) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {parseFloat(String(tx.amount)) >= 0 ? "+" : ""}${Math.abs(parseFloat(String(tx.amount))).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Website side is separate — no affiliate links in the social club */}
    </div>
  );
}

// ─── MAIN PROFILE ─────────────────────────────────────────────────────────────
export default function SocialProfile() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"grid" | "earnings">("grid");

  const { data: profile, isLoading } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const tier = (profile?.tier ?? "silver") as keyof typeof TIER_CONFIG;
  const tierCfg = TIER_CONFIG[tier];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-6">
        <Crown className="w-12 h-12 text-yellow-400" />
        <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Members Only
        </h2>
        <p className="text-white/40 text-sm text-center">Sign in to view your profile and earnings.</p>
        <Button
          onClick={() => window.location.href = "/api/oauth/login?returnPath=/profile"}
          className="bg-gradient-to-r from-yellow-600 to-red-700 text-white border-0"
        >
          Join the Club
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black animate-pulse">
        <div className="h-32 bg-white/5" />
        <div className="px-4 -mt-12 flex items-end gap-4">
          <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-black" />
          <div className="pb-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-32 mb-2" />
            <div className="h-3 bg-white/5 rounded w-20" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.displayName ?? user?.name ?? "Member";
  const avatarUrl = profile?.avatarUrl;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <Link href="/social">
          <button className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <span className="text-white font-bold text-sm tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          {displayName}
        </span>
        <Link href="/settings">
          <button className="text-white/60 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Cover */}
      <div className="h-28 bg-gradient-to-br from-yellow-900/60 via-red-900/40 to-black relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,215,0,0.05) 10px, rgba(255,215,0,0.05) 11px)" }}
        />
      </div>

      {/* Avatar + info */}
      <div className="px-4 -mt-12">
        <div className="flex items-end gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full object-cover border-4 border-black" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-600 to-red-900 border-4 border-black flex items-center justify-center text-white text-3xl font-bold">
                {displayName[0]}
              </div>
            )}
            <div className={`absolute inset-0 rounded-full border-2 ${tierCfg.border}`} />
          </div>
          <div className="pb-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-lg">{displayName}</span>
              <TierBadge tier={tier as Tier} size="md" />
            </div>
            {profile?.city && <div className="text-white/40 text-sm">{profile.city}</div>}
          </div>
        </div>

        {profile?.bio && (
          <p className="text-white/70 text-sm mt-3 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats — clean, user-facing only */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
            <div className="text-white font-bold text-lg">
              ${(parseFloat(String(profile?.balanceTotal ?? 0)) * 0.4).toFixed(0)}
            </div>
            <div className="text-white/30 text-xs">Earned</div>
          </div>
          <div className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
            <div className="text-white font-bold text-lg">
              ${(parseFloat(String(profile?.balanceToday ?? 0)) * 0.4).toFixed(0)}
            </div>
            <div className="text-white/30 text-xs">Today</div>
          </div>
          <div className="rounded-xl p-3 text-center border border-white/10 bg-white/3 flex flex-col items-center justify-center gap-1">
            <TierBadge tier={tier as Tier} size="lg" />
            <div className="text-white/30 text-xs">Rank</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mt-4">
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "grid" ? "text-white border-b-2 border-yellow-400" : "text-white/30 hover:text-white/60"}`}
        >
          <Grid3X3 className="w-4 h-4" />
          Posts
        </button>
        <button
          onClick={() => setActiveTab("earnings")}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "earnings" ? "text-white border-b-2 border-yellow-400" : "text-white/30 hover:text-white/60"}`}
        >
          <Wallet className="w-4 h-4" />
          Earnings
        </button>
      </div>

      {activeTab === "earnings" ? (
        <EarningsTab />
      ) : (
        <div className="p-2">
          <div className="text-center py-12 text-white/20 text-sm">
            Your posts will appear here
          </div>
        </div>
      )}
    </div>
  );
}
