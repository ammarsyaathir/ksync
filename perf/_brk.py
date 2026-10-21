import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
for k,q in enumerate(ps):
    t = html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q)))
    if "1.8 Outline" in t or "1.7.3" in t or (t=="" and "page" in q):
        print(k, repr(t[:55]), "| PAGEBREAK" if 'w:type="page"' in q else "", "| breakBefore" if "pageBreakBefore" in q else "")
        if k>0:
            t0 = html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", ps[k-1])))
            print("    prev:", repr(t0[:50]), "| PAGEBREAK" if 'w:type="page"' in ps[k-1] else "")
