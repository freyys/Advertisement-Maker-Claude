import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, Gold, Headline, LightCone, Particles, ease, fmt, lerp, p, rand, useT} from './fx';
import {Coin, GoldBar, Note} from './objects';
import {H, SCENES, W} from './timeline';

// Every scene works in scene-local seconds; `at()` converts voice-over times.
const at = (k: keyof typeof SCENES, abs: number) => abs - SCENES[k][0];

/** Slow dolly-in plus a slight drift: the "camera" for a scene. */
export const Dolly: React.FC<{children: React.ReactNode; from?: number; to?: number; len: number; drift?: number; rot?: number}> = ({
  children,
  from = 1,
  to = 1.08,
  len,
  drift = 0,
  rot = 0,
}) => {
  const t = useT();
  const k = p(t, 0, len, ease.inOut);
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(from, to, k)}) translateX(${drift * (k - 0.5)}px) rotate(${rot * (k - 0.5)}deg)`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S1 ------
export const S1Pillow: React.FC = () => {
  const t = useT();
  const fadeK = p(t, 4.6, 8.6, ease.inOut);
  const lift = p(t, 0.3, 3.2, ease.inOut);
  return (
    <AbsoluteFill style={{background: '#050403'}}>
      <Dolly len={9} from={1.18} to={1.0} drift={-60} rot={1.2}>
        {/* warm side light */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 30% 55%, rgba(255,190,110,0.28), rgba(0,0,0,0) 70%)'}} />
        {/* the note, under the pillow edge */}
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 1010 - lift * 30,
            transform: `rotate(-9deg) perspective(1400px) rotateX(48deg)`,
            filter: `saturate(${1 - fadeK}) brightness(${1 - fadeK * 0.25}) contrast(${1 - fadeK * 0.2})`,
            opacity: 1 - fadeK * 0.62,
          }}
        >
          <Note w={860} id="n1" />
        </div>
        {/* old pillow: soft, creased linen, macro so it fills the frame */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: -lift * 50}}>
          <defs>
            <radialGradient id="pil" cx="0.4" cy="0.25" r="0.9">
              <stop offset="0" stopColor="#E9DFCB" />
              <stop offset="0.5" stopColor="#A89A82" />
              <stop offset="1" stopColor="#2A241C" />
            </radialGradient>
            <filter id="linen">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves={2} seed={3} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0.35 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <path d="M -80 -40 L 1180 -40 L 1180 980 Q 900 1140 560 1060 Q 260 990 -80 1110 Z" fill="url(#pil)" />
          <path d="M -80 -40 L 1180 -40 L 1180 980 Q 900 1140 560 1060 Q 260 990 -80 1110 Z" fill="#000" filter="url(#linen)" />
          {[
            'M 120 300 Q 380 420 620 360',
            'M 420 640 Q 640 560 980 720',
            'M 60 820 Q 300 760 520 880',
            'M 700 180 Q 860 260 1060 220',
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#2A2117" strokeWidth={14} fill="none" opacity={0.25} style={{filter: 'blur(6px)'}} />
              <path d={d} stroke="#FFF4DE" strokeWidth={4} fill="none" opacity={0.25} transform="translate(0,-8)" style={{filter: 'blur(3px)'}} />
            </g>
          ))}
          {/* piping along the seam */}
          <path d="M -80 1110 Q 260 990 560 1060 Q 900 1140 1180 980" stroke="#C9B998" strokeWidth={16} fill="none" opacity={0.7} />
        </svg>
        <LightCone x={380} top={-300} width={1100} opacity={0.35} />
      </Dolly>
      <Particles count={45} seed={2} speed={0.6} opacity={0.8} />
      <Headline
        at={at('s1', 5.1)}
        y={300}
        text={
          <>
            2002 → 2026
            <br />
            <Gold>−⅓ Kaufkraft</Gold>
          </>
        }
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S2 ------
export const S2Ounce: React.FC = () => {
  const t = useT();
  const intro = p(t, 0, 1.6);
  const angle = -35 + t * 24; // slow-motion turn
  const showBar = p(t, at('s2', 10.6), at('s2', 11.6));
  const grow = p(t, at('s2', 14.9), at('s2', 17.0), ease.inOut);
  const value = lerp(330, 3680, grow);
  const base = 1250;
  const maxH = 520;
  const h = lerp(maxH * (330 / 3680), maxH, grow) * showBar;
  const barX = 680;
  const barW = 230;
  return (
    <AbsoluteFill style={{background: C.black}}>
      <LightCone x={360} top={-300} width={900} opacity={0.7} />
      <Dolly len={11} from={1.04} to={1.12} drift={30}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 34% 50%, rgba(255,190,90,0.22), rgba(0,0,0,0) 40%)'}} />
        {/* ounce */}
        <div
          style={{
            position: 'absolute',
            left: 340,
            top: 880,
            perspective: 1600,
            opacity: intro,
            transform: `scale(${lerp(0.85, 1, intro)})`,
          }}
        >
          <Coin r={230} angle={angle} id="oz" />
        </div>
        {/* floor reflection */}
        <div style={{position: 'absolute', left: 120, top: 1180, width: 440, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(232,181,74,0.35), rgba(0,0,0,0) 70%)', filter: 'blur(10px)', opacity: intro}} />
        {/* 3D bar */}
        <div style={{position: 'absolute', left: barX, top: base - h, opacity: showBar}}>
          <svg width={barW + 70} height={h + 60} style={{position: 'absolute', left: 0, top: -40, overflow: 'visible'}}>
            <defs>
              <linearGradient id="bf" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#8A5A12" />
                <stop offset="0.35" stopColor="#FFE3A1" />
                <stop offset="0.6" stopColor="#E8B54A" />
                <stop offset="1" stopColor="#7A4E0E" />
              </linearGradient>
            </defs>
            <polygon points={`0,40 ${barW},40 ${barW + 60},10 60,10`} fill="#FFEBB5" />
            <polygon points={`${barW},40 ${barW + 60},10 ${barW + 60},${h + 10} ${barW},${h + 40}`} fill="#5A3A09" />
            <rect x={0} y={40} width={barW} height={h} fill="url(#bf)" />
            {/* glow line at the top */}
            <rect x={0} y={38} width={barW} height={4} fill="#FFF7DA" />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: -40,
              width: barW + 140,
              top: -150,
              textAlign: 'center',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 76,
              color: C.white,
              letterSpacing: -2,
              textShadow: '0 0 30px rgba(232,181,74,0.6)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(value)} €
          </div>
        </div>
        {/* baseline + years */}
        <div style={{position: 'absolute', left: 620, top: base + 40, width: 400, height: 2, background: 'linear-gradient(90deg, rgba(232,181,74,0), rgba(232,181,74,0.8), rgba(232,181,74,0))', opacity: showBar}} />
        <div style={{position: 'absolute', left: 620, top: base + 60, width: 360, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.gold, opacity: showBar, letterSpacing: 4}}>
          {grow < 0.5 ? '2002' : '2026'}
        </div>
      </Dolly>
      <Particles count={70} seed={5} speed={0.5} />
      <Headline at={at('s2', 17.9)} y={290} size={84} text={<>Mehr als das<br /><Gold>10-Fache</Gold></>} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S3 ------
const Press: React.FC<{scale?: number; t: number}> = ({scale = 1, t}) => {
  const roll = (t * 900) % 40;
  const bills = new Array(26).fill(0).map((_, i) => {
    const period = 0.32;
    const life = 2.2;
    const born = Math.floor(t / period) * period - i * period;
    const age = t - born;
    if (age < 0 || age > life) return null;
    const seed = Math.floor(born / period);
    const vx = 260 + rand(seed) * 220;
    const vy = -620 - rand(seed + 1) * 260;
    const x = 250 + vx * age;
    const y = 640 + vy * age + 0.5 * 900 * age * age;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - 120,
          top: y,
          transform: `rotate(${-30 + age * (180 + rand(seed + 2) * 400)}deg) rotateX(${age * 300}deg)`,
          filter: age > 1.2 ? 'blur(2px)' : undefined,
        }}
      >
        <Note w={240} id={`pb${seed}`} dollar={seed % 2 === 0} />
      </div>
    );
  });
  return (
    <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '270px 700px'}}>
      {/* machine body */}
      <div style={{position: 'absolute', left: 40, top: 660, width: 440, height: 520, borderRadius: 18, background: 'linear-gradient(180deg, #2A2F33, #0D0F11)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15)'}} />
      {[0, 1].map((k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: 60,
            top: 560 + k * 120,
            width: 400,
            height: 110,
            borderRadius: 55,
            background: `repeating-linear-gradient(180deg, #8C949B 0 ${roll / 2}px, #3A4046 ${roll / 2}px ${20}px), linear-gradient(180deg, #B9C1C8, #1C2024)`,
            backgroundBlendMode: 'multiply',
            boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 6px 10px rgba(255,255,255,0.3)',
          }}
        />
      ))}
      {/* paper web feeding through */}
      <div style={{position: 'absolute', left: 90, top: 660, width: 340, height: 16, background: 'repeating-linear-gradient(90deg, #9FC48C 0 70px, #CFE6C4 70px 80px)', backgroundPositionX: -t * 600}} />
      {/* red work lamp */}
      <div style={{position: 'absolute', left: 420, top: 720, width: 22, height: 22, borderRadius: 11, background: '#FF5A3C', boxShadow: `0 0 ${20 + 15 * Math.sin(t * 12)}px #FF5A3C`}} />
      {bills}
      {/* pile on the floor */}
      {new Array(18).fill(0).map((_, i) => (
        <div key={`p${i}`} style={{position: 'absolute', left: 20 + rand(i) * 420, top: 1220 + rand(i + 5) * 120 - Math.min(t, 7) * 10, transform: `rotate(${rand(i + 9) * 80 - 40}deg)`, opacity: 0.8}}>
          <Note w={200} id={`pp${i}`} dollar={i % 2 === 0} />
        </div>
      ))}
    </div>
  );
};

