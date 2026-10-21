import pymupdf, re
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6_preview.pdf")
for i,pg in enumerate(d):
    t=pg.get_text("text")
    caps=re.findall(r"Figure 1\.\d:", t)
    if caps: print(f"p{i+1}: {caps}")
print("total captions:", sum(len(re.findall(r'Figure 1\.\d:', pg.get_text('text'))) for pg in d))
print("raster images:", sum(len(pg.get_images(full=True)) for pg in d))
