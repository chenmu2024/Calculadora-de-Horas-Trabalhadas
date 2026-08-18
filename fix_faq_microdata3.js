import fs from 'fs';

let content = fs.readFileSync('src/components/FAQSection.tsx', 'utf8');

content = content.replace(
  /<div className="space-y-3">/g,
  '<div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">'
);

content = content.replace(
  /<div className="p-4 bg-white text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400">/g,
  '<div className="p-4 bg-white text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">'
);

fs.writeFileSync('src/components/FAQSection.tsx', content);
