import { copyText as writeClipboard } from '../utils/browser';
import { Calculator, Clock, Calendar, DollarSign, Moon, Sun, BookOpen, FileSpreadsheet, Menu, X, Scale, ArrowRightLeft, FileText, Users, Mail, Share2, Check, Briefcase, History, Palmtree, AlertTriangle, ShieldCheck, Gift, ShieldAlert, Biohazard } from 'lucide-react';
import { useState } from 'react';
import { getHrefForTab } from '../utils/routes';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark?: boolean;
  toggleDark?: () => void;
  onOpenHistory?: () => void;
}

export default function Header({ activeTab, setActiveTab, isDark, toggleDark, onOpenHistory }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const navItems = [
    { id: 'daily', label: 'Diária', icon: Clock },
    { id: 'timesheet', label: 'Semanal', icon: Calendar },
    { id: 'monthly', label: 'Mensal', icon: Calculator },
    { id: 'overtime', label: 'Hora Extra', icon: Clock },
    { id: 'night', label: 'Noturno', icon: Moon },
    { id: 'escala12x36', label: '12x36', icon: ShieldCheck },
    { id: 'faltas', label: 'Faltas/DSR', icon: AlertTriangle },
    { id: 'ferias', label: 'Férias', icon: Palmtree },
    { id: 'decimo', label: '13º Salário', icon: Gift },
    { id: 'seguro', label: 'Seguro-Desemp.', icon: ShieldAlert },
    { id: 'insalubridade', label: 'Insalubridade', icon: Biohazard },
    { id: 'cltpj', label: 'CLT x PJ', icon: ArrowRightLeft },
    { id: 'holerite', label: 'Holerite', icon: FileText },
    { id: 'rescisao', label: 'Rescisão', icon: Briefcase },
    { id: 'rate', label: 'Valor Hora', icon: DollarSign },
    { id: 'banco', label: 'Banco', icon: Scale },
    { id: 'excel', label: 'Planilha', icon: FileSpreadsheet },
    { id: 'blog', label: 'Guia CLT', icon: BookOpen },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Calculadora de Horas Trabalhadas CLT 2026',
          text: 'Calcule horas diárias, 12x36, férias, horas extras e holerite grátis!',
          url: url,
        });
      } catch (err) {
        // user cancelled share
      }
    } else {
      if (!await writeClipboard(url)) return;
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('daily');
          }}
          className="flex items-center gap-2.5 text-left group min-w-0 flex-1 sm:flex-none"
          title="Calculadora de Horas Trabalhadas - Página Inicial"
        >
          <div className="w-9 h-9 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-neutral-900 dark:text-white text-xs sm:text-base tracking-tight block truncate leading-none">
              Calculadora de Horas
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase hidden sm:block mt-0.5">
              calculadoradehorastrabalhadas.org
            </span>
          </div>
        </a>

        {/* Desktop Nav - Horizontal Scroll on medium screens, flex on large */}
        <nav className="hidden items-center gap-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const href = getHrefForTab(item.id);
            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                title={`Calculadora ${item.label}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'}`} aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              title="Histórico de Cálculos"
              className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-2.5 py-2 rounded-xl transition-colors cursor-pointer no-print"
            >
              <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          )}

          <button
            onClick={toggleDark}
            title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            className="flex items-center justify-center w-8 h-8 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer no-print"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            title="Compartilhar Link da Calculadora"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 rounded-xl transition-colors cursor-pointer no-print"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Compartilhar</span>
              </>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen} aria-controls="tool-menu" className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="tool-menu" className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 grid grid-cols-2 gap-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const href = getHrefForTab(item.id);
            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                title={`Calculadora ${item.label}`}
                aria-label={`Calculadora ${item.label}`}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'}`} aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
