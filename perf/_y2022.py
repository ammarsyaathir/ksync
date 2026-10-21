import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5.docx"
z = zipfile.ZipFile(p)
x = z.read("word/document.xml").decode("utf-8")
texts=[html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)]
for t in texts:
    for m in re.finditer(r"2022", t):
        print("...", t[max(0,m.start()-90):m.start()+20].replace("\n"," "), "...")
