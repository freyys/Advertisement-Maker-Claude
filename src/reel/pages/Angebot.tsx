// Desktop "Angebot erstellen" (screenshots 05 + 07): stepper, Kunde form,
// live PDF preview on the right and the sticky totals bar.
import React from 'react';
import {d, rgba, tnum} from '../tokens';
import {eur} from '../../lib/format';
import {angebot} from '../copy';
import {Crumbs, PagePill, PageTitle, SectionHead} from '../kit/desktop';
import {ICheck, IChevronDown, IFilePdf, IFolderOpen, IHelp, IMaximize} from '../kit/icons';
import {A4H, A4W, PdfPage} from '../kit/pdf';
import {clamp01} from '../../lib/anim';

export type AngebotState = {
  steps: number[]; // 0…1 checked per step (5)
  name: number; // typed chars of the customer name
  address: number; // 0…1 typed
  pdfHead: number;
  pdfRows: number;
  pdfSub: number;
  totals: number;
  press: number;
  btnGlow: number;
  pulse: number; // preview refresh pulse
};

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 15, fontWeight: 500, color: d.textSoft, display: 'flex', alignItems: 'center', ...style}}>{children}</div>
);

const Field: React.FC<{children?: React.ReactNode; h?: number; muted?: boolean; focus?: boolean; style?: React.CSSProperties}> = ({
  children,
  h = 40,
  muted,
  focus,
  style,
}) => (
  <div
    style={{
      marginTop: 8,
      height: h,
      borderRadius: 9,
      background: '#121215',
      border: `1px solid ${focus ? rgba(d.accent, 0.8) : d.lineStrong}`,
      boxShadow: focus ? `0 0 0 3px ${rgba(d.accent, 0.15)}` : undefined,
      padding: '0 13px',
      display: 'flex',
      alignItems: h > 44 ? 'flex-start' : 'center',
      paddingTop: h > 44 ? 10 : 0,
      fontSize: 15.5,
      color: muted ? d.faint : '#fff',
      lineHeight: 1.45,
      ...tnum,
      ...style,
    }}
  >
    {children}
  </div>
);

const Caret: React.FC<{on: boolean}> = ({on}) => (on ? <span style={{display: 'inline-block', width: 1.5, height: 18, background: d.accent, marginLeft: 1}} /> : null);

export const PREVIEW = {x: 617, y: 68, w: 418, h: 727};
export const BAR = {x: 328 - 380, y: 812, w: 1082, h: 72}; // relative to content origin
export const BUTTON = {x: 1081, y: 823, w: 317, h: 48}; // window coords

