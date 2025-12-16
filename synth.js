export class Synth {
  constructor(ctx, masterGain) {
    this.ctx = ctx;

    this.osc = ctx.createOscillator();
    this.osc.type = "sawtooth";

    this.env = ctx.createGain();
    this.env.gain.value = 0;

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1200;

    this.osc.connect(this.filter);
    this.filter.connect(this.env);
    this.env.connect(masterGain);
  }

  mtof(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  start(note, velocity = 127, when = this.ctx.currentTime) {
    const freq = this.mtof(note);
    const amp = velocity / 127;

    this.osc.frequency.setValueAtTime(freq, when);

    this.env.gain.cancelScheduledValues(when);
    this.env.gain.setValueAtTime(0, when);
    this.env.gain.linearRampToValueAtTime(amp, when + 0.01);
    this.env.gain.linearRampToValueAtTime(amp * 0.7, when + 0.15);

    this.osc.start(when);
  }

  stop(when = this.ctx.currentTime) {
    this.env.gain.cancelScheduledValues(when);
    this.env.gain.setValueAtTime(this.env.gain.value, when);
    this.env.gain.linearRampToValueAtTime(0, when + 0.2);

    this.osc.stop(when + 0.25);
  }
}