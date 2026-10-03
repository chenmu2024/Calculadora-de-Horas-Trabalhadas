import { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, Search, ThumbsUp, ThumbsDown, ArrowRight, CheckCircle2, Sparkles, Filter } from 'lucide-react';

interface FAQSectionProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

interface FAQItem {
  id: string;
  category: 'jornada' | 'overtime' | 'holerite' | 'rescisao' | 'banco';
  categoryLabel: string;
  q: string;
  a: string;
  targetTab?: string;
  targetTabName?: string;
}

const ALL_FAQS: FAQItem[] = [
  // Jornada & Ponto Diário
  {
    id: 'j1',
    category: 'jornada',
    categoryLabel: 'Jornada & Ponto',
    q: 'Como calcular as horas trabalhadas em um dia de trabalho?',
    a: 'Para calcular as horas trabalhadas no dia, subtraia a hora de entrada do horário de saída. Se houver intervalo intrajornada (almoço), desconte a duração total da pausa. Exemplo: Entrada 08:00, Almoço 12:00 às 13:00, Saída Final 18:00. Total do dia = (12h - 8h) + (18h - 13h) = 9 horas efetivas.',
    targetTab: 'daily',
    targetTabName: 'Calculadora Diária'
  },
  {
    id: 'j2',
    category: 'jornada',
    categoryLabel: 'Jornada & Ponto',
    q: 'Qual é a tolerância legal do cartão de ponto no Brasil em 2026?',
    a: 'Segundo o Artigo 58, § 1º da CLT e a Súmula 366 do TST, a tolerância limite é de até 5 minutos por registro de ponto, limitada ao máximo de 10 minutos no total diário. Se ultrapassar 10 minutos no dia, todo o tempo excedentário (não apenas o excedente) é considerado hora extra ou atraso.',
    targetTab: 'daily',
    targetTabName: 'Simulador com Tolerância CLT'
  },
  {
    id: 'j3',
    category: 'jornada',
    categoryLabel: 'Jornada & Ponto',
    q: 'Como funciona a jornada de 44 horas semanais de segunda a sexta?',
    a: 'Para cumprir a jornada contratual de 44 horas semanais sem trabalhar aos sábados (compensação de sábado), as 4 horas do sábado são distribuídas nos 5 dias úteis. Isso resulta em uma jornada diária exata de 8 horas e 48 minutos (8h48m) de segunda a sexta-feira.',
    targetTab: 'timesheet',
    targetTabName: 'Cartão de Ponto Semanal'
  },
  {
    id: 'j4',
    category: 'jornada',
    categoryLabel: 'Jornada & Ponto',
    q: 'Qual é o tempo mínimo obrigatório de intervalo de almoço?',
    a: 'Pelo Artigo 71 da CLT, para jornadas contínuas que excedam 6 horas diárias, é obrigatório um intervalo mínimo de 1 hora (podendo ser reduzido para 30 minutos apenas por CCT). Para jornadas de 4h a 6h, o intervalo mínimo é de 15 minutos.',
    targetTab: 'daily',
    targetTabName: 'Calculadora Diária de Almoço'
  },
  {
    id: 'j5',
    category: 'jornada',
    categoryLabel: 'Jornada & Ponto',
    q: 'Qual é o divisor oficial da CLT para calcular o valor da hora de trabalho?',
    a: 'Para jornada regular de 44 horas semanais, o divisor mensal é 220. Para jornada de 40 horas semanais, o divisor é 200. Para 36 horas semanais (como teleatendimento ou escala 12x36), o divisor é 180. Basta dividir o salário base mensal pelo divisor correspondente.',
    targetTab: 'rate',
    targetTabName: 'Calculadora de Valor Hora'
  },

  // Horas Extras & Noturno
  {
    id: 'o1',
    category: 'overtime',
    categoryLabel: 'Horas Extras & Noturno',
    q: 'Qual é o valor mínimo do adicional de hora extra pela CLT?',
    a: 'Conforme a Constituição Federal (Art. 7º, XVI) e a CLT, o adicional mínimo obrigatório para horas extras em dias úteis é de 50% sobre o valor da hora normal. Para trabalhos prestados em domingos e feriados sem folga compensatória, o adicional é de 100%.',
    targetTab: 'overtime',
    targetTabName: 'Calculadora de Horas Extras'
  },
  {
    id: 'o2',
    category: 'overtime',
    categoryLabel: 'Horas Extras & Noturno',
    q: 'O que é a hora ficta noturna e como funciona o adicional noturno urbano?',
    a: 'No trabalho urbano (entre 22h e 05h), a hora de relógio (60min) tem duração legal reduzida para 52 minutos e 30 segundos (fator 1,142857). Além da redução do tempo, o trabalhador recebe um adicional noturno mínimo de 20% sobre a hora diurna.',
    targetTab: 'night',
    targetTabName: 'Calculadora de Adicional Noturno'
  },
  {
    id: 'o3',
    category: 'overtime',
    categoryLabel: 'Horas Extras & Noturno',
    q: 'O adicional noturno integra a base de cálculo de horas extras e DSR?',
    a: 'Sim! Pela Súmula 60 do TST, se o trabalho noturno for prorrogado além das 05h da manhã, o adicional noturno continua incidindo sobre as horas suplementares diurnas. Além disso, o valor das horas extras e do adicional noturno reflete obrigatoriamente no DSR.',
    targetTab: 'night',
    targetTabName: 'Calculadora Noturno com DSR'
  },

  // Holerite & Descontos
  {
    id: 'h1',
    category: 'holerite',
    categoryLabel: 'Holerite & Descontos',
    q: 'Como é calculado o desconto de INSS no holerite em 2026?',
    a: 'O INSS é calculado progressivamente por faixas salariais com alíquotas de 7,5%, 9%, 12% e 14%. Cada fração do salário é tributada na respectiva faixa até o teto máximo de contribuição estabelecido pela Previdência Social.',
    targetTab: 'holerite',
    targetTabName: 'Simulador de Holerite'
  },
  {
    id: 'h2',
    category: 'holerite',
    categoryLabel: 'Holerite & Descontos',
    q: 'Como calcular a retenção de IRRF no contracheque?',
    a: 'A base de cálculo do IRRF é obtida subtraindo do salário bruto o valor descontado de INSS, a dedução fixa por dependente legal (R$ 189,59) e pensão alimentícia. Sobre essa base, aplica-se a alíquota da tabela progressiva e subtrai-se a parcela a deduzir.',
    targetTab: 'holerite',
    targetTabName: 'Simulador Líquido de Salário'
  },
  {
    id: 'h3',
    category: 'holerite',
    categoryLabel: 'Holerite & Descontos',
    q: 'Qual o limite máximo de desconto de Vale Transporte (VT)?',
    a: 'Pela Lei 7.418/85, o empregador pode descontar até no máximo 6% do salário base do empregado para fornecimento do Vale Transporte. Caso o valor efetivo gasto com transporte no mês seja menor que 6%, desconta-se apenas o valor real gasto.',
    targetTab: 'holerite',
    targetTabName: 'Simulador de Descontos'
  },

  // Rescisão & FGTS
  {
    id: 'r1',
    category: 'rescisao',
    categoryLabel: 'Rescisão & FGTS',
    q: 'Qual é o prazo legal para pagamento do acerto trabalhista na rescisão?',
    a: 'Conforme o Artigo 477, § 6º da CLT, a empresa possui o prazo improrrogável de até 10 (dez) dias corridos, contados do término do contrato de trabalho, para quitação de todas as verbas rescisórias e entrega das guias.',
    targetTab: 'rescisao',
    targetTabName: 'Calculadora de Rescisão CLT'
  },
  {
    id: 'r2',
    category: 'rescisao',
    categoryLabel: 'Rescisão & FGTS',
    q: 'Como funciona o aviso prévio proporcional por tempo de serviço?',
    a: 'Pela Lei 12.506/2011, ao aviso prévio mínimo de 30 dias são somados 3 dias adicionais para cada ano completo de trabalho na mesma empresa, até atingir o limite máximo de 90 dias (para quem completa 20 anos de contrato).',
    targetTab: 'rescisao',
    targetTabName: 'Simulador de Rescisão com Aviso Prévio'
  },
  {
    id: 'r3',
    category: 'rescisao',
    categoryLabel: 'Rescisão & FGTS',
    q: 'Quem pede demissão tem direito ao saque do FGTS e à multa de 40%?',
    a: 'Não. Quando o pedido de demissão parte do próprio funcionário, ele perde o direito ao saque do saldo da conta vinculada do FGTS e à multa rescisória de 40%, recebendo apenas o saldo salarial, 13º proporcional e férias (vencidas e proporcionais + 1/3).',
    targetTab: 'rescisao',
    targetTabName: 'Calculadora Pedido de Demissão'
  },
  {
    id: 'r4',
    category: 'rescisao',
    categoryLabel: 'Rescisão & FGTS',
    q: 'Como funciona a demissão por acordo mútuo (Art. 484-A da CLT)?',
    a: 'Na demissão em acordo entre empregado e empregador, o trabalhador recebe 50% do aviso prévio indenizado, metade da multa do FGTS (20%), e pode movimentar até 80% do saldo depositado no seu FGTS. Não há direito ao seguro-desemprego nesta modalidade.',
    targetTab: 'rescisao',
    targetTabName: 'Calculadora Rescisão por Acordo'
  },

  // Banco de Horas & DSR
  {
    id: 'b1',
    category: 'banco',
    categoryLabel: 'Banco de Horas & DSR',
    q: 'Qual o prazo legal para compensar ou zerar o saldo do banco de horas?',
    a: 'Pelo Artigo 59 da CLT, o banco de horas firmado por acordo individual escrito deve ser compensado no prazo máximo de 6 meses. Se o acordo for firmado mediante negociação coletiva (CCT), o prazo de compensação pode se estender por até 1 ano.',
    targetTab: 'banco',
    targetTabName: 'Calculadora Banco de Horas'
  },
  {
    id: 'b2',
    category: 'banco',
    categoryLabel: 'Banco de Horas & DSR',
    q: 'Como calcular o reflexo das horas extras habituais no DSR?',
    a: 'Pela Súmula 172 do TST, o reflexo financeiro no Descanso Semanal Remunerado é calculado dividindo-se o valor total das horas extras apuradas no mês pelo número de dias úteis trabalhados e multiplicando-se pelo número de domingos e feriados do mês.',
    targetTab: 'banco',
    targetTabName: 'Calculadora DSR e Banco'
  },
  {
    id: 'b3',
    category: 'banco',
    categoryLabel: 'Banco de Horas & DSR',
    q: 'O que acontece com o saldo do banco de horas no momento da rescisão?',
    a: 'Se o contrato de trabalho for rescindido antes da compensação das horas, o saldo credor pendente no banco de horas deve ser pago integralmente como hora extra (com o adicional devido) no holerite de rescisão.',
    targetTab: 'banco',
    targetTabName: 'Simulador Saldo Banco de Horas'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Todas as Dúvidas' },
  { id: 'jornada', label: 'Jornada & Ponto' },
  { id: 'overtime', label: 'Horas Extras & Noturno' },
  { id: 'holerite', label: 'Holerite & Descontos' },
  { id: 'rescisao', label: 'Rescisão & FGTS' },
  { id: 'banco', label: 'Banco de Horas & DSR' }
];

export default function FAQSection({ activeTab = 'daily', onSelectTab }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>('j1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  // Contextual mapping: when activeTab changes, auto-highlight appropriate category filter if user hasn't explicitly set search
  const activeTabCategory = useMemo(() => {
    if (['daily', 'timesheet', 'monthly', 'rate', 'sum'].includes(activeTab)) return 'jornada';
    if (['overtime', 'night'].includes(activeTab)) return 'overtime';
    if (['holerite'].includes(activeTab)) return 'holerite';
    if (['rescisao'].includes(activeTab)) return 'rescisao';
    if (['banco'].includes(activeTab)) return 'banco';
    return 'all';
  }, [activeTab]);

  // Filter FAQs based on category & search query
  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter(faq => {
      // Category match
      const categoryMatch = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!categoryMatch) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const qLower = searchQuery.toLowerCase();
      return faq.q.toLowerCase().includes(qLower) || faq.a.toLowerCase().includes(qLower);
    });
  }, [selectedCategory, searchQuery]);

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [id]: type }));
  };

  const handleNavigateToCalculator = (targetTab?: string) => {
    if (targetTab && onSelectTab) {
      onSelectTab(targetTab);
      // Smooth scroll to main calculator top
      const calcElem = document.getElementById('main-calculator') || document.querySelector('main');
      if (calcElem) {
        calcElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dynamic JSON-LD FAQPage for Google Rich Snippets
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': filteredFaqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  return (
    <div id="faq-section" className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm animate-in fade-in duration-500 space-y-6">
      {/* Inject JSON-LD into DOM for Google Bot */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-700 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              Perguntas Frequentes (FAQ CLT 2026)
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Atualizado 2026
              </span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm">
              Tire suas dúvidas trabalhistas com respostas fundamentadas na CLT e Súmulas do TST.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar dúvida ou regra..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-50 dark:bg-neutral-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Filter className="w-3.5 h-3.5" /> Filtrar por tema:
          {activeTabCategory !== 'all' && selectedCategory === 'all' && !searchQuery && (
            <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold ml-auto">
              Recomendado para esta calculadora
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const isContextual = activeTabCategory === cat.id && cat.id !== 'all';

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : isContextual
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
                {isContextual && !isSelected && (
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-500 space-y-2">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nenhuma pergunta encontrada para sua busca.</p>
            <p className="text-xs text-neutral-500">Tente buscar por "DSR", "Tolerância", "Noturno", "INSS" ou "Rescisão".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Ver todas as dúvidas
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const feedback = feedbackGiven[faq.id];

            return (
              <div key={faq.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className={`w-full p-4 text-left font-bold text-xs sm:text-sm text-neutral-800 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isOpen ? 'bg-blue-50/50 text-blue-950 border-b border-neutral-100' : 'bg-neutral-50 hover:bg-neutral-100/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-neutral-200 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-md shrink-0">
                      {faq.categoryLabel}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed bg-white dark:bg-neutral-900 space-y-4" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text">{faq.a}</p>

                    {/* Bottom Toolbar: Direct CTA & Feedback Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                      {/* Direct CTA Button */}
                      {faq.targetTab && onSelectTab ? (
                        <button
                          onClick={() => handleNavigateToCalculator(faq.targetTab)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                        >
                          <span>Calcular no {faq.targetTabName || 'Simulador'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : <div />}

                      {/* Helpful Feedback Controls */}
                      <div className="flex items-center gap-2 text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0">
                        <span className="text-[11px] font-medium">Esta resposta foi útil?</span>
                        {feedback ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Obrigado pelo feedback!
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(faq.id, 'up')}
                              className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Sim, foi útil"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'down')}
                              className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Não foi útil"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

