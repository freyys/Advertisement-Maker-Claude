// P02 · Cockpit: the desktop app tilts in, the camera pushes onto the KPI
// cards (they count up), then pulls back to "Als nächstes" + "Schnellstart".
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions} from '../copy';
import {Caption, CutFlash, ease, prog, UnderCaption, Whip} from '../kit/stage';
import {camAt, CONTENT_X, DesktopApp, DesktopShot} from '../kit/desktop';
import {COCKPIT_Y, CockpitPage, STAT_W, STAT_X} from '../pages/Cockpit';
import {CutWhoosh, S} from '../kit/sfx';

const cx = (i: number) => CONTENT_X + STAT_X[i] + STAT_W / 2;

export const P02Cockpit: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const cardsY = COCKPIT_Y.stats + 61;
  const cam = camAt(frame, [
    [0, {fx: 720, fy: 450, s: 0.68, rx: 24, ry: -20, rz: 6}],
    [34, {fx: 720, fy: 400, s: 0.74, rx: 8, ry: -6, rz: 1.5}],
    [62, {fx: (cx(0) + cx(1)) / 2, fy: cardsY, s: 1.72, rx: 0, ry: 4, rz: 0}],
    [90, {fx: (cx(0) + cx(1)) / 2 + 12, fy: cardsY, s: 1.76, rx: 0, ry: 2}],
    [108, {fx: (cx(2) + cx(3)) / 2, fy: cardsY, s: 1.74, rx: 0, ry: -3}],
    [130, {fx: (cx(2) + cx(3)) / 2 + 10, fy: cardsY, s: 1.78, rx: 0, ry: -2}],
    [150, {fx: CONTENT_X + 490, fy: COCKPIT_Y.sections + 120, s: 1.1, rx: 6, ry: 8}],
    [dur, {fx: CONTENT_X + 490, fy: COCKPIT_Y.sections + 130, s: 1.14, rx: 3, ry: 5}],
  ]);
  const count = (a: number) => prog(frame, a, a + 34, ease.out);
  const stats = [count(46), count(52), count(94), count(100)];
  const statsIn = [0, 1, 2, 3].map((i) => prog(frame, 10 + i * 4, 30 + i * 4, ease.out));
  const next = [0, 1].map((i) => prog(frame, 128 + i * 6, 148 + i * 6, ease.out));
  const quick = [0, 1, 2, 3].map((i) => prog(frame, 134 + i * 4, 150 + i * 4, ease.out));
  const glowCard = frame < 100 ? 1 : 3;
  const glow = frame < 100 ? prog(frame, 70, 80) * (1 - prog(frame, 92, 102)) : prog(frame, 116, 126) * (1 - prog(frame, 136, 146));
  const badgePulse = (frame % 30) / 30;

  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={500}>
        <DesktopShot cam={cam} cy={1190}>
          <DesktopApp active="cockpit" badgePulse={badgePulse}>
            <CockpitPage
              s={{
                stats,
                statsIn,
                trend: prog(frame, 118, 128),
                next,
                quick,
                recent: [1, 1, 1, 1, 1],
                glowCard,
                glow,
              }}
            />
          </DesktopApp>
        </DesktopShot>
        </UnderCaption>
      </Whip>
      <Caption c={captions.cockpit} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={44} src="whoosh-soft.wav" vol={0.5} />
      <S at={96} src="whoosh-soft.wav" vol={0.45} />
      <S at={76} src="tick.wav" vol={0.6} />
      <S at={124} src="tick.wav" vol={0.6} />
      <S at={138} src="whoosh-a.wav" vol={0.35} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
