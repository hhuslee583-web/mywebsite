// Synthesized audio engine for cozy calming ambiences using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSourceNodes: any[] = [];
  private masterGain: GainNode | null = null;
  private currentSound: string = 'off';
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (!this.ctx) return;
    try {
      this.currentSourceNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.currentSourceNodes = [];
      this.currentSound = 'off';
    } catch (e) {
      console.warn('Error stopping sound:', e);
    }
  }

  public getCurrentSound(): string {
    return this.currentSound;
  }

  // Play a soft singing bowl or mindfulness chime
  public playChime(freq = 432, duration = 3.5) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 2.76, now); // pleasant natural Tibetan chime overtone

      const harmonicGain = this.ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.2, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + duration);
      oscHarmonic.stop(now + duration);
    } catch (err) {
      console.warn('Chime audio error:', err);
    }
  }

  // Gentle Summer Rain
  public playRain() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentSound = 'rain';
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // soft pink-ish noise
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for soft rain sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.currentSourceNodes.push(whiteNoise, filter, gain);
  }

  // Soft Ocean Tide (LFO modulated filtered noise)
  public playOcean() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentSound = 'ocean';
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO to sweep waves in and out
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // ~10 sec wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();
    this.currentSourceNodes.push(whiteNoise, lfo, filter, lfoGain, gain);
  }

  // Cozy Hearth / Fireplace (gentle warmth + crackle simulation)
  public playFire() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentSound = 'fire';
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.002;
      const white = (Math.random() * 2 - 1) * 0.2;
      output[i] = isPop ? (Math.random() * 2 - 1) * 0.9 : white * 0.25;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.currentSourceNodes.push(whiteNoise, filter, gain);
  }

  // Tibetan Singing Bowl resonance
  public playBowl() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentSound = 'bowl';
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, now); // F3 warm drone

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(432, now); // A4 harmonic

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(648, now); // overtone

    // Tremolo LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, now); // slow breathing shimmer

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    this.currentSourceNodes.push(osc1, osc2, osc3, lfo, lfoGain, gain);
  }
}

export const soundEngine = new SoundEngine();
