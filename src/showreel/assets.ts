import {staticFile} from 'remotion';

// The 13 screenshots, untouched, in public/assets/showreel/ (original names).
// All rectangles below are in SOURCE pixels of the respective file, measured
// from the screenshots, so overlays sit exactly on the real UI.

export type Img = {src: string; w: number; h: number};
export type Rect = {x: number; y: number; w: number; h: number};

const f = (name: string, w: number, h: number): Img => ({src: staticFile(`assets/showreel/${name}`), w, h});

const PHONE = {w: 780, h: 1688};
const DESK = {w: 2880, h: 1800};

export const IMG = {
  h01: f('Handy_01_Uebersicht.jpg', PHONE.w, PHONE.h),
  h02: f('Handy_02_KI_Assistent_Entwurf.jpg', PHONE.w, PHONE.h),
  h03: f('Handy_03_Aufmass_mit_Rechenweg.jpg', PHONE.w, PHONE.h),
  h04: f('Handy_04_Summe_vor_Ort_Unterschrift.jpg', PHONE.w, PHONE.h),
  h05: f('Handy_05_Baustellen_Modus.jpg', PHONE.w, PHONE.h),
  d01: f('01_Cockpit_Ueberblick.png', DESK.w, DESK.h),
  d02: f('02_Cashflow_Radar.png', DESK.w, DESK.h),
  d03: f('03_Befehlspalette_StrgK.png', DESK.w, DESK.h),
  d04: f('04_Dokumente_Archiv.png', DESK.w, DESK.h),
  d05: f('05_Angebot_mit_Live_PDF_Vorschau.png', DESK.w, DESK.h),
  d06: f('06_Fertiges_Angebot_PDF.png', 1786, 2526),
  d07: f('07_Pruefen_Raeume_Summen.png', DESK.w, DESK.h),
  d08: f('08_Auswertung.png', DESK.w, DESK.h),
} as const;

export const r = (x: number, y: number, w: number, h: number): Rect => ({x, y, w, h});
/** Rect from display coordinates of a 2000-wide preview (×1.44 → source). */
const d = (x: number, y: number, x2: number, y2: number): Rect => {
  const k = 1.44;
  return {x: Math.round(x * k), y: Math.round(y * k), w: Math.round((x2 - x) * k), h: Math.round((y2 - y) * k)};
};

// ---- Phone (780 × 1688) -----------------------------------------------------
export const H01 = {
  modeBtn: r(40, 275, 326, 70),
};

export const H05 = {
  modeBtn: r(40, 305, 422, 93),
  kpis: r(40, 440, 700, 198),
};

export const H02 = {
  bubble: r(124, 32, 616, 200),
  bubbleText: {x: 152, y: 52, size: 29, lineH: 40},
  bubbleLines: [
    'Wohnzimmer 5 mal 4, 2,60 hoch, zwei',
    'Fenster, eine Tür: Tapete runter,',
    'spachteln, grundieren, Wände und',
    'Decke streichen. Kunde Familie Muster.',
  ],
  reply: r(38, 250, 620, 208),
  card: r(38, 474, 704, 894),
  // Bands inside the card that slide in one by one
  cardBands: [
    r(44, 500, 692, 120), // ENTWURF ZUM PRÜFEN + Familie Muster
    r(44, 630, 692, 46), // Wohnzimmer
    r(44, 677, 692, 42), // Tapete entfernen
    r(44, 719, 692, 42), // Flächenspachtelung
    r(44, 761, 692, 42), // Grundierung Tiefgrund
    r(44, 803, 692, 42), // Anstrich Dispersion
    r(44, 845, 692, 44), // Anstrich Dispersion · Decke
    r(44, 896, 692, 66), // Netto laut Katalog
    r(44, 964, 692, 140), // hint text
    r(44, 1108, 692, 252), // buttons
  ],
  netto: r(78, 908, 440, 46),
  input: r(0, 1396, 780, 292),
};

export const H03 = {
  card1: r(66, 311, 648, 157),
  calcLine1: r(90, 380, 430, 32),
  calcLine2: r(90, 412, 420, 32),
  qty1: r(574, 352, 116, 40),
  cards: [r(66, 311, 648, 157), r(66, 485, 648, 157), r(66, 659, 648, 157), r(66, 833, 648, 157), r(66, 1007, 648, 125)],
};

export const H04 = {
  summe: r(40, 862, 700, 229),
  summeHead: r(40, 800, 700, 50),
  netto: r(66, 892, 650, 40),
  mwst: r(66, 942, 650, 40),
  brutto: r(66, 1012, 650, 58),
  bruttoValue: r(490, 1010, 226, 60),
  signBtn: r(40, 1115, 700, 96),
  handoverBtn: r(40, 1603, 700, 96),
};

