import zipfile, os

zpath = "/home/ubuntu/upload/Archive(1).zip"
project_pages = "/home/ubuntu/one-percent-playground/client/src/pages"
project_server = "/home/ubuntu/one-percent-playground/server"

print(f"{'FILE':<40} {'ARCHIVE':>10} {'PROJECT':>10}  STATUS")
print("-" * 75)

with zipfile.ZipFile(zpath) as z:
    for info in z.infolist():
        if info.filename.startswith('__MACOSX'):
            continue
        basename = os.path.basename(info.filename)
        if not basename.endswith(('.tsx', '.ts', '.css')):
            continue
        arc_size = info.file_size
        
        # Check in pages
        proj_path = os.path.join(project_pages, basename)
        if not os.path.exists(proj_path):
            proj_path = os.path.join(project_server, basename)
        
        if os.path.exists(proj_path):
            proj_size = os.path.getsize(proj_path)
            if arc_size > proj_size:
                status = "<<< ARCHIVE IS LARGER"
            elif arc_size < proj_size:
                status = "    project is larger"
            else:
                status = "    same size"
        else:
            proj_size = 0
            status = "<<< NOT IN PROJECT"
        
        print(f"{basename:<40} {arc_size:>10} {proj_size:>10}  {status}")
