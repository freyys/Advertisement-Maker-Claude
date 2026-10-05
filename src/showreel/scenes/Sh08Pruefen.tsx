import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, EASE_IN} from '../theme';
import {beat} from '../timeline';
import {D07, IMG} from '../assets';
import {mix, pop, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Display, lerpRect, viewAt} from '../components/Display';
import {Highlight} from '../components/Screen';
import {Headline} from '../components/Headline';
import {LightSweep} from '../components/Fx';

// 0:44 – The automatic check: the stepper ticks off one by one, then a cut to
// the finished PDF falling onto the desk while its stripes draw in.

const Check: React.FC<{x: number; y: number; r: number; t: number; ring?: boolean; burst: number}> = ({x, y, r, t, ring, burst}) => (
  <div style={{position: 'absolute', left: x - r * 1.9, top: y - r * 1.9, width: r * 3.8, height: r * 3.8}}>
    {/* cover the original tick */}
    <div style={{position: 'absolute', inset: r * 0.3, borderRadius: '50%', background: '#0A0A0B'}} />
    <svg width={r * 3.8} height={r * 3.8} viewBox="-19 -19 38 38" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`scale(${t})`}>
        {ring && <circle r="15.5" fill="none" stroke={C.cyanUi} strokeWidth="1.2" opacity={0.9} />}
        <circle r="10" fill={C.cyanUi} />
        <path d="M-4.2 0.2 L-1.2 3.1 L4.4 -2.8" fill="none" stroke="#0B2F44" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {burst > 0 && burst < 1 && <circle r={10 + 16 * burst} fill="none" stroke={C.cyan} strokeWidth={2.5 * (1 - burst)} opacity={1 - burst} />}
    </svg>
  </div>
);

// Diagonal stripe bands of the PDF (source px of 06_Fertiges_Angebot_PDF.png).
const TR_BAND = '1452,-4 1566,-4 1792,232 1792,346';
// bottom-left band, split around the white footer text box
const BL_BAND_A = '-4,2180 -4,2290 108,2405 228,2405';
const BL_BAND_B = '170,2470 290,2470 360,2532 236,2532';

const front = (c: number) => `${c + 3000},-3000 ${c - 5000},5000 20000,20000`;

const PdfStripes: React.FC<{t1: number; t2: number}> = ({t1, t2}) => (
  <svg width={1786} height={2526} viewBox="0 0 1786 2526" style={{position: 'absolute', inset: 0}}>
    <defs>
      <clipPath id="pdf-tr">
        <polygon points={TR_BAND} />
      </clipPath>
      <clipPath id="pdf-bl">
        <polygon points={BL_BAND_A} />
        <polygon points={BL_BAND_B} />
      </clipPath>
    </defs>
    {/* white covers that retreat along the stripes, so they draw in */}
    <g clipPath="url(#pdf-tr)">
      <polygon points={front(mix(1450, 2140, t1))} fill="#fff" />
    </g>
    <g clipPath="url(#pdf-bl)">
      <polygon points={front(mix(2175, 2900, t2))} fill="#fff" />
    </g>
  </svg>
);

