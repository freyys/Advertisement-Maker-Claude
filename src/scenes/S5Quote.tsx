import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {app, palette, tabular} from '../theme';
import {S5_BEATS as B, SCENES} from '../timeline';
import {ease, keys, prog, springAt, tween} from '../lib/anim';
import {de, eur} from '../lib/format';
import * as copy from '../copy';
import {Camera} from '../components/Camera';
import {Wordmark} from '../components/Logo';
import {Check} from '../components/Icons';
import {SectionHeader} from '../components/app/KavoxUI';

const PAPER = {w: 680, h: 962, cx: 760, cy: 548};
const INK = '#16151A';
const GREY = '#8A8893';
const LINE = '#E7E5EC';

const cols = '62px 1fr 108px 82px 112px';

const QuotePaper: React.FC<{frame: number; count: number}> = ({frame, count}) => (
  <div
    style={{
      width: PAPER.w,
      height: PAPER.h,
      background: '#FFFFFF',
      borderRadius: 6,
      padding: '58px 54px',
      color: INK,
      boxShadow: '0 60px 140px rgba(0,0,0,0.6), 0 20px 50px rgba(0,0,0,0.35), 0 0 120px rgba(109,74,255,0.25)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <Wordmark width={168} color={INK} style={{marginTop: 8}} />
      <div style={{textAlign: 'right'}}>
        <div style={{fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1}}>{copy.quote.title}</div>
        <div style={{fontSize: 16, color: GREY, marginTop: 8, fontWeight: 600}}>{copy.quote.number}</div>
      </div>
    </div>
    <div style={{height: 2, background: palette.violet, marginTop: 30, width: 64, borderRadius: 2}} />
    <div style={{marginTop: 30, fontSize: 13, letterSpacing: '0.14em', color: GREY, fontWeight: 700}}>KUNDE</div>
    <div style={{marginTop: 6, fontSize: 24, fontWeight: 700}}>{copy.customer}</div>
    <div style={{marginTop: 10, width: 210, height: 10, borderRadius: 5, background: LINE}} />
    <div style={{marginTop: 8, width: 150, height: 10, borderRadius: 5, background: LINE}} />
    <div style={{marginTop: 30, fontSize: 18, fontWeight: 600}}>
      <span style={{color: GREY}}>Betreff: </span>
      {copy.quote.subject}
    </div>

    <div
      style={{
        marginTop: 26,
        display: 'grid',
        gridTemplateColumns: cols,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: GREY,
        paddingBottom: 10,
        borderBottom: `2px solid ${INK}`,
      }}
    >
      {copy.quote.head.map((h, i) => (
        <div key={h} style={{textAlign: i >= 2 ? 'right' : 'left'}}>
          {h.toUpperCase()}
        </div>
      ))}
    </div>
    {copy.positions.map((p, i) => {
      const t = prog(frame, B.paperIn + 6 + i * 3, B.paperIn + 12 + i * 3);
      return (
        <div
          key={p.name}
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            fontSize: 18,
            fontWeight: 500,
            padding: '15px 0',
            borderBottom: `1px solid ${LINE}`,
            opacity: t,
            transform: `translateY(${(1 - t) * 10}px)`,
            ...tabular,
          }}
        >
          <div style={{color: GREY}}>{i + 1}</div>
          <div style={{fontWeight: 600}}>{p.name}</div>
          <div style={{textAlign: 'right'}}>{`${de(p.qty, 1)} ${p.unit}`}</div>
          <div style={{textAlign: 'right', color: GREY}}>{de(p.unitPrice)}</div>
          <div style={{textAlign: 'right', fontWeight: 600}}>{eur(copy.lineTotal(p))}</div>
        </div>
      );
    })}

    <div style={{marginTop: 26, marginLeft: 'auto', width: 360, ...tabular}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18, padding: '5px 0'}}>
        <span style={{color: GREY, fontWeight: 600}}>{copy.quote.netto}</span>
        <span style={{fontWeight: 600}}>{eur(copy.netto * count)}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18, padding: '5px 0'}}>
        <span style={{color: GREY, fontWeight: 600}}>{copy.quote.mwst}</span>
        <span style={{fontWeight: 600}}>{eur(copy.mwst * count)}</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 10,
          paddingTop: 14,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <span style={{fontSize: 20, fontWeight: 800}}>{copy.quote.total}</span>
        <span style={{fontSize: 30, fontWeight: 800, color: palette.violet}}>{eur(copy.brutto * count)}</span>
      </div>
    </div>
  </div>
);

