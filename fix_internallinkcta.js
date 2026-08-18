import fs from 'fs';

const file = 'src/components/InternalLinkCTA.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace <button and </button>
content = content.replace(
  /<button\s+key=\{link\.tab\}\s+onClick=\{\(\) => onSelectTab\(link\.tab\)\}/g,
  '<a\n              href={getHrefForTab(link.tab)}\n              key={link.tab}\n              onClick={(e) => { e.preventDefault(); onSelectTab(link.tab); }}'
);
content = content.replace(/<\/button>/g, '</a>');

// add import for getHrefForTab
if (!content.includes('getHrefForTab')) {
  content = content.replace(
    /import \{ Clock, FileSpreadsheet, DollarSign, Moon, ArrowRight, Calculator \} from 'lucide-react';/,
    'import { Clock, FileSpreadsheet, DollarSign, Moon, ArrowRight, Calculator } from \'lucide-react\';\nimport { getHrefForTab } from \'../utils/routes\';'
  );
}

fs.writeFileSync(file, content);
