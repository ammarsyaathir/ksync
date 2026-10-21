import pymupdf, re
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v7_preview.pdf")
print("pages:", d.page_count)
for i in (6,7,9):
    t = d[i].get_text("text")
    print("="*18, "PAGE", i+1)
    print(t[:1700])
