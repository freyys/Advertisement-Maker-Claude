// Render preview stills from one bundle: node scripts/stills.mjs <compId> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [compId = 'KavoxTeaser-Screen', ...frames] = process.argv.slice(2);
const shell = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(shell) ? shell : null;
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const inputProps = process.env.PROPS ? JSON.parse(process.env.PROPS) : {};
const composition = await selectComposition({serveUrl, id: compId, browserExecutable, inputProps});
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `${compId}-${String(f).padStart(3, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame: f, browserExecutable, inputProps, scale: Number(process.env.SCALE ?? 0.5)});
  console.log(output);
}
