// Synthesises the 24 s music bed for the Kavox pitch reel (KavoxPitch-*) into
// public/pitch/music.mp3. Royalty-free: every sound is generated here, and the
// output is deterministic.
//
//   node scripts/pitch-music.mjs
//
// 120 BPM with a half-bar pickup, so bar lines fall at 1, 3, 5 … s, which is
// where the picture cuts (src/pitch/timeline.ts):
//   0–3 s   clock ticks, filtered pad, riser          (hook)
//   3 s     drop: impact, groove starts                (logo)
//   5–17 s  full groove, arpeggio opens up             (six product shots)
//   17–19 s stop-time: a chord stab on every beat      (no cloud / account / telemetry)
//   19–21 s build: snare roll, riser, rising filter    (values fly-through)
//   21 s    final hit, Fmaj9 rings out to 24 s         (end card)
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SR = 48000;
const LEN = 24;
const N = SR * LEN;
const OUT = path.resolve('public/pitch/music.mp3');

// ---- buses --------------------------------------------------------------------
const L = new Float32Array(N);
const R = new Float32Array(N);
const revL = new Float32Array(N);
const revR = new Float32Array(N);
const dlyL = new Float32Array(N);
const dlyR = new Float32Array(N);
const duck = new Float32Array(N).fill(1); // sidechain from the kick

// ---- helpers ------------------------------------------------------------------
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
let seed = 7;
const noise = () => {
  const r = mulberry32(seed++);
  return () => r() * 2 - 1;
};
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const idx = (t) => Math.round(t * SR);

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

// band-limited saw (polyBLEP)
class Saw {
  constructor(freq, phase = 0) {
    this.p = phase;
    this.dt = freq / SR;
  }
  next() {
    const {dt} = this;
    let t = this.p;
    let v = 2 * t - 1;
    if (t < dt) {
      t /= dt;
      v -= t + t - t * t - 1;
    } else if (t > 1 - dt) {
      t = (t - 1) / dt;
      v -= t * t + t + t + 1;
    }
    this.p += dt;
    if (this.p >= 1) this.p -= 1;
    return v;
  }
}

/** Adds a mono voice into the buses with pan (−1..1) and sends. */
const put = (i, v, pan = 0, rev = 0, dly = 0, ducked = false) => {
  if (i < 0 || i >= N) return;
  const g = ducked ? duck[i] : 1;
  const l = v * g * Math.cos(((pan + 1) * Math.PI) / 4);
  const r = v * g * Math.sin(((pan + 1) * Math.PI) / 4);
  L[i] += l;
  R[i] += r;
  if (rev) {
    revL[i] += l * rev;
    revR[i] += r * rev;
  }
  if (dly) {
    dlyL[i] += l * dly;
    dlyR[i] += r * dly;
  }
};

// ---- harmony ------------------------------------------------------------------
const CH = {
  Dm9: [50, 53, 57, 60, 64],
  Bb9: [46, 50, 53, 57, 60],
  F9: [53, 57, 60, 64, 67],
  Cadd9: [48, 55, 62, 64],
  Csus: [48, 55, 60, 65],
};
const ROOT = {Dm9: 38, Bb9: 34, F9: 41, Cadd9: 36, Csus: 36};
// [start, end, chord] (seconds)
const PROG = [
  [0, 3, 'Dm9'],
  [3, 5, 'Dm9'],
  [5, 7, 'Bb9'],
  [7, 9, 'F9'],
  [9, 11, 'Cadd9'],
  [11, 13, 'Dm9'],
  [13, 15, 'Bb9'],
  [15, 16, 'F9'],
  [16, 17, 'Cadd9'],
  [17, 19, 'Dm9'],
  [19, 20, 'Bb9'],
  [20, 20.5, 'Csus'],
  [20.5, 21, 'Cadd9'],
  [21, 24, 'F9'],
];
const chordAt = (t) => (PROG.find(([a, b]) => t >= a && t < b) ?? PROG[PROG.length - 1])[2];

