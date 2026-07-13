import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the game page contains only in-scene interactive targets', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const id of ['scene', 'car-button', 'vending-button', 'sign-button', 'driver', 'cue', 'neon-message']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(html, /mini-game|result-card|control-card|<footer/);
});
