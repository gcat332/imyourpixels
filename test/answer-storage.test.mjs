import test from 'node:test';
import assert from 'node:assert/strict';
import { clearAnswers, loadAnswers, saveAnswers } from '../components/answer-storage.mjs';

test('answers persist locally and can be cleared', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };

  saveAnswers(storage, { zodiac: 'สิงห์' });
  assert.deepEqual(loadAnswers(storage), { zodiac: 'สิงห์' });
  clearAnswers(storage);
  assert.deepEqual(loadAnswers(storage), {});
});
