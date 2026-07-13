import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('scene targets follow their art instead of drawing rectangular overlays', async () => {
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');

  assert.match(css, /\.target-car\s*\{[^}]*clip-path:/);
  assert.doesNotMatch(css, /\.target:not\(:disabled\)::after/);
  assert.match(css, /\.car-sprite\s*\{[^}]*bottom:12%/);
  assert.match(css, /\.driver\s*\{[^}]*bottom:17%/);
});

test('the in-scene pixel dialogue supports typed replies and an isolated sprite frame', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../style.css', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /id="dialog-box" class="dialog-message"/);
  assert.match(html, /id="answer-input"[^>]*type="text"/);
  assert.match(css, /\.dialog-message\s*\{[^}]*background:/);
  assert.match(css, /\.dialog-answer-input\s*\{[^}]*background:/);
  assert.match(css, /\.driver\s*\{[^}]*background-size:400% 100%/);
  assert.match(css, /\.driver\[data-pose='standing'\]\s*\{[^}]*background-position:0 center/);
  assert.match(css, /\.car-sprite\s*\{[^}]*width:48%[^}]*height:34%/);
  assert.match(css, /\.driver\s*\{[^}]*width:10%[^}]*height:32%/);
  assert.match(css, /\.driver\[data-pose='standing'\]\s*\{[^}]*left:39%/);
  assert.match(css, /\.driver\[data-pose='looking-at-sign'\]\s*\{[^}]*left:41%/);
  assert.doesNotMatch(css, /\.drink-sprite/);
  assert.match(css, /\.dialog-message::after\s*\{/);
  assert.match(css, /\.dialog-answer\[hidden\]\s*\{\s*display:none;/);
  assert.doesNotMatch(css, /driver-walk-right|driver-return-left/);
});
