import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v7.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
txt=[html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in ps]
ri = next(i for i,t in enumerate(txt) if t.strip()=="REFERENCES")
body, refs = "\n".join(txt[:ri]), [t for t in txt[ri+1:] if t.strip()]
print("paragraphs:", len(txt), "| refs:", len(refs))
print("capital Question:", re.findall(r"Question[^a-z]", body)[:5] or "none")
print("years <2023 in body:", sorted(set(re.findall(r"\((?:19|20)\d\d\)", body))))
print("years <2023 in refs:", [r[:40] for r in refs if re.search(r"\((?:19|20)\d\d\)", r) and not re.search(r"\((2023|2024|2025|2026)\)", r)] or "none")
print("\ncaptions:")
for t in txt:
    if t.startswith("Figure 1."): print("  ", t)
print("\nref list:")
for r in refs: print("  -", r[:75])
names = ["Arnold","Geels","Kim","Mak","Reid","Roslan","Schaffner","Zhang","Zhou"]
for n in names:
    print(f"  {n:10s} cited: {'YES' if n in body else 'NO'}")