/** "04 — Summe vor Ort" card, rebuilt from the Aufmaß screen. */
const SumCard: React.FC<{count: number}> = ({count}) => {
  const k = 2.1;
  return (
    <div style={{width: 560}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <SectionHeader k={k} no="04" title="SUMME VOR ORT" />
        <span style={{fontSize: 12 * k, color: app.muted, fontWeight: 600, ...tabular}}>{eur(copy.brutto * count)}</span>
      </div>
      <div
        style={{
          marginTop: 12 * k,
          padding: `${12 * k}px ${14 * k}px`,
          borderRadius: 12 * k,
          background: app.surface,
          border: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(121,194,227,0.08)',
          ...tabular,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14 * k, padding: `${4 * k}px 0`}}>
          <span style={{color: app.textSoft, fontWeight: 600}}>Netto</span>
          <span style={{fontWeight: 800}}>{eur(copy.netto * count)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13 * k, padding: `${4 * k}px 0`}}>
          <span style={{color: app.muted, fontWeight: 600}}>MwSt 19 %</span>
          <span style={{color: app.textSoft, fontWeight: 600}}>{eur(copy.mwst * count)}</span>
        </div>
        <div style={{height: 1, background: 'rgba(255,255,255,0.08)', margin: `${8 * k}px 0`}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <span style={{fontSize: 15 * k, fontWeight: 800}}>Brutto</span>
          <span style={{fontSize: 24 * k, fontWeight: 800, letterSpacing: '-0.01em'}}>{eur(copy.brutto * count)}</span>
        </div>
      </div>
    </div>
  );
};

export const ReadyPill: React.FC<{t: number; label: string}> = ({t, label}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      height: 76,
      padding: '0 30px 0 18px',
      borderRadius: 999,
      background: 'linear-gradient(180deg, rgba(109,74,255,0.42), rgba(42,27,110,0.55))',
      border: '1.5px solid rgba(169,139,255,0.6)',
      boxShadow: `0 0 ${50 * t}px rgba(109,74,255,${0.55 * t}), inset 0 1px 0 rgba(255,255,255,0.18)`,
      color: '#fff',
      fontSize: 32,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 99,
        background: 'rgba(74,222,155,0.16)',
        border: '1.5px solid rgba(74,222,155,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Check size={28} t={t} />
    </div>
    <span style={tabular}>{label}</span>
  </div>
);

export const S5Quote: React.FC = () => {
  const frame = useCurrentFrame();
  const {end} = SCENES.S5;

  const up = springAt(frame, B.paperIn, {damping: 19, stiffness: 120, mass: 1});
  const paperY = (1 - up) * 1150;
  const paperRot = -6 + up * 3.5;

  const side = springAt(frame, B.paperIn + 6, {damping: 18, stiffness: 120});
  const count = prog(frame, B.countStart, B.countEnd, ease.out);

  const pill = springAt(frame, B.pill, {damping: 10, stiffness: 210, mass: 0.7});
  const pillCheck = prog(frame, B.pill + 3, B.pill + 10);

  const zoom = keys(frame, [
    [B.paperIn, 1],
    [B.out, 1.07],
  ]) * tween(frame, B.out, end + 10, 1, 1.5, ease.in);
  const out = tween(frame, B.out + 2, end + 9, 1, 0, ease.soft);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Camera frame={frame} zoom={zoom} x={990} y={560} seed={8} driftAmp={9}>
        <div
          style={{
            position: 'absolute',
            left: PAPER.cx - PAPER.w / 2,
            top: PAPER.cy - PAPER.h / 2,
            transform: `translateY(${paperY}px) rotate(${paperRot}deg)`,
          }}
        >
          <QuotePaper frame={frame} count={count} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 520,
            opacity: side,
            transform: `translateX(${(1 - side) * 260}px)`,
          }}
        >
          <SumCard count={count} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 340,
            opacity: Math.min(1, pill * 1.6),
            transform: `scale(${0.6 + 0.4 * pill})`,
            transformOrigin: '20% 50%',
          }}
        >
          <ReadyPill t={pillCheck} label={copy.quote.ready} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
