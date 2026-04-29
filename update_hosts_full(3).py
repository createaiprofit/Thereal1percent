import re

CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ"

path = "/home/ubuntu/createaiprofit/client/src/pages/Home.tsx"
with open(path, "r") as f:
    content = f.read()

# 1. Replace the entire HOSTS array with the locked 20-character version
NEW_HOSTS = '''// ─── BABY AVATAR HOSTS (20 — multilingual, LOCKED UNIFORM) ────────────────────
const HOSTS = [
  {
    id: "strategist",
    name: "CAP",
    title: "The Strategist",
    origin: "Atlanta, GA",
    lang: "English",
    img: "''' + CDN + '''/cap_strategist_v2_f104276d.png",
    quote: "Stack silent. Move loud.",
    pitch: "The system works while you sleep.",
    email: "TheStrategist@createaiprofit.com",
  },
  {
    id: "operator",
    name: "CAP",
    title: "The Operator",
    origin: "Houston, TX",
    lang: "English",
    img: "''' + CDN + '''/cap_operator_v2_6fdd94e3.png",
    quote: "Leverage is the only language money speaks.",
    pitch: "AI income streams. No clock. No boss.",
    email: "TheOperator@createaiprofit.com",
  },
  {
    id: "ghost",
    name: "CAP",
    title: "The Ghost",
    origin: "Moscow, RU",
    lang: "Russian",
    img: "''' + CDN + '''/cap_ghost_v2_2589fde8.png",
    quote: "Cold system. Hot returns.",
    pitch: "Passive income has no accent.",
    email: "TheGhost@createaiprofit.com",
  },
  {
    id: "architect",
    name: "CAP",
    title: "The Architect",
    origin: "St. Petersburg, RU",
    lang: "Russian",
    img: "''' + CDN + '''/cap_architect_v2_1d466824.png",
    quote: "Design the system. Let it run.",
    pitch: "The machine earns. You collect.",
    email: "TheArchitect@createaiprofit.com",
  },
  {
    id: "consigliere",
    name: "CAP",
    title: "The Consigliere",
    origin: "Milan, IT",
    lang: "Italian",
    img: "''' + CDN + '''/cap_consigliere_v2_b1444fd6.png",
    quote: "Elegance is the only true luxury.",
    pitch: "Luxury products. Luxury commissions.",
    email: "TheConsigliere@createaiprofit.com",
  },
  {
    id: "don",
    name: "CAP",
    title: "The Don",
    origin: "Rome, IT",
    lang: "Italian",
    img: "''' + CDN + '''/cap_don_v2_bb5cfe73.png",
    quote: "Respect is earned in silence.",
    pitch: "The vault is open. Are you ready?",
    email: "TheDon@createaiprofit.com",
  },
  {
    id: "builder",
    name: "CAP",
    title: "The Builder",
    origin: "Mexico City, MX",
    lang: "Spanish",
    img: "''' + CDN + '''/cap_builder_v2_1e230cc5.png",
    quote: "Build what pays you while you sleep.",
    pitch: "One app. 10 million men. Free.",
    email: "TheBuilder@createaiprofit.com",
  },
  {
    id: "phantom",
    name: "CAP",
    title: "The Phantom",
    origin: "Bucharest, RO",
    lang: "Romanian",
    img: "''' + CDN + '''/cap_phantom_v2_53971652.png",
    quote: "Three moves ahead. Always.",
    pitch: "The 1% don't wait. They position.",
    email: "ThePhantom@createaiprofit.com",
  },
  {
    id: "tactician",
    name: "CAP",
    title: "The Tactician",
    origin: "Cluj, RO",
    lang: "Romanian",
    img: "''' + CDN + '''/cap_tactician_v2_c70de2bc.png",
    quote: "Patience is the most powerful weapon.",
    pitch: "Download. Position. Profit.",
    email: "TheTactician@createaiprofit.com",
  },
  {
    id: "sheikh",
    name: "CAP",
    title: "The Sheikh",
    origin: "Dubai, UAE",
    lang: "Arabic",
    img: "''' + CDN + '''/cap_sheikh_v2_845db823.png",
    quote: "Oil was yesterday. AI is today.",
    pitch: "The new wealth runs on algorithms.",
    email: "TheSheikh@createaiprofit.com",
  },
  {
    id: "visionary",
    name: "CAP",
    title: "The Visionary",
    origin: "Mumbai, IN",
    lang: "Hindi",
    img: "''' + CDN + '''/cap_visionary_v2_4f0ab78a.png",
    quote: "A billion people. One opportunity.",
    pitch: "AI profit has no borders.",
    email: "TheVisionary@createaiprofit.com",
  },
  {
    id: "director",
    name: "CAP",
    title: "The Director",
    origin: "Hollywood, CA",
    lang: "English",
    img: "''' + CDN + '''/cap_director_v2_57b45dab.png",
    quote: "Every empire starts with a script.",
    pitch: "Write yours. Download the app.",
    email: "TheDirector@createaiprofit.com",
  },
  {
    id: "broker",
    name: "CAP",
    title: "The Broker",
    origin: "New York, NY",
    lang: "English",
    img: "''' + CDN + '''/cap_broker_v2_a64ecdfc.png",
    quote: "Wall Street is just the warm-up.",
    pitch: "Real money moves in the 1% Playground.",
    email: "TheBroker@createaiprofit.com",
  },
  {
    id: "king",
    name: "CAP",
    title: "The King",
    origin: "Atlanta, GA",
    lang: "English",
    img: "''' + CDN + '''/cap_king_v2_9871cfc4.png",
    quote: "Atlanta built more millionaires than Harvard.",
    pitch: "Join the movement. Escape the cage.",
    email: "TheKing@createaiprofit.com",
  },
  {
    id: "closer",
    name: "CAP",
    title: "The Closer",
    origin: "Chicago, IL",
    lang: "English",
    img: "''' + CDN + '''/cap_closer_v2_2a44e1da.png",
    quote: "Close the deal. Close the gap.",
    pitch: "The 1% Playground is waiting.",
    email: "TheCloser@createaiprofit.com",
  },
  {
    id: "aria",
    name: "CAP",
    title: "Aria Rabbit",
    origin: "Jedi / Yoda Planet",
    lang: "Universal",
    img: "''' + CDN + '''/aria_rabbit_login_ed5e3dfc.png",
    quote: "Welcome to the playground, millionaire.",
    pitch: "First frame. Last word. Always.",
    email: "Aria@createaiprofit.com",
  },
  {
    id: "prince",
    name: "CAP",
    title: "The Prince",
    origin: "Monaco",
    lang: "French",
    img: "''' + CDN + '''/syndicate_the_prince_6a5f2611.png",
    quote: "Old money never announces itself.",
    pitch: "Generational wealth starts with one move.",
    email: "ThePrince@createaiprofit.com",
  },
  {
    id: "dubai_chic",
    name: "CAP",
    title: "The Dubai Chic",
    origin: "Dubai, UAE",
    lang: "Hindi/Arabic",
    img: "''' + CDN + '''/avatar_indian_e3ab94ed.png",
    quote: "The turban is the crown. The system is the throne.",
    pitch: "Dubai built empires. So will you.",
    email: "DubaiChic@createaiprofit.com",
  },
  {
    id: "chinese_closer",
    name: "CAP",
    title: "The Chic",
    origin: "Shanghai, CN",
    lang: "Mandarin",
    img: "''' + CDN + '''/avatar_chinese_girl_6cc40c0c.png",
    quote: "Precision is the only luxury I wear.",
    pitch: "Shanghai runs the market. We run Shanghai.",
    email: "TheChic@createaiprofit.com",
  },
  {
    id: "caucasian_girl",
    name: "CAP",
    title: "The Concierge",
    origin: "Monaco / Milan",
    lang: "Italian/English",
    img: "''' + CDN + '''/avatar_american_italian_girl_f5235f24.png",
    quote: "Every door opens when you know the right people.",
    pitch: "Connections are currency. We have both.",
    email: "TheConcierge@createaiprofit.com",
  },
];'''

