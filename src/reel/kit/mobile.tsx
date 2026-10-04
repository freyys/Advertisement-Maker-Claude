// The Kavox phone app, rebuilt in code in iPhone points (390 × 844). The
// screenshots are 2× (780 × 1688). `Phone` draws the device and zooms the
// screen so text renders crisp at any size.
import React from 'react';
import {m, FONT, rgba, tnum} from '../tokens';
import {IAlert, ICheck, ISend} from './icons';

export const PW = 390;
export const PH = 844;
const BEZEL = 8;

/** Device frame. (cx, top) in stage px; k = stage px per point. */
export const Phone: React.FC<{
  cx: number;
  top: number;
  k: number;
  children: React.ReactNode;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  glow?: number;
  bg?: string;
}> = ({cx, top, k, children, rx = 0, ry = 0, rz = 0, scale = 1, glow = 0, bg = m.bg}) => {
  const ow = (PW + BEZEL * 2) * k;
  const oh = (PH + BEZEL * 2) * k;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - ow / 2,
        top,
        width: ow,
        height: oh,
        transformOrigin: '50% 30%',
        transform: `perspective(2600px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
        borderRadius: 62 * k,
        background: 'linear-gradient(140deg, #4A4B52 0%, #1E1F23 22%, #0E0E10 50%, #26272C 80%, #55565D 100%)',
        padding: 2.2 * k,
        boxShadow: `0 ${50 * k}px ${110 * k}px rgba(0,0,0,0.7), 0 0 ${80 * k * glow}px ${rgba(m.accent, 0.35 * glow)}`,
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 60 * k, background: '#050506', padding: (BEZEL - 2.2) * k}}>
        <div
          style={{
            zoom: k,
            width: PW,
            height: PH,
            borderRadius: 52,
            overflow: 'hidden',
            position: 'relative',
            background: bg,
            fontFamily: FONT,
            color: m.text,
          }}
        >
          {children}
          <StatusBar />
        </div>
      </div>
    </div>
  );
};

const StatusBar: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: 50, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 50, top: 17, fontSize: 16, fontWeight: 700, color: '#fff', ...tnum}}>9:41</div>
    <div style={{position: 'absolute', left: PW / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#000'}} />
    <svg width={78} height={14} viewBox="0 0 78 14" style={{position: 'absolute', right: 30, top: 20}}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5} y={10 - i * 3} width={3.4} height={4 + i * 3} rx={1} fill="#fff" />
      ))}
      <path d="M30 5.2a9 9 0 0 1 12 0M32.4 8a5.4 5.4 0 0 1 7.2 0" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx={36} cy={11} r={1.6} fill="#fff" />
      <rect x={50} y={1.5} width={23} height={11} rx={3.2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} fill="none" />
      <rect x={52} y={3.5} width={17} height={7} rx={1.6} fill="#fff" />
      <rect x={74.2} y={5} width={1.6} height={4} rx={0.8} fill="rgba(255,255,255,0.5)" />
    </svg>
  </div>
);

/** Screen background with the app's teal tint at the top. */
export const Screen: React.FC<{children: React.ReactNode; tint?: number; style?: React.CSSProperties}> = ({children, tint = 1, style}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, ${rgba(m.tint, tint)} 0%, ${rgba('#121A1E', tint)} 26%, ${m.bg} 52%)`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const MPill: React.FC<{children: React.ReactNode; strong?: boolean}> = ({children, strong}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 31,
      padding: '0 13px',
      borderRadius: 16,
      border: `1px solid ${rgba(m.accent, strong ? 0.5 : 0.38)}`,
      background: rgba(m.accent, strong ? 0.14 : 0.1),
      color: m.accent,
      fontSize: 12.5,
      fontWeight: 800,
      letterSpacing: '0.13em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

export const MTitle: React.FC<{children: string; size?: number}> = ({children, size = 36}) => (
  <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.1, color: '#fff'}}>
    {children}
    <span style={{color: m.accent}}>.</span>
  </div>
);

export const MSection: React.FC<{no: string; title: string; right?: string; style?: React.CSSProperties; strong?: boolean}> = ({
  no,
  title,
  right,
  style,
  strong,
}) => (
  <div
    style={{
      borderTop: `1px solid ${strong ? 'rgba(255,255,255,0.35)' : m.line}`,
      paddingTop: 20,
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      fontSize: strong ? 14 : 13,
      fontWeight: 700,
      letterSpacing: '0.13em',
      ...style,
    }}
  >
    <span style={{color: m.accent}}>{no}</span>
    <span style={{color: m.muted, letterSpacing: 0}}>—</span>
    <span style={{color: '#fff', textTransform: 'uppercase'}}>{title}</span>
    <span style={{flex: 1}} />
    {right ? <span style={{color: strong ? '#fff' : m.muted, letterSpacing: 0, fontWeight: 600, ...tnum}}>{right}</span> : null}
  </div>
);

export const MCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties; strong?: boolean}> = ({children, style, strong}) => (
  <div
    style={{
      background: strong ? '#0B0B0C' : m.card,
      border: strong ? '1.5px solid #9A9A9A' : `1px solid ${m.line}`,
      borderRadius: 17,
      ...style,
    }}
  >
    {children}
  </div>
);

export const MStatus: React.FC<{status: string; strong?: boolean; glow?: number}> = ({status, strong, glow = 0}) => {
  const map: Record<string, {c: string; icon: 'dot' | 'check' | 'alert' | 'send'}> = {
    Überfällig: {c: m.rose, icon: 'dot'},
    Offen: {c: m.yellow, icon: 'dot'},
    Versendet: {c: m.violet, icon: 'dot'},
    Entwurf: {c: '#C9C9CD', icon: 'dot'},
    Bezahlt: {c: m.green, icon: 'check'},
  };
  const {c, icon} = map[status] ?? map.Offen;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: strong ? 30 : 30,
        padding: '0 14px',
        borderRadius: 15,
        background: rgba(c, strong ? 0.1 : 0.14),
        border: strong ? `1.5px solid ${c}` : 'none',
        color: c,
        fontSize: strong ? 15 : 14,
        fontWeight: 700,
        boxShadow: glow ? `0 0 ${20 * glow}px ${rgba(c, 0.5 * glow)}` : undefined,
      }}
    >
      {icon === 'dot' ? <span style={{width: 6, height: 6, borderRadius: 3, background: c}} /> : null}
      {icon === 'check' ? <ICheck size={12} color={c} stroke={3} /> : null}
      {icon === 'alert' ? <IAlert size={11} color={c} /> : null}
      {icon === 'send' ? <ISend size={11} color={c} /> : null}
      {status}
    </div>
  );
};

export const MButton: React.FC<{
  children: React.ReactNode;
  primary?: boolean;
  style?: React.CSSProperties;
  press?: number;
  glow?: number;
}> = ({children, primary, style, press = 0, glow = 0}) => (
  <div
    style={{
      height: 48,
      borderRadius: 13,
      background: primary ? m.accent : '#121214',
      border: primary ? 'none' : `1px solid rgba(255,255,255,0.14)`,
      color: primary ? m.accentInk : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      transform: `scale(${1 - press * 0.04})`,
      boxShadow: glow ? `0 0 ${30 * glow}px ${rgba(m.accent, 0.6 * glow)}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);
