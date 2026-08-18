import fs from 'fs';

let content = fs.readFileSync('src/components/FAQSection.tsx', 'utf8');

// Add itemScope to the wrapper
content = content.replace(
  /<div className="space-y-4">/g,
  '<div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">'
);

// Add itemScope to each question wrapper
content = content.replace(
  /<div\s+key=\{faq\.id\}\s+className="bg-white/g,
  '<div key={faq.id} className="bg-white'
);

// It's easier to use regex on the div that wraps the FAQ item
content = content.replace(
  /key=\{faq\.id\}\s*\n\s*className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md dark:shadow-none"/g,
  'key={faq.id} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md dark:shadow-none"'
);

// Add itemProp to the question text
content = content.replace(
  /<h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-left">/g,
  '<h3 itemProp="name" className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-left">'
);

// Add itemScope and itemType to the answer wrapper
content = content.replace(
  /<div className="p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800\/50 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">/g,
  '<div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" className="p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800/50 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">'
);

// Add itemProp to the answer text
content = content.replace(
  /<p>\{faq\.a\}<\/p>/g,
  '<p itemProp="text">{faq.a}</p>'
);

fs.writeFileSync('src/components/FAQSection.tsx', content);
