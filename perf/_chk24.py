import pymupdf
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v7_preview.pdf")
t = d[23].get_text("text")
print(t[:600])
