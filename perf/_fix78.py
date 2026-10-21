import io
p="perf/ch1-edits-v7.mjs"
s=io.open(p,encoding="utf-8").read()
old="rather than from a single badge (Geels et al., 2024), and unverified claims can spread widely before they are resolved (Zhang et al., 2024). In related work, Kim and Lim (2025) found that users\u2019 perceptions of how widely a claim is accepted shape whether they treat it as credible before verifying it."
new="rather than from a single badge (Kim & Lim, 2025), and unverified claims can spread widely before they are resolved (Zhang et al., 2024)."
print("found:", s.count(old))
s=s.replace(old,new)
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
