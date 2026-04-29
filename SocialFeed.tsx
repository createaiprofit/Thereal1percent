import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, MessageCircle, Share2, Music2, ChevronLeft, Search, Bookmark, Crown, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { TierBadge, type Tier } from "@/components/TierBadge";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  silver: "#c0c0c0",
  gold: "#facc15",
  platinum: "#a78bfa",
};

const TOP_TABS = [
  { id: "foryou",    label: "For You" },
  { id: "following", label: "Following" },
  { id: "live",      label: "🔴 LIVE" },
  { id: "oldmoney",  label: "Old Money" },
  { id: "newmoney",  label: "New Money" },
  { id: "dating",    label: "Dating" },
  { id: "biz",       label: "Business" },
  { id: "market",    label: "Market" },
  { id: "bookclub",  label: "📚 Book Club" },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FeedPost = {
  id: number;
  caption: string | null;
  mediaUrl: string | null;
  mediaType: "image" | "video";
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  botId: number | null;
  userId: number | null;
  botName: string | null;
  botAvatar: string | null;
  botTier: "silver" | "gold" | "platinum" | null;
  botCity: string | null;
  authorName: string | null;
  authorAvatar: string | null;
  authorTier: "silver" | "gold" | "platinum" | null;
};

// ─── SINGLE POST CARD (full-screen TikTok style) ──────────────────────────────
function PostCard({ post, isActive }: { post: FeedPost; isActive: boolean }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [following, setFollowing] = useState(false);
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const name = post.botName ?? post.authorName ?? "Member";
  const avatar = post.botAvatar ?? post.authorAvatar;
  const tier = post.botTier ?? post.authorTier ?? "silver";
  const city = post.botCity ?? "";
  const tierColor = TIER_COLORS[tier] ?? "#c0c0c0";

  const addComment = trpc.social.addComment.useMutation({
    onSuccess: () => { setComment(""); setShowComment(false); },
    onError: (e) => toast.error(e.message),
  });
  const likeMutation = trpc.social.likePost.useMutation();

  const handleLike = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
    likeMutation.mutate({ postId: post.id });
  };

  const handleComment = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!comment.trim()) return;
    addComment.mutate({ postId: post.id, body: comment });
  };

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100dvh",
      background: "#000000",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Background media */}
      {post.mediaUrl ? (
        <img
          src={post.mediaUrl}
          alt={post.caption ?? ""}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          loading={isActive ? "eager" : "lazy"}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a1a 100%)",
        }} />
      )}

      {/* Dark gradient overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />

      {/* ── RIGHT SIDE ACTION COLUMN ── */}
      <div style={{
        position: "absolute", right: "12px", bottom: "100px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
        zIndex: 10,
      }}>
        {/* Avatar + follow button */}
        <div style={{ position: "relative", marginBottom: "4px" }}>
          {avatar ? (
            <img src={avatar} alt={name} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${tierColor}` }} />
          ) : (
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #fe2c55, #25f4ee)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, fontSize: "1.1rem", border: `2px solid ${tierColor}` }}>
              {name[0]}
            </div>
          )}
          {/* Follow + button */}
          <button
            onClick={() => setFollowing(f => !f)}
            style={{
              position: "absolute", bottom: "-10px", left: "50%", transform: "translateX(-50%)",
              width: "20px", height: "20px", borderRadius: "50%",
              background: following ? "#25f4ee" : "#fe2c55",
              border: "2px solid #000",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "12px", fontWeight: 700, color: "#fff",
              lineHeight: 1,
            }}
          >
            {following ? "✓" : "+"}
          </button>
        </div>

        {/* Like */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <button
            onClick={handleLike}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px",
              color: liked ? "#fe2c55" : "#ffffff",
              transform: liked ? "scale(1.2)" : "scale(1)",
              transition: "all 0.15s",
            }}
          >
            <Heart className="w-8 h-8" fill={liked ? "#fe2c55" : "none"} />
          </button>
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {formatCount(likeCount)}
          </span>
        </div>

        {/* Comment */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setShowComment(s => !s)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#ffffff" }}
          >
            <MessageCircle className="w-8 h-8" />
          </button>
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {formatCount(post.commentCount)}
          </span>
        </div>

        {/* Bookmark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#ffffff" }}>
            <Bookmark className="w-8 h-8" />
          </button>
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Save</span>
        </div>

        {/* Share */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => { navigator.share?.({ text: post.caption ?? "", url: window.location.href }).catch(() => {}); toast("Link copied!"); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#ffffff" }}
          >
            <Share2 className="w-8 h-8" />
          </button>
          <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Share</span>
        </div>

        {/* Spinning music disc */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: "linear-gradient(135deg, #1a1a1a, #333)",
          border: "3px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: isActive ? "spin 4s linear infinite" : "none",
        }}>
          <Music2 className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* ── BOTTOM LEFT: user info + caption ── */}
      <div style={{
        position: "absolute", left: "12px", bottom: "100px", right: "80px",
        zIndex: 10,
      }}>
        {/* Username + tier */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
            @{name.replace(/\s+/g, "").toLowerCase()}
          </span>
          <TierBadge tier={tier as Tier} size="sm" />
          {city && <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>· {city}</span>}
        </div>

        {/* Caption */}
        {post.caption && (
          <p style={{
            color: "#ffffff", fontSize: "14px", lineHeight: 1.5,
            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.caption}
          </p>
        )}

        {/* Music bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          <Music2 className="w-3 h-3 text-white" style={{ flexShrink: 0 }} />
          <div style={{ overflow: "hidden", flex: 1 }}>
            <span style={{
              color: "rgba(255,255,255,0.8)", fontSize: "12px",
              display: "inline-block",
              animation: isActive ? "marquee 8s linear infinite" : "none",
              whiteSpace: "nowrap",
            }}>
              Create AI Profit — 1% Playground Mix
            </span>
          </div>
        </div>
      </div>

      {/* ── COMMENT INPUT OVERLAY ── */}
      {showComment && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 20,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "1rem",
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowComment(false); }}
        >
          <div style={{ background: "#1a1a1a", borderRadius: "16px 16px 0 0", padding: "1rem" }}>
            <div style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, marginBottom: "0.75rem" }}>Add a comment</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Say something..."
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "20px", padding: "8px 16px", color: "#ffffff", fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim() || addComment.isPending}
                style={{
                  background: "#fe2c55", border: "none", borderRadius: "20px",
                  padding: "8px 16px", color: "#ffffff", fontWeight: 700, fontSize: "13px",
                  cursor: comment.trim() ? "pointer" : "not-allowed",
                  opacity: comment.trim() ? 1 : 0.4,
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      `}</style>
    </div>
  );
}

