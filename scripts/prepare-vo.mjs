// Fits the ElevenLabs voiceover (public/reel/vo/source.mp3, all 13 lines in
// one take) onto the reel's 13 phases:
//   1. cuts each line out of the take (speech segments found with
//      ffmpeg silencedetect, mapped to the script lines below),
//   2. caps the pauses inside a line, speeds a line up by at most 8 % when
//      it would not fit its phase,
//   3. loudness-normalises every line,
//   4. writes public/reel/vo/P01.wav … P13.wav and src/reel/vo.json (start
//      frame + length of each line, used for placement and music ducking).
//   node scripts/prepare-vo.mjs
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/reel/vo/source.mp3';
const OUT = 'public/reel/vo';
const FPS = 30;
const BAR = 60;
const PHASE_BARS = [2, 3, 2, 3, 2, 2, 3, 2, 2, 2, 2, 2, 3]; // = src/reel/timeline.ts
const LOGO_AT = (1620 + 90) / FPS; // outro logo hit (global seconds)

// Speech segments of each line in source.mp3 (seconds), from
// `ffmpeg -af silencedetect=noise=-40dB:d=0.18`.
const LINES = [
  {text: 'Weniger Büro. Mehr Baustelle! Das ist Kavox.', segs: [[0.0, 1.02], [1.24, 2.58], [2.96, 4.07]]},
  {text: 'Im Cockpit siehst du sofort: offene Rechnungen, Überfälliges … und deinen Umsatz.', segs: [[4.42, 8.23], [8.5, 9.66]]},
  {text: 'Der Cashflow-Radar zeigt dir, wann das Geld kommt.', segs: [[9.98, 12.63]]},
  {text: 'Einfach sagen, was zu tun ist. Die KI baut das Angebot – mit deinen Preisen.', segs: [[12.95, 14.51], [14.82, 16.47], [16.68, 17.87]]},
  {text: 'Jeder Quadratmeter mit Rechenweg. Nachvollziehbar.', segs: [[18.17, 20.17], [20.48, 21.32]]},
  {text: 'Summe zeigen, unterschreiben lassen – direkt beim Kunden.', segs: [[21.61, 23.65], [23.85, 25.08]]},
  {text: 'Am Rechner landet jede Eingabe sofort im PDF. Live.', segs: [[25.35, 28.58], [28.9, 29.35]]},
  {text: 'Ein Klick – und dein Profi-Angebot ist fertig.', segs: [[29.68, 32.33]]},
  {text: 'Steuerung K … und alles ist sofort da.', segs: [[32.61, 33.71], [34.0, 35.71]]},
  {text: 'Jedes Dokument, jeder Status. Export als Excel inklusive.', segs: [[36.08, 37.0], [37.19, 38.17], [38.39, 40.18]]},
  {text: 'Deine Zahlen – klar und auf einen Blick.', segs: [[40.5, 41.22], [41.42, 42.9]]},
  // longest line for its 4 s slot: tighter pauses, starts right on the cut
  {text: 'Und draußen? [chuckles] Baustellen-Modus an. Lesbar, auch in der Sonne.', segs: [[43.22, 43.86], [44.13, 44.38], [44.66, 45.8], [46.1, 46.69], [46.94, 47.79]], maxGap: 0.12, lead: -0.02},
  {text: 'Läuft offline – deine Daten bleiben bei dir. Kavox. Jetzt testen!', segs: [[48.1, 48.92], [49.14, 50.55], [50.89, 51.62], [51.86, 52.86]], anchorSeg: 2},
];

const PAD_IN = 0.03; // keep consonant onsets
const PAD_OUT = 0.06; // keep breath tails
const MAX_GAP = 0.26; // longest pause kept inside a line
const LEAD = 0.12; // line starts this long after its phase cut
const TAIL = 0.22; // and ends at least this long before the next cut
const MAX_TEMPO = 1.08;

const ffmpeg = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], {stdio: 'inherit'});
const probe = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

let phaseStart = 0;
const manifest = [];
LINES.forEach((line, i) => {
  const dur = (PHASE_BARS[i] * BAR) / FPS;
  // segments with padding, pauses capped
  const parts = line.segs.map(([s, e]) => [Math.max(0, s - PAD_IN), e + PAD_OUT]);
  const gaps = parts.slice(1).map(([s], k) => Math.min(line.maxGap ?? MAX_GAP, Math.max(0.05, s - parts[k][1])));
  const natural = parts.reduce((a, [s, e]) => a + (e - s), 0) + gaps.reduce((a, g) => a + g, 0);
  const lead = line.lead ?? LEAD;
  const avail = dur - lead - TAIL;
  const tempo = Math.min(MAX_TEMPO, Math.max(1, natural / avail));
  const length = natural / tempo;

  // build: segment, silence, segment, …
  const inputs = [];
  const chains = [];
  parts.forEach(([s, e], k) => {
    chains.push(`[0:a]atrim=${s.toFixed(3)}:${e.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st=${(e - s - 0.02).toFixed(3)}:d=0.02[s${k}]`);
    if (k < gaps.length) chains.push(`anullsrc=r=44100:cl=mono,atrim=0:${gaps[k].toFixed(3)}[g${k}]`);
  });
  const order = parts.flatMap((_, k) => (k < gaps.length ? [`[s${k}]`, `[g${k}]`] : [`[s${k}]`])).join('');
  const n = parts.length + gaps.length;
  chains.push(`${order}concat=n=${n}:v=0:a=1,atempo=${tempo.toFixed(4)},loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000[out]`);
  const file = path.join(OUT, `P${String(i + 1).padStart(2, '0')}.wav`);
  ffmpeg(['-i', SRC, ...inputs, '-filter_complex', chains.join(';'), '-map', '[out]', '-ac', '1', '-c:a', 'pcm_s16le', file]);
  const real = probe(file);

  // placement (global seconds)
  let start = phaseStart + lead;
  if (line.anchorSeg !== undefined) {
    // land the anchored word (“Kavox.”) on the logo hit
    const before = parts.slice(0, line.anchorSeg).reduce((a, [s, e]) => a + (e - s), 0) + gaps.slice(0, line.anchorSeg).reduce((a, g) => a + g, 0);
    start = LOGO_AT - before / tempo - 0.04;
  }
  const end = start + real;
  manifest.push({
    file: path.basename(file),
    text: line.text,
    start: Math.round(start * FPS),
    frames: Math.ceil(real * FPS),
    tempo: Number(tempo.toFixed(3)),
  });
  const over = end - (phaseStart + dur);
  console.log(
    `${path.basename(file)}  ${start.toFixed(2)}–${end.toFixed(2)} s  (phase ${phaseStart.toFixed(0)}–${(phaseStart + dur).toFixed(0)}, ` +
      `tempo ${tempo.toFixed(3)}${over > 0 ? `, spills ${over.toFixed(2)} s` : ''})`,
  );
  phaseStart += dur;
});

// lines must never overlap
for (let i = 1; i < manifest.length; i++) {
  const prevEnd = manifest[i - 1].start + manifest[i - 1].frames;
  if (manifest[i].start < prevEnd + 3) throw new Error(`${manifest[i].file} overlaps ${manifest[i - 1].file}`);
}
fs.writeFileSync('src/reel/vo.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('src/reel/vo.json');
