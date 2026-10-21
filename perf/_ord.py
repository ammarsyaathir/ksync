import io, re
p="perf/ch1-edits-v6.mjs"
s=io.open(p,encoding="utf-8").read()
pat = re.compile(r"\n  \{\n    key: 'Kim, Y\., & Lim, H\. D\. \(2025\)',[\s\S]*?\n  \},(?=\n)")
m = pat.search(s)
block = m.group(0)
s = s[:m.start()] + s[m.end():]
i = s.index("key: 'James, S. (2025)'")
j = s.index("\n  },\n", i) + len("\n  },\n")
s = s[:j] + block.lstrip("\n") + s[j:]
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
for m in re.finditer(r"key: '([^']+)'", s[s.index("export const REFS"):]): print("  -", m.group(1))
