import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateINSS, calculateIRRF, calculateIRRFDetails, calculateSeguroDesemprego } from '../src/utils/taxCalculations';
import { calculateDuration, calculateFourPunches, calculateNightShift, minutesToTime, timeToMinutes } from '../src/utils/time';
import { getMonthWorkStats } from '../src/utils/holidays2026';
import { nonNegative } from '../src/utils/browser';

test('2026 INSS brackets and ceiling', () => {
  for (const [income, expected] of [[0, 0], [1621, 121.58], [2902.84, 236.94], [4354.27, 411.11], [5000, 501.51], [8475.55, 988.09], [20000, 988.09]]) assert.equal(calculateINSS(income), expected);
  assert.equal(calculateINSS(Infinity), 0);
  assert.equal(calculateINSS(-10), 0);
});
test('IRRF official examples and deductions do not stack', () => {
  assert.equal(calculateIRRF(5000), 0);
  assert.equal(calculateIRRFDetails(5000).base, 4392.8);
  // RFB example explicitly provides R$649.60 legal deductions.
  assert.equal(calculateIRRF(6000, 0, 649.60), 382.88);
  assert.equal(calculateIRRFDetails(6000, 0, 649.60).base, 5350.4);
  assert.equal(calculateIRRFDetails(7350).reduction, 0);
  assert.equal(calculateIRRFDetails(7350.01).reduction, 0);
  assert.ok(calculateIRRFDetails(7000, 3).base < calculateIRRFDetails(7000).base);
  assert.equal(calculateIRRF(0), 0);
});
test('2026 unemployment floor, bands and ceiling', () => {
  assert.equal(calculateSeguroDesemprego(0), 0);
  assert.equal(calculateSeguroDesemprego(1621), 1621);
  assert.equal(calculateSeguroDesemprego(2222.17), 1777.74);
  assert.equal(calculateSeguroDesemprego(3000), 2166.66);
  assert.equal(calculateSeguroDesemprego(3704), 2518.65);
});
test('time formatting carries minutes and handles invalid values', () => {
  assert.equal(minutesToTime(59.6), '01:00');
  assert.equal(minutesToTime(1500), '25:00');
  assert.equal(minutesToTime(Infinity), '00:00');
  assert.equal(timeToMinutes('08:99'), 0);
});
test('valid overnight and invalid interval / missing punches', () => {
  assert.equal(calculateDuration('08:00', '18:00', undefined, undefined, 60), 540);
  assert.equal(calculateDuration('22:00', '06:00', '02:00', '03:00'), 420);
  assert.equal(calculateDuration('', '18:00'), 0);
  assert.equal(calculateDuration('08:00', '17:00', '20:00', '21:00'), 0);
  assert.equal(calculateFourPunches(['08:00', '07:00', '13:00', '18:00']), null);
  assert.deepEqual(calculateFourPunches(['22:00', '02:00', '03:00', '06:00']), { worked: 420, rest: 60 });
});
test('night intersection uses minutes and sector, without daytime fallback', () => {
  assert.deepEqual(calculateNightShift('08:00', '17:00', 'urban'), { night: 0, extension: 0 });
  assert.deepEqual(calculateNightShift('22:30', '05:00', 'urban'), { night: 6.5, extension: 0 });
  assert.deepEqual(calculateNightShift('22:00', '06:00', 'urban'), { night: 7, extension: 1 });
  assert.deepEqual(calculateNightShift('20:00', '04:00', 'rural_livestock'), { night: 8, extension: 0 });
  assert.deepEqual(calculateNightShift('03:00', '06:00', 'urban'), { night: 2, extension: 0 });
});
test('optional holidays and Saturdays remain distinct', () => {
  const regular = getMonthWorkStats(2026, 1, false);
  const optional = getMonthWorkStats(2026, 1, false, true);
  assert.equal(regular.workingDays, 20);
  assert.equal(regular.sundaysAndHolidays, 4);
  assert.equal(regular.saturdaysOff, 4);
  assert.equal(optional.workingDays, 17);
  assert.equal(getMonthWorkStats(2026, 1, false, false, ['2026-02-10']).workingDays, 19);
});
test('numeric zero is preserved, nonfinite and negative rejected', () => {
  assert.equal(nonNegative('0', 15), 0);
  assert.equal(nonNegative('', 15), 15);
  assert.equal(nonNegative('-3', 15), 0);
  assert.equal(nonNegative('Infinity', 15), 15);
});
