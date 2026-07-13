import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTargets } from '../components/target-renderer.mjs';

test('target renderer enables only the active target', () => {
  const car = { disabled: true };
  const vending = { disabled: true };
  const sign = { disabled: true };

  renderTargets('vending', { car, vending, sign });

  assert.deepEqual([car.disabled, vending.disabled, sign.disabled], [true, false, true]);
});