export const Sh08Pruefen: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tC1 = beat('pruefen', 'check1');
  const every = beat('pruefen', 'checkEvery');
  const tPan = beat('pruefen', 'pan');
  const tSweep = beat('pruefen', 'sweep');
  const tPdf = beat('pruefen', 'pdf');
  const tStripes = beat('pruefen', 'stripes');
  const tSend = dur - 22;

  const headline = (
    <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 230 : 120}}>
      <Headline text={'Geprüft.\nGesendet.'} at={tC1 + 8} size={v ? 100 : 108} wordAt={[tC1 + 8, tPdf + 14]} />
    </div>
  );

  if (f < tPdf) {
    // ---- part A: automatic check on the desktop ----
    const aspect = v ? 1000 / 1050 : 16 / 9;
    const dw = v ? 1000 : 1340;
    const dh = dw / aspect;
    const pan = prog(f, tPan, tSweep + 6, EASE_CAM);
    const view = lerpRect(
      v ? viewAt(1250, 560, 1020, aspect) : viewAt(1255, 290, 1030, aspect),
      v ? viewAt(1330, 1110, 1100, aspect) : viewAt(1330, 1250, 1500, aspect),
      pan,
    );
    const cam = prog(f, 0, tPdf, EASE_CAM);
    return (
      <AbsoluteFill>
        <Stage glowX={0.55} glowY={0.5} />
        <Camera>
          <Plane w={dw} h={dh} x={v ? 0 : 240} y={v ? 100 : 70} z={cam * 80} rx={8} ry={mix(-9, -4, cam)}>
            <Display img={IMG.d07} view={view} w={dw} h={dh}>
              {D07.checks.map((c, i) => {
                const at = tC1 + i * every;
                return <Check key={i} x={c.x} y={c.y} r={D07.checkR} t={pop(f, at, {damping: 10, stiffness: 240})} ring={i === 2} burst={prog(f, at, at + 14, EASE)} />;
              })}
              <Highlight rect={D07.roomRow} t={prog(f, tSweep, tSweep + 10) * (1 - prog(f, tPdf - 8, tPdf))} radius={18} pad={4} />
              <div style={{position: 'absolute', left: D07.roomRow.x, top: D07.roomRow.y, width: D07.roomRow.w, height: D07.roomRow.h, overflow: 'hidden', borderRadius: 18}}>
                <LightSweep t={prog(f, tSweep + 4, tSweep + 30, EASE_CAM)} strength={0.18} />
              </div>
            </Display>
          </Plane>
        </Camera>
        {headline}
      </AbsoluteFill>
    );
  }

  // ---- part B: the finished PDF falls onto the desk ----
  const g = f - tPdf;
  const fall = prog(g, 0, 24, EASE);
  const settle = prog(g, 0, dur - tPdf, EASE_CAM);
  const send = prog(f, tSend, dur, EASE_IN);
  const sh = v ? 1120 : 960;
  const sw = sh * (1786 / 2526);
  const k = sw / 1786;
  const land = g >= 20 ? Math.exp(-(g - 20) / 8) : 0;
  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.62} glowY={0.55} glow={1 + land * 0.8} />
      <Camera perspective={2600}>
        {/* contact shadow */}
        <Plane w={sw * 1.1} h={sh * 0.95} x={(v ? 0 : 280) + send * 1500} y={v ? 260 : 40} z={-60} rx={8} opacity={fall * (1 - send) * 0.8}>
          <div style={{width: '100%', height: '100%', borderRadius: 30, background: 'rgba(0,0,0,0.9)', filter: `blur(${50 - 30 * fall}px)`}} />
        </Plane>
        <Plane
          w={sw}
          h={sh}
          x={(v ? 0 : 270) + send * 1600}
          y={(v ? 230 : 20) + (1 - fall) * -700}
          z={(1 - fall) * 500}
          rx={mix(-72, 7, fall) - send * 10}
          ry={mix(18, -6, fall) + settle * 3}
          rz={mix(-16, -3, fall) + send * 14}
          scale={1 + settle * 0.05}
        >
          <div style={{position: 'relative', width: sw, height: sh, background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.55)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1786, height: 2526, transformOrigin: '0 0', transform: `scale(${k})`}}>
              <Img src={IMG.d06.src} style={{position: 'absolute', inset: 0, width: 1786, height: 2526}} />
              <PdfStripes t1={prog(f, tStripes, tStripes + 16, EASE)} t2={prog(f, tStripes + 8, tStripes + 26, EASE)} />
            </div>
            <LightSweep t={prog(g, 18, 52, EASE_CAM)} strength={0.35} angle={120} />
          </div>
        </Plane>
      </Camera>
      {headline}
    </AbsoluteFill>
  );
};
