import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameState, transition } from '../game-state.mjs';

test('the getting-to-know-you dialogue only asks for answers at its questions', () => {
  let state = createGameState();
  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');

  assert.equal(state.dialog, 'ขอเดาอะไรเล่น ๆ ได้ไหม');
  assert.equal(state.requiresReply, false);

  state = transition(state, 'advance-conversation');
  assert.equal(state.dialog, 'คุณเกิดราศีอะไร');
  assert.equal(state.answerKey, 'zodiac');
  assert.equal(state.requiresReply, true);

  state = transition(state, 'submit-answer', 'ถามทำไม');
  assert.equal(state.answers.zodiac, 'ถามทำไม');
  assert.equal(state.dialog, 'ก็อยากรู้จักคุณเพิ่มอีกนิดไง แถมจะได้มีข้ออ้างชมว่า “มิน่าล่ะ... น่ารักจัง”');
  assert.equal(state.requiresReply, false);
});

test('the dialogue accepts the no-answer branches and closes after the smile question', () => {
  let state = createGameState();
  state = transition(state, 'car-arrived');
  state = transition(state, 'tap-car');
  state = transition(state, 'advance-conversation');
  state = transition(state, 'submit-answer', 'ไม่บอก');
  assert.match(state.dialog, /ไม่ว่าจะราศีอะไร/);

  while (state.phase === 'conversation') {
    state = state.requiresReply
      ? transition(state, 'submit-answer', 'ไม่บอก')
      : transition(state, 'advance-conversation');
  }

  assert.equal(state.phase, 'farewell');
  assert.equal(state.dialog, 'ยิ้มของคุณน่ารักจะตายไป');
  assert.equal(state.answers.smile, 'ไม่บอก');
});

test('an unrelated tap cannot skip the dialogue', () => {
  const state = transition(createGameState(), 'tap-sign');
  assert.equal(state.phase, 'arriving');
});
