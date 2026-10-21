import pymupdf, re, os
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6_preview.pdf"
d = pymupdf.open(p)
print("pages:", d.page_count)
sec = re.compile(r'^(1\.\d(?:\.\d)?)\s+(.+)$')
for i, pg in enumerate(d):
    t = pg.get_text("text")
    lines = [l.strip() for l in t.splitlines() if l.strip()]
    heads = [l for l in lines if sec.match(l)]
    print(f"p{i+1:02d} chars={len(t):4d} imgs={len(pg.get_images(full=True))} figs={len(re.findall(r'Figure 1[.]\\d:', t))} tabs={len(re.findall(r'Table 1[.]\\d:', t))} | " + " || ".join(heads[:3])[:100])
os.makedirs("perf/_v6pages", exist_ok=True)
for i in range(d.page_count):
    d[i].get_pixmap(dpi=110).save(f"perf/_v6pages/p{i+1:02d}.png")
