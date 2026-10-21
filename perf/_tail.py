import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
for q in ps[-20:]:
    t = html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q)))
    brk = "PAGEBREAK" if "w:br w:type=\"page\"" in q else ""
    pb = "breakBefore" if "pageBreakBefore" in q else ""
    print(repr(t[:70]), brk, pb, len(q))
