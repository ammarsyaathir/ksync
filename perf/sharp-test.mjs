// perf/sharp-test.mjs — can we rasterise an SVG to PNG with sharp?
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60">
  <rect width="240" height="60" rx="8" fill="#7c3aed"/>
  <text x="12" y="38" font-family="Arial" font-size="20" fill="white">sharp OK</text>
</svg>`;
const buf = await sharp(Buffer.from(svg)).png().toBuffer();
console.log('sharp produced PNG bytes:', buf.length);
// also test a small bar chart shape with a rotated axis label
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120">
  <g font-family="Arial" font-size="9" fill="#334155">
    <text x="4" y="14">TikTok</text><rect x="60" y="6" width="90" height="11" fill="#ec4899"/>
    <text x="154" y="14">56.7%</text>
  </g>
</svg>`;
const buf2 = await sharp(Buffer.from(svg2)).png().toBuffer();
console.log('sharp chart PNG bytes:', buf2.length);
