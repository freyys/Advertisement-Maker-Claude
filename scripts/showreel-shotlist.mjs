// Writes SHOTLIST.md from src/showreel/timeline.ts (run again after retiming):
//   node scripts/showreel-shotlist.mjs
import fs from 'node:fs';

const {TIMED_SHOTS, VO_CUES, BEATS, FPS, DURATION, END} = await import('../src/showreel/timeline.ts');

const VISUAL = {
  intro: 'Black. A cyan dot breathes twice (pulse rings), a cyan/violet light leak drifts past, the K mark draws on and the dot becomes its full stop. Push through into the next shot.',
  nacht: 'Kitchen table at night, shapes and type only: a desk lamp flickers on, three quotes drop onto the table one by one, the clock rolls from 22:46 to 22:47.',
  baustelle: 'PDF-stripe transition (red/green/blue). iPhone in 3D with Handy_01. A tap on "Baustellen-Modus" makes the button flare, the screen switches to the high-contrast Handy_05 and a sunlight streak crosses the frame.',
  sagen: 'Hero, Handy_02. A cyan voice waveform; the blue request bubble types itself letter by letter, then the AI reply and the "Entwurf zum Prüfen" card slide up row by row. "Netto laut Katalog" gets highlighted and a callout counts up to 1.463,62 €.',
  rechenweg: 'Handy_03: dolly into the first position. The calculation lifts off the screen as a glass panel; each step lights up cyan in sync (18 × 2,6 m → – Fenster → – Tür) and resolves to = 41,8 m², mirrored by highlights on the phone.',
  unterschrift: 'Handy_04: Netto and MwSt flash, then Brutto counts up in place and in a callout to 1.741,71 €. The "Kunde unterschreibt vor Ort" button pulses (rings + light sweep).',
  uebergabe: 'Tap on "An den Rechner übergeben". The phone shrinks into the cyan brand dot and flies into the MacBook as it rises; the screen opens from the landing point (ring + flash) on 05_Angebot with the live PDF preview, light sweep across the preview.',
  pruefen: '07_Pruefen on a floating display: the three stepper checks pop one by one, then pan to "05 – Prüfen" with a sweep over "Wohnzimmer · 5 Position(en) · Zwischensumme 1.543,20 €". Cut: the finished PDF AN-2026-041 falls onto the desk in 3D, its corner stripes draw in, then it flies out ("Gesendet").',
  cockpit: '01_Cockpit in the MacBook, dolly into the KPI row. "Guten Tag" types itself, the cyan dot pops; the four KPI cards fly in staggered. "Offene Rechnungen" glows yellow and "Überfällig" red as the voice names them. (9:16: header on top, KPI cards as a 2 × 2 grid.)',
  cashflow: '02_Cashflow chart: the cyan line draws itself from KW 40 to KW 47 with a glowing tip, revealing the original chart behind it; the total counts up in place to 7.648,61 € (bis So 22.11.).',
  befehl: 'Keycaps Strg + K go down in 3D with a cyan underglow. The command palette opens over the dimmed cockpit, "Rech" types itself, the results fall into place, light sweep on "Neue Rechnung".',
  archiv: 'Split screen: 04_Dokumente and 08_Auswertung slide in from both sides. Umsatz netto, then Zahldauer, then "Rechnungsausgangsbuch · 11 Rechnung(en) als Excel" light up in voice order; callout counts to 13.834,00 €.',
  outro: 'Stripe transition to black. "Offline · Daten bleiben hier" with the pulsing green sidebar dot. The text dissolves, the dot turns cyan and lands as the full stop of the Kavox wordmark; tagline below. The last 20 frames hold still.',
};

const ON_SCREEN = {
  intro: '—',
  outro: '„Offline · Daten bleiben hier" → „Kavox." / „Angebote, die sich selbst schreiben."',
};

const tc = (frames) => {
  const s = frames / FPS;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ff = Math.round(frames % FPS);
  return `${m}:${String(sec).padStart(2, '0')}.${String(ff).padStart(2, '0')}`;
};

let md = `# Kavox Showreel: Shot List\n\n`;
md += `Generated from \`src/showreel/timeline.ts\` by \`node scripts/showreel-shotlist.mjs\`. Timecodes are m:ss.ff at ${FPS} fps. `;
md += `Total ${END} s (${DURATION} frames). The 9:16 cut uses the same timing.\n\n`;
md += `| # | In | Out | Frames | Visual | On-screen text | VO line |\n|---|---|---|---|---|---|---|\n`;
TIMED_SHOTS.forEach((s, i) => {
  const text = ON_SCREEN[s.id] ?? (s.caption ? `„${s.caption}"` : '—');
  md += `| ${i + 1} | ${tc(s.from)} | ${tc(s.from + s.dur)} | ${s.from}–${s.from + s.dur - 1} | ${VISUAL[s.id]} | ${text} | ${s.vo ?? '—'} |\n`;
});

md += `\n## Voiceover cues\n\nWhere each line of \`voiceover/kavox_voiceover_elevenlabs.txt\` is expected to start (estimates until the real recording exists).\n\n`;
md += `| Line | Starts | Est. length | Text |\n|---|---|---|---|\n`;
for (const c of VO_CUES) md += `| ${c.line} | ${tc(Math.round(c.at * FPS))} | ${c.len.toFixed(1)} s | ${c.text} |\n`;

md += `\n## In-shot beats\n\nSeconds after the start of the shot (edit \`BEATS\` in the timeline).\n\n`;
for (const s of TIMED_SHOTS) {
  const b = BEATS[s.id];
  md += `- **${s.id}**: ${Object.entries(b).map(([k, v]) => (k.endsWith('Every') ? `${k} ${v} s (interval)` : `${k} ${v} s (${tc(s.from + Math.round(v * FPS))})`)).join(', ')}\n`;
}

fs.writeFileSync('SHOTLIST.md', md);
console.log('SHOTLIST.md written');
