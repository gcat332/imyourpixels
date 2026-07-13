const conversation = [
  'วันนี้ดูเหมือนจะไม่ใช่วันที่ง่ายเลยนะ',
  'ขอบคุณที่ยังเข้ามาคุยกับเรานะ',
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

function poseForConversation(index) {
  return index < 4 ? 'drinking' : 'looking-at-sign';
}

const phases = {
  arriving: { event: 'car-arrived', phase: 'parked', pose: 'in-car', target: 'car', cue: 'แตะประตูรถเพื่อพักก่อนนะ', palette: 'warm' },
  parked: { event: 'tap-car', phase: 'conversation', pose: 'drinking', target: null, cue: '', dialog: conversation[0], dialogMode: 'answer', conversationIndex: 0, palette: 'warm' },
  farewell: { event: 'begin-departure', phase: 'departing', pose: 'in-car', target: null, cue: '', dialog: '', dialogMode: 'hidden', palette: 'cool' },
  departing: { event: 'departure-finished', phase: 'arriving', pose: 'in-car', target: null, cue: '', palette: 'warm' },
};

export function createGameState() {
  return {
    phase: 'arriving',
    driverPose: 'in-car',
    activeTarget: null,
    cue: '',
    dialog: '',
    dialogMode: 'hidden',
    conversationIndex: -1,
    palette: 'warm',
  };
}

export function transition(state, event, response = '') {
  if (event === 'restart') return createGameState();

  const cleanedResponse = response.trim();
  if (event === 'submit-answer' && !cleanedResponse) return state;

  if (state.phase === 'conversation' && event === 'submit-answer') {
    const conversationIndex = state.conversationIndex + 1;
    const farewell = conversationIndex === conversation.length - 1;
    return {
      ...state,
      phase: farewell ? 'farewell' : 'conversation',
      driverPose: poseForConversation(conversationIndex),
      dialog: conversation[conversationIndex],
      dialogMode: farewell ? 'message' : 'answer',
      conversationIndex,
      palette: 'cool',
    };
  }

  const rule = phases[state.phase];
  if (!rule || rule.event !== event) return state;

  const next = {
    ...state,
    phase: rule.phase,
    driverPose: rule.pose,
    activeTarget: rule.target,
    cue: rule.cue,
    dialog: rule.dialog ?? state.dialog,
    dialogMode: rule.dialogMode ?? state.dialogMode,
    conversationIndex: rule.conversationIndex ?? state.conversationIndex,
    palette: rule.palette,
  };

  return next;
}
