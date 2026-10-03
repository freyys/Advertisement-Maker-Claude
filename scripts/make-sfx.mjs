// Synthesises the teaser's SFX (royalty-free, generated from scratch) into
// public/sfx/*.wav. Deterministic: same output on every run.
//   node scripts/make-sfx.mjs
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const OUT = path.resolve('public/sfx');
fs.mkdirSync(OUT, {recursive: true});

// ---- helpers ---------------------------------------------------------------
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noiseGen = (seed) => {
  const r = mulberry32(seed);
  return () => r() * 2 - 1;
};

// RBJ biquad, coefficients can be updated per block
class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
  }
  set(type, f, q) {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const c = Math.cos(w);
    const s = Math.sin(w);
    const al = s / (2 * q);
    let b0, b1, b2;
    if (type === 'lp') [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (type === 'hp') [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [al, 0, -al]; // band-pass (0 dB peak)
    const a0 = 1 + al;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * c) / a0;
    this.a2 = (1 - al) / a0;
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

const render = (seconds, fn) => {
  const n = Math.round(seconds * SR);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = fn(i / SR, i);
  return buf;
};

const fade = (buf, inMs = 2, outMs = 12) => {
  const fi = Math.round((inMs / 1000) * SR);
  const fo = Math.round((outMs / 1000) * SR);
  for (let i = 0; i < fi && i < buf.length; i++) buf[i] *= i / fi;
  for (let i = 0; i < fo && i < buf.length; i++) buf[buf.length - 1 - i] *= i / fo;
  return buf;
};

const normalize = (buf, peakDb) => {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const g = Math.pow(10, peakDb / 20) / (peak || 1);
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
  return buf;
};

const writeWav = (name, buf) => {
  const data = Buffer.alloc(buf.length * 2);
  for (let i = 0; i < buf.length; i++) {
    const v = Math.max(-1, Math.min(1, buf[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(OUT, name), Buffer.concat([h, data]));
  console.log('wrote', path.join('public/sfx', name));
};

// ---- sounds ----------------------------------------------------------------

/** Soft whoosh, peak at `peak` seconds. */
const whoosh = (seed, dur = 0.75, peak = 0.3, fLo = 350, fHi = 2600) => {
  const nz = noiseGen(seed);
  const bp = new Biquad();
  const lp = new Biquad();
  lp.set('lp', 900, 0.7);
  return render(dur, (t, i) => {
    const shape = t < peak ? Math.pow(t / peak, 2.2) : Math.exp(-(t - peak) / 0.15);
    if (i % 32 === 0) bp.set('bp', fLo + (fHi - fLo) * shape, 0.9);
    const n = nz();
    return bp.run(n) * shape + lp.run(n) * shape * 0.35;
  });
};

const tick = (seed) => {
  const nz = noiseGen(seed);
  const hp = new Biquad();
  hp.set('hp', 3200, 0.8);
  return render(0.035, (t) => hp.run(nz()) * Math.exp(-t / 0.004) + Math.sin(2 * Math.PI * 2300 * t) * Math.exp(-t / 0.006) * 0.4);
};

const click = () => {
  const nz = noiseGen(7);
  const hp = new Biquad();
  hp.set('hp', 2200, 0.8);
  return render(0.14, (t) =>
    Math.sin(2 * Math.PI * 1700 * t) * Math.exp(-t / 0.012) * 0.8 +
    hp.run(nz()) * Math.exp(-t / 0.003) +
    Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.025) * 0.6,
  );
};

const shimmer = () => {
  const partials = [2093, 2637, 3136, 3951, 4699, 5274, 6272];
  return render(1.1, (t) => {
    let s = 0;
    partials.forEach((f, k) => {
      const d = k * 0.028;
      if (t < d) return;
      const tt = t - d;
      const env = Math.min(1, tt / 0.012) * Math.exp(-tt / (0.32 - k * 0.02));
      const trem = 0.75 + 0.25 * Math.sin(2 * Math.PI * (9 + k * 1.3) * tt);
      s += Math.sin(2 * Math.PI * f * tt + k) * env * trem * (1 - k * 0.08);
    });
    return s;
  });
};

const riser = () => {
  const nz = noiseGen(31);
  const bp = new Biquad();
  const dur = 1.0;
  let ph = 0;
  return render(dur, (t, i) => {
    const x = t / dur;
    const amp = Math.pow(x, 2.4);
    if (i % 32 === 0) bp.set('bp', 300 * Math.pow(20, x), 1.4);
    const f = 110 * Math.pow(8, x);
    ph += (2 * Math.PI * f) / SR;
    const trem = 0.8 + 0.2 * Math.sin(2 * Math.PI * (4 + 18 * x) * t);
    return (bp.run(nz()) * 1.0 + Math.sin(ph) * 0.18) * amp * trem;
  });
};

const impact = () => {
  const nz = noiseGen(53);
  const lp = new Biquad();
  lp.set('lp', 1100, 0.8);
  const air = new Biquad();
  air.set('bp', 2400, 0.7);
  let ph = 0;
  return render(1.8, (t) => {
    const f = 42 + 70 * Math.exp(-t / 0.08);
    ph += (2 * Math.PI * f) / SR;
    const boom = Math.sin(ph) * Math.exp(-t / 0.5);
    const crack = lp.run(nz()) * Math.exp(-t / 0.07) * 0.9;
    const tail = air.run(nz()) * Math.exp(-t / 0.55) * 0.18;
    return boom + crack + tail;
  });
};

// Levels are baked in (peak dBFS) so the SFX bus sits around -18 dB and the
// platform sound can play on top.
writeWav('whoosh-a.wav', normalize(fade(whoosh(11)), -15));
writeWav('whoosh-b.wav', normalize(fade(whoosh(23, 0.7, 0.28, 450, 3200)), -15));
writeWav('whoosh-whip.wav', normalize(fade(whoosh(37, 0.6, 0.22, 600, 4200)), -13));
writeWav('whoosh-soft.wav', normalize(fade(whoosh(41, 0.9, 0.38, 300, 1800)), -20));
writeWav('tick.wav', normalize(fade(tick(5), 0.5, 4), -32));
writeWav('click.wav', normalize(fade(click(), 0.3, 10), -16));
writeWav('shimmer.wav', normalize(fade(shimmer(), 1, 60), -21));
writeWav('riser.wav', normalize(fade(riser(), 20, 6), -17));
writeWav('impact.wav', normalize(fade(impact(), 0.5, 120), -11));
