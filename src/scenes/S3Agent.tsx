import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {app, palette, STAGE, tabular} from '../theme';
import {S3_BEATS as B, SCENES} from '../timeline';
import {clamp01, ease, keys, prog, springAt, tween} from '../lib/anim';
import {eur, qty} from '../lib/format';
import * as copy from '../copy';
import {Camera, DirBlur} from '../components/Camera';
import {AppIcon, ICON_END_SCALE, ICON_SIZE, iconDrift} from '../components/AppIcon';
import {CHROME_H, GlassWindow, StatusTag} from '../components/Window';
import {Check, Spinner} from '../components/Icons';
import {
  AppSurface,
  AssistantHeader,
  ChatInput,
  DraftRow,
  PrimaryButton,
  SecondaryButton,
  UserBubble,
} from '../components/app/KavoxUI';

const K = 1.8;
const WIN = {x: 220, y: 64, w: 1480, h: 952};
const PAD = 40;
const LEFT_W = 702;
const GAP = 58;
const RIGHT_W = WIN.w - PAD * 2 - LEFT_W - GAP;
const ICON_TARGET = {x: WIN.x + 22 + 13 * 3 + 9 * 2 + 9 + 22 + 9 + 18, y: WIN.y + CHROME_H / 2, size: 36};

const words = copy.dictation.split(' ');

const micLevels = (frame: number) =>
  new Array(5).fill(0).map((_, i) => clamp01(0.35 + 0.65 * Math.abs(Math.sin(frame * 0.9 + i * 1.7) * Math.cos(frame * 0.37 + i))));

