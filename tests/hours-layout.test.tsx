import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import DailyCalculator from '../src/components/DailyCalculator';
import BancoDeHorasCalculator from '../src/components/BancoDeHorasCalculator';
import TimeSumCalculator from '../src/components/TimeSumCalculator';

test('daily, bank and sum present their main result before calculation memory', () => {
  for (const [Component, result] of [[DailyCalculator, 'Total Trabalhado'], [BancoDeHorasCalculator, 'Saldo Positivo no Dia'], [TimeSumCalculator, 'Total Final Acumulado']] as const) {
    const html = renderToStaticMarkup(<Component />);
    assert.ok(html.indexOf(result) >= 0);
    assert.ok(html.indexOf(result) < html.indexOf('Memória de cálculo'));
  }
});
