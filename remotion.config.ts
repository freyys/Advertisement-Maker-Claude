import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

// Final delivery: H.264, CRF 16, yuv420p
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
// Tag + convert to BT.709 limited range (otherwise the JPEG frames come out
// as full-range yuvj420p, which some platforms display washed out).
Config.setColorSpace('bt709');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(null);

// Use a locally installed headless Chromium when one is available (cloud /
// offline machines). Otherwise Remotion downloads its own.
const localShell =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}
