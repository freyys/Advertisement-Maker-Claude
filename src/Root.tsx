import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DURATION, FPS} from './timeline';
import {TeaserScreen, TeaserProps} from './Teaser';
import {TeaserVertical} from './Vertical';
import {fontsLoaded} from './fonts';
import {StoryScreen, StoryVertical} from './story/Story';
import {DURATION as STORY_DURATION} from './story/timeline';
import {makePhase, ReelFull, ReelProps} from './reel/Reel';
import {PHASES, TOTAL as REEL_TOTAL} from './reel/timeline';

const reelProps: ReelProps = {withMusic: true, withSfx: true};
const reelPhases = PHASES.map((p) => ({...p, C: makePhase(p.key)}));

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
    {/* "KavoxReel": 9:16 feature showreel for Instagram/TikTok, split in phases */}
    <Composition
      id="KavoxReel-Full"
      component={ReelFull}
      durationInFrames={REEL_TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={reelProps}
    />
    {reelPhases.map((p) => (
      <Composition
        key={p.id}
        id={`KavoxReel-${p.id}`}
        component={p.C}
        durationInFrames={p.dur}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={reelProps}
      />
    ))}
  </>
);
