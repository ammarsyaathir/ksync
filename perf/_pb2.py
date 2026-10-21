import io
p="perf/ch1-edits-v6.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""  // empty page-break paragraph before REFERENCES (blank page)""",
"""  // empty page-break paragraph before 1.8 (half-empty page)
  { from: 'Reported event information and community content can be reviewed through an organized moderation process', to: '1.8 Outline of the Thesis' },
  // empty page-break paragraph before REFERENCES (blank page)""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("ok")
