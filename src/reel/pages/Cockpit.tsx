// Desktop "Cockpit" page (screenshots 01 + 02): greeting, four KPI cards,
// "Als Nächstes", "Schnellstart", "Zuletzt bearbeitet" and the two charts.
import React from 'react';
import {d, rgba, tnum} from '../tokens';
import {de, eur} from '../../lib/format';
import {cashflow, cockpit, umsatz} from '../copy';
import {BarChart, CashflowChart} from '../kit/charts';
import {Card, DocThumb, PagePill, PageTitle, SectionHead, StatusPill, Tone, toneColor} from '../kit/desktop';
import {
  IArrowRight,
  IClock,
  IFile,
  IHourglass,
  IMessages,
  IReceipt,
  ISliders,
  ITrend,
  IUserPlus,
  ICheckCircle,
  IWallet,
} from '../kit/icons';

export const COCKPIT_Y = {stats: 272, sections: 427, recent: 712, chart: 1080, bars: 1365};
export const STAT_X = [0, 249, 498, 747];
export const STAT_W = 232;

const StatIcon: React.FC<{i: number; c: string}> = ({i, c}) => {
  const I = [IWallet, IClock, ITrend, IHourglass][i];
  return <I size={17} color={c} stroke={2} />;
};

export type CockpitState = {
  stats?: number[]; // count-up 0…1 per card
  statsIn?: number[]; // entrance 0…1 per card
  trend?: number;
  next?: number[];
  quick?: number[];
  recent?: number[];
  cashDraw?: number;
  cashTotal?: number;
  overdue?: number;
  bars?: (i: number) => number;
  glowCard?: number; // index of a highlighted stat card
  glow?: number;
};

