import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const PAGE_SUBTITLES = `const PAGE_SUBTITLES: Record<string, string> = {
  daily: 'Calcule o total de horas trabalhadas no dia com batida de ponto de 4 horários e intervalo de almoço. Resultado instantâneo no padrão CLT.',
  timesheet: 'Calcule o cartão de ponto da semana completa. Apuração automática de horas normais, banco de horas e saldo de horas extras.',
  monthly: 'Calcule o total de horas trabalhadas no mês inteiro com simulação completa do divisor 220, saldo de horas e total a receber.',
  banco: 'Descubra se você tem horas a compensar ou a receber como hora extra conforme a convenção CLT.',
  sum: 'Ferramenta rápida para somar e subtrair horas e minutos. Ideal para conferir cartões de ponto, atestados e relatórios de ponto.',
  holerite: 'Simule o seu holerite completo com cálculo de salário líquido, descontos de INSS, IRRF, vale transporte e adicionais.',
  rescisao: 'Simule o cálculo exato de rescisão: aviso prévio, saldo de salário, 13º proporcional, férias com 1/3 e multa do FGTS.',
  rate: 'Descubra exatamente quanto vale a sua hora de trabalho com base no salário bruto e divisor oficial CLT.',
  overtime: 'Calcule o valor exato das suas horas extras com adicional de 50% em dias úteis e 100% aos domingos e feriados.',
  night: 'Calcule o valor do adicional noturno de 20% e a redução da hora ficta (52min30s) para jornadas noturnas na CLT.',
  excel: 'Modelos de planilhas prontas para controle de ponto diário, semanal e mensal em Excel com fórmulas automáticas.',
  blog: 'Aprenda tudo sobre regras de ponto, tolerância de 10 minutos, intervalo intrajornada, adicional noturno e divisor 220 da CLT.',
  about: 'Conheça nossa missão, transparência, precisão dos cálculos e compromisso com os direitos trabalhistas no Brasil.',
  contact: 'Entre em contato com nossa equipe para dúvidas sobre cálculos, report de divergências ou parcerias comerciais.',
  terms: 'Aviso legal e termos de utilização das ferramentas de cálculo de horas trabalhadas do portal.',
  privacy: 'Entenda como garantimos a total privacidade dos seus dados. Processamento 100% no seu navegador.'
};
`;

if (!content.includes('PAGE_SUBTITLES')) {
  content = content.replace(
    'const PAGE_H1_TITLES: Record<string, string> = {',
    PAGE_SUBTITLES + '\nconst PAGE_H1_TITLES: Record<string, string> = {'
  );
  
  content = content.replace(
    /<p className="text-neutral-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">\s*Ferramenta gratuita para calcular <strong>horas trabalhadas no dia, na semana e no mês<\/strong>, intervalo de almoço, valor da hora, horas extras \(50% e 100%\) e adicional noturno no padrão CLT\.\s*<\/p>/,
    `<p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">\n            {PAGE_SUBTITLES[activeTab] || 'Ferramenta gratuita para calcular horas trabalhadas no dia, na semana e no mês, intervalo de almoço, valor da hora, horas extras (50% e 100%) e adicional noturno no padrão CLT.'}\n          </p>`
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
