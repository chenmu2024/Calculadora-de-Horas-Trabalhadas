import { calculateFourPunches, isValidTime, minutesToTime, timeToMinutes } from '../utils/time';

const form = document.querySelector<HTMLFormElement>('#hours-form')!;
const fields = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
const copy = document.querySelector<HTMLButtonElement>('#copy')!;
const status = document.querySelector<HTMLElement>('#copy-status')!;
let summary: string | null = null;
function update() {
  const result = calculateFourPunches(fields.slice(0, 4).map(input => input.value));
  const valid = result !== null && isValidTime(fields[4].value, true);
  document.querySelector<HTMLElement>('#error')!.hidden = valid;
  document.querySelector<HTMLElement>('#error')!.textContent = valid ? '' : 'Informe horários válidos em ordem, em uma jornada inferior a 24 horas, e a jornada em HH:MM.';
  document.querySelector<HTMLElement>('#results')!.hidden = !valid;
  document.querySelector<HTMLElement>('#memory')!.hidden = !valid;
  copy.disabled = !valid;
  status.textContent = '';
  summary = null;
  if (!valid) return;
  const decimal = (result.worked / 60).toFixed(2).replace('.', ',');
  const balance = result.worked - timeToMinutes(fields[4].value);
  const values = { worked: `${minutesToTime(result.worked)} h trabalhadas`, rest: `Intervalo: ${minutesToTime(result.rest)}`, decimal: `Decimal: ${decimal} h`, balance: `Saldo: ${balance >= 0 ? '+' : '-'}${minutesToTime(Math.abs(balance))}` };
  for (const [id, value] of Object.entries(values)) document.getElementById(id)!.textContent = value;
  document.getElementById('memory-text')!.textContent = `${fields[0].value}–${fields[1].value} + ${fields[2].value}–${fields[3].value} = ${minutesToTime(result.worked)}. Decimal: ${result.worked} ÷ 60 = ${decimal}.`;
  summary = Object.values(values).join('\n') + '\nCalculado em calculadoradehorastrabalhadas.org';
}
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', update);
document.getElementById('clear')!.addEventListener('click', () => { fields.forEach(input => { input.value = ''; }); update(); });
copy.addEventListener('click', async () => {
  if (summary === null) return;
  try { await navigator.clipboard.writeText(summary); status.textContent = 'Copiado!'; }
  catch { status.textContent = 'Não foi possível copiar. Selecione o resultado.'; }
});
update();