const DraftCard: React.FC<{frame: number}> = ({frame}) => {
  const live = prog(frame, B.send, B.send + 8, ease.soft);
  const flash = keys(frame, [
    [B.send, 0],
    [B.send + 3, 1],
    [B.send + 16, 0.25],
    [B.done, 0.25],
    [B.done + 4, 0.7],
    [B.done + 14, 0.2],
  ]);
  const head = prog(frame, B.send + 1, B.send + 8);
  const roomT = prog(frame, B.rowsStart - 3, B.rowsStart + 3);
  const shimmer = ((frame - B.send) % 24) / 24;
  const working = frame >= B.send && frame < B.done;

  // Netto ticks up as each row lands
  const cumulative = copy.positions.map((_, i) =>
    copy.positions.slice(0, i + 1).reduce((s, p) => s + copy.lineTotal(p), 0),
  );
  const nettoNow = copy.positions.reduce((acc, _, i) => {
    const t = prog(frame, B.rowsStart + i * B.rowEvery + 2, B.rowsStart + i * B.rowEvery + 10, ease.out);
    const prev = i === 0 ? 0 : cumulative[i - 1];
    return t > 0 ? prev + (cumulative[i] - prev) * t : acc;
  }, 0);
  const nettoT = prog(frame, B.rowsStart + 4, B.rowsStart + 9);
  const tail = prog(frame, B.done - 5, B.done + 4);

  const u = (pt: number) => pt * K;

  const skeleton = (w: number, i: number) => (
    <div
      key={i}
      style={{
        height: u(9),
        width: `${w}%`,
        borderRadius: 99,
        margin: `${u(6)}px 0`,
        background: working
          ? `linear-gradient(90deg, rgba(255,255,255,0.05) ${shimmer * 100 - 30}%, rgba(121,194,227,0.22) ${shimmer * 100}%, rgba(255,255,255,0.05) ${shimmer * 100 + 30}%)`
          : 'rgba(255,255,255,0.05)',
      }}
    />
  );

  return (
    <div
      style={{
        width: RIGHT_W,
        position: 'relative',
        padding: `${u(18)}px ${u(19)}px`,
        borderRadius: u(14),
        background: app.surface,
        border: `${u(1)}px solid ${`color-mix(in srgb, ${app.accent} ${Math.round(live * 100)}%, rgba(255,255,255,0.08))`}`,
        boxShadow: `0 0 ${60 * flash}px rgba(121,194,227,${0.45 * flash}), inset 0 0 ${40 * flash}px rgba(121,194,227,${0.12 * flash})`,
      }}
    >
      <div style={{opacity: head, transform: `translateY(${(1 - head) * 10}px)`}}>
        <div style={{fontSize: u(11), fontWeight: 700, letterSpacing: '0.12em', color: app.accent}}>
          {copy.draftCard.label}
        </div>
        <div style={{marginTop: u(8), fontSize: u(17), fontWeight: 800, color: app.text}}>{copy.customer}</div>
      </div>
      {head < 1 ? (
        <div style={{position: 'absolute', top: u(18), left: u(19), right: u(19), opacity: 1 - head}}>
          {skeleton(42, 0)}
          {skeleton(64, 1)}
        </div>
      ) : null}
      <div style={{marginTop: u(14), height: u(20), position: 'relative'}}>
        <div style={{fontSize: u(13.5), fontWeight: 700, opacity: roomT}}>{copy.room}</div>
        {roomT < 1 ? <div style={{position: 'absolute', inset: 0, opacity: 1 - roomT}}>{skeleton(30, 0)}</div> : null}
      </div>
      <div style={{marginTop: u(4)}}>
        {copy.positions.map((p, i) => {
          const at = B.rowsStart + i * B.rowEvery;
          const t = prog(frame, at, at + 7, ease.out);
          const sweep = prog(frame, at, at + 11, ease.soft);
          return (
            <div key={p.name} style={{position: 'relative', height: u(21)}}>
              {t < 1 ? (
                <div style={{position: 'absolute', inset: 0, opacity: 1 - t, paddingTop: u(1)}}>
                  {skeleton(72 - i * 8, i)}
                </div>
              ) : null}
              {sweep > 0 && sweep < 1 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: -u(8),
                    right: -u(8),
                    top: 0,
                    bottom: 0,
                    borderRadius: u(5),
                    background: `linear-gradient(90deg, rgba(121,194,227,0) ${sweep * 120 - 45}%, rgba(121,194,227,0.28) ${sweep * 120 - 10}%, rgba(121,194,227,0) ${sweep * 120 + 5}%)`,
                  }}
                />
              ) : null}
              <DraftRow
                k={K}
                name={p.name}
                value={qty(p.qty, p.unit)}
                style={{opacity: t, transform: `translateX(${(1 - t) * -14}px)`, position: 'relative'}}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: u(14),
          fontSize: u(14.5),
          fontWeight: 800,
          opacity: nettoT,
          ...tabular,
        }}
      >
        {copy.draftCard.nettoLabel} {eur(nettoNow)}
      </div>
      <div style={{opacity: tail, transform: `translateY(${(1 - tail) * 12}px)`}}>
        <div style={{marginTop: u(10), fontSize: u(11), lineHeight: 1.45, color: app.muted, fontWeight: 500}}>
          {copy.draftCard.note}
        </div>
        <PrimaryButton k={K} style={{marginTop: u(14)}}>
          {copy.draftCard.primary}
        </PrimaryButton>
        <SecondaryButton k={K} style={{marginTop: u(10)}}>
          {copy.draftCard.secondary}
        </SecondaryButton>
      </div>
    </div>
  );
};

