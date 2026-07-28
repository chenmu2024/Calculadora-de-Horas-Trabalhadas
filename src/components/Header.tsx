import { Calculator, Clock, Calendar, DollarSign, Moon, Sun, BookOpen, FileSpreadsheet, Menu, X, Scale, ArrowRightLeft, FileText, Users, Mail, Share2, Check, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { getHrefForTab } from '../utils/routes';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark?: boolean;
  toggleDark?: () => void;
}

export default function Header({ activeTab, setActiveTab, isDark, toggleDark }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const navItems = [
    { id: 'daily', label: 'Diária', icon: Clock },
    { id: 'timesheet', label: 'Semanal', icon: Calendar },
    { id: 'monthly', label: 'Mensal', icon: Calculator },
    { id: 'banco', label: 'Banco de Horas', icon: Scale },
    { id: 'holerite', label: 'Holerite', icon: FileText },
    { id: 'rescisao', label: 'Rescisão', icon: Briefcase },
    { id: 'rate', label: 'Valor Hora', icon: DollarSign },
    { id: 'overtime', label: 'Hora Extra', icon: Clock },
    { id: 'night', label: 'Noturno', icon: Moon },
    { id: 'excel', label: 'Planilha', icon: FileSpreadsheet },
    { id: 'blog', label: 'Guia', icon: BookOpen },
    { id: 'about', label: 'Sobre', icon: Users },
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
          title: 'Calculadora de Horas Trabalhadas CLT',
          text: 'Calcule suas horas diárias, semanais, holerite e horas extras gratuitamente!',
          url: url,
        });
      } catch (err) {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('daily');
          }}
          className="flex items-center gap-2.5 text-left group"
          title="Calculadora de Horas Trabalhadas - Página Inicial"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-neutral-900 dark:text-white text-base tracking-tight block leading-none">
              Calculadora de Horas
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase block mt-0.5">
              calculadoradehorastrabalhadas.org
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Share & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2">
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
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-neutral-400'}`} />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
