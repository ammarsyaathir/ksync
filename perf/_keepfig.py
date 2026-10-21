import io
p="perf/build-ch1-v7.mjs"
s=io.open(p,encoding="utf-8").read()
old="return '<w:p><w:pPr><w:jc w:val=\"center\"/><w:spacing w:before=\"200\" w:after=\"0\"/></w:pPr>'"
new="return '<w:p><w:pPr><w:keepNext/><w:jc w:val=\"center\"/><w:spacing w:before=\"200\" w:after=\"0\"/></w:pPr>'"
print("keepNext patched:", s.count(old))
s=s.replace(old,new)
io.open(p,"w",encoding="utf-8",newline="\n").write(s)

q="perf/ch1-edits-v7.mjs"
t=io.open(q,encoding="utf-8").read()
o2="As summarized in Figure 1.4, these responses"
n2="These responses"
print("dup ref patched:", t.count(o2))
t=t.replace(o2,n2)
io.open(q,"w",encoding="utf-8",newline="\n").write(t)
