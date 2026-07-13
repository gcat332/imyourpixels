import { createGameState, transition } from './game-state.mjs';
import { renderScene } from './components/scene-renderer.mjs';
import { renderDriver } from './components/driver-renderer.mjs';
import { renderTargets } from './components/target-renderer.mjs';

const elements = {
  scene: document.querySelector('#scene'),
  car: document.querySelector('#car-button'),
  vending: document.querySelector('#vending-button'),
  sign: document.querySelector('#sign-button'),
  driver: document.querySelector('#driver'),
  cue: document.querySelector('#cue'),
  neonMessage: document.querySelector('#neon-message'),
  liveRegion: document.querySelector('#live-region'),
};

let state = createGameState();
let reducedMotionTimer;

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

elements.car.addEventListener('click', () => dispatch('tap-car'));
elements.vending.addEventListener('click', () => dispatch('tap-vending'));
elements.sign.addEventListener('click', () => dispatch('tap-sign'));

elements.scene.addEventListener('animationend', (event) => {
  if (event.animationName === 'car-arrival' && state.phase === 'arriving') dispatch('car-arrived');
  if (event.animationName === 'driver-walk-right' && state.phase === 'walking-to-vending') dispatch('driver-reached-vending');
  if (event.animationName === 'driver-return-left' && state.phase === 'walking-back') dispatch('driver-returned');
  if (event.animationName === 'neon-message-in' && state.phase === 'message') dispatch('begin-departure');
  if (event.animationName === 'car-departure' && state.phase === 'departing') dispatch('departure-finished');
});

render();
