import zipfile, re, html, json
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
print("paragraphs:", len(ps))
for i,q in enumerate(ps):
    t = html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q)))
    has_draw = "<w:drawing>" in q
    if has_draw or re.search(r"Question|Figure|Table|Q\d+", t):
        print(f"{i:3d} draw={int(has_draw)} | {t[:110]}")
