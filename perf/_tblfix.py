import io
p="perf/build-ch1-v6.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""  const start = xml.lastIndexOf('<w:tbl>', ti);
  const end = xml.indexOf('</w:tbl>', ti) + '</w:tbl>'.length;""",
"""  const start = xml.indexOf('<w:tbl>', ti);
  if (start < 0) return xml;
  const end = xml.indexOf('</w:tbl>', start) + '</w:tbl>'.length;""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("fixed table locator")
