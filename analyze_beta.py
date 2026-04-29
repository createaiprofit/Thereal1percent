import re

with open('/home/ubuntu/project/Create AI Profit index - html_files 2/index-BBRAv34j.js', 'r', errors='ignore') as f:
    content = f.read()

print("=" * 60)
print("BETA FLOW ANALYSIS — Create AI Profit")
print("=" * 60)

# 1. Find all beta-related code blocks
print("\n### BETA-RELATED CODE BLOCKS ###\n")
# Search for 'beta' keyword context
beta_matches = [(m.start(), m.end()) for m in re.finditer(r'beta', content, re.IGNORECASE)]
seen_contexts = set()
for start, end in beta_matches:
    ctx_start = max(0, start - 200)
    ctx_end = min(len(content), end + 300)
    ctx = content[ctx_start:ctx_end]
    # Only show unique, readable contexts
    key = ctx[190:250]
    if key not in seen_contexts and any(c.isalpha() for c in ctx[150:]):
        seen_contexts.add(key)
        print(f"--- context ---")
        print(ctx)
        print()

print("\n### SUBSCRIPTION / PAYMENT RELATED ###\n")
sub_keywords = ['subscribe', 'subscription', 'payment', 'pay', 'stripe', 'lifetime', 'trial', 'expire', 'access']
for kw in sub_keywords:
    matches = [(m.start(), m.end()) for m in re.finditer(kw, content, re.IGNORECASE)]
    if matches:
        print(f"\n[{kw.upper()}] — {len(matches)} occurrences")
        # Show first 3 unique contexts
        shown = 0
        seen = set()
        for start, end in matches:
            ctx_start = max(0, start - 100)
            ctx_end = min(len(content), end + 200)
            ctx = content[ctx_start:ctx_end]
            key = ctx[90:140]
            if key not in seen:
                seen.add(key)
                # Only show if it has readable text
                readable = re.sub(r'[^\w\s\.,!?:;\'\"\/\-\(\)=><\{\}]', '', ctx)
                if len(readable.split()) > 10:
                    print(f"  >> {ctx[:300]}")
                    shown += 1
            if shown >= 3:
                break

print("\n### ONBOARDING / WELCOME FLOW ###\n")
onboard_keywords = ['onboarding', 'welcome', 'setup', 'terms', 'consent', 'token', 'invite']
for kw in onboard_keywords:
    matches = list(re.finditer(kw, content, re.IGNORECASE))
    if matches:
        print(f"\n[{kw.upper()}] — {len(matches)} occurrences")
        shown = 0
        seen = set()
        for m in matches:
            start, end = m.start(), m.end()
            ctx_start = max(0, start - 80)
            ctx_end = min(len(content), end + 200)
            ctx = content[ctx_start:ctx_end]
            key = ctx[70:120]
            if key not in seen:
                seen.add(key)
                readable = re.sub(r'[^\w\s\.,!?:;\'\"\/\-\(\)=><\{\}]', '', ctx)
                if len(readable.split()) > 8:
                    print(f"  >> {ctx[:300]}")
                    shown += 1
            if shown >= 3:
                break

print("\n### ROUTE DEFINITIONS ###\n")
route_patterns = re.findall(r'path:\s*["\']([^"\']+)["\']', content)
for r in sorted(set(route_patterns)):
    print(f"  {r}")

print("\n### TIMER / EXPIRY / DAY LOGIC ###\n")
timer_keywords = ['timer', 'expir', 'countdown', 'hours', 'days', 'trial', 'setTimeout', 'setInterval', 'deadline']
for kw in timer_keywords:
    matches = list(re.finditer(kw, content, re.IGNORECASE))
    if matches:
        print(f"\n[{kw.upper()}] — {len(matches)} occurrences")
        shown = 0
        seen = set()
        for m in matches:
            start, end = m.start(), m.end()
            ctx_start = max(0, start - 80)
            ctx_end = min(len(content), end + 150)
            ctx = content[ctx_start:ctx_end]
            key = ctx[70:110]
            if key not in seen:
                seen.add(key)
                readable = re.sub(r'[^\w\s\.,!?:;\'\"\/\-\(\)=><\{\}]', '', ctx)
                if len(readable.split()) > 6:
                    print(f"  >> {ctx[:250]}")
                    shown += 1
            if shown >= 2:
                break
