import re

with open('/home/ubuntu/project/Create AI Profit index - html_files 2/index-BBRAv34j.js', 'r', errors='ignore') as f:
    content = f.read()

# ── BOOK CLUB ──
print("=" * 60)
print("BOOK CLUB — EXISTING BOOKS")
print("=" * 60)
# Find book arrays
book_start = content.find('bookclub')
if book_start == -1:
    book_start = content.find('BookClub')
# Find book objects with title/author
books = re.findall(r'\{[^{}]*?title:["\']([^"\']+)["\'][^{}]*?author:["\']([^"\']+)["\'][^{}]*?\}', content)
for b in books[:30]:
    print(f"  {b[0]} — {b[1]}")

# Also search for id + title pattern in books
books2 = re.findall(r'id:\d+,title:"([^"]+)",author:"([^"]+)"', content)
for b in books2[:30]:
    print(f"  {b[0]} — {b[1]}")

# ── STORE / MARKETPLACE ──
print("\n" + "=" * 60)
print("STORE / MARKETPLACE — EXISTING PRODUCTS")
print("=" * 60)
products = re.findall(r'name:"([^"]+)",.*?price:"([^"]+)",.*?commission:"([^"]+)"', content)
for p in products[:30]:
    print(f"  {p[0]} | {p[1]} | commission: {p[2]}")

# ── JUKEBOX ──
print("\n" + "=" * 60)
print("JUKEBOX — EXISTING CODE")
print("=" * 60)
juke_idx = content.find('jukebox')
if juke_idx == -1:
    juke_idx = content.find('Jukebox')
if juke_idx == -1:
    juke_idx = content.find('music')
if juke_idx != -1:
    print(content[max(0,juke_idx-100):juke_idx+1000])

# ── SOCIAL BUTTONS ──
print("\n" + "=" * 60)
print("SOCIAL BUTTONS — LIKE / COMMENT / SHARE / POST")
print("=" * 60)
social_kws = ['handleLike', 'handleComment', 'handleShare', 'handlePost', 'onLike', 'onComment', 'likeCount', 'commentCount', 'shareCount']
for kw in social_kws:
    matches = list(re.finditer(kw, content))
    if matches:
        m = matches[0]
        ctx = content[max(0,m.start()-50):min(len(content),m.end()+200)]
        print(f"[{kw}] — {len(matches)} hits")
        print(f"  {ctx[:250]}")
        print()

# ── LOGIN BUTTON ──
print("\n" + "=" * 60)
print("LOGIN BUTTON / FLOW")
print("=" * 60)
login_btn = re.findall(r'Login\.tsx[^"]*"[^"]*"[^"]*children:"([^"]+)"', content)
for b in login_btn[:10]:
    print(f"  Button: {b}")

# Find login submit
login_submit = content.find('Login.tsx')
if login_submit != -1:
    chunk = content[login_submit:login_submit+3000]
    # Find button text
    btns = re.findall(r'children:"([^"]{3,50})"', chunk)
    print("  Login page buttons:", btns[:15])

# ── BOT SCHEDULER ──
print("\n" + "=" * 60)
print("BOT SCHEDULER / VIDEO QUEUE")
print("=" * 60)
sched_idx = content.find('scheduler')
if sched_idx == -1:
    sched_idx = content.find('Scheduler')
if sched_idx != -1:
    print(content[max(0,sched_idx-50):sched_idx+800])

queue_idx = content.find('videoQueue')
if queue_idx == -1:
    queue_idx = content.find('Video Queue')
if queue_idx != -1:
    print(content[max(0,queue_idx-50):queue_idx+600])
