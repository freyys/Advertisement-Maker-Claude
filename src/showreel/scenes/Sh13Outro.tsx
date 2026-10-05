import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, EASE_IN, FONT} from '../theme';
import {beat} from '../timeline';
import {mix, pop, prog, useFormat} from '../util';
import {PulseRings} from '../components/Fx';
import {GLYPHS} from '../../components/Logo';

// 1:09 – Back to black. "Offline · Daten bleiben hier" with the pulsing green
// dot from the sidebar; the dot turns cyan and becomes the full stop of
// "Kavox.", then the tagline. The last frames hold still.

const mixColor = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`;
const GREEN: [number, number, number] = [52, 211, 153];
const CYAN: [number, number, number] = [91, 200, 232];

export const Sh13Outro: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {W, H, v} = useFormat();
  const tOff = beat('outro', 'offline');
  const tCollapse = beat('outro', 'collapse');
  const tLogo = beat('outro', 'logo');
  const tTag = beat('outro', 'tagline');
  const hold = dur - 20; // last 20 frames are completely still
  const ff = Math.min(f, hold);

  // ---- "Offline · Daten bleiben hier" ----
  const textSize = v ? 52 : 62;
  const dotD = textSize * 0.36;
  const words = ['Offline', '·', 'Daten', 'bleiben', 'hier'];
  const textOut = prog(ff, tCollapse, tCollapse + 12, EASE_IN);
  const rowW = textSize * 12.7 + dotD * 1.9; // approx. width of dot + text
  const row = {x: W / 2 - rowW / 2, y: H / 2 - (v ? 120 : 60)};

  // ---- logo ----
  const wmW = v ? 640 : 760;
  const wmH = wmW / 4.7229;
  const logoY = H / 2 - wmH / 2 - (v ? 120 : 70);
  const logoX = W / 2 - (wmW + wmH * 0.22) / 2;
  const periodD = wmH * 0.15;
  const period = {x: logoX + wmW + wmH * 0.07 + periodD / 2, y: logoY + wmH * 0.865 - periodD / 2};

  // the dot: born green next to "Offline", lands as the cyan full stop
  const dotIn = pop(ff, tOff, {damping: 11, stiffness: 160});
  const move = prog(ff, tCollapse + 2, tLogo + 14, EASE_CAM);
  const start = {x: row.x + dotD / 2, y: row.y + textSize * 0.62};
  const arc = Math.sin(Math.PI * move) * -60;
  const dx = mix(start.x, period.x, move);
  const dy = mix(start.y, period.y, move) + arc;
  const d = mix(dotD, periodD, move);
  const landed = ff >= tLogo + 14;
  const landFlash = landed ? Math.exp(-(ff - tLogo - 14) / 8) : 0;
  const dotColor = mixColor(GREEN, CYAN, prog(ff, tCollapse + 4, tLogo + 10));
  const pulse = ff < tCollapse ? Math.exp(-Math.pow((((ff - tOff - 10) % 26) - 4) / 4, 2)) : 0;

  const glyphAt = [tLogo, tLogo + 4, tLogo + 7, tLogo + 10, tLogo + 13];
  const bloom = prog(ff, tLogo - 2, tLogo + 10) * (1 - prog(ff, tLogo + 10, tLogo + 40));

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* faint cyan haze behind the logo */}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - W * 0.45,
          top: logoY + wmH / 2 - W * 0.3,
          width: W * 0.9,
          height: W * 0.6,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(91,200,232,0.16), rgba(91,200,232,0))',
          opacity: prog(ff, tLogo, tLogo + 30, EASE) + bloom,
        }}
      />

      {/* offline line */}
      <div
        style={{
          position: 'absolute',
          left: row.x + dotD * 1.9,
          top: row.y,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: textSize,
          letterSpacing: '-0.01em',
          color: C.white,
          whiteSpace: 'nowrap',
          opacity: 1 - textOut,
          filter: textOut > 0.01 ? `blur(${textOut * 12}px)` : undefined,
          transform: `translateX(${-textOut * 30}px)`,
        }}
      >
        {words.map((w, i) => {
          const t = prog(ff, tOff + 4 + i * 4, tOff + 20 + i * 4, EASE);
          return (
            <span key={i} style={{display: 'inline-block', marginRight: textSize * 0.26, opacity: t, transform: `translateY(${(1 - t) * 20}px)`, filter: t < 0.98 ? `blur(${(1 - t) * 8}px)` : undefined, color: w === '·' ? C.muted : undefined}}>
              {w}
            </span>
          );
        })}
      </div>

      {/* wordmark */}
      <svg
        width={wmW}
        height={wmH}
        viewBox="0 0 472.29 100"
        style={{position: 'absolute', left: logoX, top: logoY, overflow: 'visible'}}
      >
        {GLYPHS.map((p, i) => {
          const t = prog(ff, glyphAt[i], glyphAt[i] + 16, EASE);
          return <path key={i} d={p} fill={C.white} fillRule="evenodd" opacity={t} transform={`translate(${(1 - t) * (i === 0 ? 0 : -26)} ${i === 0 ? (1 - t) * 14 : 0})`} />;
        })}
      </svg>

      {/* the dot */}
      <div style={{position: 'absolute', left: dx - d / 2, top: dy - d / 2, width: d, height: d}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: dotColor,
            transform: `scale(${dotIn * (1 + 0.25 * pulse + 0.4 * landFlash)})`,
            boxShadow: `0 0 ${d * (1 + pulse + 2 * landFlash)}px ${dotColor}`,
          }}
        />
        {ff < tCollapse && <PulseRings at={tOff + 10} every={26} count={4} size={d} spread={2.2} life={34} color="52,211,153" />}
      </div>

      {/* tagline */}
      <div style={{position: 'absolute', left: 0, right: 0, top: logoY + wmH + (v ? 90 : 70), display: 'flex', justifyContent: 'center'}}>
        <TagLine f={ff} at={tTag} size={v ? 66 : 58} text={v ? 'Angebote, die sich\nselbst schreiben.' : 'Angebote, die sich selbst schreiben.'} />
      </div>
    </AbsoluteFill>
  );
};

const TagLine: React.FC<{f: number; at: number; size: number; text: string}> = ({f, at, size, text}) => {
  const lines = text.split('\n');
  const dotAt = at + 22;
  const dot = pop(f, dotAt, {damping: 9, stiffness: 220, mass: 0.6});
  return (
    <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: '-0.025em', color: 'rgba(244,246,248,0.9)', textAlign: 'center', lineHeight: 1.12}}>
      {lines.map((l, li) => {
        const isLast = li === lines.length - 1;
        const body = isLast ? l.slice(0, -1) : l;
        const t = prog(f, at + li * 6, at + li * 6 + 18, EASE);
        return (
          <div key={li} style={{opacity: t, transform: `translateY(${(1 - t) * 18}px)`, filter: t < 0.98 ? `blur(${(1 - t) * 8}px)` : undefined, whiteSpace: 'nowrap'}}>
            {body}
            {isLast && (
              <span style={{display: 'inline-block', color: C.cyan, transformOrigin: '50% 82%', transform: `scale(${dot})`, opacity: f >= dotAt ? 1 : 0, textShadow: `0 0 ${size * 0.3 * dot}px rgba(91,200,232,0.9)`}}>.</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
