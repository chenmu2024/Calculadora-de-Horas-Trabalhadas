import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

if (!content.includes('hreflang')) {
  content = content.replace(
    /<link rel="canonical" href="([^"]+)" \/>/g,
    '<link rel="canonical" href="$1" />\n    <link rel="alternate" hreflang="pt-BR" href="$1" />'
  );
  fs.writeFileSync('index.html', content);
}
