import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode; vb?: string}> = ({
  size = 24,
  style,
  children,
  vb = '0 0 24 24',
}) => (
  <svg width={size} height={size} viewBox={vb} fill="none" style={style}>
    {children}
  </svg>
);

export const ArrowUp: React.FC<P> = ({color = '#0B2F44', stroke = 2.4, ...p}) => (
  <Svg {...p}>
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowLeft: React.FC<P> = ({color = '#79C2E3', stroke = 2.2, ...p}) => (
  <Svg {...p}>
    <path d="M19 12H5M11 5.5 4.5 12l6.5 6.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Close: React.FC<P> = ({color = '#8B8A8E', stroke = 2, ...p}) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </Svg>
);

export const Mic: React.FC<P> = ({color = '#fff', stroke = 2, ...p}) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth={stroke} />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </Svg>
);

/** Animated check: `t` 0→1 draws the tick. */
export const Check: React.FC<P & {t?: number}> = ({color = '#4ADE9B', stroke = 2.6, t = 1, ...p}) => (
  <Svg {...p}>
    <path
      d="M5 12.5 10 17.5 19 7"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - t}
    />
  </Svg>
);

export const Calc: React.FC<P> = ({color = '#fff', stroke = 1.9, ...p}) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" stroke={color} strokeWidth={stroke} />
    <path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" stroke={color} strokeWidth={stroke + 0.4} strokeLinecap="round" />
  </Svg>
);

export const Invoice: React.FC<P> = ({color = '#fff', stroke = 1.9, ...p}) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    <path d="M14 3v4h4M9 12h6M9 16h4" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </Svg>
);

export const Mail: React.FC<P> = ({color = '#fff', stroke = 1.9, ...p}) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke={color} strokeWidth={stroke} />
    <path d="m4 7 8 6 8-6" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Spinner: React.FC<P & {frame: number}> = ({color = '#A98BFF', stroke = 2.6, frame, ...p}) => (
  <Svg {...p} style={{...p.style, transform: `rotate(${frame * 22}deg)`}}>
    <circle cx="12" cy="12" r="8.5" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
    <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </Svg>
);

/** macOS-style pointer. */
export const Cursor: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 44, style}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 20 28" style={style}>
    <path
      d="M2 1.5v21.2l5.3-5.1 3.4 8 3.6-1.5-3.4-7.9h7.4z"
      fill="#fff"
      stroke="#111"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
