import { storage } from '../utils/browser';
import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy?: () => void;
}

export default function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const reopen = () => setIsVisible(true);
    window.addEventListener('cookie-preferences', reopen);
    const consent = storage.getItem('lgpd_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
    return () => window.removeEventListener('cookie-preferences', reopen);
  }, []);

  const handleAcceptAll = () => {
    storage.setItem('lgpd_cookie_consent', 'accepted_all');
    storage.setItem('lgpd_cookie_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    storage.setItem('lgpd_cookie_consent', 'essential_only');
    storage.setItem('lgpd_cookie_date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 bg-neutral-900/95 backdrop-blur-md text-white border-t border-neutral-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left text & icon */}
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-neutral-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <span>Aviso de Privacidad e Cookies (LGPD & Google AdSense)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                Lei nº 13.709/2018
              </span>
            </div>
            <p className="leading-relaxed text-neutral-300 text-xs">
              Utilizamos cookies essenciais para o funcionamento do site e preferências locais. Atualmente não carregamos publicidade ou análise de terceiros; qualquer ativação futura de <strong>Google AdSense</strong> deve respeitar sua escolha de acordo com a nossa{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-blue-400 underline font-semibold hover:text-blue-300 cursor-pointer"
              >
                Política de Privacidade
              </button>
              . Você pode gerenciar suas preferências a qualquer momento.
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            onClick={handleAcceptEssential}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Apenas Essenciais
          </button>
          
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Aceitar Todos os Cookies</span>
          </button>
        </div>

      </div>
    </div>
  );
}
