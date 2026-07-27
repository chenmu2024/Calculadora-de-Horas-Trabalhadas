import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import DailyCalculator from './components/DailyCalculator';
import TimesheetCalculator from './components/TimesheetCalculator';
import MonthlyCalculator from './components/MonthlyCalculator';
import BancoDeHorasCalculator from './components/BancoDeHorasCalculator';
import TimeSumCalculator from './components/TimeSumCalculator';
import HourlyRateCalculator from './components/HourlyRateCalculator';
import OvertimeCalculator from './components/OvertimeCalculator';
import NightHoursCalculator from './components/NightHoursCalculator';
import HoleriteCalculator from './components/HoleriteCalculator';
import RescisaoCalculator from './components/RescisaoCalculator';
import ExcelDownloadSection from './components/ExcelDownloadSection';
import BlogSection from './components/BlogSection';
import FAQSection from './components/FAQSection';
import SEOContent from './components/SEOContent';
import Breadcrumb from './components/Breadcrumb';
import AboutUsPage from './components/AboutUsPage';
import ContactPage from './components/ContactPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import CookieBanner from './components/CookieBanner';
import QuickConverterModal from './components/QuickConverterModal';
import { HolidayCalendarModal } from './components/HolidayCalendarModal';
import { LegalFAQModal } from './components/LegalFAQModal';
import { FileSpreadsheet, Clock, Sparkles, CheckCircle, Calculator, ArrowRightLeft, Calendar, BookOpen, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'daily';
  });

  const [isQuickConverterOpen, setIsQuickConverterOpen] = useState(false);
  const [isHolidayCalendarOpen, setIsHolidayCalendarOpen] = useState(false);
  const [isLegalFAQOpen, setIsLegalFAQOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const url = new URL(window.location.href);
    if (tab === 'daily') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTabState(params.get('tab') || 'daily');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isStandalonePage = ['about', 'contact', 'terms', 'privacy'].includes(activeTab);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200 flex flex-col">
      <SEOHead activeTab={activeTab} />

      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
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
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Headline Section */}
      <section className="bg-white border-b border-neutral-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Calculadora de Horas Trabalhadas
          </h1>
          <p className="text-neutral-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ferramenta gratuita para calcular <strong>horas trabalhadas no dia, na semana e no mês</strong>, intervalo de almoço, valor da hora, horas extras (50% e 100%) e adicional noturno no padrão CLT.
          </p>

          {/* Quick Sub-tools Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); setActiveTab('daily'); }}
              title="Calculadora de Horas Diárias"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'daily'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Horas Diárias
            </a>
            <a
              href="/?tab=timesheet"
              onClick={(e) => { e.preventDefault(); setActiveTab('timesheet'); }}
              title="Calculadora Semanal 44h CLT"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'timesheet'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Semanal 44h
            </a>
            <a
              href="/?tab=monthly"
              onClick={(e) => { e.preventDefault(); setActiveTab('monthly'); }}
              title="Calculadora Mensal de Horas Trabalhadas"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'monthly'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Cálculo Mensal
            </a>
            <a
              href="/?tab=banco"
              onClick={(e) => { e.preventDefault(); setActiveTab('banco'); }}
              title="Calculadora de Banco de Horas"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'banco'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Banco de Horas
            </a>
            <a
              href="/?tab=sum"
              onClick={(e) => { e.preventDefault(); setActiveTab('sum'); }}
              title="Somador de Horas Online"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'sum'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Somador de Horas
            </a>
            <a
              href="/?tab=holerite"
              onClick={(e) => { e.preventDefault(); setActiveTab('holerite'); }}
              title="Simulador de Holerite e Salário Líquido"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'holerite'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Holerite
            </a>
            <a
              href="/?tab=rescisao"
              onClick={(e) => { e.preventDefault(); setActiveTab('rescisao'); }}
              title="Calculadora de Rescisão Contratual CLT"
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeTab === 'rescisao'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Rescisão CLT
            </a>
            <a
              href="/?tab=rate"
              onClick={(e) => { e.preventDefault(); setActiveTab('rate'); }}
              title="Calculadora de Valor da Hora Trabalhada"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'rate'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Valor Hora
            </a>
            <a
              href="/?tab=overtime"
              onClick={(e) => { e.preventDefault(); setActiveTab('overtime'); }}
              title="Calculadora de Horas Extras 50% e 100%"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'overtime'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Hora Extra
            </a>
            <a
              href="/?tab=night"
              onClick={(e) => { e.preventDefault(); setActiveTab('night'); }}
              title="Calculadora de Adicional Noturno"
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeTab === 'night'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Adicional Noturno
            </a>
            <button
              onClick={() => setIsQuickConverterOpen(true)}
              className="px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" /> Conversor ⇄
            </button>
            <button
              onClick={() => setIsHolidayCalendarOpen(true)}
              className="px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Dias Úteis 2026
            </button>
            <button
              onClick={() => setIsLegalFAQOpen(true)}
              className="px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" /> Guia CLT 2026
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <Breadcrumb activeTab={activeTab} onSelectTab={setActiveTab} />

        {isStandalonePage ? (
          <div>
            {activeTab === 'about' && <AboutUsPage onSelectCalculator={setActiveTab} />}
            {activeTab === 'contact' && <ContactPage onSelectCalculator={setActiveTab} />}
            {activeTab === 'terms' && <TermsPage />}
            {activeTab === 'privacy' && <PrivacyPage />}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Main Calculator Container Card */}
              <div id="main-calculator" className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
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
                {activeTab === 'excel' && <ExcelDownloadSection />}
                {activeTab === 'blog' && <BlogSection onSelectCalculator={setActiveTab} />}
              </div>

              {/* SEO Structured Content */}
              <SEOContent onSelectTab={setActiveTab} />

              {/* Knowledge Base Articles Section */}
              <BlogSection onSelectCalculator={setActiveTab} />

              {/* FAQ Section */}
              <FAQSection activeTab={activeTab} onSelectTab={setActiveTab} />
            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
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
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm">Resumo da Legislação CLT</h3>
                </div>
                <ul className="text-xs text-neutral-600 space-y-3">
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
              <div className="bg-neutral-100/70 border border-dashed border-neutral-300 rounded-2xl p-6 text-center text-xs text-neutral-500 space-y-2">
                <div className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
                  Anúncio patrocinado / AdSense
                </div>
                <p className="text-[11px] text-neutral-400">
                  Espaço reservado para monetização com Google AdSense.
                </p>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

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

      {/* PWA Floating Install Prompt */}
      <PWAInstallPrompt />

      {/* LGPD & AdSense Cookie Consent Banner */}
      <CookieBanner onOpenPrivacy={() => setActiveTab('privacy')} />
    </div>
  );
}
