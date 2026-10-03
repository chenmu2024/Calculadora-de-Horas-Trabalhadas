import { ARTICLE_META } from '../utils/articles';
import { useEffect } from 'react';

interface SEOHeadProps {
  activeTab: string;
  pathname?: string;
}

export const PAGE_META: Record<string, { title: string; description: string; canonical: string }> = {
  daily: {
    title: 'Calculadora de Horas Trabalhadas Diária - CLT',
    description: 'Calcule o total de horas trabalhadas no dia com batida de ponto de 4 horários e intervalo de almoço. Resultado instantâneo no padrão CLT com horas extras.',
    canonical: 'https://calculadoradehorastrabalhadas.org/'
  },
  timesheet: {
    title: 'Cartão de Ponto Semanal e Apuração de Horas CLT',
    description: 'Calcule o cartão de ponto da semana completa. Apuração automática de horas normais, banco de horas e saldo de horas extras para escala de 44h.',
    canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-semanal'
  },
  monthly: {
    title: 'Calculadora de Horas Trabalhadas Mensal - CLT',
    description: 'Calcule o total de horas trabalhadas no mês inteiro. Simulação completa com divisor 220, saldo de horas e total a receber.',
    canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-mensal'
  },
  escala12x36: {
    title: 'Calculadora de Escala 12x36 CLT - Plantões, Noturno e Feriados',
    description: 'Calcule horas trabalhadas na escala 12x36, adicional noturno urbano com prorrogação (Súmula 60 TST), feriados em dobro e salário bruto.',
    canonical: 'https://calculadoradehorastrabalhadas.org/escala-12x36'
  },
  faltas: {
    title: 'Calculadora de Desconto de Faltas, Atrasos e Perda do DSR CLT',
    description: 'Calcule o desconto no salário por atrasos em minutos, faltas injustificadas e reflexo na perda do DSR conforme o Artigo 6º da Lei 605/49.',
    canonical: 'https://calculadoradehorastrabalhadas.org/atrasos-e-faltas'
  },
  ferias: {
    title: 'Calculadora de Férias CLT 2026 - 1/3 Constitucional, Venda e Impostos',
    description: 'Calcule o valor exato a receber de férias com 1/3 constitucional, abono pecuniário (venda de 10 dias), adiantamento de 13º e descontos INSS/IRRF.',
    canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-de-ferias'
  },
  decimo: {
    title: 'Calculadora de 13º Salário 2026 - 1ª e 2ª Parcelas CLT',
    description: 'Calcule o valor exato da 1ª e 2ª parcela do 13º salário. Apuração proporcional com descontos oficiais de INSS e IRRF 2026.',
    canonical: 'https://calculadoradehorastrabalhadas.org/decimo-terceiro'
  },
  seguro: {
    title: 'Calculadora de Seguro-Desemprego 2026 - Valor e Parcelas MTE',
    description: 'Simule o valor e a quantidade de parcelas (3 a 5) do seu Seguro-Desemprego conforme a tabela oficial do Ministério do Trabalho 2026.',
    canonical: 'https://calculadoradehorastrabalhadas.org/seguro-desemprego'
  },
  insalubridade: {
    title: 'Calculadora de Insalubridade e Periculosidade CLT 2026',
    description: 'Calcule o adicional de insalubridade (10%, 20%, 40%) e periculosidade (30%) com reflexos no 13º salário, férias e FGTS.',
    canonical: 'https://calculadoradehorastrabalhadas.org/insalubridade-e-periculosidade'
  },
  cltpj: {
    title: 'Calculadora CLT x PJ 2026 - Comparador Salarial e Benefícios',
    description: 'Compare seu salário CLT líquido com propostas PJ. Descubra quanto cobrar como PJ para compensar férias, 13º salário e FGTS.',
    canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-clt-pj'
  },
  banco: {
    title: 'Calculadora de Banco de Horas e Saldo - CLT',
    description: 'Calcule o saldo do seu banco de horas. Descubra se você tem horas a compensar ou a receber como hora extra conforme a convenção CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/banco-de-horas'
  },
  sum: {
    title: 'Somador de Horas Online Grátis - Somar Minutos',
    description: 'Ferramenta rápida para somar e subtrair horas e minutos. Ideal para conferir cartões de ponto, atestados e relatórios de ponto.',
    canonical: 'https://calculadoradehorastrabalhadas.org/somador-de-horas'
  },
  holerite: {
    title: 'Simulador de Holerite e Salário Líquido CLT',
    description: 'Simule o seu holerite completo com cálculo de salário líquido, descontos de INSS, IRRF, vale transporte e horas extras com adicionais.',
    canonical: 'https://calculadoradehorastrabalhadas.org/simulador-de-holerite'
  },
  rescisao: {
    title: 'Calculadora de Rescisão Contratual CLT 2026',
    description: 'Simule o cálculo exato de rescisão de trabalho: aviso prévio, saldo de salário, 13º proporcional, férias com 1/3 e multa do FGTS no padrão CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-de-rescisao'
  },
  rate: {
    title: 'Calculadora de Valor da Hora Trabalhada - CLT',
    description: 'Descubra exatamente quanto vale a sua hora de trabalho. Cálculo do valor da hora com base no salário bruto e divisor oficial CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/valor-da-hora'
  },
  overtime: {
    title: 'Calculadora de Horas Extras 50% e 100% - CLT',
    description: 'Calcule o valor exato das suas horas extras com adicional de 50% em dias úteis e 100% aos domingos e feriados.',
    canonical: 'https://calculadoradehorastrabalhadas.org/horas-extras'
  },
  night: {
    title: 'Calculadora de Adicional Noturno e Hora Ficta',
    description: 'Calcule o valor do adicional noturno de 20% e a redução da hora ficta (52min30s) para jornadas noturnas na CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/adicional-noturno'
  },
  excel: {
    title: 'Planilha de Controle de Ponto Excel Grátis',
    description: 'Modelos de planilhas prontas para controle de ponto diário, semanal e mensal em Excel com fórmulas automáticas de saldo e horas extras.',
    canonical: 'https://calculadoradehorastrabalhadas.org/planilha-excel-ponto'
  },
  blog: {
    title: 'Guia Completo da CLT e Horas Trabalhadas 2026',
    description: 'Aprenda tudo sobre regras de ponto, tolerância de 10 minutos, intervalo intrajornada, adicional noturno e divisor 220 da CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/guia-clt'
  },
  about: {
    title: 'Sobre Nós - Calculadora de Horas Trabalhadas',
    description: 'Conheça nossa missão, transparência, precisão dos cálculos e compromisso com os direitos trabalhistas no Brasil.',
    canonical: 'https://calculadoradehorastrabalhadas.org/sobre'
  },
  contact: {
    title: 'Fale Conosco - Atendimento e Suporte CLT',
    description: 'Entre em contato com nossa equipe para dúvidas sobre cálculos, report de divergências ou parcerias comerciais.',
    canonical: 'https://calculadoradehorastrabalhadas.org/contato'
  },
  terms: {
    title: 'Termos de Uso e Condições de Serviço - CLT',
    description: 'Aviso legal e termos de utilização das ferramentas de cálculo de horas trabalhadas do portal calculadoradehorastrabalhadas.org.',
    canonical: 'https://calculadoradehorastrabalhadas.org/termos'
  },
  privacy: {
    title: 'Política de Privacidade e Conformidade LGPD',
    description: 'Entenda como garantimos a total privacidade dos seus dados. Processamento 100% no seu navegador sem armazenamento em servidores.',
    canonical: 'https://calculadoradehorastrabalhadas.org/privacidade'
  },
  'not-found': {
    title: '404 - Página Não Encontrada | Calculadora de Horas',
    description: 'A página que você está procurando não existe ou foi movida.',
    canonical: 'https://calculadoradehorastrabalhadas.org/404'
  }
};

