// Every on-screen string of the pitch reel, in English and German.
// "\n" breaks a headline; a line-final "." becomes the hyacinth brand dot.
// Facts come from the Kavox product description; no invented claims.

export type Lang = 'en' | 'de';

export type Copy = {
  hook: {line: string};
  reveal: {sub: string};
  quote: {kicker: string; title: string; sub: string};
  measure: {kicker: string; title: string; sub: string; labels: [string, string, string]};
  pdf: {kicker: string; title: string; sub: string; badge: string};
  invoice: {
    kicker: string;
    title: string;
    sub: string;
    front: {kicker: string; status: string; button: string};
    back: {kicker: string; status: string};
  };
  overview: {kicker: string; title: string; sub: string};
  companion: {kicker: string; title: string; sub: string; soon: string};
  offline: {lines: [string, string, string]; sub: string; badge: [string, string]};
  values: [string, string, string, string];
  end: {tag: [string, string, string]; facts: string};
};

export const COPY: Record<Lang, Copy> = {
  en: {
    hook: {line: 'Three quotes still to write.'},
    reveal: {sub: 'Quotes and invoices for the trades.'},
    quote: {kicker: 'Quote', title: 'Five steps.\nOne quote.', sub: 'Customer · Rooms · Services · Extras · Review'},
    measure: {
      kicker: 'Measure',
      title: 'Measured.\nNot guessed.',
      sub: 'Windows and doors deducted per VOB/C',
      labels: ['walls', '2 windows', 'door'],
    },
    pdf: {kicker: 'PDF', title: 'Live PDF.\nYour letterhead.', sub: 'Logo · measurement sheet · signature · photos', badge: 'Live preview'},
    invoice: {
      kicker: 'Invoice',
      title: 'One click.\nInvoice ready.',
      sub: 'ZUGFeRD e-invoice · EN 16931 · § 13b · § 35a',
      front: {kicker: 'Quote', status: 'Accepted', button: 'Create invoice'},
      back: {kicker: 'Invoice', status: 'EN 16931 validated'},
    },
    overview: {kicker: 'Overview', title: 'Know what’s\ncoming in.', sub: 'Cockpit · cash-flow radar · follow-ups'},
    companion: {kicker: 'On site', title: 'Say the job.\nGet the draft.', sub: 'iPhone companion · AI runs on your own laptop', soon: 'Coming soon'},
    offline: {lines: ['No cloud.', 'No account.', 'No telemetry.'], sub: 'Everything stays on your computer.', badge: ['100 %', 'offline']},
    values: ['Privacy.', 'Precision.', 'Transparency.', 'Independence.'],
    end: {tag: ['Quotes that don’t cost you ', 'half your evening', '.'], facts: 'Windows & macOS · 100 % offline · 14-day free trial'},
  },
  de: {
    hook: {line: 'Noch drei Angebote offen.'},
    reveal: {sub: 'Angebote und Rechnungen fürs Handwerk.'},
    quote: {kicker: 'Angebot', title: 'Fünf Schritte.\nEin Angebot.', sub: 'Kunde · Räume · Leistungen · Extras · Prüfen'},
    measure: {
      kicker: 'Aufmaß',
      title: 'Gemessen.\nNicht geraten.',
      sub: 'Fenster und Türen abgezogen nach VOB/C',
      labels: ['Wände', '2 Fenster', 'Tür'],
    },
    pdf: {kicker: 'PDF', title: 'Live-PDF.\nDein Briefkopf.', sub: 'Logo · Aufmaßblatt · Unterschrift · Fotos', badge: 'Live-Vorschau'},
    invoice: {
      kicker: 'Rechnung',
      title: 'Ein Klick.\nRechnung fertig.',
      sub: 'E-Rechnung ZUGFeRD · EN 16931 · § 13b · § 35a',
      front: {kicker: 'Angebot', status: 'Angenommen', button: 'Rechnung erstellen'},
      back: {kicker: 'Rechnung', status: 'EN 16931 geprüft'},
    },
    overview: {kicker: 'Überblick', title: 'Wissen, was\nreinkommt.', sub: 'Cockpit · Cashflow-Radar · Nachfassen'},
    companion: {kicker: 'Vor Ort', title: 'Einfach sagen.\nEntwurf prüfen.', sub: 'iPhone-App · KI läuft lokal auf deinem Laptop', soon: 'Bald verfügbar'},
    offline: {lines: ['Keine Cloud.', 'Kein Konto.', 'Keine Telemetrie.'], sub: 'Alles bleibt auf deinem Rechner.', badge: ['100 %', 'offline']},
    values: ['Datenschutz.', 'Präzision.', 'Transparenz.', 'Unabhängigkeit.'],
    end: {tag: ['Angebote schreiben, die nicht ', 'den halben Abend', ' kosten.'], facts: 'Windows & macOS · 100 % offline · 14 Tage kostenlos testen'},
  },
};

/** 41.8 → "41.8" (en) / "41,8" (de). */
export const num = (n: number, decimals: number, lang: Lang) =>
  n
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '#')
    .replace('.', lang === 'de' ? ',' : '.')
    .replace(/#/g, lang === 'de' ? '.' : ',');

/** Euro amount: "7.648,61 €" (de) / "€7,648.61" (en). */
export const money = (n: number, lang: Lang) => (lang === 'de' ? `${num(n, 2, lang)} €` : `€${num(n, 2, lang)}`);
