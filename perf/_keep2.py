import io, re
p="perf/build-ch1-v6.mjs"
s=io.open(p,encoding="utf-8").read()

start = s.index("// keep a caption together with its table")
end = s.index("// ---------------------------------------------------------------- splice")
new_fn = """// keep a caption together with its table, and never split a table row
const withKeepNext = (px) => px.includes('<w:pPr>')
  ? px.replace('<w:pPr>', '<w:pPr><w:keepNext/>')
  : px.replace(/^(<w:p(?:\\s[^>]*)?>)/, '$1<w:pPr><w:keepNext/></w:pPr>');

function keepTableTogether(xml, marker) {
  const ti = xml.indexOf(marker);
  if (ti < 0) return xml;
  const start = xml.lastIndexOf('<w:tbl>', ti);
  const end = xml.indexOf('</w:tbl>', ti) + '</w:tbl>'.length;
  let tbl = xml.slice(start, end);
  const rows = [...tbl.matchAll(/<w:tr(?:\\s[^>]*)?>[\\s\\S]*?<\\/w:tr>/g)];
  for (let i = 0; i < rows.length; i++) {
    const orig = rows[i][0];
    let row = orig.includes('<w:trPr>')
      ? orig.replace('<w:trPr>', '<w:trPr><w:cantSplit/>')
      : orig.replace(/^(<w:tr(?:\\s[^>]*)?>)/, '$1<w:trPr><w:cantSplit/></w:trPr>');
    if (i < rows.length - 1) {
      row = row.replace(/<w:p(?:\\s[^>]*)?>[\\s\\S]*?<\\/w:p>/g, (px) => withKeepNext(px));
    }
    tbl = tbl.replace(orig, row);
  }
  return xml.slice(0, start) + tbl + xml.slice(end);
}

"""
s = s[:start] + new_fn + s[end:]

# keep the caption with the table
s = s.replace("""      else out += rebuild(p.xml, pl.text);
      rep++;""",
"""      else out += rebuild(p.xml, pl.text);
      rep++;""")
s = s.replace("""    else out += p.xml;
    kept++;""",
"""    else out += (/^Table 1\\.\\d:/.test(p.text) ? withKeepNext(p.xml) : p.xml);
    kept++;""")

io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("rewritten")