// ---- drums --------------------------------------------------------------------
const kick = (t0, gain = 1) => {
  const i0 = idx(t0);
  const n = idx(0.5);
  const nz = noise();
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const f = 44 + 120 * Math.exp(-t / 0.032);
    ph += (2 * Math.PI * f) / SR;
    const amp = Math.exp(-t / 0.17) * 0.85 + Math.exp(-t / 0.4) * 0.15;
    const click = t < 0.005 ? nz() * 0.35 * (1 - t / 0.005) : 0;
    put(i0 + k, (Math.sin(ph) * amp + click) * 0.78 * gain);
    const d = 1 - 0.65 * Math.exp(-t / 0.11) * gain;
    if (i0 + k < N) duck[i0 + k] = Math.min(duck[i0 + k], d);
  }
};

const clap = (t0, gain = 1) => {
  const i0 = idx(t0);
  const nz = noise();
  const bp = new Biquad().set('bp', 1300, 0.9);
  const hp = new Biquad().set('hp', 500);
  const n = idx(0.35);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    let env = Math.exp(-t / 0.14);
    for (const o of [0, 0.011, 0.022]) if (t >= o && t < o + 0.01) env += Math.exp(-(t - o) / 0.003) * 1.6;
    const v = hp.run(bp.run(nz())) * env * 0.55 * gain;
    put(i0 + k, v, 0.08, 0.35);
  }
};

const hat = (t0, gain = 1, open = false) => {
  const i0 = idx(t0);
  const nz = noise();
  const hp = new Biquad().set('hp', 7500, 0.8);
  const n = idx(open ? 0.25 : 0.06);
  const tau = open ? 0.09 : 0.022;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    put(i0 + k, hp.run(nz()) * Math.exp(-t / tau) * 0.22 * gain, 0.25, 0.05);
  }
};

const snare = (t0, gain = 1) => {
  const i0 = idx(t0);
  const nz = noise();
  const bp = new Biquad().set('bp', 1900, 0.7);
  const n = idx(0.16);
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    ph += (2 * Math.PI * 185) / SR;
    const v = bp.run(nz()) * Math.exp(-t / 0.05) * 0.5 + Math.sin(ph) * Math.exp(-t / 0.03) * 0.25;
    put(i0 + k, v * gain, -0.1, 0.25);
  }
};

// ---- tonal --------------------------------------------------------------------
const tick = (t0, high) => {
  const i0 = idx(t0);
  const f = high ? 2650 : 1980;
  const n = idx(0.05);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    put(i0 + k, Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.007) * 0.26, high ? 0.25 : -0.25, 0.1);
  }
};

/** Sustained pad over the progression; `cut(t)` sets the filter, `lvl(t)` the level. */
const pad = (from, to, cut, lvl) => {
  for (const [a, b, name] of PROG) {
    const s0 = Math.max(a, from);
    const s1 = Math.min(b, to);
    if (s1 <= s0) continue;
    const notes = CH[name];
    const rel = 0.35;
    const i0 = idx(s0);
    const n = idx(s1 - s0 + rel);
    notes.forEach((m, j) => {
      const fq = midi(m);
      const oscs = [new Saw(fq * 1.004, j * 0.13), new Saw(fq * 0.996, j * 0.37), new Saw(fq * 1.0015, j * 0.71)];
      const fl = new Biquad();
      const fr = new Biquad();
      for (let k = 0; k < n; k++) {
        const t = k / SR;
        const T = s0 + t;
        if (k % 32 === 0) {
          fl.set('lp', cut(T), 0.6);
          fr.set('lp', cut(T) * 1.05, 0.6);
        }
        const att = Math.min(1, t / 0.18);
        const end = s1 - s0;
        const env = att * (t > end ? Math.exp(-(t - end) / (rel / 3)) : 1);
        const g = 0.045 * env * lvl(T);
        const a1 = oscs[0].next();
        const a2 = oscs[1].next();
        const a3 = oscs[2].next();
        put(i0 + k, fl.run(a1 + 0.5 * a3) * g, -0.55, 0.45, 0, true);
        put(i0 + k, fr.run(a2 + 0.5 * a3) * g, 0.55, 0.45, 0, true);
      }
    });
  }
};

