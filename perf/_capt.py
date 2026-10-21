import io
p="perf/build-ch1-v6.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace("""      else out += rebuild(p.xml, pl.text);
      rep++;""",
"""      else {
        const nx = rebuild(p.xml, pl.text);
        out += (/^Table 1\\.\\d:/.test(pl.text) ? withKeepNext(nx) : nx);
      }
      rep++;""")
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("ok")
