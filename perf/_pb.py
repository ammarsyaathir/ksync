import io
p="perf/ch1-edits-v6.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""  // old reference entries (replace the whole list)""",
"""  // empty page-break paragraph before REFERENCES (blank page)
  { from: 'To address these problems, three corresponding solutions were proposed', to: 'REFERENCES' },
  // old reference entries (replace the whole list)""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)

b="perf/build-ch1-v6.mjs"
t=io.open(b,encoding="utf-8").read()
t=t.replace("""    if (plan.has(i)) {
      const pl = plan.get(i);""",
"""    if (norm(p.text) === 'REFERENCES') {
      out += p.xml.replace('<w:pPr>', '<w:pPr><w:pageBreakBefore/>');
      kept++;
      const extra0 = afterXml.get(i);
      if (extra0) for (const x of extra0) out += x;
      continue;
    }
    if (plan.has(i)) {
      const pl = plan.get(i);""")
io.open(b,"w",encoding="utf-8",newline="\n").write(t)
print("patched")
