import React from 'react';
import { 
  Calculator, ShieldCheck, Users, Sparkles, Award, 
  CheckCircle2, ArrowRight, HeartHandshake, Lock, FileSpreadsheet, 
  Target, Eye, HelpCircle, Scale
} from 'lucide-react';

interface AboutUsPageProps {
  onSelectCalculator: (tab: string) => void;
}

export default function AboutUsPage({ onSelectCalculator }: AboutUsPageProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sobre a Nossa Plataforma</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Transparência e Precisão no Cálculo de Horas Trabalhadas
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            O <strong>calculadoradehorastrabalhadas.org</strong> nasceu com uma missão clara: descomplicar a apuração da jornada de trabalho para milhões de trabalhadores, profissionais de Recursos Humanos, contadores e advogados em todo o Brasil.
          </p>
        </div>
      </div>

      {/* Trust Badges / Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm text-center space-y-1">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Calculator className="w-5 h-5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">+1.5 milhão</p>
          <p className="text-xs text-neutral-500 font-medium">Simulações mensais</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">100% Grátis</p>
          <p className="text-xs text-neutral-500 font-medium">Sem cadastro obrigatório</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm text-center space-y-1">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">100% Privado</p>
          <p className="text-xs text-neutral-500 font-medium">Dados no seu navegador</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm text-center space-y-1">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Scale className="w-5 h-5" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">Padrão CLT 2026</p>
          <p className="text-xs text-neutral-500 font-medium">Atualizado conforme TST</p>
        </div>
      </div>

      {/* Main Narrative Content */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-6 sm:p-10 space-y-8 shadow-sm">
        {/* Section 1: Who We Are */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Users className="w-5 h-5 text-blue-600" />
            Quem Somos
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Somos um portal especializado no desenvolvimento de ferramentas computacionais focadas em cálculos trabalhistas e gestão de ponto sob a Consolidação das Leis do Trabalho (CLT - Decreto-Lei nº 5.452/1943). Entendemos que a legislação brasileira possui nuances complexas — como a conversão de minutos em números decimais, as regras de tolerância do cartão de ponto (Art. 58 § 1º), a hora ficta noturna (Art. 73) e os divisores salariais oficiais (220, 200, 180 e 150).
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Para solucionar essa dor cotidiana, desenvolvemos algoritmos de alta precisão que realizam o somatório exato de turnos diários, semanais e mensais em milissegundos, sem que o usuário precise efetuar fórmulas complexas manualmente no Excel ou na calculadora comum.
          </p>
        </section>

        {/* Section 2: Mission, Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-1">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Nossa Missão</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Garantir que todo trabalhador e empregador tenha acesso instantâneo e gratuito a cálculos de ponto com regras explícitas e resultados transparentes.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-1">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Nossa Visão</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ser a referência número um em simulação e educação sobre controle de ponto e jornada de trabalho em língua portuguesa.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-1">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Nossos Valores</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Precisão matemática rigorosa, total respeito à privacidade dos dados (LGPD) e simplicidade de uso para qualquer dispositivo.
            </p>
          </div>
        </div>

        {/* Section 3: Why Trust Us (E-E-A-T Pillars) */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Award className="w-5 h-5 text-blue-600" />
            Por Que Confiar no CalculadoraDeHorasTrabalhadas.org?
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Privacidade Total de Dados (Zero Servidor)</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Diferente de sistemas que exigem cadastro ou enviam suas horas para servidores remotos, todos os cálculos no <strong>calculadoradehorastrabalhadas.org</strong> acontecem 100% no seu navegador (client-side). Seus horários de entrada e saída nunca são salvos em nosso banco de dados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Rigor Jurídico e Atualização Permanentemente Auditada</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Nossos algoritmos são permanentemente alinhados às Súmulas do Tribunal Superior do Trabalho (TST), Portarias do MTE (incluindo Portaria 671/2021) e à legislação CLT vigente para 2026.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Precisão Decimais-Minutos e Tolerância Automática</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  A conversão matemática entre sexagesimal (horas/minutos) e sistema decimal é calculada com arredondamento de alta precisão (6 casas decimais), sem substituir a verificação por batida do Art. 58 § 1º da CLT (tolerância de 10 min/dia).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Ferramentas Complementares Gratuitas</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Além das simuladoras online de horas diárias, semanais (44h), banco de horas e holerite, disponibilizamos modelos de planilhas prontas em Excel para download gratuito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Audit Table & Methodological Transparency */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Scale className="w-5 h-5 text-blue-600" />
            Matriz de Metodologia e Embasamento Legal de Cálculo
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Confira a tabela metodológica utilizada por nossos motores de cálculo para apoiar a conferência em auditorias trabalhistas e folhas de pagamento:
          </p>

          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-700 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-800 dark:text-neutral-200 font-bold border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="p-3">Módulo de Cálculo</th>
                  <th className="p-3">Fórmula / Regra Aplicada</th>
                  <th className="p-3">Legislação / Jurisprudência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900">
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">Tolerância do Cartão de Ponto</td>
                  <td className="p-3">Até 5 minutos por batida, limitado a 10 minutos no total do dia. Excedido o limite, calcula-se o total integral.</td>
                  <td className="p-3 text-blue-800 font-semibold">Art. 58, § 1º CLT / Súmula 366 TST</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">Hora Extra Padrão / CCT</td>
                  <td className="p-3">Adicional de no mínimo 50% em dias úteis e 100% em domingos e feriados trabalhados.</td>
                  <td className="p-3 text-blue-800 font-semibold">Art. 59 CLT / Art. 7º XVI CF/88</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">Hora Ficta Noturna Urbana</td>
                  <td className="p-3">Hora de 52 minutos e 30 segundos (Fator 1.142857x) + Adicional Noturno mínimo de 20%.</td>
                  <td className="p-3 text-blue-800 font-semibold">Art. 73 CLT / Portaria MTE</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">Reflexo no DSR</td>
                  <td className="p-3">(Valor Total das Horas Extras / Dias Úteis Trabalhados) x Dias de DSR (Domingos + Feriados).</td>
                  <td className="p-3 text-blue-800 font-semibold">Súmula 172 TST / Lei 605/49</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">Integração de Adicionais</td>
                  <td className="p-3">Insalubridade e Periculosidade integram a base de cálculo da hora normal e horas extras.</td>
                  <td className="p-3 text-blue-800 font-semibold">Súmula 132 TST / OJ 259 SDI-1 TST</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Precision FAQ */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-100 pb-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Perguntas Frequentes sobre a Transparência dos Cálculos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Como os minutos são convertidos em decimais?</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Dividimos a quantidade de minutos por 60. Por exemplo: 30 minutos correspondem a 0,5h (30/60). Assim, 8 horas e 30 minutos equivalem a 8,50 horas exatas para multiplicação salarial.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Os cálculos podem ser usados como prova judicial?</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Nossos relatórios servem como excelente simulador e conferência prévia. Para instrução probatória em ações trabalhistas, recomendamos a conferência por um perito contador ou advogado especialista.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Como funciona o cálculo em jornadas noturnas estendidas?</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Quando a jornada iniciada no período noturno (22h) se estende após as 05h da manhã, a prorrogação mantém o direito ao adicional noturno conforme a Súmula 60 do TST.
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-1.5">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Por que os dados não ficam salvos em servidor?</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Priorizamos a segurança e conformidade rigorosa com a LGPD. Os dados permanecem apenas na memória temporária ou LocalStorage do seu próprio navegador.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-blue-950 text-base">Pronto para calcular sua jornada agora?</h4>
            <p className="text-xs text-blue-800">Acesse qualquer uma das nossas calculadoras gratuitas em poucos cliques.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onSelectCalculator('daily')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Calculadora Diária <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectCalculator('excel')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Planilha Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
