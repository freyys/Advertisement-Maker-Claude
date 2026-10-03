// "KavoxStory": the slower, step-by-step cut (30 fps, ~31 s).
// Every beat is an absolute frame. Retime by editing this file only.
export const FPS = 30;
export const DURATION = 930;

export const CHAPTERS = {
  intro: {start: 0, end: 96},
  sagen: {start: 96, end: 282},
  rechnen: {start: 282, end: 432},
  aendern: {start: 432, end: 570},
  pruefen: {start: 570, end: 738},
  uebergeben: {start: 738, end: 852},
  end: {start: 852, end: DURATION},
} as const;

export type ChapterKey = keyof typeof CHAPTERS;

// Intro: icon → phone container transform
export const INTRO = {
  iconIn: 8,
  kDraw: 14,
  morphStart: 52,
  morphEnd: 88,
  contentIn: 72,
};

// 01 Sagen: dictation, send, agent steps
export const SAGEN = {
  focus: 112,
  dictateStart: 120,
  dictateEnd: 210,
  send: 220,
  sendMorphEnd: 244,
  status: 240,
  stepsStart: 248,
  stepEvery: 13,
  checkAfter: 10,
};

// 02 Rechnen: reply + draft card
export const RECHNEN = {
  reply: 288,
  card: 300,
  cardEnd: 322,
  rowsStart: 312,
  rowEvery: 9,
  tail: 350,
  scroll: [300, 344] as const,
};

// 03 Ändern: "Die Decke auch streichen." flies into the card
export const AENDERN = {
  scrollDown: [434, 460] as const,
  focus: 440,
  dictateStart: 448,
  dictateEnd: 480,
  send: 490,
  flyEnd: 522,
  rowOpen: [490, 508] as const,
  netto: [518, 544] as const,
  reply: 524,
};

// 04 Prüfen: tap → Aufmaß, scroll through, tap "An den Rechner übergeben"
export const PRUEFEN = {
  scrollToButton: [572, 592] as const,
  tap: 600,
  morph: [606, 640] as const,
  content: [612, 628] as const,
  scroll1: [650, 676] as const, // to positions
  scroll2: [690, 716] as const, // to Summe + buttons
  tapSend: 728,
};

// 05 Übergeben: button → document chip → A4 Angebot
export const UEBERGEBEN = {
  chip: [732, 746] as const,
  fly: [746, 768] as const,
  unfold: [766, 790] as const,
  paperContent: [774, 790] as const,
  rowsStart: 786,
  rowEvery: 4,
  count: [790, 822] as const,
  pill: 824,
  phoneBack: [736, 772] as const,
};

// End: paper → app icon → wordmark
export const END = {
  gather: [852, 874] as const,
  kIn: [864, 878] as const,
  unpack: [876, 898] as const,
  wallpaper: [858, 896] as const,
  tagline1: 890,
  tagline2: 896,
  holdFrom: DURATION - 22,
};
