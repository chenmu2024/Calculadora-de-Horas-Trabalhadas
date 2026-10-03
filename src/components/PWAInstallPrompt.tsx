import { storage } from '../utils/browser';
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return storage.getItem('pwa_prompt_dismissed') === 'true';
  });

  useEffect(() => {
    // Register service worker
    const register = () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); };
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('load', register);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    storage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (dismissed || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="mx-4 my-3 sm:mx-auto sm:max-w-md bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl z-20 border border-neutral-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 no-print">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-white">Instalar Aplicativo</h4>
          <p className="text-[11px] text-neutral-300 leading-tight">
            Use a calculadora offline no celular ou PC sem precisar abrir o navegador!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
