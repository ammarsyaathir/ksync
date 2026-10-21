import pymupdf, re
d = pymupdf.open(r"perf\_v4_preview.pdf")
print("v4 pages:", d.page_count)
for i, pg in enumerate(d):
    t = pg.get_text("text")
    if len(t) < 400:
        print(f"  p{i+1}: chars={len(t)} | {t.strip()[:80]!r}")
