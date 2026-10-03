import { useDialog } from '../hooks/useDialog';
import { copyText as writeClipboard } from '../utils/browser';
import { HistoryItem, readHistory, clearHistory } from '../utils/history';
import React, { useState, useEffect } from 'react';
import { History, Trash2, X, Clock, Copy, Check, Calculator, ExternalLink } from 'lucide-react';
import { getHrefForTab } from '../utils/routes';

interface CalculationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export default function CalculationHistoryModal({ isOpen, onClose, onSelectTab }: CalculationHistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = readHistory();
        setHistory(saved);
      } catch {
        setHistory([]);
      }
    }
  }, [isOpen]);

  const handleClear = () => {
    if (clearHistory()) setHistory([]);
  };

  const handleCopy = async (item: HistoryItem) => {
    if (!await writeClipboard(`[${item.toolName}] ${item.summary} | Valor: ${item.mainValue} (em ${item.date})`)) return;
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Histórico de Cálculos" tabIndex={-1} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-base">Histórico de Cálculos</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Salvo 100% no seu navegador com privacidade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 dark:text-neutral-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-semibold">Nenhum cálculo salvo ainda.</p>
              <p className="text-xs">Ao realizar apurações nas calculadoras, seus resultados aparecerão aqui para consulta rápida.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                      {item.toolName}
                    </span>
                    <span className="text-neutral-400 text-[10px]">{item.date}</span>
                  </div>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 break-words">{item.summary}</p>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {item.mainValue}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(item)}
                    title="Copiar resultado"
                    className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab(item.toolTab);
                      onClose();
                    }}
                    title="Abrir calculadora"
                    className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
            <button
              onClick={onClose}
            aria-label="Fechar"
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
