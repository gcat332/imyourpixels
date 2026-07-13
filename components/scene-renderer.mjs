export function renderScene(state, elements) {
  elements.scene.dataset.phase = state.phase;
  elements.scene.dataset.palette = state.palette;
  elements.cue.textContent = state.cue;
  elements.cue.hidden = !state.cue;
  elements.dialogBox.hidden = !state.dialog;
  elements.dialogBox.dataset.mode = state.dialogMode;
  elements.dialogCopy.textContent = state.dialog;
  elements.answerForm.hidden = !state.requiresReply;
  elements.answerInput.placeholder = state.placeholder || 'พิมพ์ตอบกลับ';
  if (state.requiresReply) elements.answerInput.value = state.answers[state.answerKey] ?? '';
}
