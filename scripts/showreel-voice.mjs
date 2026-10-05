// Syncs the showreel to a recorded voiceover take (one file, all 11 lines).
//
//   node scripts/showreel-voice.mjs analyze <take.mp3>   # find the lines, print a table
//   node scripts/showreel-voice.mjs sync <take.mp3>      # + write src/showreel/vo-sync.ts
//                                                        #   and public/voiceover.mp3
//
// How it works: ffmpeg's silencedetect splits the take into speech segments,
// a small dynamic program groups them into the 11 script lines (speech length
// ∝ letters per line, cuts preferred at long pauses), and words inside a line
// are located by spreading its letters over its speech segments. Each line
// (two of them split in half) is then placed at the start of its shot; a shot
// lasts as long as its design, its voice line or its animation needs,
// whichever is longest.
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [mode = 'analyze', takeArg] = process.argv.slice(2);
if (!takeArg) {
  console.error('usage: node scripts/showreel-voice.mjs analyze|sync <take.mp3>');
  process.exit(1);
}
const take = path.resolve(takeArg);

// ---- script ------------------------------------------------------------------
// `extra` = letters' worth of non-speech sound (sigh, laugh) inside the line.
const LINES = [
  {n: 1, text: 'Kennst du das? Feierabend… und auf dem Küchentisch warten noch drei Angebote.', extra: 8},
  {n: 2, text: 'Was wäre, wenn du sie einfach… sagst?'},
  {n: 3, text: 'Wohnzimmer, fünf mal vier, zwei sechzig hoch. Tapete runter, spachteln, streichen. Fertig.'},
  {n: 4, text: 'Kavox rechnet die Flächen, zieht Fenster und Tür ab – und zeigt dir jeden Rechenweg. Kein Rätselraten mehr.', extra: 6},
  {n: 5, text: 'Die Summe steht, noch bevor du die Leiter einpackst. Der Kunde unterschreibt direkt vor Ort.'},
  {n: 6, text: 'Ein Tipp – und alles liegt am Rechner. Automatisch geprüft. Als sauberes PDF. Raus damit.'},
  {n: 7, text: 'Morgens siehst du sofort, was offen ist… was überfällig ist… und was diese Woche reinkommt.'},
  {n: 8, text: 'Steuerkreuz? Nein – Strg plus K. Alles in einer Sekunde gefunden.', extra: 6},
  {n: 9, text: 'Umsatz. Zahlungsdauer. Rechnungsausgangsbuch als Excel. Alles im Griff.'},
  {n: 10, text: 'Und das Beste? Deine Daten bleiben bei dir. Offline.'},
  {n: 11, text: 'Kavox. Angebote, die sich selbst schreiben.'},
];
const isLetter = (c) => /[\p{L}\p{N}]/u.test(c);
const letters = (s) => [...s].filter(isLetter).length;
const weight = (l) => letters(l.text) + (l.extra ?? 0);
/** Letter index where `word` starts (nth occurrence). */
const letterAt = (text, word, nth = 1) => {
  let idx = -1;
  for (let i = 0; i < nth; i++) idx = text.indexOf(word, idx + 1);
  if (idx < 0) throw new Error(`"${word}" not in "${text}"`);
  return letters(text.slice(0, idx));
};

// ---- 1. speech segments --------------------------------------------------------
const probeDur = (f) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], {encoding: 'utf8'}).trim());

const total = probeDur(take);
const log = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', take, '-af', 'silencedetect=noise=-44dB:d=0.12', '-f', 'null', '-'], {
  encoding: 'utf8',
  maxBuffer: 1 << 26,
}).stderr;
const silences = [];
let open = null;
for (const line of log.split('\n')) {
  const s = line.match(/silence_start: (-?[\d.]+)/);
  const e = line.match(/silence_end: ([\d.]+)/);
  if (s) open = Math.max(0, Number(s[1]));
  if (e && open !== null) {
    silences.push([open, Number(e[1])]);
    open = null;
  }
}
if (open !== null) silences.push([open, total]);
let segs = [];
let t = 0;
for (const [a, b] of silences) {
  if (a - t > 0.04) segs.push({start: t, end: a});
  t = b;
}
if (total - t > 0.04) segs.push({start: t, end: total});
// merge tiny gaps, drop clicks
segs = segs.reduce((acc, s) => {
  const last = acc[acc.length - 1];
  if (last && s.start - last.end < 0.06) last.end = s.end;
  else acc.push({...s});
  return acc;
}, []).filter((s) => s.end - s.start >= 0.07);
const n = segs.length;
const dur = (s) => s.end - s.start;

