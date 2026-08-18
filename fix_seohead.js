import fs from 'fs';

let content = fs.readFileSync('src/components/SEOHead.tsx', 'utf8');

// Add BreadcrumbList schema
if (!content.includes('BreadcrumbList')) {
  content = content.replace(
    /structuredData\["@graph"\]\.push\(\{/g,
    'structuredData["@graph"].push({\n      "@type": "BreadcrumbList",\n      "itemListElement": [\n        {\n          "@type": "ListItem",\n          "position": 1,\n          "name": "Página Inicial",\n          "item": "https://calculadoradehorastrabalhadas.org/"\n        },\n        ...(activeTab !== \'daily\' && activeTab !== \'not-found\' ? [{\n          "@type": "ListItem",\n          "position": 2,\n          "name": meta.title.split(\'|\')[0].trim(),\n          "item": meta.canonical\n        }] : [])\n      ]\n    } as any);\n\n    structuredData["@graph"].push({'
  );
}

// Add og:updated_time
if (!content.includes('og:updated_time')) {
  content = content.replace(
    /setMetaTag\('og:image', 'https:\/\/calculadoradehorastrabalhadas\.org\/og-image\.png'\);/g,
    'setMetaTag(\'og:image\', \'https://calculadoradehorastrabalhadas.org/og-image.png\');\n    setMetaTag(\'og:updated_time\', \'2026-07-26T12:00:00+00:00\');\n    if (activeTab === \'blog\') {\n      setMetaTag(\'article:published_time\', \'2026-01-01T12:00:00+00:00\');\n      setMetaTag(\'article:modified_time\', \'2026-07-26T12:00:00+00:00\');\n    }'
  );
}

fs.writeFileSync('src/components/SEOHead.tsx', content);
