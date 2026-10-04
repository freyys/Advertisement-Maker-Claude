// The Kavox desktop app, rebuilt in code at its logical size (1440×900, the
// screenshots are 2× retina). `DesktopShot` films it with a 3D camera.
import React from 'react';
import {d, FONT, rgba, tnum} from '../tokens';
import {ease, keys} from '../../lib/anim';
import {KMark} from '../../components/Logo';
import {
  IAlert,
  IArchive,
  IBell,
  IChart,
  ICheck,
  IChevronsLeft,
  ICockpit,
  IFile,
  IFolder,
  IGear,
  IKey,
  IReceipt,
  ISearch,
  ISend,
  ITasks,
  IUsers,
  IArrowRight,
} from './icons';

export const DW = 1440;
export const DH = 900;
export const SIDEBAR = 299;
export const CONTENT_X = 380; // left edge of page content
export const CONTENT_W = 979;

// ---- camera -------------------------------------------------------------------

export type Cam = {fx: number; fy: number; s: number; rx?: number; ry?: number; rz?: number};

/** Interpolates every camera field through eased keyframes. */
export const camAt = (frame: number, kf: Array<[number, Cam]>, easing = ease.inOut): Required<Cam> => {
  const f = (k: keyof Cam) => keys(frame, kf.map(([t, c]) => [t, c[k] ?? 0] as [number, number]), easing);
  return {fx: f('fx'), fy: f('fy'), s: f('s'), rx: f('rx'), ry: f('ry'), rz: f('rz')};
};

/**
 * Places the logical point (fx, fy) of the window at screen point (cx, cy),
 * scaled by s and rotated around that point. Rendered at 2× via CSS zoom so
 * text stays crisp when the camera pushes in.
 */
export const DesktopShot: React.FC<{
  cam: Cam;
  cx?: number;
  cy: number;
  children: React.ReactNode;
  w?: number;
  h?: number;
  radius?: number;
  shadow?: number;
}> = ({cam, cx = 540, cy, children, w = DW, h = DH, radius = 16, shadow = 1}) => {
  const Z = 2;
  const {fx, fy, s, rx = 0, ry = 0, rz = 0} = cam;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - fx * Z,
        top: cy - fy * Z,
        width: w * Z,
        height: h * Z,
        transformOrigin: `${fx * Z}px ${fy * Z}px`,
        transform: `perspective(${3200}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s / Z})`,
        borderRadius: radius * Z,
        boxShadow: `0 ${60 * shadow}px ${160 * shadow}px rgba(0,0,0,${0.65 * shadow}), 0 0 0 ${2}px rgba(255,255,255,0.09), 0 0 ${120 * shadow}px ${rgba(d.accent, 0.08 * shadow)}`,
        overflow: 'hidden',
      }}
    >
      <div style={{zoom: Z, width: w, height: h, position: 'relative', fontFamily: FONT, color: d.text}}>{children}</div>
    </div>
  );
};

// ---- primitives --------------------------------------------------------------------

export const PagePill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 26,
      padding: '0 11px',
      borderRadius: 13,
      border: `1px solid ${rgba(d.accent, 0.38)}`,
      background: rgba(d.accent, 0.1),
      color: d.accent,
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

export const PageTitle: React.FC<{children: string; size?: number; style?: React.CSSProperties}> = ({children, size = 48, style}) => (
  <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff', ...style}}>
    {children}
    <span style={{color: d.accent}}>.</span>
  </div>
);

export const Crumbs: React.FC<{items: string[]; style?: React.CSSProperties}> = ({items, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, color: d.muted, ...style}}>
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {i > 0 ? <IArrowRight size={13} color={d.muted} stroke={2} /> : null}
        <span>{it}</span>
      </React.Fragment>
    ))}
  </div>
);

export const SectionHead: React.FC<{no: string; title: string; meta?: string; right?: string; style?: React.CSSProperties}> = ({
  no,
  title,
  meta,
  right,
  style,
}) => (
  <div style={{borderTop: `1px solid ${d.line}`, paddingTop: 16, display: 'flex', alignItems: 'baseline', gap: 10, ...style}}>
    <span style={{color: d.accent, fontSize: 13.5, fontWeight: 700, letterSpacing: '0.06em'}}>{no}</span>
    <span style={{color: d.faint, fontSize: 13}}>—</span>
    <span style={{color: '#fff', fontSize: 13.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase'}}>{title}</span>
    {meta ? <span style={{color: d.muted, fontSize: 12.5}}>{meta}</span> : null}
    <span style={{flex: 1}} />
    {right ? <span style={{color: d.muted, fontSize: 12.5, letterSpacing: '0.04em'}}>{right}</span> : null}
  </div>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: d.card,
      border: `1px solid ${d.line}`,
      borderRadius: 14,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      ...style,
    }}
  >
    {children}
  </div>
);

