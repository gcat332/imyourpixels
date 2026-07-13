function includes(value, phrase) {
  return value.toLowerCase().includes(phrase);
}

function responseFor(key, answers) {
  const answer = answers[key] ?? '';

  if (key === 'zodiac') {
    if (includes(answer, 'ไม่บอก')) return 'งั้นเราขอเดาแทนก็ได้\nไม่ว่าจะราศีอะไร... ก็น่ารักอยู่ดี';
    if (includes(answer, 'ถามทำไม')) return 'ก็อยากรู้จักคุณเพิ่มอีกนิดไง แถมจะได้มีข้ออ้างชมว่า “มิน่าล่ะ... น่ารักจัง”';
    return 'มิน่าล่ะ... ถึงได้น่ารักแบบนี้';
  }

  if (key === 'birthday') {
    if (includes(answer, 'ไม่บอก')) return 'ได้เลย ไว้วันที่คุณพร้อมค่อยบอกก็ได้ เราไม่รีบ';
    if (includes(answer, 'ถามทำไม')) return 'ก็อยากมีวันสำคัญไว้ยิ้มไปพร้อมกับคุณบ้าง';
    return 'จำไว้แล้วนะ ถึงวันนั้นเราจะเป็นคนแรก ๆ ที่อวยพรเลย';
  }

  if (key === 'color') return includes(answer, 'ไม่บอก')
    ? 'งั้นเอาเป็นว่าสีที่ทำให้คุณยิ้มได้ เราก็ชอบเหมือนกัน'
    : 'สีนั้นคงเหมาะกับคุณน่าดู... แต่เราว่ารอยยิ้มคุณสดใสกว่าอีกนะ';

  if (key === 'dessert') {
    if (includes(answer, 'เค้ก') || includes(answer, 'cake')) return 'น่าจะเป็นสายอบอุ่นนะ';
    if (includes(answer, 'ไอศกรีม') || includes(answer, 'ice')) return 'สดใสเหมือนที่คิดเลย';
    return 'งั้นเลือกยิ้มให้เราก็พอ';
  }

  if (key === 'drink') return includes(answer, 'ไม่บอก')
    ? 'ไม่เป็นไร ไว้ค่อยเล่าให้ฟังวันหลังก็ได้'
    : 'ไว้สักวันเราจะจำไว้ เผื่อมีโอกาสจะได้เลือกถูก';

  if (key === 'hobby') return includes(answer, 'ไม่บอก')
    ? 'งั้นวันหลังค่อยเล่าให้เราฟังก็ได้ เราชอบฟังเรื่องของคุณ'
    : 'ฟังแล้วนึกภาพออกเลย น่าสนุกดีนะ';

  return 'ยิ้มของคุณน่ารักจะตายไป';
}

const conversation = [
  { text: 'ขอเดาอะไรเล่น ๆ ได้ไหม', pose: 'standing' },
  { text: 'คุณเกิดราศีอะไร', pose: 'standing', key: 'zodiac', placeholder: 'บอกราศี หรือพิมพ์ ไม่บอก / ถามทำไม' },
  { text: (answers) => responseFor('zodiac', answers), pose: 'standing' },
  { text: 'ถามอีกข้อได้ไหม', pose: 'standing' },
  { text: 'วันเกิดคุณวันไหนเหรอ', pose: 'standing', key: 'birthday', placeholder: 'พิมพ์วันเกิด หรือ ไม่บอก / ถามทำไม' },
  { text: (answers) => responseFor('birthday', answers), pose: 'standing' },
  { text: 'ขอถามอะไรสนุก ๆ หน่อย', pose: 'standing' },
  { text: 'คุณชอบสีอะไรที่สุด', pose: 'standing', key: 'color', placeholder: 'พิมพ์สีที่ชอบ หรือ ไม่บอก' },
  { text: (answers) => responseFor('color', answers), pose: 'standing' },
  { text: 'เลือกได้อย่างเดียว', pose: 'standing' },
  { text: 'เค้ก หรือ ไอศกรีม', pose: 'standing', key: 'dessert', placeholder: 'พิมพ์ เค้ก หรือ ไอศกรีม' },
  { text: (answers) => responseFor('dessert', answers), pose: 'standing' },
  { text: 'เวลาเหนื่อย ๆ คุณชอบดื่มอะไร', pose: 'standing', key: 'drink', placeholder: 'พิมพ์เครื่องดื่มที่ชอบ หรือ ไม่บอก' },
  { text: (answers) => responseFor('drink', answers), pose: 'standing' },
  { text: 'เวลาว่าง คุณชอบทำอะไรมากที่สุด', pose: 'standing', key: 'hobby', placeholder: 'พิมพ์งานอดิเรก หรือ ไม่บอก' },
  { text: (answers) => responseFor('hobby', answers), pose: 'standing' },
  { text: 'ยิ้มเยอะ ๆ แล้วหรือยัง', pose: 'looking-at-sign', key: 'smile', placeholder: 'พิมพ์ตอบกลับ' },
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
