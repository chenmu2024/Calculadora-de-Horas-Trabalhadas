import { useState } from 'react';
import { copyText } from '../utils/browser';

export default function ToolControls({ result, reset }: { result: string | null; reset: () => void }) {
  const [message, setMessage] = useState('');
  return <div className="flex flex-wrap gap-3 py-3">
    <button type="button" disabled={result === null} onClick={async () => setMessage(await copyText(result!) ? 'Copiado!' : 'Não foi possível copiar. Selecione o resultado.')} className="tool-button disabled:opacity-50">Copiar resultado</button>
    <button type="button" onClick={() => { reset(); setMessage(''); }} className="tool-button">Limpar</button>
    <span role="status">{message}</span>
  </div>;
}
