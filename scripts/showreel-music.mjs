// Synthesises the showreel's ambient music bed (royalty-free, generated from
// scratch with ffmpeg) into public/music.mp3. The film ducks it under the voice.
//   node scripts/showreel-music.mjs [seconds]
import {execFileSync} from 'node:child_process';

const LEN = Number(process.argv[2] ?? 100);
const CHORD = 8; // seconds per chord
const FADE = 3; // crossfade between chords

// Am9 → Fmaj7 → Cmaj7 → G6, voiced low and open
const CHORDS = [
  [110.0, 164.81, 196.0, 246.94, 261.63],
  [87.31, 130.81, 164.81, 220.0, 261.63],
  [130.81, 196.0, 246.94, 329.63],
  [98.0, 146.83, 164.81, 246.94],
];

const voice = (freqs, detune) =>
  freqs
    .map((f) => {
      const g = (0.9 / freqs.length).toFixed(4);
      // two slightly detuned sines + a soft octave, slow tremolo per note
      return `${g}*(0.55*sin(2*PI*${f}*t)+0.45*sin(2*PI*${(f * detune).toFixed(3)}*t)+0.12*sin(2*PI*${(f * 2).toFixed(2)}*t))*(0.86+0.14*sin(2*PI*${(0.07 + f / 4000).toFixed(4)}*t))`;
    })
    .join('+');

const n = Math.ceil(LEN / (CHORD - FADE)) + 1;
const inputs = [];
for (let i = 0; i < n; i++) {
  const c = CHORDS[i % CHORDS.length];
  inputs.push('-f', 'lavfi', '-i', `aevalsrc=${voice(c, 1.0035)}|${voice(c, 0.9968)}:s=44100:d=${CHORD}`);
}

let chain = `[0:a]afade=t=in:d=${FADE}[c0]`;
for (let i = 1; i < n; i++) chain += `;[c${i - 1}][${i}:a]acrossfade=d=${FADE}:c1=qsin:c2=qsin[c${i}]`;
chain +=
  `;[c${n - 1}]atrim=0:${LEN},lowpass=f=1500,aecho=0.8:0.6:70|130:0.22|0.14,afade=t=out:st=${LEN - 4}:d=4,loudnorm=I=-20:TP=-3:LRA=7[out]`;

execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', chain, '-map', '[out]', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '160k', 'public/music.mp3'], {
  stdio: 'inherit',
});
console.log(`wrote public/music.mp3 (${LEN} s)`);
