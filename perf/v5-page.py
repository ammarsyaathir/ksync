import pymupdf
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5_preview.pdf"
d = pymupdf.open(p)
for i in (2,3,7,13,14):
    print("="*20, "PAGE", i+1, "="*20)
    print(d[i].get_text("text").strip()[:1800])