const bassNote = (t0, len, m, gain = 1) => {
  const i0 = idx(t0);
  const n = idx(len + 0.05);
  const fq = midi(m);
  const saw = new Saw(fq);
  const lp = new Biquad();
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    if (k % 16 === 0) lp.set('lp', 260 + 900 * Math.exp(-t / 0.05), 0.9);
    ph += (2 * Math.PI * fq) / SR;
    const gate = t < len ? 1 : Math.exp(-(t - len) / 0.012);
    const env = Math.min(1, t / 0.004) * (0.55 + 0.45 * Math.exp(-t / 0.08)) * gate;
    put(i0 + k, (lp.run(saw.next()) * 0.5 + Math.sin(ph) * 0.55) * env * 0.42 * gain, 0, 0, 0, true);
  }
};

const pluck = (t0, m, cutoff, gain = 1, pan = 0) => {
  const i0 = idx(t0);
  const n = idx(0.3);
  const fq = midi(m);
  const a = new Saw(fq);
  const b = new Saw(fq * 1.006, 0.5);
  const lp = new Biquad();
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    if (k % 16 === 0) lp.set('lp', cutoff * (0.35 + 0.65 * Math.exp(-t / 0.045)), 1.4);
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.09);
    put(i0 + k, lp.run(a.next() - b.next() * 0.6) * env * 0.075 * gain, pan, 0.2, 0.32);
  }
};

const stab = (t0, name, gain = 1) => {
  for (const m of [...CH[name], CH[name][0] + 12]) {
    const i0 = idx(t0);
    const n = idx(0.6);
    const s1 = new Saw(midi(m) * 1.003);
    const s2 = new Saw(midi(m) * 0.997, 0.3);
    const lp = new Biquad();
    for (let k = 0; k < n; k++) {
      const t = k / SR;
      if (k % 16 === 0) lp.set('lp', 900 + 4200 * Math.exp(-t / 0.07), 0.8);
      const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.16);
      const v = lp.run(s1.next() + s2.next()) * env * 0.05 * gain;
      put(i0 + k, v, -0.3, 0.5);
      put(i0 + k, v, 0.3, 0.5);
    }
  }
};

const riser = (t0, t1, gain = 1) => {
  const i0 = idx(t0);
  const n = idx(t1 - t0);
  const nz = noise();
  const bp = new Biquad();
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const p = k / n;
    if (k % 32 === 0) bp.set('bp', 350 * Math.pow(9000 / 350, p), 1.2);
    const f = 180 * Math.pow(6, p);
    ph += (2 * Math.PI * f) / SR;
    const amp = p * p * gain;
    const v = bp.run(nz()) * 0.5 * amp + Math.sin(ph) * 0.06 * amp;
    put(i0 + k, v, Math.sin(p * 9) * 0.4, 0.4);
  }
};

const impact = (t0, gain = 1) => {
  const i0 = idx(t0);
  const n = idx(2.2);
  const nz = noise();
  const lp = new Biquad().set('lp', 1600, 0.7);
  let ph = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    ph += (2 * Math.PI * (32 + 40 * Math.exp(-t / 0.09))) / SR;
    const v = Math.sin(ph) * Math.exp(-t / 0.55) * 0.8 + lp.run(nz()) * Math.exp(-t / 0.12) * 0.45;
    put(i0 + k, v * gain, 0, 0.6);
  }
};

const crash = (t0, gain = 1) => {
  const i0 = idx(t0);
  const n = idx(3);
  const nzL = noise();
  const nzR = noise();
  const hl = new Biquad().set('hp', 4800, 0.7);
  const hr = new Biquad().set('hp', 4800, 0.7);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const env = Math.exp(-t / 0.9) * 0.09 * gain;
    put(i0 + k, hl.run(nzL()) * env, -0.6, 0.3);
    put(i0 + k, hr.run(nzR()) * env, 0.6, 0.3);
  }
};

const bell = (t0, name, gain = 1) => {
  const notes = [...CH[name].map((m) => m + 12), CH[name][0] + 24];
  notes.forEach((m, j) => {
    const i0 = idx(t0 + j * 0.035);
    const n = idx(3);
    const fq = midi(m);
    for (let k = 0; k < n; k++) {
      const t = k / SR;
      const v =
        (Math.sin(2 * Math.PI * fq * t) + 0.3 * Math.sin(2 * Math.PI * fq * 2.76 * t) * Math.exp(-t / 0.3)) * Math.exp(-t / 1.1) * 0.028 * gain;
      put(i0 + k, v, (j / (notes.length - 1)) * 1.2 - 0.6, 0.6);
    }
  });
};

