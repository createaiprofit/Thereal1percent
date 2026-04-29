import React, { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { speakText, stopSpeech } from "@/lib/audioManager";

// ─── ASSETS ───────────────────────────────────────────────────────────────────
const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";
const APP_DOWNLOAD_URL = "https://createaiprofit.com/app";


// ─── THE PRINCE — FOUNDER PHOTOS ─────────────────────────────────────────────
const PRINCE_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/staff_img5779_7b7b0f9f.jpg",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/staff_img5778_fd726540.jpg",
];

// ─── BABY AVATAR HOSTS (20 — multilingual, LOCKED UNIFORM) ────────────────────
const HOSTS = [
  {
    id: "strategist",
    name: "CAP",
    title: "The Strategist",
    origin: "Atlanta, GA",
    lang: "English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black-bibt54hpggxcfKJrMM4ZCs_501913b8.webp",
    quote: "Stack silent. Move loud.",
    pitch: "The system works while you sleep.",
    email: "TheStrategist@createaiprofit.com",
    voiceScript: "Machiavelli said: He who wishes to be obeyed must know how to command. Stack silent. Move loud. That is the only system that pays. Go to createaiprofit dot com.",
    voiceOpts: { pitch: 0.75, rate: 0.82, lang: "en-US" },
    voiceType: "Deep Gravel English",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/strategist_voice_f456c362.mp3",
  },
  {
    id: "operator",
    name: "CAP",
    title: "The Operator",
    origin: "Houston, TX",
    lang: "English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-VaXNoNYbjxPvWy8LfMwxJ2-3_ed825a6f.webp",
    quote: "Leverage is the only language money speaks.",
    pitch: "AI income streams. No clock. No boss.",
    email: "TheOperator@createaiprofit.com",
    voiceScript: "Leverage is the only language money speaks. Machiavelli knew it. I live it. AI income streams. No clock. No boss. createaiprofit dot com.",
    voiceOpts: { pitch: 0.7, rate: 0.85, lang: "en-US" },
    voiceType: "Deep Gravel English",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/operator_voice_bede5a30.mp3",
  },
  {
    id: "ghost",
    name: "CAP",
    title: "The Ghost",
    origin: "Moscow, RU",
    lang: "Russian",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian_new_ad2e1a2b.webp",
    quote: "Cold system. Hot returns.",
    pitch: "Passive income has no accent.",
    email: "TheGhost@createaiprofit.com",
    voiceScript: "Cold system. Hot returns. Passive income has no accent, no border, no limit. The machine earns while you sleep. createaiprofit dot com.",
    voiceOpts: { pitch: 0.65, rate: 0.8, lang: "en-US" },
    voiceType: "Native Russian Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/ghost_voice_0551f1f1.mp3",
  },
  {
    id: "architect",
    name: "CAP",
    title: "The Architect",
    origin: "St. Petersburg, RU",
    lang: "Russian",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian-MENqyhDtaiPVuD5LWosFMq_5a32fa0a.webp",
    quote: "Design the system. Let it run.",
    pitch: "The machine earns. You collect.",
    email: "TheArchitect@createaiprofit.com",
    voiceScript: "Design the system. Let it run. The machine earns. You collect. That is the architecture of modern wealth. createaiprofit dot com.",
    voiceOpts: { pitch: 0.68, rate: 0.83, lang: "en-US" },
    voiceType: "Native Russian Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/architect_voice_b30abb05.mp3",
  },

  {
    id: "don",
    name: "CAP",
    title: "The Don",
    origin: "Rome, IT",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_don_new_v1_3d64e224.webp",
    quote: "Respect is earned in silence.",
    pitch: "The vault is open. Are you ready?",
    email: "TheDon@createaiprofit.com",
    voiceScript: "Respect is earned in silence. The vault is open. Are you ready? I have been closing real estate deals for thirty years. One assignment fee changes everything. createaiprofit dot com.",
    voiceOpts: { pitch: 0.72, rate: 0.8, lang: "en-US" },
    voiceType: "Native Italian Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/don_voice_5c313eef.mp3",
  },
  {
    id: "builder",
    name: "CAP",
    title: "The Builder",
    origin: "Mexico City, MX",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_builder_new_d75ef2b8.jpg",
    quote: "Build what pays you while you sleep.",
    pitch: "One app. 21 million men. Free.",
    email: "TheBuilder@createaiprofit.com",
    voiceScript: "Build what pays you while you sleep. One app. Twenty one million men. Free. The Airbnb arbitrage model is real. I built mine from nothing. createaiprofit dot com.",
    voiceOpts: { pitch: 0.78, rate: 0.9, lang: "en-US" },
    voiceType: "Native Spanish Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/builder_voice_a542cf37.mp3",
  },
  {
    id: "phantom",
    name: "CAP",
    title: "The Phantom",
    origin: "Bucharest, RO",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_phantom_new_d9d4d3e3.jpg",
    quote: "Three moves ahead. Always.",
    pitch: "The 1% don't wait. They position.",
    email: "ThePhantom@createaiprofit.com",
    voiceScript: "Three moves ahead. Always. The one percent do not wait. They position. I am already in the next market before you see this one. createaiprofit dot com.",
    voiceOpts: { pitch: 0.62, rate: 0.78, lang: "en-US" },
    voiceType: "Native Romanian Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/phantom_voice_0fca4bdd.mp3",
  },
  {
    id: "transporter",
    name: "CAP",
    title: "The Transporter",
    origin: "London, UK",
    lang: "British English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian-cH2Sm5EBBazg8kDpLcGw3d.webp",
    quote: "Deliver the package. No questions asked.",
    pitch: "Precision. Discipline. Execution.",
    email: "TheTransporter@createaiprofit.com",
    voiceScript: "Deliver the package. No questions asked. Black belt. British precision. I move assets across borders — real estate, crypto, income streams. createaiprofit dot com.",
    voiceOpts: { pitch: 0.68, rate: 0.78, lang: "en-GB" },
    voiceType: "Native British Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/tactician_voice_9dac3be6.mp3",
  },
  {
    id: "tactician",
    name: "CAP",
    title: "The Tactician",
    origin: "Mumbai, IN",
    lang: "Indian English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_tactician_v1-EQFSTjgusFmdnuoNCTx6jp.webp",
    quote: "The supreme art of war is to subdue the enemy without fighting.",
    pitch: "Chess. Code. Checkmate.",
    email: "TheTactician@createaiprofit.com",
    voiceScript: "The supreme art of war is to subdue the enemy without fighting. Sun Tzu said it. I live it. Mumbai-built. AI-powered. Master chess player. Road scholar. createaiprofit dot com.",
    voiceOpts: { pitch: 0.75, rate: 0.82, lang: "en-IN" },
    voiceType: "Native Indian Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/tactician_voice_9dac3be6.mp3",
  },
  {
    id: "sheikh",
    name: "CAP",
    title: "The Sheikh",
    origin: "Dubai, UAE",
    lang: "Arabic",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-Zcg6Ldz9pYbDG2UQ2ANSud_785c3971.webp",
    quote: "Oil was yesterday. AI is today.",
    pitch: "The new wealth runs on algorithms.",
    email: "TheSheikh@createaiprofit.com",
    voiceScript: "Oil was yesterday. AI is today. The new wealth runs on algorithms. Dubai is already positioned. Are you? createaiprofit dot com.",
    voiceOpts: { pitch: 0.68, rate: 0.82, lang: "en-US" },
    voiceType: "Native Arabic Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/sheikh_voice_093076a8.mp3",
  },
  {
    id: "visionary",
    name: "CAP",
    title: "The Visionary",
    origin: "Mumbai, IN",
    lang: "Hindi",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_indian_e3ab94ed_f142bdf6.jpg",
    quote: "A billion people. One opportunity.",
    pitch: "AI profit has no borders.",
    email: "TheVisionary@createaiprofit.com",
    voiceScript: "A billion people. One opportunity. AI profit has no borders, no language barrier, no ceiling. The mission is global. createaiprofit dot com.",
    voiceOpts: { pitch: 0.8, rate: 0.88, lang: "en-US" },
    voiceType: "Native Hindi Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/visionary_voice_eae58f27.mp3",
  },
  {
    id: "visionary_mx",
    name: "CAP",
    title: "The Hustler",
    origin: "Los Angeles, CA",
    lang: "Spanish/English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_visionary_mexican_new_38cb3b37.jpg",
    quote: "Built from nothing. Scaled to everything.",
    pitch: "The American dream, automated.",
    email: "TheVisionary@createaiprofit.com",
    voiceScript: "Built from nothing. Scaled to everything. The American dream, automated. No borders, no ceiling. Passive income speaks every language. createaiprofit dot com.",
    voiceOpts: { pitch: 0.85, rate: 0.9, lang: "en-US" },
    voiceType: "Native Spanish/English Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/visionary_voice_eae58f27.mp3",
  },





  {
    id: "prince",
    name: "CAP",
    title: "The Prince",
    origin: "Monaco",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_prince_baby_v1_d2fddde8.jpg",
    quote: "Old money never announces itself.",
    pitch: "Generational wealth starts with one move.",
    email: "ThePrince@createaiprofit.com",
    voiceScript: "Old money never announces itself. Generational wealth starts with one move. The Prince does not chase. He positions. createaiprofit dot com.",
    voiceOpts: { pitch: 0.6, rate: 0.75, lang: "en-US" },
    voiceType: "Deep Gravel English",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/prince_voice_172db92f.mp3",
  },
  {
    id: "boss",
    name: "CAP",
    title: "The BOSS",
    origin: "New York, NY",
    lang: "English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_boss_corleone_2661_8a4902cf.jpg",
    quote: "Power is not given. It is taken.",
    pitch: "Calculated. Strategic. Inevitable.",
    email: "TheBoss@createaiprofit.com",
    voiceScript: "Machiavelli said: it is better to be feared than loved, if you cannot be both. Power is not given. It is taken. I am the BOSS. Calculated. Strategic. Inevitable. createaiprofit dot com.",
    voiceOpts: { pitch: 0.55, rate: 0.78, lang: "en-US" },
    voiceType: "Deep Gravel English",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/prince_voice_172db92f.mp3",
  },

  {
    id: "kai_tokyo",
    name: "CAP",
    title: "The Glitch",
    origin: "Tokyo, JP",
    lang: "Japanese/English",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_kai_tokyo_ca0fe340.jpg",
    quote: "Speed wins—I'm the glitch that flips the game.",
    pitch: "Tokyo's locked. The system bends for those who move faster.",
    voiceScript: "Speed wins. I am the glitch that flips the game. Tokyo is locked. The system bends for those who move faster. Are you fast enough? createaiprofit dot com.",
    voiceOpts: { pitch: 0.95, rate: 1.0, lang: "en-US" },
    voiceType: "Native Japanese Accent",
    voiceUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/glitch_voice_b598919a.mp3",
    email: "TheGlitch@createaiprofit.com",
  },

];

