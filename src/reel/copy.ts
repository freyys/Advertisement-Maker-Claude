// Every string and number in the showreel. The numbers come from the app
// screenshots and add up (see the comments).

export type Caption = {
  /** "01 — COCKPIT" style kicker; omitted for intro/outro. */
  no?: string;
  kicker: string;
  /** Headline lines; the final "." is rendered in the accent colour. */
  head: string[];
  sub?: string;
};

export const captions = {
  cockpit: {
    no: '01',
    kicker: 'Cockpit',
    head: ['Alles im Blick.'],
    sub: 'Offene Rechnungen, Überfälliges und Umsatz – auf einen Blick.',
  },
  cashflow: {
    no: '02',
    kicker: 'Cashflow-Radar',
    head: ['Wissen, wann', 'Geld kommt.'],
    sub: 'Erwartete Zahlungseingänge – Woche für Woche.',
  },
  assistant: {
    no: '03',
    kicker: 'KI-Assistent',
    head: ["Sag's einfach."],
    sub: 'Kavox baut das Angebot – mit Preisen aus deinem Katalog.',
  },
  aufmass: {
    no: '04',
    kicker: 'Aufmaß',
    head: ['Jeder m² mit', 'Rechenweg.'],
    sub: 'Wände, Fenster, Türen – nachvollziehbar gerechnet.',
  },
  vorOrt: {
    no: '05',
    kicker: 'Vor Ort',
    head: ['Unterschrift', 'beim Kunden.'],
    sub: 'Summe zeigen, unterschreiben lassen, fertig.',
  },
  angebot: {
    no: '06',
    kicker: 'Angebot',
    head: ['Live-Vorschau', 'beim Schreiben.'],
    sub: 'Jede Eingabe landet sofort im PDF.',
  },
  pdf: {
    no: '07',
    kicker: 'PDF',
    head: ['Profi-PDF', 'in Sekunden.'],
    sub: 'Saubere Tabelle, Zwischensummen, alle Angaben.',
  },
  palette: {
    no: '08',
    kicker: 'Befehlspalette',
    head: ['Alles mit', 'Strg + K.'],
    sub: 'Jede Rechnung, jede Seite, jede Aktion – sofort da.',
  },
  archiv: {
    no: '09',
    kicker: 'Archiv',
    head: ['Jedes Dokument.', 'Jeder Status.'],
    sub: 'Suchen, filtern – Rechnungsausgangsbuch als Excel.',
  },
  auswertung: {
    no: '10',
    kicker: 'Auswertung',
    head: ['Zahlen, die du', 'verstehst.'],
    sub: 'Umsatz, Rechnungen, Zahldauer – ohne Tabellenchaos.',
  },
  baustelle: {
    no: '11',
    kicker: 'Baustellen-Modus',
    head: ['Lesbar – auch', 'in der Sonne.'],
    sub: 'Ein Tipp: maximaler Kontrast für draußen.',
  },
} satisfies Record<string, Caption>;

export const intro = {
  line1: 'Weniger Büro.',
  line2: 'Mehr Baustelle.',
  sub: 'Angebote & Rechnungen für Handwerker.',
};

export const outro = {
  offline: 'Offline · Daten bleiben hier',
  head: ['Deine Daten.', 'Dein Rechner.'],
  tagline: 'Angebote & Rechnungen für Handwerker.',
  cta: 'Jetzt testen – Link in Bio',
  features: ['KI-Assistent', 'Aufmaß', 'Live-PDF', 'Cashflow', 'Strg + K', 'Offline'],
};

