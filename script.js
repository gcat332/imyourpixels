const state = {
  phase: 'arriving',
  treats: 0,
  soundOn: false,
};

const phases = ['arriving', 'parked', 'playing', 'finished', 'departing'];
const messages = [
  'ยิ้มได้แล้ว ค่อยไปต่อนะ',
  'พักนิดเดียวก็เก่งมากแล้ว',
  'ขนมหมดแล้ว แต่อารมณ์ดีเหลืออยู่นะ',
  'วันนี้ไม่ต้องโอเคทั้งหมดก็ได้',
];

const car = document.querySelector('#car');
const mainAction = document.querySelector('#main-action');
const miniGame = document.querySelector('#mini-game');
const treatButton = document.querySelector('#treat-button');
const treatCount = document.querySelector('#treat-count');
const resultCard = document.querySelector('#result-card');
const message = document.querySelector('#message');
const statusText = document.querySelector('#status-text');
const statusKicker = document.querySelector('.status-kicker');
const liveRegion = document.querySelector('#live-region');
const soundToggle = document.querySelector('#sound-toggle');

let arrivalFallback;

function announce(text) {
  liveRegion.textContent = '';
  window.setTimeout(() => { liveRegion.textContent = text; }, 20);
}

function renderPhase() {
  document.body.dataset.phase = state.phase;
  const copy = {
    arriving: ['รถกำลังมาถึง...', 'อีกแป๊บเดียวก็ถึงร้านแล้วนะ', 'รอรถแป๊บ...'],
    parked: ['รถจอดแล้ว', 'รับขนมสักชิ้นไหม ไม่ต้องรีบเลย', 'จอดพักแป๊บ'],
    playing: ['โหมดพักใจ', 'ค่อยๆ กดรับขนมให้ครบ 5 ชิ้นนะ', 'กำลังเล่นอยู่...'],
    finished: ['GOOD MOOD!', 'เรียบร้อยแล้ว ขอให้วันนี้เบาลงนิดนึงนะ', 'เล่นอีกครั้ง'],
    departing: ['ไปต่อได้แล้ว', 'ขอบคุณที่แวะมาพักนะ', 'กำลังออกเดินทาง...'],
  }[state.phase];

  statusKicker.textContent = copy[0];
  statusText.textContent = copy[1];
  mainAction.textContent = copy[2];
  mainAction.disabled = state.phase === 'arriving' || state.phase === 'playing' || state.phase === 'departing';
  announce(copy[1]);
}

function setPhase(nextPhase) {
  if (!phases.includes(nextPhase)) return;
  state.phase = nextPhase;
  renderPhase();
}

function resetScene() {
  window.clearTimeout(arrivalFallback);
  car.classList.remove('is-reset');
  car.style.animation = 'none';
  void car.offsetWidth;
  car.style.animation = '';
  miniGame.hidden = true;
  resultCard.hidden = true;
  treatButton.disabled = false;
  state.treats = 0;
  treatCount.textContent = '0';
  setPhase('arriving');
}

function arrive() {
  if (state.phase !== 'arriving') return;
  setPhase('parked');
}

function startGame() {
  if (state.phase !== 'parked') {
    if (state.phase === 'finished') resetScene();
    return;
  }
  state.treats = 0;
  treatCount.textContent = '0';
  miniGame.hidden = false;
  resultCard.hidden = true;
  setPhase('playing');
  treatButton.focus({ preventScroll: true });
}

function finishGame() {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  message.textContent = randomMessage;
  resultCard.hidden = false;
  treatButton.disabled = true;
  setPhase('finished');
  setPhase('departing');
  window.setTimeout(() => {
    if (state.phase === 'departing') {
      resultCard.hidden = false;
      setPhase('finished');
    }
  }, 1550);
}

function collectTreat() {
  if (state.phase !== 'playing' || state.treats >= 5) return;
  state.treats += 1;
  treatCount.textContent = String(state.treats);
  treatButton.style.left = `${14 + (state.treats * 13) % 67}%`;
  treatButton.style.top = `${18 + (state.treats * 17) % 52}%`;
  announce(`รับขนมแล้ว ${state.treats} จาก 5 ชิ้น`);
  if (state.treats === 5) finishGame();
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  soundToggle.setAttribute('aria-pressed', String(state.soundOn));
  soundToggle.querySelector('span').textContent = state.soundOn ? 'เสียงเปิด' : 'เสียงปิด';
  announce(state.soundOn ? 'เปิดเสียงแล้ว แต่ตอนนี้ยังไม่มีเสียงประกอบ' : 'ปิดเสียงแล้ว');
}

car.addEventListener('animationend', (event) => {
  if (event.animationName === 'arrive') arrive();
});
mainAction.addEventListener('click', startGame);
treatButton.addEventListener('click', collectTreat);
soundToggle.addEventListener('click', toggleSound);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  arrivalFallback = window.setTimeout(arrive, 60);
}

renderPhase();
