"""
For every file in the project, find the largest version across all archives.
Output: file name, current size, best source size, best source zip, best source path.
"""
import zipfile, os

UPLOAD_DIR = "/home/ubuntu/upload"
PROJECT_DIR = "/home/ubuntu/one-percent-playground"

# Collect all files in the project (relative paths)
project_files = {}
for root, dirs, files in os.walk(PROJECT_DIR):
    # Skip node_modules, .git, dist, .manus-logs
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "dist", ".manus-logs", ".drizzle")]
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, PROJECT_DIR)
        project_files[f] = {"rel": rel, "current_size": os.path.getsize(full), "best_size": 0, "best_source": None, "best_path": None}

# Also collect files that exist in archives but NOT in project (new files)
archive_only = {}

# Search all zips
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
                if not bn:
                    continue
                size = info.file_size
                if bn in project_files:
                    if size > project_files[bn]["best_size"]:
                        project_files[bn]["best_size"] = size
                        project_files[bn]["best_source"] = zf
                        project_files[bn]["best_path"] = info.filename
                else:
                    # File not in project
                    ext = os.path.splitext(bn)[1]
                    if ext in (".ts", ".tsx", ".css", ".json", ".md", ".sql"):
                        if bn not in archive_only or size > archive_only[bn]["best_size"]:
                            archive_only[bn] = {"best_size": size, "best_source": zf, "best_path": info.filename}
    except Exception as e:
        pass

# Also check loose files in upload dir
for f in os.listdir(UPLOAD_DIR):
    if f.endswith(".zip"):
        continue
    fpath = os.path.join(UPLOAD_DIR, f)
    if not os.path.isfile(fpath):
        continue
    size = os.path.getsize(fpath)
    if f in project_files:
        if size > project_files[f]["best_size"]:
            project_files[f]["best_size"] = size
            project_files[f]["best_source"] = "LOOSE"
            project_files[f]["best_path"] = fpath
    else:
        ext = os.path.splitext(f)[1]
        if ext in (".ts", ".tsx", ".css", ".json", ".md", ".sql"):
            if f not in archive_only or size > archive_only[f]["best_size"]:
                archive_only[f] = {"best_size": size, "best_source": "LOOSE", "best_path": fpath}

print("=" * 80)
print("FILES IN PROJECT — comparing current vs best available")
print("=" * 80)
print(f"{'FILE':<40} {'CURRENT':>10} {'BEST':>10} {'UPGRADE?':>10}  SOURCE")
print("-" * 80)

upgrades = []
for fname, info in sorted(project_files.items()):
    cur = info["current_size"]
    best = info["best_size"]
    upgrade = "YES ⬆" if best > cur else ("same" if best == cur else "no archive")
    src = info["best_source"] or "-"
    print(f"{fname:<40} {cur:>10} {best:>10} {upgrade:>10}  {src}")
    if best > cur:
        upgrades.append((fname, info))

print()
print("=" * 80)
print(f"FILES IN ARCHIVES BUT NOT IN PROJECT ({len(archive_only)} files)")
print("=" * 80)
for fname, info in sorted(archive_only.items()):
    print(f"{fname:<40} {info['best_size']:>10} bytes  |  {info['best_source']}")

print()
print(f"\nTotal upgrades available: {len(upgrades)}")
print(f"New files available: {len(archive_only)}")
