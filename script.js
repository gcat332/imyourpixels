import { createGameState, transition } from './game-state.mjs';

const car = document.querySelector('#car');
const vendingMachine = document.querySelector('#vending-machine');
const signButton = document.querySelector('#sign-button');
const cue = document.querySelector('#cue');
const message = document.querySelector('#message');
const liveRegion = document.querySelector('#live-region');
const soundToggle = document.querySelector('#sound-toggle');

let state = createGameState();
let arrivalFallback;

function announce(text) {
  liveRegion.textContent = '';
  window.setTimeout(() => { liveRegion.textContent = text; }, 10);
}

function render() {
  document.body.dataset.phase = state.phase;
  cue.textContent = state.prompt;
  cue.hidden = !state.prompt;

  car.disabled = state.phase !== 'parked';
  vendingMachine.disabled = state.phase !== 'cooling';
  signButton.disabled = state.phase !== 'settled' && state.phase !== 'finished';

  message.hidden = state.phase !== 'finished';
  message.textContent = state.message;

  if (state.phase === 'parked') announce(state.prompt);
  if (state.phase === 'cooling') announce('จอดรถเรียบร้อยแล้ว ' + state.prompt);
  if (state.phase === 'settled') announce('เย็นลงนิดหนึ่งแล้ว ' + state.prompt);
  if (state.phase === 'finished') announce(state.message);
}

function dispatch(event) {
  const next = transition(state, event);
  if (next === state) return;
  state = next;
  render();
}

function resetScene() {
  window.clearTimeout(arrivalFallback);
  state = transition(state, 'reset');
  car.style.animation = 'none';
  void car.offsetWidth;
  car.style.animation = '';
  render();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    arrivalFallback = window.setTimeout(() => dispatch('car-arrived'), 60);
  }
}

car.addEventListener('animationend', (event) => {
  if (event.animationName === 'arrive' && state.phase === 'arriving') dispatch('car-arrived');
});
car.addEventListener('click', () => dispatch('tap-car'));
vendingMachine.addEventListener('click', () => dispatch('tap-vending'));
signButton.addEventListener('click', () => {
  if (state.phase === 'finished') resetScene();
  else dispatch('tap-sign');
});
soundToggle.addEventListener('click', () => {
  const soundOn = soundToggle.getAttribute('aria-pressed') !== 'true';
  soundToggle.setAttribute('aria-pressed', String(soundOn));
  soundToggle.textContent = soundOn ? '♪' : '♫';
  announce(soundOn ? 'เปิดเสียงแล้ว ตอนนี้ยังไม่มีเสียงประกอบ' : 'ปิดเสียงแล้ว');
});

render();
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  arrivalFallback = window.setTimeout(() => dispatch('car-arrived'), 60);
}
