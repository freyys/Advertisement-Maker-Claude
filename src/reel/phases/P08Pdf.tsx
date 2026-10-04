// P08 · Fertiges Angebot-PDF: the page flies out of the "generieren" click,
// lands, and the table fills row by row up to the Zwischensumme.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions} from '../copy';
import {d, FONT, rgba} from '../tokens';
import {Caption, CutFlash, ease, keys, prog, rise, Sparkles, UnderCaption, Whip} from '../kit/stage';
import {A4H, A4W, PdfPage} from '../kit/pdf';
import {ICheck} from '../kit/icons';
import {CutWhoosh, S} from '../kit/sfx';

const PAGE_W = 860;
const Z = PAGE_W / A4W;

export const P08Pdf: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const land = prog(frame, 0, 20, ease.out);
  const scale = keys(frame, [[0, 0.25], [20, 1], [dur, 1.08]], ease.out);
  const rx = keys(frame, [[0, 40], [20, 8], [60, 4], [dur, 2]], ease.out);
  const ry = keys(frame, [[0, -30], [20, -8], [dur, 6]], ease.inOut);
  const rz = keys(frame, [[0, -14], [20, -2], [dur, 0]], ease.out);
  const ty = keys(frame, [[0, 420], [20, 0], [44, 0], [100, -300]], ease.inOut);
  const rows = 5 * prog(frame, 16, 62, ease.inOut);
  const sub = prog(frame, 60, 72);
  const hlRow = frame >= 64 && frame < 104 ? Math.min(4, Math.floor((frame - 64) / 8)) : -1;
  const badge = prog(frame, 74, 88, ease.out);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Whip frame={frame} dur={dur} noIn>
        <UnderCaption top={600}>
          {/* glow under the page */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 520,
              top: 760,
              width: 1040,
              height: 1000,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${rgba(d.accent, 0.22 * land)} 0%, transparent 65%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 540 - PAGE_W / 2,
              top: 660 + ty,
              width: PAGE_W,
              height: A4H * Z,
              transformOrigin: '50% 30%',
              transform: `perspective(2600px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
              opacity: Math.min(1, land * 3),
            }}
          >
            {/* page 2 peeking out behind */}
            <div
              style={{
                position: 'absolute',
                left: 26,
                top: 26,
                width: PAGE_W,
                height: A4H * Z,
                background: '#E9EDF1',
                borderRadius: 6,
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                transform: `rotate(${2.5 * land}deg)`,
              }}
            />
            <div style={{position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.65)'}}>
              <div style={{zoom: Z}}>
                <PdfPage rows={rows} sub={sub} head={prog(frame, 6, 18)} highlight={hlRow} />
              </div>
            </div>
          </div>
          {/* "PDF erstellt" badge */}
          <div
            style={{
              position: 'absolute',
              right: 70,
              top: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              height: 76,
              padding: '0 30px 0 22px',
              borderRadius: 38,
              background: 'rgba(12,30,24,0.92)',
              border: `1.5px solid ${rgba(d.green, 0.6)}`,
              color: d.green,
              fontSize: 30,
              fontWeight: 700,
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${rgba(d.green, 0.25)}`,
              ...rise(badge, 30, 8),
              transform: `translateY(${(1 - badge) * 30}px) scale(${0.85 + 0.15 * badge})`,
            }}
          >
            <div style={{width: 38, height: 38, borderRadius: 19, background: d.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ICheck size={22} color="#04241A" stroke={3.4} />
            </div>
            PDF erstellt · 2 Seiten
          </div>
          <Sparkles frame={frame} at={76} x={860} y={738} color={d.green} r={150} />
        </UnderCaption>
      </Whip>
      <Caption c={captions.pdf} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} color="#FFFFFF" />
      <S at={0} src="whoosh-b.wav" vol={0.55} />
      {[0, 1, 2, 3, 4].map((i) => (
        <S key={i} at={20 + i * 9} src="tick.wav" vol={0.4} />
      ))}
      <S at={74} src="shimmer.wav" vol={0.5} />
      <S at={46} src="whoosh-soft.wav" vol={0.35} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
