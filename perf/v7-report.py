import pymupdf, re, os
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v7_preview.pdf"
d = pymupdf.open(p)
print("pages:", d.page_count)
sec = re.compile(r"^(1\.\d(?:\.\d)?)\s+(.+)$")
for i, pg in enumerate(d):
    t = pg.get_text("text")
    lines = [l.strip() for l in t.splitlines() if l.strip()]
    heads = [l for l in lines if sec.match(l)]
    caps = re.findall(r"Figure 1\.\d:", t)
    tabs = re.findall(r"Table 1\.\d:", t)
    print(f"p{i+1:02d} chars={len(t):4d} caps={caps} tabs={tabs} | " + " || ".join(heads[:2])[:80])
os.makedirs("perf/_v7pages", exist_ok=True)
for i in range(d.page_count):
    d[i].get_pixmap(dpi=100).save(f"perf/_v7pages/p{i+1:02d}.png")
