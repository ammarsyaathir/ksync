import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
txt = [html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in ps]
names = ["Bucher","Castillo","Eppler","Fletcher","Gillespie","Hwang","Suzor","Wasko","Zubiaga","Majerczak"]
out=[]
for i,t in enumerate(txt):
    hit = [n for n in names if n in t]
    if hit:
        out.append(f"\n--- p{i} {hit} ---\n{t}")
open("perf/_v4ctx.txt","w",encoding="utf-8").write("\n".join(out))
print("written", len(out), "paragraphs")