// ---- Desktop: Cockpit -------------------------------------------------------
export const cockpit = {
  pill: 'Überblick · Heute',
  title: 'Guten Tag',
  sub: 'Sonntag, 4. Oktober · 2 Dinge brauchen heute deine Aufmerksamkeit',
  stats: [
    {label: 'Offene Rechnungen', value: 8222.67, foot: '6 Rechnungen warten auf Geld', tone: 'yellow'},
    {label: 'Überfällig', value: 574.06, foot: '1 über dem Zahlungsziel', tone: 'rose'},
    {label: 'Umsatz Oktober', value: 4136.2, foot: 'zum September', trend: '8 %', tone: 'accent'},
    {label: 'Offene Angebote', value: 5029.0, foot: '3 ohne Antwort · netto', tone: 'accent'},
  ],
  next: [
    {title: 'Rechnung RE-2026-076 · Mustermann', sub: 'seit 6 Tagen überfällig · 574,06 €', tone: 'rose'},
    {title: 'Angebot AN-2026-036 · Hausverwaltung Muster GmbH', sub: 'seit 19 Tagen ohne Antwort · nachfassen', tone: 'yellow'},
  ],
  quick: ['Angebot schreiben', 'Rechnung schreiben', 'Kunde anlegen', 'Aufgabe notieren'],
  recent: [
    {title: 'Rechnung RE-2026-072', who: 'Praxis Muster', status: 'Bezahlt'},
    {title: 'Rechnung RE-2026-073', who: 'Beispiel', status: 'Bezahlt'},
    {title: 'Rechnung RE-2026-071', who: 'Mustermann', status: 'Bezahlt'},
    {title: 'Rechnung RE-2026-076', who: 'Mustermann', status: 'Überfällig'},
    {title: 'Angebot AN-2026-038', who: 'Musterfrau', status: 'Versendet'},
  ],
};

// ---- Desktop: Cashflow-Radar ------------------------------------------------
export const cashflow = {
  title: 'Erwartete Zahlungseingänge (brutto, aufsummiert)',
  total: 7648.61,
  until: 'bis So 22.11.',
  weeks: ['KW 40', 'KW 41', 'KW 42', 'KW 43', 'KW 44', 'KW 45', 'KW 46', 'KW 47'],
  // cumulative € per week
  values: [0, 2700, 5750, 6800, 6800, 7648.61, 7648.61, 7648.61],
  overdue: 'Dazu überfällig: 574,06 € (1 Rechnung)',
};

