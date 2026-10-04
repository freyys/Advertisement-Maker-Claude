// Desktop "Dokumente" archive (screenshot 04): status counters, search, type
// and status chips, Excel export row and the monthly grouped document list.
import React from 'react';
import {d, rgba, tnum} from '../tokens';
import {docs} from '../copy';
import {Card, Crumbs, DocThumb, PagePill, PageTitle, StatusPill, Tone, toneColor} from '../kit/desktop';
import {IChevronDown, IPhone, ISearch, ITable} from '../kit/icons';

export type DocsState = {
  counters: number[];
  rows: number[];
  paid: number; // 0…1: RE-2026-081 switches from Offen to Bezahlt
  excel: number;
  chip: number; // highlight of the "Bezahlt" chip
};

const Chip: React.FC<{children: string; on?: number}> = ({children, on = 0}) => (
  <div
    style={{
      height: 31,
      padding: '0 14px',
      borderRadius: 16,
      border: `1px solid ${on > 0 ? rgba(d.accent, 0.4 + 0.5 * on) : d.lineStrong}`,
      background: on > 0 ? rgba(d.accent, 0.14 * on) : 'transparent',
      color: on > 0.5 ? d.accent : d.textSoft,
      display: 'flex',
      alignItems: 'center',
      fontSize: 14.5,
    }}
  >
    {children}
  </div>
);

export const DOCS_Y = {counters: 122, excel: 458, table: 538, rows: 636};
export const ROW_H = 92;

