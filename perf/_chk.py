import zipfile, re
p = r"C:\Users\ammar\Downloads\K_Sync_Malaysia_Chapter_1_Revised_v5.docx"
x = zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
i = x.find("Arnold, M.")
print(x[i-420:i+60])
print("---")
print("after=100 count:", x.count('w:after="100"'), "| after=160 count:", x.count('w:after="160"'))
