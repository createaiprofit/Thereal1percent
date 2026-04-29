"""
For every file in the project AND every relevant file in archives:
- Find the largest version across all zips + loose files
- If it's larger than what's currently in the project (or doesn't exist), copy it in
- Use canonical destination paths based on file type/name
"""
import zipfile, os, shutil

UPLOAD_DIR = "/home/ubuntu/upload"
PROJECT_DIR = "/home/ubuntu/one-percent-playground"

# Destination mapping: filename -> project relative path
# For files not in this map, we'll infer from extension/context
DEST_MAP = {
    # Pages
    "Home.tsx":             "client/src/pages/Home.tsx",
    "Login.tsx":            "client/src/pages/Login.tsx",
    "LoginOnboarding.tsx":  "client/src/pages/LoginOnboarding.tsx",
    "ProfileSetup.tsx":     "client/src/pages/ProfileSetup.tsx",
    "Terms.tsx":            "client/src/pages/Terms.tsx",
    "Subscribe.tsx":        "client/src/pages/Subscribe.tsx",
    "MiniSeries.tsx":       "client/src/pages/MiniSeries.tsx",
    "Episodes.tsx":         "client/src/pages/Episodes.tsx",
    "SocialEntry.tsx":      "client/src/pages/SocialEntry.tsx",
    "SocialFeed.tsx":       "client/src/pages/SocialFeed.tsx",
    "SocialProfile.tsx":    "client/src/pages/SocialProfile.tsx",
    "Feed.tsx":             "client/src/pages/Feed.tsx",
    "InAppWallet.tsx":      "client/src/pages/InAppWallet.tsx",
    "ClubVault.tsx":        "client/src/pages/ClubVault.tsx",
    "Staff.tsx":            "client/src/pages/Staff.tsx",
    "Concierge.tsx":        "client/src/pages/Concierge.tsx",
    "ConfidenceCologne.tsx":"client/src/pages/ConfidenceCologne.tsx",
    "WellnessBots.tsx":     "client/src/pages/WellnessBots.tsx",
    "CheckMate.tsx":        "client/src/pages/CheckMate.tsx",
    "BookClub.tsx":         "client/src/pages/BookClub.tsx",
    "UserMarketplace.tsx":  "client/src/pages/UserMarketplace.tsx",
    "AriaWelcomeBack.tsx":  "client/src/pages/AriaWelcomeBack.tsx",
    "Live.tsx":             "client/src/pages/Live.tsx",
    "BotEnginePanel.tsx":   "client/src/pages/BotEnginePanel.tsx",
    "PostScheduler.tsx":    "client/src/pages/PostScheduler.tsx",
    "ColdCallDashboard.tsx":"client/src/pages/ColdCallDashboard.tsx",
    "AdminDashboard.tsx":   "client/src/pages/AdminDashboard.tsx",
    "ClubMatch.tsx":        "client/src/pages/ClubMatch.tsx",
    "AffiliateStore.tsx":   "client/src/pages/AffiliateStore.tsx",
    "TierBadge.tsx":        "client/src/components/TierBadge.tsx",
    # App shell
    "App.tsx":              "client/src/App.tsx",
    # Server files
    "routers.ts":           "server/routers.ts",
    "db.ts":                "server/db.ts",
    "botEngine.ts":         "server/botEngine.ts",
    "warRoom.ts":           "server/warRoom.ts",
    "warRoomRouter.ts":     "server/warRoomRouter.ts",
    "socialPost.ts":        "server/socialPost.ts",
    "realEstate.ts":        "server/realEstate.ts",
    "finance.ts":           "server/finance.ts",
    "social.ts":            "server/social.ts",
    "sdk.ts":               "server/sdk.ts",
    "audioManager.ts":      "client/src/lib/audioManager.ts",
    "outfitRotation.ts":    "server/outfitRotation.ts",
    # Schema
    "schema.ts":            "drizzle/schema.ts",
    # Styles
    "index.css":            "client/src/index.css",
    # Config
    "vite.config.ts":       "vite.config.ts",
}

# Files to skip (test files, copy files, etc.)
SKIP_PATTERNS = [" copy", "copy 2", "copy.ts", "copy 2.ts", ".test.", "tiktok.credentials"]

def should_skip(filename):
    for pat in SKIP_PATTERNS:
        if pat in filename:
            return True
    return False

# Step 1: Find largest version of each canonical file
best = {}  # canonical_name -> {size, source_zip, source_path, data}

def update_best(canonical, size, source, path_in_zip, zpath=None):
    if canonical not in best or size > best[canonical]["size"]:
        best[canonical] = {"size": size, "source": source, "path": path_in_zip, "zpath": zpath}

# Check all zips
for zf in sorted(os.listdir(UPLOAD_DIR)):
    if not zf.endswith(".zip"):
        continue
    zpath = os.path.join(UPLOAD_DIR, zf)
    try:
        with zipfile.ZipFile(zpath) as z:
            for info in z.infolist():
                if info.filename.startswith("__MACOSX") or info.filename.endswith("/"):
                    continue
                bn = os.path.basename(info.filename)
                if not bn or should_skip(bn):
                    continue
                if bn in DEST_MAP:
                    update_best(bn, info.file_size, zf, info.filename, zpath)
    except Exception as e:
        pass

# Check loose files
for f in os.listdir(UPLOAD_DIR):
    if f.endswith(".zip") or should_skip(f):
        continue
    fpath = os.path.join(UPLOAD_DIR, f)
    if not os.path.isfile(fpath):
        continue
    if f in DEST_MAP:
        size = os.path.getsize(fpath)
        update_best(f, size, "LOOSE", fpath, None)

# Step 2: For each file, compare with current project and copy if larger
copied = []
skipped = []

for canonical, dest_rel in DEST_MAP.items():
    if canonical not in best:
        skipped.append(f"  NOT FOUND in any archive: {canonical}")
        continue
    
    info = best[canonical]
    dest_abs = os.path.join(PROJECT_DIR, dest_rel)
    current_size = os.path.getsize(dest_abs) if os.path.exists(dest_abs) else 0
    
    if info["size"] <= current_size:
        skipped.append(f"  SKIP (current {current_size} >= archive {info['size']}): {canonical}")
        continue
    
    # Extract and copy
    os.makedirs(os.path.dirname(dest_abs), exist_ok=True)
    
    if info["source"] == "LOOSE":
        shutil.copy2(info["path"], dest_abs)
    else:
        with zipfile.ZipFile(info["zpath"]) as z:
            data = z.read(info["path"])
        with open(dest_abs, "wb") as f:
            f.write(data)
    
    copied.append(f"  COPIED {canonical}: {current_size} -> {info['size']} bytes  [{info['source']}]")

print("=== COPIED (upgraded) ===")
for line in copied:
    print(line)

print(f"\n=== SKIPPED (already at max or not found) ===")
for line in skipped:
    print(line)

print(f"\nTotal copied: {len(copied)}")
print(f"Total skipped: {len(skipped)}")
