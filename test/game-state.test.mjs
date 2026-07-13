import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('the calming path advances through meaningful in-scene actions', () => {
  let state = createGameState();

  state = transition(state, 'car-arrived');
  assert.equal(state.phase, 'parked');
  assert.equal(state.prompt, 'แตะรถเพื่อจอดพักก่อนนะ');

  state = transition(state, 'tap-car');
  assert.equal(state.phase, 'cooling');
  assert.equal(state.prompt, 'รับน้ำเย็นจากตู้กดตรงนั้น');

  state = transition(state, 'tap-vending');
  assert.equal(state.phase, 'settled');
  assert.equal(state.prompt, 'แตะป้ายร้าน รับข้อความก่อนค่อยไป');

  state = transition(state, 'tap-sign');
  assert.equal(state.phase, 'finished');
  assert.match(state.message, /พัก|ค่อย|เก่ง|ยิ้ม/);
});

test('an unrelated tap cannot skip the calming path', () => {
  const state = transition(createGameState(), 'tap-sign');
  assert.equal(state.phase, 'arriving');
});
