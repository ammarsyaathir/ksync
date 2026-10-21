import zipfile, re
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v6.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
print("open <w:tbl>:", len(re.findall(r"<w:tbl>", x)), "| <w:tbl ...>:", len(re.findall(r"<w:tbl\s", x)), "| close:", x.count("</w:tbl>"))
for m in re.finditer(r"<w:tbl[ >]", x):
    seg = x[m.start():m.start()+300]
    print("---- at", m.start(), seg[:120].replace("\n"," "))