// ─── VAULT PRODUCTS (luxury only) ─────────────────────────────────────────────
type VaultCategory = "all" | "jewelry" | "fashion" | "watches" | "accessories" | "fragrance";

const VAULT_CATEGORIES: { id: VaultCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "jewelry", label: "Jewelry" },
  { id: "fashion", label: "Fashion" },
  { id: "watches", label: "Watches" },
  { id: "accessories", label: "Accessories" },
  { id: "fragrance", label: "Fragrance" },
];

interface VaultProduct {
  id: string;
  category: VaultCategory;
  name: string;
  brand: string;
  price: string;
  desc: string;
  badge?: string;
  url: string;
  hostId: string;
  commission: string;
}

const VAULT_PRODUCTS: VaultProduct[] = [
  // JEWELRY
  { id: "cartier_love", category: "jewelry", name: "Love Bracelet", brand: "Cartier", price: "$6,900", desc: "18K white gold. The ultimate symbol of commitment and power.", badge: "Iconic", url: "https://www.cartier.com", hostId: "italian", commission: "8%" },
  { id: "tiffany_diamond", category: "jewelry", name: "Diamond Solitaire Ring", brand: "Tiffany & Co.", price: "$12,500", desc: "Round brilliant cut. Platinum band. Timeless.", badge: "Bestseller", url: "https://www.tiffany.com", hostId: "nyc", commission: "8%" },
  { id: "vca_alhambra", category: "jewelry", name: "Vintage Alhambra Necklace", brand: "Van Cleef & Arpels", price: "$8,200", desc: "Malachite clover motif. Yellow gold. Luck personified.", url: "https://www.vancleefarpels.com", hostId: "la_hollywood", commission: "8%" },
  { id: "rolex_pearl", category: "jewelry", name: "Pearl Drop Earrings", brand: "Mikimoto", price: "$3,400", desc: "Akoya cultured pearls. 18K white gold. Japanese perfection.", url: "https://www.mikimoto.com", hostId: "russian", commission: "8%" },
  // FASHION
  { id: "dior_tuxedo", category: "fashion", name: "Slim-Fit Tuxedo", brand: "Dior Men", price: "$4,800", desc: "Black wool. Satin lapels. The only tuxedo you'll ever need.", badge: "Statement", url: "https://www.dior.com", hostId: "black", commission: "10%" },
  { id: "brioni_suit", category: "fashion", name: "Vanquish II Suit", brand: "Brioni", price: "$7,200", desc: "Super 150s wool. Hand-stitched in Rome. Power personified.", badge: "Power", url: "https://www.brioni.com", hostId: "italian_v2", commission: "10%" },
  { id: "lv_scarf", category: "fashion", name: "Monogram Silk Scarf", brand: "Louis Vuitton", price: "$580", desc: "100% silk. Iconic LV monogram. Effortless luxury.", url: "https://www.louisvuitton.com", hostId: "romanian", commission: "10%" },
  { id: "hermes_tie", category: "fashion", name: "Silk Twill Tie", brand: "Hermès", price: "$240", desc: "Hand-rolled edges. Exclusive print. Boardroom armor.", url: "https://www.hermes.com", hostId: "arab", commission: "10%" },
  { id: "gucci_loafers", category: "fashion", name: "Horsebit Loafers", brand: "Gucci", price: "$1,050", desc: "Black leather. Gold horsebit. The shoe that closes deals.", badge: "Classic", url: "https://www.gucci.com", hostId: "mexican", commission: "10%" },
  { id: "tom_ford_blazer", category: "fashion", name: "O'Connor Blazer", brand: "Tom Ford", price: "$3,990", desc: "Slim silhouette. Peak lapel. Unmistakably powerful.", url: "https://www.tomford.com", hostId: "atlanta", commission: "10%" },
  // WATCHES
  { id: "rolex_daytona", category: "watches", name: "Cosmograph Daytona", brand: "Rolex", price: "$29,500", desc: "Oystersteel. Black dial. The watch of champions.", badge: "Trophy", url: "https://www.rolex.com", hostId: "black_v2", commission: "5%" },
  { id: "ap_royal_oak", category: "watches", name: "Royal Oak", brand: "Audemars Piguet", price: "$45,000", desc: "Stainless steel. Tapisserie dial. The original luxury sports watch.", badge: "Legend", url: "https://www.audemarspiguet.com", hostId: "nyc", commission: "5%" },
  { id: "patek_calatrava", category: "watches", name: "Calatrava", brand: "Patek Philippe", price: "$32,000", desc: "White gold. Minimalist perfection. Heirloom quality.", url: "https://www.patek.com", hostId: "russian_v2", commission: "5%" },
  // ACCESSORIES
  { id: "lv_wallet", category: "accessories", name: "Slender Wallet", brand: "Louis Vuitton", price: "$460", desc: "Taiga leather. Slim profile. Carry wealth quietly.", url: "https://www.louisvuitton.com", hostId: "romanian_v2", commission: "10%" },
  { id: "hermes_belt", category: "accessories", name: "Reversible H Belt", brand: "Hermès", price: "$760", desc: "Black/brown calfskin. Palladium buckle. The ultimate accessory.", badge: "Essential", url: "https://www.hermes.com", hostId: "indian", commission: "10%" },
  { id: "bottega_bag", category: "accessories", name: "Intrecciato Briefcase", brand: "Bottega Veneta", price: "$3,200", desc: "Woven leather. No logo needed. Quiet luxury defined.", url: "https://www.bottegaveneta.com", hostId: "la_hollywood", commission: "10%" },
  // FRAGRANCE
  { id: "creed_aventus", category: "fragrance", name: "Aventus", brand: "Creed", price: "$550", desc: "Pineapple, birch, musk. The scent of success.", badge: "Signature", url: "https://www.creedperfume.com", hostId: "arab", commission: "12%" },
  { id: "tf_oud_wood", category: "fragrance", name: "Oud Wood", brand: "Tom Ford", price: "$295", desc: "Rare oud, sandalwood, vanilla. Boardroom to penthouse.", url: "https://www.tomford.com", hostId: "black", commission: "12%" },
  { id: "chanel_bleu", category: "fragrance", name: "Bleu de Chanel EDP", brand: "Chanel", price: "$185", desc: "Citrus, cedar, labdanum. The modern gentleman's choice.", url: "https://www.chanel.com", hostId: "italian", commission: "12%" },
];

// ─── CHECKMATE EPISODES ───────────────────────────────────────────────────────
const EPISODES = [
  { ep: 1, title: "The Board Is Set", desc: "Every empire starts with a single move. Learn the system that turns AI into passive income." },
  { ep: 2, title: "Pawns & Players", desc: "Most people are pawns. A few become players. This episode breaks down the difference." },
  { ep: 3, title: "The Opening Gambit", desc: "Map out the first 90 days. Three income streams. Zero excuses." },
  { ep: 4, title: "Control the Center", desc: "Whoever controls the center controls the game. This episode is about positioning." },
  { ep: 5, title: "The Knight's Move", desc: "The knight is the only piece that jumps over obstacles. Unconventional moves." },
  { ep: 6, title: "Sacrifice to Win", desc: "Every grandmaster knows: sometimes you give up a piece to win the game." },
  { ep: 7, title: "The Bishop's Diagonal", desc: "Wealth doesn't move in straight lines. It moves diagonally — through relationships." },
  { ep: 8, title: "Castling", desc: "The only move where two pieces move at once. Protect assets while advancing." },
  { ep: 9, title: "The Rook's Straight Line", desc: "Power moves in straight lines when the path is clear. Clear the board." },
  { ep: 10, title: "Mid-Game Pressure", desc: "The mid-game is where most people fold. Apply relentless pressure." },
  { ep: 11, title: "Tempo & Initiative", desc: "Whoever has the initiative controls the tempo. Stop reacting — start dictating." },
  { ep: 12, title: "The Passed Pawn", desc: "A pawn that can't be stopped becomes a queen. Identify your passed pawn." },
  { ep: 13, title: "Zugzwang", desc: "Sometimes every move your enemy makes hurts them. Create that situation." },
  { ep: 14, title: "The Endgame Begins", desc: "The endgame is where preparation meets execution. Everything pays off." },
  { ep: 15, title: "King & Pawn", desc: "Strip away everything — it comes down to fundamentals that never change." },
  { ep: 16, title: "Opposition", desc: "In chess, opposition is about positioning your king to dominate." },
  { ep: 17, title: "Promotion", desc: "When a pawn reaches the other side, it becomes anything it wants." },
  { ep: 18, title: "The Quiet Move", desc: "The most powerful moves are often the quietest. Silent plays build generational wealth." },
  { ep: 19, title: "Forced Moves", desc: "Sometimes the board forces your hand. Turn forced moves into opportunities." },
  { ep: 20, title: "One Move Away", desc: "You're one move from checkmate. Everything has been leading here." },
  { ep: 21, title: "CHECKMATE — The Prince Revealed", desc: "The finale. The Prince steps out of the shadows. The system is complete.", isFinale: true },
];

// ─── PRICING TIERS ────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: "$99",
    period: "/month",
    tagline: "Start your journey",
    features: [
      "Access to 1% Playground app",
      "Core AI income tools",
      "Community feed access",
      "Basic vault discounts",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    id: "business",
    name: "Business",
    price: "$199",
    period: "/month",
    tagline: "Scale your operation",
    features: [
      "Everything in Basic",
      "Advanced AI automation",
      "Priority vault access",
      "40% revenue share",
      "Business analytics dashboard",
      "Priority support",
    ],
    cta: "Go Business",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$399",
    period: "/month",
    tagline: "Dominate your market",
    features: [
      "Everything in Business",
      "White-glove onboarding",
      "Custom AI strategy session",
      "Exclusive inner circle access",
      "First access to new features",
      "Dedicated account manager",
    ],
    cta: "Go Enterprise",
    highlight: false,
    badge: "Elite",
  },
];

// ─── HOST VOICE GRID ─────────────────────────────────────────────────────────
type HostEntry = (typeof HOSTS)[number];

