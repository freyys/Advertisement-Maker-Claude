import React from 'react';
import {AbsoluteFill, Audio, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COPY, Copy, Lang} from './copy';
import {B} from './theme';
import {DURATION, MONTAGE, SHOTS, ShotId} from './timeline';
import {Grain, LinenStage, Whip} from './ui';
import {PitchSfx} from './Sfx';
import {Hook} from './scenes/Hook';
import {Reveal} from './scenes/Reveal';
import {Quote} from './scenes/Quote';
import {Measure} from './scenes/Measure';
import {Pdf} from './scenes/Pdf';
import {Invoice} from './scenes/Invoice';
import {Overview} from './scenes/Overview';
import {Companion} from './scenes/Companion';
import {Offline} from './scenes/Offline';
import {Values} from './scenes/Values';
import {End} from './scenes/End';

export type PitchProps = {
  lang: Lang;
  /** Music bed (public/pitch/music.mp3, built by scripts/pitch-music.mjs). */
  withMusic: boolean;
  /** UI sound design from public/sfx. */
  withSfx: boolean;
  /** Optional small credit on the end card, e.g. "Edit & motion: Jane Doe". */
  credit: string;
};

export type SceneProps = {copy: Copy; lang: Lang; dur: number; pre: number};

const SCENES: Record<ShotId, React.FC<SceneProps>> = {
  hook: Hook,
  reveal: Reveal,
  quote: Quote,
  measure: Measure,
  pdf: Pdf,
  invoice: Invoice,
  overview: Overview,
  companion: Companion,
  offline: Offline,
  values: Values,
  end: End,
};

const hasFile = (name: string) => {
  try {
    return getStaticFiles().some((f) => f.name === name);
  } catch {
    return false;
  }
};

const MONTAGE_FROM = SHOTS.find((s) => s.id === MONTAGE[0])!;
const MONTAGE_TO = SHOTS.find((s) => s.id === MONTAGE[MONTAGE.length - 1])!.to;

export const Pitch: React.FC<PitchProps> = ({lang, withMusic, withSfx, credit}) => {
  const copy = COPY[lang];
  const music = withMusic && hasFile('pitch/music.mp3');
  const mStart = MONTAGE_FROM.from - (MONTAGE_FROM.pre ?? 0);
  return (
    <AbsoluteFill style={{background: B.black}}>
      {/* one continuous linen stage under the six product shots */}
      <Sequence from={mStart} durationInFrames={MONTAGE_TO - mStart} name="linen stage">
        <StageUnder />
      </Sequence>
      {/* later shots first, so a shot that starts early (`pre`) sits underneath the one before */}
      {[...SHOTS].reverse().map((s) => {
        const Scene = SCENES[s.id];
        const pre = s.pre ?? 0;
        const dur = s.to - s.from;
        const props: SceneProps & {credit?: string} = {copy, lang, dur, pre, credit: credit || undefined};
        const inMontage = MONTAGE.includes(s.id);
        return (
          <Sequence key={s.id} from={s.from - pre} durationInFrames={dur + pre} name={s.id}>
            {inMontage ? (
              <WhipShot id={s.id} dur={dur} pre={pre} noIn={s.id === MONTAGE[0]} noOut={s.id === MONTAGE[MONTAGE.length - 1]}>
                <Scene {...props} />
              </WhipShot>
            ) : (
              <Scene {...props} />
            )}
          </Sequence>
        );
      })}
      <Grain opacity={0.1} />
      {music && <Audio src={staticFile('pitch/music.mp3')} volume={(f) => interpolate(f, [DURATION - 6, DURATION], [1, 0.85], {extrapolateLeft: 'clamp'})} />}
      {withSfx && <PitchSfx />}
    </AbsoluteFill>
  );
};

const StageUnder: React.FC = () => {
  const f = useCurrentFrame();
  return <LinenStage f={f} />;
};

const WhipShot: React.FC<{id: string; dur: number; pre: number; noIn?: boolean; noOut?: boolean; children: React.ReactNode}> = ({
  id,
  dur,
  pre,
  noIn,
  noOut,
  children,
}) => {
  const f = useCurrentFrame() - pre;
  return (
    <Whip f={f} dur={noOut ? dur + 100 : dur} noIn={noIn} id={`whip-${id}`}>
      {children}
    </Whip>
  );
};
