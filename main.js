import MIDIengine from "./midi.js";
import { Synth } from "./synth.js";

let ctx;
let masterGain;
const voices = new Map();

const status = document.getElementById("status");
const startBtn = document.getElementById("start");

startBtn.addEventListener("click", () => {
  try {
    startBtn.disabled = true;

    // AudioContext (must be user gesture)
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);

    // MIDI engine
    const midi = new MIDIengine();

    midi.onNoteOn = (note, velocity) => {
      if (voices.has(note)) return;

      const voice = new Synth(ctx, masterGain);
      voices.set(note, voice);
      voice.start(note, velocity);
    };

    midi.onNoteOff = (note) => {
      const voice = voices.get(note);
      if (!voice) return;

      voice.stop();
      voices.delete(note);
    };

    status.textContent = "Audio running. Play your MIDI controller";
  } catch (err) {
    console.error(err);
    status.textContent = "Failed to start audio or MIDI. Check console.";
  }
});