export const DokumentePage: React.FC<{s: DocsState}> = ({s}) => {
  const counterVals = [6 - s.paid, 5 + s.paid, 0];
  return (
    <div style={{position: 'relative', height: 1100}}>
      <PagePill style={{position: 'absolute', top: 72}}>{docs.pill}</PagePill>
      <PageTitle style={{position: 'absolute', top: 110}}>{docs.title}</PageTitle>
      <Crumbs items={docs.crumbs} style={{position: 'absolute', top: 172}} />

      {docs.counters.map((c, i) => {
        const tone = toneColor(c.tone as Tone);
        const v = counterVals[i] * s.counters[i];
        const changed = i < 2 && s.paid > 0 && s.paid < 1;
        return (
          <Card
            key={c.label}
            style={{
              position: 'absolute',
              left: 552 + i * 148,
              top: DOCS_Y.counters,
              width: 131,
              height: 77,
              padding: '13px 14px',
              boxShadow: changed ? `0 0 30px ${rgba(tone, 0.4)}` : undefined,
              borderColor: changed ? rgba(tone, 0.6) : undefined,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', color: d.textSoft, textTransform: 'uppercase'}}>
              <span style={{width: 6, height: 6, borderRadius: 3, background: tone}} />
              {c.label}
            </div>
            <div style={{marginTop: 9, fontSize: 25, fontWeight: 700, color: '#fff', ...tnum}}>{Math.round(v)}</div>
          </Card>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 663,
          top: 216,
          width: 316,
          height: 37,
          borderRadius: 9,
          border: `1px solid ${d.lineStrong}`,
          background: '#111114',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          fontSize: 15,
        }}
      >
        <IPhone size={15} color="#fff" /> Handy-Abgleich <IChevronDown size={13} color="#fff" stroke={2.2} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 270, width: 676, height: 40, borderRadius: 9, border: `1px solid ${d.lineStrong}`, background: '#111114', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontSize: 15, color: d.faint}}>
        <ISearch size={15} color={d.muted} /> Kunde oder Nummer suchen …
      </div>
      <div style={{position: 'absolute', left: 692, top: 270, width: 287, height: 40, borderRadius: 9, border: `1px solid ${d.lineStrong}`, background: '#111114', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, color: d.faint, letterSpacing: '0.06em'}}>
        TT.MM.JJJJ – TT.MM.JJJJ
      </div>
      <div style={{position: 'absolute', left: 0, top: 326, display: 'flex', gap: 8}}>
        {docs.types.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: 374, display: 'flex', gap: 8}}>
        {docs.states.map((t) => (
          <Chip key={t} on={t === 'Bezahlt' ? s.chip : 0}>
            {t}
          </Chip>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: 425, fontSize: 13, color: d.faint}}>{docs.summary}</div>
      <Card
        style={{
          position: 'absolute',
          left: 0,
          top: DOCS_Y.excel,
          width: 979,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 17px',
          fontSize: 15,
          borderColor: s.excel > 0 ? rgba(d.green, 0.3 + 0.5 * s.excel) : undefined,
          boxShadow: s.excel > 0 ? `0 0 ${36 * s.excel}px ${rgba(d.green, 0.3 * s.excel)}` : undefined,
        }}
      >
        <ITable size={16} color={s.excel > 0.3 ? d.green : '#fff'} /> {docs.excel}
        <span style={{flex: 1}} />
        <span
          style={{
            opacity: s.excel,
            fontSize: 13,
            fontWeight: 700,
            color: d.green,
            padding: '5px 12px',
            borderRadius: 14,
            background: rgba(d.green, 0.12),
            transform: `translateX(${(1 - s.excel) * 20}px)`,
          }}
        >
          ↓ .xlsx exportiert
        </span>
      </Card>

      {/* table */}
      <div style={{position: 'absolute', left: 0, top: DOCS_Y.table, width: 979, height: 22, borderBottom: `1px solid ${d.line}`, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', color: d.muted}}>
        {[
          ['DOKUMENT', 94],
          ['KUNDE', 225],
          ['DATUM', 425],
          ['NETTO', 602],
          ['STATUS', 727],
        ].map(([l, x]) => (
          <span key={l as string} style={{position: 'absolute', left: x as number}}>
            {l}
          </span>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: 572, width: 979, height: 50, borderBottom: `1px solid ${d.line}`, display: 'flex', alignItems: 'flex-start'}}>
        <span style={{fontSize: 16.5, fontWeight: 700, color: '#fff'}}>{docs.month}</span>
        <span style={{fontSize: 13.5, color: d.muted, marginLeft: 12, marginTop: 2}}>{docs.monthMeta}</span>
        <span style={{flex: 1}} />
        <div style={{textAlign: 'right', ...tnum}}>
          <div style={{fontSize: 16.5, fontWeight: 700}}>{docs.monthNet}</div>
          <div style={{fontSize: 12.5, color: d.muted, marginTop: 3}}>{docs.monthGross}</div>
        </div>
      </div>
      {docs.rows.map((r, i) => {
        const t = s.rows[i];
        const status = i === 0 && s.paid > 0.5 ? 'Bezahlt' : r.status;
        const flash = i === 0 ? Math.sin(Math.min(1, s.paid) * Math.PI) : 0;
        return (
          <div
            key={r.no}
            style={{
              position: 'absolute',
              left: 0,
              top: DOCS_Y.rows + i * ROW_H,
              width: 979,
              height: ROW_H,
              borderBottom: `1px solid ${d.line}`,
              opacity: t,
              transform: `translateY(${(1 - t) * 24}px)`,
              background: flash > 0 ? rgba(d.green, 0.07 * flash) : undefined,
              ...tnum,
            }}
          >
            <div style={{position: 'absolute', left: 13, top: 34, width: 19, height: 19, borderRadius: 5, border: `1.5px solid ${d.lineStrong}`}} />
            <div style={{position: 'absolute', left: 48, top: 24}}>
              <DocThumb size={30} />
            </div>
            <div style={{position: 'absolute', left: 94, top: 26}}>
              <div style={{fontSize: 15.5, fontWeight: 700, color: '#fff'}}>{r.no}</div>
              <div style={{fontSize: 13.5, color: d.muted, marginTop: 3}}>{r.type}</div>
            </div>
            <div style={{position: 'absolute', left: 225, top: 36, fontSize: 15.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {r.who}
            </div>
            <div style={{position: 'absolute', left: 425, top: 36, fontSize: 15.5, color: d.textSoft}}>{r.date}</div>
            <div style={{position: 'absolute', left: 560, width: 120, textAlign: 'right', top: 36, fontSize: 15.5, fontWeight: 700}}>{r.net}</div>
            <div style={{position: 'absolute', left: 727, top: 31, transform: `scale(${1 + flash * 0.12})`, transformOrigin: '0 50%'}}>
              <StatusPill status={status} glow={i === 0 ? flash : 0} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