// ---- 2. group segments into lines (DP) ----------------------------------------------
const W = LINES.map(weight);
const totalW = W.reduce((a, b) => a + b, 0);
const speechSum = (a, b) => segs.slice(a, b).reduce((x, s) => x + dur(s), 0);
const gapBefore = (i) => (i === 0 ? 1.5 : segs[i].start - segs[i - 1].end);

const align = (r) => {
  const L = LINES.length;
  const dp = Array.from({length: L + 1}, () => new Array(n + 1).fill(Infinity));
  const from = Array.from({length: L + 1}, () => new Array(n + 1).fill(-1));
  dp[0][0] = 0;
  for (let j = 1; j <= L; j++) {
    for (let b = j; b <= n - (L - j); b++) {
      for (let a = j - 1; a < b; a++) {
        if (dp[j - 1][a] === Infinity) continue;
        const exp = r * W[j - 1];
        const err = (speechSum(a, b) - exp) / exp;
        const c = dp[j - 1][a] + 4 * err * err - 1.2 * Math.min(gapBefore(a), 1.5);
        if (c < dp[j][b]) {
          dp[j][b] = c;
          from[j][b] = a;
        }
      }
    }
  }
  const cuts = [];
  let b = n;
  for (let j = L; j >= 1; j--) {
    const a = from[j][b];
    cuts.unshift([a, b]);
    b = a;
  }
  return cuts;
};
let r = speechSum(0, n) / totalW;
let groups = align(r);
// refine the speaking rate once with the median per-line rate
const rates = groups.map(([a, b], j) => speechSum(a, b) / W[j]).sort((x, y) => x - y);
r = rates[Math.floor(rates.length / 2)];
groups = align(r);

const lines = LINES.map((l, j) => {
  const [a, b] = groups[j];
  const ls = segs.slice(a, b);
  return {...l, segs: ls, start: ls[0].start, end: ls[ls.length - 1].end, speech: speechSum(a, b)};
});

/** Time (in the take) at which letter k of a line is spoken. */
const charTime = (line, k) => {
  const w = weight(line);
  let acc = 0;
  for (const s of line.segs) {
    const share = (w * dur(s)) / line.speech;
    if (k <= acc + share) return s.start + ((k - acc) / share) * dur(s);
    acc += share;
  }
  return line.end;
};
/** Start time of a word; snapped to a segment start when one is close. */
const wordTime = (line, word, nth = 1) => {
  const t0 = charTime(line, letterAt(line.text, word, nth));
  const near = line.segs.map((s) => s.start).filter((s) => Math.abs(s - t0) < 0.3);
  return near.length ? near.reduce((p, c) => (Math.abs(c - t0) < Math.abs(p - t0) ? c : p)) : t0;
};
/** Split a line at the pause closest to `word`. Returns [aEnd, bStart] in take time. */
const splitAt = (line, word) => {
  const target = charTime(line, letterAt(line.text, word));
  let best = null;
  for (let i = 1; i < line.segs.length; i++) {
    const gap = line.segs[i].start - line.segs[i - 1].end;
    const score = Math.abs(line.segs[i].start - target) - 0.25 * Math.min(gap, 1);
    if (!best || score < best.score) best = {score, aEnd: line.segs[i - 1].end, bStart: line.segs[i].start};
  }
  if (!best) throw new Error(`cannot split line ${line.n} at "${word}"`);
  return [best.aEnd, best.bStart];
};

const fmt = (x) => x.toFixed(2).padStart(6);
console.log(`take: ${path.basename(take)}  ${total.toFixed(2)} s, ${n} speech segments, ${(1 / r).toFixed(1)} letters/s`);
for (const l of lines) {
  console.log(`L${String(l.n).padStart(2)} ${fmt(l.start)} → ${fmt(l.end)}  (${fmt(l.end - l.start)} s, ${String(l.segs.length).padStart(2)} seg)  ${l.text}`);
}
fs.mkdirSync('voiceover', {recursive: true});
fs.writeFileSync(
  'voiceover/vo-analysis.json',
  JSON.stringify({take: path.basename(take), duration: total, lettersPerSecond: 1 / r, lines: lines.map(({n: ln, text, start, end, segs: s}) => ({line: ln, text, start, end, segments: s}))}, null, 2),
);
if (mode !== 'sync') process.exit(0);

// ---- 3. units: what is spoken at the start of each shot ----------------------------------
const L = (k) => lines[k - 1];
const [l6aEnd, l6bStart] = splitAt(L(6), 'Automatisch');
const [l7aEnd, l7bStart] = splitAt(L(7), 'und was diese');
const [l3aEnd, l3bStart] = splitAt(L(3), 'Fertig');
const [, l5bStart] = splitAt(L(5), 'Der Kunde');
const [, l11bStart] = splitAt(L(11), 'Angebote');

