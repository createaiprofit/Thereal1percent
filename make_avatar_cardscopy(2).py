"""
Generate titled avatar cards for all 15 CAP baby avatars.
Each card: black background, avatar image, name/title/city/quote overlaid.
"""
from PIL import Image, ImageDraw, ImageFont
import requests
import io
import os

OUTPUT_DIR = "/home/ubuntu/webdev-static-assets/avatar_cards"
os.makedirs(OUTPUT_DIR, exist_ok=True)

AVATARS = [
    {"id": "strategist",   "title": "The Strategist",   "origin": "Atlanta, GA",       "quote": "Stack silent. Move loud.",                    "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black-bibt54hpggxcfKJrMM4ZCs.webp"},
    {"id": "operator",     "title": "The Operator",     "origin": "Houston, TX",        "quote": "Leverage is the only language money speaks.",  "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-DLBJbpjbQJvFmqJV8bpTBt.webp"},
    {"id": "ghost",        "title": "The Ghost",        "origin": "Moscow, RU",         "quote": "Cold system. Hot returns.",                    "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian-MENqyhDtaiPVuD5LWosFMq.webp"},
    {"id": "architect",    "title": "The Architect",    "origin": "St. Petersburg, RU", "quote": "Design the system. Let it run.",               "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_russian_v2-FvQCJCLfRkQ8RzxqHLkVFB.webp"},
    {"id": "consigliere",  "title": "The Consigliere",  "origin": "Milan, IT",          "quote": "Elegance is the only true luxury.",            "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian-AP3zSsZXMxxuFhHidkvyAx.webp"},
    {"id": "don",          "title": "The Don",          "origin": "Rome, IT",           "quote": "Respect is earned in silence.",                "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_italian_v2-DyN7RbwHLrsM343vrhnLj8.webp"},
    {"id": "builder",      "title": "The Builder",      "origin": "Mexico City, MX",    "quote": "Build what pays you while you sleep.",         "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_mexican-QFKzLit5zQ9J7sZNYpzUYN.webp"},
    {"id": "phantom",      "title": "The Phantom",      "origin": "Bucharest, RO",      "quote": "Three moves ahead. Always.",                   "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian-cH2Sm5EBBazg8kDpLcGw3d.webp"},
    {"id": "tactician",    "title": "The Tactician",    "origin": "Cluj, RO",           "quote": "Patience is the most powerful weapon.",        "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_romanian_v2-g8bwbMA2VgqXkVAcvEvdWb.webp"},
    {"id": "sheikh",       "title": "The Sheikh",       "origin": "Dubai, UAE",         "quote": "Oil was yesterday. AI is today.",              "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_arab-Zcg6Ldz9pYbDG2UQ2ANSud.webp"},
    {"id": "visionary",    "title": "The Visionary",    "origin": "Mumbai, IN",         "quote": "A billion people. One opportunity.",           "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_indian-StUvWxYzAbCdEfGhIjKlMn.webp"},
    {"id": "director",     "title": "The Director",     "origin": "Hollywood, CA",      "quote": "Every empire starts with a script.",           "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_la_hollywood_fbc34862.png"},
    {"id": "broker",       "title": "The Broker",       "origin": "New York, NY",       "quote": "Wall Street is just the warm-up.",             "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_nyc_78f71499.png"},
    {"id": "king",         "title": "The King",         "origin": "Atlanta, GA",        "quote": "Atlanta built more millionaires than Harvard.","img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_atlanta_e73cfc94.png"},
    {"id": "closer",       "title": "The Closer",       "origin": "Chicago, IL",        "quote": "Close the deal. Close the gap.",               "img": "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/avatar_black_v2-VaXNoNYbjxPvWy8LfMwxJ2.webp"},
]

CARD_W, CARD_H = 800, 1000
GOLD = (201, 168, 76)
WHITE = (255, 255, 255)
LIGHT_GRAY = (180, 180, 180)
BLACK = (0, 0, 0)

def load_font(size, bold=False):
    """Try to load a system font, fall back to default."""
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

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current = ""
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

def draw_centered(draw, text, y, font, color, width):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (width - tw) // 2
    draw.text((x, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]

def make_card(av):
    # Create black card
    card = Image.new("RGB", (CARD_W, CARD_H), BLACK)
    draw = ImageDraw.Draw(card)

    # Subtle gold border
    border = 3
    draw.rectangle([border, border, CARD_W - border, CARD_H - border], outline=GOLD, width=border)

    # Load avatar image
    try:
        resp = requests.get(av["img"], timeout=15)
        resp.raise_for_status()
        avatar_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
        # Resize to fit top portion
        av_w, av_h = avatar_img.size
        target_h = 580
        target_w = int(av_w * target_h / av_h)
        if target_w > CARD_W - 40:
            target_w = CARD_W - 40
            target_h = int(av_h * target_w / av_w)
        avatar_img = avatar_img.resize((target_w, target_h), Image.LANCZOS)
        # Paste centered
        x_off = (CARD_W - target_w) // 2
        y_off = 30
        # Composite on black background
        bg = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 255))
        bg.paste(avatar_img, (x_off, y_off), avatar_img)
        card = bg.convert("RGB")
        draw = ImageDraw.Draw(card)
        # Redraw border
        draw.rectangle([border, border, CARD_W - border, CARD_H - border], outline=GOLD, width=border)
    except Exception as e:
        print(f"  Warning: could not load image for {av['id']}: {e}")

    # Fonts
    font_title = load_font(42, bold=True)
    font_origin = load_font(22)
    font_cap = load_font(18)
    font_quote = load_font(24)

    y = 630

    # "CAP" label
    draw_centered(draw, "C A P", y, font_cap, GOLD, CARD_W)
    y += 28

    # Gold divider line
    draw.line([(CARD_W // 2 - 60, y), (CARD_W // 2 + 60, y)], fill=GOLD, width=1)
    y += 14

    # Title
    draw_centered(draw, av["title"].upper(), y, font_title, WHITE, CARD_W)
    y += 54

    # Origin
    draw_centered(draw, av["origin"].upper(), y, font_origin, GOLD, CARD_W)
    y += 36

    # Gold divider line
    draw.line([(CARD_W // 2 - 40, y), (CARD_W // 2 + 40, y)], fill=GOLD, width=1)
    y += 18

    # Quote (wrapped, italic-style)
    quote_font = load_font(22)
    lines = wrap_text(f'"{av["quote"]}"', quote_font, CARD_W - 80, draw)
    for line in lines:
        draw_centered(draw, line, y, quote_font, LIGHT_GRAY, CARD_W)
        y += 30

    # Bottom "CREATE AI PROFIT" watermark
    font_wm = load_font(16)
    draw_centered(draw, "CREATE AI PROFIT", CARD_H - 36, font_wm, GOLD, CARD_W)

    out_path = os.path.join(OUTPUT_DIR, f"cap_{av['id']}.png")
    card.save(out_path, "PNG")
    print(f"  Saved: {out_path}")
    return out_path

print("Generating avatar cards...")
paths = []
for av in AVATARS:
    print(f"Processing {av['title']} ({av['origin']})...")
    p = make_card(av)
    paths.append(p)

print(f"\nDone! {len(paths)} cards generated in {OUTPUT_DIR}")
