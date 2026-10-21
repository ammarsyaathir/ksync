import pymupdf
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6_preview.pdf")
for i in (12,13,14,15):
    print("="*16, "PAGE", i+1, "="*16)
    print(d[i].get_text("text").strip()[:900])
