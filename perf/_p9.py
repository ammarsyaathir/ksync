import pymupdf
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5_preview.pdf")
for i in (8,9,10,11):
    print("="*18, "PAGE", i+1, "="*18)
    print(d[i].get_text("text").strip())
