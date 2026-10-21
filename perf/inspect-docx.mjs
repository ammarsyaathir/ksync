// perf/inspect-docx.mjs — report page setup, media, rels, content types
import fs from 'node:fs';
import JSZip from 'jszip';
const src = process.argv[2];
const z = await JSZip.loadAsync(fs.readFileSync(src));
console.log('--- entries ---');
for (const f of Object.keys(z.files)) console.log('  ' + f);
const x = await z.file('word/document.xml').async('string');
console.log('\npgSz :', (x.match(/<w:pgSz[^>]*>/) || [''])[0]);
console.log('pgMar:', (x.match(/<w:pgMar[^>]*>/) || [''])[0]);
console.log('sectPr:', (x.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/) || [''])[0].slice(0, 300));
console.log('drawings:', (x.match(/<w:drawing>/g) || []).length, ' picts:', (x.match(/<w:pict>/g) || []).length);
const ct = await z.file('[Content_Types].xml').async('string');
console.log('\npng default declared:', /Extension="png"/.test(ct));
console.log('image content-type override:', /image\/png/.test(ct));
const rels = await z.file('word/_rels/document.xml.rels').async('string');
console.log('rel ids:', [...rels.matchAll(/Id="([^"]+)"/g)].map((m) => m[1]).join(', '));
console.log('\nrels xml:\n' + rels);