export const AngebotPage: React.FC<{s: AngebotState; frame: number}> = ({s, frame}) => {
  const typedName = angebot.customer.slice(0, Math.floor(s.name));
  const addrLines = [angebot.street, angebot.city];
  const addrChars = Math.floor(s.address * (angebot.street.length + angebot.city.length));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const pageW = PREVIEW.w - 28;
  const z = pageW / A4W;
  return (
    <div style={{position: 'relative', height: 900}}>
      <PagePill style={{position: 'absolute', top: 72}}>{angebot.pill}</PagePill>
      <PageTitle style={{position: 'absolute', top: 110}}>{angebot.title}</PageTitle>
      <Crumbs items={angebot.crumbs} style={{position: 'absolute', top: 172}} />

      {/* stepper */}
      <div
        style={{
          position: 'absolute',
          top: 238,
          width: 592,
          height: 54,
          borderTop: `1px solid ${d.line}`,
          borderBottom: `1px solid ${d.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}
      >
        {angebot.steps.map((st, i) => {
          const t = clamp01(s.steps[i]);
          return (
            <React.Fragment key={st}>
              {i > 0 ? <div style={{flex: 1, height: 1, background: t > 0.5 ? rgba(d.accent, 0.6) : d.lineStrong}} /> : null}
              <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: '#fff', whiteSpace: 'nowrap'}}>
                <div
                  style={{
                    width: 21,
                    height: 21,
                    borderRadius: 11,
                    background: t > 0 ? rgba(d.accent, t) : 'transparent',
                    border: t > 0.5 ? 'none' : `1px solid ${d.lineStrong}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: d.muted,
                    transform: `scale(${1 + Math.sin(t * Math.PI) * 0.35})`,
                    boxShadow: t > 0 && t < 1 ? `0 0 16px ${rgba(d.accent, 0.8)}` : undefined,
                  }}
                >
                  {t > 0.5 ? <ICheck size={12} color={d.accentInk} stroke={3.2} /> : i + 1}
                </div>
                {st}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', top: 302, width: 592, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, fontSize: 15.5}}>
        <div style={{width: 34, height: 20, borderRadius: 10, background: d.accent, position: 'relative'}}>
          <div style={{position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: 8, background: '#fff'}} />
        </div>
        PDF-Vorschau <IHelp size={17} color={d.muted} stroke={1.6} />
      </div>
      <div style={{position: 'absolute', top: 340, width: 592, height: 48, borderRadius: 12, border: `1px solid ${d.line}`, background: d.card, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontSize: 15}}>
        <IFolderOpen size={16} color={d.textSoft} /> Vorlagen (0)
      </div>

      <div style={{position: 'absolute', top: 440, width: 592}}>
        <SectionHead no="01" title="Kunde" right="01 / 05" />
      </div>
      <div style={{position: 'absolute', top: 486, width: 263}}>
        <Label>
          Kunde übernehmen (optional) <span style={{flex: 1}} /> <IHelp size={16} color={d.muted} stroke={1.6} />
        </Label>
        <Field>
          — neu eintippen — <span style={{flex: 1}} /> <IChevronDown size={16} color="#fff" stroke={2} />
        </Field>
        <Label style={{marginTop: 22}}>Name / Firma des Kunden *</Label>
        <Field focus={s.name > 0 && s.address === 0}>
          {typedName}
          <Caret on={caretOn && s.name > 0 && s.address === 0} />
        </Field>
        <Label style={{marginTop: 22}}>Adresse des Kunden *</Label>
        <Field h={70} focus={s.address > 0 && s.address < 1}>
          <div>
            <div>{addrLines[0].slice(0, addrChars)}</div>
            <div>
              {addrLines[1].slice(0, Math.max(0, addrChars - addrLines[0].length))}
              <Caret on={caretOn && s.address > 0 && s.address < 1} />
            </div>
          </div>
        </Field>
      </div>
      <div style={{position: 'absolute', top: 486, left: 329, width: 263}}>
        <Label>Angebotsdatum</Label>
        <Field>{angebot.date}</Field>
        <Label style={{marginTop: 22}}>
          Angebotsnummer <span style={{flex: 1}} /> <IHelp size={16} color={d.muted} stroke={1.6} />
        </Label>
        <Field>{angebot.number}</Field>
        <Label style={{marginTop: 24, gap: 10}}>
          <span style={{width: 16, height: 16, borderRadius: 4, border: `1px solid ${d.lineStrong}`}} /> „Gültig bis“ manuell festlegen
        </Label>
        <Label style={{marginTop: 18, color: d.muted, fontSize: 14}}>Gültig bis (automatisch: Datum + 30 Tage)</Label>
        <Field muted>{angebot.validUntil}</Field>
      </div>

      {/* live preview */}
      <div
        style={{
          position: 'absolute',
          left: PREVIEW.x,
          top: PREVIEW.y,
          width: PREVIEW.w,
          height: PREVIEW.h,
          borderRadius: 16,
          background: '#0D0D10',
          border: `1px solid ${d.lineStrong}`,
          overflow: 'hidden',
          boxShadow: s.pulse > 0 ? `0 0 0 1px ${rgba(d.accent, 0.5 * s.pulse)}, 0 0 40px ${rgba(d.accent, 0.2 * s.pulse)}` : undefined,
        }}
      >
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, padding: '24px 14px 0'}}>
          <span style={{fontSize: 18.5, fontWeight: 700, color: '#fff'}}>Vorschau</span>
          <span style={{fontSize: 14, color: d.muted, ...tnum}}>2 Seiten · Stand 15:16:{String(15 + Math.floor(s.pdfRows * 2)).padStart(2, '0')}</span>
          <span style={{flex: 1}} />
          <span style={{fontSize: 15, color: d.textSoft, display: 'flex', alignItems: 'center', gap: 6}}>
            <IMaximize size={14} color={d.textSoft} /> Größer
          </span>
        </div>
        <div style={{position: 'absolute', left: 14, top: 59, width: pageW, height: A4H * z, borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
          <div style={{zoom: z}}>
            <PdfPage head={s.pdfHead} rows={s.pdfRows} sub={s.pdfSub} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 14, top: 59 + A4H * z + 16, width: pageW, height: 200, borderRadius: 4, overflow: 'hidden', background: '#fff', opacity: s.pdfSub}}>
          <div style={{zoom: z}}>
            <PdfPage head={0} rows={1} sub={0} />
          </div>
        </div>
      </div>

      {/* totals bar (sticky in the app) */}
      <div
        style={{
          position: 'absolute',
          left: BAR.x,
          top: BAR.y,
          width: BAR.w,
          height: BAR.h,
          borderRadius: 16,
          background: '#101013',
          border: `1px solid ${d.lineStrong}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px 0 22px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
        }}
      >
        {[
          ['Netto', angebot.netto],
          ['MwSt 19 %', angebot.mwst],
          ['Brutto', angebot.brutto],
        ].map(([l, v], i) => (
          <div key={l as string} style={{paddingRight: 28, marginRight: 28, borderRight: i < 2 ? `1px solid ${d.line}` : 'none'}}>
            <div style={{fontSize: 11.5, fontWeight: 600, letterSpacing: '0.16em', color: d.muted, textTransform: 'uppercase'}}>{l}</div>
            <div style={{fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 3, letterSpacing: '-0.02em', ...tnum}}>{eur((v as number) * s.totals)}</div>
          </div>
        ))}
        <span style={{flex: 1}} />
        <IHelp size={20} color={d.muted} stroke={1.6} />
        <div
          style={{
            marginLeft: 22,
            width: BUTTON.w,
            height: BUTTON.h,
            borderRadius: 10,
            background: d.accent,
            color: d.accentInk,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 17,
            fontWeight: 600,
            transform: `scale(${1 - s.press * 0.04})`,
            boxShadow: `0 0 ${40 * s.btnGlow}px ${rgba(d.accent, 0.7 * s.btnGlow)}`,
          }}
        >
          <IFilePdf size={18} color={d.accentInk} /> Angebot generieren
        </div>
      </div>
    </div>
  );
};
