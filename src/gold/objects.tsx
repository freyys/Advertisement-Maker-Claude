import React from 'react';
import {FONT, GoldGradient} from './fx';

/** A cast gold bar seen slightly from above: tapered top face, front, right side. */
export const GoldBar: React.FC<{w?: number; shine?: number; id: string; stamp?: boolean}> = ({
  w = 420,
  shine = 0.3,
  id,
  stamp = true,
}) => {
  const h = w * 0.36; // front face height
  const d = w * 0.22; // visible depth of the top face
  const inset = w * 0.08;
  const side = w * 0.1;
  const vw = w + side + 4;
  const vh = h + d + 4;
  const sx = -w + shine * (w * 3);
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} style={{overflow: 'visible'}}>
      <defs>
        <GoldGradient id={`${id}-front`} />
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF0C2" />
          <stop offset="1" stopColor="#E0A93E" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A4E0E" />
          <stop offset="1" stopColor="#3A2405" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <polygon points={`${inset},0 ${w - inset + side * 0.5},0 ${w},${d} ${w},${d + h} 0,${d + h} 0,${d}`} />
        </clipPath>
      </defs>
      {/* side */}
      <polygon points={`${w},${d} ${w - inset + side * 0.5},0 ${w + side},${d * 0.6} ${w + side},${d + h - d * 0.35} ${w},${d + h}`} fill={`url(#${id}-side)`} />
      {/* top */}
      <polygon points={`${inset},0 ${w - inset + side * 0.5},0 ${w},${d} 0,${d}`} fill={`url(#${id}-top)`} />
      {/* front */}
      <rect x={0} y={d} width={w} height={h} fill={`url(#${id}-front)`} />
      {stamp && (
        <g fontFamily={FONT} fontWeight={800} textAnchor="middle" fill="#7A4E0E" opacity={0.55}>
          <text x={w / 2} y={d + h * 0.45} fontSize={h * 0.2} letterSpacing={2}>
            FINE GOLD
          </text>
          <text x={w / 2} y={d + h * 0.75} fontSize={h * 0.17} letterSpacing={3}>
            999.9 · 1 KG
          </text>
        </g>
      )}
      {/* moving specular sweep */}
      <g clipPath={`url(#${id}-clip)`} style={{mixBlendMode: 'screen'}}>
        <rect x={sx} y={-10} width={w * 0.35} height={vh + 20} fill={`url(#${id}-shine)`} transform={`skewX(-20)`} />
      </g>
      <line x1={inset} y1={0.8} x2={w - inset + side * 0.5} y2={0.8} stroke="#FFF7DA" strokeWidth={1.5} opacity={0.8} />
    </svg>
  );
};

const RIM = 64;

