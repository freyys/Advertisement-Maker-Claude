import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {AENDERN, END, INTRO, PRUEFEN, RECHNEN, SAGEN, UEBERGEBEN} from './timeline';
import * as copy from './copy';

// Reuses the self-generated SFX in public/sfx (scripts/make-sfx.mjs).
// Whoosh files peak ~9 frames after they start.
const Clip: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
  </Sequence>
);

const ticks = (from: number, to: number, n: number) =>
  new Array(n).fill(0).map((_, i) => from + (i * (to - from)) / n);

export const StorySfx: React.FC = () => {
  const w1 = copy.message1.join(' ').split(' ').length;
  const w2 = copy.message2.join(' ').split(' ').length;
  const mid = (a: readonly [number, number]) => (a[0] + a[1]) / 2;
  return (
    <>
      <Clip at={INTRO.iconIn - 4} src="whoosh-soft.wav" />
      <Clip at={mid([INTRO.morphStart, INTRO.morphEnd]) - 9} src="whoosh-a.wav" volume={0.8} />
      {ticks(SAGEN.dictateStart, SAGEN.dictateEnd, w1).map((f, i) => (
        <Clip key={`a${i}`} at={f} src="tick.wav" volume={0.6} />
      ))}
      <Clip at={SAGEN.send} src="click.wav" volume={0.8} />
      <Clip at={SAGEN.send - 4} src="whoosh-soft.wav" />
      {[0, 1, 2].map((i) => (
        <Clip key={`c${i}`} at={SAGEN.stepsStart + i * SAGEN.stepEvery + SAGEN.checkAfter} src="tick.wav" />
      ))}
      <Clip at={RECHNEN.card - 6} src="whoosh-soft.wav" />
      {ticks(AENDERN.dictateStart, AENDERN.dictateEnd, w2).map((f, i) => (
        <Clip key={`b${i}`} at={f} src="tick.wav" volume={0.6} />
      ))}
      <Clip at={AENDERN.send} src="click.wav" volume={0.8} />
      <Clip at={AENDERN.send - 2} src="whoosh-soft.wav" />
      <Clip at={AENDERN.flyEnd - 2} src="shimmer.wav" volume={0.55} />
      <Clip at={PRUEFEN.tap} src="click.wav" volume={0.8} />
      <Clip at={mid(PRUEFEN.morph) - 9} src="whoosh-b.wav" volume={0.85} />
      <Clip at={PRUEFEN.tapSend} src="click.wav" volume={0.8} />
      <Clip at={mid(UEBERGEBEN.fly) - 7} src="whoosh-whip.wav" volume={0.7} />
      <Clip at={mid(UEBERGEBEN.unfold) - 9} src="whoosh-soft.wav" />
      <Clip at={UEBERGEBEN.pill} src="shimmer.wav" volume={0.8} />
      <Clip at={END.gather[0]} src="whoosh-soft.wav" />
      <Clip at={END.unpack[0] - 24} src="riser.wav" volume={0.55} />
      <Clip at={END.unpack[0] + 6} src="impact.wav" volume={0.6} />
      <Clip at={END.unpack[0] + 8} src="shimmer.wav" volume={0.6} />
    </>
  );
};