function HostVoiceGrid({ hosts }: { hosts: HostEntry[] }) {
  const [playing, setPlaying] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playHost = (host: HostEntry) => {
    if (playing === host.id) {
      // stop
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setPlaying(null);
      return;
    }
    // stop previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (host.voiceUrl) {
      const audio = new Audio(host.voiceUrl);
      audioRef.current = audio;
      audio.play().catch(() => {});
      setPlaying(host.id);
      audio.onended = () => setPlaying(null);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {hosts.map((host) => (
        <div
          key={host.id}
          onClick={() => playHost(host)}
          style={{
            textAlign: "center",
            padding: "1.25rem 0.75rem 1rem",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={host.img}
              alt={host.title}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
                marginBottom: "0.85rem",
                transition: "filter 0.2s",
                filter: playing === host.id ? "brightness(1.15) drop-shadow(0 0 12px rgba(180,200,255,0.5))" : "brightness(1)",
              }}
            />
            {/* Waveform animation while speaking */}
            {playing === host.id && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1.2rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "3px",
                  alignItems: "flex-end",
                  height: "20px",
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "3px",
                      background: "rgba(255,255,255,0.8)",
                      borderRadius: "2px",
                      animation: `waveBar${i} 0.6s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                      height: `${8 + i * 3}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.95rem",
              fontWeight: 300,
              fontStyle: "italic",
              color: playing === host.id ? "rgba(200,220,255,0.95)" : "rgba(255,255,255,0.85)",
              letterSpacing: "0.04em",
              marginBottom: "0.2rem",
            }}
          >
            {host.title}
          </div>
          <div
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.5rem",
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(148,163,170,0.4)",
            }}
          >
            {host.origin}
          </div>
          {playing === host.id && (
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(180,200,255,0.6)",
                marginTop: "0.3rem",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              ◼ speaking...
            </div>
          )}
        </div>
      ))}
      <style>{`
        @keyframes waveBar1 { from { height: 6px; } to { height: 16px; } }
        @keyframes waveBar2 { from { height: 10px; } to { height: 20px; } }
        @keyframes waveBar3 { from { height: 14px; } to { height: 8px; } }
        @keyframes waveBar4 { from { height: 8px; } to { height: 18px; } }
        @keyframes waveBar5 { from { height: 12px; } to { height: 6px; } }
      `}</style>
    </div>
  );
}

// ─── FUNNEL MODAL ─────────────────────────────────────────────────────────────
function FunnelModal({ product, onClose }: { product: VaultProduct; onClose: () => void }) {
  const [step, setStep] = useState<"product" | "upsell" | "capture" | "done">("product");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const host = HOSTS.find(h => h.id === product.hostId) || HOSTS[0];

  const related = VAULT_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 2);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(201,168,76,0.3)",
          maxWidth: "520px", width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            cursor: "pointer", fontSize: "1.25rem", lineHeight: 1,
          }}
        >×</button>

        {step === "product" && (
          <>
            {/* Host avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <img src={host.img} alt={host.title} style={{ width: "48px", height: "80px", objectFit: "contain", objectPosition: "center" }} />
              <div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)" }}>{host.title} · {host.origin}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(255,255,255,0.7)", marginTop: "0.2rem" }}>"{host.pitch}"</div>
              </div>
            </div>

            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.5rem" }}>{product.brand}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, fontStyle: "italic", color: "#ffffff", marginBottom: "0.5rem" }}>{product.name}</h2>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#94A3AA", marginBottom: "1rem" }}>{product.price}</div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{product.desc}</p>

            {/* Related */}
            {related.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>You May Also Like</div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {related.map(r => (
                    <div key={r.id} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.75rem", cursor: "pointer" }}
                      onClick={() => { }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)" }}>{r.brand}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#ffffff", margin: "0.2rem 0" }}>{r.name}</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "#94A3AA" }}>{r.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("capture")}
              style={{
                width: "100%", padding: "1rem",
                background: "#94A3AA", color: "#000000",
                border: "none", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Purchase Now
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "0.75rem",
                background: "transparent", color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
              }}
            >
              Continue Shopping
            </button>
          </>
        )}

        {step === "capture" && (
          <>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.5rem" }}>Secure Checkout</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.25rem" }}>{product.name}</h2>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#94A3AA", marginBottom: "1.5rem" }}>{product.price}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff", padding: "0.85rem 1rem",
                  fontFamily: "'Lato', sans-serif", fontSize: "0.9rem",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Card number"
                value={card}
                onChange={e => setCard(e.target.value.replace(/\D/g, "").slice(0, 16))}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff", padding: "0.85rem 1rem",
                  fontFamily: "'Lato', sans-serif", fontSize: "0.9rem",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff", padding: "0.85rem 1rem",
                    fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.slice(0, 4))}
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff", padding: "0.85rem 1rem",
                    fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setStep("done")}
              style={{
                width: "100%", padding: "1rem",
                background: "#94A3AA", color: "#000000",
                border: "none", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Complete Purchase
            </button>
            <button
              onClick={() => setStep("product")}
              style={{
                width: "100%", padding: "0.75rem",
                background: "transparent", color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
              }}
            >
              ← Back
            </button>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.75rem", color: "#94A3AA", marginBottom: "0.75rem" }}>Order Confirmed</h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "2rem", lineHeight: 1.6 }}>
              Your order is being processed. A confirmation will be sent to {email || "your email"}.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "0.85rem",
                  background: "transparent", color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                }}
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")}
                style={{
                  flex: 1, padding: "0.85rem",
                  background: "#94A3AA", color: "#000000",
                  border: "none", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                  letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                }}
              >
                Download App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIVE FEED TAB COMPONENT ─────────────────────────────────────────────────
