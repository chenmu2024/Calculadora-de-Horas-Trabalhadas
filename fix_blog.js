const fs = require('fs');

const file = 'src/components/BlogSection.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button\s+onClick=\{\(\) => onSelect\('daily'\)\}\s+className="([^"]+)"\s*>/g,
  '<a href={getHrefForTab(\'daily\')} onClick={(e) => { e.preventDefault(); onSelectCalculator(\'daily\'); }} className="$1 inline-flex">'
).replace(/<\/button>\s*(?=<\!--|{|<|Acessar|Testar|<\/div>)/g, '</a>'); // this might be risky

fs.writeFileSync(file, content);
