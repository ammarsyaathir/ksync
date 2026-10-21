import pymupdf, os
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5_preview.pdf"
d = pymupdf.open(p)
os.makedirs("perf/_v5pages", exist_ok=True)
for i in range(d.page_count):
    pix = d[i].get_pixmap(dpi=110)
    pix.save(f"perf/_v5pages/p{i+1:02d}.png")
print("rendered", d.page_count)
