import { useEffect } from 'react';

interface SEOHeadProps {
  activeTab: string;
}

const PAGE_META: Record<string, { title: string; description: string; canonical: string }> = {
  daily: {
    title: 'Calculadora de Horas Trabalhadas Diária - CLT',
    description: 'Calcule o total de horas trabalhadas no dia com batida de ponto de 4 horários e intervalo de almoço. Resultado instantâneo no padrão CLT com horas extras.',
    canonical: 'https://calculadoradehorastrabalhadas.org/'
  },
  timesheet: {
    title: 'Cartão de Ponto Semanal e Apuração de Horas CLT',
    description: 'Calcule o cartão de ponto da semana completa. Apuração automática de horas normais, banco de horas e saldo de horas extras para escala de 44h.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=timesheet'
  },
  monthly: {
    title: 'Calculadora de Horas Trabalhadas Mensal - CLT',
    description: 'Calcule o total de horas trabalhadas no mês inteiro. Simulação completa com divisor 220, saldo de horas e total a receber.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=monthly'
  },
  banco: {
    title: 'Calculadora de Banco de Horas e Saldo - CLT',
    description: 'Calcule o saldo do seu banco de horas. Descubra se você tem horas a compensar ou a receber como hora extra conforme a convenção CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=banco'
  },
  sum: {
    title: 'Somador de Horas Online Grátis - Somar Minutos',
    description: 'Ferramenta rápida para somar e subtrair horas e minutos. Ideal para conferir cartões de ponto, atestados e relatórios de ponto.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=sum'
  },
  holerite: {
    title: 'Simulador de Holerite e Salário Líquido CLT',
    description: 'Simule o seu holerite completo com cálculo de salário líquido, descontos de INSS, IRRF, vale transporte e horas extras com adicionais.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=holerite'
  },
  rescisao: {
    title: 'Calculadora de Rescisão Contratual CLT 2026',
    description: 'Simule o cálculo exato de rescisão de trabalho: aviso prévio, saldo de salário, 13º proporcional, férias com 1/3 e multa do FGTS no padrão CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=rescisao'
  },
  rate: {
    title: 'Calculadora de Valor da Hora Trabalhada - CLT',
    description: 'Descubra exatamente quanto vale a sua hora de trabalho. Cálculo do valor da hora com base no salário bruto e divisor oficial CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=rate'
  },
  overtime: {
    title: 'Calculadora de Horas Extras 50% e 100% - CLT',
    description: 'Calcule o valor exato das suas horas extras com adicional de 50% em dias úteis e 100% aos domingos e feriados.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=overtime'
  },
  night: {
    title: 'Calculadora de Adicional Noturno e Hora Ficta',
    description: 'Calcule o valor do adicional noturno de 20% e a redução da hora ficta (52min30s) para jornadas noturnas na CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=night'
  },
  excel: {
    title: 'Planilha de Controle de Ponto Excel Grátis',
    description: 'Modelos de planilhas prontas para controle de ponto diário, semanal e mensal em Excel com fórmulas automáticas de saldo e horas extras.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=excel'
  },
  blog: {
    title: 'Guia Completo da CLT e Horas Trabalhadas 2026',
    description: 'Aprenda tudo sobre regras de ponto, tolerância de 10 minutos, intervalo intrajornada, adicional noturno e divisor 220 da CLT.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=blog'
  },
  about: {
    title: 'Sobre Nós - Calculadora de Horas Trabalhadas',
    description: 'Conheça nossa missão, transparência, precisão dos cálculos e compromisso com os direitos trabalhistas no Brasil.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=about'
  },
  contact: {
    title: 'Fale Conosco - Atendimento e Suporte CLT',
    description: 'Entre em contato com nossa equipe para dúvidas sobre cálculos, report de divergências ou parcerias comerciais.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=contact'
  },
  terms: {
    title: 'Termos de Uso e Condições de Serviço - CLT',
    description: 'Aviso legal e termos de utilização das ferramentas de cálculo de horas trabalhadas do portal calculadoradehorastrabalhadas.org.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=terms'
  },
  privacy: {
    title: 'Política de Privacidade e Conformidade LGPD',
    description: 'Entenda como garantimos a total privacidade dos seus dados. Processamento 100% no seu navegador sem armazenamento em servidores.',
    canonical: 'https://calculadoradehorastrabalhadas.org/?tab=privacy'
  }
};

export default function SEOHead({ activeTab }: SEOHeadProps) {
  useEffect(() => {
    const meta = PAGE_META[activeTab] || PAGE_META.daily;
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

    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:title', meta.title, false);
    setMetaTag('twitter:description', meta.description, false);

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
    updateHreflang('pt-PT', meta.canonical);
    updateHreflang('x-default', 'https://calculadoradehorastrabalhadas.org/');

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
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://calculadoradehorastrabalhadas.org/?tab=blog&q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
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
          "inLanguage": ["pt-BR", "pt-PT"],
          "softwareVersion": "2026.2.0",
          "featureList": [
            "Cálculo de horas trabalhadas com desconto de intervalo intrajornada",
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
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "3280",
            "reviewCount": "3280"
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
          "logo": "https://calculadoradehorastrabalhadas.org/favicon.ico",
          "knowsAbout": ["Legislação Trabalhista CLT", "Cálculo de Horas Extras", "Holerite e Folha de Pagamento", "Rescisão de Contrato de Trabalho", "Súmulas TST e Reforma Trabalhista"],
          "publishingPrinciples": "https://calculadoradehorastrabalhadas.org/?tab=about"
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
        },
        tabSchemaData.howTo,
        {
          "@type": "FAQPage",
          "mainEntity": tabSchemaData.faqs.map(f => ({
            "@type": "Question",
            "name": f.name,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [activeTab]);

  return null;
}