# Replace the old HOSTS array
old_pattern = r'// ─── (?:LOCKED HOSTS.*?\n.*?\n)?// ─── BABY AVATAR HOSTS.*?^];'
new_content = re.sub(old_pattern, NEW_HOSTS, content, flags=re.DOTALL | re.MULTILINE)

if new_content == content:
    # Try simpler pattern
    old_pattern2 = r'// ─── LOCKED HOSTS.*?^];'
    new_content = re.sub(old_pattern2, NEW_HOSTS, content, flags=re.DOTALL | re.MULTILINE)

if new_content == content:
    print("WARNING: Pattern not matched, trying line-based replacement")
    lines = content.split('\n')
    start = None
    end = None
    for i, line in enumerate(lines):
        if '// ─── LOCKED HOSTS' in line or ('const HOSTS = [' in line and start is None):
            start = i
        if start is not None and line.strip() == '];' and i > start + 5:
            end = i
            break
    if start is not None and end is not None:
        new_lines = lines[:start] + NEW_HOSTS.split('\n') + lines[end+1:]
        new_content = '\n'.join(new_lines)
        print(f"Replaced lines {start}-{end}")
    else:
        print(f"Could not find bounds: start={start}, end={end}")
else:
    print("HOSTS array replaced successfully via regex")

with open(path, "w") as f:
    f.write(new_content)

print("Done.")
