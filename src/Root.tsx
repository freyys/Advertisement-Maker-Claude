import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DURATION, FPS} from './timeline';
import {TeaserScreen, TeaserProps} from './Teaser';
import {TeaserVertical} from './Vertical';
import {fontsLoaded} from './fonts';

const handle = delayRender('Loading Plus Jakarta Sans');
fontsLoaded.then(() => continueRender(handle));

const defaultProps: TeaserProps = {withMusic: false, withSfx: true};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="KavoxTeaser-Screen"
      component={TeaserScreen}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="KavoxTeaser-Vertical"
      component={TeaserVertical}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
  </>
);
