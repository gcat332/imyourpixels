export function renderScene(state, elements) {
  elements.scene.dataset.phase = state.phase;
  elements.scene.dataset.palette = state.palette;
  elements.cue.textContent = state.cue;
  elements.cue.hidden = !state.cue;
  elements.neonMessage.textContent = state.message;
  elements.neonMessage.hidden = !state.message;
}
