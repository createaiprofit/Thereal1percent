# CreateAIProfit TODO

## Completed
- [x] Create bots data file with all staff bots (names, voices, groups)
- [x] Create bots data file with host bots (names, voices, groups)
- [x] Build War Room page with tabs
- [x] War Room > Real Estate Projects: add 10 sub-sections (view-only, admin only)
- [x] War Room > Web Content tab with bot cards and voice preview
- [x] War Room > Affiliate Team tab with Golden Vault products
- [x] Admin Settings > Real Estate Team: delete Sarah 1-5, add all staff bots with full access
- [x] Add voice preview button to each bot card (click to hear bio via ElevenLabs TTS)
- [x] Fix all TypeScript errors (0 errors remaining)
- [x] Create audioManager.ts library (speakText, playVoice, stopVoice, stopSpeech)
- [x] Install missing packages (@react-three/fiber, @react-three/drei, three, gsap, jspdf, @types/three)
- [x] Add all missing tRPC router stubs (social, live, wallet, profile, vault, botEngine)
- [x] Fix playVoice calls with wrong argument count
- [x] Fix ClubVault.tsx productId type mismatch
- [x] Fix LoginOnboarding.tsx saveConsent missing consented field
- [x] Install Twilio SDK and create twilioRouter
- [x] Wire Twilio credentials (Account SID, Auth Token, From Number +18775164259)
- [x] Replace Sarah 1-5 with real staff bots in ColdCallDashboard
- [x] Place live test call to 661-519-9067 (Sofia Alves — Amazon Polly voice)
- [x] Place live test call to 661-519-9067 (Lorenzo Prada / The Hammer — ElevenLabs voice)
- [x] Add DB tables: callLogs, warRoomAlerts, botPerformance, deals
- [x] Create warRoomRouter with calls.list, alerts.list, alerts.markRead, alerts.markAllRead, overview
- [x] Add Overview tab to War Room (system stats + recent calls)
- [x] Add Call Log tab to War Room (filterable by bot name, shows all Twilio calls)
- [x] Add Alerts tab to War Room (severity levels, mark read / mark all read)

## Pending — Next Session
- [ ] URGENT: Remove all celebrity baby bots (Elon, Jeff, Sundar, Peter, Bill, The Negotiator/Trump) from homepage avatar row — lawsuit risk
- [ ] URGENT: Remove celebrity baby bots from cast page supporting cast section
- [ ] Fix staff page — show only real adult staff, no baby bots grid
- [ ] Fix call system — phone not ringing
- [ ] Seed two test Twilio calls into DB so Call Log shows them immediately
- [ ] Wire host spot content queue (1 video/hour → 5 platform formats → queue → publish button)
- [ ] Fix content routing: host content → social platforms only, member content → internal feed only
- [ ] User onboarding message flow for new members
- [ ] Social media site (1% Playground) fixes
- [ ] Bot photos — upload when provided and wire to bot cards
- [ ] Domain transfer and publish to production
- [ ] YouTube API credentials for auto-upload
- [ ] ElevenLabs credentials for full bot voice on calls (replace Polly)
- [ ] New call script — load owner's real script into ColdCallDashboard

## Cinematic Onboarding Sequence (Login Page)
- [ ] Phone rumble + tornado siren countdown animation
- [ ] Calligraphic particle energy burst from phone
- [ ] Retina scan HUD overlay ("CONFIRM MATCH" Terminator-style)
- [ ] Portal open/close/open animation sequence
- [ ] Aria Rabbit emergence placeholder (animated video slot)
- [ ] Aria intro speech + turn + sit in chair
- [ ] Terms of service reading flow (onboarding agreement)
- [ ] User accepts terms → enters app

## Staff Bot Photos & Emails
- [ ] Upload all 14 staff bot photos when provided (labeled by name)
- [ ] Lock in final names for all bots (no more changes after tonight)
- [ ] Assign createaiprofit.com emails to all staff
- [ ] 8 new international hires: Moscow, Chinese, Singapore, Tokyo, Seoul, Brazil, Mexico, Paris
- [ ] Marco Rossi and Bartender photos

## Content Queue & Social Vault
- [ ] Verify Social Vault tab is visible and working on public site
- [ ] Wire host bot content to auto-populate queue (1 video/hour per bot)
- [ ] 5-platform format split (YouTube, TikTok, Instagram, Facebook, Twitter/X)
- [ ] Auto-send YouTube-formatted videos to YouTube API

## Mini Series (21 Episodes)
- [ ] Godfather/Goodfellas structure — Silicon Valley families as chess pieces
- [ ] Chess board sequence: episode 1 = "The Board Is Set", each episode = one chess move
- [ ] Pre-trailer concept (Game of Thrones style — something new each episode)
- [ ] Episode page shell with placeholder video slots
- [ ] Aria Rabbit as Snow White anchor character
- [ ] Baby cast bots as the seven dwarfs around her

## Current Session — April 3
- [x] Remove all celebrity baby bots from homepage avatar row (Elon, Jeff, Sundar, Peter, Bill, Trump, Ja Morant, Zuckerberg, Bruno Mars)
- [x] Remove celebrity bots from cast page — keep only Aria Rabbit and Tadow
- [x] Fix all female staff voices — no more male voices on female characters
- [x] Rename Italian Girl back to The Broker, assign Zara voice
- [x] Connect domain createaiprofit.com
- [ ] Fix Social Vault page — not loading correctly, should be member landing page
- [ ] Fix remaining bot voices for staff members missing voice IDs
- [ ] Remove any remaining baby bot images from front end
- [ ] Fix staff page display: real name first (e.g. "Marco Romano"), codename in quotes as subtitle (e.g. "The Hammer") — not the other way around
- [ ] Staff bots should introduce themselves by real name on calls: "Hi, this is Marco" not "Hi, I'm The Hammer"
