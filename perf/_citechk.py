import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5.docx"
z = zipfile.ZipFile(p)
x = z.read("word/document.xml").decode("utf-8")
texts=[html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)]
body="\n".join(texts[:-11])   # skip reference entries at the end
for name in ["Arnold","Geels","Gutierrez","James","Reid","Roslan","Schaffner","Zhou","Tang","Majerczak","Xie","Zareie"]:
    hits=[t[:80] for t in texts[:-11] if name in t]
    print(f"{name:12s} in-text: {len(hits)}", ("| " + hits[0][:70]) if hits else "")
