import io
p="perf/make-figures.mjs"
s=io.open(p,encoding="utf-8").read()
s=s.replace('font-size="26" font-weight="bold" fill="${INK}">${esc(heading)}',
            'font-size="24" font-weight="bold" fill="${INK}">${esc(heading)}')
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
print("heading size 24:", s.count('font-size="24" font-weight="bold" fill="${INK}">${esc(heading)}'))
