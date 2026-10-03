import { useEffect, useState } from 'react';
export default function BrowserNotice() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const receive = (event: Event) => setMessage((event as CustomEvent<string>).detail);
    window.addEventListener('calculator-notice', receive);
    return () => window.removeEventListener('calculator-notice', receive);
  }, []);
  if (!message) return null;
  return <div role="alert" className="fixed top-20 left-4 right-4 z-[90] max-w-xl mx-auto bg-amber-100 text-amber-950 border border-amber-400 rounded-xl p-4 shadow-lg no-print">{message}<button aria-label="Fechar aviso" onClick={() => setMessage('')} className="ml-3 underline font-bold">Fechar</button></div>;
}
