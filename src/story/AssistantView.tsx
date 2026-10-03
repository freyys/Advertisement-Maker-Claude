// The Kavox "Assistent" screen, laid out in app points so that every morph
// (input → bubble, status → reply, spoken text → new row) has exact rects.
import React from 'react';
import {app, palette, tabular} from '../theme';
import {clamp01, ease, keys, prog} from '../lib/anim';
import {eur, qty} from '../lib/format';
import {Check, Mic, Spinner} from '../components/Icons';
import {AppSurface, AssistantHeader, PrimaryButton, SecondaryButton, SendButton} from '../components/app/KavoxUI';
import * as copy from './copy';
import type {Layout, Rect} from './layout';
import {AENDERN, PRUEFEN, RECHNEN, SAGEN} from './timeline';
import {emph, lerp, lerpRect, mixColor, span} from './util';
import {Tap} from './Tap';

// ---- geometry (points) -----------------------------------------------------
const PADX = 20;
const FS = 14.5; // chat font size
const LH = FS * 1.36;
const BUBBLE_W = 318;
const bubbleH = (lines: number) => lines * LH + 22;
const CHAT_Y0 = 152;
const U1: Rect = {x: 390 - PADX - BUBBLE_W, y: CHAT_Y0, w: BUBBLE_W, h: bubbleH(4)};
const STATUS_Y = U1.y + U1.h + 12;
const A1: Rect = {x: PADX, y: STATUS_Y, w: BUBBLE_W, h: bubbleH(4)};
const CARD_Y = A1.y + A1.h + 12;
const CARD_W = 390 - PADX * 2;
const ROW_H = 21;
const card = (extra: number) => {
  const rowsEnd = 96 + 4 * ROW_H + extra;
  const netto = rowsEnd + 12;
  const note = netto + 30;
  const primary = note + 78;
  const secondary = primary + 56;
  return {rowsEnd, netto, note, primary, secondary, h: secondary + 46 + 18};
};
const INPUT_W = 390 - PADX * 2 - 40 - 9;
const inputH = (lines: number) => Math.max(50, lines * LH + 26);

export const assistantGeometry = (layout: Layout) => {
  const visibleBottom = layout.vpH - 76;
  const c4 = card(0);
  const c5 = card(ROW_H);
  const sC2 = Math.max(0, CARD_Y + c4.netto + 20 + 12 - visibleBottom);
  const sC3 = Math.max(0, CARD_Y + c5.netto + 20 + 12 - visibleBottom);
  const sC4 = Math.max(0, CARD_Y + c5.primary + 46 + 14 - visibleBottom);
  const primary: Rect = {x: PADX + 19, y: CARD_Y + c5.primary - sC4, w: CARD_W - 38, h: 46};
  return {sC2, sC3, sC4, primary};
};

const scrollAt = (frame: number, layout: Layout) => {
  const g = assistantGeometry(layout);
  return keys(
    frame,
    [
      [RECHNEN.scroll[0], 0],
      [RECHNEN.scroll[1], g.sC2],
      [AENDERN.scrollDown[0], g.sC2],
      [AENDERN.scrollDown[1], g.sC3],
      [PRUEFEN.scrollToButton[0], g.sC3],
      [PRUEFEN.scrollToButton[1], g.sC4],
    ],
    emph,
  );
};

const Lines: React.FC<{lines: string[]; color?: string; px: number; words?: number; style?: React.CSSProperties}> = ({
  lines,
  color,
  px,
  words,
  style,
}) => {
  let i = 0;
  return (
    <div style={{color, fontSize: px, lineHeight: 1.36, fontWeight: 500, ...style}}>
      {lines.map((l, li) => (
        <div key={li} style={{whiteSpace: 'nowrap', minHeight: px * 1.36}}>
          {words === undefined
            ? l
            : l.split(' ').map((w, wi) => {
                const o = clamp01(words - i++);
                return (
                  <span key={wi} style={{opacity: o}}>
                    {w}{' '}
                  </span>
                );
              })}
        </div>
      ))}
    </div>
  );
};

const micLevels = (frame: number) =>
  new Array(5).fill(0).map((_, i) => clamp01(0.3 + 0.7 * Math.abs(Math.sin(frame * 0.8 + i * 1.7) * Math.cos(frame * 0.33 + i))));

