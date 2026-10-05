// Synthesises the gold reel's extra SFX (royalty-free, generated from scratch) into
// public/gold/sfx/*.wav. Deterministic: same output on every run.
//   node scripts/make-sfx.mjs
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const OUT = path.resolve('public/gold/sfx');
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
  console.log('wrote', path.join('public/gold/sfx', name));
};


const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

// Heavy mechanical stamp of the printing press (one hit; looped in the reel).
const pressHit = (seed) => {
  const n = noiseGen(seed);
  const lp = new Biquad();
  lp.set('lp', 900, 0.8);
  const bp = new Biquad();
  bp.set('bp', 3200, 2);
  return render(0.5, (t) => {
    const thump = Math.sin(2 * Math.PI * (70 - 30 * t) * t) * env(t, 0.003, 0.07);
    const clank = lp.run(n()) * env(t, 0.001, 0.05) * 1.4;
    const paper = bp.run(n()) * env(Math.max(0, t - 0.12), 0.04, 0.12) * 0.5 * (t > 0.12);
    return thump + clank + paper;
  });
};

// Vault door: low boom, metal resonance, two latch clicks.
const vault = () => {
  const n = noiseGen(77);
  const lp = new Biquad();
  lp.set('lp', 400, 0.7);
  const hp = new Biquad();
  hp.set('hp', 2500, 0.7);
  return render(2.4, (t) => {
    const boom = Math.sin(2 * Math.PI * (52 - 12 * t) * t) * env(t, 0.004, 0.45);
    const body = lp.run(n()) * env(t, 0.002, 0.25) * 1.6;
    const ring = (Math.sin(2 * Math.PI * 187 * t) + 0.6 * Math.sin(2 * Math.PI * 431 * t)) * env(t, 0.01, 0.7) * 0.25;
    const c1 = t > 0.9 ? hp.run(n()) * env(t - 0.9, 0.001, 0.012) * 2 : 0;
    const c2 = t > 1.12 ? hp.run(n()) * env(t - 1.12, 0.001, 0.015) * 2.4 : 0;
    return boom + body + ring + c1 + c2;
  });
};

// Single metallic coin ping (inharmonic partials).
const coin = (seed, f0 = 2100) => {
  const n = noiseGen(seed);
  const parts = [1, 1.47, 2.09, 2.76, 3.41];
  return render(1.4, (t) => {
    let s = n() * env(t, 0.0005, 0.004) * 0.6;
    parts.forEach((p, i) => (s += Math.sin(2 * Math.PI * f0 * p * t) * env(t, 0.001, 0.5 / (i + 1)) * (0.5 / (i + 1))));
    return s;
  });
};

// Electric crackle + 100 Hz hum (copper coil / charger).
const zap = () => {
  const n = noiseGen(91);
  const r = mulberry32(5);
  const bp = new Biquad();
  bp.set('bp', 4000, 1.2);
  let spark = 0;
  return render(1.6, (t) => {
    if (r() < 0.004) spark = 1;
    spark *= 0.995;
    const hum = (Math.sin(2 * Math.PI * 100 * t) + 0.4 * Math.sin(2 * Math.PI * 300 * t)) * 0.25;
    return (hum + bp.run(n()) * spark * 1.5) * Math.min(1, t / 0.1) * Math.min(1, (1.6 - t) / 0.4);
  });
};

// Server room: airy fan noise and a low drone.
const servers = () => {
  const n = noiseGen(13);
  const lp = new Biquad();
  lp.set('lp', 1400, 0.6);
  return render(2.2, (t) => {
    const fan = lp.run(n()) * 0.5;
    const drone = Math.sin(2 * Math.PI * 60 * t) * 0.3 + Math.sin(2 * Math.PI * 1760 * t) * 0.02;
    return (fan + drone) * Math.min(1, t / 0.3) * Math.min(1, (2.2 - t) / 0.5);
  });
};

// Underwater: deep rumble, slow filter sweep, bubbles.
const underwater = () => {
  const n = noiseGen(55);
  const lp = new Biquad();
  const r = mulberry32(9);
  let bub = 0;
  let bf = 600;
  return render(5.5, (t, i) => {
    if (i % 64 === 0) lp.set('lp', 220 + 140 * Math.sin(t * 1.3), 0.9);
    if (r() < 0.0004) {
      bub = 1;
      bf = 400 + r() * 900;
    }
    bub *= 0.9993;
    const b = Math.sin(2 * Math.PI * bf * (1 + 0.6 * (1 - bub)) * t) * bub * 0.15;
    return (lp.run(n()) * 1.4 + b) * Math.min(1, t / 0.6) * Math.min(1, (5.5 - t) / 1.2);
  });
};

// Dark room tone under the whole reel (no music, just air).
const roomtone = () => {
  const n = noiseGen(3);
  const lp = new Biquad();
  lp.set('lp', 160, 0.7);
  return render(8, (t) => lp.run(n()) * 1.0 + Math.sin(2 * Math.PI * 41 * t) * 0.08);
};

// Paper bills fluttering down.
const flutter = () => {
  const n = noiseGen(66);
  const bp = new Biquad();
  bp.set('bp', 2400, 0.9);
  return render(2.5, (t) => bp.run(n()) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 11 * t + Math.sin(t * 7))) * Math.min(1, t / 0.3) * Math.min(1, (2.5 - t) / 0.8));
};

writeWav('press.wav', normalize(fade(pressHit(4), 0.5, 40), -12));
writeWav('vault.wav', normalize(fade(vault(), 0.5, 200), -9));
writeWav('coin.wav', normalize(fade(coin(8), 0.2, 100), -18));
writeWav('coin-lo.wav', normalize(fade(coin(12, 1300), 0.2, 100), -17));
writeWav('zap.wav', normalize(fade(zap(), 2, 60), -20));
writeWav('servers.wav', normalize(fade(servers(), 2, 60), -22));
writeWav('underwater.wav', normalize(fade(underwater(), 10, 200), -14));
writeWav('roomtone.wav', normalize(fade(roomtone(), 200, 200), -30));
writeWav('flutter.wav', normalize(fade(flutter(), 10, 100), -24));
