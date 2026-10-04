// Cuts the master render into one clip per phase, frame-accurately, using
// the phase list in src/reel/timeline.ts.
//   node scripts/cut-phases.mjs [in=out/reel/kavox-reel-full.mp4] [outDir=out/reel/phases]
// Every phase is also its own Remotion composition (KavoxReel-P01-Intro …) if
// you prefer to render them individually.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [input = 'out/reel/kavox-reel-full.mp4', outDir = 'out/reel/phases'] = process.argv.slice(2);
const FPS = 30;
const src = fs.readFileSync('src/reel/timeline.ts', 'utf8');
const BAR = Number(src.match(/export const BAR = (\d+)/)[1]);
const phases = [...src.matchAll(/id: '([^']+)', dur: (\d+) \* BAR/g)].map((m) => ({id: m[1], dur: Number(m[2]) * BAR}));
if (!phases.length) throw new Error('No phases found in src/reel/timeline.ts');
fs.mkdirSync(outDir, {recursive: true});

let start = 0;
for (const p of phases) {
  const out = path.join(outDir, `kavox-reel-${p.id}.mp4`);
  const ss = (start / FPS).toFixed(4);
  const t = (p.dur / FPS).toFixed(4);
  const fadeOut = (p.dur / FPS - 0.08).toFixed(4);
  execFileSync(
    'ffmpeg',
    [
      '-v', 'error', '-y',
      '-ss', ss, '-i', input, '-t', t,
      '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
      '-af', `afade=t=in:d=0.04,afade=t=out:st=${fadeOut}:d=0.08`,
      '-c:a', 'aac', '-b:a', '320k',
      '-movflags', '+faststart',
      out,
    ],
    {stdio: 'inherit'},
  );
  console.log(`${out}  (${p.dur} frames, from ${start})`);
  start += p.dur;
}
