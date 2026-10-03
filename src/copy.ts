// Every on-screen string and number. The example is the one built into the
// Kavox assistant ("Familie Becker"), priced with a painter's catalog.

export const customer = 'Familie Becker';

export const windowTitle = `KI-Angebot · ${customer}`;
export const tagWorking = 'IN ARBEIT 1';
export const tagDone = 'FERTIG';

// Assistent screen (recreated from the app)
export const assistant = {
  pill: 'KI · LOKAL AUF DEM LAPTOP',
  title: 'Assistent',
  status: 'Bereit · läuft lokal auf dem Laptop',
  readAloud: 'Antworten vorlesen',
  hint: 'Tipp unten ins Feld und dann aufs Mikrofon der Tastatur – einfach sprechen wie mit einem Kollegen.',
  placeholder: 'Was soll ins Angebot?',
  placeholderAfter: 'Ändern? z. B. „Bad 3 × 2 dazu“',
  working: 'Kavox schreibt den Entwurf …',
  done: `Fertig für ${customer} – bitte kurz prüfen.`,
};

// Dictated into the input (keyboard microphone), word by word.
export const dictation =
  'Wohnzimmer 5 mal 4, 2,60 hoch, zwei Fenster, eine Tür: Tapete runter, spachteln, grundieren, Wände streichen. Kunde Familie Becker.';

export const agentSteps = [
  {label: 'Raummaße erkannt', detail: '5 × 4 m, 2,60 m hoch'},
  {label: 'Wandfläche berechnet', detail: '41,8 m² abzgl. Fenster & Tür'},
  {label: 'Leistungskatalog durchsucht', detail: '4 Positionen gefunden'},
  {label: 'Preise aus deinem Katalog übernommen', detail: ''},
];

export const room = 'Wohnzimmer';

// Wall area: (5 + 4) × 2 × 2,60 − 2 × (1,25 × 1,2) − (1 × 2) = 41,8 m²
export const formula =
  '18 × 2,6 m Wände (Umfang × Höhe) – 1,25 × 1,2 m (2×) Fenster – 1 × 2 m Tür';

export type Position = {
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
};

export const positions: Position[] = [
  {name: 'Tapete entfernen', qty: 41.8, unit: 'm²', unitPrice: 8.9},
  {name: 'Flächenspachtelung', qty: 41.8, unit: 'm²', unitPrice: 10.2},
  {name: 'Grundierung Tiefgrund', qty: 41.8, unit: 'm²', unitPrice: 3.8},
  {name: 'Anstrich Dispersion', qty: 41.8, unit: 'm²', unitPrice: 8.0},
];

const round2 = (n: number) => Math.round(n * 100) / 100;
export const lineTotal = (p: Position) => round2(p.qty * p.unitPrice);
export const netto = round2(positions.reduce((s, p) => s + lineTotal(p), 0)); // 1.291,62
export const mwst = round2(netto * 0.19); // 245,41
export const brutto = round2(netto + mwst); // 1.537,03

export const draftCard = {
  label: 'ENTWURF ZUM PRÜFEN',
  nettoLabel: 'Netto laut Katalog:',
  note: 'Mengen rechnet Kavox aus den Raummaßen, Preise kommen aus deinem Katalog. Ändern kannst du alles im nächsten Schritt.',
  primary: 'Prüfen & als Aufmaß übernehmen',
  secondary: 'Verwerfen',
};

export const aufmass = {
  section: 'RÄUME & POSITIONEN',
  sectionNo: '02',
  badge: 'Entwurf',
};

export const quote = {
  title: 'Angebot',
  number: 'Nr. A-2026-041',
  subject: 'Malerarbeiten Wohnzimmer',
  head: ['Pos.', 'Leistung', 'Menge', 'EP', 'Gesamt'],
  netto: 'Netto',
  mwst: 'zzgl. 19 % MwSt.',
  total: 'Gesamtbetrag',
  ready: 'Angebot bereit · 28 Sek.',
};

export const commandBar = {
  placeholder: 'Was soll Kavox tun?',
  text: `${customer} – Angebot in 30 Sekunden`,
  options: [
    {label: 'Angebot erstellen', icon: 'check', done: true},
    {label: 'Nachkalkulieren', icon: 'calc', done: false},
    {label: 'In Rechnung umwandeln', icon: 'invoice', done: false},
    {label: 'Per E-Mail senden', icon: 'mail', done: false},
  ] as const,
  target: 3,
};

export const endCard = {
  feature: 'KI-Angebot',
  soon: 'Bald verfügbar.',
};
