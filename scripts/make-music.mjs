// Synthesises the KavoxReel music bed (royalty-free, generated from scratch)
// into public/reel/music.wav. 120 BPM, so one bar = 2 s = 60 frames @ 30 fps
// and every phase cut of the reel lands on a downbeat.
//   node scripts/make-music.mjs
// Deterministic: same output on every run.
//
// Arrangement (bars of 2 s, 30 bars = 60 s):
//   0–1   intro: pad swells, filter opens, riser into the drop
//   2–9   A: kick, hats, sidechained bass, pad, plucked arp
//   10–17 B: + clap, open hats, busier arp
//   18–26 C: full, arp an octave up
//   27–29 outro: drums out, riser, impact on bar 28.5 (= reel frame 1710,
//         the logo hit), pad rings out
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const BARS = 30;
const LEN = BARS * BAR;
const N = Math.round(LEN * SR);
const OUT = path.resolve('public/reel');
fs.mkdirSync(OUT, {recursive: true});

// ---- helpers ------------------------------------------------------------------
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rnd = mulberry32(1234);
const noise = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
  }
  set(type, f, q = 0.707) {
    const w = (2 * Math.PI * Math.min(Math.max(f, 10), SR * 0.45)) / SR;
    const c = Math.cos(w);
    const s = Math.sin(w);
    const al = s / (2 * q);
    let b0, b1, b2;
    if (type === 'lp') [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (type === 'hp') [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [al, 0, -al];
    const a0 = 1 + al;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * c) / a0;
    this.a2 = (1 - al) / a0;
    return this;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

const L = new Float32Array(N);
const R = new Float32Array(N);
const add = (i, l, r = l) => {
  if (i >= 0 && i < N) {
    L[i] += l;
    R[i] += r;
  }
};
const at = (sec) => Math.round(sec * SR);

// ---- harmony -------------------------------------------------------------------
// Am – F – C – G (one chord per bar)
const CHORDS = [
  [57, 60, 64, 67, 71],
  [53, 57, 60, 64, 67],
  [55, 60, 64, 67, 72],
  [55, 59, 62, 67, 69],
];
const ROOTS = [33, 29, 36, 31];
const chordAt = (bar) => CHORDS[bar % 4];
const rootAt = (bar) => ROOTS[bar % 4];

const section = (bar) => (bar < 2 ? 'intro' : bar < 10 ? 'A' : bar < 18 ? 'B' : bar < 27 ? 'C' : 'outro');
const drumsOn = (bar) => bar >= 2 && bar < 27;

// kick times (needed for sidechain)
const kicks = [];
for (let b = 2; b < 27; b++) for (let q = 0; q < 4; q++) kicks.push(b * BAR + q * BEAT);
const IMPACT = 28.5 * BAR; // 57 s
kicks.push(IMPACT);
const sidechain = new Float32Array(N).fill(1);
for (const k of kicks) {
  const s = at(k);
  for (let i = 0; i < SR * 0.35; i++) {
    const g = 1 - 0.75 * Math.exp(-i / (SR * 0.09));
    if (s + i < N) sidechain[s + i] = Math.min(sidechain[s + i], g);
  }
}

// ---- pad -------------------------------------------------------------------------
{
  const detune = [-0.11, 0, 0.09];
  const phases = new Map();
  const lpL = new Biquad();
  const lpR = new Biquad();
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const bar = Math.floor(t / BAR);
    const inBar = t - bar * BAR;
    const ch = chordAt(Math.min(bar, BARS - 1));
    const prev = chordAt(Math.max(0, bar - 1));
    const xf = Math.min(1, inBar / 0.25);
    // filter: opens through the intro, breathes per bar, opens wide on the outro hit
    let cut = 900 + 600 * Math.sin((t / BAR) * Math.PI * 0.5) ** 2;
    if (bar < 2) cut = 250 + (t / (2 * BAR)) * 1300;
    if (section(bar) === 'C') cut += 400;
    if (t > IMPACT) cut = 2600 - Math.min(1, (t - IMPACT) / 3) * 1500;
    if (i % 64 === 0) {
      lpL.set('lp', cut, 0.8);
      lpR.set('lp', cut * 1.04, 0.8);
    }
    let l = 0;
    let r = 0;
    const voice = (notes, gain) => {
      notes.forEach((n, ni) => {
        detune.forEach((dt, di) => {
          const key = `${n}:${di}`;
          const f = mtof(n + dt);
          const ph = ((phases.get(key) ?? (ni * 0.13 + di * 0.37)) + f / SR) % 1;
          phases.set(key, ph);
          const saw = 2 * ph - 1;
          const pan = (di - 1) * 0.6;
          l += saw * gain * (1 - pan) * 0.5;
          r += saw * gain * (1 + pan) * 0.5;
        });
      });
    };
    voice(ch, xf);
    if (xf < 1) voice(prev, 1 - xf);
    let amp = 0.032;
    if (bar < 2) amp *= Math.min(1, t / 2.5);
    if (t > IMPACT) amp *= 1.25 * Math.max(0, 1 - (t - IMPACT) / (LEN - IMPACT)) ** 0.8;
    const sc = 0.55 + 0.45 * sidechain[i];
    add(i, lpL.run(l) * amp * sc, lpR.run(r) * amp * sc);
  }
}

// ---- bass ----------------------------------------------------------------------------
{
  const lp = new Biquad().set('lp', 420, 0.9);
  let ph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const bar = Math.floor(t / BAR);
    if (!(drumsOn(bar) || (t >= IMPACT && t < IMPACT + 2.5))) {
      lp.run(0);
      continue;
    }
    const step = Math.floor((t - bar * BAR) / (BEAT / 2)); // 8ths
    const inStep = t - bar * BAR - step * (BEAT / 2);
    const root = rootAt(bar) + (step === 7 && section(bar) !== 'A' ? 12 : 0);
    const f = mtof(root);
    ph = (ph + f / SR) % 1;
    const s = Math.sin(2 * Math.PI * ph);
    const tone = Math.tanh(2.4 * s) * 0.7 + s * 0.5;
    let env = Math.min(1, inStep / 0.004) * Math.exp(-inStep / 0.16);
    if (t >= IMPACT) env = Math.exp(-(t - IMPACT) / 0.9);
    const y = lp.run(tone) * env * 0.3 * (t >= IMPACT ? 1 : sidechain[i]);
    add(i, y);
  }
}

