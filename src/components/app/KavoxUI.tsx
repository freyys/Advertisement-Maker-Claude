// Kavox app UI, rebuilt in code from the product screens (Assistent, Entwurf
// zum Prüfen, Aufmaß). All sizes are in app points multiplied by `k`, so the
// proportions match the real app at any scale.
import React from 'react';
import {app, FONT, tabular} from '../../theme';
import {ArrowUp, Close, Mic} from '../Icons';

type K = {k: number};

export const AppSurface: React.FC<
  K & {children: React.ReactNode; style?: React.CSSProperties}
> = ({k, children, style}) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${app.bgTint} 0%, #121A1E ${180 * k}px, ${app.bg} ${520 * k}px)`,
      color: app.text,
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<K & {children: React.ReactNode}> = ({k, children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 20 * k,
      padding: `0 ${9 * k}px`,
      borderRadius: 999,
      background: 'rgba(121,194,227,0.12)',
      border: `${Math.max(1, 0.75 * k)}px solid rgba(121,194,227,0.38)`,
      color: app.accent,
      fontSize: 9.5 * k,
      fontWeight: 700,
      letterSpacing: '0.09em',
    }}
  >
    {children}
  </div>
);

export const Toggle: React.FC<K & {on?: boolean}> = ({k, on = true}) => (
  <div
    style={{
      position: 'relative',
      width: 38 * k,
      height: 18 * k,
      borderRadius: 999,
      background: on ? app.accent : app.borderStrong,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -2 * k,
        left: on ? 18 * k : -2 * k,
        width: 22 * k,
        height: 22 * k,
        borderRadius: 999,
        background: app.toggleKnob,
        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
      }}
    />
  </div>
);

export const AssistantHeader: React.FC<
  K & {pill: string; title: string; status: string; readAloud: string}
> = ({k, pill, title, status, readAloud}) => (
  <div>
    <Pill k={k}>{pill}</Pill>
    <div
      style={{
        marginTop: 10 * k,
        fontSize: 34 * k,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1.05,
      }}
    >
      {title}
      <span style={{color: app.accent}}>.</span>
    </div>
    <div style={{marginTop: 5 * k, fontSize: 12.5 * k, color: app.muted, fontWeight: 500}}>
      {status}
    </div>
    <div
      style={{
        marginTop: 14 * k,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 13 * k,
        color: app.textSoft,
        fontWeight: 500,
      }}
    >
      <span>{readAloud}</span>
      <Toggle k={k} />
    </div>
  </div>
);

export const UserBubble: React.FC<
  K & {children: React.ReactNode; maxWidth?: number; style?: React.CSSProperties}
