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

test('encouragement appears in an in-scene pixel dialogue box', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../style.css', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /id="neon-message" class="dialog-message"/);
  assert.match(css, /\.dialog-message\s*\{[^}]*background:/);
  assert.match(css, /\.dialog-message::after\s*\{/);
});
