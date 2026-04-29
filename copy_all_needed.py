import zipfile, os

zpath = "/home/ubuntu/upload/Archive(1).zip"
project_root = "/home/ubuntu/one-percent-playground"
pages_dir = os.path.join(project_root, "client/src/pages")
server_dir = os.path.join(project_root, "server")
lib_dir = os.path.join(project_root, "client/src/lib")
components_dir = os.path.join(project_root, "client/src/components")
client_dir = os.path.join(project_root, "client/src")

# Files that are larger in archive (should overwrite)
larger_files = {"Staff.tsx", "SocialProfile.tsx", "Subscribe.tsx"}

# Server-side files to place in server/
server_files = {
    "botEngine.ts", "warRoom.ts", "socialPost.ts", "realEstate.ts",
    "emailAuth.ts", "social.ts", "autopilot.ts", "outfitRotation.ts",
    "finance.ts", "db.ts", "cookies.ts", "context.ts", "index.ts"
}

# Client lib files
lib_files = {"audioManager.ts", "sdk.ts"}

# Config files
config_files = {"vite.config.ts"}

copied = []
skipped = []

with zipfile.ZipFile(zpath) as z:
    for info in z.infolist():
        if info.filename.startswith('__MACOSX') or info.file_size == 0:
            continue
        basename = os.path.basename(info.filename)
        if not basename.endswith(('.tsx', '.ts', '.css')):
            continue

        # Determine destination
        dest_path = None

        if basename in larger_files:
            dest_path = os.path.join(pages_dir, basename)
        elif basename in server_files:
            dest_path = os.path.join(server_dir, basename)
            # Only copy if not in project OR archive is larger
            if os.path.exists(dest_path):
                if info.file_size <= os.path.getsize(dest_path):
                    skipped.append(f"SKIP (project larger): {basename}")
                    continue
        elif basename in lib_files:
            dest_path = os.path.join(lib_dir, basename)
            if os.path.exists(dest_path):
                if info.file_size <= os.path.getsize(dest_path):
                    skipped.append(f"SKIP (project larger): {basename}")
                    continue
        elif basename == "index.css":
            # Check if archive version is different/better
            dest_path = os.path.join(client_dir, "index.css")
            if os.path.exists(dest_path) and info.file_size <= os.path.getsize(dest_path):
                skipped.append(f"SKIP (project larger): {basename}")
                continue
        elif basename.endswith('.tsx') and basename not in larger_files:
            # Page files - only copy if missing
            dest_path = os.path.join(pages_dir, basename)
            if os.path.exists(dest_path):
                skipped.append(f"SKIP (already exists): {basename}")
                continue
        else:
            skipped.append(f"SKIP (no dest rule): {basename}")
            continue

        if dest_path:
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            data = z.read(info.filename)
            with open(dest_path, 'wb') as f:
                f.write(data)
            copied.append(f"COPIED {basename} ({info.file_size} bytes) -> {dest_path}")

print("\n=== COPIED ===")
for c in copied:
    print(c)

print(f"\n=== SKIPPED ({len(skipped)}) ===")
for s in skipped:
    print(s)

print(f"\nTotal copied: {len(copied)}, skipped: {len(skipped)}")
