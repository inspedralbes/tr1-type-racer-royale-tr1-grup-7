// Web Audio sound manager: SFX (click/type/coin) + calm background music
class SoundManager {
  constructor() {
    this.ctx = null;
    this.master = null; // Master gain (global volume)
    this.sfx = null; // SFX sub bus
    this.music = null; // Music sub bus
    this.initialized = false;
    this.volume = 0.5; // 0..1
    // Music state
    this.musicPlaying = false;
    this._musicOscillators = [];
    this._musicFilter = null;
    this._musicInterval = null;
    this._chordIndex = 0;
    // Extended calming progression list (natural minor & modal colors)
    // Each entry: 3 frequencies (pad voices). We keep consistent voice count.
    this._chords = [
      [220.0, 261.63, 329.63], // Am (A3 C4 E4)
      [174.61, 220.0, 261.63], // F (F3 A3 C4)
      [261.63, 329.63, 392.0], // C (C4 E4 G4)
      [196.0, 246.94, 293.66], // G (G3 B3 D4)
      [164.81, 220.0, 246.94], // E (E3 A3 B3) - ambient inversion (Em flavor w/ A pedal)
      [146.83, 174.61, 220.0], // Dm (D3 F3 A3)
      [164.81, 207.65, 246.94], // E7 (E3 G#3 B3)
      [220.0, 277.18, 329.63], // Am(add9) (A3 C#4 E4) soft color
      [174.61, 220.0, 277.18], // Fmaj7 (F3 A3 C#4) color tone
      [196.0, 246.94, 311.13], // Gsus4 (G3 B3 C#4)
      [146.83, 220.0, 261.63], // Dm7 (D3 A3 C4)
      [164.81, 246.94, 311.13], // E7sus4 (E3 B3 C#4)
      [220.0, 261.63, 329.63], // Am (repeat to resolve)
    ];
    this._chordDur = 4.0; // seconds per chord (can adjust for variation)
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.ctx = new AudioContext();
      // Master bus
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      // Sub buses
      this.sfx = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.sfx.gain.value = 1.0;
      this.music.gain.value = 1.0;
      this.sfx.connect(this.master);
      this.music.connect(this.master);
    }
    return true;
  }

  async init() {
    if (!this.ensureContext()) return;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {}
    }
    this.initialized = true;
  }

  setVolume(v) {
    const clamped = Math.max(0, Math.min(1, v));
    this.volume = clamped;
    if (this.master) this.master.gain.value = clamped;
  }

  // Utility: create envelope gain for short SFX
  _envGain(duration = 0.12, attack = 0.005, decay = 0.1, peak = 1.0) {
    const g = this.ctx.createGain();
    const now = this.ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    return g;
  }

  playClick() {
    if (!this.initialized && !this.ensureContext()) return;
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this._envGain(0.06, 0.002, 0.05, 0.8);
    osc.type = "square";
    osc.frequency.value = 600 + Math.random() * 120;
    osc.connect(g).connect(this.sfx || this.master);
    const now = this.ctx.currentTime;
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playType() {
    if (!this.initialized && !this.ensureContext()) return;
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this._envGain(0.05, 0.001, 0.045, 0.9);
    osc.type = "triangle";
    osc.frequency.value = 250 + Math.random() * 80;
    osc.connect(g).connect(this.sfx || this.master);
    const now = this.ctx.currentTime;
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playCoin() {
    if (!this.initialized && !this.ensureContext()) return;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const t1 = this.ctx.createOscillator();
    const g1 = this._envGain(0.18, 0.002, 0.16, 0.9);
    t1.type = "sine";
    t1.frequency.setValueAtTime(880, now);
    t1.connect(g1).connect(this.sfx || this.master);
    t1.start(now);
    t1.stop(now + 0.2);
    const t2 = this.ctx.createOscillator();
    const g2 = this._envGain(0.22, 0.002, 0.2, 0.8);
    t2.type = "sine";
    t2.frequency.setValueAtTime(1320, now + 0.06);
    t2.connect(g2).connect(this.sfx || this.master);
    t2.start(now + 0.06);
    t2.stop(now + 0.28);
  }

  // Calm background music: soft triangle pad with progression
  playMusic() {
    if (!this.ensureContext()) return;
    if (this.musicPlaying) return;
    const now = this.ctx.currentTime;
    this._musicFilter = this.ctx.createBiquadFilter();
    this._musicFilter.type = "lowpass";
    this._musicFilter.frequency.setValueAtTime(1400, now);
    this._musicFilter.Q.value = 0.8;
    this._musicFilter.connect(this.music || this.master);
    // Create 3 sustained voices that we retune per chord
    const initial = this._chords[this._chordIndex % this._chords.length];
    this._musicOscillators = initial.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      osc.detune.value = (i - 1) * 5; // slight detune spread
      g.gain.setValueAtTime(0.0, now);
      g.gain.linearRampToValueAtTime(0.07, now + 2.0);
      g.gain.linearRampToValueAtTime(0.06, now + 4.0);
      osc.connect(g).connect(this._musicFilter);
      osc.start(now);
      return { osc, g };
    });
    // Start progression timer
    const step = () => {
      if (!this.musicPlaying || !this.ctx) return;
      this._chordIndex = (this._chordIndex + 1) % this._chords.length;
      const chord = this._chords[this._chordIndex];
      const t = this.ctx.currentTime;
      // Gentle filter motion
      const cutoff = 1000 + Math.random() * 600;
      this._musicFilter.frequency.linearRampToValueAtTime(cutoff, t + 1.0);
      // Retune voices smoothly
      this._musicOscillators.forEach(({ osc }, i) => {
        const target = chord[i % chord.length];
        try {
          osc.frequency.cancelScheduledValues(t);
          osc.frequency.setValueAtTime(osc.frequency.value, t);
          osc.frequency.linearRampToValueAtTime(target, t + 0.8);
        } catch {}
      });
    };
    this._musicInterval = setInterval(step, this._chordDur * 1000);
    this.musicPlaying = true;
  }

  stopMusic() {
    if (!this.musicPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      this._musicOscillators.forEach(({ osc, g }) => {
        if (g?.gain) g.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        if (osc?.stop) osc.stop(now + 1.05);
      });
    } catch {}
    this._musicOscillators = [];
    if (this._musicInterval) {
      clearInterval(this._musicInterval);
      this._musicInterval = null;
    }
    this.musicPlaying = false;
  }
}

const soundManager = new SoundManager();
export default soundManager;
