import io
p="perf/build-ch1-v5.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""const pPr = shell.pPr.replace(/w:after="\\d+"/, 'w:after="100"');""",
"""const pPr = shell.pPr.replace(/w:after="\\d+"/, 'w:after="60"').replace(/w:line="\\d+"/, 'w:line="264"');""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("ok")
