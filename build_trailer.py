#!/usr/bin/env python3
"""
Build the 30-second Create AI Profit trailer.
Scene breakdown:
  0-8s:   Russian baby opening (shot1 image + narration_opening.wav)
  8-16s:  Boss babies at table (shot2 image + narration_table.wav)
  16-21s: Taddeo cameo (v3_taddeo.mp4 trimmed to 5s)
  21-30s: Aria reveal (aria_turn_video.mp4 + narration_aria.wav + end card text)
"""
import subprocess, os

TRAILER_DIR = "/home/ubuntu/cap_trailer"
OUT = f"{TRAILER_DIR}/cap_trailer_final.mp4"

def run(cmd, label=""):
    print(f"\n>>> {label}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print("STDERR:", result.stderr[-2000:])
    else:
        print("OK")
    return result.returncode

# ── 1. Create scene 1: Russian baby still image (8s) + opening narration ──────
run(f"""ffmpeg -y -loop 1 -i {TRAILER_DIR}/shot1_russian_baby.png \
    -i {TRAILER_DIR}/narration_opening.wav \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,\
drawtext=text='Welcome... to Create AI Profit':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h-80:alpha=0.9" \
    -c:v libx264 -c:a aac -shortest -t 8 \
    {TRAILER_DIR}/scene1.mp4""", "Scene 1: Russian baby opening")

# ── 2. Create scene 2: Boss babies table (8s) + table narration ───────────────
run(f"""ffmpeg -y -loop 1 -i {TRAILER_DIR}/shot2_table_scene.png \
    -i {TRAILER_DIR}/narration_table.wav \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,\
zoompan=z='min(zoom+0.0015,1.3)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',\
drawtext=text='This app is gonna steal our empire...':fontcolor=yellow:fontsize=28:x=(w-text_w)/2:y=h-80:alpha=0.85" \
    -c:v libx264 -c:a aac -shortest -t 8 \
    {TRAILER_DIR}/scene2.mp4""", "Scene 2: Boss babies table")

# ── 3. Create scene 3: Taddeo cameo (trim to 5s) ─────────────────────────────
run(f"""ffmpeg -y -i {TRAILER_DIR}/v3_taddeo.mp4 \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,\
drawtext=text='Who ordered well-done steak? IDIOT.':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=h-80:alpha=0.9" \
    -c:v libx264 -an -t 5 \
    {TRAILER_DIR}/scene3.mp4""", "Scene 3: Taddeo cameo")

# ── 4. Create scene 4: Aria reveal (9s) + aria dialogue ──────────────────────
run(f"""ffmpeg -y -i {TRAILER_DIR}/aria_turn_video.mp4 \
    -i {TRAILER_DIR}/narration_aria.wav \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,\
drawtext=text='Oh daddy... hush.':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=h-100:alpha=0.9:enable='between(t,2,5)',\
drawtext=text='ARIA RABBIT':fontcolor=gold:fontsize=48:x=(w-text_w)/2:y=h/2-60:alpha='if(gte(t,4),min((t-4)/1,1),0)',\
drawtext=text='CFO — Create AI Profit':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=h/2+10:alpha='if(gte(t,4.5),min((t-4.5)/1,1),0)'" \
    -c:v libx264 -c:a aac -shortest -t 6 \
    {TRAILER_DIR}/scene4.mp4""", "Scene 4: Aria reveal")

# ── 5. Create end card (5s black with text) ───────────────────────────────────
run(f"""ffmpeg -y -f lavfi -i color=c=black:size=1280x720:rate=30 \
    -vf "drawtext=text='Mini-Series Premiere Tonight':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=200:alpha='min(t/0.5,1)',\
drawtext=text='March 14th  |  7 PM PT':fontcolor=gold:fontsize=34:x=(w-text_w)/2:y=270:alpha='min(t/0.5,1)',\
drawtext=text='Create AI Profit':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=360:alpha='min(t/0.5,1)',\
drawtext=text='App Coming Soon':fontcolor=gold:fontsize=30:x=(w-text_w)/2:y=440:alpha='min(t/0.5,1)',\
drawtext=text='createaiprofit.com':fontcolor=0xAAAAAA:fontsize=26:x=(w-text_w)/2:y=500:alpha='min(t/0.5,1)'" \
    -t 5 -c:v libx264 \
    {TRAILER_DIR}/scene5.mp4""", "Scene 5: End card")

# ── 6. Concatenate all scenes ─────────────────────────────────────────────────
concat_list = f"{TRAILER_DIR}/concat_list.txt"
with open(concat_list, "w") as f:
    for i in range(1, 6):
        f.write(f"file '{TRAILER_DIR}/scene{i}.mp4'\n")

run(f"""ffmpeg -y -f concat -safe 0 -i {concat_list} \
    -c:v libx264 -c:a aac -movflags +faststart \
    {OUT}""", "Final concat")

# ── 7. Report ─────────────────────────────────────────────────────────────────
if os.path.exists(OUT):
    size = os.path.getsize(OUT) / (1024*1024)
    print(f"\n✅ Trailer built: {OUT} ({size:.1f} MB)")
else:
    print("\n❌ Trailer build FAILED")