export type Tone = 'yellow' | 'rose' | 'accent' | 'green' | 'violet' | 'grey';
export const toneColor = (t: Tone) =>
  ({yellow: d.yellow, rose: d.rose, accent: d.accent, green: d.green, violet: d.violet, grey: d.muted})[t];

export const StatusPill: React.FC<{status: string; scale?: number; glow?: number}> = ({status, scale = 1, glow = 0}) => {
  const map: Record<string, {c: string; icon: 'check' | 'alert' | 'send' | 'dot'}> = {
    Bezahlt: {c: d.green, icon: 'check'},
    Angenommen: {c: d.green, icon: 'check'},
    Überfällig: {c: d.rose, icon: 'alert'},
    Versendet: {c: d.violet, icon: 'send'},
    Offen: {c: d.yellow, icon: 'dot'},
    Entwurf: {c: d.muted, icon: 'dot'},
  };
  const {c, icon} = map[status] ?? map.Offen;
  const s = scale;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6 * s,
        height: 28 * s,
        padding: `0 ${11 * s}px`,
        borderRadius: 14 * s,
        background: rgba(c, 0.12),
        color: c,
        fontSize: 13 * s,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: glow > 0 ? `0 0 ${24 * glow}px ${rgba(c, 0.5 * glow)}` : undefined,
      }}
    >
      {icon === 'check' ? <ICheck size={12 * s} color={c} stroke={3} /> : null}
      {icon === 'alert' ? <IAlert size={11 * s} color={c} /> : null}
      {icon === 'send' ? <ISend size={11 * s} color={c} /> : null}
      {icon === 'dot' ? <span style={{width: 6 * s, height: 6 * s, borderRadius: '50%', background: c}} /> : null}
      {status}
    </div>
  );
};

/** Little white document thumbnail with blue lines (Zuletzt bearbeitet / Dokumente). */
export const DocThumb: React.FC<{size?: number}> = ({size = 26}) => (
  <div
    style={{
      width: size,
      height: size * 1.32,
      borderRadius: 3,
      background: '#F7F9FB',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    }}
  >
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: size * 0.08, background: 'linear-gradient(90deg,#1F8FD8 60%,#2BB673 60%)'}} />
    {[0.28, 0.4, 0.52, 0.64].map((y, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: size * 0.16,
          top: size * 1.32 * y,
          width: size * (i === 1 ? 0.68 : 0.5),
          height: Math.max(1, size * 0.05),
          background: i === 1 ? '#1F8FD8' : '#C8D1DA',
          borderRadius: 1,
        }}
      />
    ))}
    <div style={{position: 'absolute', right: size * 0.16, bottom: size * 0.16, width: size * 0.22, height: size * 0.05, background: '#1F8FD8'}} />
  </div>
);

// ---- sidebar + shell ---------------------------------------------------------------------

export type NavKey =
  | 'cockpit'
  | 'nachfassen'
  | 'aufgaben'
  | 'auswertung'
  | 'suche'
  | 'angebot'
  | 'rechnung'
  | 'dokumente'
  | 'kunden'
  | 'katalog'
  | 'einstellungen'
  | 'lizenz';

const NAV: Array<{group: string; items: Array<{key: NavKey; label: string; Icon: React.FC<any>}>}> = [
  {
    group: 'Überblick',
    items: [
      {key: 'cockpit', label: 'Cockpit', Icon: ICockpit},
      {key: 'nachfassen', label: 'Nachfassen', Icon: IBell},
      {key: 'aufgaben', label: 'Aufgaben', Icon: ITasks},
      {key: 'auswertung', label: 'Auswertung', Icon: IChart},
    ],
  },
  {
    group: 'Arbeiten',
    items: [
      {key: 'suche', label: 'Suche', Icon: ISearch},
      {key: 'angebot', label: 'Angebot', Icon: IFile},
      {key: 'rechnung', label: 'Rechnung', Icon: IReceipt},
      {key: 'dokumente', label: 'Dokumente', Icon: IFolder},
      {key: 'kunden', label: 'Kunden', Icon: IUsers},
      {key: 'katalog', label: 'Leistungskatalog', Icon: IArchive},
    ],
  },
  {
    group: 'System',
    items: [
      {key: 'einstellungen', label: 'Einstellungen', Icon: IGear},
      {key: 'lizenz', label: 'Lizenz', Icon: IKey},
    ],
  },
];

