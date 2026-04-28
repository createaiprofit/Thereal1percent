/**
 * Outfit Rotation Engine
 * Rotates avatar outfits every 48 hours.
 * Each avatar wears what they sell — walking billboard mode.
 * Outfit cycles through the rotation array based on current 48h epoch.
 */

export interface OutfitSlot {
  label: string;       // Display name: "Black Armani Blazer + Silk Shirt"
  tag: string;         // Brand tag shown on post: "Armani"
  affiliate: string;   // Affiliate link key
  cta: string;         // CTA text
}

// 48-hour epoch index: changes every 48 hours from Unix epoch
export function get48hEpoch(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 48));
}

// Global outfit rotation — cycles every 48 hours
export const OUTFIT_ROTATION: OutfitSlot[] = [
  {
    label: "Black Armani Blazer + Silk Shirt + Cufflinks",
    tag: "Armani",
    affiliate: "armani_blazer",
    cta: "Shop the look — Club Vault",
  },
  {
    label: "Gray Armani Suit + White Dress Shirt",
    tag: "Armani",
    affiliate: "armani_gray_suit",
    cta: "Get the gray — Club Vault",
  },
  {
    label: "Versace Dress + Louboutin Heels",
    tag: "Versace × Louboutin",
    affiliate: "versace_dress",
    cta: "Wear the power — Club Vault",
  },
  {
    label: "Tom Ford Blazer + Charvet Tie",
    tag: "Tom Ford",
    affiliate: "tom_ford_blazer",
    cta: "The knife is in the blazer — Club Vault",
  },
  {
    label: "Saint Laurent Leather + Spiked Heels",
    tag: "Saint Laurent",
    affiliate: "saint_laurent_leather",
    cta: "The fox wears this — Club Vault",
  },
  {
    label: "Chanel Tweed Suit + Pearl Necklace",
    tag: "Chanel",
    affiliate: "chanel_suit",
    cta: "Closed three deals in this — Club Vault",
  },
  {
    label: "Balmain Gold Bodysuit + Gold Hoops",
    tag: "Balmain",
    affiliate: "balmain_bodysuit",
    cta: "The gold is the interest — Club Vault",
  },
  {
    label: "Red Silk Gown + Diamond Studs",
    tag: "Custom Silk + Cartier",
    affiliate: "red_silk_gown",
    cta: "Seven-figure receipts — Club Vault",
  },
  {
    label: "Loro Piana Cashmere Coat + Hermès Belt",
    tag: "Loro Piana × Hermès",
    affiliate: "loro_piana_coat",
    cta: "Old money energy — Club Vault",
  },
  {
    label: "Brioni Tuxedo + Rolex Daytona",
    tag: "Brioni × Rolex",
    affiliate: "brioni_tux",
    cta: "The system runs while you sleep — Club Vault",
  },
];

// Get current outfit for a given avatar (all avatars share the same rotation cycle)
export function getCurrentOutfit(avatarId?: string): OutfitSlot {
  const epoch = get48hEpoch();
  // Offset by avatar index for variety — each avatar wears a different outfit simultaneously
  const avatarOffsets: Record<string, number> = {
    la_hollywood: 0,
    miami: 1,
    nyc_wall_street: 2,
    atlanta_queen: 3,
    vegas: 4,
    chinese_girl: 5,
    american_italian_girl: 6,
    french_girl: 7,
    romanian_suit: 8,
    black: 9,
    russian: 0,
    italian: 1,
    mexican: 2,
    romanian: 3,
    indian: 4,
    arab: 5,
    brazilian: 6,
  };
  const offset = avatarId ? (avatarOffsets[avatarId] ?? 0) : 0;
  const idx = (epoch + offset) % OUTFIT_ROTATION.length;
  return OUTFIT_ROTATION[idx];
}

// Get hours until next outfit rotation
export function hoursUntilNextRotation(): number {
  const msInCycle = 1000 * 60 * 60 * 48;
  const msIntoCycle = Date.now() % msInCycle;
  const msRemaining = msInCycle - msIntoCycle;
  return Math.ceil(msRemaining / (1000 * 60 * 60));
}
