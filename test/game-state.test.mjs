import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('car tap starts the scripted typed conversation and advances one reply at a time', () => {
  let state = createGameState(0);

  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');

  assert.equal(state.phase, 'conversation');
  assert.equal(state.driverPose, 'drinking');
  assert.equal(state.dialogMode, 'answer');
  assert.equal(state.dialog, 'วันนี้ดูเหมือนจะไม่ใช่วันที่ง่ายเลยนะ');

  assert.equal(transition(state, 'submit-answer', '').phase, 'conversation');

  state = transition(state, 'submit-answer', 'เหนื่อยมาทั้งวัน');
  assert.equal(state.phase, 'conversation');
  assert.equal(state.dialog, 'ขอบคุณที่ยังเข้ามาคุยกับเรานะ');

  const expectedLines = [
    'เราไม่รู้ว่าเธอเจออะไรมาบ้าง แต่หวังว่าจะช่วยให้วันนี้ของเธอดีขึ้นได้สักนิด 😊',
    'ขอภารกิจเล็ก ๆ อย่างนึงได้ไหม',
    'ลองยกมุมปากขึ้นนิดเดียว... แค่นิดเดียวก็พอ ไม่ต้องฝืน 😊',
    'เป็นไงบ้าง ถึงจะเป็นรอยยิ้มเล็ก ๆ แต่มันก็ดีกว่าเมื่อกี้นิดนึงแล้วนะ',
    'ขอชมอะไรอย่างนึงได้ไหม',
    'เราว่าเวลาที่เธอยิ้ม เธอดูน่ารักกว่าที่เธอคิดนะ',
    'ยิ้มเธอออกจะน่ารัก... เลยอยากเห็นมันบ่อย ๆ 😊',
    'ถ้าวันนี้ยังไม่ใช่วันที่ดี ก็ไม่เป็นไรนะ อย่างน้อยตอนนี้เธอมีรอยยิ้มเล็ก ๆ กลับมาแล้ว',
    'ขอบคุณที่ยิ้มให้เราดูนะ 😊 หวังว่าจากนี้ไป วันนี้ของเธอจะใจดีกับเธอมากขึ้นอีกนิด',
  ];

  for (const line of expectedLines) {
    state = transition(state, 'submit-answer', 'อืม');
    assert.equal(state.dialog, line);
  }

  assert.equal(state.phase, 'farewell');
  assert.equal(state.driverPose, 'looking-at-sign');
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
  for (let index = 0; index < 10; index += 1) state = transition(state, 'submit-answer', 'ตอบแล้ว');

  state = transition(state, 'begin-departure');
  assert.equal(state.phase, 'departing');
  assert.equal(state.driverPose, 'in-car');

  state = transition(state, 'departure-finished');
  assert.equal(state.phase, 'arriving');
});
