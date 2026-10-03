import { ARTICLE_META } from './utils/articles';
import CalculationReference from './components/CalculationReference';
import { TOOL_ANSWERS } from './utils/editorial';
import BrowserNotice from './components/BrowserNotice';
import CalculatorErrorBoundary from './components/CalculatorErrorBoundary';
import React, { useState, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const DailyCalculator = React.lazy(() => import('./components/DailyCalculator'));
const TimesheetCalculator = React.lazy(() => import('./components/TimesheetCalculator'));
const MonthlyCalculator = React.lazy(() => import('./components/MonthlyCalculator'));
const BancoDeHorasCalculator = React.lazy(() => import('./components/BancoDeHorasCalculator'));
const TimeSumCalculator = React.lazy(() => import('./components/TimeSumCalculator'));
const HourlyRateCalculator = React.lazy(() => import('./components/HourlyRateCalculator'));
const OvertimeCalculator = React.lazy(() => import('./components/OvertimeCalculator'));
const NightHoursCalculator = React.lazy(() => import('./components/NightHoursCalculator'));
const HoleriteCalculator = React.lazy(() => import('./components/HoleriteCalculator'));
const RescisaoCalculator = React.lazy(() => import('./components/RescisaoCalculator'));
const Escala12x36Calculator = React.lazy(() => import('./components/Escala12x36Calculator'));
const FaltasAtrasosCalculator = React.lazy(() => import('./components/FaltasAtrasosCalculator'));
const FeriasCalculator = React.lazy(() => import('./components/FeriasCalculator'));
const DecimoTerceiroCalculator = React.lazy(() => import('./components/DecimoTerceiroCalculator'));
const SeguroDesempregoCalculator = React.lazy(() => import('./components/SeguroDesempregoCalculator'));
const InsalubridadePericulosidadeCalculator = React.lazy(() => import('./components/InsalubridadePericulosidadeCalculator'));
const CltVsPjCalculator = React.lazy(() => import('./components/CltVsPjCalculator'));
const ExcelDownloadSection = React.lazy(() => import('./components/ExcelDownloadSection'));
const BlogSection = React.lazy(() => import('./components/BlogSection'));

const FAQSection = React.lazy(() => import('./components/FAQSection'));
const SEOContent = React.lazy(() => import('./components/SEOContent'));
import Breadcrumb from './components/Breadcrumb';
import CalculationHistoryModal from './components/CalculationHistoryModal';

const AboutUsPage = React.lazy(() => import('./components/AboutUsPage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const TermsPage = React.lazy(() => import('./components/TermsPage'));
const PrivacyPage = React.lazy(() => import('./components/PrivacyPage'));
const NotFound = React.lazy(() => import('./components/NotFound'));

import CookieBanner from './components/CookieBanner';
import QuickConverterModal from './components/QuickConverterModal';
import { HolidayCalendarModal } from './components/HolidayCalendarModal';
import { LegalFAQModal } from './components/LegalFAQModal';
import { FileSpreadsheet, Clock, Sparkles, CheckCircle, Calculator, ArrowRightLeft, Calendar, BookOpen, Scale, WifiOff, Moon, Sun, ShieldAlert, Biohazard, Gift, Palmtree } from 'lucide-react';
import { getTabFromLocation, getHrefForTab, TAB_ROUTES } from './utils/routes';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { useDarkMode } from './hooks/useDarkMode';

export const PAGE_SUBTITLES: Record<string, string> = {
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
  escala12x36: 'Plantões de 12 horas com cálculo de hora noturna, feriados trabalhados em dobro e estimativa de remuneração.',
  faltas: 'Calcule os descontos de atrasos por minuto, faltas injustificadas e reflexo na perda do DSR (Lei 605/49).',
  ferias: 'Cálculo de férias CLT 2026 com 1/3 constitucional, abono pecuniário (venda de 10 dias) e deduções INSS/IRRF.',
  decimo: 'Simule a 1ª e 2ª parcelas do 13º salário com cálculo de meses trabalhados e deduções progressivas de 2026.',
  seguro: 'Calcule a quantidade de parcelas (3 a 5) e o valor de cada parcela do seguro-desemprego segundo a tabela oficial do MTE.',
  insalubridade: 'Calcule adicionais de insalubridade (10%, 20%, 40%) e periculosidade (30%) com reflexos em 13º, férias e FGTS.',
  cltpj: 'Compare seu salário líquido CLT com propostas PJ. Descubra quanto cobrar para manter seu padrão financeiro.',
  excel: 'Modelos de planilhas prontas para controle de ponto diário, semanal e mensal em Excel com fórmulas automáticas.',
  blog: 'Aprenda tudo sobre regras de ponto, tolerância de 10 minutos, intervalo intrajornada, adicional noturno e divisor 220 da CLT.',
  about: 'Conheça nossa missão, transparência, precisão dos cálculos e compromisso com os direitos trabalhistas no Brasil.',
  contact: 'Entre em contato com nossa equipe para dúvidas sobre cálculos, report de divergências ou parcerias comerciais.',
  terms: 'Aviso legal e termos de utilização das ferramentas de cálculo de horas trabalhadas do portal.',
  privacy: 'Entenda como garantimos a total privacidade dos seus dados. Processamento 100% no seu navegador.'
};

export const PAGE_H1_TITLES: Record<string, string> = {
  daily: 'Calculadora de Horas Trabalhadas Diária',
  timesheet: 'Calculadora de Horas Trabalhadas Semanal (CLT 44h)',
  monthly: 'Calculadora de Horas Trabalhadas Mensal',
  banco: 'Calculadora de Banco de Horas (Saldo Positivo e Negativo)',
  sum: 'Somador e Subtraidor de Horas Online',
  holerite: 'Simulador de Holerite e Salário Líquido (CLT)',
  rescisao: 'Calculadora de Rescisão Contratual (CLT 2026)',
  rate: 'Calculadora de Valor da Hora de Trabalho',
  overtime: 'Calculadora de Horas Extras e DSR (50% e 100%)',
  night: 'Calculadora de Adicional Noturno e Hora Ficta',
  escala12x36: 'Calculadora de Escala 12x36 (Plantões e Noturno)',
  faltas: 'Calculadora de Faltas, Atrasos e Perda do DSR',
  ferias: 'Calculadora de Férias CLT 2026 com 1/3 e Venda',
  decimo: 'Calculadora de 13º Salário (1ª e 2ª Parcelas)',
  seguro: 'Calculadora de Seguro-Desemprego 2026',
  insalubridade: 'Calculadora de Insalubridade e Periculosidade',
  cltpj: 'Calculadora CLT x PJ (Comparador de Salário Líquido)',
  excel: 'Planilhas de Controle de Ponto em Excel',
  blog: 'Guia Completo da CLT e Horas Trabalhadas',
  about: 'Sobre Nós - Transparência e Precisão no Cálculo CLT',
  contact: 'Fale Conosco - Atendimento e Suporte',
  terms: 'Termos de Uso e Condições de Serviço',
  privacy: 'Política de Privacidade e Conformidade LGPD',
};

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromLocation());
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isOffline = useOfflineStatus();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [auxOpen, setAuxOpen] = useState(() => window.matchMedia('(min-width: 640px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const sync = () => setAuxOpen(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const [isQuickConverterOpen, setIsQuickConverterOpen] = useState(false);
  const [isHolidayCalendarOpen, setIsHolidayCalendarOpen] = useState(false);
  const [isLegalFAQOpen, setIsLegalFAQOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync state with browser URL
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const path = getHrefForTab(tab);
    if (window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
    setPathname(window.location.pathname);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setActiveTabState(getTabFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isStandalonePage = ['about', 'contact', 'terms', 'privacy'].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/60 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* SEO Head Dynamic Metadata */}
      <SEOHead activeTab={activeTab} pathname={pathname} />
      <BrowserNotice />

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-neutral-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-in fade-in duration-300">
          <WifiOff className="w-4 h-4" />
          <span>Modo Offline Ativo: Todas as calculadoras continuam funcionando perfeitamente sem internet!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-neutral-900 text-neutral-200 py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Calculadora de Horas Trabalhadas Online Grátis - Padrão CLT 2026</span>
        <button
          onClick={() => setActiveTab('excel')}
          className="underline hover:text-amber-300 ml-2 font-bold cursor-pointer hidden sm:inline"
        >
          [Baixar Planilha Excel Modelo]
        </button>
      </div>

      {/* Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        toggleDark={toggleDark} 
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Hero Headline Section */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-4 sm:py-8 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            {ARTICLE_META.find(row => pathname.replace(/\/$/, '') === `/guia-clt/${row.slug}`)?.title || PAGE_H1_TITLES[activeTab] || 'Calculadora de Horas Trabalhadas'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {ARTICLE_META.find(row => pathname.replace(/\/$/, '') === `/guia-clt/${row.slug}`)?.description || PAGE_SUBTITLES[activeTab] || 'Ferramenta gratuita para calcular horas trabalhadas no dia, na semana e no mês, intervalo de almoço, valor da hora, horas extras (50% e 100%) e adicional noturno no padrão CLT.'}
          </p>

          <a href={activeTab === 'daily' ? '#daily-hours' : '#main-calculator'} className="inline-block text-sm font-bold text-blue-700 dark:text-blue-300 underline">Ir para a calculadora</a>
          {/* Quick Sub-tools Pill Bar */}
          <details className="tool-links"><summary className="cursor-pointer text-xs py-2">Outras calculadoras</summary><div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); setActiveTab('daily'); }}
              title="Calculadora de Horas Diárias"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'daily'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Horas Diárias
            </a>
            <a
              href={getHrefForTab('timesheet')}
              onClick={(e) => { e.preventDefault(); setActiveTab('timesheet'); }}
              title="Calculadora Semanal 44h CLT"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'timesheet'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Semanal 44h
            </a>
            <a
              href={getHrefForTab('overtime')}
              onClick={(e) => { e.preventDefault(); setActiveTab('overtime'); }}
              title="Calculadora de Horas Extras"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'overtime'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Horas Extras
            </a>
            <a
              href={getHrefForTab('ferias')}
              onClick={(e) => { e.preventDefault(); setActiveTab('ferias'); }}
              title="Calculadora de Férias CLT"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'ferias'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Férias CLT
            </a>
            <a
              href={getHrefForTab('decimo')}
              onClick={(e) => { e.preventDefault(); setActiveTab('decimo'); }}
              title="Calculadora de 13º Salário"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'decimo'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              13º Salário
            </a>
            <a
              href={getHrefForTab('seguro')}
              onClick={(e) => { e.preventDefault(); setActiveTab('seguro'); }}
              title="Calculadora de Seguro-Desemprego"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'seguro'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Seguro-Desemprego
            </a>
            <a
              href={getHrefForTab('insalubridade')}
              onClick={(e) => { e.preventDefault(); setActiveTab('insalubridade'); }}
              title="Calculadora de Insalubridade e Periculosidade"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'insalubridade'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Insalubridade
            </a>
            <a
              href={getHrefForTab('cltpj')}
              onClick={(e) => { e.preventDefault(); setActiveTab('cltpj'); }}
              title="Calculadora CLT x PJ"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'cltpj'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              CLT x PJ
            </a>
            <a
              href={getHrefForTab('holerite')}
              onClick={(e) => { e.preventDefault(); setActiveTab('holerite'); }}
              title="Simulador de Holerite"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'holerite'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Holerite
            </a>
            <a
              href={getHrefForTab('rescisao')}
              onClick={(e) => { e.preventDefault(); setActiveTab('rescisao'); }}
              title="Calculadora de Rescisão"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'rescisao'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Rescisão
            </a>
          </div>

          </details>
          <details open={auxOpen} onToggle={e => setAuxOpen(e.currentTarget.open)}><summary className="sm:hidden text-xs cursor-pointer py-2">Conversor, calendário e guia CLT</summary>
          {/* Practical Utilities Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
            <button
              onClick={() => setIsQuickConverterOpen(true)}
              className="px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Converter Horas ↔ Decimal
            </button>
            <button
              onClick={() => setIsHolidayCalendarOpen(true)}
              className="px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Dias Úteis 2026
            </button>
            <button
              onClick={() => setIsLegalFAQOpen(true)}
              className="px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Guia CLT 2026
            </button>
          </div>
          </details>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <Breadcrumb activeTab={activeTab} onSelectTab={setActiveTab} />

        {isStandalonePage ? (
          <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Carregando conteúdo...</div>}>
            {activeTab === 'about' && <AboutUsPage onSelectCalculator={setActiveTab} />}
            {activeTab === 'contact' && <ContactPage onSelectCalculator={setActiveTab} />}
            {activeTab === 'terms' && <TermsPage />}
            {activeTab === 'privacy' && <PrivacyPage />}
          </Suspense>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Main Calculator Container Card */}
              {activeTab === 'not-found' ? (
                <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-500">Carregando...</div>}>
                  <NotFound onNavigateHome={() => setActiveTab('daily')} />
                </Suspense>
              ) : (
                <div id="main-calculator" className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 transition-colors">
                  <CalculatorErrorBoundary key={activeTab}><Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Carregando calculadora...</div>}>
                    {activeTab === 'daily' && <DailyCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'timesheet' && <TimesheetCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'monthly' && <MonthlyCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'banco' && <BancoDeHorasCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'sum' && <TimeSumCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'holerite' && <HoleriteCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'rescisao' && <RescisaoCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'rate' && <HourlyRateCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'overtime' && <OvertimeCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'night' && <NightHoursCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'escala12x36' && <Escala12x36Calculator onSelectTab={setActiveTab} />}
                    {activeTab === 'faltas' && <FaltasAtrasosCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'ferias' && <FeriasCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'decimo' && <DecimoTerceiroCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'seguro' && <SeguroDesempregoCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'insalubridade' && <InsalubridadePericulosidadeCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'cltpj' && <CltVsPjCalculator onSelectTab={setActiveTab} />}
                    {activeTab === 'excel' && <ExcelDownloadSection />}
                    {activeTab === 'blog' && <BlogSection onSelectCalculator={setActiveTab} />}
                  </Suspense></CalculatorErrorBoundary>
                </div>
              )}

              <CalculationReference activeTab={activeTab} />
              {/* SEO Structured Content */}
              <div className="no-print"><CalculatorErrorBoundary key={`content-${activeTab}`} message="Não foi possível carregar este guia. Tente novamente."><Suspense fallback={null}><SEOContent activeTab={activeTab} onSelectTab={setActiveTab} /></Suspense></CalculatorErrorBoundary></div>

              {/* FAQ Section */}
              <div className="no-print"><CalculatorErrorBoundary key={`faq-${activeTab}`} message="Não foi possível carregar as perguntas frequentes. Tente novamente."><Suspense fallback={null}>{TOOL_ANSWERS[activeTab] && <FAQSection activeTab={activeTab} onSelectTab={setActiveTab} />}</Suspense></CalculatorErrorBoundary></div>
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6 no-print">
              
              {/* Sidebar CTA 1: Excel Planilha Download */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileSpreadsheet className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                    Download Gratuito
                  </span>
                  <h3 className="text-lg font-bold">Planilha de Cálculo de Horas Excel</h3>
                </div>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Baixe a planilha pronta em Excel para registro de folha de ponto, com fórmulas automáticas de saldo e horas extras no padrão CLT.
                </p>
                <button
                  onClick={() => setActiveTab('excel')}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Baixar Planilha em Excel
                </button>
              </div>

              {/* Sidebar Info Card: Regras Rápidas CLT */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 transition-colors">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm">Resumo da Legislação CLT</h3>
                </div>
                <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Jornada Limite:</strong> Máximo de 8 horas por dia e 44 horas semanais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Intervalo de Almoço:</strong> Mínimo de 1 hora obrigatória para trabalhos acima de 6h/dia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Adicional de Hora Extra:</strong> Mínimo de 50% em dias úteis e 100% aos domingos e feriados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Divisor Padrão:</strong> 220 para jornada de 44h/semana e 200 para jornada de 40h/semana.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Trabalho Noturno:</strong> Adicional de 20% das 22h às 5h com hora de 52min30s.</span>
                  </li>
                </ul>
              </div>

              {/* AdSense Placement Space Placeholder */}
              <div className="bg-neutral-100/70 dark:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-2">
                <div className="font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[10px]">
                  Anúncio patrocinado / AdSense
                </div>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Espaço reservado para monetização com Google AdSense.
                </p>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
      <button className="text-xs underline py-3 bg-neutral-100 dark:bg-neutral-900 no-print" onClick={() => window.dispatchEvent(new Event('cookie-preferences'))}>Gerenciar preferências de cookies</button>

      {/* Quick Converter Modal */}
      <QuickConverterModal
        isOpen={isQuickConverterOpen}
        onClose={() => setIsQuickConverterOpen(false)}
      />

      {/* Holiday & Working Days Calendar Modal */}
      <HolidayCalendarModal
        isOpen={isHolidayCalendarOpen}
        onClose={() => setIsHolidayCalendarOpen(false)}
      />

      {/* CLT Legal FAQ Modal */}
      <LegalFAQModal
        isOpen={isLegalFAQOpen}
        onClose={() => setIsLegalFAQOpen(false)}
      />

      {/* Calculation History Modal */}
      <CalculationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTab={setActiveTab}
      />

      {/* PWA Floating Install Prompt */}
      <PWAInstallPrompt />

      {/* LGPD & AdSense Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={() => setActiveTab('privacy')} />
    </div>
  );
}
