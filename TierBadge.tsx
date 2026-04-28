/**
 * TierBadge — status checkmark shown next to every username in the 1% Playground.
 *
 * Silver  → dull metallic, basic tier
 * Gold    → standard gold shine, business tier
 * Platinum → White Gold Diamond Base — shiny, sparkle, enterprise / all bots
 *
 * Usage: <TierBadge tier="platinum" size="sm" />
 */
import { cn } from "@/lib/utils";

export type Tier = "silver" | "gold" | "platinum";

interface TierBadgeProps {
  tier: Tier;
  /** sm = 14px (inline), md = 18px (card), lg = 24px (profile header) */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function TierBadge({ tier, size = "sm", className }: TierBadgeProps) {
  const px = SIZE[size];

  if (tier === "silver") {
    return (
      <span
        className={cn("inline-flex items-center justify-center flex-shrink-0", className)}
        title="Silver Member"
        aria-label="Silver tier"
        style={{ width: px, height: px }}
      >
        <svg width={px} height={px} viewBox="0 0 20 20" fill="none">
          <defs>
            <linearGradient id="silver-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="40%" stopColor="#d1d5db" />
              <stop offset="70%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
          </defs>
          <circle cx="10" cy="10" r="9" fill="url(#silver-grad)" />
          <path
            d="M6 10.5l2.5 2.5 5.5-5.5"
            stroke="#4b5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (tier === "gold") {
    return (
      <span
        className={cn("inline-flex items-center justify-center flex-shrink-0", className)}
        title="Gold Member"
        aria-label="Gold tier"
        style={{ width: px, height: px }}
      >
        <svg width={px} height={px} viewBox="0 0 20 20" fill="none">
          <defs>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <circle cx="10" cy="10" r="9" fill="url(#gold-grad)" />
          <path
            d="M6 10.5l2.5 2.5 5.5-5.5"
            stroke="#78350f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  // Platinum — White Gold Diamond Base with sparkle
  return (
    <span
      className={cn("inline-flex items-center justify-center flex-shrink-0 relative", className)}
      title="Platinum Elite Member"
      aria-label="Platinum tier"
      style={{ width: px, height: px }}
    >
      <svg width={px} height={px} viewBox="0 0 20 20" fill="none">
        <defs>
          <linearGradient id="plat-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="20%" stopColor="#e2e8f0" />
            <stop offset="45%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="85%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="plat-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </radialGradient>
          <filter id="plat-sparkle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Outer glow ring */}
        <circle cx="10" cy="10" r="9.5" fill="url(#plat-glow)" opacity="0.6" />
        {/* Main badge */}
        <circle cx="10" cy="10" r="9" fill="url(#plat-grad)" filter="url(#plat-sparkle)" />
        {/* Inner ring for depth */}
        <circle cx="10" cy="10" r="8.2" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.4" />
        {/* Checkmark */}
        <path
          d="M6 10.5l2.5 2.5 5.5-5.5"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Diamond sparkle dots */}
        <circle cx="3.5" cy="3.5" r="0.8" fill="white" opacity="0.9" />
        <circle cx="16.5" cy="3.5" r="0.6" fill="white" opacity="0.8" />
        <circle cx="16.5" cy="16.5" r="0.8" fill="white" opacity="0.9" />
        <circle cx="3.5" cy="16.5" r="0.6" fill="white" opacity="0.7" />
        <circle cx="10" cy="1.5" r="0.5" fill="white" opacity="0.95" />
        <circle cx="18.5" cy="10" r="0.5" fill="white" opacity="0.85" />
        <circle cx="10" cy="18.5" r="0.5" fill="white" opacity="0.9" />
        <circle cx="1.5" cy="10" r="0.5" fill="white" opacity="0.8" />
      </svg>
    </span>
  );
}

/**
 * Utility: map a subscription plan string to a Tier
 * Basic → silver, Business → gold, Enterprise / bot → platinum
 */
export function planToTier(plan?: string | null, isBot?: boolean): Tier {
  if (isBot) return "platinum";
  if (!plan) return "silver";
  const p = plan.toLowerCase();
  if (p.includes("enterprise") || p.includes("platinum")) return "platinum";
  if (p.includes("business") || p.includes("gold")) return "gold";
  return "silver";
}
