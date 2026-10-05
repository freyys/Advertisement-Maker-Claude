import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, Gold, Headline, LightCone, Particles, ease, lerp, p, rand, useT} from './fx';
import {Coin, GoldBar, Note} from './objects';
import {H, SCENES, W} from './timeline';

const at = (k: keyof typeof SCENES, abs: number) => abs - SCENES[k][0];

// ---------------------------------------------------------------- S6 ------
const SHOT = (SCENES.s6[1] - SCENES.s6[0]) / 4;

const Silver: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1C2428, #030405 65%)'}}>
    <LightCone x={540} top={-300} width={900} opacity={0.5} color="210,230,240" />
    {new Array(9).fill(0).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: 250, top: 1240 - i * 22, width: 300, height: 70, borderRadius: '50%', background: 'linear-gradient(180deg, #E9EEF2, #6E777F)', boxShadow: '0 4px 0 #4A5158'}} />
    ))}
    <div style={{position: 'absolute', left: 680, top: 980, perspective: 1400, filter: 'blur(1px)'}}>
      <Coin r={150} angle={40 + t * 120} silver id="ag2" thickness={18} label={['1 OZ', 'FINE SILVER 999']} />
    </div>
    <div style={{position: 'absolute', left: 540, top: 840, perspective: 1600}}>
      <Coin r={210} angle={-20 + t * 70} silver id="ag" label={['1 OZ', 'FINE SILVER 999']} />
    </div>
  </AbsoluteFill>
);

const Copper: React.FC<{t: number}> = ({t}) => {
  const turns = 9;
  const d = useMemo(() => {
    let s = '';
    for (let i = 0; i <= turns * 80; i++) {
      const a = (i / 80) * Math.PI * 2;
      const r = 40 + i * 0.55;
      s += `${i ? 'L' : 'M'} ${Math.cos(a) * r} ${Math.sin(a) * r * 0.42 + i * 0.5} `;
    }
    return s;
  }, []);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2A1408, #030405 65%)'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="cu" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD2A0" />
            <stop offset="0.4" stopColor="#E07A3A" />
            <stop offset="1" stopColor="#6A2A0C" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${540 + (k - 1) * 40} ${720 + k * 230}) rotate(${-8 + t * 6})`}>
            <path d={d} stroke="#FF8A3C" strokeWidth={22} fill="none" opacity={0.35 + 0.15 * Math.sin(t * 8 + k)} style={{filter: 'blur(14px)'}} />
            <path d={d} stroke="url(#cu)" strokeWidth={10} fill="none" />
          </g>
        ))}
        {new Array(24).fill(0).map((_, i) => {
          const a = rand(i) * 6.28;
          const life = (t * 1.6 + rand(i + 3)) % 1;
          return <circle key={i} cx={540 + Math.cos(a) * (80 + life * 500)} cy={950 + Math.sin(a) * (60 + life * 300) - life * 200} r={3 * (1 - life)} fill="#FFC27A" opacity={1 - life} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Charger: React.FC<{t: number}> = ({t}) => {
  const pulse = (t * 1.2) % 1;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 40% 55%, #0B2328, #030405 65%)'}}>
      {/* pillar */}
      <div style={{position: 'absolute', left: 170, top: 620, width: 240, height: 780, borderRadius: 30, background: 'linear-gradient(90deg, #1B2023, #3A4246 50%, #15191B)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)'}} />
      <div style={{position: 'absolute', left: 278, top: 680, width: 24, height: 560, borderRadius: 12, background: `linear-gradient(180deg, rgba(79,209,217,0.2), #4FD1D9 ${pulse * 100}%, rgba(79,209,217,0.2))`, boxShadow: '0 0 40px #4FD1D9'}} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <path d="M 400 1000 C 620 1000 560 1320 840 1220" stroke="#0E1113" strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d="M 400 1000 C 620 1000 560 1320 840 1220" stroke="#4FD1D9" strokeWidth={6} fill="none" strokeDasharray="40 260" strokeDashoffset={-t * 600} style={{filter: 'drop-shadow(0 0 10px #4FD1D9)'}} />
        {/* car flank */}
        <path d="M 780 900 Q 900 860 1100 870 L 1100 1500 L 760 1500 Q 740 1200 780 900 Z" fill="#101416" />
        <path d="M 780 900 Q 900 860 1100 870" stroke="#9FD8DC" strokeWidth={3} fill="none" opacity={0.6} />
        <rect x={830} y={1190} width={60} height={60} rx={14} fill="#1A2024" stroke="#4FD1D9" strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

const Servers: React.FC<{t: number}> = ({t}) => {
  const camZ = t * 300;
  const items: React.ReactNode[] = [];
  for (let zi = 14; zi >= 0; zi--) {
    for (const side of [-1, 1]) {
      const z = 200 + zi * 300 - (camZ % 300);
      const s = 900 / z;
      const x = W / 2 + side * 420 * s;
      const w = 260 * s;
      const h = 1500 * s;
      const fog = Math.max(0.1, 1 - z / 4500);
      items.push(
        <div key={`${zi}${side}`} style={{position: 'absolute', left: side < 0 ? x - w : x, top: H / 2 - h * 0.55, width: w, height: h, background: '#07090C', border: `${Math.max(1, s)}px solid #1A2A3A`, opacity: fog}}>
          {new Array(18).fill(0).map((_, r) => (
            <div key={r} style={{position: 'absolute', left: '15%', top: `${4 + r * 5.3}%`, width: '70%', height: Math.max(1, 3 * s), background: rand(r * 7 + zi + side) > 0.35 && Math.sin(t * (6 + r) + zi) > -0.3 ? '#3FA9FF' : '#0D2236', boxShadow: `0 0 ${8 * s}px #3FA9FF`}} />
          ))}
        </div>,
      );
    }
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0A1A2E, #020305 70%)'}}>
      {items}
    </AbsoluteFill>
  );
};

export const S6Montage: React.FC = () => {
  const t = useT();
  const shots = [Silver, Copper, Charger, Servers];
  return (
    <AbsoluteFill style={{background: C.black}}>
      {shots.map((Shot, i) => {
        const a = i * SHOT;
        const b = a + SHOT;
        if (t < a - 0.2 || t > b + 0.2) return null;
        const local = t - a;
        const inK = i === 0 ? 1 : p(t, a - 0.2, a + 0.15, ease.inOut);
        const outK = i === 3 ? 0 : p(t, b - 0.1, b + 0.2, ease.inOut);
        const blur = (1 - inK) * 30 + outK * 30;
        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: inK * (1 - outK),
              filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
              transform: `scale(${lerp(1.0, 1.1, local / SHOT) + (1 - inK) * 0.25}) translateX(${(1 - inK) * 120 - outK * 120}px)`,
            }}
          >
            <Shot t={local} />
          </AbsoluteFill>
        );
      })}
      <Particles count={40} seed={21} speed={0.6} opacity={0.6} />
      <Headline at={at('s6', 44.0)} y={300} size={74} text={<><Gold>Silber · Kupfer</Gold><br />· Rohstoffe ·</>} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S7 ------