// ---- Desktop: Auswertung / Umsatz ---------------------------------------------
export const umsatz = {
  months: ['Nov', 'Dez', 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
  values: [0, 0, 0, 0, 0, 0, 620, 1700, 620, 2780, 3800, 4136.2],
  kpis: [
    {label: 'Umsatz netto', value: 13834.0, unit: '€', foot: 'Letzte 12 Monate'},
    {label: 'Rechnungen', value: 11, unit: '', foot: 'gestellt'},
    {label: 'Zahldauer', value: 11, unit: 'Tage', foot: 'im Schnitt bis „bezahlt“'},
  ],
};

// ---- Desktop: Befehlspalette --------------------------------------------------
export const palette = {
  query: 'Rech',
  action: 'Neue Rechnung',
  page: 'Rechnung',
  docs: [
    {no: 'RE-2026-081', who: 'Muster', status: 'Offen', sum: '842,52 €'},
    {no: 'RE-2026-080', who: 'Musterfrau', status: 'Offen', sum: '1.052,91 €'},
    {no: 'RE-2026-079', who: 'Hausverwaltung Muster GmbH', status: 'Offen', sum: '3.026,65 €'},
    {no: 'RE-2026-078', who: 'Beispiel', status: 'Offen', sum: '908,21 €'},
    {no: 'RE-2026-077', who: 'Praxis Muster', status: 'Offen', sum: '1.818,32 €'},
    {no: 'RE-2026-076', who: 'Mustermann', status: 'Überfällig', sum: '574,06 €'},
  ],
};

// ---- Desktop: Dokumente ---------------------------------------------------------
export const docs = {
  pill: 'Archiv · Nachweise',
  title: 'Dokumente',
  crumbs: ['Suchen', 'Status pflegen', 'weiterverarbeiten'],
  counters: [
    {label: 'Offen', value: 6, tone: 'yellow'},
    {label: 'Bezahlt', value: 5, tone: 'green'},
    {label: 'Angenommen', value: 0, tone: 'green'},
  ],
  types: ['Angebot', 'Rechnung', 'Abschlagsrechnung', 'Schlussrechnung'],
  states: ['Entwurf', 'Versendet', 'Angenommen', 'Abgelehnt', 'Abgerechnet', 'Offen', 'Bezahlt', 'Überfällig'],
  summary: '14 von 14 Dokumenten · davon 11 Rechnung(en) über 13.834,00 € netto (16.462,46 € brutto)',
  excel: 'Rechnungsausgangsbuch · 11 Rechnung(en) als Excel',
  month: 'Oktober 2026',
  monthMeta: '4 Dokumente · 3 Rechnungen',
  monthNet: '4.136,20 € netto',
  monthGross: '4.922,08 € brutto',
  rows: [
    {no: 'RE-2026-081', type: 'Rechnung', who: 'Muster', date: '2026-10-03', net: '708,00 €', status: 'Offen'},
    {no: 'RE-2026-080', type: 'Rechnung', who: 'Musterfrau', date: '2026-10-03', net: '884,80 €', status: 'Offen'},
    {no: 'AN-2026-041', type: 'Angebot', who: 'Muster', date: '2026-10-04', net: '2.434,50 €', status: 'Versendet'},
    {no: 'RE-2026-079', type: 'Rechnung', who: 'Hausverwaltung Muster GmbH', date: '2026-10-01', net: '2.543,40 €', status: 'Bezahlt'},
  ],
};

// ---- Desktop: Angebot erstellen --------------------------------------------------
export const angebot = {
  pill: 'Kalkulation · Angebote',
  title: 'Angebot erstellen',
  crumbs: ['Kunde', 'Räume', 'Leistungen', 'PDF'],
  steps: ['Kunde', 'Räume', 'Leistungen', 'Sonderpositionen', 'Prüfen'],
  customer: 'Muster',
  street: 'Lindenallee 4',
  city: '12345 Musterstadt',
  date: '04.10.2026',
  number: 'AN-2026-041',
  validUntil: '03.11.2026',
  netto: 2434.5,
  mwst: 462.56, // 2.434,50 × 19 %
  brutto: 2897.06,
};

// ---- PDF (Angebot) -----------------------------------------------------------------
export const doc = {
  company: 'Malerbetrieb Muster',
  sender: 'Malerbetrieb Muster · Werkstattweg 12 · 12345 Musterstadt',
  number: 'AN-2026-041',
  date: '04.10.2026',
  valid: '03.11.2026',
  to: ['Muster', 'Lindenallee 4', '12345 Musterstadt'],
  greeting: [
    'Sehr geehrte Familie Muster,',
    'Vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen folgendes Angebot für die gewünschten',
    'Malerarbeiten:',
  ],
  title1: 'Titel 1 · Wohnzimmer',
  title2: 'Titel 2 · Flur',
  rows: [
    {
      pos: '1.01',
      name: 'Abdeckarbeiten',
      desc: 'zu schützende Flächen wie Boden und Wandfliesen mit einer Abdeckfolie abdecken, Stöße fest verkleben und nach Gebrauch entsorgen',
      qty: '28',
      unit: 'm²',
      price: '4,20 €',
      total: 117.6,
    },
    {pos: '1.02', name: 'Tapete entfernen', desc: 'alte Tapete restlos entfernen und entsorgen', qty: '46', unit: 'm²', price: '8,90 €', total: 409.4},
    {
      pos: '1.03',
      name: 'Raufaser tapezieren',
      desc: 'Raufaser 52 zuschneiden und mit Kleister fachgerecht auf Stoß tapezieren',
      qty: '46',
      unit: 'm²',
      price: '7,30 €',
      total: 335.8,
    },
    {
      pos: '1.04',
      name: 'Anstrich Dispersion',
      desc: 'Grund- und Schlussbeschichtung mit einer Dispersionsfarbe NAK 2 matt, diffusionsoffen, umweltschonend. Farbton: weiß bis mittel getönt',
      qty: '64',
      unit: 'm²',
      price: '8,60 €',
      total: 550.4,
    },
    {
      pos: '1.05',
      name: 'Heizkörper groß',
      desc: 'Untergrund schleifen und entstauben. Zwischen- und Schlussbeschichtung mit einem Alkydharzlack seidenglänzend, umweltschonend, geruchsarm. Farbton: weiß oder leicht getönt',
      qty: '2',
      unit: 'St.',
      price: '65,00 €',
      total: 130.0,
    },
  ],
  subtotal: 1543.2, // 117,60 + 409,40 + 335,80 + 550,40 + 130,00
  footer: [
    'Werkstattweg 12, 12345 Musterstadt | Tel.: 0123 456789 | E-Mail: info@malerwerkstatt-beispiel.de',
    'Malerbetrieb Muster | Steuernr.: 12/345/67890 | Beispielbank · IBAN: DE00 1234 5678 9012 3456 78 | BIC: BEISPDE1XXX',
  ],
};

// ---- Phone: KI-Assistent / Aufmaß / Summe vor Ort ----------------------------------
export const dictation =
  'Wohnzimmer 5 mal 4, 2,60 hoch, zwei Fenster, eine Tür: Tapete runter, spachteln, grundieren, Wände und Decke streichen. Kunde Familie Muster.';

export const reply = 'Fertig für Familie Muster: das Wohnzimmer, 5 Positionen. Netto laut deinem Katalog 1.463,62 Euro. Bitte kurz prüfen.';

// Wall area: (5 + 4) × 2 × 2,60 − 2 × 1,25 × 1,20 − 1 × 2 = 41,8 m²; ceiling 5 × 4 = 20 m²
export const WALL = 41.8;
export const positions = [
  {name: 'Tapete entfernen', qty: WALL, unit: 'm²', price: 8.9, calc: 'wall'},
  {name: 'Flächenspachtelung', qty: WALL, unit: 'm²', price: 10.2, calc: 'wall'},
  {name: 'Grundierung Tiefgrund', qty: WALL, unit: 'm²', price: 3.2, calc: 'wall'},
  {name: 'Anstrich Dispersion', qty: WALL, unit: 'm²', price: 8.6, calc: 'wall'},
  {name: 'Anstrich Dispersion · Decke', qty: 20, unit: 'm²', price: 8.6, calc: 'ceiling'},
] as const;

export const posTotal = (p: (typeof positions)[number]) => Math.round(p.qty * p.price * 100) / 100;
export const NETTO = 1463.62; // 372,02 + 426,36 + 133,76 + 359,48 + 172,00
export const MWST = 278.09;
export const BRUTTO = 1741.71;

export const calcWall = ['18 × 2,6 m Wände (Umfang × Höhe) –', '1,25 × 1,2 m (2×) Fenster – 1 × 2 m Tür'];
export const calcCeiling = '5 × 4 m Decke · Decke';
export const formula = '18 × 2,6 − 2 × 1,5 − 2 = 41,8 m²';

// ---- Phone: Übersicht -----------------------------------------------------------------
export const overview = {
  pill: 'Überblick · Heute',
  title: 'Übersicht',
  sub: 'Beispiel Malerbetrieb (Vorschau)',
  offen: {value: '3.007,61 €', foot: '2 Rechnungen'},
  over: {value: '1.751,80 €', foot: '1 Rechnung'},
  invoices: [
    {no: 'RE-2026-018', who: 'Familie Muster', note: 'seit 9 Tagen überfällig', sum: '1.751,80 €', status: 'Überfällig'},
    {no: 'RE-2026-019', who: 'Herr Mustermann', note: 'fällig in 8 Tagen', sum: '1.255,81 €', status: 'Offen'},
  ],
  offers: [
    {no: 'ANG-2026-041', who: 'Hausverwaltung Muster GmbH', note: 'Angebot · 15.09.2026', sum: '7.621,95 €', status: 'Versendet'},
    {no: 'ANG-2026-044', who: 'Familie Beispiel', note: 'Angebot · 02.10.2026', sum: '624,51 €', status: 'Entwurf'},
  ],
};