const SHOT_ORDER = ['intro', 'nacht', 'baustelle', 'sagen', 'rechenweg', 'unterschrift', 'uebergabe', 'pruefen', 'cockpit', 'cashflow', 'befehl', 'archiv', 'outro'];
// designed (minimum) shot lengths in seconds
const MIN = {intro: 5, nacht: 6, baustelle: 5, sagen: 9.5, rechenweg: 5.5, unterschrift: 5.5, uebergabe: 4.6, pruefen: 5.5, cockpit: 5.5, cashflow: 4.6, befehl: 4, archiv: 4, outro: 6};
const LEAD = 0.35; // voice starts this long after the cut
const GAP = 0.35; // minimum silence between two placed units

const UNITS = {
  nacht: [{line: 1, from: L(1).start, to: L(1).end}],
  baustelle: [{line: 2, from: L(2).start, to: L(2).end}],
  sagen: [{line: 3, from: L(3).start, to: L(3).end}],
  rechenweg: [{line: 4, from: L(4).start, to: L(4).end}],
  unterschrift: [{line: 5, from: L(5).start, to: L(5).end}],
  uebergabe: [{line: 6, from: L(6).start, to: l6aEnd}],
  pruefen: [{line: 6, from: l6bStart, to: L(6).end}],
  cockpit: [{line: 7, from: L(7).start, to: l7aEnd}],
  cashflow: [{line: 7, from: l7bStart, to: L(7).end}],
  befehl: [{line: 8, from: L(8).start, to: L(8).end}],
  archiv: [{line: 9, from: L(9).start, to: L(9).end}],
  outro: [{line: 10, from: L(10).start, to: L(10).end}],
};

// ---- 4. beats (relative to the shot start) ------------------------------------------------
/** take time → time relative to the shot that carries the unit starting at `unitFrom` */
const rel = (unitFrom) => (tt) => LEAD + (tt - unitFrom);
const round = (x) => Math.round(x * 100) / 100;
const B = {};
const NEED = {};
{
  const R = rel(L(3).start);
  const typeStart = R(L(3).start);
  const typeEnd = R(l3aEnd);
  const fertig = R(l3bStart);
  const reply = typeEnd + 0.2;
  const card = Math.max(reply + 0.35, fertig - 0.05);
  const count = card + 1.3;
  B.sagen = {typeStart, typeEnd, fertig, reply, card, pan: reply + 0.1, panEnd: reply + 1.7, count};
  NEED.sagen = count + 2.6;
}
{
  const R = rel(L(4).start);
  const line1 = R(wordTime(L(4), 'rechnet'));
  const line2 = Math.max(line1 + 0.5, R(wordTime(L(4), 'Fenster')));
  const line3 = Math.max(line2 + 0.4, R(wordTime(L(4), 'Tür')));
  const result = Math.max(line3 + 0.5, R(wordTime(L(4), 'zeigt')));
  B.rechenweg = {zoom: 0.2, lift: Math.max(0.6, line1 - 0.4), line1, line2, line3, result};
  NEED.rechenweg = result + 1.6;
}
{
  const R = rel(L(5).start);
  const count = R(L(5).start) + 0.05;
  const pulse = Math.max(count + 2.0, R(l5bStart));
  B.unterschrift = {count, countEnd: count + 1.9, pulse};
  NEED.unterschrift = pulse + 1.8;
}
{
  const R = rel(L(6).start);
  const tap = R(wordTime(L(6), 'Tipp')) + 0.15;
  const fly = tap + 0.35;
  const land = fly + 1.0;
  B.uebergabe = {tap, fly, land, settle: land + 0.75};
  NEED.uebergabe = land + 2.2;
}
{
  const R = rel(l6bStart);
  const check1 = R(l6bStart) + 0.05;
  const pdf = Math.max(check1 + 1.9, R(wordTime(L(6), 'Als')));
  const send = Math.max(pdf + 1.4, R(wordTime(L(6), 'Raus')));
  B.pruefen = {check1, checkEvery: 0.38, pan: check1 + 0.75, sweep: Math.min(check1 + 1.45, pdf - 0.4), pdf, stripes: pdf + 0.5, send};
  NEED.pruefen = send + 0.9;
}
{
  const R = rel(L(7).start);
  const offen = Math.max(1.6, R(wordTime(L(7), 'offen')));
  const ueberfaellig = Math.max(offen + 0.8, R(wordTime(L(7), 'überfällig')));
  B.cockpit = {type: 0.25, cards: 0.75, cardEvery: 0.16, offen, ueberfaellig};
  NEED.cockpit = ueberfaellig + 1.6;
}
{
  const draw = LEAD;
  B.cashflow = {draw, drawEnd: draw + 3.0};
  NEED.cashflow = draw + 3.8;
}
{
  const R = rel(L(8).start);
  const press = Math.max(0.45, R(wordTime(L(8), 'Strg')));
  const palette = press + 0.4;
  const type = palette + 0.4;
  B.befehl = {keys: 0.1, press, palette, type, typeEvery: 0.12, rows: type + 0.35};
  NEED.befehl = type + 0.35 + 1.6;
}
{
  const R = rel(L(9).start);
  const count = R(wordTime(L(9), 'Umsatz'));
  const zahldauer = Math.max(count + 0.5, R(wordTime(L(9), 'Zahlungsdauer')));
  const excel = Math.max(zahldauer + 0.5, R(wordTime(L(9), 'Rechnungsausgangsbuch')));
  const griff = Math.max(excel + 0.6, R(wordTime(L(9), 'Alles')));
  B.archiv = {left: 0, right: 0.15, count, countEnd: count + 1.2, zahldauer, excel, griff};
  NEED.archiv = griff + 1.2;
}
{
  const R = rel(L(10).start);
  const collapse = Math.max(2.0, R(L(10).end) + 0.15);
  const logo = collapse + 0.3;
  // line 11 is placed so "Kavox." lands with the logo
  const l11At = logo + 0.1;
  const tagline = l11At + (l11bStart - L(11).start) - 0.05;
  B.outro = {offline: 0.3, collapse, logo, tagline};
  UNITS.outro.push({line: 11, from: L(11).start, to: L(11).end, at: l11At});
  NEED.outro = l11At + (L(11).end - L(11).start) + 1.6;
}

