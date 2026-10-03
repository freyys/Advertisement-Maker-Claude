// The Kavox "Aufmaß" screen (rebuilt from the app), laid out in points.
import React from 'react';
import {app, tabular} from '../theme';
import {keys} from '../lib/anim';
import {eur, qty} from '../lib/format';
import {ArrowLeft} from '../components/Icons';
import {CloseIcon, Field, SectionHeader} from '../components/app/KavoxUI';
import * as copy from './copy';
import type {Layout, Rect} from './layout';
import {PRUEFEN} from './timeline';
import {emph} from './util';
import {Tap} from './Tap';

const PADX = 20;
const TOP = 56;
const Y = {
  badge: 70,
  note: 104,
  title: 152,
  div1: 214,
  kunde: 230,
  kundeField: 256,
  address: 310,
  phone: 382,
  div2: 442,
  raeume: 458,
  room: 484,
  div3: 1124,
  fotos: 1136,
  div4: 1266,
  summe: 1282,
  sumCard: 1308,
  sign: 1443,
  div5: 1505,
  notiz: 1521,
  noteField: 1547,
  send: 1631,
  remove: 1687,
};
const POS_H = 78;

export const aufmassGeometry = (layout: Layout) => {
  const s1 = Y.raeume - 74;
  const s2 = Y.send + 46 + 16 - layout.vpH;
  const send: Rect = {x: PADX, y: Y.send - s2, w: 390 - PADX * 2, h: 46};
  return {s1, s2, send};
};

const Divider: React.FC<{y: number; u: (n: number) => number}> = ({y, u}) => (
  <div style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(y), height: 1, background: 'rgba(255,255,255,0.08)'}} />
);

const Btn: React.FC<{
  u: (n: number) => number;
  y: number;
  label: string;
  tone: 'accent' | 'ghost' | 'danger';
  style?: React.CSSProperties;
}> = ({u, y, label, tone, style}) => (
  <div
    style={{
      position: 'absolute',
      left: u(PADX),
      right: u(PADX),
      top: u(y),
      height: u(46),
      borderRadius: u(9),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: u(14),
      fontWeight: 700,
      background: tone === 'accent' ? app.accent : app.button,
      color: tone === 'accent' ? app.accentInk : tone === 'danger' ? app.danger : app.text,
      border: tone === 'accent' ? 'none' : `${u(0.75)}px solid ${tone === 'danger' ? 'rgba(240,122,122,0.35)' : 'rgba(255,255,255,0.09)'}`,
      ...style,
    }}
  >
    {label}
  </div>
);