// Illustrative gold price in €/oz (monthly), peak Jan 2026, today −25 %.
const SERIES = (() => {
  const pts: number[] = [];
  const n = 46; // Jan 2023 … Oct 2026
  for (let i = 0; i < n; i++) {
    let v: number;
    if (i <= 36) v = 1750 * Math.pow(4900 / 1750, Math.pow(i / 36, 1.6));
    else v = lerp(4900, 3680, Math.pow((i - 36) / (n - 1 - 36), 0.7));
    v *= 1 + (rand(i * 3.7) - 0.5) * 0.05 * (i === 36 || i === n - 1 ? 0 : 1);
    pts.push(v);
  }
  return pts;
})();

export const S7Chart: React.FC = () => {
  const t = useT();
  const cw = 900;
  const ch = 600;
  const x = (i: number) => (i / (SERIES.length - 1)) * cw;
  const y = (v: number) => ch - ((v - 1400) / (5200 - 1400)) * ch;
  const draw = p(t, 0.4, at('s7', 57.6), (k) => k);
  const nDraw = draw * (SERIES.length - 1);
  const shown = SERIES.slice(0, Math.floor(nDraw) + 1).map((v, i) => [x(i), y(v)] as const);
  const fi = Math.floor(nDraw);
  if (fi < SERIES.length - 1) {
    const f = nDraw - fi;
    shown.push([x(fi + f), y(lerp(SERIES[fi], SERIES[fi + 1], f))]);
  }
  const head = shown[shown.length - 1];
  const line = shown.map(([a, b], i) => `${i ? 'L' : 'M'} ${a} ${b}`).join(' ');
  const area = `${line} L ${head[0]} ${ch} L 0 ${ch} Z`;
  const peakK = p(t, at('s7', 55.0), at('s7', 55.6));
  const dropK = p(t, at('s7', 57.4), at('s7', 58.0));
  const zoom = p(t, at('s7', 58.2), at('s7', 61.6), ease.inOut);
  const tilt = lerp(22, 8, zoom);
  const ry = lerp(-16, -4, zoom);
  const zs = lerp(1, 1.55, zoom);
  const tx = lerp(0, -300, zoom);
  const ty = lerp(0, 60, zoom);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0C1C20, #020304 70%)'}}>
      <div style={{position: 'absolute', left: (W - cw) / 2, top: 600, width: cw, height: ch, perspective: 1400}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translate(${tx}px, ${ty}px) scale(${zs}) rotateX(${tilt}deg) rotateY(${ry}deg)`}}>
          <svg width={cw} height={ch} style={{overflow: 'visible'}}>
            <defs>
              <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E8B54A" stopOpacity="0.45" />
                <stop offset="1" stopColor="#E8B54A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((g) => (
              <line key={g} x1={0} x2={cw} y1={(g / 4) * ch} y2={(g / 4) * ch} stroke="#4FD1D9" strokeOpacity={0.15} />
            ))}
            {[0, 12, 24, 36].map((i, k) => (
              <g key={i}>
                <line x1={x(i)} x2={x(i)} y1={0} y2={ch} stroke="#4FD1D9" strokeOpacity={0.1} />
                <text x={x(i)} y={ch + 50} opacity={1 - zoom} fill="#8FB9BD" fontFamily={FONT} fontWeight={700} fontSize={30} textAnchor="middle">
                  {['2023', '2024', '2025', '2026'][k]}
                </text>
              </g>
            ))}
            <path d={area} fill="url(#ar)" />
            <path d={line} stroke="#FFB84A" strokeWidth={16} fill="none" opacity={0.35} style={{filter: 'blur(10px)'}} />
            <path d={line} stroke="#FFE3A1" strokeWidth={6} fill="none" strokeLinejoin="round" />
            <circle cx={head[0]} cy={head[1]} r={14} fill="#FFF3D0" style={{filter: 'drop-shadow(0 0 16px #FFC870)'}} />
            {peakK > 0 && (
              <g opacity={peakK}>
                <circle cx={x(36)} cy={y(SERIES[36])} r={12 + 16 * (1 - peakK)} fill="none" stroke="#FFE3A1" strokeWidth={3} />
                <line x1={x(36)} x2={x(36)} y1={y(SERIES[36]) - 30} y2={y(SERIES[36]) - 110} stroke="#FFE3A1" strokeWidth={2} />
                <text x={x(36)} y={y(SERIES[36]) - 130} fill="#FFE3A1" fontFamily={FONT} fontWeight={800} fontSize={44} textAnchor="middle">
                  Jan 2026
                </text>
              </g>
            )}
            {dropK > 0 && (
              <g opacity={dropK}>
                <line x1={x(36)} x2={x(45)} y1={y(SERIES[36])} y2={y(SERIES[36])} stroke="#4FD1D9" strokeWidth={2} strokeDasharray="8 8" />
                <line x1={x(45) + 20} x2={x(45) + 20} y1={y(SERIES[36])} y2={y(SERIES[45])} stroke="#4FD1D9" strokeWidth={3} />
                <text x={x(45) - 10} y={y(SERIES[45]) + 90} fill="#BFF7FA" fontFamily={FONT} fontWeight={800} fontSize={56} textAnchor="end">
                  −25 %
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
      <Particles count={40} seed={31} speed={0.3} opacity={0.7} />
      <Headline at={at('s7', 51.6)} out={at('s7', 58.0)} y={300} size={80} text={<>Ehrlich:<br /><Gold>Gold schwankt auch</Gold></>} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S8 ------
export const S8Anchor: React.FC = () => {
  const t = useT();
  const land = 3.3;
  const k = Math.min(1, t / land);
  const fall = 1 - Math.pow(1 - k, 2.2);
  const settle = t > land ? Math.exp(-(t - land) * 3) * Math.sin((t - land) * 9) : 0;
  const by = lerp(-300, 1080, fall) - settle * 16;
  const rot = lerp(-14, 0, fall) + settle * 3;
  const puff = t > land ? p(t, land, land + 1.4) : 0;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0E3A40 0%, #072126 45%, #02090B 100%)'}}>
      {/* caustic rays */}
      {new Array(6).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 80 + i * 170 + Math.sin(t * 0.7 + i) * 40, top: -100, width: 90, height: 1500, background: 'linear-gradient(180deg, rgba(160,240,240,0.22), rgba(160,240,240,0))', transform: `rotate(${8 + i * 2}deg)`, filter: 'blur(16px)'}} />
      ))}
      {/* falling notes: the turbulent "water" of paper money */}
      {new Array(34).fill(0).map((_, i) => {
        const z = rand(i * 2.3);
        const speed = 160 + z * 260;
        const y = ((rand(i) * 2400 + t * speed) % 2400) - 300;
        const x = rand(i + 4) * 1200 - 100 + Math.sin(t * 1.3 + i) * 50;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: 0.25 + z * 0.5, transform: `scale(${0.35 + z * 0.6}) rotate(${t * (40 + rand(i + 1) * 90) + i * 30}deg) rotateX(${t * 120 + i * 40}deg)`, filter: `blur(${z > 0.8 ? 6 : (1 - z) * 4}px) saturate(0.4)`}}>
            <Note w={300} id={`fn${i}`} dollar={i % 3 === 0} />
          </div>
        );
      })}
      {/* chain */}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {new Array(30).fill(0).map((_, i) => {
          const cy = by + 40 - i * 46;
          if (cy < -60) return null;
          return <ellipse key={i} cx={540 + Math.sin(t * 2 + i * 0.3) * (i * 0.6)} cy={cy} rx={i % 2 ? 6 : 16} ry={26} fill="none" stroke="#B88A3A" strokeWidth={8} opacity={0.85} />;
        })}
      </svg>
      {/* bar */}
      <div style={{position: 'absolute', left: 540 - 240, top: by, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 0 40px rgba(232,181,74,0.5))'}}>
        <GoldBar w={460} id="anchor" shine={(t * 0.2) % 1} />
      </div>
      {/* seabed + sediment puff */}
      <div style={{position: 'absolute', left: -100, top: 1290, width: 1280, height: 400, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #1A3A3A, #02090B 70%)'}} />
      {puff > 0 && (
        <div style={{position: 'absolute', left: 540 - 400 * puff, top: 1200 - 60 * puff, width: 800 * puff, height: 200 * puff, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(150,190,180,0.35), rgba(0,0,0,0) 70%)', opacity: 1 - puff * 0.7, filter: 'blur(14px)'}} />
      )}
      {/* bubbles */}
      {new Array(30).fill(0).map((_, i) => {
        const life = (t * (0.3 + rand(i) * 0.4) + rand(i + 2)) % 1;
        return <div key={`b${i}`} style={{position: 'absolute', left: 300 + rand(i + 7) * 480 + Math.sin(t * 3 + i) * 10, top: 1250 - life * 1300, width: 6 + rand(i) * 12, height: 6 + rand(i) * 12, borderRadius: '50%', border: '2px solid rgba(200,250,250,0.5)', opacity: 1 - life}} />;
      })}
      <Headline at={at('s8', 64.0)} y={300} size={110} text={<>Gold = <Gold>Anker</Gold></>} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S9 ------
const sampleText = (text: string, size: number): Array<[number, number]> => {
  if (typeof document === 'undefined') return [];
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = 300;
  const g = cv.getContext('2d');
  if (!g) return [];
  g.fillStyle = '#fff';
  g.font = `800 ${size}px 'Plus Jakarta Sans'`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, W / 2, 150);
  const data = g.getImageData(0, 0, W, 300).data;
  const out: Array<[number, number]> = [];
  for (let yy = 0; yy < 300; yy += 5) for (let xx = 0; xx < W; xx += 5) if (data[(yy * W + xx) * 4 + 3] > 128) out.push([xx, yy]);
  return out;
};

export const S9Logo: React.FC<{handle: string}> = ({handle}) => {
  const t = useT();
  const size = Math.min(112, Math.floor(1500 / handle.length));
  const pts = useMemo(() => sampleText(handle, size), [handle, size]);
  const form = p(t, 0.2, 2.2, ease.inOut);
  const solid = p(t, 2.0, 2.8);
  const disc = p(t, 2.2, 2.9);
  const top = 760;
  return (
    <AbsoluteFill style={{background: '#020202'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(232,181,74,0.16), rgba(0,0,0,0) 45%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', mixBlendMode: 'screen'}}>
        {pts.map(([px, py], i) => {
          const sx = rand(i * 1.3) * W;
          const sy = rand(i * 2.7) * H;
          const d = Math.min(1, Math.max(0, form * 1.3 - rand(i * 0.7) * 0.3));
          const e = 1 - Math.pow(1 - d, 3);
          const x = lerp(sx, px, e) + Math.sin(t * 3 + i) * 2 * (1 - solid);
          const y = lerp(sy, top + py, e);
          return <circle key={i} cx={x} cy={y} r={2.6} fill={i % 5 ? '#E8B54A' : '#FFF1C4'} opacity={(0.4 + 0.6 * e) * (1 - solid * 0.6)} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: top + 150 - size * 0.62, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.24, opacity: solid, filter: `blur(${(1 - solid) * 6}px)`}}>
        <Gold>{handle}</Gold>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center', opacity: solid}}>
        <div style={{display: 'inline-block', width: 180 * solid, height: 3, background: 'linear-gradient(90deg, rgba(232,181,74,0), #E8B54A, rgba(232,181,74,0))'}} />
      </div>
      <Particles count={50} seed={41} speed={0.4} opacity={0.7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1590, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: 'rgba(245,242,234,0.75)', opacity: disc}}>
        Keine Anlageberatung
      </div>
    </AbsoluteFill>
  );
};

