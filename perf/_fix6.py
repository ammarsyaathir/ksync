import io, re
p = "perf/ch1-edits-v6.mjs"
s = io.open(p, encoding="utf-8").read()

zhou = """  {
    key: 'Zhou, Y., Chen, J., & Cheng, B. (2024)',
    runs: [
      { t: 'Zhou, Y., Chen, J., & Cheng, B. (2024). Platform incentives, user engagement and knowledge collaboration performance in online knowledge communities. ' },
      { t: 'Journal of Knowledge Management, 28', i: true },
      { t: '(10), 2940\\u20132975. doi:10.1108/JKM-01-2023-0021' },
    ],
  },
"""
# remove the misplaced copy from REPLACE
s = s.replace("  " + zhou, "", 1)

# append it to the end of REFS (last entry is Tang)
i = s.index("key: 'Tang, R., Burnley, B., Bode, L., & Vraga, E. K. (2025)'")
j = s.index("\n  },\n", i) + len("\n  },\n")
s = s[:j] + zhou + s[j:]

# restore the sampling-scope paragraph (key includes the tail)
pat = re.compile(r"\n  \{\n    key: 'The requirement-gathering activities include a questionnaire[^']*',[\s\S]*?\n  \},(?=\n)")
s, n = pat.subn("", s)
print("sampling paragraph restored:", n)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

refs = s[s.index("export const REFS"):]
print("refs:", len(re.findall(r"\n  \{\n    key:", refs)))
for m in re.finditer(r"key: '([^']+)'", refs): print("  -", m.group(1))
print("REPLACE entries:", len(re.findall(r"\n  \{\n    key: '(?:[^']+)',\n    (?:text|capLabel)", s)))
