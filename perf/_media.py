import zipfile
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised.docx"
z = zipfile.ZipFile(p)
for n in z.namelist():
    if n.startswith("word/media/"):
        b = z.read(n)
        print(n, len(b), "PNG" if b[:4]==b"\x89PNG" else b[:4])
