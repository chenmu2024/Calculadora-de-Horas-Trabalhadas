import fs from 'fs';

let content = fs.readFileSync('src/components/BlogSection.tsx', 'utf8');

content = content.replace(/loading="lazy"\s*decoding="async"\s*className="([^"]+)"\s*loading="lazy"\s*decoding="async"/g, 'className="$1" loading="lazy" decoding="async"');

fs.writeFileSync('src/components/BlogSection.tsx', content);
