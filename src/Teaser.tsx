import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {FONT, palette} from './theme';
import {OVERLAP, SCENES, SceneKey} from './timeline';
import {Background, GrainVignette} from './components/Background';
import {Sfx} from './audio/Sfx';
import {S1Ignition} from './scenes/S1Ignition';
import {S2AppIcon} from './scenes/S2AppIcon';
import {S3Agent} from './scenes/S3Agent';
import {S4Positions} from './scenes/S4Positions';
import {S5Quote} from './scenes/S5Quote';
import {S6Arcs} from './scenes/S6Arcs';
import {S7CommandBar} from './scenes/S7CommandBar';
import {S8Logo} from './scenes/S8Logo';

export type TeaserProps = {
  withMusic: boolean;
  withSfx: boolean;
};

const useActive = (key: SceneKey) => {
  const frame = useCurrentFrame();
  const {start, end} = SCENES[key];
  const {pre, post} = OVERLAP[key];
  return frame >= start - pre && frame < end + post;
};

/** All scenes on the 1920×1080 stage, without grain (added by the wrapper). */
export const TeaserStage: React.FC<{endCard?: boolean}> = ({endCard = true}) => {
  const s1 = useActive('S1');
  const s2 = useActive('S2');
  const s3 = useActive('S3');
  const s4 = useActive('S4');
  const s5 = useActive('S5');
  const s6 = useActive('S6');
  const s7 = useActive('S7');
  const s8 = useActive('S8');
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: palette.white, overflow: 'hidden'}}>
      <Background />
      {s1 ? <S1Ignition /> : null}
      {s2 ? <S2AppIcon /> : null}
      {s3 ? <S3Agent /> : null}
      {s4 ? (
        <CameraMotionBlur samples={8} shutterAngle={300}>
          <S4Positions />
        </CameraMotionBlur>
      ) : null}
      {s5 ? <S5Quote /> : null}
      {s6 ? <S6Arcs /> : null}
      {s7 ? <S7CommandBar /> : null}
      {s8 && endCard ? (
        <CameraMotionBlur samples={8} shutterAngle={240}>
          <S8Logo />
        </CameraMotionBlur>
      ) : null}
    </AbsoluteFill>
  );
};

export const AudioLayer: React.FC<TeaserProps> = ({withMusic, withSfx}) => (
  <>
    {withSfx ? <Sfx /> : null}
    {withMusic ? <Audio src={staticFile('sound.mp3')} /> : null}
  </>
);

/** KavoxTeaser-Screen (1920×1080). */
export const TeaserScreen: React.FC<TeaserProps> = (props) => (
  <AbsoluteFill style={{background: palette.bg}}>
    <TeaserStage />
    <GrainVignette />
    <AudioLayer {...props} />
  </AbsoluteFill>
);
