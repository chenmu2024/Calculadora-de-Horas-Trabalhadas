import React from 'react';
import { Home, Search, AlertCircle } from 'lucide-react';

interface NotFoundProps {
  onNavigateHome: () => void;
}

export default function NotFound({ onNavigateHome }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">404 - Página Não Encontrada</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-lg mb-8">
        Ops! Parece que você tentou acessar uma página que não existe, foi movida ou está temporariamente indisponível.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onNavigateHome}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <Home className="w-5 h-5" />
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}
