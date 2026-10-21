import zipfile, re, html, json
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v4.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
ps = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
out=[]
for i in range(198,214):
    q=ps[i]
    runs=[]
    for m in re.finditer(r"<w:r(?:\s[^>]*)?>([\s\S]*?)</w:r>", q):
        body=m.group(1)
        t="".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", body))
        if not t: continue
        ital = bool(re.search(r"<w:i/>|<w:i\s", body))
        runs.append({"t": html.unescape(t), "i": ital})
    out.append({"idx": i, "runs": runs})
open("perf/_v4refs.json","w",encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1))
print("refs dumped:", len(out))
for r in out:
    print(r["idx"], "|", "".join(x["t"] for x in r["runs"])[:120])
print("\n--- Schaffner full ---")
for r in out:
    t="".join(x["t"] for x in r["runs"])
    if t.startswith("Schaffner"): print(t)