export const CockpitPage: React.FC<{s: CockpitState}> = ({s}) => {
  const stats = s.stats ?? [1, 1, 1, 1];
  const statsIn = s.statsIn ?? [1, 1, 1, 1];
  const next = s.next ?? [1, 1];
  const quick = s.quick ?? [1, 1, 1, 1];
  const recent = s.recent ?? [1, 1, 1, 1, 1];
  return (
    <div style={{position: 'relative', height: 1700}}>
      <PagePill style={{position: 'absolute', top: 72}}>{cockpit.pill}</PagePill>
      <PageTitle style={{position: 'absolute', top: 110}}>{cockpit.title}</PageTitle>
      <div style={{position: 'absolute', top: 172, fontSize: 16, color: d.muted}}>{cockpit.sub}</div>
      <div style={{position: 'absolute', right: 0, top: 222, display: 'flex', alignItems: 'center', gap: 9, color: d.textSoft, fontSize: 15}}>
        <ISliders size={15} color={d.textSoft} /> Cockpit anpassen
      </div>

      {cockpit.stats.map((st, i) => {
        const tone = toneColor(st.tone as Tone);
        const t = statsIn[i];
        const g = s.glowCard === i ? s.glow ?? 0 : 0;
        return (
          <Card
            key={st.label}
            style={{
              position: 'absolute',
              left: STAT_X[i],
              top: COCKPIT_Y.stats + (1 - t) * 30,
              width: STAT_W,
              height: 122,
              padding: '19px 18px',
              opacity: t,
              boxShadow: g > 0 ? `0 0 0 1px ${rgba(tone, 0.5 * g)}, 0 0 40px ${rgba(tone, 0.25 * g)}` : undefined,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, fontWeight: 600, color: d.textSoft}}>
              <StatIcon i={i} c={i === 1 ? d.rose : i === 0 ? d.yellow : d.accent} />
              {st.label}
            </div>
            <div style={{marginTop: 12, fontSize: 31, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', ...tnum}}>{eur(st.value * stats[i])}</div>
            <div style={{marginTop: 9, fontSize: 13.5, color: d.muted, display: 'flex', alignItems: 'center', gap: 5}}>
              {st.trend ? (
                <span style={{color: d.green, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3, opacity: s.trend ?? 1}}>
                  ↑ {st.trend}
                </span>
              ) : null}
              {st.foot}
            </div>
          </Card>
        );
      })}

      {/* 01 — Als nächstes */}
      <div style={{position: 'absolute', left: 0, top: COCKPIT_Y.sections, width: 564}}>
        <SectionHead no="01" title="Als nächstes" meta="2 offen" right="01 / 02" />
        {cockpit.next.map((n, i) => {
          const t = next[i];
          const c = toneColor(n.tone as Tone);
          const I = i === 0 ? IReceipt : IMessages;
          return (
            <Card
              key={n.title}
              style={{
                marginTop: i === 0 ? 18 : 8,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 16px',
                opacity: t,
                transform: `translateX(${(1 - t) * -40}px)`,
              }}
            >
              <div style={{width: 30, height: 30, borderRadius: 8, background: rgba(c, 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <I size={16} color={c} />
              </div>
              <div>
                <div style={{fontSize: 15, fontWeight: 600, color: '#fff'}}>{n.title}</div>
                <div style={{fontSize: 13.5, color: d.muted, marginTop: 3}}>{n.sub}</div>
              </div>
            </Card>
          );
        })}
        <div style={{marginTop: 14, marginLeft: 10, display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: d.textSoft, opacity: next[1]}}>
          <IArrowRight size={14} color={d.textSoft} /> Alles zum Nachfassen
        </div>
      </div>

      {/* 02 — Schnellstart */}
      <div style={{position: 'absolute', left: 628, top: COCKPIT_Y.sections, width: 351}}>
        <SectionHead no="02" title="Schnellstart" right="02 / 02" />
        {cockpit.quick.map((q, i) => {
          const I = [IFile, IReceipt, IUserPlus, ICheckCircle][i];
          const t = quick[i];
          return (
            <div
              key={q}
              style={{
                marginTop: i === 0 ? 18 : 8,
                height: 42,
                borderRadius: 9,
                border: `1px solid ${d.lineStrong}`,
                background: d.button,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 15,
                color: '#fff',
                opacity: t,
                transform: `translateY(${(1 - t) * 14}px)`,
              }}
            >
              <I size={15} color={d.accent} /> {q}
            </div>
          );
        })}
        <div style={{marginTop: 46, fontSize: 16.5, fontWeight: 700, color: '#fff'}}>Zuletzt bearbeitet</div>
        {cockpit.recent.map((r, i) => (
          <div
            key={r.title}
            style={{
              height: 57.5,
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              paddingLeft: 8,
              opacity: recent[i],
              transform: `translateY(${(1 - recent[i]) * 12}px)`,
            }}
          >
            <DocThumb size={26} />
            <div style={{flex: 1}}>
              <div style={{fontSize: 14.5, fontWeight: 600, color: '#fff'}}>{r.title}</div>
              <div style={{fontSize: 13.5, color: d.muted, marginTop: 2}}>{r.who}</div>
            </div>
            <StatusPill status={r.status} />
          </div>
        ))}
        <div style={{marginTop: 4, marginLeft: 10, display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: d.textSoft}}>
          <IArrowRight size={14} color={d.textSoft} /> Alle Dokumente
        </div>
      </div>

      {/* Cashflow-Radar */}
      <Card style={{position: 'absolute', left: 0, top: COCKPIT_Y.chart, width: 979, height: 258, padding: '22px 18px 0'}}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <div style={{fontSize: 14.5, fontWeight: 600, color: d.textSoft}}>{cashflow.title}</div>
          <div style={{flex: 1}} />
          <div style={{fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', ...tnum}}>{eur(cashflow.total * (s.cashTotal ?? 1))}</div>
          <div style={{fontSize: 12.5, color: d.muted, marginLeft: 8}}>{cashflow.until}</div>
        </div>
        <div style={{marginTop: 12}}>
          <CashflowChart w={943} weeks={cashflow.weeks} values={cashflow.values} max={10000} draw={s.cashDraw ?? 1} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 225,
            fontSize: 13.5,
            fontWeight: 600,
            color: d.yellow,
            opacity: s.overdue ?? 1,
            transform: `translateY(${(1 - (s.overdue ?? 1)) * 8}px)`,
          }}
        >
          {cashflow.overdue}
        </div>
      </Card>

      {/* Umsatz der letzten 6 Monate */}
      <Card style={{position: 'absolute', left: 0, top: COCKPIT_Y.bars, width: 979, height: 300, padding: '22px 18px 0'}}>
        <div style={{fontSize: 14.5, fontWeight: 600, color: d.textSoft}}>Umsatz der letzten 6 Monate (netto)</div>
        <div style={{marginTop: 14}}>
          <BarChart
            w={943}
            h={240}
            labels={umsatz.months.slice(6)}
            values={umsatz.values.slice(6)}
            max={5000}
            grow={s.bars ?? (() => 1)}
            barW={44}
            peakLabel={`${de(4.1, 1)} T€`}
            peakT={s.bars ? s.bars(5) : 1}
          />
        </div>
      </Card>
    </div>
  );
};
