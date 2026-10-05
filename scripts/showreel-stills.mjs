// Showreel stills and contact sheets from one bundle.
//
//   node scripts/showreel-stills.mjs contact <compId> [out.png] [pos]
//        one still per shot (pos = 0..1 inside the shot, default 0.6),
//        tiled into a contact sheet
//   node scripts/showreel-stills.mjs frames <compId> <frame> [frame...]
//        single stills into out/stills/
//
// SCALE (default 0.5) sets the still resolution.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [mode = 'contact', compId = 'KavoxShowreel-16x9', ...rest] = process.argv.slice(2);
const shell = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(shell) ? shell : null;
const scale = Number(process.env.SCALE ?? 0.5);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});

if (mode === 'frames') {
  const outDir = path.resolve(process.env.OUT ?? 'out/stills');
  fs.mkdirSync(outDir, {recursive: true});
  for (const f of rest.map(Number)) {
    const output = path.join(outDir, `${compId}-${String(f).padStart(4, '0')}.png`);
    await renderStill({composition, serveUrl, output, frame: f, browserExecutable, scale});
    console.log(output);
  }
} else {
  const {TIMED_SHOTS} = await import('../src/showreel/timeline.ts');
  const out = path.resolve(rest[0] ?? 'out/contactsheet.png');
  const pos = Number(rest[1] ?? 0.6);
  const tmp = path.resolve('out/.contact');
  fs.rmSync(tmp, {recursive: true, force: true});
  fs.mkdirSync(tmp, {recursive: true});
  let i = 0;
  for (const s of TIMED_SHOTS) {
    const frame = Math.min(s.from + s.dur - 1, Math.round(s.from + s.dur * pos));
    const output = path.join(tmp, `${String(i++).padStart(2, '0')}.png`);
    await renderStill({composition, serveUrl, output, frame, browserExecutable, scale});
    console.log(s.id, frame);
  }
  const vertical = composition.height > composition.width;
  const cols = vertical ? 7 : 4;
  const rows = Math.ceil(TIMED_SHOTS.length / cols);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(tmp, '%02d.png'),
    '-vf', `tile=${cols}x${rows}:padding=10:margin=10:color=0x07090C`, '-frames:v', '1', '-update', '1', out,
  ]);
  console.log(out);
}
