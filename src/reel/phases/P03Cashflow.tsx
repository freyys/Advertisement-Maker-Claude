// P03 · Cashflow-Radar: the cumulative payment curve draws itself, the total
// counts to 7.648,61 €, the camera pushes onto the total and then onto the
// overdue warning.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions} from '../copy';
import {Caption, CutFlash, ease, prog, UnderCaption, Whip} from '../kit/stage';
import {camAt, DesktopApp, DesktopShot} from '../kit/desktop';
import {COCKPIT_Y, CockpitPage} from '../pages/Cockpit';
import {CutWhoosh, S} from '../kit/sfx';

export const P03Cashflow: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const scroll = 715 - 90 * (1 - prog(frame, 0, 26, ease.out));
  const chartTop = COCKPIT_Y.chart - 715; // 365 in window coords
  const cam = camAt(frame, [
    [0, {fx: 870, fy: chartTop + 110, s: 1.0, rx: 14, ry: 12, rz: -2}],
    [24, {fx: 870, fy: chartTop + 130, s: 1.08, rx: 0, ry: 0, rz: 0}],
    [56, {fx: 870, fy: chartTop + 130, s: 1.1}],
    [74, {fx: 1175, fy: chartTop + 110, s: 1.85, ry: -3}],
    [90, {fx: 1190, fy: chartTop + 112, s: 1.9, ry: -2}],
    [104, {fx: 580, fy: chartTop + 200, s: 1.85, ry: 2}],
    [dur, {fx: 570, fy: chartTop + 204, s: 1.92, ry: 3}],
  ]);
  const draw = prog(frame, 10, 64, ease.inOut);
  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <DesktopShot cam={cam} cy={1220}>
            <DesktopApp
              active="cockpit"
              scrollY={scroll}
              sticky={{title: 'Cockpit', meta: '02 / 02 · Schnellstart', progress: 0.62, opacity: 1}}
            >
              <CockpitPage
                s={{
                  cashDraw: draw,
                  cashTotal: prog(frame, 16, 70, ease.out),
                  overdue: prog(frame, 94, 108, ease.out),
                  bars: (i) => prog(frame, 40 + i * 5, 64 + i * 5, ease.out),
                }}
              />
            </DesktopApp>
          </DesktopShot>
        </UnderCaption>
      </Whip>
      <Caption c={captions.cashflow} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={12} src="whoosh-soft.wav" vol={0.4} />
      <S at={64} src="whoosh-a.wav" vol={0.35} />
      <S at={70} src="shimmer.wav" vol={0.35} />
      <S at={96} src="whoosh-soft.wav" vol={0.4} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
