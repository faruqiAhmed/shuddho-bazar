// Web Audio API chime for incoming real-time orders
export function playNewOrderSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number, gainLevel = 0.25) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // 3-step upbeat chime (E5 -> G#5 -> B5)
    playTone(659.25, now, 0.25, 0.2);
    playTone(830.61, now + 0.12, 0.3, 0.25);
    playTone(987.77, now + 0.25, 0.4, 0.3);
  } catch (e) {
    console.warn('Audio chime not available or blocked by autoplay policy:', e);
  }
}
