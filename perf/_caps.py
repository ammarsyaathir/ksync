import pymupdf, re
d = pymupdf.open(r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6_preview.pdf")
caps=[c for pg in d for c in re.findall(r"Figure 1\.\d:", pg.get_text("text"))]
print("\ncaptions found:", len(caps), sorted(set(caps)))
print("images (raster) total:", sum(len(pg.get_images(full=True)) for pg in d))
