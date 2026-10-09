import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DURATION, FPS} from './timeline';
import {TeaserScreen, TeaserProps} from './Teaser';
import {TeaserVertical} from './Vertical';
import {fontsLoaded} from './fonts';
import {StoryScreen, StoryVertical} from './story/Story';
import {DURATION as STORY_DURATION} from './story/timeline';
import {Animatic} from './showreel/Animatic';
import {Showreel, ShowreelProps} from './showreel/Showreel';
import {DURATION as REEL_DURATION, FPS as REEL_FPS} from './showreel/timeline';
import {Pitch, PitchProps} from './pitch/Pitch';
import {DURATION as PITCH_DURATION, FPS as PITCH_FPS} from './pitch/timeline';

const handle = delayRender('Loading Plus Jakarta Sans');
fontsLoaded.then(() => continueRender(handle));

const defaultProps: TeaserProps = {withMusic: false, withSfx: true};
const reelProps: ShowreelProps = {showMarkers: false, withSfx: true};
const pitchProps = (lang: PitchProps['lang']): PitchProps => ({lang, withMusic: true, withSfx: true, credit: ''});

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
    {/* "KavoxShowreel": the 75 s cinematic showreel built from the real screenshots */}
    <Composition
      id="KavoxShowreel-16x9"
      component={Showreel}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1920}
      height={1080}
      defaultProps={reelProps}
    />
    <Composition
      id="KavoxShowreel-9x16"
      component={Showreel}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1080}
      height={1920}
      defaultProps={reelProps}
    />
    <Composition
      id="KavoxShowreel-Animatic"
      component={Animatic}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="KavoxShowreel-Animatic-9x16"
      component={Animatic}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1080}
      height={1920}
    />
    {/* "KavoxPitch": the 24 s startup reel in the brand-book look (EN + DE) */}
    <Composition
      id="KavoxPitch-EN"
      component={Pitch}
      durationInFrames={PITCH_DURATION}
      fps={PITCH_FPS}
      width={1920}
      height={1080}
      defaultProps={pitchProps('en')}
    />
    <Composition
      id="KavoxPitch-DE"
      component={Pitch}
      durationInFrames={PITCH_DURATION}
      fps={PITCH_FPS}
      width={1920}
      height={1080}
      defaultProps={pitchProps('de')}
    />
  </>
);
