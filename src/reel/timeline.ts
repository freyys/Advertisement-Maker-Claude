// Phase list for "KavoxReel". The music bed runs at 120 BPM, so one bar is
// 60 frames @ 30 fps; every phase is a whole number of bars and every cut
// lands on a downbeat.
export const FPS = 30;
export const BEAT = 15;
export const BAR = 60;

export const PHASES = [
  {key: 'intro', id: 'P01-Intro', dur: 2 * BAR},
  {key: 'cockpit', id: 'P02-Cockpit', dur: 3 * BAR},
  {key: 'cashflow', id: 'P03-Cashflow', dur: 2 * BAR},
  {key: 'assistant', id: 'P04-KI-Assistent', dur: 3 * BAR},
  {key: 'aufmass', id: 'P05-Aufmass', dur: 2 * BAR},
  {key: 'vorOrt', id: 'P06-Vor-Ort', dur: 2 * BAR},
  {key: 'angebot', id: 'P07-Angebot-Live-PDF', dur: 3 * BAR},
  {key: 'pdf', id: 'P08-PDF', dur: 2 * BAR},
  {key: 'palette', id: 'P09-Strg-K', dur: 2 * BAR},
  {key: 'archiv', id: 'P10-Dokumente', dur: 2 * BAR},
  {key: 'auswertung', id: 'P11-Auswertung', dur: 2 * BAR},
  {key: 'baustelle', id: 'P12-Baustellen-Modus', dur: 2 * BAR},
  {key: 'outro', id: 'P13-Outro', dur: 3 * BAR},
] as const;

export type PhaseKey = (typeof PHASES)[number]['key'];

export const START: Record<PhaseKey, number> = PHASES.reduce(
  (acc, p, i) => ({...acc, [p.key]: i === 0 ? 0 : acc[PHASES[i - 1].key] + PHASES[i - 1].dur}),
  {} as Record<PhaseKey, number>,
);

export const TOTAL = PHASES.reduce((a, p) => a + p.dur, 0);

/** Outro beats (local frames): the logo lands on a downbeat. */
export const OUTRO = {logo: 90, holdFrom: 150};
