from PIL import Image
import numpy as np
from collections import Counter

img = Image.open("/home/ubuntu/upload/ecv-logo-v2.png").convert("RGBA")
data = np.array(img)

# Filter out fully transparent pixels
mask = data[:, :, 3] > 200  # only opaque pixels
pixels = data[mask][:, :3]  # RGB only

# Sample every 4th pixel for speed
sampled = pixels[::4]

# Convert to hex
hex_pixels = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in sampled]

# Count
counter = Counter(hex_pixels)

# Get top 20 most common
top = counter.most_common(20)
print("Top 20 colors:")
for color, count in top:
    print(f"  {color}  count={count}")

# Now get representative clusters — sample unique zones
# Divide image into 4 quadrants and get dominant color per quadrant
h, w = data.shape[:2]
quadrants = {
    "top-left": data[:h//2, :w//2],
    "top-right": data[:h//2, w//2:],
    "bottom-left": data[h//2:, :w//2],
    "bottom-right": data[h//2:, w//2:],
    "center": data[h//4:3*h//4, w//4:3*w//4],
}

print("\nDominant color per zone:")
for zone, qdata in quadrants.items():
    qmask = qdata[:, :, 3] > 200
    qpix = qdata[qmask][:, :3]
    if len(qpix) == 0:
        continue
    qhex = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in qpix[::4]]
    qcounter = Counter(qhex)
    top1 = qcounter.most_common(1)[0][0]
    print(f"  {zone}: {top1}")

# Extract specific key colors: darkest bg, brightest highlight, mid-tone silver, border
print("\nKey color analysis:")
rgb = sampled.astype(float)
brightness = rgb.mean(axis=1)

# Darkest (background)
dark_idx = np.argsort(brightness)[:len(brightness)//10]
dark_pixels = sampled[dark_idx]
dark_hex = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in dark_pixels[::4]]
dark_color = Counter(dark_hex).most_common(1)[0][0]
print(f"  Background (darkest):  {dark_color}")

# Brightest (sparkle/highlight)
bright_idx = np.argsort(brightness)[-len(brightness)//20:]
bright_pixels = sampled[bright_idx]
bright_hex = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in bright_pixels[::4]]
bright_color = Counter(bright_hex).most_common(1)[0][0]
print(f"  Highlight (brightest): {bright_color}")

# Mid silver — filter pixels where R≈G≈B (neutral/silver) and brightness 100-200
silver_mask = (
    (np.abs(rgb[:, 0] - rgb[:, 1]) < 20) &
    (np.abs(rgb[:, 1] - rgb[:, 2]) < 20) &
    (brightness > 100) & (brightness < 220)
)
silver_pixels = sampled[silver_mask]
if len(silver_pixels) > 0:
    silver_hex = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in silver_pixels[::4]]
    silver_color = Counter(silver_hex).most_common(1)[0][0]
    print(f"  Silver (mid-tone):     {silver_color}")

# Border/frame — look at edges
edge_pixels = np.concatenate([
    data[0, :, :3],      # top edge
    data[-1, :, :3],     # bottom edge
    data[:, 0, :3],      # left edge
    data[:, -1, :3],     # right edge
])
edge_hex = ['#{:02X}{:02X}{:02X}'.format(r, g, b) for r, g, b in edge_pixels[::2]]
edge_color = Counter(edge_hex).most_common(1)[0][0]
print(f"  Border/frame:          {edge_color}")
