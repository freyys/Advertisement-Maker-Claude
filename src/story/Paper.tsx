import React from 'react';
import {palette, tabular} from '../theme';
import {prog} from '../lib/anim';
import {de, eur} from '../lib/format';
import {Wordmark} from '../components/Logo';
import {Check} from '../components/Icons';
import * as copy from './copy';
import {UEBERGEBEN} from './timeline';

const INK = '#16151A';
const GREY = '#8A8893';
const LINE = '#E7E5EC';

/** A4 Angebot. Layout is relative to the paper width so it scales cleanly. */
export const PaperContent: React.FC<{frame: number; w: number; count: number}> = ({frame, w, count}) => {
  const s = w / 600; // design width 600
  const px = (n: number) => n * s;
  const cols = `${px(46)}px 1fr ${px(92)}px ${px(64)}px ${px(102)}px`;
  return (
    <div style={{padding: `${px(48)}px ${px(44)}px`, color: INK}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Wordmark width={px(142)} color={INK} style={{marginTop: px(6)}} />
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: px(36), fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1}}>{copy.quote.title}</div>
          <div style={{fontSize: px(14), color: GREY, marginTop: px(7), fontWeight: 600}}>{copy.quote.number}</div>
        </div>
      </div>
      <div style={{height: px(2), background: palette.violet, marginTop: px(24), width: px(56), borderRadius: 2}} />
      <div style={{marginTop: px(24), fontSize: px(12), letterSpacing: '0.14em', color: GREY, fontWeight: 700}}>KUNDE</div>
      <div style={{marginTop: px(5), fontSize: px(21), fontWeight: 700}}>{copy.customer}</div>
      <div style={{marginTop: px(8), width: px(180), height: px(9), borderRadius: 5, background: LINE}} />
      <div style={{marginTop: px(7), width: px(130), height: px(9), borderRadius: 5, background: LINE}} />
      <div style={{marginTop: px(24), fontSize: px(16), fontWeight: 600}}>
        <span style={{color: GREY}}>Betreff: </span>
        {copy.quote.subject}
      </div>
      <div
        style={{
          marginTop: px(20),
          display: 'grid',
          gridTemplateColumns: cols,
          fontSize: px(11.5),
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: GREY,
          paddingBottom: px(9),
          borderBottom: `${px(2)}px solid ${INK}`,
        }}
      >
        {copy.quote.head.map((h, i) => (
          <div key={h} style={{textAlign: i >= 2 ? 'right' : 'left'}}>
            {h.toUpperCase()}
          </div>
        ))}
      </div>
      {copy.allPositions.map((p, i) => {
        const t = prog(frame, UEBERGEBEN.rowsStart + i * UEBERGEBEN.rowEvery, UEBERGEBEN.rowsStart + i * UEBERGEBEN.rowEvery + 8);
        return (
          <div
            key={p.name}
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              alignItems: 'center',
              fontSize: px(15),
              fontWeight: 500,
              padding: `${px(11)}px 0`,
              borderBottom: `1px solid ${LINE}`,
              opacity: t,
              transform: `translateY(${(1 - t) * 8}px)`,
              ...tabular,
            }}
          >
            <div style={{color: GREY}}>{i + 1}</div>
            <div style={{fontWeight: 600, whiteSpace: 'nowrap'}}>{p.short}</div>
            <div style={{textAlign: 'right', whiteSpace: 'nowrap'}}>{`${de(p.qty, 1)} ${p.unit}`}</div>
            <div style={{textAlign: 'right', color: GREY}}>{de(p.unitPrice)}</div>
            <div style={{textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap'}}>{eur(copy.lineTotal(p))}</div>
          </div>
        );
      })}
      <div style={{marginTop: px(22), marginLeft: 'auto', width: px(320), ...tabular}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: px(15), padding: `${px(4)}px 0`}}>
          <span style={{color: GREY, fontWeight: 600}}>{copy.quote.netto}</span>
          <span style={{fontWeight: 600}}>{eur(copy.netto2 * count)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: px(15), padding: `${px(4)}px 0`}}>
          <span style={{color: GREY, fontWeight: 600}}>{copy.quote.mwst}</span>
          <span style={{fontWeight: 600}}>{eur(copy.mwst2 * count)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: px(8),
            paddingTop: px(12),
            borderTop: `${px(2)}px solid ${INK}`,
          }}
        >
          <span style={{fontSize: px(18), fontWeight: 800}}>{copy.quote.total}</span>
          <span style={{fontSize: px(30), fontWeight: 800, color: palette.violet}}>{eur(copy.brutto2 * count)}</span>
        </div>
      </div>
    </div>
  );
};

export const ReadyPill: React.FC<{t: number; scale: number}> = ({t, scale}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14 * scale,
      height: 70 * scale,
      padding: `0 ${30 * scale}px 0 ${16 * scale}px`,
      borderRadius: 999,
      background: 'linear-gradient(180deg, rgba(109,74,255,0.92), rgba(62,38,170,0.95))',
      border: '1.5px solid rgba(190,170,255,0.7)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(109,74,255,0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
      color: '#fff',
      fontSize: 30 * scale,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}
  >
    <div
      style={{
        width: 42 * scale,
        height: 42 * scale,
        borderRadius: 99,
        background: 'rgba(74,222,155,0.2)',
        border: '1.5px solid rgba(74,222,155,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Check size={26 * scale} t={t} />
    </div>
    {copy.quote.ready}
  </div>
);
