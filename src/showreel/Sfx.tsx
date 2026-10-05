import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {BEATS, CUTS, sec, shot, ShotId} from './timeline';

// Sound design under the voice: the synthesized, royalty-free SFX in
// public/sfx/ (scripts/make-sfx.mjs), placed on the same beats as the picture,
// so it follows the timeline when the voice is re-synced.

type Hit = {at: number; file: string; volume: number};

const F = {
  click: 'click.wav',
  impact: 'impact.wav',
  riser: 'riser.wav',
  shimmer: 'shimmer.wav',
  tick: 'tick.wav',
  whooshA: 'whoosh-a.wav',
  whooshB: 'whoosh-b.wav',
  whooshSoft: 'whoosh-soft.wav',
  whip: 'whoosh-whip.wav',
} as const;

/** Absolute frame of a beat. */
const at = <S extends ShotId>(id: S, key: keyof (typeof BEATS)[S], offset = 0) =>
  shot(id).from + sec((BEATS[id][key] as unknown as number) + offset);

const STRIPE_CUTS: ShotId[] = ['baustelle', 'outro'];

export const hits = (): Hit[] => {
  const h: Hit[] = [];
  const add = (frame: number, file: string, volume: number) => h.push({at: Math.max(0, Math.round(frame)), file, volume});

  // every cut: a soft air move; the stripe transitions get a fuller whoosh
  for (const c of CUTS) {
    const stripe = STRIPE_CUTS.some((id) => shot(id).from === c);
    add(c - 4, stripe ? F.whooshB : F.whooshSoft, stripe ? 0.42 : 0.2);
  }

  // intro: the dot breathes, the mark ignites
  add(at('intro', 'dot'), F.shimmer, 0.28);
  add(at('intro', 'pulse1'), F.tick, 0.55);
  add(at('intro', 'pulse2'), F.tick, 0.55);
  add(at('intro', 'mark', -0.9), F.riser, 0.22);
  add(at('intro', 'mark'), F.impact, 0.3);

  // baustelle: tap + sunlight flare
  add(at('baustelle', 'tap'), F.click, 0.55);
  add(at('baustelle', 'flare'), F.shimmer, 0.3);

  // sagen: soft typing, card, count lands
  const t0 = at('sagen', 'typeStart');
  const t1 = at('sagen', 'typeEnd');
  for (let f = t0; f < t1; f += 5) add(f + ((f / 5) % 2), F.tick, 0.06);
  add(at('sagen', 'card'), F.whooshSoft, 0.26);
  add(at('sagen', 'count', 1.35), F.shimmer, 0.24);

  // rechenweg: the formula lifts off, the result lands
  add(at('rechenweg', 'lift'), F.whooshA, 0.24);
  add(at('rechenweg', 'result', 0.85), F.shimmer, 0.2);

  // unterschrift: brutto lands
  add(at('unterschrift', 'countEnd'), F.shimmer, 0.24);

  // uebergabe: tap, flight, landing
  add(at('uebergabe', 'tap'), F.click, 0.55);
  add(at('uebergabe', 'fly'), F.whip, 0.36);
  add(at('uebergabe', 'land'), F.impact, 0.26);

  // pruefen: three ticks, the sheet falls, and is sent
  for (let i = 0; i < 3; i++) add(at('pruefen', 'check1', i * BEATS.pruefen.checkEvery), F.click, 0.3);
  add(at('pruefen', 'pdf'), F.whooshA, 0.34);
  add(at('pruefen', 'send'), F.whip, 0.32);

  // cockpit: cards fly in
  add(at('cockpit', 'cards'), F.whooshSoft, 0.22);

  // cashflow: total lands
  add(at('cashflow', 'drawEnd'), F.shimmer, 0.2);

  // befehl: Strg, K, palette, typing
  add(at('befehl', 'press'), F.click, 0.6);
  add(at('befehl', 'press', 0.13), F.click, 0.6);
  add(at('befehl', 'palette'), F.whooshSoft, 0.2);
  for (let i = 0; i < 4; i++) add(at('befehl', 'type', i * BEATS.befehl.typeEvery), F.tick, 0.18);

  // archiv: panels slide in, Umsatz lands
  add(at('archiv', 'left'), F.whooshA, 0.24);
  add(at('archiv', 'countEnd'), F.shimmer, 0.2);

  // outro: the green dot, the logo hit, the last full stop
  add(at('outro', 'offline'), F.tick, 0.4);
  add(at('outro', 'logo', -1.0), F.riser, 0.26);
  add(at('outro', 'logo', 0.45), F.impact, 0.42);
  add(at('outro', 'tagline', 0.75), F.click, 0.2);

  return h;
};

export const ReelSfx: React.FC = () => (
  <>
    {hits().map((x, i) => (
      <Sequence key={i} from={x.at} durationInFrames={sec(2.2)} layout="none">
        <Audio src={staticFile(`sfx/${x.file}`)} volume={x.volume} />
      </Sequence>
    ))}
  </>
);
