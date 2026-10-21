import io, re
s = io.open("perf/ch1-edits-v6.mjs", encoding="utf-8").read()
refs = s[s.index("export const REFS"):]
print("ref entries:", len(re.findall(r"\n  \{\n    key:", refs)))
for m in re.finditer(r"key: '([^']+)'", refs):
    print("  -", m.group(1))
print("\n2022 occurrences:")
for m in re.finditer("2022", s):
    print("  ...", s[max(0,m.start()-70):m.start()+15].replace("\n"," "))
