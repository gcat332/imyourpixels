import test from 'node:test';
import assert from 'node:assert/strict';
import { soundNotesForEvent } from '../components/sound-engine.mjs';

test('every player interaction maps to a short chiptune sound', () => {
  assert.deepEqual(soundNotesForEvent('tap-car'), [261.63, 329.63]);
  assert.deepEqual(soundNotesForEvent('choose-answer'), [392, 523.25]);
  assert.deepEqual(soundNotesForEvent('submit-answer'), [523.25, 659.25, 783.99]);
});
