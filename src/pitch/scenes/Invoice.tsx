import React from 'react';
import {AbsoluteFill} from 'remotion';
import {IMG} from '../../showreel/assets';
import {B, EASE, EASE_CAM, EASE_IO, FONT, HY} from '../theme';
import {keys, pop, prog, tween} from '../../showreel/util';
import {Check, Pill, Place, Ring, Shot, Space3D, useShotFrame} from '../ui';
import {TextBlock} from './common';
import type {SceneProps} from '../Pitch';

// 0:11 – 0:13. The document archive, and in front of it the accepted quote
// card: the cursor clicks "Create invoice" and the card flips into the
// validated e-invoice.
const PW = 1060;
const PH = (IMG.d04.h / IMG.d04.w) * PW;
const CW = 560;
const CH = 300;
const CLICK = 19;

const face: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 26,
  background: '#FAF8F3',
  boxShadow: '0 0 0 1px rgba(10,10,12,0.07), 0 36px 70px -16px rgba(40,24,90,0.45), 0 10px 22px rgba(10,10,12,0.12)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  padding: '34px 38px',
  boxSizing: 'border-box',
  fontFamily: FONT,
  color: B.ink,
};

const Label: React.FC<{kind: string; tag: string}> = ({kind, tag}) => (
  <div style={{display: 'flex', gap: 12, fontSize: 16, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase'}}>
    <span style={{color: B.hyacinth}}>{kind}</span>
    <span style={{color: B.grey}}>{tag}</span>
  </div>
);

const Cursor: React.FC<{x: number; y: number; down: number}> = ({x, y, down}) => (
  <svg width={34} height={40} viewBox="0 0 34 40" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.12 * down})`, transformOrigin: '0 0', overflow: 'visible'}}>
    <path d="M2 2 L2 31 L10 24 L15.5 36 L21 33.5 L15.8 22 L27 22 Z" fill={B.black} stroke="#fff" strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

export const Invoice: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  const c = copy.invoice;
  const enter = prog(f, 0, 20, EASE);
  const cardIn = pop(f, 3, {damping: 15, stiffness: 150});
  const flip = prog(f, CLICK + 2, CLICK + 16, EASE_IO);
  const press = prog(f, CLICK - 2, CLICK, EASE) * (1 - prog(f, CLICK + 1, CLICK + 6));
  // cursor: glides in from the lower right onto the button, clicks, leaves
  const cx = keys(f, [[4, 720], [CLICK - 2, 420], [CLICK + 8, 470]], EASE);
  const cy = keys(f, [[4, 420], [CLICK - 2, 238], [CLICK + 8, 330]], EASE);
  const cursorOpacity = prog(f, 4, 9) * (1 - prog(f, CLICK + 4, CLICK + 9));
  const backCheck = prog(f, CLICK + 14, CLICK + 24, EASE);

  return (
    <AbsoluteFill>
      <Space3D perspective={2100}>
        <Place x={1350} y={470 + 80 * (1 - enter)} z={-380 * (1 - enter)} rx={tween(f, 0, 20, 26, 6)} ry={keys(f, [[0, -8], [20, -15], [dur, -11]], EASE_CAM)} w={PW} h={PH}>
          <Shot img={IMG.d04} w={PW} />
        </Place>
        {/* the quote card flips into the invoice */}
        <Place x={1110} y={790 + 200 * (1 - cardIn)} z={240} rx={4} ry={-10 + 180 * flip} rz={-2 + 2 * flip} w={CW} h={CH} opacity={Math.min(1, cardIn * 2)}>
          <div style={face}>
            <Label kind={c.front.kicker} tag="AN-2026-041" />
            <div style={{fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 22}}>Familie Muster</div>
            <div style={{position: 'absolute', left: 38, bottom: 34}}>
              <Pill tone="outline" size={19}>
                <Check size={18} color={B.hyacinth} />
                {c.front.status}
              </Pill>
            </div>
            <div style={{position: 'absolute', right: 34, bottom: 30, transform: `scale(${1 - 0.06 * press})`}}>
              <Pill tone="hy" size={21} style={{boxShadow: `0 10px 26px -6px rgba(${HY},0.65)`}}>
                {c.front.button}
              </Pill>
            </div>
            <Ring f={f} at={CLICK} x={CW - 34 - 110} y={CH - 30 - 22} r={110} />
            <div style={{opacity: cursorOpacity}}>
              <Cursor x={cx} y={cy} down={press} />
            </div>
          </div>
          <div style={{...face, transform: 'rotateY(180deg)'}}>
            <Label kind={c.back.kicker} tag="ZUGFeRD · PDF + XML" />
            <div style={{fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 22}}>Familie Muster</div>
            <div style={{position: 'absolute', left: 38, bottom: 34}}>
              <Pill tone="hy" size={19}>
                <Check size={18} color="#fff" draw={backCheck} />
                {c.back.status}
              </Pill>
            </div>
          </div>
        </Place>
      </Space3D>
      <TextBlock f={f} n="04" kicker={c.kicker} title={c.title} sub={c.sub} />
    </AbsoluteFill>
  );
};
