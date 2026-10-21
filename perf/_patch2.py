import io
p="perf/build-ch1-v5.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""  plan.set(hits[0], { text: e.text });""",
"""  plan.set(hits[0], e.capLabel ? { cap: [e.capLabel, e.capTitle] } : { text: e.text });""")
s=s.replace("""    if (plan.has(i)) { out += rebuild(p.xml, plan.get(i).text); rep++; }""",
"""    if (plan.has(i)) {
      const pl = plan.get(i);
      out += pl.cap ? captionParagraph(pl.cap[0], pl.cap[1]) : rebuild(p.xml, pl.text);
      rep++;
    }""")
s=s.replace("""const missingNew = REPLACE.filter((e) => !vcat.includes(norm(e.text).slice(0, 60)));""",
"""const missingNew = REPLACE.filter((e) => e.text && !vcat.includes(norm(e.text).slice(0, 60)));""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)

q="perf/ch1-edits-v5.mjs"
t=io.open(q,encoding="utf-8").read()
anchor="""  // ----- 1.6 Project Scope"""
add="""  {\n    key: 'Figure 1.1: Current business process for discovering and discussing K-pop events',\n    capLabel: 'Figure 1.1',\n    capTitle: 'Current Business Process for Discovering and Discussing K-Pop Events',\n  },\n\n"""
t=t.replace(anchor, add+anchor,1)
io.open(q,"w",encoding="utf-8",newline="\n").write(t)
print("patched")
