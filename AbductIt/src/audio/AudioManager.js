// Procedural chiptune audio via Web Audio API — no external files
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.musicNodes = [];
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 1.0;
      this.sfxGain.connect(this.masterGain);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4;
      this.musicGain.connect(this.masterGain);
      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext unavailable', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  _note(freq, type, duration, gain, delay = 0) {
    if (!this.initialized || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  _noise(duration, gain, delay = 0) {
    if (!this.initialized || this.muted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;
    const bufferSize = ctx.sampleRate * Math.min(duration, 1.0);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(g);
    g.connect(this.sfxGain);
    source.start(now);
  }

  playBeamScan() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.5);
    g.gain.setValueAtTime(0.15, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.5);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playBeamLock() {
    this._note(660, 'square', 0.12, 0.3);
    this._note(880, 'square', 0.12, 0.3, 0.08);
  }

  playBeamReel() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.3);
    g.gain.setValueAtTime(0.2, now);
    g.gain.linearRampToValueAtTime(0.0, now + 0.3);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playAbduction() {
    const notes = [261, 329, 392, 523];
    notes.forEach((f, i) => this._note(f, 'square', 0.2, 0.4, i * 0.07));
    this._note(523, 'triangle', 0.4, 0.5, 0.28);
  }

  playBeamUpgrade() {
    const melody = [261, 294, 329, 392, 523, 659, 784];
    melody.forEach((f, i) => {
      this._note(f, 'square', 0.18, 0.5, i * 0.06);
      this._note(f * 2, 'triangle', 0.18, 0.2, i * 0.06);
    });
    this._noise(0.15, 0.3, melody.length * 0.06);
  }

  playExplosionSmall() {
    this._noise(0.15, 0.4);
    this._note(60, 'sawtooth', 0.1, 0.3);
  }

  playExplosionLarge() {
    this._noise(0.4, 0.6);
    this._note(40, 'sawtooth', 0.3, 0.5);
    this._note(55, 'sine', 0.3, 0.4, 0.05);
  }

  playDamage() {
    this._note(220, 'sawtooth', 0.08, 0.5);
    this._note(110, 'sawtooth', 0.15, 0.4, 0.06);
  }

  playShieldBreak() {
    this._noise(0.2, 0.5);
    this._note(330, 'sawtooth', 0.05, 0.6);
    this._note(165, 'sawtooth', 0.1, 0.5, 0.04);
    this._note(82, 'sawtooth', 0.15, 0.4, 0.08);
  }

  playCombo(level) {
    const notes = [523, 659, 784, 1047];
    const count = Math.min(level, 4);
    for (let i = 0; i < count; i++) this._note(notes[i], 'square', 0.12, 0.4, i * 0.07);
  }

  playTimerWarn() { this._note(880, 'square', 0.05, 0.3); }
  playLevelClear() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1047];
    melody.forEach((f, i) => this._note(f, 'square', 0.25, 0.5, i * 0.1));
  }
  playGameOver() {
    const melody = [392, 330, 294, 220];
    melody.forEach((f, i) => this._note(f, 'sawtooth', 0.4, 0.4, i * 0.2));
  }
  playButtonTap() { this._note(880, 'square', 0.06, 0.2); }
  playCounterWeapon() {
    this._note(1760, 'sawtooth', 0.04, 0.4);
    this._note(1320, 'sawtooth', 0.04, 0.3, 0.03);
  }

  stopMusic() {
    this.musicNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    this.musicNodes = [];
  }

  playWorldMusic(worldId) {
    if (!this.initialized || this.muted) return;
    this.stopMusic();
    const patterns = [
      { bpm: 120, notes: [261,294,329,349,392,349,329,294], bass: [65,65,98,98] },
      { bpm: 140, notes: [293,329,349,392,440,392,349,329], bass: [73,73,110,110] },
      { bpm: 160, notes: [370,415,440,494,554,494,440,415], bass: [92,92,138,138] },
      { bpm: 150, notes: [392,392,440,466,440,392,349,329], bass: [98,98,146,146] },
      { bpm: 145, notes: [329,370,392,440,494,440,392,370], bass: [82,82,123,123] },
      { bpm: 130, notes: [440,494,523,587,659,587,523,494], bass: [110,110,164,164] },
      { bpm: 180, notes: [440,494,554,622,698,622,554,494], bass: [110,110,165,165] },
    ];
    const p = patterns[Math.min(worldId, patterns.length - 1)];
    const ctx = this.ctx;
    const beatLen = 60 / p.bpm;
    const loopLen = p.notes.length * beatLen;
    const schedulePattern = (startTime) => {
      p.notes.forEach((freq, i) => {
        const t = startTime + i * beatLen;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0, t);
        g.gain.linearRampToValueAtTime(0.25, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + beatLen * 0.8);
        osc.connect(g);
        g.connect(this.musicGain);
        osc.start(t);
        osc.stop(t + beatLen);
        this.musicNodes.push(osc);
      });
      p.bass.forEach((freq, i) => {
        const t = startTime + i * (loopLen / p.bass.length);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + (loopLen / p.bass.length) * 0.9);
        osc.connect(g);
        g.connect(this.musicGain);
        osc.start(t);
        osc.stop(t + loopLen / p.bass.length);
        this.musicNodes.push(osc);
      });
    };
    for (let loop = 0; loop < 8; loop++) schedulePattern(ctx.currentTime + loop * loopLen);
  }

  setMuted(val) {
    this.muted = val;
    if (this.masterGain) this.masterGain.gain.value = val ? 0 : 0.8;
    if (val) this.stopMusic();
  }
}

export const audioManager = new AudioManager();