const AgentSteps: React.FC<{frame: number}> = ({frame}) => {
  const doneT = prog(frame, B.done, B.done + 6);
  const statusIn = prog(frame, B.send + 1, B.send + 6);
  return (
    <div style={{marginTop: 26, opacity: statusIn}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 40, position: 'relative'}}>
        <div style={{width: 26, height: 26, position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - doneT}}>
            <Spinner size={26} frame={frame} color={palette.lavender} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: doneT}}>
            <Check size={26} t={doneT} />
          </div>
        </div>
        <div style={{position: 'relative', flex: 1, height: 40}}>
          <div
            style={{
              position: 'absolute',
              top: 6,
              fontSize: 23,
              color: app.muted,
              fontWeight: 600,
              opacity: 1 - doneT,
            }}
          >
            {copy.assistant.working}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 6,
              fontSize: 23,
              color: app.text,
              fontWeight: 700,
              opacity: doneT,
              transform: `translateY(${(1 - doneT) * 8}px)`,
            }}
          >
            {copy.assistant.done}
          </div>
        </div>
      </div>
      <div style={{marginTop: 8, marginLeft: 12, paddingLeft: 26, borderLeft: '2px solid rgba(169,139,255,0.18)'}}>
        {copy.agentSteps.map((s, i) => {
          const at = B.stepsStart + i * B.stepEvery;
          const t = prog(frame, at, at + 6);
          const ok = prog(frame, at + B.stepCheckAfter, at + B.stepCheckAfter + 5);
          return (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                height: 46,
                opacity: t,
                transform: `translateX(${(1 - t) * -16}px)`,
              }}
            >
              <div style={{width: 24, height: 24, position: 'relative', flex: 'none'}}>
                <div style={{position: 'absolute', inset: 0, opacity: 1 - ok}}>
                  <Spinner size={24} frame={frame + i * 3} />
                </div>
                <div style={{position: 'absolute', inset: 0, opacity: ok}}>
                  <Check size={24} t={ok} />
                </div>
              </div>
              <div style={{fontSize: 24, fontWeight: 600, color: app.text, whiteSpace: 'nowrap'}}>
                {s.label}
                {s.detail ? <span style={{color: app.muted, fontWeight: 500}}> · {s.detail}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S3Agent: React.FC = () => {
  const frame = useCurrentFrame();
  const {start, end} = SCENES.S3;

  // ---- camera ------------------------------------------------------------
  const zoom = keys(frame, [
    [start, 1],
    [B.windowSettled, 1],
    [104, 1.36],
    [B.dictateEnd, 1.38],
    [128, 1.04],
    [150, 1.1],
    [B.whipOut, 1.11],
  ]);
  const camX = keys(frame, [
    [start, STAGE.width / 2],
    [B.windowSettled, STAGE.width / 2],
    [104, 612],
    [B.dictateEnd, 616],
    [128, 960],
    [150, 1040],
    [B.whipOut, 1060],
  ]);
  const camY = keys(frame, [
    [start, STAGE.height / 2],
    [B.windowSettled, STAGE.height / 2],
    [104, 760],
    [B.dictateEnd, 772],
    [128, 548],
    [150, 566],
    [B.whipOut, 566],
  ]);
  // Whip out to the right
  const whip = prog(frame, B.whipOut, end + 4, ease.in);
  const whipX = whip * 1500;
  const whipZoom = 1 + whip * 0.35;
  const blurX = whip * 80;
  const out = tween(frame, end - 2, end + 5, 1, 0, ease.soft);

  // ---- window + icon -----------------------------------------------------
  const fly = prog(frame, start, start + 17, ease.inOut);
  const {x: idx, y: idy} = iconDrift(start);
  const iconFrom = {x: STAGE.width / 2 + idx, y: STAGE.height / 2 + idy, size: ICON_SIZE * ICON_END_SCALE};
  const iconX = iconFrom.x + (ICON_TARGET.x - iconFrom.x) * fly;
  const iconY = iconFrom.y + (ICON_TARGET.y - iconFrom.y) * fly - Math.sin(fly * Math.PI) * 60;
  const iconSize = iconFrom.size + (ICON_TARGET.size - iconFrom.size) * fly;
  const winOpen = prog(frame, start + 3, start + 20, ease.out);
  const clipR = winOpen * 2100;

  // ---- dictation ---------------------------------------------------------
  const focused = prog(frame, B.dictateStart - 4, B.dictateStart + 2) * (1 - prog(frame, B.send, B.send + 4));
  const wordsShown = keys(frame, [
    [B.dictateStart, 0],
    [B.dictateEnd, words.length],
  ], ease.soft);
  const sent = frame >= B.send;
  const inputText = sent
    ? null
    : wordsShown > 0
      ? (
          <span>
            {words.map((w, i) => {
              const o = clamp01(wordsShown - i);
              return o > 0 ? (
                <span key={i} style={{opacity: o}}>
                  {w}{' '}
                </span>
              ) : null;
            })}
          </span>
        )
      : null;
  const mic = prog(frame, B.dictateStart - 3, B.dictateStart + 2) * (1 - prog(frame, B.dictateEnd, B.dictateEnd + 3));
  const sendActive = keys(frame, [
    [B.dictateEnd - 2, 0],
    [B.dictateEnd + 1, 1],
    [B.send + 3, 1],
    [B.send + 8, 0],
  ]);

  const hintT = 1 - prog(frame, B.send - 3, B.send + 3);
  const bubble = springAt(frame, B.send, {damping: 22, stiffness: 190});
  const bubblePop = springAt(frame, B.send, {damping: 12, stiffness: 190});
  const tagDone = prog(frame, B.done, B.done + 5);

  const drift = 10 * prog(frame, start, start + 20);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <DirBlur x={blurX}>
        <Camera
          frame={frame}
          zoom={zoom * whipZoom}
          x={camX + whipX}
          y={camY}
          driftAmp={drift}
          seed={3}
        >
          {/* window */}
          <div
            style={{
              position: 'absolute',
              left: WIN.x,
              top: WIN.y,
              clipPath: `circle(${clipR}px at ${ICON_TARGET.x - WIN.x}px ${ICON_TARGET.y - WIN.y}px)`,
              opacity: winOpen,
              transform: `scale(${0.95 + 0.05 * winOpen})`,
              transformOrigin: `${ICON_TARGET.x - WIN.x}px ${ICON_TARGET.y - WIN.y}px`,
            }}
          >
            <GlassWindow
              width={WIN.w}
              height={WIN.h}
              title={copy.windowTitle}
              iconSlot={fly >= 1 ? <AppIcon size={36} glow={0.4} /> : null}
              tag={
                <div style={{position: 'relative', height: 30}}>
                  <StatusTag label={copy.tagWorking} dot={0.5 + 0.5 * Math.sin(frame * 0.4)} style={{opacity: 1 - tagDone}} />
                  <StatusTag
                    label={copy.tagDone}
                    tone="success"
                    style={{position: 'absolute', left: 0, top: 0, opacity: tagDone}}
                  />
                </div>
              }
            >
              <AppSurface k={K} style={{position: 'absolute', inset: 0}}>
                {/* left: assistant */}
                <div
                  style={{
                    position: 'absolute',
                    left: PAD,
                    top: PAD,
                    width: LEFT_W,
                    bottom: PAD,
                  }}
                >
                  <AssistantHeader
                    k={K}
                    pill={copy.assistant.pill}
                    title={copy.assistant.title}
                    status={copy.assistant.status}
                    readAloud={copy.assistant.readAloud}
                  />
                  <div style={{position: 'relative', marginTop: 30}}>
                    {hintT > 0 ? (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 40,
                          fontSize: 23,
                          lineHeight: 1.5,
                          color: app.textSoft,
                          fontWeight: 500,
                          opacity: hintT,
                        }}
                      >
                        {copy.assistant.hint}
                      </div>
                    ) : null}
                    {sent ? (
                      <div
                        style={{
                          transformOrigin: '100% 100%',
                          transform: `translateY(${Math.max(0, 1 - bubble) * 380}px) scale(${0.86 + 0.14 * bubblePop})`,
                          opacity: clamp01(bubble * 2),
                        }}
                      >
                        <UserBubble k={K}>{copy.dictation}</UserBubble>
                      </div>
                    ) : null}
                    {sent ? <AgentSteps frame={frame} /> : null}
                  </div>
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
                    <ChatInput
                      k={K}
                      text={inputText}
                      placeholder={sent ? copy.assistant.placeholderAfter : copy.assistant.placeholder}
                      focused={focused}
                      mic={mic}
                      micLevel={micLevels(frame)}
                      sendActive={sendActive}
                    />
                  </div>
                </div>
                {/* right: draft */}
                <div style={{position: 'absolute', top: PAD, right: PAD, width: RIGHT_W}}>
                  <DraftCard frame={frame} />
                </div>
              </AppSurface>
            </GlassWindow>
          </div>
          {/* flying icon (becomes the window icon) */}
          {fly < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: iconX - iconSize / 2,
                top: iconY - iconSize / 2,
              }}
            >
              <AppIcon size={iconSize} glow={1 - fly * 0.6} />
            </div>
          ) : null}
        </Camera>
      </DirBlur>
    </AbsoluteFill>
  );
};
