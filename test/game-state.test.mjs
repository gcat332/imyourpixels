import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('car tap opens an editable check-in before showing an approved compliment', () => {
  let state = createGameState(0);

  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');

  assert.equal(state.phase, 'check-in');
  assert.equal(state.driverPose, 'drinking');
  assert.equal(state.dialogMode, 'answer');
  assert.equal(state.dialog, 'วันนี้เจออะไรมาทำไมหน้าบึ้งละ');

  assert.equal(transition(state, 'submit-answer', '').phase, 'check-in');

  state = transition(state, 'submit-answer', 'เหนื่อยมาทั้งวัน');

  assert.equal(state.phase, 'encouragement');
  assert.equal(state.driverPose, 'looking-at-sign');
  assert.equal(state.activeTarget, null);
  assert.equal(state.response, 'เหนื่อยมาทั้งวัน');
  assert.equal(state.dialog, 'ยิ้มหน่อยสิ ออกจะน่ารัก');
  assert.equal(state.dialogMode, 'message');
  assert.equal(state.palette, 'cool');
});

test('an unrelated tap cannot skip the calming path', () => {
  const state = transition(createGameState(), 'tap-sign');
  assert.equal(state.phase, 'arriving');
});

test('the car departs only after the encouragement dialogue finishes', () => {
  let state = createGameState();
  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');
  state = transition(state, 'submit-answer', 'หงุดหงิดนิดหน่อย');

  state = transition(state, 'begin-departure');
  assert.equal(state.phase, 'departing');
  assert.equal(state.driverPose, 'in-car');

  state = transition(state, 'departure-finished');
  assert.equal(state.phase, 'arriving');
});