// ---- Desktop (2880 × 1800) --------------------------------------------------
export const SIDEBAR_OFFLINE = d(48, 1080, 300, 1110);
export const KMARK_RECT = d(58, 34, 100, 66);

export const D01 = {
  title: d(526, 158, 806, 226),
  sub: d(526, 236, 1205, 268),
  kpis: [d(528, 377, 851, 548), d(874, 377, 1197, 548), d(1220, 377, 1543, 548), d(1566, 377, 1888, 548)],
  next: d(528, 610, 1312, 885),
};

export const D02 = {
  chart: d(528, 505, 1888, 866),
  plot: {x: 910, y: 848, w: 1775, h: 278},
  total: d(1610, 528, 1870, 572),
  overdue: d(550, 826, 870, 852),
};

// Smoothed trace of the cyan cashflow line (source px), KW 40 → KW 47.
export const CASHFLOW_LINE: Array<[number, number]> = [
  [910, 1122], [990, 1122], [1022, 1122], [1038, 1121], [1054, 1119], [1070, 1115], [1086, 1111],
  [1102, 1106], [1118, 1100], [1134, 1094], [1150, 1087], [1166, 1080], [1182, 1073], [1198, 1066],
  [1214, 1060], [1241, 1050], [1262, 1042], [1278, 1036], [1294, 1029], [1310, 1023], [1326, 1016],
  [1342, 1010], [1358, 1003], [1374, 997], [1390, 991], [1406, 985], [1422, 980], [1438, 975],
  [1463, 968], [1486, 961], [1502, 958], [1518, 955], [1534, 952], [1550, 950], [1566, 948],
  [1582, 946], [1598, 944], [1614, 943], [1630, 941], [1646, 940], [1685, 940], [1726, 939],
  [1790, 939], [1854, 939], [1918, 939], [1934, 938], [1950, 937], [1966, 935], [1982, 933],
  [1998, 931], [2014, 929], [2030, 926], [2046, 924], [2062, 922], [2078, 920], [2094, 919],
  [2110, 918], [2127, 917], [2200, 917], [2349, 917], [2570, 917], [2681, 917],
];
// The data points (KW 40 … KW 47) on that line.
export const CASHFLOW_DOTS: Array<[number, number]> = [
  [1021, 1122], [1241, 1050], [1463, 968], [1685, 940], [1905, 940], [2127, 917], [2349, 917], [2570, 917],
];

export const D03 = {
  palette: d(612, 176, 1388, 934),
  input: d(612, 176, 1388, 252),
  typed: d(636, 196, 700, 236),
  rows: [
    d(612, 262, 1388, 362), // Aktionen + Neue Rechnung
    d(612, 364, 1388, 462), // Seiten + Rechnung
    d(612, 466, 1388, 560), // Dokumente + RE-081
    d(612, 560, 1388, 618),
    d(612, 618, 1388, 677),
    d(612, 677, 1388, 736),
    d(612, 736, 1388, 795),
    d(612, 795, 1388, 878),
  ],
  footer: d(612, 878, 1388, 934),
};

export const D04 = {
  header: d(500, 90, 1900, 720),
  excel: d(528, 637, 1888, 705),
  summary: d(526, 588, 1295, 612),
  stats: d(1294, 170, 1888, 277),
};

export const D05 = {
  title: d(526, 158, 1000, 226),
  preview: d(1384, 94, 1966, 1106),
  pdfPage: d(1404, 176, 1946, 941),
  totals: d(456, 1128, 1960, 1225),
  stepper: d(528, 340, 1350, 400),
};

export const D07 = {
  header: d(460, 0, 1420, 76),
  checks: [
    {x: 1077 * 1.44, y: 38 * 1.44},
    {x: 1140 * 1.44, y: 38 * 1.44},
    {x: 1176 * 1.44, y: 38 * 1.44},
  ],
  checkR: 15 * 1.44,
  pruefen: d(528, 745, 1350, 1130),
  roomRow: d(530, 864, 1348, 930),
};

export const D08 = {
  header: d(500, 90, 1900, 700),
  umsatz: d(528, 518, 966, 690),
  rechnungen: d(989, 518, 1427, 690),
  zahldauer: d(1450, 518, 1888, 690),
  chart: d(528, 707, 1888, 1092),
};

export const PDF = {
  head: r(180, 180, 1460, 520),
  table: r(195, 798, 1032, 935),
};
