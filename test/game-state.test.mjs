import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('driver movement gates each target and finishes with approved copy', () => {
  let state = createGameState(0);

  for (const event of ['car-arrived', 'tap-car', 'driver-reached-vending', 'tap-vending', 'driver-returned', 'tap-sign']) {
    state = transition(state, event);
  }

  assert.equal(state.phase, 'message');
  assert.equal(state.driverPose, 'looking-at-sign');
  assert.equal(state.activeTarget, 'sign');
  assert.equal(state.message, 'ยิ้มหน่อยสิ ออกจะน่ารัก');
  assert.equal(state.palette, 'cool');
});

test('an unrelated tap cannot skip the calming path', () => {
  const state = transition(createGameState(), 'tap-sign');
  assert.equal(state.phase, 'arriving');
});
