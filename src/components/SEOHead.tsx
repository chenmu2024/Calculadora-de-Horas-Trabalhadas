import { buildStructuredData } from '../utils/structuredData';
import { CONTENT_UPDATED } from '../utils/editorial';
import { ARTICLE_META } from '../utils/articles';
import { useEffect } from 'react';

interface SEOHeadProps {
  activeTab: string;
  pathname?: string;
}

export const PAGE_META: Record<string, { title: string; description: string; canonical: string }> = {
  counter: { title: "Contador de Horas", description: "Calcule o tempo entre dois horários, inclusive ao cruzar a meia-noite. Veja HH:MM e decimal.", canonical: 'https://calculadoradehorastrabalhadas.org/contador-de-horas' },
  decimal: { title: "Horas Decimais: Converter Horas em Decimal", description: "Converta horas decimais nos dois sentidos: HH:MM para decimal e decimal para horas.", canonical: 'https://calculadoradehorastrabalhadas.org/horas-decimais' },
  business: { title: "Calculadora de Dias Úteis", description: "Use o contador de dias uteis entre duas datas, com opções de finais de semana e feriados.", canonical: 'https://calculadoradehorastrabalhadas.org/calculadora-de-dias-uteis' },
  service: { title: "Calculadora de Tempo de Serviço", description: "Calcule o intervalo entre datas em anos, meses e dias, com o total de dias corridos.", canonical: 'https://calculadoradehorastrabalhadas.org/tempo-de-servico' },
  minutes: { title: "Calculadora de Horas e Minutos", description: "Some e subtraia durações com segundos opcionais. Veja total de minutos e horas decimais.", canonical: 'https://calculadoradehorastrabalhadas.org/horas-e-minutos' },
  daily: {
    title: 'Calculadora de Horas | Calculadora de Horas Trabalhadas',
    description: 'Calculadora de horas para calcular horas trabalhadas com entrada, intervalo e saída. Veja horas em decimal, saldo da jornada e hora extra.',
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
    const article = ARTICLE_META.find(row => pathname?.replace(/\/$/, '') === `/guia-clt/${row.slug}`);
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
    setMetaTag('og:type', article ? 'article' : 'website');
    setMetaTag('og:locale', 'pt_BR');
    setMetaTag('og:site_name', 'Calculadora de Horas Trabalhadas');
    setMetaTag('og:image', 'https://calculadoradehorastrabalhadas.org/og-image.png');
    if (activeTab !== 'not-found') setMetaTag('og:updated_time', CONTENT_UPDATED);
    else document.querySelector('meta[property="og:updated_time"]')?.remove();
    document.querySelector('meta[property="article:published_time"]')?.remove();
    if (article) setMetaTag('article:modified_time', CONTENT_UPDATED);
    else document.querySelector('meta[property="article:modified_time"]')?.remove();

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

    const structuredData = buildStructuredData(activeTab, meta);

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [activeTab, pathname]);

  return null;
}
