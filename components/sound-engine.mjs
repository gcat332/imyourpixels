const eventNotes = {
  'tap-car': [261.63, 329.63],
  'tap-vending': [392, 523.25],
  'tap-sign': [523.25, 659.25, 783.99],
};

export function soundNotesForEvent(event) {
  return eventNotes[event] ?? [];
}

export class SoundEngine {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  async play(event) {
    if (this.muted) return false;

    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) return false;

    this.context ??= new AudioContextClass();
    if (this.context.state === 'suspended') await this.context.resume();

    const now = this.context.currentTime;
    soundNotesForEvent(event).forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.045, now + index * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.12);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + index * 0.08 + 0.13);
    });

    return true;
  }
}