// ---- arrangement ----------------------------------------------------------------
const beats = (from, to, step = 0.5) => {
  const out = [];
  for (let t = from; t < to - 1e-6; t += step) out.push(Math.round(t * 1000) / 1000);
  return out;
};

// hook: clock ticks, dark pad, riser into the drop
beats(0, 3).forEach((t, i) => tick(t, i % 2 === 0));
riser(1.5, 3.0, 0.9);

// pads: filter opens through the reel, dips in the stop-time, opens wide at the end
pad(
  0,
  24,
  (t) => (t < 3 ? 380 + 220 * (t / 3) : t < 17 ? 900 + 1300 * ((t - 3) / 14) : t < 19 ? 700 : t < 21 ? 900 + 1800 * ((t - 19) / 2) : 2600),
  (t) => (t < 3 ? Math.min(1, t / 1.2) * 1.25 * (t > 2.88 ? 0.15 : 1) : t < 21 ? 0.75 : 1.15 * Math.exp(-(t - 21) / 2.2)),
);

// drop
impact(3.0, 1);
kick(3.0, 1.05);
crash(3.0, 0.6);
kick(4.0, 0.8);
hat(4.5, 0.8, true);

// groove 5–17
beats(5, 17).forEach((t) => kick(t, 0.95));
beats(5.5, 17, 1).forEach((t) => clap(t, 0.85));
beats(5.25, 17, 0.5).forEach((t, i) => hat(t, 0.9, i % 4 === 3));
beats(5, 17, 0.125).forEach((t, i) => i % 2 === 1 && hat(t, 0.25));
// fill into the stop-time
beats(16, 17, 0.125).forEach((t, i) => snare(t, 0.25 + 0.75 * (i / 8)));

// bass: eighths, root with octave pumps
beats(3, 17, 0.25).forEach((t, i) => {
  const root = ROOT[chordAt(t)];
  if (t < 5 && i % 4 !== 0) return; // sparse under the logo
  bassNote(t, 0.21, root + (i % 4 === 2 ? 12 : 0), 1);
});

// arpeggio 5–17, filter opening
beats(5, 17, 0.125).forEach((t, i) => {
  const ch = CH[chordAt(t)];
  const pool = [...ch, ...ch.map((m) => m + 12)];
  const order = [0, 2, 4, 1, 3, 5, 2, 6];
  const m = pool[order[i % order.length] % pool.length] + 12;
  pluck(t, m, 1300 + 3000 * ((t - 5) / 12), 1, i % 2 ? 0.35 : -0.35);
});

// stop-time 17–19: one stab per line / badge beat
[17, 17.5, 18, 18.5].forEach((t, i) => {
  stab(t, 'Dm9', i === 3 ? 0.75 : 1);
  kick(t, i === 3 ? 0.7 : 1);
  if (i % 2 === 1) clap(t, 0.7);
});
beats(17, 19, 0.5).forEach((t) => bassNote(t, 0.4, ROOT.Dm9, 0.9));

// build 19–21: four-on-the-floor, rolling snare, riser
beats(19, 21).forEach((t) => kick(t, 1));
beats(19, 21, 0.25).forEach((t, i) => hat(t, 0.7 + (i % 2) * 0.3));
beats(19, 20, 0.25).forEach((t) => snare(t, 0.35));
beats(20, 20.75, 0.125).forEach((t, i) => snare(t, 0.4 + i * 0.07));
beats(20.75, 21, 0.0625).forEach((t, i) => snare(t, 0.8 + i * 0.05));
beats(19, 21, 0.25).forEach((t, i) => bassNote(t, 0.2, ROOT[chordAt(t)] + (i % 2 ? 12 : 0), 1));
beats(19, 21, 0.125).forEach((t, i) => {
  const ch = CH[chordAt(t)];
  pluck(t, ch[i % ch.length] + 24, 2500 + 2500 * ((t - 19) / 2), 0.8, i % 2 ? 0.4 : -0.4);
});
riser(19.2, 21.0, 0.8);

