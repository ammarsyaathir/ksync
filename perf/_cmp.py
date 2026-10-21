import pymupdf
a = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v7_preview.pdf")
b = pymupdf.open(r"perf\_v4_preview.pdf")
for name, d in (("V7", a), ("V4", b)):
    print("="*20, name)
    for i in range(17, min(23, d.page_count)):
        t = d[i].get_text("text").strip()
        print(f"--- p{i+1} ({len(t)}) ---")
        print(t[:420].replace("\n"," | "))
