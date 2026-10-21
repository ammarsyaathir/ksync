import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
txt = [html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in ps]
names = ["Bucher","Castillo","Eppler","Fletcher","Gillespie","Hwang","Suzor","Wasko","Zubiaga","Majerczak"]
print("==== paragraphs with pre-2023 citations ====")
for i,t in enumerate(txt):
    hit = [n for n in names if n in t]
    if hit:
        print(f"\n--- p{i} {hit} ---\n{t}")
print("\n==== all 'Question' / 'Q' mentions ====")
for i,t in enumerate(txt):
    for m in re.finditer(r"(Questions? \d+[^.;)]{0,40}|Q\d+\b)", t):
        print(f"p{i}: ...{t[max(0,m.start()-70):m.start()+90]}...")
