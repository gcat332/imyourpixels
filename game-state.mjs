const messages = [
  'พักก่อนก็ไม่เป็นไรนะ',
  'วันนี้ทำดีที่สุดแล้ว',
  'ค่อย ๆ ไปก็ถึงเหมือนกัน',
  'ยิ้มได้นิดนึงก็เก่งมากแล้ว',
];

export function createGameState() {
  return {
    phase: 'arriving',
    prompt: '',
    message: '',
    messageIndex: 0,
  };
}

export function transition(state, event) {
  if (event === 'reset') return createGameState();

  const next = { ...state };
  const allowed = {
    arriving: { 'car-arrived': 'parked' },
    parked: { 'tap-car': 'cooling' },
    cooling: { 'tap-vending': 'settled' },
    settled: { 'tap-sign': 'finished' },
  };
  const phase = allowed[state.phase]?.[event];

  if (!phase) return state;

  next.phase = phase;
  next.prompt = {
    parked: 'แตะรถเพื่อจอดพักก่อนนะ',
    cooling: 'รับน้ำเย็นจากตู้กดตรงนั้น',
    settled: 'แตะป้ายร้าน รับข้อความก่อนค่อยไป',
    finished: '',
  }[phase];

  if (phase === 'finished') {
    next.message = messages[state.messageIndex % messages.length];
    next.messageIndex += 1;
  }

  return next;
}