// ─── MAIN FEED ────────────────────────────────────────────────────────────────
export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState("foryou");
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [allPosts, setAllPosts] = useState<FeedPost[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const { data, isLoading, isFetching } = trpc.social.getFeed.useQuery(
    { cursor, limit: 20 },
    { staleTime: 30_000 }
  );

  useEffect(() => {
    if (data?.items) {
      setAllPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = (data.items as FeedPost[]).filter(p => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // Snap scroll tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const idx = Math.round(container.scrollTop / window.innerHeight);
      setActiveIndex(idx);
      // Load more when near end
      if (idx >= allPosts.length - 3 && data?.nextCursor && !isFetching) {
        setCursor(data.nextCursor);
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [allPosts.length, data?.nextCursor, isFetching]);

  // Tab navigation for special tabs
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "live") navigate("/live");
    else if (tabId === "oldmoney") navigate("/oldmoney");
    else if (tabId === "newmoney") navigate("/newmoney");
    else if (tabId === "dating") navigate("/dating");
    else if (tabId === "biz") navigate("/bizinvest");
    else if (tabId === "market") navigate("/marketplace");
    else if (tabId === "bookclub") navigate("/bookclub");
  };

  return (
    <div style={{ background: "#000000", height: "100dvh", overflow: "hidden", position: "relative" }}>

      {/* ── TOP NAV ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        {/* Top row: search + CAP logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 4px" }}>
          <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", color: "#ffffff" }}>
            <Search className="w-6 h-6" />
          </button>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            1% Playground
          </div>
          <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", color: "#ffffff" }}>
            <Crown className="w-6 h-6" style={{ color: "#facc15" }} />
          </button>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", padding: "0 8px 8px", gap: "0" }}>
          {TOP_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  flexShrink: 0, padding: "6px 14px",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "14px", fontWeight: active ? 700 : 400,
                  color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                  position: "relative",
                  transition: "all 0.15s",
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
                {active && (
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    width: "20px", height: "2px", background: "#ffffff", borderRadius: "1px",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── VERTICAL SNAP SCROLL FEED ── */}
      <div
        ref={containerRef}
        style={{
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
        className="hide-scrollbar"
      >
        {isLoading && allPosts.length === 0 ? (
          // Loading skeleton
          <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fe2c55", animation: "bounce 0.8s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : allPosts.length === 0 ? (
          <div style={{ height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000", gap: "1rem" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "3rem" }}>📱</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Feed loading…
            </div>
          </div>
        ) : (
          <>
            {allPosts.map((post, i) => (
              <div key={post.id} style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}>
                <PostCard post={post} isActive={i === activeIndex} />
              </div>
            ))}
            {/* Load more sentinel */}
            {isFetching && (
              <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
                <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  Loading more…
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