export const AssistantView: React.FC<{frame: number; layout: Layout}> = ({frame, layout}) => {
  const {k, vpH} = layout;
  const u = (pt: number) => pt * k;
  const scroll = scrollAt(frame, layout);
  const g = assistantGeometry(layout);

  // ---- 01: dictation → bubble ---------------------------------------------
  const words1 = copy.message1.join(' ').split(' ').length;
  const dict1 = keys(frame, [[SAGEN.dictateStart, 0], [SAGEN.dictateEnd, words1]], ease.soft);
  const lines1 = Math.max(1, copy.message1.findIndex((_, li) => {
    const upto = copy.message1.slice(0, li + 1).join(' ').split(' ').length;
    return upto >= Math.ceil(dict1);
  }) + 1);
  const sent1 = frame >= SAGEN.send;
  const m1 = span(frame, [SAGEN.send, SAGEN.sendMorphEnd]);

  // ---- 03: dictation → new row --------------------------------------------
  const words2 = copy.message2.join(' ').split(' ').length;
  const dict2 = keys(frame, [[AENDERN.dictateStart, 0], [AENDERN.dictateEnd, words2]], ease.soft);
  const sent2 = frame >= AENDERN.send;
  const fly = span(frame, [AENDERN.send, AENDERN.flyEnd]);
  const rowOpen = span(frame, AENDERN.rowOpen);
  const extra = ROW_H * rowOpen;
  const geo = card(extra);

  // input state
  const dictating1 = frame >= SAGEN.focus && !sent1;
  const dictating2 = frame >= AENDERN.focus && !sent2;
  const inLines = dictating1 ? lines1 : 1;
  const inH = inputH(inLines);
  const inputRect: Rect = {x: PADX, y: vpH - 14 - inH, w: INPUT_W, h: inH};
  const focused =
    prog(frame, SAGEN.focus - 4, SAGEN.focus + 4) * (1 - prog(frame, SAGEN.send, SAGEN.send + 6)) +
    prog(frame, AENDERN.focus - 4, AENDERN.focus + 4) * (1 - prog(frame, AENDERN.send, AENDERN.send + 6));
  const mic =
    prog(frame, SAGEN.dictateStart - 4, SAGEN.dictateStart) * (1 - prog(frame, SAGEN.dictateEnd, SAGEN.dictateEnd + 4)) +
    prog(frame, AENDERN.dictateStart - 4, AENDERN.dictateStart) * (1 - prog(frame, AENDERN.dictateEnd, AENDERN.dictateEnd + 4));
  const sendActive = Math.max(
    keys(frame, [[SAGEN.dictateEnd, 0], [SAGEN.dictateEnd + 4, 1], [SAGEN.send + 2, 1], [SAGEN.send + 8, 0]]),
    keys(frame, [[AENDERN.dictateEnd, 0], [AENDERN.dictateEnd + 4, 1], [AENDERN.send + 2, 1], [AENDERN.send + 8, 0]]),
  );

  // ---- status → reply → card ---------------------------------------------
  const statusIn = prog(frame, SAGEN.status, SAGEN.status + 8);
  const toReply = span(frame, [RECHNEN.reply, RECHNEN.reply + 18]);
  const reply2 = prog(frame, AENDERN.reply, AENDERN.reply + 12);
  const cardGrow = span(frame, [RECHNEN.card, RECHNEN.cardEnd]);
  const cardH = lerp(46, geo.h, cardGrow);
  const nettoNow =
    copy.basePositions.reduce((acc, _, i) => {
      const at = RECHNEN.rowsStart + i * RECHNEN.rowEvery;
      const t = prog(frame, at + 2, at + 12);
      const prev = copy.sum(copy.basePositions.slice(0, i));
      const cur = copy.sum(copy.basePositions.slice(0, i + 1));
      return t > 0 ? prev + (cur - prev) * t : acc;
    }, 0) +
    (copy.netto2 - copy.netto1) * span(frame, AENDERN.netto, ease.out);
  const newRowGlow =
    prog(frame, AENDERN.flyEnd - 4, AENDERN.flyEnd + 2) * (1 - prog(frame, AENDERN.flyEnd + 14, AENDERN.flyEnd + 34));
  const nettoGlow = prog(frame, AENDERN.netto[0], AENDERN.netto[0] + 4) * (1 - prog(frame, AENDERN.netto[1], AENDERN.netto[1] + 14));
  const press = keys(frame, [[PRUEFEN.tap - 2, 1], [PRUEFEN.tap + 1, 0.97], [PRUEFEN.tap + 6, 1]]);

  // flying text rect (03)
  const flyFrom: Rect = {x: PADX + 15, y: vpH - 14 - 50 + 13, w: 260, h: LH};
  const flyTo: Rect = {x: PADX + 19, y: CARD_Y + 96 + 4 * ROW_H - scroll, w: CARD_W - 38, h: ROW_H};
  const flyRect = lerpRect(flyFrom, flyTo, fly);
  const flyArc = Math.sin(fly * Math.PI) * 18;

  // send morph rect (01)
  const sendFrom: Rect = {x: PADX, y: vpH - 14 - inputH(4), w: INPUT_W, h: inputH(4)};
  const u1Now: Rect = {...U1, y: U1.y - scroll};
  const bubbleRect = sent1 ? lerpRect(sendFrom, u1Now, m1) : u1Now;

  return (
    <AppSurface k={k} style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {/* scrolled chat content */}
      <div style={{position: 'absolute', left: 0, top: -u(scroll), width: u(390)}}>
        <div style={{position: 'absolute', left: u(PADX), right: u(PADX), top: u(16)}}>
          <AssistantHeader
            k={k}
            pill={copy.assistant.pill}
            title={copy.assistant.title}
            status={copy.assistant.status}
            readAloud={copy.assistant.readAloud}
          />
        </div>
        {/* empty-state hint */}
        <div
          style={{
            position: 'absolute',
            left: u(PADX),
            top: u(CHAT_Y0 + 4),
            opacity: 1 - prog(frame, SAGEN.send - 8, SAGEN.send + 2),
          }}
        >
          <Lines lines={copy.assistant.hint} px={u(13)} color={app.textSoft} style={{lineHeight: 1.5}} />
        </div>

        {/* status (steps) → reply bubble */}
        {frame >= SAGEN.status ? (
          <div
            style={{
              position: 'absolute',
              left: u(A1.x),
              top: u(A1.y),
              width: u(lerp(CARD_W, A1.w, toReply)),
              height: u(lerp(86, A1.h, toReply)),
              borderRadius: u(13),
              background: mixColor('rgba(17,16,18,0)', app.surface, toReply),
              border: `${Math.max(1, 0.75 * k)}px solid ${mixColor('rgba(255,255,255,0)', 'rgba(255,255,255,0.075)', toReply)}`,
              opacity: statusIn,
              overflow: 'hidden',
            }}
          >
            {toReply < 0.6 ? (
              <div style={{position: 'absolute', left: 0, top: 0, opacity: 1 - prog(toReply, 0, 0.5)}}>
                <div style={{display: 'flex', alignItems: 'center', gap: u(8), height: u(22), fontSize: u(12.5), color: app.muted, fontWeight: 600}}>
                  <Spinner size={u(15)} frame={frame} color={palette.lavender} />
                  {copy.assistant.working}
                </div>
                {copy.steps.map((s, i) => {
                  const at = SAGEN.stepsStart + i * SAGEN.stepEvery;
                  const t = prog(frame, at, at + 8);
                  const ok = prog(frame, at + SAGEN.checkAfter, at + SAGEN.checkAfter + 6);
                  return (
                    <div
                      key={s.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: u(8),
                        height: u(21),
                        marginLeft: u(4),
                        fontSize: u(13),
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        opacity: t,
                        transform: `translateX(${(1 - t) * -10}px)`,
                      }}
                    >
                      <div style={{width: u(14), height: u(14), position: 'relative'}}>
                        <div style={{position: 'absolute', inset: 0, opacity: 1 - ok}}>
                          <Spinner size={u(14)} frame={frame + i * 3} />
                        </div>
                        <div style={{position: 'absolute', inset: 0, opacity: ok}}>
                          <Check size={u(14)} t={ok} />
                        </div>
                      </div>
                      {s.label}
                      {s.detail ? <span style={{color: app.muted, fontWeight: 500}}>· {s.detail}</span> : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {toReply > 0.4 ? (
              <div style={{position: 'absolute', left: u(14), top: u(11), opacity: prog(toReply, 0.45, 1)}}>
                <div style={{position: 'relative'}}>
                  <Lines lines={copy.reply1} px={u(FS)} color={app.text} style={{opacity: 1 - reply2}} />
                  <Lines
                    lines={copy.reply2}
                    px={u(FS)}
                    color={app.text}
                    style={{position: 'absolute', left: 0, top: 0, opacity: reply2}}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* draft card */}
        {frame >= RECHNEN.card ? (
          <div
            style={{
              position: 'absolute',
              left: u(PADX),
              top: u(CARD_Y),
              width: u(lerp(BUBBLE_W, CARD_W, cardGrow)),
              height: u(cardH),
              borderRadius: u(14),
              background: app.surface,
              border: `${u(1)}px solid ${mixColor('rgba(255,255,255,0.08)', app.accent, cardGrow)}`,
              boxShadow: `0 0 ${u(24) * (1 - cardGrow * 0.6)}px rgba(121,194,227,${0.25 * cardGrow})`,
              opacity: prog(frame, RECHNEN.card, RECHNEN.card + 6),
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', left: u(19), right: u(19), top: u(18)}}>
              <div style={{fontSize: u(11), fontWeight: 700, letterSpacing: '0.12em', color: app.accent, ...enterT(frame, RECHNEN.card + 8)}}>
                {copy.draftCard.label}
              </div>
              <div style={{marginTop: u(8), fontSize: u(17), fontWeight: 800, ...enterT(frame, RECHNEN.card + 11)}}>
                {copy.customer}
              </div>
              <div style={{marginTop: u(12), fontSize: u(13.5), fontWeight: 700, ...enterT(frame, RECHNEN.card + 14)}}>
                {copy.room}
              </div>
            </div>
            {/* rows */}
            {copy.allPositions.map((p, i) => {
              const isNew = i === 4;
              const at = RECHNEN.rowsStart + i * RECHNEN.rowEvery;
              const t = isNew ? prog(frame, AENDERN.flyEnd - 3, AENDERN.flyEnd + 2) : prog(frame, at, at + 9);
              return (
                <div
                  key={p.name}
                  style={{
                    position: 'absolute',
                    left: u(19),
                    right: u(19),
                    top: u(96 + i * ROW_H),
                    height: u(ROW_H),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: u(13),
                    fontWeight: 500,
                    opacity: t,
                    transform: isNew ? undefined : `translateX(${(1 - t) * -12}px)`,
                  }}
                >
                  {isNew ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: `0 ${u(-8)}px`,
                        borderRadius: u(6),
                        background: `rgba(121,194,227,${0.22 * newRowGlow})`,
                        boxShadow: `0 0 ${u(16) * newRowGlow}px rgba(121,194,227,${0.4 * newRowGlow})`,
                      }}
                    />
                  ) : null}
                  <span style={{position: 'relative'}}>{p.name}</span>
                  <span style={{position: 'relative', color: app.textSoft, ...tabular}}>{qty(p.qty, p.unit)}</span>
                </div>
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: u(19),
                top: u(geo.netto),
                fontSize: u(14.5),
                fontWeight: 800,
                opacity: prog(frame, RECHNEN.rowsStart + 4, RECHNEN.rowsStart + 10),
                textShadow: nettoGlow > 0 ? `0 0 ${u(10) * nettoGlow}px rgba(121,194,227,${0.8 * nettoGlow})` : undefined,
                ...tabular,
              }}
            >
              {copy.draftCard.nettoLabel}{' '}
              <span style={{color: nettoGlow > 0 ? mixColor('#F4F4F5', app.accent, nettoGlow) : undefined}}>{eur(nettoNow)}</span>
            </div>
            <div style={{position: 'absolute', left: u(19), right: u(19), top: u(geo.note), ...enterT(frame, RECHNEN.tail)}}>
              <Lines lines={copy.draftCard.note} px={u(11)} color={app.muted} style={{lineHeight: 1.45}} />
            </div>
            <div style={{position: 'absolute', left: u(19), right: u(19), top: u(geo.primary), ...enterT(frame, RECHNEN.tail + 4)}}>
              <div style={{transform: `scale(${press})`}}>
                <PrimaryButton k={k}>{copy.draftCard.primary}</PrimaryButton>
              </div>
            </div>
            <div style={{position: 'absolute', left: u(19), right: u(19), top: u(geo.secondary), ...enterT(frame, RECHNEN.tail + 7)}}>
              <SecondaryButton k={k}>{copy.draftCard.secondary}</SecondaryButton>
            </div>
          </div>
        ) : null}
      </div>

      {/* bottom input bar (fixed) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: u(inH + 40),
          background: `linear-gradient(180deg, rgba(10,10,10,0) 0%, ${app.bg} 38%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: u(inputRect.x),
          top: u(inputRect.y),
          width: u(inputRect.w),
          height: u(inputRect.h),
          borderRadius: u(16),
          background: app.field,
          border: `${Math.max(1.5, k)}px solid ${mixColor('rgba(255,255,255,0.075)', app.accent, focused)}`,
          boxShadow: focused > 0 ? `0 0 0 ${u(3) * focused}px rgba(121,194,227,${0.14 * focused})` : undefined,
          padding: `${u(13)}px ${u(15)}px`,
          fontSize: u(FS),
          lineHeight: 1.36,
          color: app.muted,
          fontWeight: 500,
        }}
      >
        {dictating1 && dict1 > 0 ? (
          <Lines lines={copy.message1} px={u(FS)} color={app.text} words={dict1} />
        ) : dictating2 && dict2 > 0 ? (
          <Lines lines={copy.message2} px={u(FS)} color={app.text} words={dict2} />
        ) : (
          <div style={{whiteSpace: 'nowrap', opacity: dictating1 || dictating2 ? 0.6 : 1}}>
            {frame < SAGEN.send ? copy.assistant.placeholder : copy.assistant.placeholderAfter}
          </div>
        )}
        {mic > 0 ? (
          <div
            style={{
              position: 'absolute',
              right: u(12),
              bottom: u(13),
              display: 'flex',
              alignItems: 'center',
              gap: u(2),
              opacity: mic,
            }}
          >
            <Mic size={u(15)} color={app.accent} />
            {micLevels(frame).map((l, i) => (
              <div key={i} style={{width: u(2.2), height: u(3 + l * 11), borderRadius: 9, background: app.accent}} />
            ))}
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', left: u(390 - PADX - 40), top: u(vpH - 14 - 45)}}>
        <SendButton k={k} active={sendActive} />
      </div>

      {/* 01: input → user bubble (container transform) */}
      {sent1 ? (
        <div
          style={{
            position: 'absolute',
            left: u(bubbleRect.x),
            top: u(bubbleRect.y),
            width: u(bubbleRect.w),
            height: u(bubbleRect.h),
            borderRadius: u(lerp(16, 13, m1)),
            background: mixColor(app.field, app.accent, m1),
            padding: `${u(lerp(13, 11, m1))}px ${u(lerp(15, 14, m1))}px`,
            overflow: 'hidden',
          }}
        >
          <Lines lines={copy.message1} px={u(FS)} color={mixColor(app.text, app.accentInk, m1)} />
        </div>
      ) : null}

      {/* 03: spoken text flies into the card and becomes the new row */}
      {sent2 && fly < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: u(flyRect.x),
            top: u(flyRect.y - flyArc),
            width: u(flyRect.w),
            height: u(flyRect.h),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: u(lerp(FS, 13, fly)),
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{position: 'absolute', left: 0, opacity: 1 - prog(fly, 0.35, 0.7), color: app.text}}>{copy.message2[0]}</span>
          <span style={{position: 'absolute', left: 0, opacity: prog(fly, 0.4, 0.8), color: app.accent}}>{copy.addedPosition.name}</span>
          <span style={{position: 'absolute', right: 0, opacity: prog(fly, 0.5, 0.9), color: app.accent, ...tabular}}>
            {qty(copy.addedPosition.qty, copy.addedPosition.unit)}
          </span>
        </div>
      ) : null}

      <Tap frame={frame} at={SAGEN.send} x={u(390 - PADX - 20)} y={u(vpH - 14 - 25)} size={u(40)} />
      <Tap frame={frame} at={AENDERN.send} x={u(390 - PADX - 20)} y={u(vpH - 14 - 25)} size={u(40)} />
      <Tap frame={frame} at={PRUEFEN.tap} x={u(g.primary.x + g.primary.w * 0.62)} y={u(g.primary.y + g.primary.h / 2)} size={u(40)} />
    </AppSurface>
  );
};

const enterT = (frame: number, at: number): React.CSSProperties => {
  const t = prog(frame, at, at + 10);
  return {opacity: t, transform: `translateY(${(1 - t) * 8}px)`};
};
