const messages = [
  'ยิ้มหน่อยสิ ออกจะน่ารัก',
  'โลกสวยด้วยรอยยิ้มเธอนะ',
  'ความน่ารักของเธอ ทำให้คืนนี้ดีขึ้นเยอะเลย',
];

const checkInQuestion = 'วันนี้เจออะไรมาทำไมหน้าบึ้งละ';

const phases = {
  arriving: { event: 'car-arrived', phase: 'parked', pose: 'in-car', target: 'car', cue: 'แตะประตูรถเพื่อพักก่อนนะ', palette: 'warm' },
  parked: { event: 'tap-car', phase: 'check-in', pose: 'drinking', target: null, cue: '', dialog: checkInQuestion, dialogMode: 'answer', palette: 'warm' },
  'check-in': { event: 'submit-answer', phase: 'encouragement', pose: 'looking-at-sign', target: null, cue: '', dialogMode: 'message', palette: 'cool' },
  encouragement: { event: 'begin-departure', phase: 'departing', pose: 'in-car', target: null, cue: '', dialog: '', dialogMode: 'hidden', palette: 'cool' },
  departing: { event: 'departure-finished', phase: 'arriving', pose: 'in-car', target: null, cue: '', palette: 'warm' },
};

export function createGameState(messageIndex = 0) {
  return {
    phase: 'arriving',
    driverPose: 'in-car',
    activeTarget: null,
    cue: '',
    dialog: '',
    dialogMode: 'hidden',
    response: '',
    messageIndex,
    palette: 'warm',
  };
}

export function transition(state, event, response = '') {
  if (event === 'restart') return createGameState(state.messageIndex);

  const cleanedResponse = response.trim();
  if (event === 'submit-answer' && !cleanedResponse) return state;

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
    palette: rule.palette,
  };

  if (event === 'submit-answer') {
    next.response = cleanedResponse;
    next.dialog = messages[state.messageIndex % messages.length];
    next.messageIndex += 1;
  }

  return next;
}
