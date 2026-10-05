import { useState } from 'react';
import { calculateDuration, isValidTime, minutesToTime } from '../utils/time';
import ToolControls from './ToolControls';

export default function HourCounterCalculator() {
  const [start, setStart] = useState('08:25'), [end, setEnd] = useState('17:46');
  const valid = isValidTime(start) && isValidTime(end);
  const minutes = valid ? calculateDuration(start, end) : null;
  const result = minutes === null ? null : `${minutesToTime(minutes)} = ${(minutes / 60).toFixed(2).replace('.', ',')} h`;
  return <section className="tool-card">
    <div className="grid sm:grid-cols-2 gap-4">
      <label>Horário inicial<input className="tool-input" type="time" value={start} onInput={event => setStart(event.currentTarget.value)} /></label>
      <label>Horário final<input className="tool-input" type="time" value={end} onInput={event => setEnd(event.currentTarget.value)} /></label>
    </div>
    <button className="tool-button my-3" onClick={() => { setStart(end); setEnd(start); }}>Trocar horários</button>
    {!valid && <p role="alert">Informe dois horários válidos em HH:MM.</p>}
    {result !== null && <><output className="tool-result" aria-live="polite">{result}</output><details open><summary>Memória de cálculo</summary><p>{end} − {start}{end < start ? ' + 24 horas (passagem pela meia-noite)' : ''} = {minutesToTime(minutes!)}. Decimal: {minutes} ÷ 60.</p></details></>}
    <ToolControls result={result} reset={() => { setStart(''); setEnd(''); }} />
  </section>;
}
