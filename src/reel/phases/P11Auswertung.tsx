// P11 · Auswertung: KPI cards count up, then twelve months of revenue grow
// out of the baseline and the camera lands on October.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions, umsatz} from '../copy';
import {d, tnum} from '../tokens';
import {de, eur} from '../../lib/format';
import {Caption, CutFlash, ease, prog, UnderCaption, Whip} from '../kit/stage';
import {camAt, Card, CONTENT_X, Crumbs, DesktopApp, DesktopShot, PagePill, PageTitle, SectionHead} from '../kit/desktop';
import {BarChart} from '../kit/charts';
import {ITable} from '../kit/icons';
import {CutWhoosh, S} from '../kit/sfx';

const Y = {kpi: 373, chart: 509};

const AuswertungPage: React.FC<{kpi: number[]; grow: (i: number) => number; peak: number}> = ({kpi, grow, peak}) => (
  <div style={{position: 'relative', height: 900}}>
    <PagePill style={{position: 'absolute', top: 72}}>Überblick · Zahlen</PagePill>
    <PageTitle style={{position: 'absolute', top: 110}}>Auswertung</PageTitle>
    <Crumbs items={['Umsatz', 'Angebote', 'Kunden & Leistungen', 'Zahlungseingänge']} style={{position: 'absolute', top: 172}} />
    <div style={{position: 'absolute', top: 216, display: 'flex', height: 44, borderRadius: 10, border: `1px solid ${d.lineStrong}`, overflow: 'hidden', fontSize: 15.5}}>
      {['Letzte 12 Monate', 'Dieses Jahr', 'Gesamt'].map((l, i) => (
        <div
          key={l}
          style={{
            padding: '0 17px',
            display: 'flex',
            alignItems: 'center',
            borderLeft: i ? `1px solid ${d.lineStrong}` : undefined,
            color: i === 0 ? d.accent : '#fff',
            background: i === 0 ? 'rgba(92,196,228,0.1)' : undefined,
            boxShadow: i === 0 ? `inset 0 0 0 1px ${d.accent}` : undefined,
            borderRadius: i === 0 ? 10 : 0,
          }}
        >
          {l}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 290, width: 979}}>
      <SectionHead no="01" title="Umsatz" meta="Letzte 12 Monate" right="01 / 04" />
    </div>
    <div style={{position: 'absolute', top: 338, fontSize: 15, color: d.muted}}>Rechnungen nach Rechnungsdatum, netto. Abschläge zählen nur einmal.</div>
    {umsatz.kpis.map((k, i) => (
      <Card key={k.label} style={{position: 'absolute', left: i * 332, top: Y.kpi, width: 315, height: 124, padding: '22px 18px'}}>
        <div style={{fontSize: 13.5, fontWeight: 600, color: d.textSoft}}>{k.label}</div>
        <div style={{marginTop: 10, fontSize: 31, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', ...tnum}}>
          {k.unit === '€' ? eur(k.value * kpi[i]) : `${Math.round(k.value * kpi[i])}${k.unit ? ` ${k.unit}` : ''}`}
        </div>
        <div style={{marginTop: 8, fontSize: 13.5, color: d.muted}}>{k.foot}</div>
      </Card>
    ))}
    <Card style={{position: 'absolute', left: 0, top: Y.chart, width: 979, height: 275, padding: '20px 18px 0'}}>
      <div style={{fontSize: 14.5, fontWeight: 700, color: d.textSoft}}>Umsatz je Monat (netto) · Letzte 12 Monate</div>
      <div style={{marginTop: 14}}>
        <BarChart w={943} h={218} labels={umsatz.months} values={umsatz.values} max={5000} grow={grow} barW={46} peakLabel={`${de(4.1, 1)} T€`} peakT={peak} />
      </div>
    </Card>
    <Card style={{position: 'absolute', left: 0, top: 796, width: 979, height: 48, display: 'flex', alignItems: 'center', gap: 12, padding: '0 17px', fontSize: 15}}>
      <ITable size={16} color="#fff" /> Werte als Tabelle
    </Card>
  </div>
);

export const P11Auswertung: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const cam = camAt(frame, [
    [0, {fx: 870, fy: 450, s: 0.8, rx: 18, ry: 16, rz: -3}],
    [20, {fx: CONTENT_X + 320, fy: Y.kpi + 62, s: 1.6, rx: 0, ry: 3, rz: 0}],
    [40, {fx: CONTENT_X + 340, fy: Y.kpi + 62, s: 1.62}],
    [54, {fx: CONTENT_X + 660, fy: Y.kpi + 62, s: 1.6, ry: -3}],
    [70, {fx: CONTENT_X + 490, fy: Y.chart + 120, s: 1.08, rx: 4, ry: 0}],
    [92, {fx: CONTENT_X + 490, fy: Y.chart + 130, s: 1.1}],
    [108, {fx: CONTENT_X + 820, fy: Y.chart + 120, s: 1.75, ry: -4}],
    [dur, {fx: CONTENT_X + 830, fy: Y.chart + 118, s: 1.8, ry: -3}],
  ]);
  const kpi = [prog(frame, 14, 44, ease.out), prog(frame, 22, 50, ease.out), prog(frame, 44, 64, ease.out)];
  const grow = (i: number) => prog(frame, 60 + (i - 6) * 4, 82 + (i - 6) * 4, ease.out);
  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <DesktopShot cam={cam} cy={1220}>
            <DesktopApp active="auswertung">
              <AuswertungPage kpi={kpi} grow={grow} peak={prog(frame, 86, 96)} />
            </DesktopApp>
          </DesktopShot>
        </UnderCaption>
      </Whip>
      <Caption c={captions.auswertung} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={12} src="whoosh-soft.wav" vol={0.4} />
      <S at={58} src="whoosh-soft.wav" vol={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <S key={i} at={64 + i * 4} src="tick.wav" vol={0.3 + i * 0.05} />
      ))}
      <S at={88} src="shimmer.wav" vol={0.4} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
