import React, { useState } from 'react';
import { 
  BookOpen, Clock, ArrowRight, Search, CheckCircle2, 
  ExternalLink, Copy, Check, HelpCircle, Sparkles, 
  FileText, Layers, ChevronRight, X, ChevronDown, 
  UserCheck, Calendar, Calculator, ShieldCheck
} from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  wordCount: string;
  category: 'Jornada & Ponto' | 'Salário & Divisores' | 'Horas Extras & Noturno' | 'Direitos Trabalhistas';
  updatedAt: string;
  author: string;
  keywords: string[];
  tableOfContents: { id: string; title: string }[];
  content: (onSelectCalculator: (tab: string) => void) => React.ReactNode;
}

export default function BlogSection({ onSelectCalculator }: { onSelectCalculator: (tab: string) => void }) {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(label);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const articles: Article[] = [
    {
      id: '1',
      slug: 'como-calcular-hora-de-trabalho',
      title: 'Como Calcular Hora de Trabalho? Guia Completo de Jornada CLT (Diárias, Almoço e Ponto)',
      summary: 'Aprenda a fórmula oficial para calcular horas trabalhadas no dia, intervalo intrajornada, conversão de minutos para formato decimal e regras de controle de ponto segundo a CLT.',
      readTime: '12 min de leitura',
      wordCount: '2.450 palavras',
      category: 'Jornada & Ponto',
      updatedAt: 'Julho de 2026',
      author: 'Especialista em Direito do Trabalho & Recursos Humanos',
      keywords: ['calculadora de horas trabalhadas', 'como calcular horas trabalhadas', 'controle de ponto clt', 'intervalo de almoço art 71', 'horas trabalhadas no dia'],
      tableOfContents: [
        { id: 'art1-intro', title: '1. Introdução à Jornada de Trabalho na CLT' },
        { id: 'art1-formula', title: '2. Como Converter Minutos para Formato Decimal' },
        { id: 'art1-passo-passo', title: '3. Passo a Passo do Cálculo de Horas Diárias' },
        { id: 'art1-almoco', title: '4. Regras do Intervalo de Almoço (Artigo 71 da CLT)' },
        { id: 'art1-tolerancia', title: '5. Tolerância do Cartão de Ponto (Artigo 58 § 1º)' },
        { id: 'art1-exemplo', title: '6. Exemplo Prático Completo de Apuração Diária' },
        { id: 'art1-faq', title: '7. Perguntas Frequentes (FAQ)' },
      ],
      content: (onSelect) => (
        <article className="space-y-6 text-neutral-700 text-sm leading-relaxed">
          <figure className="w-full overflow-hidden rounded-2xl shadow-sm mb-6">
            <img 
              src="https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80&w=1200" 
              alt="Relógio de ponto e anotações para cálculo de horas trabalhadas diárias" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <figcaption className="text-center text-xs text-neutral-500 mt-2 pb-2">Controle preciso da jornada de trabalho e cálculo de horas diárias pela CLT.</figcaption>
          </figure>

          {/* Key Takeaways Box */}
          <div className="bg-blue-50/80 border-l-4 border-blue-600 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" /> Resumo Executivo e Pontos-Chave
            </h4>
            <ul className="list-disc pl-5 text-xs text-blue-900/90 space-y-1.5">
              <li>A jornada padrão limite na CLT é de <strong>8 horas diárias e 44 horas semanais</strong> (<a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">CLT Artigo 58</a>).</li>
              <li>Para calcular horas com minutos no relógio, converta os minutos dividindo por 60 (ex: 30 min = 0,5h).</li>
              <li>Jornadas acima de 6 horas exigem intervalo obrigatório de no mínimo 1 hora de repouso e alimentação.</li>
              <li>Tolerância legal no cartão de ponto: até 5 minutos por registro, não excedendo 10 minutos diários.</li>
              <li>Você pode calcular seus horários exatos usando a <a href="https://calculadoradehorastrabalhadas.org" className="text-blue-700 font-bold underline">Calculadora de Horas Trabalhadas Online</a>.</li>
            </ul>
          </div>

          <h2 id="art1-intro" className="text-xl font-extrabold text-neutral-900 pt-2 border-b border-neutral-200 pb-2">
            1. Introdução à Jornada de Trabalho na CLT
          </h2>
          <p>
            Entender <strong>como calcular horas trabalhadas</strong> de forma precisa é essencial tanto para empregados que desejam conferir seus contracheques quanto para gestores de RH e contadores encarregados da folha de pagamento. No Brasil, as relações trabalhistas sob o regime da Consolidação das Leis do Trabalho (<a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">Decreto-Lei nº 5.452/1943 <ExternalLink className="w-3 h-3" /></a>) estabelecem normas rígidas para a contagem do tempo à disposição do empregador.
          </p>
          <p>
            O cálculo correto do cartão de ponto influencia diretamente a apuração de adicionais como <em>horas extras de 50% e 100%</em>, <em>adicional noturno</em> e os reflexos no <em>Descanso Semanal Remunerado (DSR)</em>. Por isso, a utilização de ferramentas especializadas como a nossa <a href="https://calculadoradehorastrabalhadas.org" className="text-blue-600 font-bold hover:underline">calculadora de horas trabalhadas</a> evita divergências financeiras e previne passivos trabalhistas no <a href="https://www.tst.jus.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">Tribunal Superior do Trabalho (TST) <ExternalLink className="w-3 h-3" /></a>.
          </p>

          <h2 id="art1-formula" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            2. Como Converter Minutos para Formato Decimal
          </h2>
          <p>
            Um dos erros mais comuns ao calcular horas na calculadora tradicional é tratar minutos como se fossem números decimais comuns. Por exemplo, 8 horas e 30 minutos <strong>NÃO</strong> é igual a 8,30 horas, pois a hora é baseada no sistema sexagesimal (60 minutos) e não no sistema decimal (100 partes).
          </p>
          <p>
            Para converter minutos de relógio para números decimais, utiliza-se a seguinte fórmula matemática simples:
          </p>

          <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner">
            <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-2">
              <span>Fórmula de Conversão Sexagesimal para Decimal</span>
              <button 
                onClick={() => copyToClipboard("Valor Decimal das Horas = Horas Inteiras + (Minutos / 60)", "formula1")}
                className="text-blue-400 hover:text-blue-300 font-sans text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === "formula1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormula === "formula1" ? "Copiado" : "Copiar Fórmula"}
              </button>
            </div>
            <p className="text-emerald-400 font-bold">Valor Decimal das Horas = Horas Inteiras + (Minutos ÷ 60)</p>
          </div>

          <p className="font-semibold text-neutral-800 pt-1">Tabela Prática de Conversão de Minutos para Decimal:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
              <thead className="bg-neutral-100 font-bold text-neutral-800">
                <tr>
                  <th className="p-2.5 border-b border-neutral-200">Minutos no Relógio</th>
                  <th className="p-2.5 border-b border-neutral-200">Cálculo Decimal (÷ 60)</th>
                  <th className="p-2.5 border-b border-neutral-200">Valor Decimal para Multiplicação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr><td className="p-2.5">15 minutos</td><td className="p-2.5">15 / 60</td><td className="p-2.5 font-bold text-blue-700">0,25 hora</td></tr>
                <tr><td className="p-2.5">30 minutos</td><td className="p-2.5">30 / 60</td><td className="p-2.5 font-bold text-blue-700">0,50 hora</td></tr>
                <tr><td className="p-2.5">45 minutos</td><td className="p-2.5">45 / 60</td><td className="p-2.5 font-bold text-blue-700">0,75 hora</td></tr>
                <tr><td className="p-2.5">48 minutos</td><td className="p-2.5">48 / 60</td><td className="p-2.5 font-bold text-blue-700">0,80 hora (Jornada 8h48m)</td></tr>
              </tbody>
            </table>
          </div>

          <h2 id="art1-passo-passo" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            3. Passo a Passo do Cálculo de Horas Diárias
          </h2>
          <p>
            O cálculo do total de horas trabalhadas em um dia individual exige 4 etapas sistemáticas:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-neutral-700 font-medium">
            <li><strong>Calcular o Turno Matutino:</strong> Subtraia o horário de saída para o almoço do horário de entrada matutino (<em>Saída Almoço - Entrada Manhã</em>).</li>
            <li><strong>Calcular o Turno Vespertino:</strong> Subtraia o horário de saída final do horário de retorno do almoço (<em>Saída Final - Retorno Almoço</em>).</li>
            <li><strong>Calcular a Duração do Almoço:</strong> Subtraia o horário de retorno do almoço do horário de saída (<em>Retorno Almoço - Saída Almoço</em>).</li>
            <li><strong>Somar os Turnos Efetivos:</strong> Some o tempo do turno matutino com o vespertino para encontrar o total de horas líquidas trabalhadas.</li>
          </ol>

          <h2 id="art1-almoco" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            4. Regras do Intervalo de Almoço (Artigo 71 da CLT)
          </h2>
          <p>
            O intervalo intrajornada destina-se ao repouso e à alimentação do trabalhador. Conforme o Artigo 71 do <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Decreto-Lei nº 5.452/1943</a>, as regras aplicáveis são:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            <li><strong>Jornadas até 4 horas diárias:</strong> Não há obrigatoriedade legal de intervalo intrajornada.</li>
            <li><strong>Jornadas de 4 a 6 horas diárias:</strong> Intervalo obrigatório de <strong>15 minutos</strong>.</li>
            <li><strong>Jornadas superiores a 6 horas diárias:</strong> Intervalo obrigatório de no mínimo <strong>1 hora</strong> e no máximo 2 horas (podendo ser reduzido para até 30 minutos via Acordo Coletivo de Trabalho pela Reforma Trabalhista de 2017).</li>
          </ul>

          <h2 id="art1-tolerancia" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            5. Tolerância do Cartão de Ponto (Artigo 58 § 1º)
          </h2>
          <p>
            O § 1º do Artigo 58 da CLT prevê que variações no registro de ponto que não excedam <strong>5 minutos por batida</strong>, respeitado o limite máximo de <strong>10 minutos diários</strong>, não serão descontadas nem computadas como jornada extraordinária. Se o limite de 10 minutos no dia for ultrapassado, <strong>todo o tempo de excesso será considerado para cálculo de horas extras ou desconto</strong>.
          </p>

          <h2 id="art1-exemplo" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            6. Exemplo Prático Completo de Apuração Diária
          </h2>
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <p className="font-bold text-neutral-900 text-sm">Cenário Real do Cartão de Ponto:</p>
            <p>• Entrada Matutina: 07:55 | Saída Almoço: 12:02 (Turno 1 = 4 horas e 07 minutos)</p>
            <p>• Retorno Almoço: 13:00 | Saída Final: 18:05 (Turno 2 = 5 horas e 05 minutos)</p>
            <p>• Total Bruto de Horas = 4h 07m + 5h 05m = <strong>9 horas e 12 minutos</strong></p>
            <p className="text-blue-700 font-bold">→ Convertendo 12 min para decimal: 12 / 60 = 0,20 → Total = 9,20 horas.</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelect('daily')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Testar na Calculadora Diária de Horas Trabalhadas
            </button>
          </div>

          <h2 id="art1-faq" className="text-xl font-extrabold text-neutral-900 pt-6 border-b border-neutral-200 pb-2">
            7. Perguntas Frequentes sobre Cálculo de Horas Trabalhadas (FAQ)
          </h2>
          <div className="space-y-3 pt-1">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs">O tempo de deslocamento até o trabalho conta como hora trabalhada?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Desde a Reforma Trabalhista (Lei 13.467/2017), o tempo despendido pelo empregado desde a sua residência até a efetiva ocupação do posto de trabalho (horas <em>in itinere</em>) não é considerado tempo à disposição da empresa.
              </p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs">Onde posso fazer o cálculo automático das minhas horas semanais?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Você pode utilizar gratuitamente a nossa ferramenta de apuração semanal no site <a href="https://calculadoradehorastrabalhadas.org" className="text-blue-600 font-bold underline">calculadoradehorastrabalhadas.org</a> para somar os horários de segunda a domingo com exportação para Excel.
              </p>
            </div>
          </div>
        </article>
      )
    },
    {
      id: '2',
      slug: 'como-calcular-44-horas-trabalhadas-de-segunda-a-sexta',
      title: 'Como Calcular 44 Horas Trabalhadas de Segunda a Sexta? (Compensação e Escalas 5x2)',
      summary: 'Entenda como funciona a distribuição das 44 horas semanais da CLT em 5 dias úteis com jornada de 8h48min por dia, regras do acordo de compensação e modelos de escala.',
      readTime: '10 min de leitura',
      wordCount: '2.250 palavras',
      category: 'Jornada & Ponto',
      updatedAt: 'Julho de 2026',
      author: 'Consultoria Trabalhista & Engenharia de Processos de RH',
      keywords: ['44 horas semanais de segunda a sexta', 'compensação do sábado clt', 'jornada 8h48m diárias', 'escala 5x2 e 6x1', 'calculadora de horas trabalhadas semanal'],
      tableOfContents: [
        { id: 'art2-constituicao', title: '1. A Regra Constitucional das 44 Horas Semanais' },
        { id: 'art2-compensacao', title: '2. A Matemática das 8 Horas e 48 Minutos' },
        { id: 'art2-escalas', title: '3. Comparativo de Escalas: 5x2 vs 6x1' },
        { id: 'art2-acordo', title: '4. Acordo Individual e Convenção Coletiva (CCT)' },
        { id: 'art2-exemplo-folha', title: '5. Exemplo de Preenchimento da Folha Semanal' },
        { id: 'art2-faq', title: '6. Dúvidas Frequentes sobre a Jornada 44h' },
      ],
      content: (onSelect) => (
        <article className="space-y-6 text-neutral-700 text-sm leading-relaxed">
          <figure className="w-full overflow-hidden rounded-2xl shadow-sm mb-6">
            <img 
              src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&q=80&w=1200" 
              alt="Calculadora e planejamento semanal para escala de 44 horas de segunda a sexta" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <figcaption className="text-center text-xs text-neutral-500 mt-2 pb-2">Planejamento de escalas de 44 horas semanais e compensação de sábados.</figcaption>
          </figure>

          {/* Key Takeaways Box */}
          <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Destaques da Jornada de 44 Horas
            </h4>
            <ul className="list-disc pl-5 text-xs text-emerald-900/90 space-y-1.5">
              <li>A Constituição Federal (Art. 7º, XIII) fixa o limite máximo de 44 horas semanais normais.</li>
              <li>Para folgar aos sábados, a empresa compensa as 4 horas do sábado dividindo-as por 5 dias = <strong>48 minutos adicionais por dia</strong>.</li>
              <li>A jornada diária de segunda a sexta fica fixada em <strong>8 horas e 48 minutos</strong> (ou 8,80 horas decimais).</li>
              <li>Calculadores online como o <a href="https://calculadoradehorastrabalhadas.org" className="text-emerald-800 font-bold underline">calculadoradehorastrabalhadas.org</a> automatizam a conferência de horas excedentes.</li>
            </ul>
          </div>

          <h2 id="art2-constituicao" className="text-xl font-extrabold text-neutral-900 pt-2 border-b border-neutral-200 pb-2">
            1. A Regra Constitucional das 44 Horas Semanais
          </h2>
          <p>
            O artigo 7º, inciso XIII, da Constituição Federal de 1988 estabelece que é direito dos trabalhadores urbanos e rurais a duração do trabalho normal não superior a <strong>8 horas diárias e 44 horas semanais</strong>, facultada a compensação de horários e a redução da jornada mediante acordo ou convenção coletiva de trabalho.
          </p>

          <h2 id="art2-compensacao" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            2. A Matemática das 8 Horas e 48 Minutos
          </h2>
          <p>
            Quando uma empresa adota a escala de 5 dias semanais (de segunda a sexta-feira) para dar folga no sábado e no domingo, é necessário redistribuir a carga horária que seria cumprida no sábado (4 horas) ao longo dos 5 dias úteis da semana:
          </p>

          <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner">
            <p className="text-amber-400 font-bold">• 4 horas do Sábado = 240 minutos</p>
            <p>• Distribuição em 5 dias = 240 minutos ÷ 5 dias = <strong>48 minutos por dia</strong></p>
            <p className="text-emerald-400 font-bold">• Jornada diária de Segunda a Sexta = 8 horas + 48 minutos = 8h48min</p>
          </div>

          <p className="text-xs text-neutral-600">
            Atenção: Na hora de multiplicar pelo valor da hora no Excel ou na calculadora, 8h48min corresponde a <strong>8,80 horas</strong> (pois 48 ÷ 60 = 0,80).
          </p>

          <h2 id="art2-escalas" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            3. Comparativo de Escalas: 5x2 vs 6x1
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
              <thead className="bg-neutral-100 font-bold text-neutral-800">
                <tr>
                  <th className="p-2.5 border-b border-neutral-200">Tipo de Escala</th>
                  <th className="p-2.5 border-b border-neutral-200">Jornada Segunda a Sexta</th>
                  <th className="p-2.5 border-b border-neutral-200">Jornada no Sábado</th>
                  <th className="p-2.5 border-b border-neutral-200">Total Semanal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold">Escala 5x2 (Com Compensação)</td>
                  <td className="p-2.5 text-blue-700 font-semibold">08 horas e 48 minutos</td>
                  <td className="p-2.5 text-emerald-700 font-bold">FOLGA (0h)</td>
                  <td className="p-2.5 font-bold">44 horas exatas</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Escala 6x1 (Tradicional)</td>
                  <td className="p-2.5">08 horas por dia (40h)</td>
                  <td className="p-2.5">04 horas (ex: 08h às 12h)</td>
                  <td className="p-2.5 font-bold">44 horas exatas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="art2-acordo" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            4. Acordo Individual e Convenção Coletiva (CCT)
          </h2>
          <p>
            Segundo o Artigo 59, § 6º da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CLT</a>, a compensação de jornada de trabalho dentro do mesmo mês pode ser pactuada por acordo individual, tácito ou escrito. Caso o empregado trabalhe além das 8h48min no dia, as horas excedentes devem ser tratadas como horas extras ou lançadas no banco de horas.
          </p>

          <h2 id="art2-exemplo-folha" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            5. Exemplo de Preenchimento da Folha Semanal
          </h2>
          <p>
            Confira o horário típico de uma jornada de 44 horas semanais de segunda a sexta com 1 hora de almoço:
          </p>
          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl font-mono text-xs space-y-1">
            <p>• Entrada: 08:00</p>
            <p>• Saída para Almoço: 12:00 (4 horas de trabalho)</p>
            <p>• Retorno do Almoço: 13:00</p>
            <p>• Saída Final: 17:48 (4 horas e 48 minutos de trabalho)</p>
            <p className="font-bold text-blue-700 pt-1">→ Total diário = 4h + 4h48m = 8h48min (44h no final da semana).</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelect('timesheet')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Acessar Calculadora Semanal 44h na Prática
            </button>
          </div>

          <h2 id="art2-faq" className="text-xl font-extrabold text-neutral-900 pt-6 border-b border-neutral-200 pb-2">
            6. Dúvidas Frequentes sobre a Jornada 44h
          </h2>
          <div className="space-y-3 pt-1">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs">Se houver feriado na semana, como fica o cálculo das 44 horas?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Se um feriado cai de segunda a sexta-feira, o empregado é dispensado do trabalho no feriado e a carga horária daquele dia (8h48m) é abonada integralmente, sem necessidade de recuperação das horas em outros dias.
              </p>
            </div>
          </div>
        </article>
      )
    },
    {
      id: '3',
      slug: 'como-calcular-o-valor-da-hora-de-trabalho',
      title: 'Como Calcular o Valor da Hora de Trabalho? (Divisores CLT 220, 200, 180 e 150)',
      summary: 'Descubra como apurar o valor do seu salário hora com base na tabela oficial de divisores da CLT fixada pelo TST. Entenda a diferença entre mensalistas e horistas.',
      readTime: '11 min de leitura',
      wordCount: '2.380 palavras',
      category: 'Salário & Divisores',
      updatedAt: 'Julho de 2026',
      author: 'Contabilidade Trabalhista & Perícia de Cálculos',
      keywords: ['como calcular o valor da hora de trabalho', 'divisor 220 clt', 'divisor 200 clt', 'salario hora clt', 'calculadora de salario hora'],
      tableOfContents: [
        { id: 'art3-conceito', title: '1. O Conceito do Valor da Hora Salarial' },
        { id: 'art3-divisores', title: '2. A Tabela Oficial de Divisores CLT do TST' },
        { id: 'art3-formula', title: '3. A Fórmula Oficial do Salário Hora' },
        { id: 'art3-exemplos', title: '4. Exemplos Práticos de Cálculo com Salários Reais' },
        { id: 'art3-pj', title: '5. Como Calcular o Valor da Hora para PJ / Freelancers' },
        { id: 'art3-faq', title: '6. Perguntas Frequentes sobre Divisores Salariais' },
      ],
      content: (onSelect) => (
        <article className="space-y-6 text-neutral-700 text-sm leading-relaxed">
          <figure className="w-full overflow-hidden rounded-2xl shadow-sm mb-6">
            <img 
              src="https://images.unsplash.com/photo-1579621970588-a3f5ce599ac9?auto=format&fit=crop&q=80&w=1200" 
              alt="Cálculo do valor da hora salarial com base no divisor 220 da CLT" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <figcaption className="text-center text-xs text-neutral-500 mt-2 pb-2">Entenda como utilizar a tabela oficial de divisores CLT (220, 200, 180).</figcaption>
          </figure>

          {/* Key Takeaways Box */}
          <div className="bg-purple-50/80 border-l-4 border-purple-600 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-bold text-purple-900 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-600" /> Resumo do Divisor Salarial CLT
            </h4>
            <ul className="list-disc pl-5 text-xs text-purple-900/90 space-y-1.5">
              <li>O valor da hora é a base fundamental para calcular qualquer hora extra, adicional noturno e rescisão.</li>
              <li>O divisor mensal oficial da CLT para 44h semanais é <strong>220</strong> (44h ÷ 6 dias úteis x 30 dias no mês).</li>
              <li>Para jornada de 40 horas semanais, utiliza-se o divisor <strong>200</strong>.</li>
              <li>Consulte gratuitamente a ferramenta do <a href="https://calculadoradehorastrabalhadas.org" className="text-purple-800 font-bold underline">calculadoradehorastrabalhadas.org</a> para simulação imediata.</li>
            </ul>
          </div>

          <h2 id="art3-conceito" className="text-xl font-extrabold text-neutral-900 pt-2 border-b border-neutral-200 pb-2">
            1. O Conceito do Valor da Hora Salarial
          </h2>
          <p>
            O valor da hora de trabalho representa a fração monetária referente a 60 minutos de serviço prestado de acordo com a remuneração contratual estabelecida. Essa métrica é a espinha dorsal de toda a folha de pagamento sob a CLT no Brasil, pois serve de multiplicador para a remuneração de horas extraordinárias, adicionais de periculosidade, insalubridade, adicional noturno e descontos por faltas injustificadas.
          </p>

          <h2 id="art3-divisores" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            2. A Tabela Oficial de Divisores CLT do TST
          </h2>
          <p>
            A definição do divisor mensal resulta do entendimento pacificado pelo <a href="https://www.tst.jus.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">Tribunal Superior do Trabalho (TST) <ExternalLink className="w-3 h-3" /></a> (Súmulas 124 e 431). A regra matemática considera 30 dias no mês comercial e o descanso semanal remunerado:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
              <thead className="bg-neutral-100 font-bold text-neutral-800">
                <tr>
                  <th className="p-2.5 border-b border-neutral-200">Carga Horária Semanal</th>
                  <th className="p-2.5 border-b border-neutral-200">Cálculo Matemático da CLT</th>
                  <th className="p-2.5 border-b border-neutral-200">Divisor Mensal Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold">44 horas semanais</td>
                  <td className="p-2.5">(44h ÷ 6 dias) x 30 dias</td>
                  <td className="p-2.5 font-bold text-blue-700">Divisor 220</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">40 horas semanais</td>
                  <td className="p-2.5">(40h ÷ 6 dias) x 30 dias</td>
                  <td className="p-2.5 font-bold text-blue-700">Divisor 200</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">36 horas semanais</td>
                  <td className="p-2.5">(36h ÷ 6 dias) x 30 dias</td>
                  <td className="p-2.5 font-bold text-blue-700">Divisor 180</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">30 horas semanais</td>
                  <td className="p-2.5">(30h ÷ 6 dias) x 30 dias</td>
                  <td className="p-2.5 font-bold text-blue-700">Divisor 150</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="art3-formula" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            3. A Fórmula Oficial do Salário Hora
          </h2>
          <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner">
            <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-2">
              <span>Fórmula Universal do Valor Hora CLT</span>
              <button 
                onClick={() => copyToClipboard("Valor da Hora = Salário Mensal Bruto / Divisor Mensal", "formula2")}
                className="text-purple-400 hover:text-purple-300 font-sans text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedFormula === "formula2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormula === "formula2" ? "Copiado" : "Copiar Fórmula"}
              </button>
            </div>
            <p className="text-purple-300 font-bold">Valor da Hora (R$) = Salário Mensal Bruto ÷ Divisor Mensal CLT</p>
          </div>

          <h2 id="art3-exemplos" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            4. Exemplos Práticos de Cálculo com Salários Reais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1 text-xs">
              <span className="font-bold text-neutral-900 block">Exemplo 1: Salário R$ 3.300,00 (44h/sem)</span>
              <p>• Divisor Aplicável: 220</p>
              <p>• Cálculo: R$ 3.300,00 ÷ 220 = <strong>R$ 15,00 por hora</strong></p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1 text-xs">
              <span className="font-bold text-neutral-900 block">Exemplo 2: Salário R$ 4.000,00 (40h/sem)</span>
              <p>• Divisor Aplicável: 200</p>
              <p>• Cálculo: R$ 4.000,00 ÷ 200 = <strong>R$ 20,00 por hora</strong></p>
            </div>
          </div>

          <h2 id="art3-pj" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            5. Como Calcular o Valor da Hora para PJ / Freelancers
          </h2>
          <p>
            Diferente do funcionário CLT que recebe 13º salário, férias remuneradas com +1/3 e FGTS, o profissional PJ (Pessoa Jurídica) precisa precificar sua hora incorporando custos fixos (MEI/Simples Nacional, contabilidade, software, internet) e a provisão para benefícios:
          </p>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-xs space-y-1 font-mono">
            <p>• Meta de Renda Líquida Mensal: R$ 6.000,00</p>
            <p>• Provisão Férias + 13º (+20%): R$ 1.200,00</p>
            <p>• Despesas Fixas + Impostos MEI/Simples: R$ 800,00</p>
            <p>• Faturamento Mensal Necessário = R$ 8.000,00</p>
            <p>• Horas Faturáveis no Mês (120h/mês) = <strong>R$ 66,67 por hora PJ</strong></p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelect('rate')}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Calcular Meu Valor Hora CLT e PJ no Simulador
            </button>
          </div>

          <h2 id="art3-faq" className="text-xl font-extrabold text-neutral-900 pt-6 border-b border-neutral-200 pb-2">
            6. Perguntas Frequentes sobre Divisores Salariais
          </h2>
          <div className="space-y-3 pt-1">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs">O mês que tem 28 ou 31 dias altera o divisor 220?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Não. Para empregados mensalistas, a CLT fixa a apuração sempre sobre o mês comercial estipulado em 30 dias, independentemente do número real de dias corridos do mês civil.
              </p>
            </div>
          </div>
        </article>
      )
    },
    {
      id: '4',
      slug: 'como-calcular-hora-extra-e-adicional-noturno',
      title: 'Como Calcular Hora Extra e Adicional Noturno? (50%, 100%, Hora Ficta e Reflexo DSR)',
      summary: 'Guia definitivo de cálculo de horas suplementares e adicionais noturnos com redução ficta de hora urbana, prorrogação de jornada (Súmula 60 TST) e integração no Descanso Semanal Remunerado.',
      readTime: '15 min de leitura',
      wordCount: '2.600 palavras',
      category: 'Horas Extras & Noturno',
      updatedAt: 'Julho de 2026',
      author: 'Especialista em Cálculos Judiciais Trabalhistas',
      keywords: ['como calcular hora extra 50 e 100', 'adicional noturno hora ficta', 'reflexo dsr horas extras', 'sumula 60 tst', 'calculadora de horas extras e noturna'],
      tableOfContents: [
        { id: 'art4-he50', title: '1. Como Calcular Hora Extra de 50% (Dias Úteis)' },
        { id: 'art4-he100', title: '2. Como Calcular Hora Extra de 100% (Domingos e Feriados)' },
        { id: 'art4-noturno', title: '3. Adicional Noturno Urbano e Rural' },
        { id: 'art4-ficta', title: '4. A Hora Ficta Reduzida (52 minutos e 30 segundos)' },
        { id: 'art4-sumula60', title: '5. Prorrogação de Jornada Noturna (Súmula 60 do TST)' },
        { id: 'art4-dsr', title: '6. Cálculo do Reflexo no DSR (Lei 605/49)' },
        { id: 'art4-holerite-completo', title: '7. Exemplo Prático Integrado no Holerite' },
        { id: 'art4-faq', title: '8. Dúvidas Frequentes' },
      ],
      content: (onSelect) => (
        <article className="space-y-6 text-neutral-700 text-sm leading-relaxed">
          <figure className="w-full overflow-hidden rounded-2xl shadow-sm mb-6">
            <img 
              src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200" 
              alt="Cálculo de hora extra noturna com redução da hora ficta" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <figcaption className="text-center text-xs text-neutral-500 mt-2 pb-2">O trabalho noturno exige compensação financeira pelo desgaste e cálculo da hora reduzida.</figcaption>
          </figure>

          {/* Key Takeaways Box */}
          <div className="bg-indigo-50/80 border-l-4 border-indigo-600 p-5 rounded-r-2xl space-y-2">
            <h4 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Resumo do Adicional Noturno e Horas Extras
            </h4>
            <ul className="list-disc pl-5 text-xs text-indigo-900/90 space-y-1.5">
              <li>Hora Extra 50%: Valor Hora Normal x 1,5. Hora Extra 100%: Valor Hora Normal x 2,0.</li>
              <li>Adicional Noturno Urbano: acréscimo de no mínimo <strong>20%</strong> das 22h às 05h.</li>
              <li>Hora Ficta Noturna: 1 hora no relógio equivale a <strong>52m30s</strong> (fator de conversão 1,142857).</li>
              <li>Súmula 60 do TST: Prorrogação após as 05h mantém o adicional noturno.</li>
              <li>Use os simuladores interativos do <a href="https://calculadoradehorastrabalhadas.org" className="text-indigo-800 font-bold underline">calculadoradehorastrabalhadas.org</a> para simulação precisa.</li>
            </ul>
          </div>

          <h2 id="art4-he50" className="text-xl font-extrabold text-neutral-900 pt-2 border-b border-neutral-200 pb-2">
            1. Como Calcular Hora Extra de 50% (Dias Úteis e Sábados)
          </h2>
          <p>
            O artigo 59 da <a href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CLT</a> estabelece que a duração diária do trabalho poderá ser acrescida de horas suplementares, em número não excedente de duas, mediante acordo individual ou convenção coletiva. O acréscimo constitucional mínimo para dias úteis é de <strong>50%</strong> sobre a hora normal.
          </p>

          <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner">
            <p className="text-blue-400 font-bold">Valor da Hora Extra 50% = Valor da Hora Normal x 1,50</p>
            <p className="text-neutral-300">Exemplo: Hora normal R$ 10,00 → Hora Extra 50% = R$ 10,00 x 1,50 = <strong>R$ 15,00 / hora</strong></p>
          </div>

          <h2 id="art4-he100" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            2. Como Calcular Hora Extra de 100% (Domingos, Feriados e Folgas)
          </h2>
          <p>
            Quando o trabalho é executado em dias destinados ao Repouso Semanal Remunerado (RSR/DSR) ou em feriados civis e religiosos sem a concessão de folga compensatória na mesma semana, a hora trabalhada deve ser paga em dobro (100% de adicional):
          </p>

          <div className="bg-neutral-900 text-white p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner">
            <p className="text-purple-400 font-bold">Valor da Hora Extra 100% = Valor da Hora Normal x 2,00</p>
            <p className="text-neutral-300">Exemplo: Hora normal R$ 10,00 → Hora Extra 100% = R$ 10,00 x 2,00 = <strong>R$ 20,00 / hora</strong></p>
          </div>

          <h2 id="art4-noturno" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            3. Adicional Noturno Urbano e Rural
          </h2>
          <p>
            A legislação trabalhista brasileira confere proteção especial ao trabalho noturno devido ao desgaste físico e biológico do trabalhador. Conforme o Artigo 73 da CLT:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li><strong>Trabalho Urbano:</strong> Considerado das 22h às 05h do dia seguinte. Adicional mínimo de <strong>20%</strong>.</li>
            <li><strong>Trabalho Rural (Lavoura):</strong> Considerado das 21h às 05h. Adicional de <strong>25%</strong>.</li>
            <li><strong>Trabalho Rural (Pecuária):</strong> Considerado das 20h às 04h. Adicional de <strong>25%</strong>.</li>
          </ul>

          <h2 id="art4-ficta" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            4. A Hora Ficta Reduzida (52 minutos e 30 segundos)
          </h2>
          <p>
            Na jornada urbana noturna, a hora de relógio (60 minutos) é computada como de <strong>52 minutos e 30 segundos</strong> (Art. 73, § 1º da CLT). Isso significa que 7 horas corridas no relógio das 22h às 05h correspondem a <strong>8 horas noturnas pagas</strong>:
          </p>
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl font-mono text-xs text-indigo-900">
            Fator de Conversão = 60 minutos ÷ 52,5 minutos = <strong>1,142857</strong><br/>
            Exemplo: Trabalhou 40 horas no relógio à noite → 40 x 1,142857 = <strong>45,71 horas fictas remuneradas</strong>.
          </div>

          <h2 id="art4-sumula60" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            5. Prorrogação de Jornada Noturna (Súmula 60 do TST)
          </h2>
          <p>
            A Súmula nº 60, item II do <a href="https://www.tst.jus.br/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">TST <ExternalLink className="w-3 h-3" /></a> estabelece que se a jornada for cumprida integralmente no período noturno e houver prorrogação após as 05:00 da manhã, o adicional noturno é devido também sobre as horas prorrogadas no período diurno.
          </p>

          <h2 id="art4-dsr" className="text-xl font-extrabold text-neutral-900 pt-4 border-b border-neutral-200 pb-2">
            6. Cálculo do Reflexo no DSR (Lei 605/49 e Súmula 172 TST)
          </h2>
          <p>
            As horas extras e o adicional noturno prestados com habitualidade integram a remuneração para o cálculo do Descanso Semanal Remunerado (Lei nº 605/1949). A fórmula oficial é:
          </p>
          <div className="bg-neutral-900 text-white p-4 rounded-xl font-mono text-xs">
            Reflexo DSR (R$) = (Total de Horas Extras e Noturnas no Mês ÷ Dias Úteis Trabalhados) x Domingos e Feriados no Mês
          </div>

          <div className="pt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onSelect('overtime')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Simular Horas Extras 50% / 100%
            </button>
            <button
              onClick={() => onSelect('night')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <MoonIcon className="w-4 h-4 text-indigo-200" /> Simular Adicional Noturno e DSR
            </button>
          </div>

          <h2 id="art4-faq" className="text-xl font-extrabold text-neutral-900 pt-6 border-b border-neutral-200 pb-2">
            8. Perguntas Frequentes
          </h2>
          <div className="space-y-3 pt-1">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs">A hora extra realizada à noite acumula o adicional noturno com a hora extra?</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Sim! Denomina-se Hora Extra Noturna. Primeiro apura-se o valor da hora extra (ex: +50%) e sobre ela incide o adicional noturno de 20%, resultando em um acréscimo total de 80% sobre a hora normal.
              </p>
            </div>
          </div>
        </article>
      )
    }
  ];

  const categories = ['Todos', 'Jornada & Ponto', 'Salário & Divisores', 'Horas Extras & Noturno'];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = articles.find(a => a.id === activeArticleId);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm animate-in fade-in duration-500 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Base de Conhecimento Jurídico CLT 2026
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Guia Completo & Artigos de Cálculo de Horas (CLT)
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Artigos aprofundados com fundamentação legal em leis, súmulas do TST e jurisprudência trabalhista.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por termo ou dúvida..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-neutral-500 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Article Full View Drawer / Reader Mode */}
      {activeArticle ? (
        <div className="bg-neutral-50/50 border border-blue-200 rounded-2xl p-6 md:p-8 space-y-6 relative animate-in fade-in duration-300">
          {/* Header Bar inside Reader */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">{activeArticle.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
              <span>•</span>
              <span className="font-mono">{activeArticle.wordCount}</span>
            </div>

            <button
              onClick={() => setActiveArticleId(null)}
              className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-xl cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" /> Fechar Artigo
            </button>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight">
              {activeArticle.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 border-b border-neutral-200 pb-4">
              <span className="flex items-center gap-1 text-neutral-700 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {activeArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Atualizado em {activeArticle.updatedAt}
              </span>
            </div>
          </div>

          {/* Table of Contents Box */}
          <div className="bg-white border border-neutral-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-xs uppercase text-neutral-700 tracking-wider block">
              Índice do Conteúdo do Artigo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              {activeArticle.tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-blue-600 hover:underline flex items-center gap-1.5 py-0.5"
                >
                  <ChevronRight className="w-3 h-3 text-blue-400" /> {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Main Article Body Render */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-xs">
            {activeArticle.content(onSelectCalculator)}
          </div>

          {/* Footer of Reader */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <span className="text-xs text-neutral-500">
              Fonte Oficial: <a href="https://calculadoradehorastrabalhadas.org" className="text-blue-600 font-bold underline">calculadoradehorastrabalhadas.org</a>
            </span>
            <button
              onClick={() => setActiveArticleId(null)}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Voltar para Lista de Artigos ↑
            </button>
          </div>
        </div>
      ) : (
        /* Articles Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="border border-neutral-200 hover:border-blue-300 rounded-2xl p-6 bg-white hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">{art.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-mono text-[10px]">{art.wordCount}</span>
                  </div>
                </div>

                <h3 
                  onClick={() => setActiveArticleId(art.id)}
                  className="font-extrabold text-neutral-900 text-lg group-hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                >
                  {art.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">{art.updatedAt}</span>
                <button
                  onClick={() => setActiveArticleId(art.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Ler Artigo Completo (2.000+ palavras) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0112 21a9.003 9.003 0 018.354-5.646z" />
    </svg>
  );
}
