import fs from 'fs';

const file = 'src/components/SEOContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button\s+onClick=\{\(e\) => handleTabClick\(e, '([^']+)'\)\}\s+className="([^"]+)"\s*>/g,
  '<a href={getHrefForTab(\'$1\')} onClick={(e) => handleTabClick(e, \'$1\')} className="$2">'
).replace(/<\/button>\s*(?=<\!--|{|<Simular|<Verificar|<Conferir|<Calcular|<Baixar)/g, '</a>');

content = content.replace(
  /Simular na Calculadora <ArrowRight className="w-3.5 h-3.5" \/>\s*<\/button>/g,
  'Simular na Calculadora <ArrowRight className="w-3.5 h-3.5" />\n            </a>'
);
content = content.replace(
  /Simular na Calculadora Diária <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Simular na Calculadora Diária <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /Verificar Pausa de Almoço <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Verificar Pausa de Almoço <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /Conferir no Cartão Semanal <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Conferir no Cartão Semanal <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /Calcular Horas Extras \+ DSR <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Calcular Horas Extras + DSR <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /Calcular Noturno e Hora Ficta <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Calcular Noturno e Hora Ficta <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /Baixar Modelo de Espelho de Ponto <ArrowRight className="w-3 h-3" \/>\s*<\/button>/g,
  'Baixar Modelo de Espelho de Ponto <ArrowRight className="w-3 h-3" />\n            </a>'
);
content = content.replace(
  /<span>Calculadora Completa de Valor Hora<\/span>\s*<ArrowRight className="w-3.5 h-3.5" \/>\s*<\/button>/g,
  '<span>Calculadora Completa de Valor Hora</span>\n            <ArrowRight className="w-3.5 h-3.5" />\n          </a>'
);



fs.writeFileSync(file, content);
