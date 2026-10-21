import io
p="perf/build-ch1-v6.mjs"
s=io.open(p,encoding="utf-8").read()

helper = """
// keep a caption together with its table, and never split a row
function keepTableTogether(xml, marker) {
  const ti = xml.indexOf(marker);
  if (ti < 0) return xml;
  const start = xml.lastIndexOf('<w:tbl', ti);
  const end = xml.indexOf('</w:tbl>', ti) + '</w:tbl>'.length;
  let tbl = xml.slice(start, end);
  const rows = [...tbl.matchAll(/<w:tr(?:\\s[^>]*)?>[\\s\\S]*?<\\/w:tr>/g)];
  rows.forEach((r, i) => {
    let row = r[0];
    const last = i === rows.length - 1;
    const withSplit = row.replace(/<w:trPr>/, '<w:trPr><w:cantSplit/>').replace(/^<w:tr(\\s[^>]*)?>/, (m) => m + '<w:trPr><w:cantSplit/></w:trPr>');
    row = row.includes('<w:trPr>') ? row.replace(/<w:trPr>/, '<w:trPr><w:cantSplit/>') : withSplit;
    if (!last) {
      row = row.replace(/<w:pPr>/g, '<w:pPr><w:keepNext/>');
      row = row.replace(/<w:p(\\s[^>]*)?>/g, (m) => m + '<w:pPr><w:keepNext/></w:pPr>')
               .replace(/<w:pPr><w:keepNext\\/><w:pPr><w:keepNext\\/>/g, '<w:pPr><w:keepNext/>');
    }
    tbl = tbl.replace(r[0], row);
  });
  return xml.slice(0, start) + tbl + xml.slice(end);
}
"""
s = s.replace("// ---------------------------------------------------------------- splice", helper + "\n// ---------------------------------------------------------------- splice")

s = s.replace("""out += xml.slice(cursor);""",
"""out += xml.slice(cursor);
out = keepTableTogether(out, 'Table 1.1: Alignment between problem statements');
out = keepTableTogether(out, 'Table 1.2: Outline of the thesis');""")

io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("patched builder")
