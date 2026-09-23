export class VoiceGuidanceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static audioCtx: AudioContext | null = null;

  /**
   * Play synthesized audio chime for maneuver warning or destination arrival
   */
  public static playChime(type: 'maneuver' | 'arrival' = 'maneuver'): void {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'maneuver') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Arrival multi-tone chime
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (err) {
      console.warn('[VoiceGuidanceService] Web Audio chime failed:', err);
    }
  }

  /**
   * Speak turn-by-turn spoken instruction using Web Speech API
   */
  public static speak(text: string, volume: number = 1.0): void {
    if (!this.synth) return;

    try {
      this.synth.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = Math.max(0, Math.min(1, volume));
      utterance.rate = 1.05; // Slightly faster clarity for emergency response
      utterance.pitch = 1.0;

      // Select high quality English voice if available
      const voices = this.synth.getVoices();
      const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (enVoice) {
        utterance.voice = enVoice;
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('[VoiceGuidanceService] Speech synthesis error:', err);
    }
  }
}
