import io
p="perf/ch1-edits-v7.mjs"
s=io.open(p,encoding="utf-8").read()
old="{ t: '104345. https://doi.org/10.1016/j.actpsy.2024.104345' }"
new="{ t: ', 104345. https://doi.org/10.1016/j.actpsy.2024.104345' }"
print("found:", s.count(old))
s=s.replace(old,new)
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