// ---- drums -------------------------------------------------------------------------------
const kick = (t0, gain = 0.85) => {
  const s = at(t0);
  let ph = 0;
  for (let i = 0; i < SR * 0.45; i++) {
    const t = i / SR;
    const f = 46 + 110 * Math.exp(-t / 0.035);
    ph += f / SR;
    const y = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.2) * gain + (i < 90 ? noise() * 0.25 * (1 - i / 90) : 0);
    add(s + i, y);
  }
};
const clap = (t0, gain = 0.26) => {
  const s = at(t0);
  const bp = new Biquad().set('bp', 1400, 1.1);
  for (let i = 0; i < SR * 0.25; i++) {
    const t = i / SR;
    const bursts = (t < 0.01 ? 1 : 0) + (t > 0.011 && t < 0.02 ? 0.8 : 0) + (t > 0.021 ? Math.exp(-(t - 0.021) / 0.07) : 0);
    const y = bp.run(noise()) * bursts * gain * 2.4;
    add(s + i, y * 0.9, y);
  }
};
const hat = (t0, decay = 0.035, gain = 0.07, pan = 0.2) => {
  const s = at(t0);
  const hp = new Biquad().set('hp', 7800, 0.8);
  for (let i = 0; i < SR * decay * 6; i++) {
    const y = hp.run(noise()) * Math.exp(-i / (SR * decay)) * gain;
    add(s + i, y * (1 - pan), y * (1 + pan));
  }
};
const crash = (t0, gain = 0.11) => {
  const s = at(t0);
  const hp = new Biquad().set('hp', 4200, 0.7);
  for (let i = 0; i < SR * 2.4; i++) {
    const y = hp.run(noise()) * Math.exp(-i / (SR * 0.75)) * gain;
    add(s + i, y * 0.9, y);
  }
};
const boom = (t0, gain = 0.7) => {
  const s = at(t0);
  let ph = 0;
  for (let i = 0; i < SR * 2; i++) {
    const t = i / SR;
    ph += (40 + 40 * Math.exp(-t / 0.08)) / SR;
    add(s + i, Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.7) * gain);
  }
};
const riser = (t0, t1, gain = 0.09) => {
  const s = at(t0);
  const n = at(t1) - s;
  const bp = new Biquad();
  for (let i = 0; i < n; i++) {
    const p = i / n;
    if (i % 64 === 0) bp.set('bp', 400 + 6000 * p * p, 1.4);
    const y = bp.run(noise()) * p * p * gain * 3;
    add(s + i, y * (1 - 0.3 * Math.sin(p * 20)), y * (1 + 0.3 * Math.sin(p * 20)));
  }
};

