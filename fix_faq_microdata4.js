import fs from 'fs';

let content = fs.readFileSync('src/components/FAQSection.tsx', 'utf8');

content = content.replace(
  /<div className="p-4 sm:p-5 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white space-y-4">/g,
  '<div className="p-4 sm:p-5 text-xs sm:text-sm text-neutral-600 leading-relaxed bg-white space-y-4" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">'
);

fs.writeFileSync('src/components/FAQSection.tsx', content);
