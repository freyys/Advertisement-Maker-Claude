import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {HIT, S3_BEATS, S6_BEATS, S7_BEATS} from '../timeline';
import * as copy from '../copy';

// Whoosh files peak ~9 frames (0.3 s) after they start.
const WHOOSH_LEAD = 9;

const Clip: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
  </Sequence>
);

/** Self-generated SFX (see scripts/make-sfx.mjs), synced to the ⚡ frames. */
export const Sfx: React.FC = () => {
  const words = copy.dictation.split(' ').length;
  const wordTicks = new Array(words)
    .fill(0)
    .map((_, i) => S3_BEATS.dictateStart + (i * (S3_BEATS.dictateEnd - S3_BEATS.dictateStart)) / words);
  const typeTicks = new Array(10)
    .fill(0)
    .map((_, i) => S7_BEATS.typeStart + (i * (S7_BEATS.typeEnd - S7_BEATS.typeStart)) / 10);

  return (
    <>
      <Clip at={HIT.ignition - WHOOSH_LEAD} src="whoosh-a.wav" />
      <Clip at={HIT.send - WHOOSH_LEAD} src="whoosh-b.wav" />
      <Clip at={HIT.whip - 7} src="whoosh-whip.wav" />
      <Clip at={HIT.ready - WHOOSH_LEAD} src="whoosh-a.wav" volume={0.85} />
      <Clip at={HIT.click - WHOOSH_LEAD - 2} src="whoosh-soft.wav" />
      <Clip at={HIT.click} src="click.wav" />
      <Clip at={HIT.click + 1} src="shimmer.wav" />
      <Clip at={S6_BEATS.arcsMeet - 1} src="shimmer.wav" volume={0.6} />
      <Clip at={HIT.bloom - 30} src="riser.wav" />
      <Clip at={HIT.bloom} src="impact.wav" />
      {wordTicks.map((f, i) => (
        <Clip key={`w${i}`} at={f} src="tick.wav" volume={0.7} />
      ))}
      {typeTicks.map((f, i) => (
        <Clip key={`t${i}`} at={f} src="tick.wav" />
      ))}
    </>
  );
};
