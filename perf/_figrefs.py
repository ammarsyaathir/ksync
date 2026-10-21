import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
txt = [html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in ps]
for i,t in enumerate(txt):
    for m in re.finditer(r"Figure\s*1\.\d", t):
        print(f"p{i}: ...{t[max(0,m.start()-100):m.start()+60]}...")