for (let b = 2; b < 27; b++) {
  const sec = section(b);
  for (let q = 0; q < 4; q++) {
    const t = b * BAR + q * BEAT;
    kick(t);
    hat(t + BEAT / 2, sec === 'A' ? 0.03 : 0.05, 0.075);
    if (sec !== 'A' && (q === 1 || q === 3)) clap(t);
    if (sec === 'C') {
      hat(t + BEAT / 4, 0.02, 0.035, -0.4);
      hat(t + (3 * BEAT) / 4, 0.02, 0.035, -0.4);
    }
  }
  if (sec === 'B' && b % 2 === 1) hat(b * BAR + 3.5 * BEAT, 0.22, 0.06);
  // fill into each new section
  if (b === 9 || b === 17 || b === 26) for (let k = 0; k < 4; k++) clap(b * BAR + 3 * BEAT + k * (BEAT / 4), 0.12 + k * 0.04);
}
crash(2 * BAR, 0.13);
crash(10 * BAR);
crash(18 * BAR);
boom(2 * BAR, 0.45);
riser(1.0 * BAR, 2 * BAR, 0.08);
riser(26.5 * BAR, IMPACT, 0.1);
boom(IMPACT, 0.85);
crash(IMPACT, 0.15);
kick(IMPACT, 0.9);

// ---- plucked arp with ping-pong delay ---------------------------------------------------------
{
  const dry = new Float32Array(N);
  const pattern = [0, 2, 1, 3, 2, 4, 1, 3];
  for (let b = 0; b < 28; b++) {
    const sec = section(b);
    const ch = chordAt(b);
    const steps = sec === 'intro' || sec === 'A' ? 8 : 16;
    const oct = sec === 'C' ? 24 : 12;
    for (let k = 0; k < steps; k++) {
      if (sec === 'intro' && b === 0 && k < 4) continue;
      const t0 = b * BAR + k * (BAR / steps);
      const note = ch[pattern[k % pattern.length]] + oct;
      const f = mtof(note);
      const s = at(t0);
      const lp = new Biquad();
      let ph = 0;
      const len = SR * 0.3;
      for (let i = 0; i < len; i++) {
        const t = i / SR;
        if (i % 32 === 0) lp.set('lp', 600 + 4200 * Math.exp(-t / 0.05), 1.2);
        ph = (ph + f / SR) % 1;
        const sq = ph < 0.5 ? 1 : -1;
        const tri = 1 - 4 * Math.abs(ph - 0.5);
        const y = lp.run(sq * 0.5 + tri * 0.6) * Math.exp(-t / 0.11) * (sec === 'intro' ? 0.045 : 0.05);
        if (s + i < N) dry[s + i] += y;
      }
    }
  }
  const d = Math.round((BEAT * 0.75) * SR);
  const bufL = new Float32Array(N);
  const bufR = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const inL = dry[i] + (i >= d ? bufR[i - d] * 0.38 : 0);
    const inR = i >= d ? bufL[i - d] * 0.38 : 0;
    bufL[i] = inL;
    bufR[i] = inR;
    const sc = 0.6 + 0.4 * sidechain[i];
    add(i, (dry[i] * 0.8 + bufL[i] * 0.5 - dry[i] * 0.5) * sc, (dry[i] * 0.4 + bufR[i] * 0.6) * sc);
  }
}

// ---- master ------------------------------------------------------------------------------------
// gentle low cut, soft clip, fade, normalise to −1 dBFS
const hpL = new Biquad().set('hp', 28, 0.7);
const hpR = new Biquad().set('hp', 28, 0.7);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, (LEN - t) / 1.2);
  L[i] = Math.tanh(hpL.run(L[i]) * 1.3) * fade;
  R[i] = Math.tanh(hpR.run(R[i]) * 1.3) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = Math.pow(10, -1 / 20) / (peak || 1);

const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
const file = path.join(OUT, 'music.wav');
fs.writeFileSync(file, Buffer.concat([header, data]));
console.log(`${file} · ${LEN.toFixed(1)} s · ${BPM} BPM`);
