import json
d=json.load(open("perf/_v4refs.json",encoding="utf-8"))
for r in d:
    t="".join(x["t"] for x in r["runs"])
    if t.startswith(("Geels","Schaffner")): print(r["idx"], repr(t[:200]))
