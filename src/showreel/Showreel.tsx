import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, EASE_CAM, FONT} from './theme';
import {CUTS, DURATION, FPS, INNER_CUTS, sec, ShotId, TIMED_SHOTS, VO_CUES, VO_OFFSET} from './timeline';
import {prog} from './util';
import {ChromaticCut, Grain, Vignette} from './components/FilmFx';
import {StripeWipe} from './components/Fx';
import {Sh01Intro} from './scenes/Sh01Intro';
import {Sh02Nacht} from './scenes/Sh02Nacht';
import {Sh03Baustelle} from './scenes/Sh03Baustelle';
import {Sh04Sagen} from './scenes/Sh04Sagen';
import {Sh05Rechenweg} from './scenes/Sh05Rechenweg';
import {Sh06Unterschrift} from './scenes/Sh06Unterschrift';
import {Sh07Uebergabe} from './scenes/Sh07Uebergabe';
import {Sh08Pruefen} from './scenes/Sh08Pruefen';
import {Sh09Cockpit} from './scenes/Sh09Cockpit';
import {Sh10Cashflow} from './scenes/Sh10Cashflow';
import {Sh11Befehl} from './scenes/Sh11Befehl';
import {Sh12Archiv} from './scenes/Sh12Archiv';
import {Sh13Outro} from './scenes/Sh13Outro';
import {ReelSfx} from './Sfx';

export type ShowreelProps = {
  /** Show shot name, timecode and the current voice line (for syncing in the Studio). */
  showMarkers: boolean;
  /** Sound design (whooshes, clicks, hits from public/sfx). */
  withSfx: boolean;
};

export type SceneProps = {dur: number};

const SCENES: Record<ShotId, React.FC<SceneProps>> = {
  intro: Sh01Intro,
  nacht: Sh02Nacht,
  baustelle: Sh03Baustelle,
  sagen: Sh04Sagen,
  rechenweg: Sh05Rechenweg,
  unterschrift: Sh06Unterschrift,
  uebergabe: Sh07Uebergabe,
  pruefen: Sh08Pruefen,
  cockpit: Sh09Cockpit,
  cashflow: Sh10Cashflow,
  befehl: Sh11Befehl,
  archiv: Sh12Archiv,
  outro: Sh13Outro,
};

// Shots that open with the PDF-stripe transition: the previous shot keeps
// running for STRIPE_LEN frames and is cut away along the stripes.
const STRIPE_IN: ShotId[] = ['baustelle', 'outro'];
const STRIPE_LEN = 18;

const hasFile = (name: string) => {
  try {
    return getStaticFiles().some((f) => f.name === name);
  } catch {
    return false;
  }
};

const Markers: React.FC = () => {
  const f = useCurrentFrame();
  const s = [...TIMED_SHOTS].reverse().find((t) => f >= t.from) ?? TIMED_SHOTS[0];
  const t = f / FPS;
  const cue = [...VO_CUES].reverse().find((c) => t >= c.at && t <= c.at + c.len + 0.3);
  const n = TIMED_SHOTS.indexOf(s) + 1;
  return (
    <div style={{position: 'absolute', left: 24, top: 20, right: 24, fontFamily: FONT, color: C.cyan, fontSize: 22, fontWeight: 600, letterSpacing: '0.04em', textShadow: '0 1px 4px #000'}}>
      {String(n).padStart(2, '0')} {s.id.toUpperCase()} · {Math.floor(t / 60)}:{(t % 60).toFixed(2).padStart(5, '0')} · f{f}
      {cue && <div style={{color: C.white, marginTop: 6, fontWeight: 500}}>VO {cue.line}: {cue.text}</div>}
    </div>
  );
};

/** Music sits under the voice and ducks while a voice line is running. */
const musicVolume = (f: number, withVo: boolean) => {
  const t = f / FPS;
  const fadeIn = interpolate(f, [0, sec(1.5)], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [DURATION - sec(2.5), DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let duck = 0;
  if (withVo) {
    for (const c of VO_CUES) {
      const a = c.at + VO_OFFSET;
      const v = Math.min(prog(t, a - 0.25, a + 0.1), 1 - prog(t, a + c.len, a + c.len + 0.6));
      duck = Math.max(duck, v);
    }
  }
  return 0.55 * fadeIn * fadeOut * (1 - 0.55 * duck);
};

export const Showreel: React.FC<ShowreelProps> = ({showMarkers, withSfx}) => {
  const withVo = hasFile('voiceover.mp3');
  const withMusic = hasFile('music.mp3');
  return (
    <AbsoluteFill style={{background: C.bg0}}>
      <ChromaticCut cuts={[...CUTS, ...INNER_CUTS]}>
        {TIMED_SHOTS.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
              <Scene dur={s.dur} />
            </Sequence>
          );
        })}
        {/* stripe transitions sit on top: the outgoing shot keeps running and is cut away along the stripes */}
        {TIMED_SHOTS.slice(1).map((next, i) => {
          if (!STRIPE_IN.includes(next.id)) return null;
          const prev = TIMED_SHOTS[i];
          const Scene = SCENES[prev.id];
          return (
            <Sequence key={`${prev.id}-out`} from={next.from} durationInFrames={STRIPE_LEN} name={`${prev.id} → stripes`}>
              <StripeOut dur={prev.dur} len={STRIPE_LEN}>
                <Sequence from={-prev.dur}>
                  <Scene dur={prev.dur} />
                </Sequence>
              </StripeOut>
            </Sequence>
          );
        })}
      </ChromaticCut>
      <Vignette />
      <Grain />
      {withVo && (
        <Sequence from={sec(VO_OFFSET)}>
          <Audio src={staticFile('voiceover.mp3')} />
        </Sequence>
      )}
      {withMusic && <Audio src={staticFile('music.mp3')} volume={(f) => musicVolume(f, withVo)} />}
      {withSfx && <ReelSfx />}
      {showMarkers && <Markers />}
    </AbsoluteFill>
  );
};

const StripeOut: React.FC<{dur: number; len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, len, EASE_CAM);
  return <StripeWipe p={p * 1.25}>{children}</StripeWipe>;
};
