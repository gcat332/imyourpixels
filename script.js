import { createGameState, transition } from './game-state.mjs';
import { renderScene } from './components/scene-renderer.mjs';
import { renderDriver } from './components/driver-renderer.mjs';
import { renderTargets } from './components/target-renderer.mjs';
import { SoundEngine } from './components/sound-engine.mjs';

const elements = {
  scene: document.querySelector('#scene'),
  car: document.querySelector('#car-button'),
  vending: document.querySelector('#vending-button'),
  sign: document.querySelector('#sign-button'),
  driver: document.querySelector('#driver'),
  cue: document.querySelector('#cue'),
  neonMessage: document.querySelector('#neon-message'),
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
  if (state.message) announce(state.message);
  scheduleReducedMotionCompletion();
}

function dispatch(event) {
  const next = transition(state, event);
  if (next === state) return;
  state = next;
  render();
}

function scheduleReducedMotionCompletion() {
  window.clearTimeout(reducedMotionTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const completion = {
    'walking-to-vending': 'driver-reached-vending',
    'walking-back': 'driver-returned',
    departing: 'departure-finished',
  }[state.phase];

  if (completion) reducedMotionTimer = window.setTimeout(() => dispatch(completion), 80);
}

function playAndDispatch(event) {
  void sound.play(event);
  dispatch(event);
}

elements.car.addEventListener('click', () => playAndDispatch('tap-car'));
elements.vending.addEventListener('click', () => playAndDispatch('tap-vending'));
elements.sign.addEventListener('click', () => playAndDispatch('tap-sign'));
elements.soundToggle.addEventListener('click', () => {
  sound.muted = !sound.muted;
  elements.soundToggle.setAttribute('aria-pressed', String(!sound.muted));
  elements.soundToggle.textContent = sound.muted ? 'MUTE' : 'SFX';
  announce(sound.muted ? 'ปิดเสียงเอฟเฟกต์แล้ว' : 'เปิดเสียงเอฟเฟกต์แล้ว');
});

elements.scene.addEventListener('animationend', (event) => {
  if (event.animationName === 'car-arrival' && state.phase === 'arriving') dispatch('car-arrived');
  if (event.animationName === 'driver-walk-right' && state.phase === 'walking-to-vending') dispatch('driver-reached-vending');
  if (event.animationName === 'driver-return-left' && state.phase === 'walking-back') dispatch('driver-returned');
  if (event.animationName === 'neon-message-in' && state.phase === 'message') dispatch('begin-departure');
  if (event.animationName === 'car-departure' && state.phase === 'departing') dispatch('departure-finished');
});

render();