export const Sidebar: React.FC<{active: NavKey; badgePulse?: number}> = ({active, badgePulse = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: SIDEBAR,
      height: DH,
      background: d.sidebar,
      borderRight: `1px solid ${d.line}`,
    }}
  >
    <div style={{position: 'absolute', left: 44, top: 27}}>
      <KMark size={20} color={d.accent} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 229,
        top: 23,
        width: 28,
        height: 28,
        borderRadius: 7,
        border: `1px solid ${d.lineStrong}`,
        background: d.cardHi,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IChevronsLeft size={15} color={d.textSoft} stroke={2} />
    </div>
    <div style={{position: 'absolute', left: 31, top: 98, width: 236}}>
      {NAV.map((g, gi) => (
        <div key={g.group} style={{marginTop: gi === 0 ? 0 : 18}}>
          <div style={{fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', color: d.muted, textTransform: 'uppercase', padding: '6px 13px'}}>
            {g.group}
          </div>
          {g.items.map(({key, label, Icon}) => {
            const on = key === active;
            return (
              <div
                key={key}
                style={{
                  height: 40,
                  marginTop: 2,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0 13px',
                  background: on ? d.active : 'transparent',
                  position: 'relative',
                  color: on ? '#fff' : d.textSoft,
                  fontSize: 15.5,
                  fontWeight: on ? 600 : 500,
                }}
              >
                {on ? <div style={{position: 'absolute', left: 0, top: 9, bottom: 9, width: 2.5, borderRadius: 2, background: d.accent}} /> : null}
                <Icon size={16} color={on ? d.accent : d.muted} stroke={1.8} />
                {label}
                {key === 'nachfassen' ? (
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: 21,
                      height: 21,
                      borderRadius: '50%',
                      background: d.accent,
                      color: d.accentInk,
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 0 ${4 + badgePulse * 8}px ${rgba(d.accent, 0.25 * (1 - badgePulse))}`,
                    }}
                  >
                    2
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 736, height: 1, background: d.line}} />
    <div style={{position: 'absolute', left: 40, top: 780, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: d.textSoft}}>
      <span style={{width: 8, height: 8, borderRadius: '50%', background: d.green, boxShadow: `0 0 8px ${d.green}`}} />
      Offline · Daten bleiben hier
    </div>
  </div>
);

/** App shell: sidebar + scrollable main area (content starts at x = 380). */
export const DesktopApp: React.FC<{
  active: NavKey;
  scrollY?: number;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  sticky?: {title: string; meta: string; progress: number; opacity: number};
  badgePulse?: number;
}> = ({active, scrollY = 0, children, overlay, sticky, badgePulse}) => (
  <div style={{position: 'absolute', inset: 0, background: d.bg, overflow: 'hidden'}}>
    {/* faint teal haze next to the sidebar, as in the app */}
    <div
      style={{
        position: 'absolute',
        left: SIDEBAR,
        top: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(ellipse 30% 70% at 0% 30%, ${rgba('#1B3A47', 0.55)} 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 100% 100%, ${rgba('#1B2F3A', 0.35)} 0%, transparent 70%)`,
      }}
    />
    <div style={{position: 'absolute', left: SIDEBAR, top: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: CONTENT_X - SIDEBAR, top: -scrollY, width: CONTENT_W}}>{children}</div>
    </div>
    {sticky && sticky.opacity > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: SIDEBAR + 32,
          right: 32,
          top: 0,
          height: 54,
          opacity: sticky.opacity,
          background: 'rgba(10,10,12,0.92)',
          borderBottom: `1px solid ${d.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          paddingLeft: 52,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, height: 2, width: `${sticky.progress * 100}%`, background: d.accent}} />
        <span style={{fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em'}}>
          {sticky.title}
          <span style={{color: d.accent}}>.</span>
        </span>
        <span style={{fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', color: d.muted, textTransform: 'uppercase'}}>{sticky.meta}</span>
      </div>
    ) : null}
    <Sidebar active={active} badgePulse={badgePulse} />
    {overlay}
  </div>
);

export const Money: React.FC<{value: string; size: number; weight?: number; color?: string; style?: React.CSSProperties}> = ({
  value,
  size,
  weight = 700,
  color = '#fff',
  style,
}) => (
  <span style={{fontSize: size, fontWeight: weight, color, letterSpacing: '-0.02em', ...tnum, ...style}}>{value}</span>
);
