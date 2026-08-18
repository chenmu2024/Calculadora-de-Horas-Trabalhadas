import fs from 'fs';

let content = fs.readFileSync('src/components/SEOHead.tsx', 'utf8');

// Check if datePublished exists in the article schema
if (!content.includes('"datePublished"')) {
  content = content.replace(
    /"author": \{\s*"@type": "Organization",\s*"name": "CalculadoraDeHorasTrabalhadas\.org"\s*\}/g,
    `"author": {
                "@type": "Organization",
                "name": "CalculadoraDeHorasTrabalhadas.org"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Calculadora de Horas Trabalhadas CLT"
              },
              "datePublished": "2026-01-01T12:00:00+00:00",
              "dateModified": "2026-08-08T12:00:00+00:00",
              "image": "https://calculadoradehorastrabalhadas.org/og-image.png"`
  );
  fs.writeFileSync('src/components/SEOHead.tsx', content);
}
