const storageKey = 'imyourpixel.answers';

export function loadAnswers(storage) {
  try { return JSON.parse(storage.getItem(storageKey) ?? '{}'); } catch { return {}; }
}

export function saveAnswers(storage, answers) {
  storage.setItem(storageKey, JSON.stringify(answers));
}

export function clearAnswers(storage) {
  storage.removeItem(storageKey);
}