export default function SEOHead({ activeTab, pathname }: SEOHeadProps) {
  useEffect(() => {
    const article = ARTICLE_META.find(row => pathname === `/guia-clt/${row.slug}`);
    const meta = article ? { ...article, canonical: `https://calculadoradehorastrabalhadas.org/guia-clt/${article.slug}` } : PAGE_META[activeTab] || PAGE_META.daily;
    document.title = meta.title;

    // Update Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', meta.description);
    } else {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      descMeta.setAttribute('content', meta.description);
      document.head.appendChild(descMeta);
    }

    // Update Open Graph and Twitter Card Metas
    const setMetaTag = (property: string, content: string, isProperty = true) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    setMetaTag('og:title', meta.title);
    setMetaTag('og:description', meta.description);
    setMetaTag('og:url', meta.canonical);
    setMetaTag('og:type', 'website');
    setMetaTag('og:locale', 'pt_BR');
    setMetaTag('og:site_name', 'Calculadora de Horas Trabalhadas');
    setMetaTag('og:image', 'https://calculadoradehorastrabalhadas.org/og-image.png');
    setMetaTag('og:updated_time', '2026-08-18T12:00:00+00:00');
    if (activeTab === 'blog') {
      setMetaTag('article:published_time', '2026-01-01T12:00:00+00:00');
      setMetaTag('article:modified_time', '2026-08-18T12:00:00+00:00');
    }

    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:title', meta.title, false);
    setMetaTag('twitter:description', meta.description, false);
    setMetaTag('twitter:image', 'https://calculadoradehorastrabalhadas.org/og-image.png', false);
    setMetaTag('twitter:url', meta.canonical, false);
    setMetaTag('robots', activeTab === 'not-found' ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', false);

    // Update Canonical & Hreflang Tags
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', meta.canonical);
    }

    const updateHreflang = (lang: string, href: string) => {
      let tag = document.querySelector(`link[hreflang="${lang}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'alternate');
        tag.setAttribute('hreflang', lang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    updateHreflang('pt-BR', meta.canonical);
    document.querySelector('link[hreflang="pt-PT"]')?.remove();
    updateHreflang('x-default', meta.canonical);

    // Inject/Update Dynamic JSON-LD Structured Data
    let schemaScript = document.getElementById('jsonld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'jsonld-schema';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    // Dynamic HowTo & FAQ Generator per tool tab
    const getTabHowToAndFAQs = (tab: string) => {
      switch (tab) {
        case 'escala12x36':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o salário e horas na escala 12x36 CLT",
              "description": "Passo a passo para apurar plantões, adicional noturno, hora ficta e feriados na escala 12x36.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe seu salário bruto e número de plantões", "text": "Insira o salário contratual e o número de plantões realizados (geralmente 15 em meses de 30 dias e 16 em meses de 31 dias)." },
                { "@type": "HowToStep", "position": 2, "name": "Selecione o turno (Diurno ou Noturno)", "text": "No turno noturno (19h às 07h), o sistema aplica a hora ficta reduzida (52m30s) e adicional noturno de 20% com prorrogação após as 05h (Súmula 60 TST)." },
                { "@type": "HowToStep", "position": 3, "name": "Verifique feriados trabalhados e insalubridade", "text": "Confira o pagamento de plantões em feriados e o resumo de ganhos brutos totais no mês." }
              ]
            },
            faqs: [
              { "name": "Quantas horas mensais tem a escala 12x36?", "answer": "Em um mês de 30 dias com 15 plantões de 12 horas, o total é de 180 horas físicas trabalhadas. Em meses de 31 dias com 16 plantões, o total é de 192 horas." },
              { "name": "Como funciona o adicional noturno na escala 12x36?", "answer": "Pela Súmula 60 do TST, no plantão das 19h às 07h, as horas das 22h às 05h recebem adicional noturno de 20% com hora ficta de 52m30s, e as horas prorrogadas das 05h às 07h continuam remuneradas com adicional noturno." },
              { "name": "Feriado na escala 12x36 é pago em dobro?", "answer": "O Artigo 59-A da CLT estabelece que o salário mensal já remunera os descansos, mas diversas Convenções Coletivas (CCT) e a jurisprudência da Súmula 444 do TST garantem o pagamento em dobro de plantões em feriados." }
            ]
          };
        case 'faltas':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular descontos de faltas, atrasos e perda do DSR na CLT",
              "description": "Passo a passo para apurar descontos salariais por minutos de atraso, faltas sem atestado e perda do repouso semanal.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o salário mensal e carga horária", "text": "Digite o salário bruto contratual e a jornada semanal para apuração do valor do minuto e do dia trabalhado (divisor 30)." },
                { "@type": "HowToStep", "position": 2, "name": "Insira os minutos de atraso e faltas", "text": "Informe os minutos acumulados que ultrapassaram a tolerância legal de 10 min/dia e os dias de falta sem justificativa legal." },
                { "@type": "HowToStep", "position": 3, "name": "Calcule a perda do DSR", "text": "Pelo Art. 6º da Lei 605/49, a ausência injustificada autoriza o desconto de 1 dia de Descanso Semanal Remunerado (domingo)." }
              ]
            },
            faqs: [
              { "name": "Qual é a tolerância legal para atrasos no ponto?", "answer": "O Artigo 58, § 1º da CLT e a Súmula 366 do TST estabelecem tolerância de até 5 minutos por registro, com teto de 10 minutos no dia. Se ultrapassar 10 minutos, desconta-se a totalidade do atraso." },
              { "name": "Falta injustificada desconta o domingo (DSR)?", "answer": "Sim. De acordo com o Artigo 6º da Lei nº 605/1949, para ter direito à remuneração do repouso semanal, o empregado deve ter trabalhado durante toda a semana anterior sem faltas não justificadas." },
              { "name": "Quais faltas são abonadas pela CLT?", "answer": "Faltas justificadas pelo Art. 473 da CLT (como casamento, falecimento de parentes diretos, nascimento de filho, doação de sangue e atestado médico) não podem ser descontadas nem causam perda do DSR." }
            ]
          };
        case 'ferias':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o valor das Férias CLT com 1/3 e Abono Pecuniário",
              "description": "Passo a passo para calcular férias proporcionais, 1/3 constitucional, venda de 10 dias e descontos legais.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Insira o salário bruto e período de férias", "text": "Digite o salário atual e selecione a quantidade de dias a usufruir (30, 20 ou 15 dias)." },
                { "@type": "HowToStep", "position": 2, "name": "Decida sobre o abono pecuniário (venda de dias)", "text": "Pelo Art. 143 da CLT, o trabalhador pode converter até 1/3 do período (10 dias) em dinheiro com isenção de INSS e IRRF." },
                { "@type": "HowToStep", "position": 3, "name": "Confira o valor líquido a receber 2 dias antes", "text": "O sistema calcula o 1/3 constitucional, deduz o INSS e IRRF progressivos de 2026 e exibe o valor líquido exato que deve estar na conta até 2 dias antes do início do gozo (Art. 145 CLT)." }
              ]
            },
            faqs: [
              { "name": "Quando as férias devem ser pagas pelo empregador?", "answer": "Pelo Artigo 145 da CLT, o pagamento das férias e do 1/3 constitucional deve ser efetuado até 2 (dois) dias antes do início do período de gozo." },
              { "name": "Vender 10 dias de férias (abono pecuniário) tem desconto de INSS?", "answer": "Não. O valor recebido referente ao abono pecuniário e seu respectivo 1/3 constitucional tem natureza indenizatória e é 100% isento de descontos de INSS e Imposto de Renda." },
              { "name": "Pode dividir as férias em quantas vezes?", "answer": "Com a Reforma Trabalhista (Art. 134, § 1º da CLT), as férias podem ser usufruídas em até 3 períodos, desde que um deles não seja inferior a 14 dias corridos e os demais não sejam inferiores a 5 dias corridos cada." }
            ]
          };
        case 'decimo':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o 13º Salário (1ª e 2ª Parcelas)",
              "description": "Passo a passo para calcular as parcelas do décimo terceiro com base nos meses trabalhados e deduções legais.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o salário bruto e meses trabalhados", "text": "Digite seu salário contratual e selecione quantos meses trabalhou por mais de 15 dias no ano." },
                { "@type": "HowToStep", "position": 2, "name": "Calcule a 1ª parcela (sem descontos)", "text": "A 1ª parcela equivale a 50% do valor bruto devido, sem qualquer desconto de INSS ou IRRF, paga entre 1º de fevereiro e 30 de novembro." },
                { "@type": "HowToStep", "position": 3, "name": "Calcule a 2ª parcela com deduções", "text": "A 2ª parcela (paga até 20 de dezembro) desconta o valor adiantado na 1ª e todas as alíquotas de INSS e IRRF progressivos." }
              ]
            },
            faqs: [
              { "name": "Quais são as datas de pagamento do 13º salário?", "answer": "A 1ª parcela deve ser paga entre 1º de fevereiro e 30 de novembro. A 2ª parcela deve ser creditada impreterivelmente até o dia 20 de dezembro (Lei 4.749/65)." },
              { "name": "A 1ª parcela do 13º tem desconto de INSS ou Imposto de Renda?", "answer": "Não. A 1ª parcela é paga integralmente (50% do valor bruto). Todos os descontos legais de INSS e IRRF incidem exclusivamente na 2ª parcela." },
              { "name": "Como funciona o cálculo proporcional do 13º salário?", "answer": "Para cada mês em que você trabalhou 15 dias ou mais com carteira assinada, você adquire o direito a 1/12 avos do seu salário integral de dezembro." }
            ]
          };
        case 'seguro':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o Seguro-Desemprego 2026",
              "description": "Veja como apurar a média dos 3 últimos salários e determinar a quantidade de parcelas de 3 a 5.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Selecione o número da solicitação", "text": "Escolha se é a 1ª, 2ª ou 3ª solicitação do benefício para validar os meses de carência exigidos por lei." },
                { "@type": "HowToStep", "position": 2, "name": "Informe os 3 últimos salários recebidos", "text": "Digite o salário bruto dos últimos 3 meses antes da rescisão para obter a média salarial apurada." },
                { "@type": "HowToStep", "position": 3, "name": "Consulte o valor e número de parcelas", "text": "A calculadora aplica as faixas oficiais de cálculo do MTE 2026 e o piso de R$ 1.621,00." }
              ]
            },
            faqs: [
              { "name": "Qual é o valor mínimo e máximo do Seguro-Desemprego em 2026?", "answer": "O valor mínimo de cada parcela é de R$ 1.621,00 (Salário Mínimo 2026) e o teto máximo fixado pelo Ministério do Trabalho é de R$ 2.518,65." },
              { "name": "Quantos meses de carteira assinada preciso para pedir seguro-desemprego?", "answer": "Na 1ª solicitação, são exigidos pelo menos 12 meses nos últimos 18 meses. Na 2ª solicitação, 9 meses nos últimos 12 meses. A partir da 3ª, bastam 6 meses ininterruptos." },
              { "name": "Qual o prazo para dar entrada no seguro-desemprego?", "answer": "O trabalhador tem do 7º ao 120º dia corrido após a data da demissão sem justa causa para solicitar o benefício no portal Gov.br ou aplicativo Carteira de Trabalho Digital." }
            ]
          };
        case 'insalubridade':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular Insalubridade e Periculosidade",
              "description": "Passo a passo para apurar o valor do adicional de insalubridade (10%, 20%, 40%) ou periculosidade (30%) e seus reflexos.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Escolha entre Insalubridade e Periculosidade", "text": "Defina se o risco decorre de agentes nocivos à saúde (insalubre) ou perigo iminente de morte/eletricidade/motocicleta (perigoso)." },
                { "@type": "HowToStep", "position": 2, "name": "Defina a base e o grau percentual", "text": "Para insalubridade, selecione o grau mínimo (10%), médio (20%) ou máximo (40%) sobre o salário mínimo. Para periculosidade, a alíquota é de 30% sobre o salário base." },
                { "@type": "HowToStep", "position": 3, "name": "Apure os reflexos trabalhistas", "text": "O valor integra a remuneração para fins de 13º salário, férias com 1/3 constitucional, horas extras e FGTS." }
              ]
            },
            faqs: [
              { "name": "Qual é a base de cálculo do adicional de insalubridade?", "answer": "Pela jurisprudência do STF (Súmula Vinculante nº 4), o adicional de insalubridade é calculado sobre o Salário Mínimo Nacional, salvo se a Convenção Coletiva de Trabalho (CCT) estabelecer o salário base da categoria." },
              { "name": "Pode receber insalubridade e periculosidade ao mesmo tempo?", "answer": "Não. Conforme o Artigo 193, § 2º da CLT e súmulas do TST, os adicionais não são cumulativos para a mesma atividade; o trabalhador pode optar pelo que for mais vantajoso." }
            ]
          };
        case 'cltpj':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como comparar proposta de trabalho CLT vs PJ",
              "description": "Veja como colocar na balança o salário líquido CLT, pacote de benefícios e impostos do Simples Nacional.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Preencha o salário CLT e benefícios", "text": "Digite seu salário bruto, vale refeição, plano de saúde e previdência oferecidos pela empresa." },
                { "@type": "HowToStep", "position": 2, "name": "Informe a proposta e despesas da empresa PJ", "text": "Insira o valor negociado da nota fiscal PJ, alíquota estimada do Simples (ex: 6% Anexo III) e custos com contador." },
                { "@type": "HowToStep", "position": 3, "name": "Compare o líquido livre e o multiplicador ideal", "text": "A ferramenta calcula a regra padrão do mercado (1.55x a 1.8x) para garantir que você não perca dinheiro ao abrir CNPJ." }
              ]
            },
            faqs: [
              { "name": "Quanto cobrar como PJ para empatar com a CLT?", "answer": "A regra prática recomendada por consultores de RH e contabilidade é multiplicar o salário bruto CLT por 1,55 a 1,80 para cobrir 13º, férias remuneradas, FGTS, plano de saúde e impostos do CNPJ." },
              { "name": "Qual imposto um profissional PJ paga no Simples Nacional?", "answer": "Prestadores de serviços no Simples Nacional podem pagar a partir de 6% (Anexo III com Fator R) ou 15,5% (Anexo V), além da contribuição previdenciária (INSS de 11%) sobre o pró-labore." }
            ]
          };
        case 'rescisao':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o valor da rescisão contratual CLT",
              "description": "Passo a passo para calcular aviso prévio, saldo de salário, 13º proporcional, férias vencidas/proporcionais e multa do FGTS.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o salário bruto e datas", "text": "Insira o valor do último salário mensal, a data de admissão e a data de demissão." },
                { "@type": "HowToStep", "position": 2, "name": "Escolha o tipo de demissão", "text": "Selecione entre demissão sem justa causa, pedido de demissão, justa causa ou acordo mútuo (Art. 484-A CLT)." },
                { "@type": "HowToStep", "position": 3, "name": "Confira os direitos e valores liquidados", "text": "Veja o resumo com saldo de salário, aviso prévio indenizado/trabalhado, 13º com 1/12, férias + 1/3 e multa rescisória do FGTS de 40% ou 20%." }
              ]
            },
            faqs: [
              { "name": "Qual é o prazo para pagamento das verbas rescisórias?", "answer": "Conforme o Artigo 477 da CLT, o empregador tem até 10 dias corridos a contar do término do contrato para efetuar o pagamento integral das verbas." },
              { "name": "Como funciona a demissão por acordo mútuo (Art. 484-A CLT)?", "answer": "No acordo mútuo, o trabalhador recebe 50% do aviso prévio indenizado, multa do FGTS reduzida para 20% e pode sacar até 80% do saldo retido na conta do FGTS." },
              { "name": "Como é calculado o aviso prévio proporcional?", "answer": "O aviso prévio é de 30 dias para contratos de até 1 ano, acrescido de 3 dias por ano trabalhado completo, até o limite de 90 dias (Lei 12.506/2011)." }
            ]
          };
        case 'holerite':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o salário líquido e descontos do holerite",
              "description": "Aprenda a calcular o salário líquido oficial deduzindo INSS progressivo, IRRF e adicionais.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Insira o salário bruto e dependentes", "text": "Informe o salário bruto contratual e o número de dependentes previdenciários." },
                { "@type": "HowToStep", "position": 2, "name": "Adicione horas extras e adicionais", "text": "Adicione horas extras com 50% ou 100%, adicional noturno ou adicionais de insalubridade/periculosidade se houver." },
                { "@type": "HowToStep", "position": 3, "name": "Verifique a folha de pagamento simulada", "text": "A ferramenta aplica as tabelas oficiais do INSS e do Imposto de Renda (IRRF) de 2026 e exibe o contracheque completo." }
              ]
            },
            faqs: [
              { "name": "Como funciona o desconto progressivo do INSS em 2026?", "answer": "O INSS é calculado por faixas salariais progressivas (7,5%, 9%, 12% e 14%) até o teto estipulado pela Portaria Interministerial de 2026." },
              { "name": "Qual é a dedução por dependente no Imposto de Renda (IRRF)?", "answer": "Cada dependente cadastrado abate R$ 189,59 na base de cálculo mensal do Imposto de Renda Retido na Fonte." }
            ]
          };
        case 'banco':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o saldo do Banco de Horas",
              "description": "Veja como apurar saldo positivo ou negativo de horas a compensar.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o saldo inicial do banco", "text": "Digite o saldo anterior (em crédito ou débito) em horas e minutos." },
                { "@type": "HowToStep", "position": 2, "name": "Cadastre os lançamentos diários", "text": "Insira as horas de crédito (horas extras trabalhadas) e débito (folgas ou saídas antecipadas)." },
                { "@type": "HowToStep", "position": 3, "name": "Consulte o saldo acumulado e valor financeiro", "text": "A calculadora exibe o saldo líquido acumulado e estimativa financeira em reais caso seja pago na rescisão." }
              ]
            },
            faqs: [
              { "name": "Qual é o prazo para compensar o banco de horas?", "answer": "Por acordo individual escrito, o prazo máximo é de 6 meses. Por convenção ou acordo coletivo de trabalho, o prazo se estende por até 1 ano." },
              { "name": "O que acontece com as horas pendentes no final do contrato?", "answer": "Se houver saldo positivo ao término do contrato de trabalho, o empregador deve pagar todas as horas acumuladas com o acréscimo de hora extra de no mínimo 50%." }
            ]
          };
        case 'overtime':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular horas extras 50% e 100% com DSR",
              "description": "Passo a passo para calcular o valor das horas extras em dias úteis, domingos e reflexo no repouso semanal.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Insira seu salário base e carga horária", "text": "Digite o valor do salário bruto mensal e selecione a jornada (220h, 200h ou 180h)." },
                { "@type": "HowToStep", "position": 2, "name": "Informe a quantidade de horas extras", "text": "Digite o número de horas extras prestadas a 50% (dias úteis) e 100% (domingos e feriados)." },
                { "@type": "HowToStep", "position": 3, "name": "Calcule o DSR (Súmula 172 TST)", "text": "A ferramenta aplica a fórmula oficial: (Total de Horas Extras / Dias Úteis) x (Domingos e Feriados)." }
              ]
            },
            faqs: [
              { "name": "Qual é o percentual mínimo de hora extra na CLT?", "answer": "Pelo Artigo 59 da CLT, a hora extra em dias normais de trabalho deve ter acréscimo de no mínimo 50% sobre o valor da hora normal." },
              { "name": "Quando a hora extra deve ser paga a 100%?", "answer": "A hora extra prestada em domingos e feriados não compensados com folga na mesma semana deve ser paga com adicional de 100%." }
            ]
          };
        case 'night':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o Adicional Noturno e a Hora Ficta Reduzida",
              "description": "Passo a passo para calcular a jornada entre 22h e 5h com redução de 52min30s por hora e adicional de 20%.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o horário de entrada e saída noturna", "text": "Digite o horário em que iniciou e finalizou o trabalho (ex: 22:00 às 05:00)." },
                { "@type": "HowToStep", "position": 2, "name": "Indique o valor da hora de trabalho", "text": "Insira o valor da sua hora normal de trabalho ou o seu salário base para aplicação do divisor." },
                { "@type": "HowToStep", "position": 3, "name": "Apure a conversão da hora reduzida e o adicional", "text": "A ferramenta converte automaticamente o tempo relógio em horas fictas noturnas (multiplicando por 60/52.5) e calcula o valor do adicional noturno de 20%." }
              ]
            },
            faqs: [
              { "name": "O que é hora ficta noturna?", "answer": "Na jornada urbana, cada hora trabalhada entre 22h e 5h é computada como 52 minutos e 30 segundos, fazendo com que 7 horas relógio equivalham a 8 horas de trabalho." },
              { "name": "O que diz a Súmula 60 do TST sobre prorrogação de jornada noturna?", "answer": "Cumprida integralmente a jornada no período noturno e prorrogada esta, é devido também o adicional noturno quanto às horas prorrogadas no período diurno." }
            ]
          };
        case 'rate':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o valor da hora de trabalho CLT",
              "description": "Veja como encontrar o valor da sua hora dividindo seu salário pelo divisor da jornada (220h, 200h ou 180h).",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Informe o seu salário mensal bruto", "text": "Digite o salário registrado na carteira sem descontos." },
                { "@type": "HowToStep", "position": 2, "name": "Selecione o divisor mensal ou a jornada semanal", "text": "Escolha entre 220 horas (44h semanais), 200 horas (40h semanais) ou 180 horas (36h semanais)." },
                { "@type": "HowToStep", "position": 3, "name": "Veja o resultado do valor hora e acréscimos", "text": "A calculadora apresenta o valor exato da hora normal, hora extra 50%, 100% e adicional noturno." }
              ]
            },
            faqs: [
              { "name": "Qual é o divisor padrão da CLT para 44 horas semanais?", "answer": "O divisor padrão oficial para quem cumpre jornada de 44 horas semanais é de 220 horas mensais." },
              { "name": "Qual divisor usar para quem trabalha 40 horas por semana?", "answer": "Para jornada de 40 horas semanais (sem expediente aos sábados), o divisor utilizado é de 200 horas mensais." }
            ]
          };
        case 'timesheet':
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o Cartão de Ponto Semanal",
              "description": "Passo a passo para somar os pontos da semana inteira e conferir se houve horas extras ou falta de horas.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Insira a carga horária contratual semanal", "text": "Defina o limite de horas da semana (ex: 44 horas ou 40 horas)." },
                { "@type": "HowToStep", "position": 2, "name": "Preencha as batidas de ponto de segunda a domingo", "text": "Digite os 4 horários diários de entrada, almoço e saída para cada dia da semana." },
                { "@type": "HowToStep", "position": 3, "name": "Consulte o balanço semanal e exporte", "text": "A ferramenta calcula a soma semanal, compara com a meta de horas e gera o relatório detalhado." }
              ]
            },
            faqs: [
              { "name": "Como funciona o fechamento da folha de ponto semanal?", "answer": "O fechamento compara o total de horas trabalhadas na semana com a jornada contratada, destinando o excedente para banco de horas ou pagamento em horas extras." }
            ]
          };
        case 'blog':
          return {
            article: {
              "@type": "Article",
              "headline": "Guia Completo da CLT e Horas Trabalhadas 2026",
              "description": "Aprenda tudo sobre regras de ponto, tolerância de 10 minutos, intervalo intrajornada, adicional noturno e divisor 220 da CLT.",
              "author": {
                "@type": "Organization",
                "name": "CalculadoraDeHorasTrabalhadas.org"
              },
              "publisher": {
                "@type": "Organization",
                "name": "CalculadoraDeHorasTrabalhadas.org",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://calculadoradehorastrabalhadas.org/favicon.svg"
                }
              },
              "datePublished": "2026-01-01",
              "dateModified": "2026-08-18",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://calculadoradehorastrabalhadas.org/guia-clt"
              }
            },
            faqs: [
              { "name": "Qual é a jornada de trabalho padrão na CLT?", "answer": "A jornada de trabalho padrão máxima permitida pela Constituição Federal é de 8 horas diárias e 44 horas semanais." },
              { "name": "Como é o cálculo de horas extras na CLT?", "answer": "Horas extras são pagas com acréscimo mínimo de 50% em dias úteis, e 100% aos domingos e feriados." },
              { "name": "O que é o adicional noturno?", "answer": "Trabalho realizado entre 22h e 5h (urbano) tem acréscimo mínimo de 20% sobre a hora diurna, além da contagem da hora reduzida de 52m30s." }
            ]
          };
        default:
          return {
            howTo: {
              "@type": "HowTo",
              "name": "Como calcular o ponto e as horas trabalhadas na CLT",
              "description": "Passo a passo rápido para apurar horas de trabalho, intervalo intrajornada e horas extras.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Preencha os horários de entrada e saída", "text": "Insira o horário da manhã (Entrada 1) e o horário de saída para almoço (Saída 1)." },
                { "@type": "HowToStep", "position": 2, "name": "Informe o retorno do intervalo e a saída final", "text": "Informe a volta do almoço (Entrada 2) e o encerramento do expediente (Saída 2)." },
                { "@type": "HowToStep", "position": 3, "name": "Verifique a apuração automática", "text": "A ferramenta calcula instantaneamente o total de horas líquidas, o tempo de intervalo e o saldo de horas extras ou devidas segundo a carga diária." }
              ]
            },
            faqs: [
              { "name": "Como calcular o total de horas trabalhadas no dia?", "answer": "Para calcular o total de horas trabalhadas no dia, subtraia o horário de saída do horário de entrada e desconte o intervalo de almoço." },
              { "name": "Qual é a tolerância de minutos no cartão de ponto pela CLT?", "answer": "Segundo o Artigo 58, § 1º da CLT e a Súmula 366 do TST, há uma tolerância de até 5 minutos por batida, desde que não ultrapasse o limite máximo de 10 minutos diários." },
              { "name": "Como funciona o adicional noturno no cálculo de horas?", "answer": "Na jornada urbana (22h às 05h), o trabalhador tem direito ao adicional de no mínimo 20% sobre o valor da hora normal e à hora ficta reduzida de 52 minutos e 30 segundos." },
              { "name": "O que é o DSR sobre Horas Extras?", "answer": "O Descanso Semanal Remunerado (DSR) sobre Horas Extras é um direito garantido pela Súmula 172 do TST, em que o valor pago a título de horas extras deve refletir no repouso semanal do trabalhador." }
            ]
          };
      }
    };

    const tabSchemaData = getTabHowToAndFAQs(activeTab);

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://calculadoradehorastrabalhadas.org/#website",
          "url": "https://calculadoradehorastrabalhadas.org/",
          "name": "Calculadora de Horas Trabalhadas CLT",
          "description": meta.description,
          "publisher": {
            "@id": "https://calculadoradehorastrabalhadas.org/#organization"
          },
          "inLanguage": "pt-BR"
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://calculadoradehorastrabalhadas.org/#webapp",
          "url": meta.canonical,
          "name": meta.title.split('-')[0].trim(),
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Timesheet & Payroll Calculator",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "description": meta.description,
          "inLanguage": "pt-BR",
          "softwareVersion": "2026.3.0",
          "featureList": [
            "Cálculo de horas trabalhadas com desconto de intervalo intrajornada",
            "Calculadora de escala 12x36 com hora noturna e feriados",
            "Cálculo de desconto de faltas, atrasos e perda do DSR (Lei 605/49)",
            "Calculadora de férias CLT com 1/3 constitucional e abono pecuniário",
            "Simulação completa de holerite com INSS progressivo e IRRF",
            "Cálculo de horas extras 50% e 100% com reflexo no DSR (Súmula 172 TST)",
            "Apuração de adicional noturno urbano com hora ficta reduzida de 52m30s",
            "Cálculo de rescisão contratual CLT com aviso prévio e FGTS",
            "Controle e compensação de saldo de banco de horas",
            "Relatórios detalhados com impressão e exportação em PDF e Excel"
          ],
          "author": {
            "@id": "https://calculadoradehorastrabalhadas.org/#author"
          },
          "publisher": {
            "@id": "https://calculadoradehorastrabalhadas.org/#organization"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BRL"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://calculadoradehorastrabalhadas.org/#organization",
          "name": "CalculadoraDeHorasTrabalhadas.org",
          "url": "https://calculadoradehorastrabalhadas.org/",
          "logo": "https://calculadoradehorastrabalhadas.org/favicon.svg",
          "knowsAbout": ["Legislação Trabalhista CLT", "Cálculo de Horas Extras", "Holerite e Folha de Pagamento", "Rescisão de Contrato de Trabalho", "Súmulas TST e Reforma Trabalhista"],
          "publishingPrinciples": "https://calculadoradehorastrabalhadas.org/sobre"
        },
        {
          "@type": "Person",
          "@id": "https://calculadoradehorastrabalhadas.org/#author",
          "name": "Equipe de Especialistas em Legislação Trabalhista",
          "jobTitle": "Consultores em Recursos Humanos e Direito do Trabalho",
          "worksFor": {
            "@id": "https://calculadoradehorastrabalhadas.org/#organization"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": "https://calculadoradehorastrabalhadas.org/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": meta.title.split('-')[0].trim(),
              "item": meta.canonical
            }
          ]
        }
      ]
    };

    if (tabSchemaData.howTo) {
      structuredData["@graph"].push(tabSchemaData.howTo as any);
    }
    if (tabSchemaData.article) {
      structuredData["@graph"].push(tabSchemaData.article as any);
    }

    structuredData["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": tabSchemaData.faqs.map(f => ({
        "@type": "Question",
        "name": f.name,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    } as any);

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [activeTab, pathname]);

  return null;
}
