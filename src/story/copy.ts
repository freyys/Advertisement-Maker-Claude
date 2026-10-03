// Copy + numbers for "KavoxStory". Multi-line texts are stored as explicit
// lines so morphs between elements keep identical line breaks.
import type {Position} from '../copy';

export const customer = 'Familie Becker';

export type Caption = {label: string; lines: string[]; sub?: string};

export const captions: Record<'intro' | 'sagen' | 'rechnen' | 'aendern' | 'pruefen' | 'uebergeben', Caption> = {
  intro: {label: 'BALD IN KAVOX', lines: ['Das Angebot –', 'einfach gesagt.']},
  sagen: {
    label: '01 — SAGEN',
    lines: ['Einfach sagen,', 'was gemacht wird.'],
    sub: 'Raum, Maße, Arbeiten – wie mit einem Kollegen.',
  },
  rechnen: {
    label: '02 — RECHNEN',
    lines: ['Kavox rechnet', 'Mengen & Preise.'],
    sub: 'Aus deinen Raummaßen und deinem Katalog.',
  },
  aendern: {
    label: '03 — ÄNDERN',
    lines: ['Was fehlt?', 'Einfach dazusagen.'],
    sub: '„Die Decke auch streichen.“',
  },
  pruefen: {
    label: '04 — PRÜFEN',
    lines: ['Prüfen und als', 'Aufmaß übernehmen.'],
    sub: 'Mengen, Preise, Positionen – alles bleibt änderbar.',
  },
  uebergeben: {
    label: '05 — ÜBERGEBEN',
    lines: ['An den Rechner –', 'das Angebot steht.'],
    sub: 'Die KI läuft lokal auf deinem Laptop.',
  },
};

export const assistant = {
  pill: 'KI · LOKAL AUF DEM LAPTOP',
  title: 'Assistent',
  status: 'Bereit · läuft lokal auf dem Laptop',
  readAloud: 'Antworten vorlesen',
  hint: ['Tipp unten ins Feld und dann aufs Mikrofon', 'der Tastatur – einfach sprechen wie mit', 'einem Kollegen.'],
  placeholder: 'Was soll ins Angebot? (Mikrofon)',
  placeholderAfter: 'Ändern? z. B. „Bad 3 × 2 dazu“',
  working: 'Kavox schreibt den Entwurf … (10–20 s)',
};

export const message1 = [
  'Wohnzimmer 5 mal 4, 2,60 hoch, zwei',
  'Fenster, eine Tür: Tapete runter,',
  'spachteln, grundieren, Wände',
  'streichen. Kunde Familie Becker.',
];

export const message2 = ['Die Decke auch streichen.'];

export const steps = [
  {label: 'Raummaße erkannt', detail: '5 × 4 m, 2,60 m'},
  {label: 'Wandfläche', detail: '41,8 m² abzgl. Fenster & Tür'},
  {label: 'Preise aus deinem Katalog', detail: ''},
];

export const reply1 = [
  'Fertig für Familie Becker: das',
  'Wohnzimmer, 4 Positionen. Netto laut',
  'deinem Katalog 1.291,62 Euro. Bitte',
  'kurz prüfen.',
];

export const reply2 = [
  'Entwurf angepasst für Familie Becker:',
  'das Wohnzimmer, 5 Positionen. Netto',
  'laut deinem Katalog 1.451,62 Euro.',
  'Bitte kurz prüfen.',
];

export const room = 'Wohnzimmer';

export const wallFormula = [
  '18 × 2,6 m Wände (Umfang × Höhe) –',
  '1,25 × 1,2 m (2×) Fenster – 1 × 2 m Tür',
];
export const ceilingFormula = ['5 × 4 m Decke', ''];

export type StoryPosition = Position & {short: string; formula: string[]};

export const basePositions: StoryPosition[] = [
  {name: 'Tapete entfernen', short: 'Tapete entfernen', qty: 41.8, unit: 'm²', unitPrice: 8.9, formula: wallFormula},
  {name: 'Flächenspachtelung', short: 'Flächenspachtelung', qty: 41.8, unit: 'm²', unitPrice: 10.2, formula: wallFormula},
  {name: 'Grundierung Tiefgrund', short: 'Grundierung Tiefgrund', qty: 41.8, unit: 'm²', unitPrice: 3.8, formula: wallFormula},
  {name: 'Anstrich Dispersion', short: 'Anstrich Dispersion', qty: 41.8, unit: 'm²', unitPrice: 8.0, formula: wallFormula},
];

export const addedPosition: StoryPosition = {
  name: 'Anstrich Dispersion · Decke',
  short: 'Anstrich Dispersion · Decke',
  qty: 20,
  unit: 'm²',
  unitPrice: 8.0,
  formula: ceilingFormula,
};

export const allPositions = [...basePositions, addedPosition];

const round2 = (n: number) => Math.round(n * 100) / 100;
export const lineTotal = (p: Position) => round2(p.qty * p.unitPrice);
export const sum = (ps: Position[]) => round2(ps.reduce((s, p) => s + lineTotal(p), 0));
export const netto1 = sum(basePositions); // 1.291,62
export const netto2 = sum(allPositions); // 1.451,62
export const mwst2 = round2(netto2 * 0.19); // 275,81
export const brutto2 = round2(netto2 + mwst2); // 1.727,43

export const draftCard = {
  label: 'ENTWURF ZUM PRÜFEN',
  nettoLabel: 'Netto laut Katalog:',
  note: [
    'Mengen rechnet Kavox aus den Raummaßen, Preise',
    'kommen aus deinem Katalog. Ändern kannst du alles',
    'im nächsten Schritt – oder sag es mir einfach',
    '(„Decke weg“, „Bad dazu“).',
  ],
  primary: 'Prüfen & als Aufmaß übernehmen',
  secondary: 'Verwerfen',
};

export const aufmass = {
  title: 'Wohnzimmer',
  badge: 'Entwurf',
  note: ['Liegt nur auf diesem Handy. Wenn alles erfasst', 'ist: „An den Rechner übergeben“.'],
  address: ['Straße Hausnummer', 'PLZ Ort'],
  phone: 'Telefon (optional)',
  farbton: 'Farbton (optional), z. B. Sandbeige matt',
  fotosNote: ['Vorher-Fotos, Schäden, Anschlüsse – landen mit dem', 'Aufmaß am Rechner.'],
  noteField: ['z. B. Wasseranschluss links, Schlüssel beim', 'Nachbarn, Kunde wünscht Termin ab Mai'],
  sign: 'Kunde unterschreibt vor Ort',
  send: 'An den Rechner übergeben',
  remove: 'Vom Handy löschen',
};

export const quote = {
  title: 'Angebot',
  number: 'Nr. A-2026-041',
  subject: 'Malerarbeiten Wohnzimmer',
  head: ['Pos.', 'Leistung', 'Menge', 'EP', 'Gesamt'],
  netto: 'Netto',
  mwst: 'zzgl. 19 % MwSt.',
  total: 'Gesamtbetrag',
  ready: 'Angebot bereit',
};

export const endCard = {
  feature: 'KI-Angebot',
  soon: 'Bald verfügbar.',
};
