import re

with open('/home/ubuntu/project/Create AI Profit index - html_files 2/index-BBRAv34j.js', 'r', errors='ignore') as f:
    content = f.read()

# ── LOGIN PAGE ──
print("=" * 60)
print("LOGIN PAGE (LoginOnboarding.tsx)")
print("=" * 60)
login_start = content.find('LoginOnboarding.tsx:1')
if login_start == -1:
    login_start = content.find('LoginOnboarding.tsx')
if login_start != -1:
    chunk = content[max(0, login_start-100):login_start+4000]
    print(chunk)

# ── ONBOARDING STEPS ──
print("\n" + "=" * 60)
print("ONBOARDING STEPS / PHASES")
print("=" * 60)
# Find step arrays or phase definitions
step_patterns = [
    r'step[s]?\s*[:=]\s*\[.*?\]',
    r'phase[s]?\s*[:=]\s*\[.*?\]',
    r'stages?\s*[:=]\s*\[.*?\]',
]
for pat in step_patterns:
    matches = re.findall(pat, content, re.DOTALL | re.IGNORECASE)
    for m in matches[:3]:
        if len(m) < 600 and any(c.isalpha() for c in m):
            print(m[:500])
            print("---")

# ── VIDEO / ARIA LIGHT SHOW ──
print("\n" + "=" * 60)
print("VIDEO / ARIA LIGHT SHOW")
print("=" * 60)
video_keywords = ['video', 'lightshow', 'light show', 'ElevenLabs', 'speakEleven', 'hologram', 'holo', 'INITIATING', 'PORTAL', 'HOLOGRAM']
for kw in video_keywords:
    matches = list(re.finditer(kw, content, re.IGNORECASE))
    if matches:
        print(f"\n[{kw.upper()}] — {len(matches)} hits")
        shown = 0
        seen = set()
        for m in matches:
            s, e = m.start(), m.end()
            ctx = content[max(0,s-80):min(len(content),e+250)]
            key = ctx[70:120]
            if key not in seen:
                seen.add(key)
                readable = re.sub(r'[^\w\s\.,!?:;\'"\/\-\(\)=]', '', ctx)
                if len(readable.split()) > 6:
                    print(f"  >> {ctx[:300]}")
                    shown += 1
            if shown >= 3:
                break

# ── WELCOME / ARIA INTRO SEQUENCE ──
print("\n" + "=" * 60)
print("WELCOME / ARIA INTRO SEQUENCE")
print("=" * 60)
welcome_start = content.find('Welcome.tsx')
if welcome_start != -1:
    print(content[max(0,welcome_start-50):welcome_start+3000])

# ── LOGIN FORM FIELDS ──
print("\n" + "=" * 60)
print("LOGIN FORM FIELDS & LOGIC")
print("=" * 60)
login_fields = ['username', 'password', 'email', 'phone', 'signIn', 'sign_in', 'login', 'auth']
for kw in login_fields:
    matches = list(re.finditer(r'"' + kw + r'"', content, re.IGNORECASE))
    if matches:
        m = matches[0]
        ctx = content[max(0,m.start()-100):min(len(content),m.end()+200)]
        readable = re.sub(r'[^\w\s\.,!?:;\'"\/\-\(\)=]', '', ctx)
        if len(readable.split()) > 8:
            print(f"[{kw}]: {ctx[:250]}")
            print()

# ── ARIA VOICE SCRIPTS ──
print("\n" + "=" * 60)
print("ARIA VOICE SCRIPTS (ElevenLabs)")
print("=" * 60)
voice_matches = re.findall(r'speakElevenLabs\(["\']([^"\']+)["\']', content)
for v in voice_matches[:10]:
    print(f"  ARIA SAYS: {v}")
    print()
