const dois = ["10.1177/20563051251386721","10.1016/j.actpsy.2024.104345"];
for (const d of dois) {
  const r = await fetch("https://api.crossref.org/works/" + d, { headers: { "User-Agent": "ksync/1.0 (mailto:student@example.com)" } });
  if (!r.ok) { console.log(d, "->", r.status); continue; }
  const m = (await r.json()).message;
  console.log("\nDOI:", d);
  console.log("TITLE:", m.title?.[0]);
  console.log("AUTH:", (m.author||[]).map(a=>`${a.family}, ${(a.given||"").split(" ").map(s=>s[0]+".").join(" ")}`).join("; "));
  console.log("JOURNAL:", m["container-title"]?.[0], "| vol", m.volume, "| iss", m.issue, "| pp", m.page, "| art", m["article-number"], "| year", m.issued["date-parts"][0][0]);
}
