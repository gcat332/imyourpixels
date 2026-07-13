const conversation = [
  { text: 'วันนี้หนักมาใช่ไหม', requiresReply: true, pose: 'standing' },
  { text: 'ขอบคุณที่แวะมาคุยกันนะ', requiresReply: false, pose: 'standing' },
  { text: 'ถ้ายังไม่ไหวก็ไม่เป็นไร ลองหายใจลึก ๆ ก่อน', requiresReply: false, pose: 'standing' },
  { text: 'ถ้าไหว ลองยิ้มมุมปากนิดเดียวก็พอ ไม่ต้องฝืน', requiresReply: true, pose: 'looking-at-sign' },
  { text: 'แค่นั้นก็เก่งมากแล้ว', requiresReply: false, pose: 'looking-at-sign' },
  { text: 'ยิ้มของคุณน่ารักจะตายไป', requiresReply: false, pose: 'looking-at-sign' },
];

const phases = {
  arriving: { event: 'car-arrived', phase: 'parked', pose: 'in-car', target: 'car', cue: 'แตะประตูรถเพื่อพักก่อนนะ', palette: 'warm' },
  parked: { event: 'tap-car', phase: 'conversation', pose: conversation[0].pose, target: null, cue: '', dialog: conversation[0].text, dialogMode: 'answer', requiresReply: true, conversationIndex: 0, palette: 'warm' },
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
    requiresReply: false,
    conversationIndex: -1,
    palette: 'warm',
  };
}

export function transition(state, event, response = '') {
  if (event === 'restart') return createGameState();

  const cleanedResponse = response.trim();
  if (event === 'submit-answer' && !cleanedResponse) return state;

  const isReply = state.phase === 'conversation' && state.requiresReply && event === 'submit-answer';
  const isAutoAdvance = state.phase === 'conversation' && !state.requiresReply && event === 'advance-conversation';
  if (isReply || isAutoAdvance) {
    const conversationIndex = state.conversationIndex + 1;
    const beat = conversation[conversationIndex];
    const farewell = conversationIndex === conversation.length - 1;
    return {
      ...state,
      phase: farewell ? 'farewell' : 'conversation',
      driverPose: beat.pose,
      dialog: beat.text,
      dialogMode: beat.requiresReply ? 'answer' : 'message',
      requiresReply: beat.requiresReply,
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
    requiresReply: rule.requiresReply ?? state.requiresReply,
    conversationIndex: rule.conversationIndex ?? state.conversationIndex,
    palette: rule.palette,
  };

  return next;
}
