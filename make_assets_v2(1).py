"""
1. Resize new CAP ECV-style logo to TikTok (200x200), Instagram (320x320), YouTube (800x800)
2. Regenerate all 15 avatar cards with email address added
"""
from PIL import Image, ImageDraw, ImageFont
import requests
import io
import os

# ── Paths ──────────────────────────────────────────────────────────────────────
MASTER_LOGO = "/home/ubuntu/webdev-static-assets/cap_logo_ecv_style_master.png"
LOGOS_DIR   = "/home/ubuntu/webdev-static-assets/logos_sized"
CARDS_DIR   = "/home/ubuntu/webdev-static-assets/avatar_cards"
os.makedirs(LOGOS_DIR, exist_ok=True)
os.makedirs(CARDS_DIR, exist_ok=True)

# ── 1. Resize logo ─────────────────────────────────────────────────────────────
logo = Image.open(MASTER_LOGO).convert("RGBA")
sizes = {
    "tiktok_200x200":    (200, 200),
    "instagram_320x320": (320, 320),
    "youtube_800x800":   (800, 800),
}
logo_paths = {}
for name, size in sizes.items():
    resized = logo.resize(size, Image.LANCZOS)
    # paste on black background
    bg = Image.new("RGB", size, (0, 0, 0))
    bg.paste(resized, (0, 0), resized)
    out = os.path.join(LOGOS_DIR, f"cap_logo_{name}.png")
    bg.save(out, "PNG")
    logo_paths[name] = out
    print(f"Logo saved: {out}")

# ── 2. Avatar cards with emails ────────────────────────────────────────────────
AVATARS = [
    {"id": "strategist",  "title": "The Strategist",  "origin": "Atlanta, GA",       "quote": "Stack silent. Move loud.",                     "email": "TheStrategist@createaiprofit.com",  "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black-bibt54hpggxcfKJrMM4ZCs.webp"},
    {"id": "operator",    "title": "The Operator",    "origin": "Houston, TX",        "quote": "Leverage is the only language money speaks.",   "email": "TheOperator@createaiprofit.com",     "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-DLBJbpjbQJvFmqJV8bpTBt.webp"},
    {"id": "ghost",       "title": "The Ghost",       "origin": "Moscow, RU",         "quote": "Cold system. Hot returns.",                     "email": "TheGhost@createaiprofit.com",        "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian-MENqyhDtaiPVuD5LWosFMq.webp"},
    {"id": "architect",   "title": "The Architect",   "origin": "St. Petersburg, RU", "quote": "Design the system. Let it run.",                "email": "TheArchitect@createaiprofit.com",    "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian_v2-FvQCJCLfRkQ8RzxqHLkVFB.webp"},
    {"id": "consigliere", "title": "The Consigliere", "origin": "Milan, IT",          "quote": "Elegance is the only true luxury.",             "email": "TheConsigliere@createaiprofit.com",  "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian-AP3zSsZXMxxuFhHidkvyAx.webp"},
    {"id": "don",         "title": "The Don",         "origin": "Rome, IT",           "quote": "Respect is earned in silence.",                 "email": "TheDon@createaiprofit.com",          "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian_v2-DyN7RbwHLrsM343vrhnLj8.webp"},
    {"id": "builder",     "title": "The Builder",     "origin": "Mexico City, MX",    "quote": "Build what pays you while you sleep.",          "email": "TheBuilder@createaiprofit.com",      "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_mexican-QFKzLit5zQ9J7sZNYpzUYN.webp"},
    {"id": "phantom",     "title": "The Phantom",     "origin": "Bucharest, RO",      "quote": "Three moves ahead. Always.",                    "email": "ThePhantom@createaiprofit.com",      "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian-cH2Sm5EBBazg8kDpLcGw3d.webp"},
    {"id": "tactician",   "title": "The Tactician",   "origin": "Cluj, RO",           "quote": "Patience is the most powerful weapon.",         "email": "TheTactician@createaiprofit.com",    "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian_v2-g8bwbMA2VgqXkVAcvEvdWb.webp"},
    {"id": "sheikh",      "title": "The Sheikh",      "origin": "Dubai, UAE",         "quote": "Oil was yesterday. AI is today.",               "email": "TheSheikh@createaiprofit.com",       "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-Zcg6Ldz9pYbDG2UQ2ANSud.webp"},
    {"id": "visionary",   "title": "The Visionary",   "origin": "Mumbai, IN",         "quote": "A billion people. One opportunity.",            "email": "TheVisionary@createaiprofit.com",    "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_indian-StUvWxYzAbCdEfGhIjKlMn.webp"},
    {"id": "director",    "title": "The Director",    "origin": "Hollywood, CA",      "quote": "Every empire starts with a script.",            "email": "TheDirector@createaiprofit.com",     "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862.png"},
    {"id": "broker",      "title": "The Broker",      "origin": "New York, NY",       "quote": "Wall Street is just the warm-up.",              "email": "TheBroker@createaiprofit.com",       "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499.png"},
    {"id": "king",        "title": "The King",        "origin": "Atlanta, GA",        "quote": "Atlanta built more millionaires than Harvard.", "email": "TheKing@createaiprofit.com",         "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_atlanta_e73cfc94.png"},
    {"id": "closer",      "title": "The Closer",      "origin": "Chicago, IL",        "quote": "Close the deal. Close the gap.",                "email": "TheCloser@createaiprofit.com",       "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-VaXNoNYbjxPvWy8LfMwxJ2.webp"},
]

