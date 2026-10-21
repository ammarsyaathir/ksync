import io, re
s = io.open("perf/ch1-edits-v6.mjs", encoding="utf-8").read()
i = s.find("Zhou, Y.")
print("Zhou at", i)
print(s[max(0,i-400):i+420] if i>=0 else "not found")
