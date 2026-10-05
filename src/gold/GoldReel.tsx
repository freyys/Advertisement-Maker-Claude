import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {GoldSfx} from './GoldSfx';
import {Grade} from './fx';
import {S1Pillow, S2Ounce, S3Split, S4Vault, S5Banker} from './scenesA';
import {S6Montage, S7Chart, S8Anchor, S9Logo} from './scenesB';
import {SCENES, SceneKey, XFADE, sec} from './timeline';

export type GoldReelProps = {handle: string; withSfx: boolean; withCaptions: boolean};

const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XFADE], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const GoldReel: React.FC<GoldReelProps> = ({handle, withSfx, withCaptions}) => {
  const scenes: Record<SceneKey, React.ReactNode> = {
    s1: <S1Pillow />,
    s2: <S2Ounce />,
    s3: <S3Split />,
    s4: <S4Vault />,
    s5: <S5Banker />,
    s6: <S6Montage />,
    s7: <S7Chart />,
    s8: <S8Anchor />,
    s9: <S9Logo handle={handle} />,
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {(Object.keys(SCENES) as SceneKey[]).map((k, i) => {
        const [a, b] = SCENES[k];
        const from = Math.max(0, sec(a) - (i ? XFADE : 0));
        return (
          <Sequence key={k} from={from} durationInFrames={sec(b) - from + (k === 's9' ? 0 : XFADE)} name={k}>
            <FadeIn first={i === 0}>{scenes[k]}</FadeIn>
          </Sequence>
        );
      })}
      <Grade />
      {withCaptions && <Captions />}
      <Audio src={staticFile('gold/voice.mp3')} />
      {withSfx && <GoldSfx />}
    </AbsoluteFill>
  );
};
