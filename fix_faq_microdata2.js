import fs from 'fs';

let content = fs.readFileSync('src/components/FAQSection.tsx', 'utf8');

content = content.replace(
  /<div className="space-y-3 max-w-4xl mx-auto pb-4">/g,
  '<div className="space-y-3 max-w-4xl mx-auto pb-4" itemScope itemType="https://schema.org/FAQPage">'
);

content = content.replace(
  /<div key=\{faq\.id\} className="border border-neutral-200 rounded-xl overflow-hidden transition-all duration-200">/g,
  '<div key={faq.id} className="border border-neutral-200 rounded-xl overflow-hidden transition-all duration-200" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">'
);

content = content.replace(
  /<span className="flex-1">\{faq\.q\}<\/span>/g,
  '<span className="flex-1" itemProp="name">{faq.q}</span>'
);

content = content.replace(
  /<div className="p-4 bg-white text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">/g,
  '<div className="p-4 bg-white text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">'
);

fs.writeFileSync('src/components/FAQSection.tsx', content);
