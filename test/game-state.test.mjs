import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('the shortened conversation only asks for replies at its check-in and smile moments', () => {
  let state = createGameState(0);

  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');

  assert.equal(state.phase, 'conversation');
  assert.equal(state.driverPose, 'standing');
  assert.equal(state.dialogMode, 'answer');
  assert.equal(state.dialog, 'วันนี้หนักมาใช่ไหม');

  assert.equal(transition(state, 'submit-answer', '').phase, 'conversation');

  state = transition(state, 'submit-answer', 'เหนื่อยมาทั้งวัน');
  assert.equal(state.phase, 'conversation');
  assert.equal(state.dialog, 'ขอบคุณที่แวะมาคุยกันนะ');
  assert.equal(state.dialogMode, 'message');
  assert.equal(transition(state, 'submit-answer', 'ข้ามไม่ได้').dialog, 'ขอบคุณที่แวะมาคุยกันนะ');

  state = transition(state, 'advance-conversation');
  assert.equal(state.dialog, 'ถ้ายังไม่ไหวก็ไม่เป็นไร ลองหายใจลึก ๆ ก่อน');
  state = transition(state, 'advance-conversation');
  assert.equal(state.dialog, 'ถ้าไหว ลองยิ้มมุมปากนิดเดียวก็พอ ไม่ต้องฝืน');
  assert.equal(state.dialogMode, 'answer');
  assert.equal(state.driverPose, 'looking-at-sign');
  state = transition(state, 'submit-answer', 'ลองแล้ว');
  assert.equal(state.dialog, 'แค่นั้นก็เก่งมากแล้ว');
  state = transition(state, 'advance-conversation');

  assert.equal(state.phase, 'farewell');
  assert.equal(state.dialog, 'ยิ้มของคุณน่ารักจะตายไป');
  assert.equal(state.activeTarget, null);
  assert.equal(state.dialogMode, 'message');
  assert.equal(state.palette, 'cool');
});

test('an unrelated tap cannot skip the calming path', () => {
  const state = transition(createGameState(), 'tap-sign');
  assert.equal(state.phase, 'arriving');
});

test('the car departs only after the final conversation line finishes', () => {
  let state = createGameState();
  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');
  state = transition(state, 'submit-answer', 'ตอบแล้ว');
  state = transition(state, 'advance-conversation');
  state = transition(state, 'advance-conversation');
  state = transition(state, 'submit-answer', 'ตอบแล้ว');
  state = transition(state, 'advance-conversation');

  state = transition(state, 'begin-departure');
  assert.equal(state.phase, 'departing');
  assert.equal(state.driverPose, 'in-car');

  state = transition(state, 'departure-finished');
  assert.equal(state.phase, 'arriving');
});
