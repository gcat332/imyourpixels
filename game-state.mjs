const messages = [
  'ยิ้มหน่อยสิ ออกจะน่ารัก',
  'โลกสวยด้วยรอยยิ้มเธอนะ',
  'ความน่ารักของเธอ ทำให้คืนนี้ดีขึ้นเยอะเลย',
];

const phases = {
  arriving: { event: 'car-arrived', phase: 'parked', pose: 'in-car', target: 'car', cue: 'แตะประตูรถเพื่อพักก่อนนะ', palette: 'warm' },
  parked: { event: 'tap-car', phase: 'walking-to-vending', pose: 'walking-right', target: null, cue: '', palette: 'warm' },
  'walking-to-vending': { event: 'driver-reached-vending', phase: 'vending-ready', pose: 'at-vending', target: 'vending', cue: 'กดน้ำเย็นให้เธอหน่อย', palette: 'warm' },
  'vending-ready': { event: 'tap-vending', phase: 'walking-back', pose: 'drinking', target: null, cue: '', palette: 'cool' },
  'walking-back': { event: 'driver-returned', phase: 'sign-ready', pose: 'looking-at-sign', target: 'sign', cue: 'แตะป้ายไฟดูสิ', palette: 'cool' },
  'sign-ready': { event: 'tap-sign', phase: 'message', pose: 'looking-at-sign', target: 'sign', cue: '', palette: 'cool' },
  message: { event: 'departure-finished', phase: 'arriving', pose: 'in-car', target: null, cue: '', palette: 'warm' },
};

export function createGameState(messageIndex = 0) {
  return {
    phase: 'arriving',
    driverPose: 'in-car',
    activeTarget: null,
    cue: '',
    message: '',
    messageIndex,
    palette: 'warm',
  };
}

export function transition(state, event) {
  if (event === 'restart') return createGameState(state.messageIndex);

  const rule = phases[state.phase];
  if (!rule || rule.event !== event) return state;

  const next = {
    ...state,
    phase: rule.phase,
    driverPose: rule.pose,
    activeTarget: rule.target,
    cue: rule.cue,
    palette: rule.palette,
  };

  if (event === 'tap-sign') {
    next.message = messages[state.messageIndex % messages.length];
    next.messageIndex += 1;
  }

  return next;
}
