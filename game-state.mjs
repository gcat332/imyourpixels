function includes(value, phrase) {
  return value.toLowerCase().includes(phrase);
}

function responseFor(key, answers) {
  const answer = answers[key] ?? '';

  if (key === 'zodiac') {
    if (includes(answer, 'ไม่บอก')) return 'โห เก็บเป็นความลับเหรอ\nงั้นขอเดาเองละกัน จะราศีไหนก็น่ารักอยู่ดี';
    if (includes(answer, 'ถามทำไม')) return 'ก็อยากรู้จักเธอเพิ่มอีกนิดไง';
    return 'อ๋อ มิน่าล่ะ... น่ารักแบบนี้นี่เอง';
  }

  if (key === 'birthday') {
    if (includes(answer, 'ไม่บอก')) return 'ได้เลย ไว้พร้อมเมื่อไหร่ค่อยบอกก็ได้';
    if (includes(answer, 'ถามทำไม')) return 'ก็อยากมีวันสำคัญไว้ยิ้มไปพร้อมกับเธอบ้าง';
    return 'โอเค จำไว้ละ';
  }

  if (key === 'color') return includes(answer, 'ไม่บอก')
    ? 'งั้นเอาเป็นว่าสีที่ทำให้เธอยิ้มได้ เราก็ชอบเหมือนกัน'
    : 'สีนั้นน่าจะเหมาะกับเธอนะ แต่เราว่ารอยยิ้มเธอสดใสกว่าอีก';

  if (key === 'dessert') {
    if (includes(answer, 'เค้ก') || includes(answer, 'cake')) return 'สายอบอุ่นนี่เอง';
    if (includes(answer, 'ไอศกรีม') || includes(answer, 'ice')) return 'สดใสเหมือนที่คิดเลย';
    return 'งั้นเลือกยิ้มให้เราก็พอ';
  }

  if (key === 'drink') return includes(answer, 'ไม่บอก')
    ? 'ไม่เป็นไร ไว้ค่อยเล่าก็ได้'
    : 'โอเค จำไว้ เผื่อวันไหนได้เลือกให้จะได้ไม่พลาด';

  if (key === 'hobby') return includes(answer, 'ไม่บอก')
    ? 'ไว้วันหลังค่อยเล่าก็ได้ เราชอบฟังเรื่องเธอ'
    : 'ฟังแล้วน่าสนุกอะ';

  return 'ยิ้มของเธอน่ารักจะตายไป\nอยากให้ยิ้มเยอะ ๆ นะ';
}

const conversation = [
  { text: 'มาเล่นเกมรู้จักกันเพิ่มอีกนิดปะ', pose: 'standing' },
  { text: 'เริ่มจากราศีก่อน เธอเกิดราศีอะไรอะ', pose: 'standing', key: 'zodiac', placeholder: 'บอกราศี หรือพิมพ์ ไม่บอก / ถามทำไม' },
  { text: (answers) => responseFor('zodiac', answers), pose: 'standing' },
  { text: 'ขอถามต่ออีกข้อได้ปะ', pose: 'standing' },
  { text: 'วันเกิดเธอวันไหนอะ', pose: 'standing', key: 'birthday', placeholder: 'พิมพ์วันเกิด หรือ ไม่บอก / ถามทำไม' },
  { text: (answers) => responseFor('birthday', answers), pose: 'standing' },
  { text: 'ขอถามอะไรชิล ๆ หน่อย', pose: 'standing' },
  { text: 'เธอชอบสีอะไรสุด', pose: 'standing', key: 'color', placeholder: 'พิมพ์สีที่ชอบ หรือ ไม่บอก' },
  { text: (answers) => responseFor('color', answers), pose: 'standing' },
  { text: 'คำถามนี้ต้องเลือกแล้วนะ', pose: 'standing' },
  { text: 'ทีมเค้ก หรือ ทีมไอศกรีม', pose: 'standing', key: 'dessert', placeholder: 'พิมพ์ เค้ก หรือ ไอศกรีม' },
  { text: (answers) => responseFor('dessert', answers), pose: 'standing' },
  { text: 'เหนื่อย ๆ เธอชอบดื่มอะไร', pose: 'standing', key: 'drink', placeholder: 'พิมพ์เครื่องดื่มที่ชอบ หรือ ไม่บอก' },
  { text: (answers) => responseFor('drink', answers), pose: 'standing' },
  { text: 'เวลาว่างเธอชอบทำอะไรสุด', pose: 'standing', key: 'hobby', placeholder: 'พิมพ์งานอดิเรก หรือ ไม่บอก' },
  { text: (answers) => responseFor('hobby', answers), pose: 'standing' },
  { text: 'วันนี้ยิ้มเยอะ ๆ ยัง', pose: 'looking-at-sign', key: 'smile', placeholder: 'พิมพ์ตอบกลับ' },
  { text: (answers) => responseFor('smile', answers), pose: 'looking-at-sign' },
];

function stateForBeat(state, conversationIndex) {
  const beat = conversation[conversationIndex];
  const farewell = conversationIndex === conversation.length - 1;
  return {
    ...state,
    phase: farewell ? 'farewell' : 'conversation',
    driverPose: beat.pose,
    dialog: typeof beat.text === 'function' ? beat.text(state.answers) : beat.text,
    dialogMode: beat.key ? 'answer' : 'message',
    requiresReply: Boolean(beat.key),
    answerKey: beat.key ?? '',
    placeholder: beat.placeholder ?? '',
    conversationIndex,
    palette: 'cool',
  };
}

const phases = {
  arriving: { event: 'car-arrived', phase: 'parked', pose: 'in-car', target: 'car', cue: 'แตะประตูรถเพื่อพักก่อนนะ', palette: 'warm' },
  farewell: { event: 'begin-departure', phase: 'departing', pose: 'in-car', target: null, cue: '', dialog: '', dialogMode: 'hidden', palette: 'cool' },
  departing: { event: 'departure-finished', phase: 'arriving', pose: 'in-car', target: null, cue: '', palette: 'warm' },
};

export function createGameState(answers = {}) {
  return { phase: 'arriving', driverPose: 'in-car', activeTarget: null, cue: '', dialog: '', dialogMode: 'hidden', requiresReply: false, answerKey: '', placeholder: '', conversationIndex: -1, answers: { ...answers }, palette: 'warm' };
}

export function transition(state, event, response = '') {
  if (event === 'restart') return createGameState(state.answers);

  if (state.phase === 'parked' && event === 'tap-car') return stateForBeat({ ...state, activeTarget: null, cue: '' }, 0);

  if (state.phase === 'conversation') {
    if (event === 'submit-answer') {
      const answer = response.trim();
      if (!state.requiresReply || !answer) return state;
      return stateForBeat({ ...state, answers: { ...state.answers, [state.answerKey]: answer } }, state.conversationIndex + 1);
    }
    if (event === 'advance-conversation' && !state.requiresReply) return stateForBeat(state, state.conversationIndex + 1);
  }

  const rule = phases[state.phase];
  if (!rule || rule.event !== event) return state;
  return { ...state, phase: rule.phase, driverPose: rule.pose, activeTarget: rule.target, cue: rule.cue, dialog: rule.dialog ?? state.dialog, dialogMode: rule.dialogMode ?? state.dialogMode, palette: rule.palette };
}
