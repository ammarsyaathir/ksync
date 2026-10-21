const r = await fetch("https://api.crossref.org/works/10.1177/20563051251335086", { headers: { "User-Agent": "ksync/1.0 (mailto:student@example.com)" } });
const j = await r.json();
const m = j.message;
console.log("TITLE:", m.title?.[0]);
console.log("AUTHORS:", (m.author||[]).map(a=>`${a.family}, ${a.given}`).join("; "));
console.log("JOURNAL:", m["container-title"]?.[0], "|", m.volume, m.issue, m.page, "|", m.issued["date-parts"][0][0]);
