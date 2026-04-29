#!/usr/bin/env python3
"""
Replaces BLITZ_MACHIAVELLI_CAPTIONS, BLITZ_FLEX_CAPTIONS, and BLITZ_AFFILIATE_CAPTIONS
in botEngine.ts with the new Machiavelli-first format:
  Quote → Modern translation (what he'd do today) → [8-10 seconds] → Product/flex/affiliate launch
"""

with open('/home/ubuntu/createaiprofit/server/routers/botEngine.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = 'const BLITZ_MACHIAVELLI_CAPTIONS = ['
bot_marker = 'const BOT_CAPTIONS = ['

start_idx = content.find(start_marker)
bot_idx = content.find(bot_marker)
end_idx = content.rfind('];', start_idx, bot_idx) + 2  # include the ];

new_arrays = r"""// Every post: Machiavelli quote → modern translation → [8-10 seconds] → product/deal launch
// Format A: Teach/mindset — Machiavelli quote + what he'd do in today's market + deal/system CTA
const BLITZ_MACHIAVELLI_CAPTIONS = [
  "'It is better to be feared than loved, if you cannot be both.' — Machiavelli\n\nToday? He'd be cold-calling sellers at 7am. Dropping: 'Your property's on our list. Cash offer ready — no delays.' Not asking. Positioning.\n\n[8 seconds]\n\nI just closed a $340k assignment fee doing exactly that. No ownership. No mortgage. Just the contract.\n\nLink in bio — join the Club. 🔗 createaiprofit.com",

  "'Opportunities multiply as they are seized.' — Machiavelli\n\nToday? He'd be running AI-powered deal funnels, stacking leads while his competitors sleep. Every deal you don't close today? Someone else closes it tomorrow.\n\n[8 seconds]\n\nI seized mine at 6am this morning. Assignment contract signed. Fee collected. On to the next.\n\nFear wins deals. Hesitation loses money. 🔗 createaiprofit.com",

  "'The wise man does at once what the fool does finally.' — Machiavelli\n\nToday? He'd be the first one in the market, the first to call the seller, the first to assign the deal. Speed is the only advantage that compounds.\n\n[8 seconds]\n\nWhile you were thinking — I moved into the penthouse. Already collecting. Already free.\n\nPower's in action. Start today. 🔗 createaiprofit.com",

  "'Never attempt to win by force what can be won by deception.' — Machiavelli\n\nToday? He'd be running assignment contracts — controlling $2M properties without owning a single one. No capital. No mortgage. Just leverage.\n\n[8 seconds]\n\nThat's the play. You don't need the building. You need the contract.\n\nThe cage is comfortable — that's why most stay in it. Get out. 🔗 createaiprofit.com",

  "'Men judge generally more by the eye than by the hand.' — Machiavelli\n\nToday? He'd be building his personal brand before his portfolio. The Lambo isn't vanity — it's a signal. The penthouse isn't luxury — it's a filter. It attracts the right rooms.\n\n[8 seconds]\n\nBuild what people see. Then build what they don't. Both matter.\n\nJoin the Club. Link in bio. 🔗 createaiprofit.com",

  "'A prince never lacks legitimate reasons to break his promise.' — Machiavelli\n\nToday? He'd be the first to pivot when the market shifts. No loyalty to a dead strategy. Real estate slows? Airbnb arbitrage. Crypto dips? Assignment fees. Always moving.\n\n[8 seconds]\n\nThe smart money moves first. Close the deal. Collect the fee. Pivot. Repeat.\n\nLink in bio. 🔗 createaiprofit.com",

  "'Fortune favors the bold — but preparation makes boldness possible.' — Machiavelli\n\nToday? He'd be building systems for 3 years in silence, then moving loud. The passive income isn't luck. It's infrastructure. Built quietly. Collected loudly.\n\n[8 seconds]\n\n3 years of prep. The freedom? Real. The system? Teachable. The results? In my account.\n\nReal money. No cage. Bio link. 🔗 createaiprofit.com",

  "'The lion cannot protect himself from traps, and the fox cannot defend himself from wolves — one must be both.' — Machiavelli\n\nToday? He'd be cold-calling with the lion's aggression and structuring deals with the fox's precision. Not one or the other. Both.\n\n[8 seconds]\n\nCall the seller. Structure the contract. Assign the deal. Collect. That's the full play.\n\nLink in bio. The blueprint is inside. 🔗 createaiprofit.com",

  "'Power is not given — it is taken by those who understand the game.' — Machiavelli\n\nToday? He'd be building leverage before asking for anything. Leverage in deals. Leverage in contracts. Leverage in systems that run without him.\n\n[8 seconds]\n\nI built 7 income streams before I asked anyone for anything. Now I don't have to ask.\n\nJoin the Club. 🔗 createaiprofit.com",

  "'The ends justify the means.' — Machiavelli\n\nToday? He'd be focused on results only. Not the process. Not the optics. Not the critics. The number in the account. The deal closed. The freedom earned.\n\n[8 seconds]\n\nI don't explain my methods. I show my results. $18k passive last month. Zero apologies.\n\nLink in bio. 🔗 createaiprofit.com",
];

// Format B: Flex clip — Machiavelli quote + what he'd do today + penthouse/yacht/Lambo reveal
const BLITZ_FLEX_CAPTIONS = [
  "'It is better to be feared than loved.' — Machiavelli\n\nToday? He'd be walking penthouses he doesn't own, closing deals from the rooftop, feared by sellers and loved by buyers.\n\n[8 seconds]\n\nPenthouse. Laptop open. No alarm clock. 🌅\n\nThis isn't luck — it's a system. Real money. No cage. Bio link.\n\n🔗 createaiprofit.com",

  "'Opportunities multiply as they are seized.' — Machiavelli\n\nToday? He'd be on a yacht closing deals via satellite phone. Because when your income is passive, your office is wherever you dock.\n\n[8 seconds]\n\nYacht day. 🛥️ Third this month. All covered by passive income. Fear wins deals. Hesitation loses money.\n\n🔗 createaiprofit.com",

  "'The wise man does at once what the fool does finally.' — Machiavelli\n\nToday? He'd be behind the wheel of a Lambo at 9am — not because he's rich, but because he moved while everyone else was still thinking.\n\n[8 seconds]\n\nLambo keys in hand. 🏎️ Not a flex — a reminder. Time is the only real currency. Spend it right.\n\n🔗 createaiprofit.com",

  "'Men judge generally more by the eye than by the hand.' — Machiavelli\n\nToday? He'd be in Dubai for the third time this quarter — not on vacation, but operating. When income isn't tied to location, every city is a base.\n\n[8 seconds]\n\nDubai at sunset. 🌆 Third trip this quarter. All passive. You don't need more hours — you need better systems.\n\n🔗 createaiprofit.com",

  "'Fortune favors the bold.' — Machiavelli\n\nToday? He'd be in Monaco — not as a tourist, but as an operator. Bold enough to build the system. Smart enough to let it run.\n\n[8 seconds]\n\nMonaco. 🇲🇨 Not a vacation — a base of operations. Real money. No cage. Join the Club.\n\n🔗 createaiprofit.com",

  "'Time is the only currency that doesn't compound.' — Machiavelli's lesson\n\nToday? He'd have a Rolex on his wrist as a daily reminder: protect time above everything. Money compounds. Time doesn't.\n\n[8 seconds]\n\nRolex on the wrist. ⌚ Not a flex — a reminder. Stack the money. Protect the time.\n\n🔗 createaiprofit.com",

  "'Never attempt to win by force what can be won by deception.' — Machiavelli\n\nToday? He'd be walking $4M penthouses he doesn't own — controlling the deal without owning the asset. Assignment contracts. Maximum leverage.\n\n[8 seconds]\n\nWalking a $4.2M penthouse I don't own. 🏙️ Assignment contract. Cash offer ready. No delays.\n\n🔗 createaiprofit.com",

  "'A prince who is not himself wise cannot be well advised.' — Machiavelli\n\nToday? He'd be the sharpest person in every room — not the loudest. Private jet terminal, not because he's rich, but because he's free.\n\n[8 seconds]\n\nPrivate jet terminal. ✈️ Not because I'm rich — because I'm free. Build the system that buys freedom.\n\n🔗 createaiprofit.com",
];

// Format C: Affiliate — Machiavelli quote + what he'd do today + Airbnb passive income reveal
const BLITZ_AFFILIATE_CAPTIONS = [
  "'Opportunities multiply as they are seized.' — Machiavelli\n\nToday? He'd be running Airbnb arbitrage in every city with a spread. Rent low. List high. Pocket the difference. No ownership required.\n\n[8 seconds]\n\nThis Airbnb flip just paid $3k passive — here's how. 🏡\n\nRent for $2,200/month. List for $5,800/month. Pocket the difference. No ownership. No mortgage. Just cash flow.\n\nLink below — full breakdown inside the Club. 🔗 createaiprofit.com",

  "'The wise man does at once what the fool does finally.' — Machiavelli\n\nToday? He'd have 7 Airbnb units running before most people finished their morning coffee. The sublease model: sign the lease, list the property, collect the spread.\n\n[8 seconds]\n\n$3,400 passive this month from one Airbnb arbitrage unit. 📊\n\nThe math is simple: find the spread, sign the sublease, list it, collect. No capital needed to start.\n\nFull blueprint — link in bio. 🔗 createaiprofit.com",

  "'Never attempt to win by force what can be won by deception.' — Machiavelli\n\nToday? He'd be controlling 7 Airbnb units without owning a single one. The sublease model is the ultimate leverage play.\n\n[8 seconds]\n\nAirbnb arbitrage: the play that's still wide open. 🗺️\n\nI run 7 units. Zero ownership. $18k/month net. Every city has the spread if you know where to look.\n\nLink in bio — I break it all down inside. 🔗 createaiprofit.com",

  "'Fortune favors the bold.' — Machiavelli\n\nToday? He'd be bold enough to sign the sublease, list the property, and collect the spread — while everyone else is waiting for the 'right time' to start.\n\n[8 seconds]\n\nReal estate assignment + Airbnb arbitrage = the 1% formula. 🤖🏠\n\nAssign the skyscraper deal. Collect the fee. Roll it into the Airbnb portfolio. Compound. Repeat.\n\nJoin the Club — link below. 🔗 createaiprofit.com",

  "'Power is not given — it is taken.' — Machiavelli\n\nToday? He'd take the passive income play that requires zero capital and maximum leverage. The Airbnb sublease model: you don't need to own anything.\n\n[8 seconds]\n\n$3k passive last week. Zero capital in. 💸\n\nAirbnb sublease model: you don't need to own anything. You need the right contract, the right market, and the right system. All three are inside.\n\nLink in bio. 🔗 createaiprofit.com",

  "'The ends justify the means.' — Machiavelli\n\nToday? He'd use every legal leverage play available. The sublease model changed the game: no mortgage, no ownership, no capital required. Just a lease and a listing.\n\n[8 seconds]\n\nThe sublease model changed my life. 🔑\n\nNo mortgage. No ownership. No capital required. Just a lease agreement, a listing, and a system that runs while you sleep.\n\nFull walkthrough — link in bio. 🔗 createaiprofit.com",
];"""

# Replace the old arrays with the new ones
new_content = content[:start_idx] + new_arrays + '\n\n' + content[end_idx:].lstrip('\n')

with open('/home/ubuntu/createaiprofit/server/routers/botEngine.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done. Replaced all three BLITZ caption arrays.")
print(f"Old length: {len(content)}, New length: {len(new_content)}")
