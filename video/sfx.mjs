// Generates the 8-bit sound effects as WAV files in public/sfx/: node sfx.mjs
// Everything is synthesised here (square waves and noise), nothing is sampled from anywhere.
import fs from 'node:fs';
import path from 'node:path';

const RATE = 44100;
const GAIN = 0.22; // gentle: these sit under whatever music gets added later

/** notes: [{ freq, to?, ms, wave? }] played one after another; `to` slides the pitch. */
function render(notes, { tail = 0.06 } = {}) {
  const out = [];
  let seed = 1;
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  for (const note of notes) {
    const n = Math.round((note.ms / 1000) * RATE);
    let phase = 0;
    let held = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const freq = note.to ? note.freq + (note.to - note.freq) * t : note.freq;
      phase += freq / RATE;
      let s;
      if (note.wave === 'noise') {
        if (i % 6 === 0) held = noise(); // crunchy, low-pitched noise
        s = held * 0.6;
      } else if (note.wave === 'triangle') s = 4 * Math.abs((phase % 1) - 0.5) - 1;
      else s = phase % 1 < 0.5 ? 1 : -1;
      // quick attack, decay towards the end of the note
      const env = Math.min(1, i / (0.004 * RATE)) * (note.hold ? 1 - t * 0.35 : 1 - t) ** (note.wave === 'noise' ? 2 : 1);
      out.push(s * env * GAIN * (note.gain ?? 1));
    }
  }
  for (let i = 0; i < tail * RATE; i++) out.push(0);
  return out;
}

/** Mixes several voices of the same length into one. */
const mix = (...voices) => voices[0].map((_, i) => voices.reduce((sum, v) => sum + (v[i] ?? 0), 0) / Math.sqrt(voices.length));

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const head = Buffer.alloc(44);
  head.write('RIFF', 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write('WAVEfmt ', 8);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20); // PCM
  head.writeUInt16LE(1, 22); // mono
  head.writeUInt32LE(RATE, 24);
  head.writeUInt32LE(RATE * 2, 28);
  head.writeUInt16LE(2, 32);
  head.writeUInt16LE(16, 34);
  head.write('data', 36);
  head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
}

const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98 };

const SOUNDS = {
  // menu move / tick
  blip: render([{ freq: N.A5, ms: 55 }]),
  // confirm
  select: render([{ freq: N.D5, ms: 60 }, { freq: N.A5, ms: 60 }, { freq: N.D6, ms: 130 }]),
  // jump: rising slide
  jump: render([{ freq: 260, to: 620, ms: 170, wave: 'triangle', gain: 1.3 }]),
  // bonus picked up: quick rising triad
  pickup: render([{ freq: N.C6, ms: 55 }, { freq: N.E6, ms: 55 }, { freq: N.G6, ms: 190 }]),
  // one stroke of the trowel: soft scrape
  stroke: render([{ freq: 0, ms: 150, wave: 'noise' }]),
  // level complete: run up, then a held chord
  fanfare: (() => {
    const run = [N.C5, N.E5, N.G5, N.C6].map((freq) => ({ freq, ms: 95, hold: true }));
    const lead = render([...run, { freq: N.E6, ms: 95, hold: true }, { freq: N.G6, ms: 620 }]);
    const bass = render([...run.map((n) => ({ ...n, freq: n.freq / 2, wave: 'triangle' })), { freq: N.C5, ms: 95, wave: 'triangle', hold: true }, { freq: N.C5, ms: 620, wave: 'triangle' }]);
    return mix(lead, bass);
  })(),
};

// trowel hits of the 10 s video: a thud plus a note that climbs with every hit of the combo
const SCALE = [392, 440, N.C5, N.D5, N.E5, N.G5, N.A5, N.C6, N.D6, N.E6, N.G6, 1760, 1975.53, 2093];
SCALE.forEach((freq, i) => {
  SOUNDS[`hit${i}`] = mix(render([{ freq: 0, ms: 110, wave: 'noise', gain: 1.4 }]), render([{ freq, ms: 110, gain: 1.2 }]));
});

const dir = path.resolve('public/sfx');
fs.mkdirSync(dir, { recursive: true });
for (const [name, samples] of Object.entries(SOUNDS)) {
  fs.writeFileSync(path.join(dir, `${name}.wav`), wav(samples));
  const peak = Math.max(...samples.map(Math.abs));
  console.log(`${name}.wav  ${(samples.length / RATE).toFixed(2)} s  peak ${peak.toFixed(2)}`);
}
