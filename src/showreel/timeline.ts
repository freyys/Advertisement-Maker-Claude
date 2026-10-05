// Kavox showreel: every cut and sync point lives in this file.
//
// Two ways to sync the film to a recorded voiceover:
//   a) Automatic: `node scripts/showreel-voice.mjs sync <take.mp3>` measures the
//      take, writes src/showreel/vo-sync.ts (cut times, beats, cues, end) and
//      builds public/voiceover.mp3. Values in vo-sync.ts override the defaults
//      below.
//   b) By hand: set VO_SYNC to null in vo-sync.ts, then move each shot's `at`
//      (seconds) to where its voice line starts, fine-tune BEATS (seconds after
//      the shot start), and raise END if the voice runs longer than 75 s.

import {VO_SYNC} from './vo-sync.ts';

export const FPS = 30;

/** Seconds → frames. */
export const sec = (s: number) => Math.round(s * FPS);

export type ShotId =
  | 'intro'
  | 'nacht'
  | 'baustelle'
  | 'sagen'
  | 'rechenweg'
  | 'unterschrift'
  | 'uebergabe'
  | 'pruefen'
  | 'cockpit'
  | 'cashflow'
  | 'befehl'
  | 'archiv'
  | 'outro';

export type Shot = {
  id: ShotId;
  /** Start time in seconds. */
  at: number;
  /** On-screen caption (German). The final "." becomes the cyan brand dot. */
  caption: string | null;
  /** Which voiceover line this shot carries (see VO_CUES). */
  vo: number | null;
};

// The 13 shots of the shot list. Cuts are synced to the start of each voice line.
const DEFAULT_SHOTS: readonly Shot[] = [
  {id: 'intro', at: 0, caption: null, vo: null},
  {id: 'nacht', at: 5, caption: '22:47 Uhr. Noch drei Angebote.', vo: 1},
  {id: 'baustelle', at: 11, caption: 'Direkt auf der Baustelle.', vo: 2},
  {id: 'sagen', at: 17, caption: 'Sagen. Fertig.', vo: 3},
  {id: 'rechenweg', at: 27, caption: 'Jeder Rechenweg sichtbar.', vo: 4},
  {id: 'unterschrift', at: 33, caption: 'Unterschrift vor Ort.', vo: 5},
  {id: 'uebergabe', at: 39, caption: null, vo: 6},
  {id: 'pruefen', at: 44, caption: 'Geprüft. Gesendet.', vo: 6},
  {id: 'cockpit', at: 50, caption: 'Dein Tag auf einen Blick.', vo: 7},
  {id: 'cashflow', at: 56, caption: 'Du weißt, was reinkommt.', vo: 7},
  {id: 'befehl', at: 61, caption: 'Strg + K.', vo: 8},
  {id: 'archiv', at: 65, caption: 'Alles. Sauber. Im Griff.', vo: 9},
  {id: 'outro', at: 69, caption: 'Angebote, die sich selbst schreiben.', vo: 10},
];

export const SHOTS: readonly Shot[] = DEFAULT_SHOTS.map((s) => ({...s, at: VO_SYNC?.shots[s.id] ?? s.at}));

/** End of the film in seconds. */
export const END = VO_SYNC?.end ?? 75;
export const DURATION = sec(END);

export type ShotTiming = Shot & {from: number; dur: number};

export const TIMED_SHOTS: ShotTiming[] = SHOTS.map((s, i) => {
  const from = sec(s.at);
  const to = i < SHOTS.length - 1 ? sec(SHOTS[i + 1].at) : DURATION;
  return {...s, from, dur: to - from};
});

export const shot = (id: ShotId): ShotTiming => {
  const s = TIMED_SHOTS.find((t) => t.id === id);
  if (!s) throw new Error(`Unknown shot ${id}`);
  return s;
};

/** Frames of every hard cut (used for the chromatic-aberration hit). */
export const CUTS: number[] = TIMED_SHOTS.slice(1).map((s) => s.from);

// ---- Voiceover --------------------------------------------------------------
// Where each line of voiceover/kavox_voiceover_elevenlabs.txt should START
// (seconds, absolute). Estimated for a calm German narrator at ~2.4 words/s.
// `len` is the estimate of how long the line runs; it only drives the music
// ducking. Replace both with the real values after recording.
export type VoCue = {line: number; at: number; len: number; text: string};