export const AufmassView: React.FC<{frame: number; layout: Layout; hideSend?: boolean}> = ({frame, layout, hideSend}) => {
  const {k} = layout;
  const u = (pt: number) => pt * k;
  const g = aufmassGeometry(layout);
  const scroll = keys(
    frame,
    [
      [PRUEFEN.scroll1[0], 0],
      [PRUEFEN.scroll1[1], g.s1],
      [PRUEFEN.scroll2[0], g.s1],
      [PRUEFEN.scroll2[1], g.s2],
    ],
    emph,
  );
  const press = keys(frame, [[PRUEFEN.tapSend - 2, 1], [PRUEFEN.tapSend + 1, 0.97], [PRUEFEN.tapSend + 5, 1]]);
  const muted: React.CSSProperties = {fontSize: u(12.5), lineHeight: 1.45, color: app.muted, fontWeight: 500};

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: 'inherit', color: app.text}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${app.bgTint} 0%, #121A1E ${u(180)}px, ${app.bg} ${u(520)}px)`,
        }}
      />
      <div style={{position: 'absolute', left: 0, top: -u(scroll), width: u(390)}}>
        {/* badge + note */}
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            top: u(Y.badge),
            height: u(26),
            padding: `0 ${u(12)}px`,
            borderRadius: 99,
            border: `${u(0.75)}px solid rgba(255,255,255,0.35)`,
            display: 'flex',
            alignItems: 'center',
            gap: u(7),
            fontSize: u(13),
            fontWeight: 600,
          }}
        >
          <div style={{width: u(7), height: u(7), borderRadius: 9, background: app.muted}} />
          {copy.aufmass.badge}
        </div>
        <div style={{position: 'absolute', left: u(PADX), top: u(Y.note), ...muted}}>
          {copy.aufmass.note.map((l) => (
            <div key={l} style={{whiteSpace: 'nowrap'}}>{l}</div>
          ))}
        </div>
        <Field k={k} value={copy.aufmass.title} bold style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(Y.title)}} />
        <Divider y={Y.div1} u={u} />

        <div style={{position: 'absolute', left: u(PADX), top: u(Y.kunde)}}>
          <SectionHeader k={k} no="01" title="KUNDE" />
        </div>
        <Field k={k} value={copy.customer} style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(Y.kundeField)}} />
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            right: u(PADX),
            top: u(Y.address),
            height: u(62),
            borderRadius: u(8),
            background: app.field,
            border: `${u(0.75)}px solid rgba(255,255,255,0.07)`,
            padding: `${u(11)}px ${u(14)}px`,
            fontSize: u(14),
            lineHeight: 1.45,
            color: app.muted,
          }}
        >
          {copy.aufmass.address.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <Field k={k} placeholder={copy.aufmass.phone} style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(Y.phone)}} />
        <Divider y={Y.div2} u={u} />

        <div style={{position: 'absolute', left: u(PADX), top: u(Y.raeume)}}>
          <SectionHeader k={k} no="02" title="RÄUME & POSITIONEN" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            right: u(PADX),
            top: u(Y.room),
            height: u(13 + 44 + 10 + 44 + 10 + copy.allPositions.length * POS_H + (copy.allPositions.length - 1) * 10 + 13),
            borderRadius: u(14),
            background: app.surface,
            border: `${u(0.75)}px solid rgba(255,255,255,0.07)`,
            padding: u(13),
          }}
        >
          <Field k={k} value={copy.room} bold right={<CloseIcon k={k} />} />
          <Field k={k} placeholder={copy.aufmass.farbton} style={{marginTop: u(10)}} />
          {copy.allPositions.map((p) => (
            <div
              key={p.name}
              style={{
                marginTop: u(10),
                height: u(POS_H),
                display: 'flex',
                alignItems: 'center',
                gap: u(12),
                padding: `0 ${u(13)}px`,
                borderRadius: u(11),
                background: app.card,
                border: `${u(0.75)}px solid rgba(255,255,255,0.065)`,
              }}
            >
              <div style={{flex: 1}}>
                <div style={{fontSize: u(14.5), fontWeight: 700, whiteSpace: 'nowrap'}}>{p.name}</div>
                <div style={{marginTop: u(3), fontSize: u(10.5), lineHeight: 1.45, color: app.muted, fontWeight: 500}}>
                  {p.formula.map((l, i) => (
                    <div key={i} style={{whiteSpace: 'nowrap', minHeight: u(15)}}>{l}</div>
                  ))}
                </div>
              </div>
              <div style={{textAlign: 'right', ...tabular}}>
                <div style={{fontSize: u(15.5), fontWeight: 800, whiteSpace: 'nowrap'}}>{qty(p.qty, p.unit)}</div>
                <div style={{marginTop: u(2), fontSize: u(12.5), color: app.textSoft, whiteSpace: 'nowrap'}}>
                  {eur(copy.lineTotal(p))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Btn u={u} y={Y.room + 576} label="+ Weiterer Raum" tone="ghost" />
        <Divider y={Y.div3} u={u} />

        <div style={{position: 'absolute', left: u(PADX), top: u(Y.fotos)}}>
          <SectionHeader k={k} no="03" title="FOTOS" />
        </div>
        <div style={{position: 'absolute', left: u(PADX), top: u(Y.fotos + 24), ...muted}}>
          {copy.aufmass.fotosNote.map((l) => (
            <div key={l} style={{whiteSpace: 'nowrap'}}>{l}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(Y.fotos + 70), display: 'flex', gap: u(10)}}>
          {['Foto aufnehmen', 'Aus Fotos'].map((l) => (
            <div
              key={l}
              style={{
                flex: 1,
                height: u(44),
                borderRadius: u(9),
                background: app.button,
                border: `${u(0.75)}px solid rgba(255,255,255,0.09)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: u(14),
                fontWeight: 700,
              }}
            >
              {l}
            </div>
          ))}
        </div>
        <Divider y={Y.div4} u={u} />

        <div style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(Y.summe), display: 'flex', justifyContent: 'space-between'}}>
          <SectionHeader k={k} no="04" title="SUMME VOR ORT" />
          <span style={{fontSize: u(12), color: app.muted, fontWeight: 600, ...tabular}}>{eur(copy.brutto2)}</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            right: u(PADX),
            top: u(Y.sumCard),
            padding: `${u(12)}px ${u(14)}px`,
            borderRadius: u(12),
            background: app.surface,
            border: `${u(0.75)}px solid rgba(255,255,255,0.08)`,
            ...tabular,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: u(26), fontSize: u(14)}}>
            <span style={{color: app.textSoft, fontWeight: 600}}>Netto</span>
            <span style={{fontWeight: 800}}>{eur(copy.netto2)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: u(26), fontSize: u(13)}}>
            <span style={{color: app.muted, fontWeight: 600}}>MwSt 19 %</span>
            <span style={{color: app.textSoft, fontWeight: 600}}>{eur(copy.mwst2)}</span>
          </div>
          <div style={{height: 1, background: 'rgba(255,255,255,0.08)', margin: `${u(8)}px 0`}} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: u(30)}}>
            <span style={{fontSize: u(15), fontWeight: 800}}>Brutto</span>
            <span style={{fontSize: u(22), fontWeight: 800}}>{eur(copy.brutto2)}</span>
          </div>
        </div>
        <Btn u={u} y={Y.sign} label={copy.aufmass.sign} tone="accent" />
        <Divider y={Y.div5} u={u} />

        <div style={{position: 'absolute', left: u(PADX), top: u(Y.notiz)}}>
          <SectionHeader k={k} no="05" title="NOTIZ VOM TERMIN" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            right: u(PADX),
            top: u(Y.noteField),
            height: u(70),
            borderRadius: u(8),
            background: app.field,
            border: `${u(0.75)}px solid rgba(255,255,255,0.07)`,
            padding: `${u(11)}px ${u(14)}px`,
            ...muted,
            fontSize: u(13),
          }}
        >
          {copy.aufmass.noteField.map((l) => (
            <div key={l} style={{whiteSpace: 'nowrap'}}>{l}</div>
          ))}
        </div>
        <Btn
          u={u}
          y={Y.send}
          label={copy.aufmass.send}
          tone="accent"
          style={{opacity: hideSend ? 0 : 1, transform: `scale(${press})`}}
        />
        <Btn u={u} y={Y.remove} label={copy.aufmass.remove} tone="danger" />
      </div>

      {/* fixed top bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: u(TOP),
          background: app.bg,
          display: 'flex',
          alignItems: 'center',
          gap: u(14),
          padding: `0 ${u(PADX)}px`,
          borderBottom: `${u(0.5)}px solid rgba(255,255,255,0.05)`,
        }}
      >
        <ArrowLeft size={u(22)} />
        <div style={{fontSize: u(18), fontWeight: 800}}>{copy.aufmass.title}</div>
      </div>

      <Tap frame={frame} at={PRUEFEN.tapSend} x={u(g.send.x + g.send.w * 0.6)} y={u(g.send.y + g.send.h / 2)} size={u(40)} />
    </div>
  );
};
