// P10 · Dokumente-Archiv: counters count up, the list streams in, one
// invoice flips from "Offen" to "Bezahlt" (counters follow) and the
// Rechnungsausgangsbuch is exported as Excel.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions} from '../copy';
import {Caption, CutFlash, ease, prog, Pointer, UnderCaption, Whip} from '../kit/stage';
import {camAt, CONTENT_X, DesktopApp, DesktopShot} from '../kit/desktop';
import {DOCS_Y, DokumentePage} from '../pages/Dokumente';
import {CutWhoosh, S} from '../kit/sfx';

const T = {paid: 62, excel: 96};

export const P10Dokumente: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const cam = camAt(frame, [
    [0, {fx: 860, fy: 330, s: 0.8, rx: 16, ry: -14, rz: 3}],
    [22, {fx: CONTENT_X + 490, fy: 210, s: 1.12, rx: 0, ry: -3, rz: 0}],
    [44, {fx: CONTENT_X + 500, fy: 220, s: 1.16, ry: -2}],
    [60, {fx: CONTENT_X + 470, fy: DOCS_Y.rows + 70, s: 1.38, ry: 3}],
    [84, {fx: CONTENT_X + 480, fy: DOCS_Y.rows + 60, s: 1.42, ry: 2}],
    [98, {fx: CONTENT_X + 610, fy: DOCS_Y.excel + 60, s: 1.48, ry: 0}],
    [dur, {fx: CONTENT_X + 620, fy: DOCS_Y.excel + 50, s: 1.55}],
  ]);
  const counters = [0, 1, 2].map((i) => prog(frame, 8 + i * 3, 34 + i * 3, ease.out));
  const rows = [0, 1, 2, 3].map((i) => prog(frame, 30 + i * 5, 46 + i * 5, ease.out));
  const paid = prog(frame, T.paid, T.paid + 14, ease.inOut);
  const excel = prog(frame, T.excel, T.excel + 10, ease.out);
  const pillX = CONTENT_X + 727 + 40;
  const pillY = DOCS_Y.rows + 45;
  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <DesktopShot cam={cam} cy={1220}>
            <DesktopApp
              active="dokumente"
              overlay={
                <Pointer
                  x={frame < T.excel - 14 ? pillX + 30 - 30 * prog(frame, 48, T.paid, ease.inOut) : CONTENT_X + 160 + 40 * (1 - prog(frame, T.excel - 12, T.excel, ease.inOut))}
                  y={frame < T.excel - 14 ? pillY + 60 - 60 * prog(frame, 48, T.paid, ease.inOut) : DOCS_Y.excel + 26 + 120 * (1 - prog(frame, T.excel - 12, T.excel, ease.inOut))}
                  size={22}
                  press={prog(frame, T.paid - 2, T.paid) * (1 - prog(frame, T.paid + 2, T.paid + 8)) + prog(frame, T.excel - 2, T.excel) * (1 - prog(frame, T.excel + 2, T.excel + 8))}
                  opacity={prog(frame, 46, 52)}
                />
              }
            >
              <DokumentePage s={{counters, rows, paid, excel, chip: 0}} />
            </DesktopApp>
          </DesktopShot>
        </UnderCaption>
      </Whip>
      <Caption c={captions.archiv} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={10} src="whoosh-soft.wav" vol={0.4} />
      {[0, 1, 2, 3].map((i) => (
        <S key={i} at={32 + i * 5} src="tick.wav" vol={0.35} />
      ))}
      <S at={T.paid} src="click.wav" vol={0.7} />
      <S at={T.paid + 4} src="shimmer.wav" vol={0.4} />
      <S at={T.excel} src="click.wav" vol={0.7} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
