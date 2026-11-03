import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBuySellMessage } from '../src/buySellMessage.mjs';

test('buying includes budget/preferences and excludes selling condition', () => {
  const message = buildBuySellMessage('buy', { device: 'Phone', budget: '250', storage: '128GB', condition: 'Damaged', notes: 'Blue' });
  assert.match(message, /Maximum budget: £250/);
  assert.match(message, /Preferred storage: 128GB/);
  assert.doesNotMatch(message, /Condition|Damaged/);
});
test('selling includes faults and excludes a buying budget', () => {
  const message = buildBuySellMessage('sell', { model: 'iPhone 14', condition: 'Damaged', notes: 'Cracked screen', budget: '250' });
  assert.match(message, /Model: iPhone 14/);
  assert.match(message, /Known faults \/ details: Cracked screen/);
  assert.doesNotMatch(message, /budget|250/);
});
test('unknown selling models use a description without a stale model', () => {
  const message = buildBuySellMessage('sell', { unknown: true, description: 'Samsung phone', model: 'iPhone 14' });
  assert.match(message, /please help identify it/);
  assert.match(message, /Device description: Samsung phone/);
  assert.doesNotMatch(message, /iPhone 14/);
  assert.throws(() => buildBuySellMessage('sell', { unknown: true, description: ' ' }));
  assert.throws(() => buildBuySellMessage('sell', { model: ' ' }));
  assert.throws(() => buildBuySellMessage('buy', { budget: '-1' }));
});