// final hit
impact(21.0, 1.1);
kick(21.0, 1.1);
crash(21.0, 1.1);
stab(21.0, 'F9', 1.1);
bell(21.0, 'F9', 1);
bassNote(21.0, 1.4, ROOT.F9, 1);

// ---- effects ----------------------------------------------------------------------
// Freeverb (8 damped combs + 4 allpasses per channel)
const freeverb = (input, spread) => {
  const k = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => {
    const len = Math.round((d + spread) * k);
    return {buf: new Float32Array(len), i: 0, store: 0};
  });
  const aps = [556, 441, 341, 225].map((d) => ({buf: new Float32Array(Math.round((d + spread) * k)), i: 0}));
  const fb = 0.86;
  const damp = 0.3;
  const out = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const x = input[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * (1 - damp) + c.store * damp;
      c.buf[c.i] = x + c.store * fb;
      if (++c.i >= c.buf.length) c.i = 0;
      y += o;
    }
    for (const a of aps) {
      const b = a.buf[a.i];
      a.buf[a.i] = y + b * 0.5;
      y = b - y;
      if (++a.i >= a.buf.length) a.i = 0;
    }
    out[n] = y;
  }
  return out;
};

// ping-pong delay, 3/16 note
const pingpong = () => {
  const d = idx(0.375);
  const bl = new Float32Array(d);
  const br = new Float32Array(d);
  const lpL = new Biquad().set('lp', 3500);
  const lpR = new Biquad().set('lp', 3500);
  let i = 0;
  const oL = new Float32Array(N);
  const oR = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    const yl = bl[i];
    const yr = br[i];
    bl[i] = dlyL[n] + dlyR[n] + lpR.run(yr) * 0.38;
    br[i] = lpL.run(yl) * 0.38;
    oL[n] = yl;
    oR[n] = yr;
    if (++i >= d) i = 0;
  }
  return [oL, oR];
};

const wetL = freeverb(revL, 0);
const wetR = freeverb(revR, 23);
const [ppL, ppR] = pingpong();

// ---- master -------------------------------------------------------------------------
const pcm = Buffer.alloc(N * 2 * 4);
const hpL = new Biquad().set('hp', 28);
const hpR = new Biquad().set('hp', 28);
for (let n = 0; n < N; n++) {
  const t = n / SR;
  const fade = Math.min(1, t / 0.02) * Math.min(1, (LEN - t) / 0.6);
  let l = hpL.run(L[n] + wetL[n] * 0.9 + ppL[n] * 0.8);
  let r = hpR.run(R[n] + wetR[n] * 0.9 + ppR[n] * 0.8);
  l = Math.tanh(l * 0.9) * fade;
  r = Math.tanh(r * 0.9) * fade;
  pcm.writeFloatLE(l, n * 8);
  pcm.writeFloatLE(r, n * 8 + 4);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pitch-music-'));
const raw = path.join(tmp, 'mix.f32');
fs.writeFileSync(raw, pcm);
const inArgs = ['-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', raw];

// two-pass loudness normalisation to −16 LUFS (SFX sit on top in the film)
const target = 'I=-16:TP=-1.5:LRA=9';
// ffmpeg prints the loudnorm measurement as JSON on stderr
const meas = (() => {
  const r = execFileSync('sh', ['-c', `ffmpeg -hide_banner -f f32le -ar ${SR} -ac 2 -i "${raw}" -af loudnorm=${target}:print_format=json -f null - 2>&1`], {encoding: 'utf8'});
  return JSON.parse(r.slice(r.lastIndexOf('{'), r.lastIndexOf('}') + 1));
})();
const ln = `loudnorm=${target}:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`;
fs.mkdirSync(path.dirname(OUT), {recursive: true});
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inArgs, '-af', ln, '-ar', String(SR), '-c:a', 'libmp3lame', '-b:a', '320k', OUT], {stdio: 'inherit'});
fs.rmSync(tmp, {recursive: true, force: true});
console.log(`wrote ${path.relative(process.cwd(), OUT)} (${LEN} s, measured ${meas.input_i} LUFS → −16)`);
