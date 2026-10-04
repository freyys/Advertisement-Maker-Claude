// "KavoxReel": a native 9:16 showreel in 13 phases. Every phase is its own
// composition (KavoxReel-P01-Intro …) and the master cut (KavoxReel-Full)
// plays them back to back over one continuous background + music bed.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {PHASES, PhaseKey, START, TOTAL} from './timeline';
import {Grain, ReelBackground} from './kit/stage';
import {SfxContext} from './kit/sfx';
import VO from './vo.json';
import {P01Intro} from './phases/P01Intro';
import {P02Cockpit} from './phases/P02Cockpit';
import {P03Cashflow} from './phases/P03Cashflow';
import {P04Assistant} from './phases/P04Assistant';
import {P05Aufmass} from './phases/P05Aufmass';
import {P06VorOrt} from './phases/P06VorOrt';
import {P07Angebot} from './phases/P07Angebot';
import {P08Pdf} from './phases/P08Pdf';
import {P09Palette} from './phases/P09Palette';
import {P10Dokumente} from './phases/P10Dokumente';
import {P11Auswertung} from './phases/P11Auswertung';
import {P12Baustelle} from './phases/P12Baustelle';
import {P13Outro} from './phases/P13Outro';

export type ReelProps = {withMusic: boolean; withSfx: boolean; withVoice: boolean};

const REGISTRY: Record<PhaseKey, React.FC<{dur: number}>> = {
  intro: P01Intro,
  cockpit: P02Cockpit,
  cashflow: P03Cashflow,
  assistant: P04Assistant,
  aufmass: P05Aufmass,
  vorOrt: P06VorOrt,
  angebot: P07Angebot,
  pdf: P08Pdf,
  palette: P09Palette,
  archiv: P10Dokumente,
  auswertung: P11Auswertung,
  baustelle: P12Baustelle,
  outro: P13Outro,
};

const MUSIC_VOL = 0.62;

/** Background that keeps running across cuts (reads the global frame). */
const World: React.FC<{offset: number}> = ({offset}) => {
  const frame = useCurrentFrame() + offset;
  const warm = interpolate(frame, [START.outro + 60, START.outro + 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <ReelBackground frame={frame} endWarm={warm} />;
};

const GrainLayer: React.FC<{offset: number}> = ({offset}) => {
  const frame = useCurrentFrame() + offset;
  return <Grain frame={frame} />;
};

const PhaseBody: React.FC<{k: PhaseKey; dur: number; sfxGain: number}> = ({k, dur, sfxGain}) => {
  const C = REGISTRY[k];
  // SFX live inside the phase components and read their gain from context (0 = off)
  return (
    <SfxContext.Provider value={sfxGain}>
      <C dur={dur} />
    </SfxContext.Provider>
  );
};

// ---- voiceover (ElevenLabs take, fitted by scripts/prepare-vo.mjs) ----------------
const VO_VOL = 1;
const DUCK = 0.62; // music −8.4 dB under the voice
const SFX_UNDER_VOICE = 0.75;

/** 0…1 voice activity at a global frame, with soft attack/release for ducking. */
const voiceAt = (f: number) =>
  VO.reduce((acc, l) => {
    const a = interpolate(f, [l.start - 6, l.start, l.start + l.frames, l.start + l.frames + 10], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.max(acc, a);
  }, 0);

/** Every line that overlaps [from, from + len), placed in global time. */
const Voice: React.FC<{from: number; len: number}> = ({from, len}) => (
  <>
    {VO.filter((l) => l.start < from + len && l.start + l.frames > from).map((l) => (
      <Sequence key={l.file} from={l.start - from} durationInFrames={l.frames + 2} layout="none" name={`VO ${l.file}`}>
        <Audio src={staticFile(`reel/vo/${l.file}`)} volume={VO_VOL} />
      </Sequence>
    ))}
  </>
);

const Music: React.FC<{from: number; len: number; duck: boolean}> = ({from, len, duck}) => (
  <Audio
    src={staticFile('reel/music.wav')}
    startFrom={from}
    volume={(f) =>
      MUSIC_VOL *
      (duck ? 1 - DUCK * voiceAt(from + f) : 1) *
      interpolate(f, [0, 4, len - 8, len], [from === 0 ? 1 : 0, 1, 1, from + len >= TOTAL ? 1 : 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    }
  />
);

const sfxGainFor = ({withSfx, withVoice}: ReelProps) => (withSfx ? (withVoice ? SFX_UNDER_VOICE : 1) : 0);

export const ReelFull: React.FC<ReelProps> = (props) => (
  <AbsoluteFill style={{background: '#000'}}>
    <World offset={0} />
    {PHASES.map((p) => (
      <Sequence key={p.key} from={START[p.key]} durationInFrames={p.dur} name={p.id}>
        <PhaseBody k={p.key} dur={p.dur} sfxGain={sfxGainFor(props)} />
      </Sequence>
    ))}
    <GrainLayer offset={0} />
    {props.withMusic ? <Music from={0} len={TOTAL} duck={props.withVoice} /> : null}
    {props.withVoice ? <Voice from={0} len={TOTAL} /> : null}
  </AbsoluteFill>
);

export const makePhase = (k: PhaseKey) => {
  const p = PHASES.find((x) => x.key === k)!;
  const Phase: React.FC<ReelProps> = (props) => (
    <AbsoluteFill style={{background: '#000'}}>
      <World offset={START[k]} />
      <PhaseBody k={k} dur={p.dur} sfxGain={sfxGainFor(props)} />
      <GrainLayer offset={START[k]} />
      {props.withMusic ? <Music from={START[k]} len={p.dur} duck={props.withVoice} /> : null}
      {props.withVoice ? <Voice from={START[k]} len={p.dur} /> : null}
    </AbsoluteFill>
  );
  return Phase;
};
