import zipfile, re, html
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
paras = re.findall(r"<w:p(?:\s[^>]*)?>[\s\S]*?</w:p>", x)
texts = [html.unescape("".join(re.findall(r"<w:t(?:\s[^>]*)?>([\s\S]*?)</w:t>", q))) for q in paras]
all_t = "\n".join(texts)
print("paragraphs:", len(texts))
print("figure captions in order:")
for t in texts:
    m = re.match(r"^(Figure 1\.\d):", t)
    if m: print("   ", t[:95])
print("\nreferences:", sum(1 for t in texts if re.match(r"^[A-Z][^.]*\(\d{4}\)\.", t)))
print("Q-refs:", re.findall(r"\bQ\d+\b", all_t), "| 'Question':", all_t.count("Question"))
print("duplicate 'Figure 1.1' mentions:", len(re.findall(r"Figure 1\.1\b", all_t)))
print("Table captions:", re.findall(r"Table 1\.\d:", all_t))
print("in-text figure refs:", sorted(set(re.findall(r"Figure 1\.\d", all_t))))
print("refs years:", sorted(set(re.findall(r"\((20\d\d)\)", all_t))))
print("Hono/Supabase/Postgres/Cloudflare:", [w for w in ["Hono","Supabase","PostgreSQL","Cloudflare","MongoDB"] if w in all_t])