export const S3Split: React.FC = () => {
  const t = useT();
  const split = p(t, 0, 0.9);
  return (
    <AbsoluteFill style={{background: C.black}}>
      {/* left: printing press, cold and busy */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: H, overflow: 'hidden', background: 'radial-gradient(circle at 50% 45%, #14262B, #030405 70%)'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - split) * -200}px) scale(${1 + t * 0.012})`}}>
          <Press t={t} />
        </div>
      </div>
      {/* right: one calm bar under a light cone */}
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: H, overflow: 'hidden', background: '#040302'}}>
        <div style={{position: 'absolute', inset: 0, left: -540}}>
          <LightCone x={540 + 270} top={-200} width={700} height={1700} opacity={0.9} />
        </div>
        <div style={{position: 'absolute', left: 70, top: 1040 - (1 - split) * 40, transform: `scale(${1 + t * 0.01})`, transformOrigin: 'center'}}>
          <GoldBar w={380} id="calm" shine={(t * 0.12) % 1} />
        </div>
        <div style={{position: 'absolute', left: 30, top: 1220, width: 480, height: 50, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(232,181,74,0.4), rgba(0,0,0,0) 70%)', filter: 'blur(8px)'}} />
        <div style={{position: 'absolute', inset: 0, left: -540, width: W}}>
          <Particles count={30} seed={9} speed={0.25} />
        </div>
      </div>
      {/* divider */}
      <div style={{position: 'absolute', left: 538, top: H / 2 - (H / 2) * split, width: 4, height: H * split, background: 'linear-gradient(180deg, rgba(232,181,74,0), #E8B54A, rgba(232,181,74,0))', boxShadow: '0 0 20px #E8B54A'}} />
      <SplitText at={at('s3', 21.3)} left text="Geld:" sub="unbegrenzt." />
      <SplitText at={at('s3', 24.7)} text="Gold:" sub="begrenzt." gold />
    </AbsoluteFill>
  );
};

const SplitText: React.FC<{at: number; text: string; sub: string; left?: boolean; gold?: boolean}> = ({at: a, text, sub, left, gold}) => {
  const t = useT();
  const k = p(t, a, a + 0.6);
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: left ? 0 : 540,
        width: 540,
        top: 330,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 78,
        lineHeight: 1.05,
        color: C.white,
        opacity: k,
        transform: `translateY(${(1 - k) * 30}px)`,
        filter: `blur(${(1 - k) * 8}px)`,
        textShadow: '0 4px 30px rgba(0,0,0,0.9)',
      }}
    >
      {text}
      <br />
      {gold ? <Gold>{sub}</Gold> : <span style={{color: '#9FD8DC'}}>{sub}</span>}
    </div>
  );
};

// ---------------------------------------------------------------- S4 ------
const F = 900;
type V3 = [number, number, number];

export const S4Vault: React.FC = () => {
  const t = useT();
  const len = SCENES.s4[1] - SCENES.s4[0];
  const k = p(t, 0, len, ease.inOut);
  const cam: V3 = [Math.sin(t * 0.35) * 120, -60 + Math.sin(t * 0.5) * 20, lerp(-200, 1500, k)];
  const yaw = Math.sin(t * 0.3) * 0.08; // gentle orbit
  const proj = ([x, y, z]: V3): [number, number, number] => {
    let dx = x - cam[0];
    let dz = z - cam[2];
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    [dx, dz] = [dx * c - dz * s, dx * s + dz * c];
    const zz = Math.max(dz, 1);
    return [W / 2 + (dx * F) / zz, H / 2 + ((y - cam[1]) * F) / zz, zz];
  };
  const half = 560;
  const floor = 620;
  const bars: Array<{pts: string; z: number; key: string}> = [];
  for (const side of [-1, 1]) {
    for (let zi = 0; zi < 16; zi++) {
      const z0 = 300 + zi * 260;
      for (let yi = 0; yi < 22; yi++) {
        const y0 = floor - yi * 78;
        const z1 = z0 + 230;
        const y1 = y0 - 66;
        const x = side * half;
        const a = proj([x, y0, z0]);
        const b = proj([x, y0, z1]);
        const c = proj([x, y1, z1 - 22]);
        const d = proj([x, y1, z0 + 22]);
        if (a[2] < 40 || b[2] < 40) continue;
        bars.push({pts: `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`, z: (a[2] + b[2]) / 2, key: `${side}-${zi}-${yi}`});
      }
    }
  }
  bars.sort((m, n) => n.z - m.z);
  const end = proj([0, -240, 4600]);
  const floorPts = [proj([-half, floor, 0]), proj([half, floor, 0]), proj([half, floor, 4600]), proj([-half, floor, 4600])];
  const count = Math.round(lerp(0, 289, p(t, at('s4', 31.0), at('s4', 34.2), ease.inOut)));
  const holo = p(t, at('s4', 30.4), at('s4', 31.2));
  const record = p(t, at('s4', 36.4), at('s4', 36.8));
  return (
    <AbsoluteFill style={{background: '#020203'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="vb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE7A8" />
            <stop offset="0.35" stopColor="#E3A940" />
            <stop offset="1" stopColor="#6B430B" />
          </linearGradient>
          <radialGradient id="vend">
            <stop offset="0" stopColor="#FFD58A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vfloor" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#1A1712" />
            <stop offset="1" stopColor="#050403" />
          </linearGradient>
        </defs>
        <polygon points={floorPts.map((q) => `${q[0]},${q[1]}`).join(' ')} fill="url(#vfloor)" />
        <circle cx={end[0]} cy={end[1]} r={(900 * F) / end[2]} fill="url(#vend)" />
        {bars.map((b) => {
          const fog = Math.min(1, Math.max(0.12, 1 - (b.z - 200) / 3800));
          return <polygon key={b.key} points={b.pts} fill="url(#vb)" stroke="#3A2405" strokeWidth={1} opacity={fog} />;
        })}
      </svg>
      <LightCone x={W / 2} top={-300} width={1200} height={2200} opacity={0.35} />
      <Particles count={80} seed={11} speed={0.4} />
      {/* hologram counter */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 820,
          textAlign: 'center',
          opacity: holo * (0.88 + 0.12 * Math.sin(t * 40)),
          transform: `perspective(900px) rotateX(${12 - 12 * holo}deg) scale(${0.8 + 0.2 * holo})`,
        }}
      >
        <div style={{display: 'inline-block', padding: '30px 60px', border: '2px solid rgba(79,209,217,0.7)', borderRadius: 24, background: 'repeating-linear-gradient(180deg, rgba(79,209,217,0.12) 0 3px, rgba(79,209,217,0.02) 3px 7px)', boxShadow: '0 0 60px rgba(79,209,217,0.45), inset 0 0 40px rgba(79,209,217,0.25)'}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: '#BFF7FA', textShadow: '0 0 30px #4FD1D9, 0 0 80px #4FD1D9', fontVariantNumeric: 'tabular-nums', letterSpacing: -4}}>
            {count}
          </div>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 52, color: '#8FEFF4', letterSpacing: 14, marginTop: 6}}>TONNEN</div>
        </div>
        {record > 0 && (
          <div style={{marginTop: 30, fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: 10, color: C.gold, opacity: record, transform: `scale(${1.4 - 0.4 * record})`, textShadow: '0 0 30px rgba(232,181,74,0.8)'}}>
            REKORD
          </div>
        )}
      </div>
      <Headline at={at('s4', 29.4)} y={300} size={70} text={<>Zentralbanken Q2 2026:<br /><Gold>Rekordkäufe</Gold></>} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- S5 ------
export const S5Banker: React.FC = () => {
  const t = useT();
  const close = p(t, 0.6, at('s5', 40.5), ease.inOut);
  const thud = t > at('s5', 40.5) ? Math.exp(-(t - at('s5', 40.5)) * 6) * Math.sin((t - at('s5', 40.5)) * 60) * 8 : 0;
  const doorAngle = lerp(-72, 0, close);
  const wheel = p(t, at('s5', 40.8), at('s5', 42.2), ease.inOut) * 180;
  const turn = p(t, at('s5', 40.9), at('s5', 41.7), ease.inOut); // banker turns to camera
  const smile = p(t, at('s5', 41.3), at('s5', 41.9));
  const R = 330;
  return (
    <AbsoluteFill style={{background: '#030303', transform: `translateY(${thud}px)`}}>
      {/* background: press still running, out of focus */}
      <div style={{position: 'absolute', left: 560, top: 120, width: 540, height: 900, filter: 'blur(9px)', opacity: 0.55, transform: 'scale(0.75)', transformOrigin: 'top right'}}>
        <Press t={t + 6} />
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 52%, rgba(255,200,120,0.18), rgba(0,0,0,0) 50%)'}} />
      <Dolly len={6.3} from={1.0} to={1.1} drift={-40}>
        {/* vault opening glow (hidden as the door closes) */}
        <div style={{position: 'absolute', left: W / 2 - R, top: 1000 - R, width: R * 2, height: R * 2, borderRadius: '50%', background: 'radial-gradient(circle, #FFE3A1, #E8B54A 40%, #3A2405 75%)', boxShadow: `0 0 ${200 * (1 - close)}px rgba(255,200,100,${0.8 * (1 - close)})`}} />
        <div style={{position: 'absolute', left: W / 2 - R - 30, top: 1000 - R - 30, width: R * 2 + 60, height: R * 2 + 60, borderRadius: '50%', border: '30px solid #1A1C1E', boxShadow: 'inset 0 0 30px #000, 0 0 0 4px #3A3D40'}} />
        {/* the door, hinged on the right */}
        <div style={{position: 'absolute', left: W / 2 - R, top: 1000 - R, width: R * 2, height: R * 2, perspective: 1600}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '100% 50%', transform: `rotateY(${doorAngle}deg)`, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #5B6167, #23272B 60%, #101214)', boxShadow: 'inset 0 0 0 18px #2D3236, inset 0 0 0 22px #6D747B, 0 20px 60px rgba(0,0,0,0.8)'}}>
            {new Array(16).fill(0).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <div key={i} style={{position: 'absolute', left: R + Math.cos(a) * (R - 44) - 10, top: R + Math.sin(a) * (R - 44) - 10, width: 20, height: 20, borderRadius: 10, background: 'radial-gradient(circle at 35% 35%, #C9CED3, #4A5055)'}} />;
            })}
            <div style={{position: 'absolute', left: R - 130, top: R - 130, width: 260, height: 260, transform: `rotate(${wheel}deg)`}}>
              {[0, 60, 120].map((r) => (
                <div key={r} style={{position: 'absolute', left: 0, top: 118, width: 260, height: 24, borderRadius: 12, background: 'linear-gradient(180deg, #D8C08A, #7A6236)', transform: `rotate(${r}deg)`}} />
              ))}
              <div style={{position: 'absolute', left: 95, top: 95, width: 70, height: 70, borderRadius: 35, background: 'radial-gradient(circle at 35% 35%, #F0D9A0, #6B5428)'}} />
            </div>
          </div>
        </div>
        {/* banker silhouette with a warm rim light */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <filter id="rim">
              <feMorphology in="SourceAlpha" operator="dilate" radius={3} result="d" />
              <feFlood floodColor="#FFC870" />
              <feComposite in2="d" operator="in" result="glow" />
              <feGaussianBlur in="glow" stdDeviation={4} result="g2" />
              <feMerge>
                <feMergeNode in="g2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#rim)" transform={`translate(${lerp(-40, 40, close)} 0)`}>
            {/* body */}
            <path d="M 70 1920 L 90 1480 Q 110 1360 200 1330 L 330 1300 Q 420 1320 440 1420 L 470 1920 Z" fill="#050505" />
            {/* arm pushing the door */}
            <path d={`M 400 1360 Q ${520 + close * 60} ${1300 + (1 - close) * 30} ${600 + close * 90} 1190 L ${620 + close * 90} 1230 Q ${520 + close * 40} 1380 430 1440 Z`} fill="#050505" />
            {/* neck + head, turning toward camera */}
            <rect x={240} y={1240} width={70} height={80} fill="#050505" />
            <ellipse cx={275 + turn * -6} cy={1190} rx={78 - turn * 6} ry={92} fill="#050505" />
            {/* nose in profile fades as he turns */}
            <path d="M 348 1180 L 372 1210 L 346 1218 Z" fill="#050505" opacity={1 - turn} />
            {/* hat */}
            <path d="M 180 1130 L 370 1130 L 352 1112 L 330 1040 Q 275 1020 220 1040 L 198 1112 Z" fill="#050505" />
          </g>
          {/* the smirk: a thin rim-lit curve */}
          <path d={`M ${255} ${1232} Q ${282} ${1232 + 14 * smile} ${310} ${1226 - 6 * smile}`} stroke="#FFC870" strokeWidth={3} fill="none" opacity={smile * 0.9} style={{filter: 'drop-shadow(0 0 6px #FFC870)'}} />
        </svg>
      </Dolly>
      <Particles count={40} seed={14} speed={0.35} opacity={0.7} />
    </AbsoluteFill>
  );
};
