import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// Self-generated, royalty-free SFX from public/sfx (scripts/make-sfx.mjs).
// Whooshes peak about 9 frames after they start.
const SFX_GAIN = 1.25;
/** SFX gain for the phases: 0 = off, 1 = full, lower under the voiceover. */
export const SfxContext = React.createContext(1);

export const S: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 1}) => {
  const gain = React.useContext(SfxContext);
  if (!gain) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} layout="none">
      <Audio src={staticFile(`sfx/${src}`)} volume={vol * SFX_GAIN * gain} />
    </Sequence>
  );
};

/** Evenly spaced key ticks between two frames. */
export const Ticks: React.FC<{from: number; to: number; n: number; vol?: number}> = ({from, to, n, vol = 0.45}) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <S key={i} at={from + (i * (to - from)) / n} src="tick.wav" vol={vol * (0.8 + ((i * 7) % 5) * 0.06)} />
    ))}
  </>
);

/** Whoosh that peaks exactly on the phase cut (local frame = dur). */
export const CutWhoosh: React.FC<{dur: number; vol?: number}> = ({dur, vol = 0.55}) => <S at={dur - 9} src="whoosh-whip.wav" vol={vol} />;
