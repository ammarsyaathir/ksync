import io, re
p="perf/ch1-edits-v6.mjs"
s=io.open(p,encoding="utf-8").read()

s = s.replace(
 "Work on rumour propagation similarly shows that unverified claims can circulate widely before they are corrected (Tang et al., 2025).",
 "Research on crisis misinformation shows that a claim can gain credibility simply because many people appear to accept it, which allows unverified information to spread before any correction arrives (Kim & Lim, 2025).")

s = s.replace(
 "Platform incentives, user engagement and knowledge collaboration performance in online knowledge communities. ",
 "Platform incentives, user engagement and knowledge collaboration performance in online knowledge community: A cross-cultural perspective. ")

tang_block = re.compile(r"\n  \{\n    key: 'Tang, R\.[\s\S]*?\n  \},(?=\n)")
kim = """  {
    key: 'Kim, Y., & Lim, H. D. (2025)',
    runs: [
      { t: 'Kim, Y., & Lim, H. D. (2025). Alleviating the bandwagon effect of crisis misinformation on social media: Understanding social media users\\u2019 bandwagon perceptions and the credibility of crisis misinformation to protect organizational reputation. ' },
      { t: 'Communication Studies, 77', i: true },
      { t: '(1), 22\\u201350. doi:10.1080/10510974.2025.2485368' },
    ],
  },
"""
s, n = tang_block.subn(lambda m: "\n" + kim.rstrip("\n"), s)
print("Tang -> Kim replaced:", n)
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
for m in re.finditer(r"key: '([^']+)'", s[s.index("export const REFS"):]): print("  -", m.group(1))
print("2022/old check:", [y for y in ["2021","2022"] if y in s[s.index("export const REFS"):]])
