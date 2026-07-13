import { createGameState, transition } from './game-state.mjs';
import { renderScene } from './components/scene-renderer.mjs';
import { renderDriver } from './components/driver-renderer.mjs';
import { renderTargets } from './components/target-renderer.mjs';
import { SoundEngine } from './components/sound-engine.mjs';

const elements = {
  scene: document.querySelector('#scene'),
  car: document.querySelector('#car-button'),
  driver: document.querySelector('#driver'),
  cue: document.querySelector('#cue'),
  dialogBox: document.querySelector('#dialog-box'),
  dialogCopy: document.querySelector('#dialog-copy'),
  answerForm: document.querySelector('#answer-form'),
  answerInput: document.querySelector('#answer-input'),
  answerOptions: document.querySelector('#answer-options'),
  soundToggle: document.querySelector('#sound-toggle'),
  liveRegion: document.querySelector('#live-region'),
};

let state = createGameState();
let reducedMotionTimer;
const sound = new SoundEngine();

function announce(text) {
  elements.liveRegion.textContent = '';
  window.setTimeout(() => { elements.liveRegion.textContent = text; }, 20);
}

function render() {
  renderScene(state, elements);
  renderDriver(state.driverPose, elements.driver);
  renderTargets(state.activeTarget, elements);

  if (state.cue) announce(state.cue);
  if (state.dialog) announce(state.dialog);
  if (state.phase === 'check-in') window.setTimeout(() => elements.answerInput.focus(), 0);
  scheduleReducedMotionCompletion();
}

function dispatch(event, response) {
  const next = transition(state, event, response);
  if (next === state) return;
  state = next;
  render();
}

function scheduleReducedMotionCompletion() {
  window.clearTimeout(reducedMotionTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const completion = {
    departing: 'departure-finished',
  }[state.phase];

  if (completion) reducedMotionTimer = window.setTimeout(() => dispatch(completion), 80);
}

function playAndDispatch(event, response) {
  void sound.play(event);
  dispatch(event, response);
}

elements.car.addEventListener('click', () => playAndDispatch('tap-car'));
elements.answerOptions.addEventListener('click', (event) => {
  const option = event.target.closest('[data-answer]');
  if (!option) return;
  elements.answerInput.value = option.dataset.answer;
  elements.answerInput.focus();
  void sound.play('choose-answer');
});
elements.answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const response = elements.answerInput.value.trim();
  if (!response) {
    elements.answerInput.setCustomValidity('เล่าได้แค่นิดเดียวก็พอนะ');
    elements.answerInput.reportValidity();
    return;
  }
  elements.answerInput.setCustomValidity('');
  playAndDispatch('submit-answer', response);
});
elements.answerInput.addEventListener('input', () => elements.answerInput.setCustomValidity(''));
elements.soundToggle.addEventListener('click', () => {
  sound.muted = !sound.muted;
  elements.soundToggle.setAttribute('aria-pressed', String(!sound.muted));
  elements.soundToggle.textContent = sound.muted ? 'MUTE' : 'SFX';
  announce(sound.muted ? 'ปิดเสียงเอฟเฟกต์แล้ว' : 'เปิดเสียงเอฟเฟกต์แล้ว');
});

elements.scene.addEventListener('animationend', (event) => {
  if (event.animationName === 'car-arrival' && state.phase === 'arriving') dispatch('car-arrived');
  if (event.animationName === 'dialog-message-in' && state.phase === 'encouragement') dispatch('begin-departure');
  if (event.animationName === 'car-departure' && state.phase === 'departing') dispatch('departure-finished');
});

render();
