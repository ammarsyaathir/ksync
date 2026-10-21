import pymupdf, re, sys
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5_preview.pdf"
d = pymupdf.open(p)
print("pages:", d.page_count)
sec = re.compile(r'^(1\.\d(?:\.\d)?)\s+(.+)$')
for i, pg in enumerate(d):
    t = pg.get_text("text")
    lines = [l.strip() for l in t.splitlines() if l.strip()]
    heads = [l for l in lines if sec.match(l)]
    figs = re.findall(r'Figure 1\.\d:', t)
    tabs = re.findall(r'Table 1\.\d:', t)
    imgs = len(pg.get_images(full=True))
    print(f"p{i+1:02d} chars={len(t):4d} imgs={imgs} figs={len(figs)} tabs={len(tabs)} | " + " || ".join(heads[:3])[:110])