> = ({k, children, maxWidth = 310, style}) => (
  <div
    style={{
      maxWidth: maxWidth * k,
      marginLeft: 'auto',
      padding: `${11 * k}px ${14 * k}px`,
      borderRadius: 13 * k,
      background: app.accent,
      color: app.accentInk,
      fontSize: 14.5 * k,
      lineHeight: 1.36,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
);

export const AssistantBubble: React.FC<
  K & {children: React.ReactNode; style?: React.CSSProperties}
> = ({k, children, style}) => (
  <div
    style={{
      maxWidth: 300 * k,
      padding: `${11 * k}px ${14 * k}px`,
      borderRadius: 13 * k,
      background: app.surface,
      border: `${Math.max(1, 0.75 * k)}px solid ${app.border}`,
      color: app.text,
      fontSize: 14.5 * k,
      lineHeight: 1.36,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SendButton: React.FC<K & {active?: number; glow?: number; color?: string}> = ({
  k,
  active = 0,
  glow = 0,
  color,
}) => (
  <div
    style={{
      width: 40 * k,
      height: 40 * k,
      flex: 'none',
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        color ??
        `color-mix(in srgb, ${app.accent} ${Math.round(active * 100)}%, ${app.accentDeep})`,
      boxShadow: glow > 0 ? `0 0 ${30 * glow * k}px ${8 * glow * k}px rgba(109,74,255,${0.55 * glow})` : undefined,
    }}
  >
    <ArrowUp size={19 * k} color={color ? '#fff' : app.accentInk} stroke={2.6} />
  </div>
);

export const ChatInput: React.FC<
  K & {
    text?: React.ReactNode;
    placeholder: string;
    focused?: number;
    mic?: number; // 0..1 visibility of the dictation indicator
    micLevel?: number[];
    sendActive?: number;
    width?: number;
    style?: React.CSSProperties;
  }
> = ({k, text, placeholder, focused = 0, mic = 0, micLevel, sendActive = 0, width, style}) => (
  <div style={{display: 'flex', alignItems: 'flex-end', gap: 9 * k, width, ...style}}>
    <div
      style={{
        flex: 1,
        minHeight: 50 * k,
        padding: `${13 * k}px ${15 * k}px`,
        borderRadius: 16 * k,
        background: app.field,
        border: `${Math.max(1.5, 1 * k)}px solid ${
          focused > 0
            ? `color-mix(in srgb, ${app.accent} ${Math.round(focused * 100)}%, ${app.border})`
            : app.border
        }`,
        boxShadow: focused > 0 ? `0 0 0 ${3 * k * focused}px rgba(121,194,227,${0.14 * focused})` : undefined,
        fontSize: 14 * k,
        lineHeight: 1.36,
        fontWeight: 500,
        color: text ? app.text : app.muted,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{flex: 1}}>{text || placeholder}</div>
      {mic > 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.4 * k,
            marginLeft: 10 * k,
            opacity: mic,
            alignSelf: 'flex-end',
          }}
        >
          <Mic size={16 * k} color={app.accent} />
          {(micLevel ?? []).map((l, i) => (
            <div
              key={i}
              style={{
                width: 2.6 * k,
                height: (3 + l * 13) * k,
                borderRadius: 9,
                background: app.accent,
                opacity: 0.55 + l * 0.45,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
    <SendButton k={k} active={sendActive} />
  </div>
);

export const DraftRow: React.FC<K & {name: string; value: string; style?: React.CSSProperties}> = ({
  k,
  name,
  value,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      fontSize: 13 * k,
      lineHeight: `${21 * k}px`,
      fontWeight: 500,
      color: app.text,
      ...style,
    }}
  >
    <span>{name}</span>
    <span style={{...tabular, color: app.textSoft}}>{value}</span>
  </div>
);

export const PrimaryButton: React.FC<K & {children: React.ReactNode; style?: React.CSSProperties}> = ({
  k,
  children,
  style,
}) => (
  <div
    style={{
      height: 46 * k,
      borderRadius: 9 * k,
      background: app.accent,
      color: app.accentInk,
      fontSize: 14 * k,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

export const SecondaryButton: React.FC<K & {children: React.ReactNode; style?: React.CSSProperties}> = ({
  k,
  children,
  style,
}) => (
  <div
    style={{
      height: 46 * k,
      borderRadius: 9 * k,
      background: app.button,
      border: `${Math.max(1, 0.75 * k)}px solid rgba(255,255,255,0.09)`,
      color: app.text,
      fontSize: 14 * k,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

export const SectionHeader: React.FC<K & {no: string; title: string}> = ({k, no, title}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7 * k,
      fontSize: 12 * k,
      fontWeight: 800,
      letterSpacing: '0.14em',
    }}
  >
    <span style={{color: app.accent}}>{no}</span>
    <span style={{color: app.muted, letterSpacing: 0}}>—</span>
    <span style={{color: app.text}}>{title}</span>
  </div>
);

export const Field: React.FC<
  K & {value?: string; placeholder?: string; bold?: boolean; right?: React.ReactNode; style?: React.CSSProperties}
> = ({k, value, placeholder, bold, right, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12 * k, ...style}}>
    <div
      style={{
        flex: 1,
        height: 44 * k,
        borderRadius: 8 * k,
        background: app.field,
        border: `${Math.max(1, 0.75 * k)}px solid rgba(255,255,255,0.07)`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${14 * k}px`,
        fontSize: (bold ? 16 : 14) * k,
        fontWeight: bold ? 700 : 500,
        color: value ? app.text : app.muted,
      }}
    >
      {value || placeholder}
    </div>
    {right}
  </div>
);

export const CloseIcon: React.FC<K> = ({k}) => <Close size={22 * k} color={app.muted} />;

export const PositionCard: React.FC<
  K & {
    name: string;
    formula: string;
    qty: string;
    price: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
> = ({k, name, formula, qty, price, style, children}) => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: 14 * k,
      padding: `${12 * k}px ${13 * k}px`,
      borderRadius: 11 * k,
      background: app.card,
      border: `${Math.max(1, 0.75 * k)}px solid rgba(255,255,255,0.065)`,
      ...style,
    }}
  >
    {children}
    <div style={{flex: 1, position: 'relative'}}>
      <div style={{fontSize: 14.5 * k, fontWeight: 700, color: app.text}}>{name}</div>
      <div
        style={{
          marginTop: 3 * k,
          fontSize: 11 * k,
          lineHeight: 1.45,
          color: app.muted,
          fontWeight: 500,
        }}
      >
        {formula}
      </div>
    </div>
    <div style={{textAlign: 'right', position: 'relative', ...tabular}}>
      <div style={{fontSize: 15.5 * k, fontWeight: 800, color: app.text, whiteSpace: 'nowrap'}}>{qty}</div>
      <div style={{marginTop: 2 * k, fontSize: 12.5 * k, fontWeight: 500, color: app.textSoft, whiteSpace: 'nowrap'}}>
        {price}
      </div>
    </div>
  </div>
);
