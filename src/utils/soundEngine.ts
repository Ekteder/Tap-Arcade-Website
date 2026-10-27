// Procedural Web Audio Synthesizer mirroring Tap Arcade's Android AudioTrack PCM engine

class TapArcadeSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public stopAll() {
    if (this.ctx && this.ctx.state === 'running') {
      // Suspending briefly halts active scheduled nodes cleanly
      this.ctx.suspend().then(() => {
        if (this.enabled && this.ctx) {
          this.ctx.resume().catch(() => {});
        }
      }).catch(() => {});
    }
  }

  // 1. Target Tap: 880Hz clean sine blip
  public playTargetTap(forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(940, now + 0.065);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 2. Score Milestone (Every 50 points): 660Hz -> 880Hz dual-tone chirp
  public playScoreMilestone(forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [660, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.065;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.24, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.085);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.09);
    });
  }

  // 3. Hazard Tap: 180Hz low-frequency warning buzz
  public playHazardBuzz(forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(135, now + 0.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // 4. Missed Target / Life Loss: 330Hz -> 110Hz descending sweep
  public playLifeLossSweep(forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.23);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 5. Countdown Tick (440Hz) and Go! Arpeggio (C5 -> E5 -> G5)
  public playCountdownTick(isGo: boolean, forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (!isGo) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      // Ascending C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.075;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.22, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.15);
      });
    }
  }

  // 6. Game Over Arpeggio: G4 (392Hz) -> Eb4 (311.13Hz) -> C4 (261.63Hz)
  public playGameOverArpeggio(forcePlay = false) {
    if (!this.enabled && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.0, 311.13, 261.63];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.14;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.24, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.23);
    });
  }
}

export const soundEngine = new TapArcadeSoundEngine();
