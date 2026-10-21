import json
J=json.load(open("perf/_v4.json",encoding="utf-8"))
for p in J["paragraphs"]:
    if 85 <= p["i"] <= 108 and p["text"].strip():
        print(p["i"], "|", p["style"], "|", p["text"][:95])