function LiveFeedTab({ setActiveTab }: { setActiveTab: (t: Tab) => void }) {
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { data, isLoading, isFetching } = trpc.social.getFeed.useQuery(
    { cursor, limit: 20 },
    { staleTime: 30_000 }
  );

  useEffect(() => {
    if (data?.items) {
      setAllPosts(prev => {
        const existingIds = new Set(prev.map((p: any) => p.id));
        const newItems = data.items.filter((p: any) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  const posts = allPosts;
  const hasNextPage = !!data?.nextCursor;
  const isFetchingNextPage = isFetching && cursor !== undefined;

  const loadMore = () => {
    if (data?.nextCursor) setCursor(data.nextCursor);
  };

  const MACH_QUOTES = [
    "It is better to be feared than loved, if you cannot be both.",
    "The lion cannot protect himself from traps, and the fox cannot defend himself from wolves.",
    "Never attempt to win by force what can be won by deception.",
    "Whosoever desires constant success must change his conduct with the times.",
    "Men in general judge more from appearances than from reality.",
    "It is not titles that honor men, but men that honor titles.",
    "One change always leaves the way open for the establishment of others.",
    "The first method for estimating the intelligence of a ruler is to look at the men he has around him.",
  ];

  return (
    <section style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem", background: "#000" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.75rem" }}>
            Live · CreateAIProfit
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.75rem", lineHeight: 1.1 }}>
            The Feed
          </h2>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.35)" }}>
            Live posts from the 1% network. Updated every 30 minutes.
          </p>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.3em" }}>
            LOADING FEED...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)", fontFamily: "'Lato', sans-serif" }}>
            Feed initializing. Check back in a moment.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {posts.map((post, i) => {
              const mq = MACH_QUOTES[i % MACH_QUOTES.length];
              const avatar = post.botAvatar || "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_logo_master_9abf3722.png";
              const name = post.botName || post.authorName || "ECV Member";
              const city = post.botCity || "";
              const tier = (post.botTier || post.authorTier || "silver") as "silver" | "gold" | "platinum";
              const tierColors: Record<string, string> = { silver: "#aaa", gold: "#94A3AA", platinum: "#e8e8ff" };
              const tierLabels: Record<string, string> = { silver: "✦", gold: "✦", platinum: "✦" };
              return (
                <div
                  key={post.id}
                  style={{
                    background: "#0a0a0a",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    padding: "1.5rem",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#111")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#0a0a0a")}
                >
                  {/* Author row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <img
                      src={avatar}
                      alt={name}
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: `1px solid ${tierColors[tier]}40` }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>{name}</span>
                        <span style={{ color: tierColors[tier], fontSize: "0.75rem" }}>{tierLabels[tier]}</span>
                      </div>
                      {city && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{city}</div>}
                    </div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)" }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Machiavelli quote */}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.85rem", fontStyle: "italic",
                    color: "rgba(201,168,76,0.7)",
                    borderLeft: "2px solid rgba(201,168,76,0.3)",
                    paddingLeft: "0.75rem",
                    marginBottom: "0.85rem",
                  }}>
                    "{mq}"
                  </div>

                  {/* Caption */}
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
                    {post.caption}
                  </p>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>
                      ♥ {(post.likeCount ?? 0).toLocaleString()}
                    </span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>
                      ✦ {(post.commentCount ?? 0).toLocaleString()} comments
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasNextPage && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => loadMore()}
              disabled={isFetchingNextPage}
              style={{
                padding: "0.85rem 2.5rem",
                background: "transparent", color: "rgba(201,168,76,0.7)",
                border: "1px solid rgba(201,168,76,0.3)", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
              }}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
            Want to post? Join the 1% Playground.
          </p>
          <button
            onClick={() => setActiveTab("download" as Tab)}
            style={{
              padding: "0.9rem 2.5rem",
              background: "#94A3AA", color: "#000",
              border: "none", cursor: "pointer",
              fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
              letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
            }}
          >
            Download the App
          </button>
        </div>
      </div>
    </section>
  );
}


// ─── ARIA RABBIT HOURLY UPDATE TICKER ────────────────────────────────────────
const ARIA_UPDATES = [
  "🏠 18% off Florida condo — owner slashed 20%. DM me.",
  "📈 Crypto flip alert: BTC up 4% overnight. Position now.",
  "🏖️ Airbnb cash cow — Miami Beach unit, 92% occupancy. DM for details.",
  "💎 Vault drop: Cartier Love Bracelet — limited stock. Grab it.",
  "🔑 Real estate assignment — Dallas duplex, $40K below market. DM.",
  "📱 1% Playground hit 10K users. Download before the waitlist closes.",
  "🌴 Scottsdale vacation rental — 3 nights booked, $2,400 passive. DM.",
  "💰 Affiliate commission just hit $8,200 this week. System works.",
  "🎯 New episode dropping tonight — Checkmate EP 04. Get notified.",
  "🚀 AI income system update: 3 new passive streams added. Log in.",
];

function AriaUpdateTicker() {
  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ARIA_UPDATES.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "0.75rem",
      background: "rgba(201,168,76,0.05)",
      border: "1px solid rgba(201,168,76,0.2)",
      padding: "0.75rem 1.5rem",
      maxWidth: "600px", width: "100%",
      transition: "opacity 0.4s",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%",
        background: "rgba(201,168,76,0.1)",
        border: "1px solid rgba(201,168,76,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
        color: "rgba(201,168,76,0.8)", fontWeight: 700,
      }}>AR</div>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.2rem" }}>
          Aria Rabbit · Live Update
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.75)" }}>
          {ARIA_UPDATES[idx]}
        </div>
      </div>
    </div>
  );
}

// ─── SOCIAL VAULT ADMIN ──────────────────────────────────────────────────────────
type PostEntry = { id: string; avatar: string; platform: string; title: string; url: string; date: string; };

type CTAType = 'appDownloads' | 'webTraffic' | 'affiliate' | 'miniseries';
type PlatformTab = 'TikTok' | 'IG Reels' | 'YT Shorts' | 'Facebook' | 'X';

const PLATFORM_SPECS: Record<PlatformTab, { duration: string; orientation: string; color: string }> = {
  'TikTok':    { duration: '15 sec', orientation: 'Vertical 9:16', color: '#69C9D0' },
  'IG Reels':  { duration: '15–30 sec', orientation: 'Vertical 9:16', color: '#E1306C' },
  'YT Shorts': { duration: '15–60 sec', orientation: 'Vertical 9:16', color: '#FF0000' },
  'Facebook':  { duration: '15–60 sec', orientation: 'Vertical or Square', color: '#1877F2' },
  'X':         { duration: '15–60 sec', orientation: 'Horizontal or Vertical', color: '#ffffff' },
};

const CTA_TYPES: { id: CTAType; label: string; desc: string; icon: string }[] = [
  { id: 'appDownloads', label: 'App Downloads', desc: '1% Playground download CTA', icon: '📱' },
  { id: 'webTraffic',   label: 'Web Traffic',   desc: 'Drive to createaiprofit.com', icon: '🌐' },
  { id: 'affiliate',    label: 'Affiliate',      desc: 'Gold Vault product links', icon: '💰' },
  { id: 'miniseries',   label: 'Mini Series',    desc: 'CheckMate series page', icon: '🎬' },
];

function SocialVaultAdmin() {
  const [activeCTA, setActiveCTA] = React.useState<CTAType>('appDownloads');
  const [activePlatform, setActivePlatform] = React.useState<PlatformTab>('TikTok');
  const [isDragging, setIsDragging] = React.useState(false);
  const [videoQueues, setVideoQueues] = React.useState<Record<PlatformTab, PostEntry[]>>({
    'TikTok': [], 'IG Reels': [], 'YT Shorts': [], 'Facebook': [], 'X': [],
  });
  const [posts, setPosts] = React.useState<PostEntry[]>([]);
  const [showLog, setShowLog] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentQueue = videoQueues[activePlatform];
  const spec = PLATFORM_SPECS[activePlatform];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/'));
    addFilesToQueue(files);
  };

  const addFilesToQueue = (files: File[]) => {
    const newEntries: PostEntry[] = files.map(f => ({
      id: Date.now().toString() + Math.random(),
      avatar: 'Pending',
      platform: activePlatform,
      title: f.name.replace(/\.[^.]+$/, ''),
      url: URL.createObjectURL(f),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));
    setVideoQueues(prev => ({ ...prev, [activePlatform]: [...prev[activePlatform], ...newEntries] }));
  };

  const removeFromQueue = (id: string) => {
    setVideoQueues(prev => ({ ...prev, [activePlatform]: prev[activePlatform].filter(e => e.id !== id) }));
  };

  const publishEntry = (entry: PostEntry) => {
    setPosts(prev => [{ ...entry, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...prev.slice(0, 49)]);
    removeFromQueue(entry.id);
  };

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.6rem 0.9rem', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', letterSpacing: '0.05em', width: '100%', outline: 'none' };

  const totalQueue = Object.values(videoQueues).reduce((s, q) => s + q.length, 0);

  return (
    <div style={{ marginBottom: '3rem' }}>

      {/* ── CTA CONTROL PANEL ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '1rem', textAlign: 'center' }}>
          CTA Control · All 15 Hosts · One Switch
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {CTA_TYPES.map(cta => (
            <button
              key={cta.id}
              onClick={() => setActiveCTA(cta.id)}
              style={{
                background: activeCTA === cta.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.02)',
                border: activeCTA === cta.id ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.08)',
                color: activeCTA === cta.id ? 'rgba(201,168,76,1)' : 'rgba(255,255,255,0.5)',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{cta.icon}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{cta.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.7 }}>{cta.desc}</div>
            </button>
          ))}
        </div>
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>Active CTA → All 15 Hosts</span>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: 'rgba(201,168,76,1)', marginTop: '0.15rem' }}>
              {CTA_TYPES.find(c => c.id === activeCTA)?.icon} {CTA_TYPES.find(c => c.id === activeCTA)?.label}
            </div>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
            Click any button above to switch all bots instantly
          </div>
        </div>
      </div>

      {/* ── PLATFORM VIDEO QUEUE ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(148,163,170,0.6)', marginBottom: '1rem', textAlign: 'center' }}>
          Video Queue · {totalQueue} Clips Staged
        </div>

        {/* Platform tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
          {(Object.keys(PLATFORM_SPECS) as PlatformTab[]).map(p => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              style={{
                background: activePlatform === p ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: 'none',
                borderBottom: activePlatform === p ? `2px solid ${PLATFORM_SPECS[p].color}` : '2px solid transparent',
                color: activePlatform === p ? '#ffffff' : 'rgba(255,255,255,0.35)',
                padding: '0.65rem 1.25rem',
                cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              {p}
              {videoQueues[p].length > 0 && (
                <span style={{ marginLeft: '0.4rem', background: PLATFORM_SPECS[p].color, color: '#000', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700 }}>
                  {videoQueues[p].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Spec bar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${spec.color}`, padding: '0.65rem 1rem', marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div><span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Duration</span><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', color: '#ffffff', marginTop: '0.1rem' }}>{spec.duration}</div></div>
          <div><span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Format</span><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', color: '#ffffff', marginTop: '0.1rem' }}>{spec.orientation}</div></div>
          <div><span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Structure</span><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', color: '#ffffff', marginTop: '0.1rem' }}>0–8s Quote · 8–15s Spin · 15–18s Market · 18–20s CTA</div></div>
        </div>

        {/* Drag-drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? spec.color : 'rgba(255,255,255,0.12)'}`,
            background: isDragging ? `rgba(${activePlatform === 'TikTok' ? '105,201,208' : '255,255,255'},0.04)` : 'rgba(255,255,255,0.01)',
            padding: '2.5rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '1rem',
          }}
        >
          <input ref={fileInputRef} type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={e => { if (e.target.files) addFilesToQueue(Array.from(e.target.files)); }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            {isDragging ? 'Drop to add to queue' : 'Drag & drop video clips here · or click to browse'}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.2)', marginTop: '0.35rem' }}>
            Grab → Copy → Paste → Publish manual
          </div>
        </div>

        {/* Queue list */}
        {currentQueue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.2)' }}>No clips staged for {activePlatform} yet.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentQueue.map(entry => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.85rem 1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: `${spec.color}99`, marginBottom: '0.2rem' }}>{activePlatform} · {entry.date}</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title}</div>
                </div>
                <button onClick={() => publishEntry(entry)} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', color: 'rgba(201,168,76,0.9)', padding: '0.4rem 0.9rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', flexShrink: 0 }}>Publish</button>
                <button onClick={() => removeFromQueue(entry.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── POST LOG ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(148,163,170,0.6)' }}>
            Live Post Log · {posts.length} Published
          </div>
          <button onClick={() => setShowLog(v => !v)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '0.4rem 0.9rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{showLog ? 'Hide Log' : 'Show Log'}</button>
        </div>
        {showLog && (
          posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.2)' }}>No posts published yet. Stage a clip and hit Publish.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', position: 'relative' }}>
                  <button onClick={() => setPosts(prev => prev.filter(x => x.id !== p.id))} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.2rem' }}>{p.platform} · {p.date}</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>{p.avatar}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.6rem', lineHeight: 1.4 }}>{p.title}</div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.3)', paddingBottom: '1px' }}>View →</a>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function SocialVaultPostLog() {
  return <SocialVaultAdmin />;
}
// ─── AVATAR OF THE DAY ──────────────────────────────────────────────────────────
const OUTFIT_NAMES = ["Armani French-Cut · Black", "Armani French-Cut · Navy", "Armani French-Cut · Charcoal"];
function AvatarOfTheDay() {
  const daySlot = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 3)) % 15;
  const outfitSlot = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 3)) % 3;
  const avatar = HOSTS[daySlot % HOSTS.length];
  const outfit = OUTFIT_NAMES[outfitSlot];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3rem" }}>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1rem" }}>
        Avatar of the Day
      </div>
      <div style={{
        display: "flex", gap: "2rem", alignItems: "flex-start",
        background: "rgba(201,168,76,0.03)",
        border: "1px solid rgba(201,168,76,0.15)",
        padding: "2rem",
        maxWidth: "600px", width: "100%",
      }}>
        <img src={avatar.img} alt={avatar.title} style={{ width: "140px", height: "280px", objectFit: "contain", objectPosition: "center", flexShrink: 0, background: "transparent" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.2rem" }}>{avatar.title}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.25rem" }}>{avatar.origin}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: "1rem" }}>{outfit}</div>
        </div>
      </div>
    </div>
  );
}
// ─── MAIN HOME COMPONENT ──────────────────────────────────────────────────────
type Tab = "home" | "host" | "series" | "cast" | "social-vault" | "vault" | "download" | "live-feed" | "staff" | "coming-soon";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<VaultProduct | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [seriesGlitch, setSeriesGlitch] = useState(false);
  const [seriesEmail, setSeriesEmail] = useState("");
  const [seriesSubmitted, setSeriesSubmitted] = useState(false);
  const [princeIdx, setPrinceIdx] = useState(0);

  // The Prince image rotation — cycles every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPrinceIdx(i => (i + 1) % PRINCE_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect for Mini Series title
  useEffect(() => {
    if (activeTab !== "series") return;
    const interval = setInterval(() => {
      setSeriesGlitch(true);
      setTimeout(() => setSeriesGlitch(false), 180);
    }, 3800);
    return () => clearInterval(interval);
  }, [activeTab]);



  // Daily unlock logic: ep N unlocks on day N (relative to launch)
  // For demo, we treat "launch day" as a fixed reference; all locked for now
  const isEpisodeUnlocked = (ep: number) => {
    // When you're ready to start unlocking, set LAUNCH_DATE and uncomment:
    // const LAUNCH_DATE = new Date("2026-04-01");
    // const daysSinceLaunch = Math.floor((Date.now() - LAUNCH_DATE.getTime()) / 86400000);
    // return ep <= daysSinceLaunch + 1;
    return true; // All episodes unlocked for preview
  };

  const filteredProducts = vaultCategory === "all"
    ? VAULT_PRODUCTS
    : VAULT_PRODUCTS.filter(p => p.category === vaultCategory);

  const handleAdminLogin = () => {
    if (adminPass === "CAP2024admin" || adminPass === "admin") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass("");
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  const NAV_TABS: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "host", label: "Host" },
    { id: "staff", label: "Staff" },
    { id: "series", label: "Mini Series" },
    { id: "cast", label: "Cast" },
    { id: "social-vault", label: "Social Vault" },
    { id: "vault", label: "Vault" },
    { id: "live-feed", label: "Live Feed" },
    { id: "coming-soon", label: "Coming Soon" },
    { id: "download", label: "Download App" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#ffffff" }}>

      {/* ── TOP NAVIGATION ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src={CAP_LOGO}
              alt="Create AI Profit"
              style={{ height: "44px", width: "44px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => setActiveTab("host")}
            />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.6rem", fontStyle: "italic", fontWeight: 400, color: "rgba(200,210,230,0.75)", letterSpacing: "0.1em", marginTop: "2px", whiteSpace: "nowrap" }}>CreateAiProfit</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: activeTab === tab.id ? "#94A3AA" : "rgba(255,255,255,0.5)",
                  borderBottom: activeTab === tab.id ? "1px solid #94A3AA" : "1px solid transparent",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Admin toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isAdmin && (
              <div style={{
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#94A3AA", padding: "0.25rem 0.6rem",
                border: "1px solid rgba(201,168,76,0.4)",
              }}>
                ADMIN
              </div>
            )}
            <button
              onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.4)", cursor: "pointer",
                padding: "0.35rem 0.75rem",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {isAdmin ? "Exit Admin" : "Admin"}
            </button>
          </div>
        </div>
      </nav>



      {/* ── ADMIN LOGIN MODAL ── */}
      {showAdminLogin && (
        <div
          onClick={() => setShowAdminLogin(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0a0a0a", border: "1px solid rgba(201,168,76,0.3)",
              padding: "2.5rem", maxWidth: "360px", width: "100%",
            }}
          >
            <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{ height: "40px", width: "40px", objectFit: "contain", margin: "0 auto 1.5rem", display: "block" }} />
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: "1.5rem" }}>
              Admin Access
            </div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPass}
              onChange={e => { setAdminPass(e.target.value); setAdminError(false); }}
              onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              style={{
                width: "100%", padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.04)", border: adminError ? "1px solid rgba(220,50,50,0.6)" : "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff", fontFamily: "'Lato', sans-serif", fontSize: "0.9rem",
                outline: "none", boxSizing: "border-box", marginBottom: "0.5rem",
              }}
            />
            {adminError && (
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "rgba(220,80,80,0.8)", marginBottom: "0.75rem" }}>
                Incorrect password.
              </div>
            )}
            <button
              onClick={handleAdminLogin}
              style={{
                width: "100%", padding: "0.85rem",
                background: "#94A3AA", color: "#000000",
                border: "none", cursor: "pointer",
                fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                marginTop: "0.5rem",
              }}
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {/* ── ADMIN BANNER ── */}
      {isAdmin && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 190,
          background: "rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.3)",
          padding: "0.5rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#94A3AA" }}>
            Admin View — You are seeing the site as an administrator
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/admin" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", textDecoration: "none" }}>Dashboard →</a>
            <a href="/admin/scheduler" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", textDecoration: "none" }}>Scheduler →</a>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div style={{ paddingTop: isAdmin ? "148px" : "96px" }}>

                {/* ════ HOME TAB ════ */}
        {activeTab === "home" && (
          <section style={{ minHeight: "calc(100vh - 64px)", background: "#000", position: "relative", overflow: "hidden" }}>

            {/* Background radial glow */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 1.5rem 4rem", textAlign: "center", position: "relative", zIndex: 1 }}>
              {/* CAP Logo */}
              <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "1.75rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
              {/* Eyebrow */}
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>Welcome to CreateAIProfit</div>
              {/* Mission Headline — small label + big answer */}
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", fontWeight: 400, fontStyle: "italic", color: "rgba(200,215,240,0.85)", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>&#8220;The Mission...&#8221;</div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1.5rem", maxWidth: "900px" }}>
                Free <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>21 Million Men</em> From The Cage.
              </h1>
              {/* Subheadline */}
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.01em", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
                AI-powered income systems. 21 multilingual hosts. One mission — build wealth outside the 9-to-5 cage.
              </p>
              {/* Stats row */}
              <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
                {[{ num: "21", label: "AI Hosts" }, { num: "21M", label: "The Mission" }, { num: "21", label: "Episodes" }, { num: "1%", label: "Playground" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", fontWeight: 400, color: "rgba(200,215,235,0.75)", letterSpacing: "0.12em" }}>{s.num}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
                <button onClick={() => setActiveTab("host")} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", background: "rgba(220,225,235,0.95)", color: "#000", border: "none", padding: "0.9rem 2.5rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}>Meet The Hosts</button>
                <button onClick={() => setActiveTab("series")} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.9rem 2.5rem", fontWeight: 400, cursor: "pointer", transition: "all 0.2s" }}>Watch The Series</button>
                <button onClick={() => setActiveTab("download")} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", padding: "0.9rem 2.5rem", fontWeight: 400, cursor: "pointer", transition: "all 0.2s" }}>Download The App</button>
              </div>
              {/* Divider */}
              <div style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, transparent, rgba(200,215,240,0.35), transparent)", margin: "0 auto 3rem" }} />

              {/* ── AVATAR ROW: Elon · Closer · Analyst · Senator · Architect · ARIA (center) · Tadow · Trump ── */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "3rem" }}>
                {/* Left side: Elon, White Suit, Blue Glasses, Navy Suit, Dark Frames */}
                {[
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_elon_doge_94782109.png", name: "Elon M.", role: "Doge · First Principles" },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_white_suit_a2b85830.jpg", name: "Jeff B.", role: "Space · Day One" },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_blue_glasses_555bc39f.jpg", name: "Sundar P.", role: "Blue Frames · Data Boss" },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_navy_suit_0f2e5762.jpg", name: "Peter T.", role: "Navy Stripe · Power Move" },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_gates_glasses_fc426d50.jpg", name: "Bill G.", role: "Dark Frames · Blueprint" },
                ].map(av => (
                  <div key={av.name} style={{ textAlign: "center", flex: "0 0 auto" }}>
                    <div style={{ width: "80px", height: "100px", overflow: "hidden", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.4rem" }}>
                      <img src={av.img} alt={av.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", color: "rgba(255,255,255,0.7)", marginBottom: "0.15rem" }}>{av.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{av.role}</div>
                  </div>
                ))}

                {/* ARIA RABBIT — dead center, larger */}
                <div style={{ textAlign: "center", flex: "0 0 auto" }}>
                  <div style={{ width: "130px", height: "170px", overflow: "hidden", borderRadius: "6px", border: "1px solid rgba(200,160,60,0.4)", marginBottom: "0.5rem", boxShadow: "0 0 20px rgba(200,160,60,0.15)" }}>
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_rabbit_chair_6056748f.jpg" alt="Aria Rabbit" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(200,160,60,0.9)", marginBottom: "0.2rem" }}>Aria Rabbit</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,160,60,0.5)" }}>CFO · Daily Ops Director</div>
                </div>

                {/* Right side: Tadow, Trump */}
                {[
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_lakers_bw_601e75da.jpg", name: "Tadow L.", role: "Lakers #8 · Court Vision" },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baby_trump_red_tie_7d82f99e.png", name: "The Negotiator", role: "Red Tie · Art of the Deal" },
                ].map(av => (
                  <div key={av.name} style={{ textAlign: "center", flex: "0 0 auto" }}>
                    <div style={{ width: "80px", height: "100px", overflow: "hidden", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.4rem" }}>
                      <img src={av.img} alt={av.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", fontStyle: "italic", color: "rgba(255,255,255,0.7)", marginBottom: "0.15rem" }}>{av.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{av.role}</div>
                  </div>
                ))}
              </div>

              {/* Mission statement */}
              <div style={{ background: "rgba(200,210,230,0.03)", border: "1px solid rgba(200,210,230,0.15)", padding: "2.5rem 2rem", maxWidth: "700px", margin: "0 auto 3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(200,210,230,0.6)", marginBottom: "1rem" }}>The Mission</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: 0 }}>
                  "The cage is real. The 9-to-5 is a system designed to keep you dependent. We built 20 AI hosts, a multilingual content army, and a passive income blueprint to break 21 million men out of it — permanently."
                </p>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginTop: "1.25rem" }}>— CreateAIProfit</div>
              </div>
              {/* Feature grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem", textAlign: "left" }}>
                {[
                  { icon: "🤖", title: "21 AI Hosts", desc: "Multilingual baby avatars running income content 24/7 across every market." },
                  { icon: "📺", title: "21-Episode Series", desc: "The mini-series that teaches the system — real estate, AI, affiliate, and more." },
                  { icon: "🏦", title: "Passive Income", desc: "Airbnb arbitrage, real estate assignments, affiliate drops, and crypto commentary." },
                  { icon: "🌍", title: "Global Reach", desc: "English, Spanish, Russian, Arabic, Hindi, Mandarin, Italian, French, Romanian." },
                  { icon: "📱", title: "1% Playground App", desc: "The private social platform — invite only. Download and get positioned first." },
                  { icon: "🔐", title: "The Vault", desc: "Premium products, courses, and tools for members who are ready to move." },
                ].map(f => (
                  <div key={f.title} style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderTop: "1px solid rgba(200,210,230,0.12)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>{f.title}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
                {/* ════ HOST TAB ════ */}
        {activeTab === "host" && (
          <section style={{ minHeight: "calc(100vh - 64px)", padding: "1rem 1.5rem 5rem", background: "#000" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

              {/* ── HOST TAB HERO ── */}
              <div style={{ textAlign: "center", marginBottom: "3.5rem", position: "relative" }}>
                {/* Background radial glow — matches HOME */}
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* CAP Logo — matches HOME */}
                  <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
                  {/* Eyebrow — matches HOME */}
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>The Company · 21 AI Hosts</div>
                  {/* Main headline — matches HOME scale */}
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1.5rem", maxWidth: "900px", margin: "0 auto 1.5rem" }}>Meet the future of <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>createaiprofit.</em></h2>
                  {/* Subheadline — matches HOME */}
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.01em", maxWidth: "560px", margin: "0 auto" }}>Multilingual baby avatars running passive income content 24/7 across every market on earth.</p>
              </div>
            </div>

              {/* ── 15 BABY AVATARS — STATIC GRID ── */}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)" }}>
                  The Company · 21 Hosts · Navy Pinstripe Armani · Rolex · Medallions · Cigars
                </div>
              </div>

              {/* ── 21 BABY AVATARS — VOICE GRID ── */}
              <HostVoiceGrid hosts={HOSTS} />

            </div>
          </section>
        )}

        {/* ════ STAFF TAB ════ */}
        {activeTab === "staff" && (
          <section style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem 5rem", background: "#000" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

              {/* ── STAFF TAB HERO ── */}
              <div style={{ textAlign: "center", marginBottom: "3.5rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>CreateAIProfit · The Team</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1.5rem", maxWidth: "900px", margin: "0 auto 1.5rem" }}>The <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Staff.</em></h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.01em", maxWidth: "560px", margin: "0 auto" }}>AI-powered staff teaching you how to build bots, assign tasks, and monetize. No gatekeeping. This is the 21st-century model.</p>
                </div>
              </div>

              {/* ── HEADER NOTE ── */}
              <div style={{
                padding: "1.25rem 2rem",
                marginBottom: "3.5rem",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "0.5rem" }}>
                  AI-Powered Staff
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: "680px", margin: "0 auto" }}>
                  These are AI-powered staff — teaching you how to build bots, assign tasks, and monetize. No gatekeeping. This is the 21st-century model.
                </p>
              </div>

              {/* ── ARIA RABBIT — CFO / DAILY OPS DIRECTOR ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  CFO · Daily Operations Director · Ultimate Host
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_staff_photo_1b19d4c1.jpg"
                  alt="Aria Rabbit"
                  style={{ height: "320px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1rem" }}
                />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: "0.3rem" }}>Aria Rabbit</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>Welcome to the playground, millionaire.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                  Runs daily operations, manages the 1% Playground app, oversees all 15 bot hosts, and controls the financial dashboard. She doesn’t close deals — she runs the system that closes them.
                </div>
              </div>

              {/* ── DIVIDER ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)", whiteSpace: "nowrap" }}>
                  The 20 Baby Bots · AI Hosts
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* ── 15 BABY BOTS GRID ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
                {HOSTS.map((h) => {
                  const bioMap: Record<string, string> = {"strategist": "Master planner. Maps the 10-million-man mission, positions the brand, and runs the long-game content strategy.", "operator": "Leverage specialist. Manages AI income streams, automates the content pipeline, and runs the backend while you sleep.", "ghost": "Silent operator. Posts cold-system content in Russian, drives Eastern European traffic, and never shows his hand.", "architect": "System builder. Designs the income frameworks, maps the passive streams, and teaches the machine-first mindset.", "consigliere": "White-glove operator. Handles VIP onboarding, luxury affiliate placements, and the Club Vault high-ticket product line.", "don": "Real estate closer. Assigns deals, finds $40k fees, and drops Italian-accented Machiavelli content that converts.", "builder": "Ground-up operator. Builds the Airbnb arbitrage units, runs the sublease model, and posts Spanish-language income content.", "phantom": "Three moves ahead. Runs the Eastern European content arm, posts Romanian-language crypto and real estate content.", "transporter": "British precision operator. Black belt discipline. Moves assets — real estate, crypto, income streams — across borders without a trace.", "tactician": "Mumbai chess master. AI tech developer by day, Sun Tzu war strategist by night. Builds the AI automation stack with surgical precision.", "sheikh": "International syndicate lead. Runs the Gulf real estate desk, manages the Dubai Airbnb luxury portfolio, and posts Arabic-language content.", "visionary": "Billion-market operator. Posts Hindi-language passive income content targeting South Asian audiences. AI profit has no borders.", "director": "Content commander. Scripts the mini-series, directs the avatar video content, and runs the media production arm.", "broker": "Wall Street closer. Runs affiliate drops, crypto commentary, and high-ticket referral funnels. Every post is a pitch.", "king": "Atlanta-built empire. Runs the real estate assignment desk, drops cold-call scripts, and leads the domestic closer network.", "closer": "Deal machine. Closes real estate assignments, runs the cold-call funnel, and posts high-energy closer content 24/7.", "aria": "Runs daily operations, manages the 1% Playground app, oversees all 15 bot hosts, and controls the financial dashboard.", "prince": "Old money operator. Runs the international syndicate, structures generational wealth plays, and positions the brand in European markets.", "dubai_chic": "Dubai division head. Runs the Airbnb luxury unit portfolio, manages high-net-worth affiliate drops, and posts in Hindi and Arabic.", "chinese_closer": "Shanghai precision operator. Runs the Asian market affiliate arm, posts Mandarin-language luxury content, and closes high-ticket deals.", "caucasian_girl": "European connections operator. Manages VIP introductions, luxury Airbnb placements in Monaco and Milan, and the white-glove onboarding flow.", "visionary_mx": "Mexican-American operator. Posts Spanish-English bilingual passive income content targeting Latino audiences across the US and Latin America. The American dream, automated.", "boss": "The BOSS. Michael Corleone energy — calculated, strategic, inevitable. Runs the inner circle, controls the board, and never makes a move without purpose. Power is not given. It is taken."};
                  return (
                  <div key={h.id} style={{ textAlign: "center" }}>
                    <img
                      src={h.img}
                      alt={h.title}
                      style={{ width: "100%", height: "260px", objectFit: "contain", objectPosition: "center", display: "block", marginBottom: "1rem" }}
                    />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>{h.title}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)", marginBottom: "0.25rem" }}>{h.origin}</div>
                    {(h as any).voiceType && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: "0.5rem" }}>🎙 {(h as any).voiceType}</div>}
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{bioMap[h.id] || h.pitch}</div>
                  </div>
                  );
                })}
              </div>

              {/* ── DIVIDER ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)", whiteSpace: "nowrap" }}>
                   Real Estate · International Syndicate · Airbnb Division
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* ── LA REINA — Real Estate Director ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  Real Estate Director · NYC Division · Airbnb Portfolio
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_reina_v2_bcd1d0f1.webp"
                  alt="La Reina"
                  style={{ height: "400px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1.5rem" }}
                />
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>LA REINA</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>The city is the portfolio.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                  Heads the NYC real estate division. Manages the short-term rental portfolio, sources Airbnb arbitrage deals, and oversees luxury property assignments across the five boroughs. She doesn't list properties — she controls them.
                </div>
              </div>

              {/* ── THE FOX — Vegas Real Estate ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  Real Estate Closer · Las Vegas Division · Short-Term Rentals
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_fox_blonde_v2_87650448.webp"
                  alt="The Fox"
                  style={{ height: "400px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1.5rem" }}
                />
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>THE FOX</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>Vegas never sleeps. Neither does the portfolio.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                  Runs the Las Vegas real estate desk. Closes short-term rental assignments on the Strip, manages the Airbnb luxury unit portfolio, and sources high-yield arbitrage deals across Nevada. She doesn't negotiate — she sets the terms.
                </div>
              </div>

              {/* ── DIRECTOR OF MARKETING ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  Director of Marketing · Los Angeles · CAP Brand
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc3_70429952.jpg"
                  alt="Director of Marketing"
                  style={{ height: "420px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1.5rem" }}
                />
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>THE DIRECTOR</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>The brand speaks before she does.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                  Leads all marketing operations for CreateAIProfit. Manages brand identity, campaign strategy, influencer partnerships, and the CAP product line rollout from the Hollywood Hills.
                </div>
              </div>

              {/* ── THE ITALIAN — Real Estate ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  Real Estate Closer · Milan Division · Luxury Rentals
                </div>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_american_italian_girl_fd2ab8b6.webp"
                  alt="The Italian"
                  style={{ height: "400px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1.5rem" }}
                />
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>THE ITALIAN</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>Milan is the address. The portfolio is global.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                  Manages the European luxury rental desk. Sources high-yield Airbnb assignments in Milan, Monaco, and the Amalfi Coast. She places properties — and closes before anyone else gets the listing.
                </div>
              </div>

              {/* ── DIVIDER ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)", whiteSpace: "nowrap" }}>
                  Wellness Division · Health &amp; Lifestyle
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* ── WELLNESS STAFF GRID ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
                {[
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_female_labcoat_450a4196.webp", name: "DR. NOVA", role: "Wellness Director · Female", bio: "Heads the health and wellness division. Guides members through biohacking, longevity protocols, and high-performance lifestyle systems." },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_female_robe_a7ba94ec.webp", name: "DR. SERENE", role: "Recovery & Mindset · Female", bio: "Specializes in recovery, sleep optimization, and mental performance. She runs the mindset protocols for the 1% Playground members." },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_female_silk_6c1defd0.webp", name: "DR. LUXE", role: "Lifestyle & Nutrition · Female", bio: "Manages the luxury lifestyle and nutrition arm. Curates high-performance nutrition plans and wellness routines for elite members." },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_male_labcoat_c096acbf.webp", name: "DR. APEX", role: "Performance Director · Male", bio: "Leads the male performance division. Builds strength, endurance, and cognitive optimization protocols for high-output members." },
                  { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/wellness_male_robe_597261b7.webp", name: "DR. CALM", role: "Recovery & Longevity · Male", bio: "Focuses on recovery science, longevity, and stress management. Runs the men's recovery and anti-aging protocol arm." },
                ].map(w => (
                  <div key={w.name} style={{ textAlign: "center" }}>
                    <img
                      src={w.img}
                      alt={w.name}
                      style={{ width: "100%", height: "280px", objectFit: "contain", objectPosition: "top", display: "block", marginBottom: "1rem" }}
                    />
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>{w.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,170,0.45)", marginBottom: "0.6rem" }}>{w.role}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{w.bio}</div>
                  </div>
                ))}
              </div>

              {/* ── DIVIDER ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.4)", whiteSpace: "nowrap" }}>
                  Founder &amp; Owner
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* ── THE PRINCE — FOUNDER ── */}
              <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(148,163,170,0.5)", marginBottom: "1rem" }}>
                  Founder · Owner · CreateAIProfit
                </div>
                <img
                  src={PRINCE_IMAGES[princeIdx]}
                  alt="The Prince"
                  style={{ height: "420px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto 1.5rem", transition: "opacity 0.6s ease" }}
                />
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>THE PRINCE</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>The system was built. Now it runs.</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(148,163,170,0.6)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
                  Mexican-American entrepreneur and founder of CreateAIProfit. Built the 21-bot syndicate, the 1% Playground platform, and the passive income ecosystem from the ground up. He doesn't pitch — he built the machine that pitches for him.
                </div>
              </div>

            </div>
          </section>
        )}
         {/* ════ MINI SERIES TAB ════ */}
        {activeTab === "series" && (
          <section style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "relative", overflow: "hidden",
            padding: "0",
          }}>
            {/* Chess telekinesis video background — 25% opacity, silent loop */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                opacity: 0.25,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <source src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/checkmate_trailer_chess_5903b558.mp4" type="video/mp4" />
            </video>
            {/* Noise texture */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              pointerEvents: "none", zIndex: 1,
            }} />



            {/* ── HYPE HERO ── */}
            <div style={{
              position: "relative", zIndex: 2,
              textAlign: "center",
              padding: "5rem 2rem 3rem",
              maxWidth: "700px",
              width: "100%",
            }}>
              {/* CAP Logo — matches HOME */}
              <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />

              {/* Eyebrow */}
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "rgba(200,210,230,0.5)",
                marginBottom: "1rem",
              }}>
                CreateAIProfit · Original Series
              </div>

              {/* Main title — glitch, HOME scale */}
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.05em",
                lineHeight: 1.1,
                marginBottom: "0.5rem",
                filter: seriesGlitch ? "blur(0.8px) brightness(1.4)" : "none",
                transition: "filter 0.05s",
                textShadow: seriesGlitch ? "2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5)" : "none",
              }}>
                <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Checkmate.</em>
              </h2>
              {/* #checkmate subtitle */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.8rem",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.22)",
                marginBottom: "1rem",
              }}>
                #checkmate
              </div>



              {/* Vertical divider */}
              <div style={{
                width: "1px", height: "55px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)",
                margin: "0 auto 3rem",
              }} />

              {/* COMING SOON badge */}
              <div style={{
                display: "inline-block",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "0.7rem 2.5rem",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "3rem",
                background: "rgba(255,255,255,0.015)",
              }}>
                Coming Soon
              </div>

              {/* Email capture */}
              {!seriesSubmitted ? (
                <form
                  onSubmit={e => { e.preventDefault(); if (seriesEmail.trim()) setSeriesSubmitted(true); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
                >
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    marginBottom: "0.25rem",
                  }}>
                    Get notified first
                  </div>
                  <div style={{ display: "flex", width: "100%", maxWidth: "360px" }}>
                    <input
                      type="email"
                      value={seriesEmail}
                      onChange={e => setSeriesEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRight: "none",
                        color: "#ffffff",
                        padding: "0.75rem 1rem",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: "0.85rem",
                        outline: "none",
                        letterSpacing: "0.05em",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "#ffffff",
                        color: "#000000",
                        border: "none",
                        padding: "0.75rem 1.25rem",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Notify Me
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "1rem 2rem",
                  display: "inline-block",
                }}>
                  ✓ &nbsp; You're on the list
                </div>
              )}
            </div>

            {/* ── EPISODE LIST ── */}
            <div style={{
              position: "relative", zIndex: 1,
              width: "100%", maxWidth: "640px",
              padding: "0 2rem 5rem",
            }}>
              {/* Thin gold divider */}
              <div style={{
                width: "100%", height: "1px",
                background: "rgba(201,168,76,0.08)",
                marginBottom: "2rem",
              }} />

              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}>
                21 Episodes · All Locked
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {EPISODES.map((ep) => (
                  <div
                    key={ep.ep}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.85rem 1rem",
                      background: ep.isFinale ? "rgba(201,168,76,0.03)" : "transparent",
                      borderLeft: ep.isFinale ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Lock icon */}
                    <div style={{
                      width: "28px", height: "28px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.8rem",
                      color: ep.isFinale ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.18)",
                    }}>
                      🔒
                    </div>

                    {/* Episode number */}
                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.2em",
                      color: ep.isFinale ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.2)",
                      minWidth: "60px",
                    }}>
                      EP {String(ep.ep).padStart(2, "0")}{ep.isFinale ? " · FINALE" : ""}
                    </div>

                    {/* Title */}
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.95rem",
                      color: ep.isFinale ? "rgba(201,168,76,0.7)" : "rgba(255,255,255,0.45)",
                      flex: 1,
                    }}>
                      {ep.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Download CTA */}
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <button
                  onClick={() => setActiveTab("download")}
                  style={{
                    padding: "0.9rem 2.5rem",
                    background: "transparent",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem",
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,168,76,0.7)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
                >
                  Download App to Watch
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ════ CAST TAB ════ */}
        {activeTab === "cast" && (
          <section style={{
            minHeight: "calc(100vh - 64px)",
            background: "#000000",
            padding: "4rem 1.5rem 6rem",
            position: "relative", overflow: "hidden",
          }}>
            {/* Noise texture */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              {/* Eyebrow */}
              <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>CreateAIProfit · Original Series</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1rem", maxWidth: "900px", margin: "0 auto 1rem" }}>"The Prince Revealed"</h2>
                </div>
              </div>

              {/* STARS */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  ★   Stars
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { name: "Aria Rabbit", role: "The Seductress", note: "She opens every door.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/aria_rabbit_redhead_2767_d1b4c3a2.jpg" },
                    { name: "Tadow", role: "The Architect", note: "The man behind the system.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_baller_lakers_886f760e.jpg" },
                    { name: "Ja Morant", role: "The Point Guard", note: "Memphis grinds. Money follows.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_ja_morant_baby_9ce605df.jpg" },
                    { name: "Mark Z.", role: "The Connector", note: "He built the network. Now the network builds wealth.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_zuckerberg_baby_be9979d8.jpg" },
                    { name: "S.P.", role: "The Algorithm", note: "He sees the search before you type it.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_sundar_pichai_baby_5ca95ad9.jpg" },
                    { name: "B.M.", role: "The Showman", note: "Every stage is a boardroom.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_bruno_mars_baby_e16f64fe.jpg" },
                    { name: "B.G.", role: "The Philanthropist", note: "The richest man gives it away.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_bill_gates_baby_bd95d5bc.jpg" },
                    { name: "E.M.", role: "The Operator", note: "Mars isn't far enough.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_elon_musk_baby_2ff922da.jpg" },
                    { name: "P.T.", role: "The Contrarian", note: "Competition is for losers.", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_peter_thiel_baby_26ef48b0.jpg" },
                    { name: "K.B.", role: "The Legend", note: "Mamba mentality meets AI.", img: null },
                    { name: "Jeff B.", role: "The Disruptor", note: "He bought the future first.", img: null },
                    { name: "D.T.", role: "The Dealmaker", note: "Every room is a negotiation.", img: null },
                    { name: "Bill G. II", role: "The Strategist", note: "Philanthropy is the long game.", img: null },
                    { name: "S.A.", role: "The Visionary", note: "He saw the AI wave coming.", img: null },
                    { name: "Steve J.", role: "The Ghost", note: "Think different. Always.", img: null },
                    { name: "V.", role: "The Painter", note: "Every masterpiece has a price.", img: null },
                  ].map((star) => (
                    <div key={star.name} style={{
                      background: "rgba(201,168,76,0.03)",
                      border: "1px solid rgba(201,168,76,0.15)",
                      padding: "1.25rem 1rem",
                      textAlign: "center",
                      transition: "border-color 0.3s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.45)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"}
                    >
                      {star.img ? (
                        <img src={star.img} alt={star.name} style={{
                          width: "72px", height: "88px", objectFit: "cover", objectPosition: "top",
                          borderRadius: "2px",
                          border: "1px solid rgba(201,168,76,0.25)",
                          display: "block", margin: "0 auto 0.75rem",
                        }} />
                      ) : (
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 0.75rem",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.1rem", color: "rgba(201,168,76,0.7)",
                      }}>
                        {star.name.charAt(0)}
                      </div>
                      )}
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>
                        {star.name}
                      </div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "0.5rem" }}>
                        {star.role}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
                        {star.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUPPORTING CAST */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Supporting Cast
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
                  {HOSTS.map(h => (
                    <div key={h.id} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.5rem 1rem",
                    }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(148,163,170,0.15)", border: "1px solid rgba(148,163,170,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.5rem", fontWeight: 700, color: "#94A3AA", flexShrink: 0 }}>
                        {h.title.replace("The ", "").slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{h.title}</div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{h.origin}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trailer + Binge CTA */}
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>
                  21 Episodes · Dropping Now
                </div>
                <button
                  onClick={() => setActiveTab("series")}
                  style={{
                    padding: "1rem 3rem",
                    background: "rgba(201,168,76,0.1)",
                    color: "rgba(201,168,76,0.9)",
                    border: "1px solid rgba(201,168,76,0.4)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                    letterSpacing: "0.35em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.1)"; }}
                >
                  ▶   Watch Trailer · Binge All 21
                </button>
                <button
                  onClick={() => setActiveTab("download")}
                  style={{
                    padding: "0.75rem 2.5rem",
                    background: "transparent",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  Download 1% Playground App
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ════ SOCIAL VAULT TAB ════ */}
        {activeTab === "social-vault" && (
          <section style={{ minHeight: "calc(100vh - 64px)", background: "#000000", padding: "4rem 1.5rem 6rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>CreateAIProfit · Social Vault</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1rem", maxWidth: "900px", margin: "0 auto 1rem" }}>The Social <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Vault.</em></h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.01em", maxWidth: "560px", margin: "0 auto" }}>Manual approve → post → log. Every clip directs to app download.</p>
                </div>
              </div>

              {/* Video Format */}
              <div style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.1)", padding: "2rem", marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Video Script Format · No 41-Second Base Junk
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
                  {[
                    { step: "01", label: "Intro (Accent Matched)", desc: "I’m The Don. [Italian accent] Love the bling? Ice? Drip? We got it all — DM for discount." },
                    { step: "02", label: "Machiavelli Quote", desc: "Raw quote in character. Pause. Modern spin — crypto, real estate, AI income." },
                    { step: "03", label: "Market Application", desc: "How Machiavelli games today’s market. BTC position, Airbnb assignment, AI tool flip." },
                    { step: "04", label: "15-20 Sec Promo Close", desc: "Mindset clip, affiliate drop, mini-series outtake, or app tease. Ends: Download 1% Playground." },
                  ].map(s => (
                    <div key={s.step}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "rgba(201,168,76,0.2)", marginBottom: "0.25rem" }}>{s.step}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", marginBottom: "0.4rem" }}>{s.label}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Post Log */}
              <SocialVaultPostLog />

              {/* Platforms */}
              <div style={{ marginBottom: "3rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(148,163,170,0.6)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Distributing To
                </div>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook"].map(p => (
                    <div key={p} style={{ padding: "0.6rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{p}</div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <div style={{ textAlign: "center" }}>
                <button onClick={() => setActiveTab("download")} style={{ padding: "1rem 3rem", background: "rgba(201,168,76,0.1)", color: "rgba(201,168,76,0.9)", border: "1px solid rgba(201,168,76,0.4)", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.35em", textTransform: "uppercase", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.1)"; }}
                >
                  Download 1% Playground Now
                </button>
              </div>
            </div>
          </section>
        )}
                {/* ════ VAULT TAB ════ */}
        {activeTab === "vault" && (
          <section style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.75rem" }}>
                  CreateAIProfit · The Vault
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", letterSpacing: "0.01em", marginBottom: "0.75rem", lineHeight: 1.1 }}>
                  The Golden <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Vault.</em>
                </h2>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: "480px", margin: "0 auto" }}>
                  Curated luxury. Every product hand-selected by our hosts. Direct to your door.
                </p>
              </div>

              {/* Category filter */}
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap" }}>
                {VAULT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setVaultCategory(cat.id)}
                    style={{
                      padding: "0.5rem 1.25rem",
                      background: vaultCategory === cat.id ? "#94A3AA" : "transparent",
                      color: vaultCategory === cat.id ? "#000000" : "rgba(255,255,255,0.5)",
                      border: vaultCategory === cat.id ? "1px solid #94A3AA" : "1px solid rgba(255,255,255,0.12)",
                      cursor: "pointer",
                      fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      transition: "all 0.2s",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Product grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1px",
                background: "rgba(255,255,255,0.05)",
              }}>
                {/* ── CONFIDENCE COLOGNE — COMING SOON FEATURED PRODUCT ── */}
                <div style={{
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.35)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  gridColumn: "1 / -1",
                  marginBottom: "1px",
                }}>
                  <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#94A3AA", color: "#000", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", padding: "0.25rem 1.25rem", fontWeight: 700, whiteSpace: "nowrap" }}>CAP Exclusive · Coming Soon</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", paddingTop: "1rem", maxWidth: "600px", textAlign: "center" }}>
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/confidence_cologne-K4fKhGR4jJ6dvsT5iqjnYh_d0076d42.webp"
                      alt="Confidence Cologne by CAP"
                      style={{ width: "min(260px, 70vw)", height: "auto", filter: "drop-shadow(0 0 30px rgba(201,168,76,0.25))" }}
                    />
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "0.5rem" }}>CreateAIProfit · Signature Fragrance</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Confidence <em style={{ color: "rgba(201,168,76,0.9)" }}>Cologne</em></div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "1rem" }}>2oz · CAP Monogram · Limited Edition</div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto 1.25rem" }}>The scent of the 1%. Crafted for the man who moves in silence and earns in volume. Dropping exclusively through the 1% Playground app.</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(201,168,76,0.3)", padding: "0.6rem 1.5rem", background: "rgba(201,168,76,0.06)" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(201,168,76,0.6)" }} />
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)" }}>Download App to Be First</span>
                      </div>
                    </div>
                  </div>
                </div>

                {filteredProducts.map(product => {
                  const host = HOSTS.find(h => h.id === product.hostId) || HOSTS[0];
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        background: "#000000", padding: "1.5rem",
                        cursor: "pointer", transition: "background 0.2s",
                        position: "relative",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(201,168,76,0.04)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#000000"}
                    >
                      {product.badge && (
                        <div style={{
                          position: "absolute", top: "1rem", right: "1rem",
                          background: "rgba(201,168,76,0.15)", color: "#94A3AA",
                          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                          letterSpacing: "0.2em", textTransform: "uppercase",
                          padding: "0.2rem 0.5rem", border: "1px solid rgba(201,168,76,0.3)",
                        }}>
                          {product.badge}
                        </div>
                      )}

                      {/* Host micro-avatar */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <img src={host.img} alt={host.title} style={{ width: "28px", height: "44px", objectFit: "contain", objectPosition: "center" }} />
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                          {host.title}
                        </div>
                      </div>

                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "0.4rem" }}>
                        {product.brand}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#ffffff", marginBottom: "0.4rem" }}>
                        {product.name}
                      </div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: "1rem" }}>
                        {product.desc}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#94A3AA" }}>
                          {product.price}
                        </div>
                        <div style={{
                          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                          letterSpacing: "0.2em", textTransform: "uppercase",
                          color: "rgba(255,255,255,0.3)", padding: "0.3rem 0.75rem",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}>
                          View →
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ════ LIVE FEED TAB ════ */}
        {activeTab === "live-feed" && (
          <LiveFeedTab setActiveTab={setActiveTab} />
        )}

        {/* ════ DOWNLOAD APP TAB ════ */}
        {activeTab === "download" && (
          <section style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "4rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>The App · Download Now</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "2rem", maxWidth: "900px", margin: "0 auto 2rem" }}>1% <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Playground.</em></h2>
                </div>

                {/* CAP QR Phone Image */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_qr_1024_aa712cce.png"
                    alt="CAP App QR Code — Scan to Download"
                    style={{
                      width: "min(340px, 85vw)",
                      height: "auto",
                      display: "block",
                      filter: "drop-shadow(0 0 40px rgba(201,168,76,0.15))",
                    }}
                  />
                </div>

                <div style={{
                  display: "inline-block",
                  background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
                  padding: "0.5rem 1.5rem",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                  letterSpacing: "0.3em", textTransform: "uppercase",
                  color: "rgba(201,168,76,0.7)",
                }}>
                  Coming Soon
                </div>
              </div>

              {/* Pricing tiers */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>
                    Choose Your Level
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", letterSpacing: "0.01em", lineHeight: 1.1 }}>
                    Select a <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Plan.</em>
                  </h2>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1px",
                  background: "rgba(255,255,255,0.06)",
                }}>
                  {TIERS.map(tier => (
                    <div
                      key={tier.id}
                      style={{
                        background: tier.highlight ? "rgba(201,168,76,0.06)" : "#000000",
                        padding: "2.5rem 2rem",
                        position: "relative",
                        border: tier.highlight ? "1px solid rgba(201,168,76,0.35)" : "none",
                        margin: tier.highlight ? "-1px" : "0",
                      }}
                    >
                      {tier.badge && (
                        <div style={{
                          position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
                          background: "#94A3AA", color: "#000000",
                          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                          letterSpacing: "0.2em", textTransform: "uppercase",
                          padding: "0.25rem 1rem", fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}>
                          {tier.badge}
                        </div>
                      )}

                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: tier.highlight ? "#94A3AA" : "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
                        {tier.name}
                      </div>

                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 600, color: "#ffffff", lineHeight: 1 }}>
                          {tier.price}
                        </span>
                        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                          {tier.period}
                        </span>
                      </div>

                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
                        {tier.tagline}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
                        {tier.features.map((f, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                            <span style={{ color: "#94A3AA", fontSize: "0.7rem", marginTop: "0.15rem", flexShrink: 0 }}>✦</span>
                            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{f}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")}
                        style={{
                          width: "100%", padding: "0.9rem",
                          background: tier.highlight ? "#94A3AA" : "transparent",
                          color: tier.highlight ? "#000000" : "rgba(255,255,255,0.6)",
                          border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.2)",
                          cursor: "pointer",
                          fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                          letterSpacing: "0.25em", textTransform: "uppercase",
                          fontWeight: tier.highlight ? 700 : 400,
                          transition: "all 0.2s",
                        }}
                      >
                        {tier.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
                  All plans require app download. Pricing subject to change. Cancel anytime.
                </p>
              </div>
            </div>
           </section>
        )}
        {/* ════ COMING SOON TAB ════ */}
        {activeTab === "coming-soon" && (
          <section style={{ minHeight: "calc(100vh - 64px)", padding: "3rem 1.5rem 5rem", background: "#000" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "3.5rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-3rem", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,215,240,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <img src={CAP_LOGO} alt="CAP" style={{ height: "72px", width: "72px", objectFit: "contain", marginBottom: "0.5rem", filter: "drop-shadow(0 0 24px rgba(200,215,240,0.35))" }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,210,230,0.5)", marginBottom: "1rem" }}>What’s Next · Products · Events</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, fontStyle: "italic", color: "#ffffff", lineHeight: 1.1, letterSpacing: "0.01em", marginBottom: "1rem", maxWidth: "900px", margin: "0 auto 1rem" }}>Coming <em style={{ fontStyle: "italic", color: "rgba(210,225,255,1)" }}>Soon.</em></h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.01em", maxWidth: "560px", margin: "0 auto" }}>New products, live events, and exclusive drops — all unlocking soon for the 1% Playground.</p>
                </div>
              </div>
              {/* Products Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
                {[
                  { tag: "Product", title: "AI Income Blueprint", desc: "The complete step-by-step system for building passive income with AI tools, affiliate drops, and real estate assignments.", eta: "Q2 2026", locked: true },
                  { tag: "Product", title: "1% Playground App", desc: "The private TikTok-style social platform. Invite only. Earn while you engage. Download link drops soon.", eta: "Q2 2026", locked: true },
                  { tag: "Course", title: "Airbnb Arbitrage Masterclass", desc: "No ownership required. Learn the sublease model, unit setup, and how to scale to 10 units in 90 days.", eta: "Q3 2026", locked: true },
                  { tag: "Event", title: "CAP Live — Atlanta", desc: "The first live event. 21 million man mission kickoff. Networking, panels, and the vault product launch.", eta: "Q3 2026", locked: true },
                  { tag: "Product", title: "Affiliate Drop Kit", desc: "Pre-built affiliate funnels, product scripts, and content templates for every CAP host niche.", eta: "Q4 2026", locked: true },
                  { tag: "Event", title: "Dubai Syndicate Summit", desc: "International real estate and AI income summit hosted by The Sheikh and The Prince.", eta: "Q4 2026", locked: true },
                ].map(p => (
                  <div key={p.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", background: "rgba(201,168,76,0.08)", padding: "0.25rem 0.6rem" }}>{p.tag}</span>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{p.eta}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.03em", marginBottom: "0.75rem" }}>{p.title}</h3>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{p.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(201,168,76,0.3)", border: "1px solid rgba(201,168,76,0.5)" }} />
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)" }}>Locked · Notify Me</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Notify CTA */}
              <div style={{ textAlign: "center", padding: "3rem 2rem", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1rem" }}>Get Early Access</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, fontStyle: "italic", color: "#ffffff", marginBottom: "0.75rem" }}>Be First. Get Positioned.</h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}>Download the app to get notified when products and events drop.</p>
                <button onClick={() => setActiveTab("download")} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase", background: "rgba(220,225,235,0.95)", color: "#000", border: "none", padding: "0.9rem 2.5rem", fontWeight: 700, cursor: "pointer" }}>Download The App</button>
              </div>
            </div>
          </section>
        )}
      </div>
      {/* ── VAULT FUNNEL MODAL ── */}
      {selectedProduct && (
        <FunnelModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
      }}>
        <img src={CAP_LOGO} alt="Create AI Profit — CAP Logo" style={{ height: "32px", width: "32px", objectFit: "contain", marginBottom: "1.5rem", opacity: 0.5 }} />

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          © 2026 CreateAIProfit · All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
