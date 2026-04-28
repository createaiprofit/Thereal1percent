import qrcode
import json
import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('/home/ubuntu/beta_qr', exist_ok=True)

with open('/home/ubuntu/beta_links.json') as f:
    links = json.load(f)

# Generate individual QR PNGs
for b in links:
    qr = qrcode.QRCode(version=2, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=8, border=2)
    qr.add_data(b['url'])
    qr.make(fit=True)
    img = qr.make_image(fill_color="#facc15", back_color="#000000")
    token_safe = b['token'].replace('/', '-')
    img.save(f"/home/ubuntu/beta_qr/{token_safe}.png")

print(f"Generated {len(links)} QR codes")

# Build master HTML package
html_parts = []
html_parts.append("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CAP Beta Invite Package</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;1,300&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:'Rajdhani',sans-serif;padding:40px 20px;}
.page-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-style:italic;text-align:center;margin-bottom:0.4rem;}
.page-sub{font-family:'Rajdhani',sans-serif;font-size:0.6rem;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.25);text-align:center;margin-bottom:2.5rem;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
.card{border:1px solid rgba(250,204,21,0.2);padding:16px;text-align:center;background:rgba(250,204,21,0.02);}
.card-num{font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:8px;}
.qr-wrap{background:#000;border:1px solid rgba(250,204,21,0.15);padding:10px;display:inline-block;margin-bottom:10px;}
.qr-wrap img{width:120px;height:120px;display:block;}
.token{font-size:0.75rem;letter-spacing:0.15em;color:#facc15;margin-bottom:4px;font-weight:700;}
.url{font-size:0.55rem;color:rgba(255,255,255,0.25);word-break:break-all;margin-bottom:8px;}
.badge{display:inline-block;background:rgba(250,204,21,0.1);border:1px solid rgba(250,204,21,0.25);color:#facc15;font-size:0.5rem;letter-spacing:0.2em;text-transform:uppercase;padding:3px 8px;}
.copy-btn{margin-top:8px;background:transparent;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.35);font-family:'Rajdhani',sans-serif;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;padding:5px 12px;cursor:pointer;transition:all 0.2s;width:100%;}
.copy-btn:hover{border-color:rgba(250,204,21,0.4);color:#facc15;}
.header-stats{display:flex;gap:16px;justify-content:center;margin-bottom:2rem;flex-wrap:wrap;}
.stat{border:1px solid rgba(255,255,255,0.07);padding:12px 24px;text-align:center;}
.stat-val{font-size:1.4rem;font-family:'Cormorant Garamond',serif;color:rgba(250,204,21,0.9);}
.stat-label{font-size:0.5rem;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.25);}
@media print{.copy-btn{display:none;}}
</style>
</head>
<body>
<div class="page-title">CAP Beta Invite Package</div>
<div class="page-sub">Create AI Profit · 1% Playground · Private Access</div>
<div class="header-stats">
  <div class="stat"><div class="stat-val">20</div><div class="stat-label">Beta Links</div></div>
  <div class="stat"><div class="stat-val">1 Day</div><div class="stat-label">Free Trial</div></div>
  <div class="stat"><div class="stat-val">Live</div><div class="stat-label">Status</div></div>
</div>
<div class="grid">
""")

for i, b in enumerate(links, 1):
    token_safe = b['token'].replace('/', '-')
    # Embed QR as base64
    import base64
    with open(f"/home/ubuntu/beta_qr/{token_safe}.png", 'rb') as qf:
        qr_b64 = base64.b64encode(qf.read()).decode()
    
    html_parts.append(f"""
  <div class="card">
    <div class="card-num">Beta Link #{i:02d}</div>
    <div class="qr-wrap">
      <img src="data:image/png;base64,{qr_b64}" alt="QR {b['token']}">
    </div>
    <div class="token">{b['token']}</div>
    <div class="url">{b['url']}</div>
    <div class="badge">1-Day Free Trial</div>
    <button class="copy-btn" onclick="navigator.clipboard.writeText('{b['url']}').then(()=>this.textContent='Copied ✓').catch(()=>this.textContent='Copy failed')">Copy Link</button>
  </div>
""")

html_parts.append("""
</div>
</body>
</html>
""")

with open('/home/ubuntu/beta_qr_package.html', 'w') as f:
    f.write(''.join(html_parts))

print("Full QR package HTML built: /home/ubuntu/beta_qr_package.html")
