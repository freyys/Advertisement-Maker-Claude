import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {FONT, palette, STAGE} from './theme';
import {SCENES, S8_BEATS} from './timeline';
import {ease, keys, prog} from './lib/anim';
import {AudioLayer, TeaserProps, TeaserStage} from './Teaser';
import {GrainVignette, rgba} from './components/Background';
import {S8Logo} from './scenes/S8Logo';

// 9:16 safe zone: top 220 px and bottom 380 px stay clear for platform UI.
const W = 1080;
const H = 1920;
const SAFE_TOP = 220;
const SAFE_BOTTOM = 380;
const PANEL_W = 1010;
const PANEL_H = Math.round((PANEL_W * 10) / 16); // 16:10
const PANEL_CY = SAFE_TOP + (H - SAFE_TOP - SAFE_BOTTOM) / 2;
const BEZEL = 12;

// The 16:9 stage covers the 16:10 screen (a few px trimmed at the sides).
const SCREEN_W = PANEL_W - BEZEL * 2;
const SCREEN_H = PANEL_H - BEZEL * 2;
const STAGE_SCALE = Math.max(SCREEN_W / STAGE.width, SCREEN_H / STAGE.height);

const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const b = Math.sin(t * 1.2) * 0.5 + 0.5;
  return (
    <AbsoluteFill style={{background: palette.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 95% 48% at 0% 6%, ${rgba(palette.blush, 0.55)} 0%, ${rgba(palette.violet, 0.45 + b * 0.08)} 26%, ${rgba(palette.indigo, 0.4)} 50%, transparent 78%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 100% 98%, ${rgba(palette.lavender, 0.6 + b * 0.08)} 0%, ${rgba(palette.violet, 0.4)} 30%, ${rgba(palette.indigo, 0.3)} 55%, transparent 80%)`,
        }}
      />
      {/* light spill of the screen onto the "desk" */}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - 620,
          top: PANEL_CY + PANEL_H / 2 - 40,
          width: 1240,
          height: 380,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 0%, ${rgba(palette.violet, 0.32)} 0%, ${rgba(palette.indigo, 0.18)} 40%, transparent 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const TeaserVertical: React.FC<TeaserProps> = (props) => {
  const frame = useCurrentFrame();
  // Gentle settle of the tilt + slow push, like a handheld phone shot
  const rotX = keys(frame, [
    [0, 9],
    [SCENES.S8.start, 7.5],
  ]);
  const rotY = Math.sin(frame / 55) * 1.2;
  const scale = keys(frame, [
    [0, 1],
    [SCENES.S8.start, 1.04],
  ], ease.soft);
  const glare = (frame % 240) / 240;

  // End card goes full-frame: the panel's bloom spills over the whole frame
  const full = prog(frame, S8_BEATS.bloom - 1, S8_BEATS.bloom + 3, ease.soft);

  return (
    <AbsoluteFill style={{fontFamily: FONT, background: palette.bg}}>
      <Ambient />
      {full < 1 ? (
        <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: `50% ${PANEL_CY}px`}}>
          <div
            style={{
              position: 'absolute',
              left: (W - PANEL_W) / 2,
              top: PANEL_CY - PANEL_H / 2,
              width: PANEL_W,
              height: PANEL_H,
              transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* bezel */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 26,
                background: 'linear-gradient(180deg, #1B1A22, #0B0B10)',
                boxShadow: [
                  'inset 0 0 0 1px rgba(255,255,255,0.10)',
                  '0 50px 120px rgba(0,0,0,0.7)',
                  `0 0 160px ${rgba(palette.violet, 0.35)}`,
                ].join(', '),
              }}
            />
            {/* screen */}
            <div
              style={{
                position: 'absolute',
                left: BEZEL,
                top: BEZEL,
                width: SCREEN_W,
                height: SCREEN_H,
                borderRadius: 16,
                overflow: 'hidden',
                background: palette.bg,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: (SCREEN_W - STAGE.width * STAGE_SCALE) / 2,
                  top: (SCREEN_H - STAGE.height * STAGE_SCALE) / 2,
                  width: STAGE.width,
                  height: STAGE.height,
                  transform: `scale(${STAGE_SCALE})`,
                  transformOrigin: '0 0',
                }}
              >
                <TeaserStage endCard />
              </div>
              {/* soft screen glare */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(115deg, rgba(255,255,255,0) ${glare * 120 - 40}%, rgba(255,255,255,0.07) ${glare * 120 - 22}%, rgba(255,255,255,0) ${glare * 120}%)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 35%)',
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
      {frame >= S8_BEATS.bloom - 2 ? (
        <AbsoluteFill style={{opacity: full}}>
          <CameraMotionBlur samples={8} shutterAngle={240}>
            <S8Logo width={W} height={H} standalone bloomY={PANEL_CY} />
          </CameraMotionBlur>
        </AbsoluteFill>
      ) : null}
      <GrainVignette seedOffset={5} />
      <AudioLayer {...props} />
    </AbsoluteFill>
  );
};
