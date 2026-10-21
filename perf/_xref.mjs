const qs = [
  "algorithmic curation social media information exposure fragmentation",
  "rumour propagation social media correction",
  "misinformation credibility social media users",
  "online community knowledge sharing participation",
  "K-pop fandom social media engagement",
  "event information seeking social media users",
];
const out = [];
for (const q of qs) {
  const url = "https://api.crossref.org/works?rows=6&select=title,author,issued,container-title,DOI,volume,issue,page&filter=from-pub-date:2022-01-01,until-pub-date:2026-12-31,type:journal-article&query.bibliographic=" + encodeURIComponent(q);
  const r = await fetch(url, { headers: { "User-Agent": "ksync-refs/1.0 (mailto:student@example.com)" } });
  const j = await r.json();
  console.log("\n### " + q);
  for (const it of j.message.items) {
    const a = (it.author || []).map(x => (x.family || "") + " " + ((x.given||"").split(" ").map(s=>s[0]||"").join("")+". ")).join("; ");
    console.log(`- ${it.title?.[0]}`);
    console.log(`  ${a.slice(0,120)} | ${it["container-title"]?.[0]} | ${it.issued?.["date-parts"]?.[0]?.[0]} | ${it.volume||""}(${it.issue||""}) ${it.page||""} | ${it.DOI}`);
  }
}
