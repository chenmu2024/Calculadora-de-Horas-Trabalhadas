import fs from 'fs';

let content = fs.readFileSync('src/components/SEOHead.tsx', 'utf8');

content = content.replace(
  /"name": meta\.title\.split\('\|'\)\[0\]\.trim\(\)/g,
  '"name": meta.title.split(\'-\')[0].trim()'
);

fs.writeFileSync('src/components/SEOHead.tsx', content);
