// P07 · Angebot erstellen mit Live-PDF-Vorschau: the customer is typed in,
// the stepper ticks through, the preview builds row by row, the totals count
// and the pointer clicks "Angebot generieren".
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {angebot, captions} from '../copy';
import {Caption, CutFlash, ease, keys, prog, Pointer, UnderCaption, Whip} from '../kit/stage';
import {camAt, DesktopApp, DesktopShot} from '../kit/desktop';
import {AngebotPage, BUTTON} from '../pages/Angebot';
import {CutWhoosh, S, Ticks} from '../kit/sfx';
import {d} from '../tokens';

const T = {name: [26, 40] as const, addr: [42, 62] as const, rows: [80, 122] as const, totals: [118, 146] as const, click: 164};

export const P07Angebot: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const bx = BUTTON.x + BUTTON.w / 2;
  const by = BUTTON.y + BUTTON.h / 2;
  const cam = camAt(frame, [
    [0, {fx: 700, fy: 470, s: 0.72, rx: 20, ry: 18, rz: -4}],
    [26, {fx: 640, fy: 560, s: 1.5, rx: 0, ry: 6, rz: 0}],
    [62, {fx: 650, fy: 570, s: 1.55, ry: 4}],
    [82, {fx: 1206, fy: 400, s: 1.3, ry: -6}],
    [118, {fx: 1206, fy: 430, s: 1.42, ry: -3}],
    [136, {fx: 1000, fy: 820, s: 1.35, rx: 6, ry: 0}],
    [154, {fx: bx - 60, fy: by - 10, s: 1.85, rx: 2}],
    [dur, {fx: bx - 40, fy: by - 6, s: 2.05, rx: 0}],
  ]);
  const step = (i: number) => prog(frame, 36 + i * 20, 46 + i * 20, ease.out);
  const press = keys(frame, [[T.click - 3, 0], [T.click, 1], [T.click + 7, 0]]);
  const pulse = (frame >= T.rows[0] && frame < T.rows[1] + 10 ? 0.5 + 0.5 * Math.sin(frame * 0.5) : 0) * 0.6;
  const px = keys(frame, [[140, BUTTON.x + 420], [160, bx + 30]], ease.inOut);
  const py = keys(frame, [[140, BUTTON.y + 140], [160, by + 4]], ease.inOut);
  const pointerIn = prog(frame, 138, 146);
  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <DesktopShot cam={cam} cy={1220}>
            <DesktopApp
              active="angebot"
              overlay={
                <>
                  <Pointer x={px} y={py} size={22} press={press} opacity={pointerIn} />
                  {frame >= T.click ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: bx - 160,
                        top: by - 160,
                        width: 320,
                        height: 320,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(255,255,255,${0.7 * (1 - prog(frame, T.click, T.click + 12))}) 0%, rgba(92,196,228,${0.4 * (1 - prog(frame, T.click, T.click + 14))}) 30%, transparent 65%)`,
                        transform: `scale(${0.4 + prog(frame, T.click, T.click + 12, ease.out) * 1.4})`,
                      }}
                    />
                  ) : null}
                </>
              }
            >
              <AngebotPage
                frame={frame}
                s={{
                  steps: [step(0), step(1), step(2), step(3), step(4)],
                  name: (angebot.customer.length + 0.99) * prog(frame, T.name[0], T.name[1], ease.soft),
                  address: prog(frame, T.addr[0], T.addr[1], ease.soft),
                  pdfHead: prog(frame, 64, 80),
                  pdfRows: 5 * prog(frame, T.rows[0], T.rows[1], ease.inOut),
                  pdfSub: prog(frame, T.rows[1] - 2, T.rows[1] + 8),
                  totals: prog(frame, T.totals[0], T.totals[1], ease.out),
                  press,
                  btnGlow: prog(frame, 146, 160) * (1 - prog(frame, T.click + 2, T.click + 10)) + press,
                  pulse,
                }}
              />
            </DesktopApp>
          </DesktopShot>
        </UnderCaption>
      </Whip>
      <Caption c={captions.angebot} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} color={d.accent} />
      <Ticks from={T.name[0]} to={T.name[1]} n={6} vol={0.4} />
      <Ticks from={T.addr[0]} to={T.addr[1]} n={10} vol={0.35} />
      {[0, 1, 2, 3, 4].map((i) => (
        <S key={i} at={40 + i * 20} src="tick.wav" vol={0.55} />
      ))}
      <S at={70} src="whoosh-soft.wav" vol={0.45} />
      <S at={128} src="whoosh-soft.wav" vol={0.45} />
      <S at={T.click} src="click.wav" vol={0.85} />
      <S at={T.click} src="shimmer.wav" vol={0.4} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
