import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTargets } from '../components/target-renderer.mjs';

test('target renderer enables only the active target', () => {
  const car = { disabled: true };

  renderTargets('car', { car });
  assert.equal(car.disabled, false);

  renderTargets(null, { car });
  assert.equal(car.disabled, true);
});