/** A 3D coin that rotates around its vertical axis (CSS 3D, real rim). */
export const Coin: React.FC<{
  r?: number;
  angle: number;
  tilt?: number;
  thickness?: number;
  silver?: boolean;
  id: string;
  label?: [string, string];
}> = ({r = 220, angle, tilt = 8, thickness = 26, silver = false, id, label = ['1 OZ', 'FINE GOLD 999.9']}) => {
  const tone = silver
    ? {a: '#F4F6F8', b: '#9AA3AD', c: '#5B636B', rim: '#7D868F', ink: '#4A5158'}
    : {a: '#FFE9AE', b: '#E2A93F', c: '#7A4E0E', rim: '#B07A20', ink: '#6B430B'};
  const arc = (2 * Math.PI * r) / RIM + 1.5;
  const face = (back: boolean) => (
    <svg
      width={r * 2}
      height={r * 2}
      style={{
        position: 'absolute',
        left: -r,
        top: -r,
        backfaceVisibility: 'hidden',
        transform: `${back ? 'rotateY(180deg) ' : ''}translateZ(${thickness / 2}px)`,
      }}
    >
      <defs>
        <radialGradient id={`${id}-f${back}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor={tone.a} />
          <stop offset="0.5" stopColor={tone.b} />
          <stop offset="1" stopColor={tone.c} />
        </radialGradient>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#${id}-f${back})`} />
      <circle cx={r} cy={r} r={r * 0.9} fill="none" stroke={tone.c} strokeWidth={r * 0.025} opacity={0.6} />
      {new Array(60).fill(0).map((_, i) => {
        const a = (i / 60) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={r + Math.cos(a) * r * 0.93}
            y1={r + Math.sin(a) * r * 0.93}
            x2={r + Math.cos(a) * r * 0.98}
            y2={r + Math.sin(a) * r * 0.98}
            stroke={tone.c}
            strokeWidth={2}
            opacity={0.45}
          />
        );
      })}
      {back ? (
        <g fill="none" stroke={tone.ink} strokeWidth={r * 0.03} opacity={0.6}>
          <path d={`M ${r - r * 0.45} ${r + r * 0.3} Q ${r} ${r - r * 0.7} ${r + r * 0.45} ${r + r * 0.3}`} />
          <path d={`M ${r - r * 0.3} ${r + r * 0.3} L ${r - r * 0.3} ${r - r * 0.05} M ${r + r * 0.3} ${r + r * 0.3} L ${r + r * 0.3} ${r - r * 0.05}`} />
        </g>
      ) : (
        <g fontFamily={FONT} fontWeight={800} textAnchor="middle" fill={tone.ink} opacity={0.75}>
          <text x={r} y={r + r * 0.12} fontSize={r * 0.42}>
            {label[0]}
          </text>
          <text x={r} y={r + r * 0.42} fontSize={r * 0.1} letterSpacing={3}>
            {label[1]}
          </text>
        </g>
      )}
    </svg>
  );
  return (
    <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg) rotateY(${angle}deg)`}}>
      {new Array(RIM).fill(0).map((_, i) => {
        const a = (i / RIM) * 360;
        const lit = 0.55 + 0.45 * Math.cos(((a + angle) * Math.PI) / 180);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -arc / 2,
              top: -thickness / 2,
              width: arc,
              height: thickness,
              background: `repeating-linear-gradient(90deg, ${tone.rim} 0 3px, ${tone.c} 3px 5px)`,
              filter: `brightness(${lit})`,
              transform: `rotateZ(${a}deg) translateY(${-r}px) rotateX(90deg)`,
            }}
          />
        );
      })}
      {face(false)}
      {face(true)}
    </div>
  );
};

/** A stylised 100-euro-like note (not a reproduction of a real banknote). */
export const Note: React.FC<{w?: number; id: string; value?: string; dollar?: boolean}> = ({w = 600, id, value = '100', dollar = false}) => {
  const h = w * 0.53;
  const col = dollar ? ['#DCE6D2', '#8FA889', '#3F5A3D'] : ['#CFE6C4', '#7FB06A', '#2F5E2A'];
  return (
    <svg width={w} height={h} viewBox="0 0 600 318">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={col[0]} />
          <stop offset="0.6" stopColor={col[1]} />
          <stop offset="1" stopColor={col[2]} />
        </linearGradient>
      </defs>
      <rect width={600} height={318} rx={10} fill={`url(#${id}-bg)`} />
      <rect x={14} y={14} width={572} height={290} rx={6} fill="none" stroke={col[2]} strokeWidth={2} opacity={0.6} />
      {new Array(14).fill(0).map((_, i) => (
        <path key={i} d={`M ${180 + i * 18} 300 Q ${240 + i * 10} ${120 - i * 4} ${320 + i * 14} 300`} fill="none" stroke={col[2]} strokeWidth={1.2} opacity={0.35} />
      ))}
      <circle cx={470} cy={140} r={70} fill="none" stroke={col[2]} strokeWidth={1.5} opacity={0.4} />
      {!dollar &&
        new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={95 + Math.cos(a) * 42} cy={95 + Math.sin(a) * 42} r={5} fill="#E9C94A" opacity={0.85} />;
        })}
      <g fontFamily={FONT} fontWeight={800} fill={col[2]}>
        <text x={40} y={280} fontSize={110} letterSpacing={-4}>
          {value}
        </text>
        <text x={560} y={60} fontSize={36} textAnchor="end">
          {dollar ? '$' + value : value}
        </text>
        <text x={560} y={290} fontSize={30} textAnchor="end" letterSpacing={8} opacity={0.8}>
          {dollar ? 'DOLLAR' : 'EURO'}
        </text>
      </g>
    </svg>
  );
};