CARD_W, CARD_H = 800, 1060
GOLD       = (201, 168, 76)
SILVER     = (192, 192, 210)
WHITE      = (255, 255, 255)
LIGHT_GRAY = (170, 170, 170)
DIM_GRAY   = (120, 120, 120)
BLACK      = (0, 0, 0)

def load_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_centered(draw, text, y, font, color, width):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (width - tw) // 2
    draw.text((x, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = (current + " " + word).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def make_card(av):
    card = Image.new("RGB", (CARD_W, CARD_H), BLACK)
    draw = ImageDraw.Draw(card)

    # Silver border
    b = 3
    draw.rectangle([b, b, CARD_W-b, CARD_H-b], outline=SILVER, width=b)

    # Load avatar image
    try:
        resp = requests.get(av["img"], timeout=15)
        resp.raise_for_status()
        avatar_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
        av_w, av_h = avatar_img.size
        target_h = 560
        target_w = int(av_w * target_h / av_h)
        if target_w > CARD_W - 40:
            target_w = CARD_W - 40
            target_h = int(av_h * target_w / av_w)
        avatar_img = avatar_img.resize((target_w, target_h), Image.LANCZOS)
        x_off = (CARD_W - target_w) // 2
        bg = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 255))
        bg.paste(avatar_img, (x_off, 28), avatar_img)
        card = bg.convert("RGB")
        draw = ImageDraw.Draw(card)
        draw.rectangle([b, b, CARD_W-b, CARD_H-b], outline=SILVER, width=b)
    except Exception as e:
        print(f"  Warning: image load failed for {av['id']}: {e}")

    y = 608

    # CAP label
    font_cap = load_font(16)
    draw_centered(draw, "C A P", y, font_cap, GOLD, CARD_W)
    y += 24

    # Divider
    draw.line([(CARD_W//2-60, y), (CARD_W//2+60, y)], fill=SILVER, width=1)
    y += 12

    # Title
    font_title = load_font(40, bold=True)
    draw_centered(draw, av["title"].upper(), y, font_title, WHITE, CARD_W)
    y += 50

    # Origin
    font_origin = load_font(20)
    draw_centered(draw, av["origin"].upper(), y, font_origin, GOLD, CARD_W)
    y += 32

    # Divider
    draw.line([(CARD_W//2-40, y), (CARD_W//2+40, y)], fill=SILVER, width=1)
    y += 14

    # Quote
    font_quote = load_font(21)
    lines = wrap_text(f'"{av["quote"]}"', font_quote, CARD_W - 80, draw)
    for line in lines:
        draw_centered(draw, line, y, font_quote, LIGHT_GRAY, CARD_W)
        y += 28

    y += 6

    # Divider
    draw.line([(CARD_W//2-40, y), (CARD_W//2+40, y)], fill=SILVER, width=1)
    y += 12

    # Email
    font_email = load_font(17)
    draw_centered(draw, av["email"], y, font_email, SILVER, CARD_W)
    y += 26

    # Watermark
    font_wm = load_font(14)
    draw_centered(draw, "CREATE AI PROFIT", CARD_H - 32, font_wm, GOLD, CARD_W)

    out_path = os.path.join(CARDS_DIR, f"cap_{av['id']}_v2.png")
    card.save(out_path, "PNG")
    print(f"  Card saved: {out_path}")
    return out_path

print("\nGenerating avatar cards with emails...")
card_paths = []
for av in AVATARS:
    print(f"  Processing {av['title']}...")
    p = make_card(av)
    card_paths.append(p)

print(f"\nAll done. {len(card_paths)} cards + {len(logo_paths)} logos generated.")
