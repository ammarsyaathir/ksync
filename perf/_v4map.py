import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
txt = [html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in ps]
L=[]
L.append("==== ALL 'Question' OCCURRENCES ====")
for i,t in enumerate(txt):
    if re.search(r"Questions?\s*\d|Q\d+", t):
        L.append(f"\n--- p{i} ---\n{t}")
L.append("\n\n==== RUN COUNTS for patch targets ====")
for i in [10,14,26,28,33,53,55,57,58,59,78,82,96,102,104]:
    q=ps[i]
    runs=len(re.findall(r"<w:r[ >]", q))
    rpr=len(re.findall(r"<w:rPr>", q))
    L.append(f"p{i}: runs={runs} rPr={rpr} text={txt[i][:60]!r}")
L.append("\n\n==== IMAGE REGIONS ====")
for a,b in [(46,53),(69,76),(80,87)]:
    for i in range(a,b):
        L.append(f"p{i} draw={int('<w:drawing>' in ps[i])} | {txt[i][:90]!r}")
    L.append("")
L.append("\n==== REFERENCES paragraphs ====")
for i in range(195,len(ps)):
    L.append(f"p{i} | {txt[i][:100]!r}")
L.append("\n==== ref pPr sample (p199) ====")
L.append(ps[199][:900])
L.append("\n==== image paragraph sample (p49) ====")
L.append(ps[49][:700])
open("perf/_v4map.txt","w",encoding="utf-8").write("\n".join(L))
print("ok")
