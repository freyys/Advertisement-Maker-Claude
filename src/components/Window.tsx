import React from 'react';
import {palette, FONT} from '../theme';

export const CHROME_H = 60;

/** Glassy macOS-like window: 3-dot chrome, 8 % white border, inner glow. */
export const GlassWindow: React.FC<{
  width: number;
  height: number;
  title?: React.ReactNode;
  iconSlot?: React.ReactNode;
  tag?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({width, height, title, iconSlot, tag, children, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 22,
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(14,11,32,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.07)',
        'inset 0 0 60px rgba(109,74,255,0.06)',
        '0 50px 140px rgba(0,0,0,0.65)',
        '0 0 120px rgba(109,74,255,0.16)',
      ].join(', '),
      fontFamily: FONT,
      ...style,
    }}
  >
    <div
      style={{
        height: CHROME_H,
        display: 'flex',
        alignItems: 'center',
        padding: '0 22px',
        gap: 9,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(42,27,110,0.35), rgba(18,13,46,0.25))',
        position: 'relative',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 13,
            height: 13,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.16)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        />
      ))}
      <div style={{width: 22}} />
      <div style={{width: 36, height: 36, flex: 'none'}}>{iconSlot}</div>
      <div
        style={{
          marginLeft: 6,
          fontSize: 21,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '-0.005em',
        }}
      >
        {title}
      </div>
      <div style={{marginLeft: 8}}>{tag}</div>
    </div>
    <div style={{position: 'absolute', top: CHROME_H, left: 0, right: 0, bottom: 0}}>{children}</div>
  </div>
);

export const StatusTag: React.FC<{
  label: string;
  tone?: 'violet' | 'success';
  dot?: number;
  style?: React.CSSProperties;
}> = ({label, tone = 'violet', dot = 1, style}) => {
  const c = tone === 'success' ? palette.success : palette.lavender;
  const bg = tone === 'success' ? 'rgba(74,222,155,0.14)' : 'rgba(109,74,255,0.2)';
  const bd = tone === 'success' ? 'rgba(74,222,155,0.45)' : 'rgba(169,139,255,0.45)';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 30,
        padding: '0 13px',
        borderRadius: 999,
        background: bg,
        border: `1px solid ${bd}`,
        color: c,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.12em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 9,
          background: c,
          opacity: 0.4 + 0.6 * dot,
          boxShadow: `0 0 ${10 * dot}px ${c}`,
        }}
      />
      {label}
    </div>
  );
};
