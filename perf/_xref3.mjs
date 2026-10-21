const qs = [
  "cross-platform news use fragmentation audience duplication",
  "algorithmic curation social media feed exposure users",
  "multi-platform information environment audiences news repertoires",
];
for (const q of qs) {
  const url = "https://api.crossref.org/works?rows=10&select=title,author,issued,container-title,DOI,volume,issue,page&filter=from-pub-date:2023-01-01,until-pub-date:2026-12-31,type:journal-article&query.bibliographic=" + encodeURIComponent(q);
  const r = await fetch(url, { headers: { "User-Agent": "ksync-refs/1.0 (mailto:student@example.com)" } });
  const j = await r.json();
  console.log("\n### " + q);
  for (const it of j.message.items) {
    const a = (it.author || []).map(x => (x.family||"")+" "+((x.given||"").match(/[A-Z]/g)||[]).join("")).join("; ");
    console.log(`- ${it.title?.[0]?.slice(0,110)}`);
    console.log(`  ${a.slice(0,70)} | ${it["container-title"]?.[0]} | ${it.issued?.["date-parts"]?.[0]?.[0]} | ${it.volume||""}(${it.issue||""}) ${it.page||""} | ${it.DOI}`);
  }
}
