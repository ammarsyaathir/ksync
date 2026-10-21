import io, re
p="perf/ch1-edits-v6.mjs"
s=io.open(p,encoding="utf-8").read()
head, refs = s.split("// ---------------------------------------------------------------- references",1)
pat = re.compile(r"\n  \{\n    key: 'Zhou, Y\.[\s\S]*?\n  \},(?=\n)")
head, n = pat.subn("", head)
print("removed stray Zhou from REPLACE:", n)
io.open(p,"w",encoding="utf-8",newline="\n").write(head + "// ---------------------------------------------------------------- references" + refs)
r = (head+refs)
print("REPLACE entries now:", len(re.findall(r"\n  \{\n    key: '(?:[^']+)',\n    (?:text|capLabel)", r)))
