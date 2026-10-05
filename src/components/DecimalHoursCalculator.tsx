import { useState } from 'react';
import { decimalToMinutes, hoursToDecimal } from '../utils/conversions';
import { minutesToTime, timeToMinutes } from '../utils/time';
import ToolControls from './ToolControls';

export default function DecimalHoursCalculator() {
  const [mode, setMode] = useState('hours'), [value, setValue] = useState('08:30');
  const converted = mode === 'hours' ? hoursToDecimal(value) : decimalToMinutes(value);
  const result = converted === null ? null : mode === 'hours' ? converted.toFixed(2).replace('.', ',') + ' h' : minutesToTime(converted);
  return <section className="tool-card">
    <label>Modo<select className="tool-input" value={mode} onChange={event => { setMode(event.target.value); setValue(event.target.value === 'hours' ? '08:30' : '7,25'); }}><option value="hours">Horas → Decimal</option><option value="decimal">Decimal → Horas</option></select></label>
    <label>{mode === 'hours' ? 'Horas (HH:MM)' : 'Horas decimais'}<input className="tool-input" inputMode={mode === 'hours' ? 'text' : 'decimal'} value={value} onChange={event => setValue(event.target.value)} /></label>
    {result === null ? <p role="alert">Informe uma duração válida; minutos devem ser menores que 60. Use vírgula ou ponto no decimal.</p> : <><output className="tool-result" aria-live="polite">{result}</output><details open><summary>Memória de cálculo</summary><p>{mode === 'hours' ? `${timeToMinutes(value)} minutos ÷ 60 = ${result}` : `${value} × 60 = ${converted} minutos (arredondados ao minuto mais próximo)`}</p></details></>}
    <ToolControls result={result} reset={() => setValue('')} />
  </section>;
}