const DEFAULT_CUES: readonly VoCue[] = [
  {line: 1, at: 5.3, len: 5.6, text: 'Kennst du das? Feierabend… und auf dem Küchentisch warten noch drei Angebote.'},
  {line: 2, at: 11.6, len: 3.4, text: 'Was wäre, wenn du sie einfach… sagst?'},
  {line: 3, at: 17.3, len: 6.6, text: 'Wohnzimmer, fünf mal vier, zwei sechzig hoch. Tapete runter, spachteln, streichen. Fertig.'},
  {line: 4, at: 27.3, len: 5.6, text: 'Kavox rechnet die Flächen, zieht Fenster und Tür ab – und zeigt dir jeden Rechenweg. Kein Rätselraten mehr.'},
  {line: 5, at: 33.3, len: 5.4, text: 'Die Summe steht, noch bevor du die Leiter einpackst. Der Kunde unterschreibt direkt vor Ort.'},
  {line: 6, at: 39.4, len: 9.8, text: 'Ein Tipp – und alles liegt am Rechner. Automatisch geprüft. Als sauberes PDF. Raus damit.'},
  {line: 7, at: 50.3, len: 9.6, text: 'Morgens siehst du sofort, was offen ist… was überfällig ist… und was diese Woche reinkommt.'},
  {line: 8, at: 61.2, len: 3.6, text: 'Steuerkreuz? Nein – Strg plus K. Alles in einer Sekunde gefunden.'},
  {line: 9, at: 65.2, len: 3.7, text: 'Umsatz. Zahlungsdauer. Rechnungsausgangsbuch als Excel. Alles im Griff.'},
  {line: 10, at: 69.4, len: 3.2, text: 'Und das Beste? Deine Daten bleiben bei dir. Offline.'},
  {line: 11, at: 72.6, len: 2.2, text: 'Kavox. Angebote, die sich selbst schreiben.'},
];

export const VO_CUES: readonly VoCue[] = DEFAULT_CUES.map((c) => {
  const m = VO_SYNC?.cues.find((x) => x.line === c.line);
  return m ? {...c, at: m.at, len: m.len} : c;
});

/** Where the voiceover file starts on the timeline (seconds). */
export const VO_OFFSET = 0;

// ---- In-shot beats (seconds after the shot's start) ------------------------
const DEFAULT_BEATS = {
  intro: {dot: 0.35, pulse1: 1.0, pulse2: 1.8, mark: 2.5, push: 4.4},
  nacht: {lamp: 0.2, papers: 0.7, paperEvery: 0.35, clock: 0.4, headline: 1.1, line2: 2.1},
  baustelle: {stripes: 0, headline: 0.8, tap: 2.6, flare: 2.75},
  sagen: {typeStart: 0.35, typeEnd: 5.3, reply: 5.5, card: 5.9, rowEvery: 0.2, count: 7.4, fertig: 6.6, pan: 5.6, panEnd: 7.2},
  rechenweg: {zoom: 0.2, lift: 1.3, line1: 1.7, line2: 2.5, line3: 3.1, result: 3.7},
  unterschrift: {count: 0.5, countEnd: 2.4, pulse: 3.0},
  uebergabe: {tap: 0.8, fly: 1.15, land: 2.15, settle: 2.9},
  pruefen: {check1: 0.35, checkEvery: 0.38, pan: 1.6, sweep: 2.3, pdf: 3.0, stripes: 3.5, send: 5.27},
  cockpit: {type: 0.25, cards: 0.75, cardEvery: 0.16, offen: 2.4, ueberfaellig: 3.3},
  cashflow: {draw: 0.25, drawEnd: 3.3},
  befehl: {keys: 0.1, press: 0.45, palette: 0.85, type: 1.25, typeEvery: 0.12, rows: 1.6},
  archiv: {left: 0, right: 0.15, count: 0.2, countEnd: 1.4, zahldauer: 1.0, excel: 1.6, griff: 2.3},
  outro: {offline: 0.3, collapse: 3.2, logo: 3.5, tagline: 4.2},
};

export type Beats = typeof DEFAULT_BEATS;

export const BEATS: Beats = Object.fromEntries(
  Object.entries(DEFAULT_BEATS).map(([id, b]) => [id, {...b, ...(VO_SYNC?.beats[id] ?? {})}]),
) as Beats;

/** Cuts inside a shot (they get the same chromatic hit as the shot cuts). */
export const INNER_CUTS: number[] = [sec(SHOTS.find((s) => s.id === 'pruefen')!.at + BEATS.pruefen.pdf)];

/** A beat in frames, relative to the shot start. */
export const beat = <S extends ShotId>(id: S, key: keyof Beats[S]) =>
  sec(BEATS[id][key] as unknown as number);
