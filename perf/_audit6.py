import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
texts=[html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)]
ri = next(i for i,t in enumerate(texts) if t.strip()=="REFERENCES")
body, refs = texts[:ri], [t for t in texts[ri+1:] if t.strip()]
print("body paras:", len(body), "| refs:", len(refs))
refnames = [r.split(",")[0] for r in refs]
print("ref surnames:", refnames)
names=set()
for t in body:
    for m in re.finditer(r"\(([^()]*?\d{4}[^()]*?)\)", t):
        for part in m.group(1).split(";"):
            part=part.strip()
            mm=re.match(r"([A-Z][A-Za-z\-]+(?:\set al\.| & [A-Z][A-Za-z\-]+)?),? (?:\d{4})", part)
            if mm: names.add(mm.group(1))
    for m in re.finditer(r"([A-Z][A-Za-z\-]+) et al\. \((\d{4})\)", t):
        names.add(m.group(1)+" et al.")
print("\nin-text names:", sorted(names))
for n in refnames:
    first = n.split()[0]
    print(f"  {first:12s} cited: {'YES' if any(x.startswith(first) for x in names) else 'NO'}")
print("\nfigure mentions:", sorted(set(re.findall(r"Figure 1\.\d", "\n".join(body)))))
print("table mentions:", sorted(set(re.findall(r"Table 1\.\d", "\n".join(body)))))
print("any 2022:", "2022" in "\n".join(body), "| Question/Q:", bool(re.search(r"\bQuestion \d|\bQ\d+\b", "\n".join(body))))
