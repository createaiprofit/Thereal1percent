import os, re, subprocess, shutil

upload_dir = "/home/ubuntu/upload"
project_pages = "/home/ubuntu/one-percent-playground/client/src/pages"
project_src = "/home/ubuntu/one-percent-playground/client/src"
extract_dir = "/tmp/best_files"
os.makedirs(extract_dir, exist_ok=True)

PAGE_NAMES = [
    "AdminDashboard", "AffiliateStore", "AriaWelcomeBack", "BookClub",
    "BotEnginePanel", "CheckMate", "ClubMatch", "ClubVault", "ColdCallDashboard",
    "Concierge", "ConfidenceCologne", "Episodes", "Feed", "Home", "InAppWallet",
    "Live", "Login", "LoginOnboarding", "MiniSeries", "NotFound", "PostScheduler",
    "ProfileSetup", "SocialEntry", "SocialFeed", "SocialProfile", "Staff",
    "Subscribe", "Terms", "TierBadge", "UserMarketplace", "WellnessBots", "App"
]

def normalize(name):
    n = re.sub(r'copy\d*', '', name, flags=re.IGNORECASE)
    n = re.sub(r'\(\d+\)', '', n)
    n = re.sub(r'pasted_file_\w+_', '', n)
    return n.strip()

results = {}

# Scan loose files
for f in os.listdir(upload_dir):
    if not f.endswith(".tsx"):
        continue
    path = os.path.join(upload_dir, f)
    size = os.path.getsize(path)
    base = normalize(f.replace(".tsx",""))
    for page in PAGE_NAMES:
        if base.lower() == page.lower():
            if page not in results or results[page]['size'] < size:
                results[page] = {'size': size, 'loose_path': path, 'source': f}

# Scan zips
for zf in sorted(os.listdir(upload_dir)):
    if not zf.endswith(".zip"):
        continue
    zpath = os.path.join(upload_dir, zf)
    try:
        out = subprocess.check_output(['unzip','-l',zpath], stderr=subprocess.DEVNULL).decode()
        for line in out.split('\n'):
            if '.tsx' not in line or '__MACOSX' in line:
                continue
            parts = line.strip().split()
            if len(parts) < 4:
                continue
            try:
                size = int(parts[0])
            except:
                continue
            fname = parts[-1]
            basename = os.path.basename(fname).replace(".tsx","")
            base = normalize(basename)
            for page in PAGE_NAMES:
                if base.lower() == page.lower():
                    if page not in results or results[page]['size'] < size:
                        results[page] = {'size': size, 'zip': zpath, 'zippath': fname, 'source': zf}
    except:
        pass

# Now extract/copy each best file
print("Copying best versions to project...")
for page in PAGE_NAMES:
    if page not in results:
        print(f"  MISSING: {page}")
        continue
    info = results[page]
    dest = os.path.join(project_pages, f"{page}.tsx") if page != "App" else os.path.join(project_src, "App.tsx")
    
    if 'loose_path' in info:
        shutil.copy2(info['loose_path'], dest)
        print(f"  ✓ {page} ({info['size']} bytes) from loose:{info['source']}")
    elif 'zip' in info:
        # Extract from zip
        tmp_extract = f"/tmp/extract_{page}"
        os.makedirs(tmp_extract, exist_ok=True)
        try:
            subprocess.run(
                ['unzip', '-o', info['zip'], info['zippath'], '-d', tmp_extract],
                stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL
            )
            # Find the extracted file
            for root, dirs, files in os.walk(tmp_extract):
                for f in files:
                    if f == f"{page}.tsx" or f == "App.tsx":
                        src = os.path.join(root, f)
                        shutil.copy2(src, dest)
                        print(f"  ✓ {page} ({info['size']} bytes) from zip:{info['source']}")
                        break
        except Exception as e:
            print(f"  ✗ {page} FAILED: {e}")

print("\nDone!")
