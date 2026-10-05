import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DURATION, FPS} from './timeline';
import {TeaserScreen, TeaserProps} from './Teaser';
import {TeaserVertical} from './Vertical';
import {fontsLoaded} from './fonts';
import {StoryScreen, StoryVertical} from './story/Story';
import {DURATION as STORY_DURATION} from './story/timeline';
import {GoldReel} from './gold/GoldReel';
import {DURATION as GOLD_DURATION, FPS as GOLD_FPS} from './gold/timeline';

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
    {/* "KavoxStory": the slower, step-by-step cut with container-transform morphs */}
    <Composition
      id="KavoxStory-Screen"
      component={StoryScreen}
      durationInFrames={STORY_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
    <Composition
      id="KavoxStory-Vertical"
      component={StoryVertical}
      durationInFrames={STORY_DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
    />
    {/* "GoldReel": 9:16 Instagram reel on gold, voice-over public/gold/voice.mp3 */}
    <Composition
      id="GoldReel"
      component={GoldReel}
      durationInFrames={GOLD_DURATION}
      fps={GOLD_FPS}
      width={1080}
      height={1920}
      defaultProps={{handle: '@i_v_a_n_w_e_b_e_r', withSfx: true, withCaptions: true}}
    />
  </>
);
