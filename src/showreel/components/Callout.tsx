import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, EASE, FONT, tabular} from '../theme';
import {countTo, eur, prog} from '../util';

/**
 * Floating glass card with a euro amount that counts up to the real value
 * (German format). Starts out of focus and pulls sharp.
 */
export const Callout: React.FC<{
  label: string;
  value: number;
  at: number; // appear
  countFrom?: number;
  countTo?: number;
  size?: number;
  accent?: string; // rgb triplet
  sub?: string;
  format?: (n: number) => string;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}> = ({label, value, at, countFrom, countTo: countEnd, size = 84, accent = '91,200,232', sub, format = eur, align = 'left', style}) => {
  const f = useCurrentFrame();
  const t = prog(f, at, at + 18, EASE);
  const focus = prog(f, at, at + 22, EASE);
  const c0 = countFrom ?? at + 4;
  const c1 = countEnd ?? c0 + 40;
  const v = countTo(f, c0, c1, value);
  const done = f >= c1;
  const flash = done ? Math.max(0, 1 - (f - c1) / 14) : 0;
  const finalText = format(value);
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: `${size * 0.26}px ${size * 0.36}px ${size * 0.3}px`,
        borderRadius: size * 0.28,
        background: 'linear-gradient(160deg, rgba(22,30,36,0.86), rgba(10,13,16,0.78))',
        border: `1.5px solid rgba(${accent},${0.25 + 0.35 * flash + 0.15 * t})`,
        boxShadow: `0 ${size * 0.3}px ${size}px rgba(0,0,0,0.55), 0 0 ${size * (0.5 + flash)}px rgba(${accent},${0.18 + 0.3 * flash})`,
        opacity: t,
        transform: `scale(${0.9 + 0.1 * t})`,
        filter: focus < 0.99 ? `blur(${(1 - focus) * 14}px)` : undefined,
        textAlign: align,
        fontFamily: FONT,
        ...style,
      }}
    >
      <div style={{fontWeight: 700, fontSize: size * 0.26, letterSpacing: '0.16em', color: `rgb(${accent})`, marginBottom: size * 0.06}}>
        {label}
      </div>
      <div style={{position: 'relative', fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', color: C.white, lineHeight: 1.05, ...tabular}}>
        {/* reserve the final width so the card never jitters */}
        <span style={{visibility: 'hidden'}}>{finalText}</span>
        <span style={{position: 'absolute', right: 0, top: 0, whiteSpace: 'nowrap', textShadow: `0 0 ${30 * flash}px rgba(${accent},0.8)`}}>
          {done ? finalText : format(v)}
        </span>
      </div>
      {sub && (
        <div style={{fontWeight: 500, fontSize: size * 0.24, color: C.muted, marginTop: size * 0.08, letterSpacing: '0.01em'}}>{sub}</div>
      )}
    </div>
  );
};