// ---- 5. schedule ------------------------------------------------------------------------
const shots = {};
const placed = [];
let S = 0;
for (const id of SHOT_ORDER) {
  shots[id] = round(S);
  let need = MIN[id];
  for (const u of UNITS[id] ?? []) {
    const at = S + (u.at ?? LEAD);
    placed.push({...u, at});
    need = Math.max(need, at - S + (u.to - u.from) + GAP);
  }
  if (NEED[id]) need = Math.max(need, NEED[id]);
  S += need;
}
const end = round(S);
const cues = LINES.map((l) => {
  const us = placed.filter((u) => u.line === l.n);
  const at = us[0].at;
  const last = us[us.length - 1];
  return {line: l.n, at: round(at), len: round(last.at + (last.to - last.from) - at)};
});
for (const id of Object.keys(B)) for (const k of Object.keys(B[id])) B[id][k] = round(B[id][k]);

console.log('\nshots:', Object.entries(shots).map(([k, v]) => `${k} ${v}`).join(' · '), `· end ${end}`);
console.log('beats:', JSON.stringify(B));

const ts = `// Generated by \`node scripts/showreel-voice.mjs sync ${path.relative(process.cwd(), take)}\`: cut times
// and in-shot beats measured from the recorded voiceover. Set VO_SYNC to null
// to fall back to the hand-set timing in timeline.ts.

export type VoSync = {
  /** Source take the timing was measured from. */
  source: string;
  /** Shot start times in seconds. */
  shots: Record<string, number>;
  /** In-shot beat overrides (seconds after the shot start). */
  beats: Record<string, Record<string, number>>;
  /** Where each voice line starts on the timeline, and how long it runs. */
  cues: Array<{line: number; at: number; len: number}>;
  /** End of the film in seconds. */
  end: number;
};

export const VO_SYNC: VoSync | null = ${JSON.stringify({source: path.basename(take), shots, beats: B, cues, end}, null, 2)};
`;
fs.writeFileSync('src/showreel/vo-sync.ts', ts);
console.log('wrote src/showreel/vo-sync.ts');

// ---- 6. voiceover.mp3: every unit at its place ------------------------------------------
const inputs = [];
const filters = [];
placed.forEach((u, i) => {
  const a = Math.max(0, u.from - 0.04);
  const b = Math.min(total, u.to + 0.12);
  inputs.push('-ss', a.toFixed(3), '-to', b.toFixed(3), '-i', take);
  const len = b - a;
  filters.push(
    `[${i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:d=0.01,afade=t=out:st=${(len - 0.06).toFixed(3)}:d=0.06,adelay=${Math.round((u.at - 0.04) * 1000)}|${Math.round((u.at - 0.04) * 1000)}[u${i}]`,
  );
});
filters.push(
  `${placed.map((_, i) => `[u${i}]`).join('')}amix=inputs=${placed.length}:normalize=0:dropout_transition=0,apad=whole_dur=${end},atrim=0:${end},loudnorm=I=-16:TP=-1.5:LRA=11[out]`,
);
fs.mkdirSync('public', {recursive: true});
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '192k', 'public/voiceover.mp3'], {stdio: 'inherit'});
console.log(`wrote public/voiceover.mp3 (${probeDur('public/voiceover.mp3').toFixed(2)} s)`);
