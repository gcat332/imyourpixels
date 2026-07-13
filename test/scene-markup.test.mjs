import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the game page contains one in-scene car interaction and a typed dialogue', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const id of ['scene', 'car-button', 'driver', 'cue', 'dialog-box', 'dialog-copy', 'answer-form', 'answer-input', 'clear-answers']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /<div id="driver" class="driver"/);
  assert.doesNotMatch(html, /drink-sprite/);
  assert.doesNotMatch(html, /data-answer=|id="answer-options"/);
  assert.doesNotMatch(html, /id="vending-button"|id="sign-button"/);
  assert.doesNotMatch(html, /mini-game|result-card|control-card|<footer/);
  assert.doesNotMatch(html, /คำตอบจะถูกบันทึกไว้/);
});

test('scene assets are relative and no external UI shell remains', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /src="\//);
  assert.doesNotMatch(html, /<header|<footer|modal|<dialog\b/);
});
