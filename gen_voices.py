from gtts import gTTS
import os

scripts = [
    ("strategist", "Machiavelli said: He who wishes to be obeyed must know how to command. Stack silent. Move loud. That is the only system that pays. Go to createaiprofit dot com.", "en"),
    ("operator", "Leverage is the only language money speaks. Machiavelli knew it. I live it. AI income streams. No clock. No boss. createaiprofit dot com.", "en"),
    ("ghost", "Cold system. Hot returns. Passive income has no accent, no border, no limit. The machine earns while you sleep. createaiprofit dot com.", "en"),
    ("architect", "Design the system. Let it run. The machine earns. You collect. That is the architecture of modern wealth. createaiprofit dot com.", "en"),
    ("consigliere", "Elegance is the only true luxury. Luxury products. Luxury commissions. The vault is open for those who know how to enter. createaiprofit dot com.", "en"),
    ("don", "Respect is earned in silence. The vault is open. Are you ready? I have been closing real estate deals for thirty years. One assignment fee changes everything. createaiprofit dot com.", "en"),
    ("builder", "Build what pays you while you sleep. One app. Twenty one million men. Free. The Airbnb arbitrage model is real. I built mine from nothing. createaiprofit dot com.", "en"),
    ("phantom", "Three moves ahead. Always. The one percent do not wait. They position. I am already in the next market before you see this one. createaiprofit dot com.", "en"),
    ("tactician", "Patience is the most powerful weapon. Download. Position. Profit. The AI automation stack runs clean when you build it right. createaiprofit dot com.", "en"),
    ("sheikh", "Oil was yesterday. AI is today. The new wealth runs on algorithms. Dubai is already positioned. Are you? createaiprofit dot com.", "en"),
    ("visionary", "A billion people. One opportunity. AI profit has no borders, no language barrier, no ceiling. The mission is global. createaiprofit dot com.", "en"),
    ("director", "Every empire starts with a script. Write yours. Download the app. I have been directing content that converts for twenty years. This is the best system I have ever seen. createaiprofit dot com.", "en"),
    ("broker", "Wall Street is just the warm-up. Real money moves in the one percent Playground. I have been on the floor for thirty years. This AI system is the edge I never had. createaiprofit dot com.", "en"),
    ("closer", "Close the deal. Close the gap. The one percent Playground is waiting. I have been closing real estate assignments for thirty years. Let me show you how. createaiprofit dot com.", "en"),
    ("prince", "Old money never announces itself. Generational wealth starts with one move. The Prince does not chase. He positions. createaiprofit dot com.", "en"),
    ("glitch", "Speed wins. I am the glitch that flips the game. Tokyo is locked. The system bends for those who move faster. Are you fast enough? createaiprofit dot com.", "en"),
]

os.makedirs("/home/ubuntu/voices", exist_ok=True)

for name, text, lang in scripts:
    out = f"/home/ubuntu/voices/{name}_voice.mp3"
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(out)
    print(f"Generated: {out}")

print("All voices generated.")
