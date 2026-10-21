import re, io, sys
p = "perf/ch1-edits-v5.mjs"
s = io.open(p, encoding="utf-8").read()
pairs = [
  ("(Figure 1.1)", "(Figure 1.2)"),
  ("(Figure 1.2).", "(Figure 1.3)."),
]
# do it safely: replace all 6 numbered tokens by a temporary marker first
for n in range(1, 7):
    s = s.replace("(Figure 1.%d)" % n, "(Figure 1.@%d)" % n)
    s = s.replace("cap: 'Figure 1.%d'" % n, "cap: 'Figure 1.@%d'" % n)
for n in range(1, 7):
    s = s.replace("(Figure 1.@%d)" % n, "(Figure 1.%d)" % (n + 1))
    s = s.replace("cap: 'Figure 1.@%d'" % n, "cap: 'Figure 1.%d'" % (n + 1))
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print(sorted(set(re.findall(r"Figure 1\.\d", s))))
print(s.count("Figure 1.2"), s.count("Figure 1.7"))
