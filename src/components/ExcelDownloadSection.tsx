import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2, Mail, Sparkles, Copy, Check, Code, Layers, Table, Sliders, Info } from 'lucide-react';
import { generateTimesheetCSV } from '../utils/excelGenerator';

type TemplateType = 'clt_standard' | 'banco_horas' | 'escala_12x36' | 'adicional_noturno' | 'freelancer_pj';

export default function ExcelDownloadSection() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('clt_standard');
  const [email, setEmail] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Interactive customization parameters
  const [customStart, setCustomStart] = useState('08:00');
  const [customEnd, setCustomEnd] = useState('18:00');
  const [customLunch, setCustomLunch] = useState('01:00');
  const [customHourlyRate, setCustomHourlyRate] = useState('25.00');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const templatesData = {
    clt_standard: {
      title: 'Folha de Ponto Padrão CLT (5x2 / 6x1)',
      desc: 'Modelo completo para jornada regular de trabalho com controle de almoço e total de horas diárias.',
      entries: [
        { date: 'Segunda-feira', start: isCustomizing ? customStart : '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: isCustomizing ? customEnd : '18:00', breakTime: isCustomizing ? customLunch : '01:00', totalHours: '09:00' },
        { date: 'Terça-feira', start: isCustomizing ? customStart : '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: isCustomizing ? customEnd : '18:00', breakTime: isCustomizing ? customLunch : '01:00', totalHours: '09:00' },
        { date: 'Quarta-feira', start: isCustomizing ? customStart : '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: isCustomizing ? customEnd : '18:00', breakTime: isCustomizing ? customLunch : '01:00', totalHours: '09:00' },
        { date: 'Quinta-feira', start: isCustomizing ? customStart : '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: isCustomizing ? customEnd : '18:00', breakTime: isCustomizing ? customLunch : '01:00', totalHours: '09:00' },
        { date: 'Sexta-feira', start: isCustomizing ? customStart : '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: isCustomizing ? customEnd : '17:00', breakTime: isCustomizing ? customLunch : '01:00', totalHours: '08:00' },
      ],
    },
    banco_horas: {
      title: 'Controle de Banco de Horas e Horas Extras (50% e 100%)',
      desc: 'Calcula automaticamente o saldo positivo/negativo de horas diárias com relação à jornada contratual.',
      entries: [
        { date: 'Dia 01/05', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '19:00', breakTime: '01:00', totalHours: '10:00 ( +2h extra 50% )' },
        { date: 'Dia 02/05', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '18:00', breakTime: '01:00', totalHours: '09:00 (  0h saldo )' },
        { date: 'Dia 03/05', start: '08:30', lunchStart: '12:00', lunchEnd: '13:00', end: '17:30', breakTime: '01:00', totalHours: '08:00 ( -1h débito )' },
        { date: 'Dia 04/05 (Domingo)', start: '08:00', lunchStart: '12:00', lunchEnd: '13:00', end: '16:00', breakTime: '01:00', totalHours: '07:00 ( +7h extra 100% )' },
      ],
    },
    escala_12x36: {
      title: 'Planilha de Escala 12x36 (Dia Sim, Dia Não)',
      desc: 'Ideal para profissionais de saúde, segurança e portaria com jornadas de 12 horas seguidas por 36h de descanso.',
      entries: [
        { date: 'Dia 01 (Trabalho)', start: '07:00', lunchStart: '12:00', lunchEnd: '13:00', end: '19:00', breakTime: '01:00', totalHours: '11:00 trab. / 1h desc.' },
        { date: 'Dia 02 (Folga)', start: 'FOLGA', lunchStart: '-', lunchEnd: '-', end: 'FOLGA', breakTime: '-', totalHours: '00:00' },
        { date: 'Dia 03 (Trabalho)', start: '07:00', lunchStart: '12:00', lunchEnd: '13:00', end: '19:00', breakTime: '01:00', totalHours: '11:00 trab. / 1h desc.' },
        { date: 'Dia 04 (Folga)', start: 'FOLGA', lunchStart: '-', lunchEnd: '-', end: 'FOLGA', breakTime: '-', totalHours: '00:00' },
      ],
    },
    adicional_noturno: {
      title: 'Planilha de Jornada Noturna (22h às 05h com Hora Ficta)',
      desc: 'Inclui conversão da hora reduzida (52m30s = 1,1428x) e adicional de 20% conforme Art. 73 da CLT.',
      entries: [
        { date: 'Segunda-Feira', start: '22:00', lunchStart: '02:00', lunchEnd: '03:00', end: '06:00', breakTime: '01:00', totalHours: '07:00 rel. (8.00h fictas)' },
        { date: 'Terça-Feira', start: '22:00', lunchStart: '02:00', lunchEnd: '03:00', end: '06:00', breakTime: '01:00', totalHours: '07:00 rel. (8.00h fictas)' },
        { date: 'Quarta-Feira', start: '22:00', lunchStart: '02:00', lunchEnd: '03:00', end: '06:00', breakTime: '01:00', totalHours: '07:00 rel. (8.00h fictas)' },
        { date: 'Quinta-Feira', start: '22:00', lunchStart: '02:00', lunchEnd: '03:00', end: '06:00', breakTime: '01:00', totalHours: '07:00 rel. (8.00h fictas)' },
      ],
    },
    freelancer_pj: {
      title: 'Controle de Horas por Projeto / Cliente (PJ)',
      desc: 'Monitore horas trabalhadas por projeto e calcule o valor faturável em Reais multiplicando pela taxa horária.',
      entries: [
        { date: 'Projeto Redesign Web', start: '09:00', lunchStart: '12:00', lunchEnd: '13:00', end: '15:00', breakTime: '01:00', totalHours: `05:00 ( R$ ${(5 * (parseFloat(customHourlyRate) || 25)).toFixed(2)} )` },
        { date: 'Integração API Pix', start: '14:00', lunchStart: '-', lunchEnd: '-', end: '18:00', breakTime: '00:00', totalHours: `04:00 ( R$ ${(4 * (parseFloat(customHourlyRate) || 25)).toFixed(2)} )` },
        { date: 'Suporte Técnico', start: '10:00', lunchStart: '12:00', lunchEnd: '13:00', end: '12:00', breakTime: '00:00', totalHours: `02:00 ( R$ ${(2 * (parseFloat(customHourlyRate) || 25)).toFixed(2)} )` },
      ],
    },
  };

  const currentTemplate = templatesData[activeTemplate];

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    generateTimesheetCSV(currentTemplate.entries, currentTemplate.title);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const copyTableToClipboard = () => {
    const headers = ['Dia / Descrição', 'Entrada', 'Saída Almoço', 'Retorno Almoço', 'Saída Final', 'Pausa', 'Cálculo Total'];
    const rowsText = currentTemplate.entries.map(e => 
      `${e.date}\t${e.start}\t${e.lunchStart || '-'}\t${e.lunchEnd || '-'}\t${e.end}\t${e.breakTime || '-'}\t${e.totalHours}`
    ).join('\n');

    const fullTSV = `${headers.join('\t')}\n${rowsText}`;
    navigator.clipboard.writeText(fullTSV);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2500);
  };

  const copyFormula = (formula: string, label: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(label);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const formulasList = [
    {
      title: '1. Calcular Horas Trabalhadas com Almoço',
      formula: '=(E2-B2)-(D2-C2)',
      desc: 'Subtrai o horário final do inicial e desconta a duração da pausa de almoço.',
    },
    {
      title: '2. Formatação para Soma Total Superior a 24 Horas',
      formula: '[hh]:mm',
      desc: 'Aplica no Excel em "Formatar Células > Personalizado" para não zerar a cada 24 horas.',
    },
    {
      title: '3. Converter Horas em Valor Reais (R$)',
      formula: '=TOTAL_HORAS * 24 * TAXA_HORARIA',
      desc: 'Multiplica por 24 para converter a fração de dia do Excel em número decimal.',
    },
    {
      title: '4. Identificar Horas Extras Acima de 8h',
      formula: '=SE(TOTAL>VALOR("08:00"); TOTAL-VALOR("08:00"); 0)',
      desc: 'Calcula o excedente da jornada diária regulamentar.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Modelos Grátis e Prontos em Excel / Google Sheets
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Planilhas de Cálculo de Horas Trabalhadas
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Baixe nossas planilhas prontas para Excel e Google Sheets com fórmulas automáticas de folha de ponto, controle de almoço, banco de horas, adicional noturno e horas extras.
        </p>
      </div>

      {/* Template Selector Tabs */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider text-center sm:text-left">
          Escolha o Modelo de Planilha Desejado:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(templatesData) as TemplateType[]).map((key) => {
            const t = templatesData[key];
            const isActive = activeTemplate === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Layers className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-neutral-400'}`} />
                  <span className={`font-bold text-xs ${isActive ? 'text-emerald-900' : 'text-neutral-800'}`}>
                    {t.title.split('(')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Customization Bar */}
      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Personalizar Parâmetros da Planilha em Tempo Real:
          </div>
          <button
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            {isCustomizing ? 'Restaurar Padrão' : 'Personalizar Horários'}
          </button>
        </div>

        {isCustomizing && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Entrada Padrão</label>
              <input
                type="time"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Saída Padrão</label>
              <input
                type="time"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Intervalo Almoço</label>
              <input
                type="time"
                value={customLunch}
                onChange={e => setCustomLunch(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Valor da Hora (R$)</label>
              <input
                type="number"
                step="5"
                value={customHourlyRate}
                onChange={e => setCustomHourlyRate(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Spreadsheet Preview Box */}
      <div className="bg-neutral-900 rounded-2xl p-5 text-white overflow-x-auto shadow-inner border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">{currentTemplate.title}</span>
          </div>
          
          <button
            type="button"
            onClick={copyTableToClipboard}
            className="text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-emerald-300 px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
          >
            {copiedTable ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Tabela Copiada! (Cole no Excel/Google Sheets)
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5 text-emerald-400" /> Copiar Tabela para Área de Transferência
              </>
            )}
          </button>
        </div>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-800">
              <th className="pb-2">Dia / Descrição</th>
              <th className="pb-2">Entrada</th>
              <th className="pb-2">Almoço</th>
              <th className="pb-2">Retorno</th>
              <th className="pb-2">Saída</th>
              <th className="pb-2 text-right">Cálculo / Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {currentTemplate.entries.map((row, idx) => (
              <tr key={idx} className="hover:bg-neutral-800/40">
                <td className="py-2.5 font-medium text-neutral-200">{row.date}</td>
                <td className="py-2.5 text-neutral-300">{row.start}</td>
                <td className="py-2.5 text-neutral-400">{row.lunchStart}</td>
                <td className="py-2.5 text-neutral-400">{row.lunchEnd}</td>
                <td className="py-2.5 text-neutral-300">{row.end}</td>
                <td className="py-2.5 text-right font-bold text-emerald-400">{row.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Action Form */}
      <form onSubmit={handleDownload} className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-lg">Baixar Modelo Gratuitamente (.CSV / Excel)</h3>
            <p className="text-emerald-100 text-xs">
              Faz o download direto do arquivo CSV pronto para Excel, LibreOffice e Google Sheets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                placeholder="Seu e-mail (opcional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-3 py-2.5 rounded-xl text-neutral-900 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {downloaded ? 'Baixando Arquivo...' : 'Baixar Modelo Excel'}
            </button>
          </div>
        </div>
      </form>

      {/* Instructions Box */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Como importar no Google Planilhas sem desconfigurar acentos:</span>
          <p className="text-blue-800 leading-relaxed">
            1. Abra o Google Drive / Planilhas &gt; Clique em <strong>Arquivo &gt; Importar &gt; Fazer Upload</strong>.<br />
            2. Selecione o arquivo <code>.csv</code> baixado e escolha o tipo de separador como <strong>"Ponto e vírgula (;)"</strong> ou <strong>"Detectar automaticamente"</strong>.
          </p>
        </div>
      </div>

      {/* Features checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-700">
        <div className="flex items-start gap-2 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Fórmulas nativas prontas para cálculo de intervalos</span>
        </div>
        <div className="flex items-start gap-2 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Compatível com Microsoft Excel, Numbers e Google Planilhas</span>
        </div>
        <div className="flex items-start gap-2 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>100% gratuito e sem necessidade de cadastro</span>
        </div>
      </div>

      {/* Excel Formulas Cheatsheet Section */}
      <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
          <Code className="w-4 h-4 text-blue-600" />
          Guia Rápido de Fórmulas do Excel para Controle de Ponto
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formulasList.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-neutral-800">{item.title}</span>
                <button
                  onClick={() => copyFormula(item.formula, item.title)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedFormula === item.title ? (
                    <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Copiado</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copiar</span>
                  )}
                </button>
              </div>
              <div className="bg-neutral-100 p-2 rounded-lg font-mono text-[11px] text-neutral-800 font-bold border border-neutral-200">
                {item.formula}
              </div>
              <p className="text-[11px] text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


