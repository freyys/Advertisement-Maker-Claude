import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {shot} from './timeline';

// UI sound design on top of the music bed: the synthesised, royalty-free SFX
// in public/sfx/ (scripts/make-sfx.mjs), placed on the picture's events.

type Hit = {at: number; file: string; volume: number};

const at = (id: Parameters<typeof shot>[0], local: number) => shot(id).from + local;

export const HITS: Hit[] = [
  {at: 30, file: 'click.wav', volume: 0.45}, // the minute rolls over
  {at: 70, file: 'whoosh-soft.wav', volume: 0.35}, // linen plane rises
  {at: 132, file: 'whoosh-whip.wav', volume: 0.42}, // dive through the O
  {at: at('quote', 12), file: 'whoosh-soft.wav', volume: 0.18}, // stepper lifts
  ...[at('measure', 0), at('pdf', 0), at('invoice', 0), at('overview', 0), at('companion', 0)].map((c, i) => ({
    at: c - 5,
    file: i % 2 ? 'whoosh-b.wav' : 'whoosh-a.wav',
    volume: 0.24,
  })),
  {at: at('measure', 8), file: 'tick.wav', volume: 0.5},
  {at: at('measure', 17), file: 'tick.wav', volume: 0.5},
  {at: at('measure', 26), file: 'tick.wav', volume: 0.5},
  {at: at('measure', 35), file: 'shimmer.wav', volume: 0.24},
  {at: at('invoice', 19), file: 'click.wav', volume: 0.6},
  {at: at('invoice', 21), file: 'whoosh-soft.wav', volume: 0.26},
  {at: at('overview', 38), file: 'shimmer.wav', volume: 0.16},
  {at: at('companion', 15), file: 'tick.wav', volume: 0.35},
  ...[0, 15, 30, 45].map((b) => ({at: at('values', b), file: 'whoosh-a.wav', volume: 0.2})),
  {at: at('end', 26), file: 'shimmer.wav', volume: 0.22},
];

export const PitchSfx: React.FC = () => (
  <>
    {HITS.map((h, i) => (
      <Sequence key={i} from={Math.max(0, h.at)} name={`sfx ${h.file}`}>
        <Audio src={staticFile(`sfx/${h.file}`)} volume={h.volume} />
      </Sequence>
    ))}
  </>
);
