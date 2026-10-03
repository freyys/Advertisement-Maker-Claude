import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {app, FONT, palette} from '../theme';
import {ease, prog, springAt} from '../lib/anim';
import {GLYPHS, K_MARK} from '../components/Logo';
import {AppIcon} from '../components/AppIcon';
import {Invoice} from '../components/Icons';
import type {TeaserProps} from '../Teaser';
import {LAYOUTS, Layout, Rect} from './layout';
import {END, INTRO, PRUEFEN, UEBERGEBEN} from './timeline';
import {lerp, lerpRect, mixColor, span} from './util';
import {StoryBackground, StoryGrain} from './StoryBackground';
import {Captions} from './Caption';
import {AssistantView, assistantGeometry} from './AssistantView';
import {AufmassView, aufmassGeometry} from './AufmassView';
import {PaperContent, ReadyPill} from './Paper';
import {StorySfx} from './Sfx';
import * as copy from './copy';

const BEZEL = 11;
const SCREEN_R = 44;

const inflate = (r: Rect, d: number): Rect => ({x: r.x - d, y: r.y - d, w: r.w + d * 2, h: r.h + d * 2});
const center = (r: Rect) => ({x: r.x + r.w / 2, y: r.y + r.h / 2});
const square = (cx: number, cy: number, s: number): Rect => ({x: cx - s / 2, y: cy - s / 2, w: s, h: s});

/** Phone transform for chapter 05 (recedes) and the end (fades away). */
const phonePose = (frame: number, L: Layout) => {
  const back = span(frame, UEBERGEBEN.phoneBack);
  const gone = span(frame, [END.gather[0], END.gather[0] + 16]);
  return {
    scale: lerp(1, L.phoneBack.scale, back) * lerp(1, 0.92, gone),
    dx: L.phoneBack.dx * back,
    dy: L.phoneBack.dy * back,
    dim: 0.5 * back,
    opacity: 1 - gone,
  };
};

const applyPose = (r: Rect, L: Layout, pose: ReturnType<typeof phonePose>): Rect => {
  const c = center(L.phone);
  return {
    x: c.x + (r.x - c.x) * pose.scale + pose.dx,
    y: c.y + (r.y - c.y) * pose.scale + pose.dy,
    w: r.w * pose.scale,
    h: r.h * pose.scale,
  };
};

const PhoneScreen: React.FC<{frame: number; L: Layout}> = ({frame, L}) => {
  const {k} = L;
  const morph = span(frame, PRUEFEN.morph);
  const g = assistantGeometry(L);
  const from: Rect = {x: g.primary.x * k, y: g.primary.y * k, w: g.primary.w * k, h: g.primary.h * k};
  const full: Rect = {x: 0, y: 0, w: L.phone.w, h: L.phone.h};
  const r = lerpRect(from, full, morph);
  const showAssistant = frame < PRUEFEN.morph[1];
  const showMorph = frame >= PRUEFEN.morph[0] && frame < PRUEFEN.morph[1];
  const aufmassIn = span(frame, PRUEFEN.content, ease.soft);
  return (
    <AbsoluteFill>
      {showAssistant ? (
        <AbsoluteFill style={{transform: `scale(${1 - 0.04 * morph})`, opacity: 1 - 0.5 * morph}}>
          <AssistantView frame={frame} layout={L} />
        </AbsoluteFill>
      ) : null}
      {showMorph ? (
        // container transform: the "Prüfen & als Aufmaß übernehmen" button becomes the Aufmaß screen
        <div
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            borderRadius: lerp(9 * k, SCREEN_R, morph),
            background: mixColor(app.accent, app.bg, prog(morph, 0.1, 0.5)),
            overflow: 'hidden',
            boxShadow: `0 ${20 * morph}px ${60 * morph}px rgba(0,0,0,0.5)`,
          }}
        >
          <div style={{position: 'absolute', left: -r.x, top: -r.y, width: L.phone.w, height: L.phone.h, opacity: aufmassIn}}>
            <AufmassView frame={frame} layout={L} />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: app.accentInk,
              fontSize: 14 * k,
              fontWeight: 700,
              opacity: 1 - prog(morph, 0, 0.3),
              whiteSpace: 'nowrap',
            }}
          >
            {copy.draftCard.primary}
          </div>
        </div>
      ) : null}
      {frame >= PRUEFEN.morph[1] ? <AufmassView frame={frame} layout={L} hideSend={frame >= UEBERGEBEN.chip[0]} /> : null}
    </AbsoluteFill>
  );
};

/** Phone with bezel. During the intro it grows out of the app icon. */
const Phone: React.FC<{frame: number; L: Layout}> = ({frame, L}) => {
  const grow = span(frame, [INTRO.morphStart, INTRO.morphEnd]);
  const iconRect = square(L.icon.cx, L.icon.cy, L.icon.size);
  const shell = inflate(L.phone, BEZEL);
  const rect = lerpRect(iconRect, shell, grow);
  const pose = phonePose(frame, L);
  const posed = applyPose(rect, L, pose);
  const radius = lerp(L.icon.size * 0.28, SCREEN_R + BEZEL, grow);
  const contentIn = prog(frame, INTRO.contentIn, INTRO.morphEnd + 4, ease.soft);
  const iconFace = 1 - prog(grow, 0, 0.55, ease.soft);
  if (frame < INTRO.iconIn || pose.opacity <= 0) return null;

  const pop = springAt(frame, INTRO.iconIn, {damping: 12, stiffness: 140});
  const preScale = frame < INTRO.morphStart ? 0.7 + 0.3 * pop : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: posed.x,
        top: posed.y,
        width: posed.w,
        height: posed.h,
        opacity: pose.opacity * Math.min(1, pop * 1.5),
        transform: `scale(${preScale})`,
      }}
    >
      {/* bezel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius * pose.scale,
          background: 'linear-gradient(180deg, #1C1B23, #0C0C11)',
          boxShadow: [
            'inset 0 0 0 1px rgba(255,255,255,0.12)',
            `0 ${40 * grow}px ${120 * grow}px rgba(0,0,0,0.6)`,
            `0 0 ${140 * grow}px rgba(109,74,255,${0.22 * grow})`,
          ].join(', '),
        }}
      />
      {/* screen: anchored to its final rect, revealed by the growing shell */}
      <div
        style={{
          position: 'absolute',
          left: BEZEL * grow * pose.scale,
          top: BEZEL * grow * pose.scale,
          right: BEZEL * grow * pose.scale,
          bottom: BEZEL * grow * pose.scale,
          borderRadius: lerp(radius, SCREEN_R, grow) * pose.scale,
          overflow: 'hidden',
          background: app.bg,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: (L.phone.x - (rect.x + BEZEL * grow)) * pose.scale,
            top: (L.phone.y - (rect.y + BEZEL * grow)) * pose.scale,
            width: L.phone.w,
            height: L.phone.h,
            transform: `scale(${pose.scale})`,
            transformOrigin: '0 0',
            opacity: contentIn,
          }}
        >
          <PhoneScreen frame={frame} L={L} />
          {pose.dim > 0 ? <AbsoluteFill style={{background: `rgba(7,6,15,${pose.dim})`}} /> : null}
        </div>
      </div>
      {/* the app icon face fades away as it becomes the phone */}
      {iconFace > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: iconFace, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${posed.w / L.icon.size})`}}>
            <AppIcon size={L.icon.size} draw={prog(frame, INTRO.kDraw, INTRO.kDraw + 22, ease.inOut)} fill={prog(frame, INTRO.kDraw + 16, INTRO.kDraw + 28)} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** 05: send button → document chip → A4 Angebot; END: Angebot → app icon. */
const Document: React.FC<{frame: number; L: Layout}> = ({frame, L}) => {
  if (frame < UEBERGEBEN.chip[0]) return null;
  const {k} = L;
  const pose = phonePose(frame, L);
  const sg = aufmassGeometry(L).send;
  const btn = applyPose({x: L.phone.x + sg.x * k, y: L.phone.y + sg.y * k, w: sg.w * k, h: sg.h * k}, L, pose);
  const bc = center(btn);
  const CHIP = {w: 86, h: 106};
  const pc = center(L.paper);

  const toChip = span(frame, UEBERGEBEN.chip);
  const fly = span(frame, UEBERGEBEN.fly);
  const unfold = span(frame, UEBERGEBEN.unfold);
  const gather = span(frame, END.gather);

  // flight along a gentle arc
  const ctrl = {x: lerp(bc.x, pc.x, 0.5) + (L.name === 'screen' ? 0 : 160), y: Math.min(bc.y, pc.y) - (L.name === 'screen' ? 160 : 120)};
  const qx = (1 - fly) ** 2 * bc.x + 2 * (1 - fly) * fly * ctrl.x + fly ** 2 * pc.x;
  const qy = (1 - fly) ** 2 * bc.y + 2 * (1 - fly) * fly * ctrl.y + fly ** 2 * pc.y;
  const chipRect: Rect = {x: qx - CHIP.w / 2, y: qy - CHIP.h / 2, w: CHIP.w, h: CHIP.h};

  const endIcon = square(L.end.cx, L.end.cy, L.end.iconSize);
  let rect = lerpRect(btn, chipRect, toChip);
  if (fly > 0) rect = chipRect;
  if (unfold > 0) rect = lerpRect(chipRect, L.paper, unfold);
  if (gather > 0) rect = lerpRect(L.paper, endIcon, gather);

  const paperness = prog(unfold, 0.15, 0.75);
  const violet = prog(gather, 0.25, 0.85);
  const radius = gather > 0 ? lerp(6, L.end.iconSize * 0.28, gather) : unfold > 0 ? lerp(16, 6, unfold) : lerp(9 * k * pose.scale, 16, toChip);
  const label = 1 - prog(toChip, 0, 0.4);
  const docIcon = prog(toChip, 0.4, 1) * (1 - prog(unfold, 0, 0.4));
  const content = span(frame, UEBERGEBEN.paperContent, ease.soft) * (1 - prog(frame, END.gather[0], END.gather[0] + 8));
  const count = span(frame, UEBERGEBEN.count, ease.out);
  const unpack = span(frame, END.unpack);
  const rot = Math.sin(fly * Math.PI) * -6;

  if (unpack >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        transform: `rotate(${rot}deg) scale(${1 + 0.3 * prog(unpack, 0, 0.45)})`,
        opacity: 1 - prog(unpack, 0, 0.45, ease.soft),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          overflow: 'hidden',
          background: mixColor(app.accent, '#FFFFFF', paperness),
          boxShadow: `0 ${30 + 30 * paperness}px ${80 + 60 * paperness}px rgba(0,0,0,${0.55 * (1 - violet)}), 0 0 ${60 + 60 * (1 - paperness)}px rgba(121,194,227,${0.35 * (1 - paperness)}), 0 0 ${120 * violet}px rgba(109,74,255,${0.55 * violet})`,
        }}
      >
        {/* violet app-icon skin for the end morph */}
        {violet > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: violet,
              background: `linear-gradient(145deg, #8A6BFF 0%, ${palette.violet} 38%, #3F2AA6 72%, ${palette.indigo} 100%)`,
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.45), inset 0 0 40px rgba(169,139,255,0.55)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(160deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0) 52%)',
              }}
            />
          </div>
        ) : null}
        {label > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: app.accentInk,
              fontSize: 14 * k * pose.scale,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              opacity: label,
            }}
          >
            {copy.aufmass.send}
          </div>
        ) : null}
        {docIcon > 0 ? (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: docIcon}}>
            <Invoice size={46} color={app.accentInk} stroke={1.8} />
          </div>
        ) : null}
        {content > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: L.paper.x - rect.x,
              top: L.paper.y - rect.y,
              width: L.paper.w,
              height: L.paper.h,
              opacity: content,
            }}
          >
            <PaperContent frame={frame} w={L.paper.w} count={count} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Pill: React.FC<{frame: number; L: Layout}> = ({frame, L}) => {
  if (frame < UEBERGEBEN.pill) return null;
  const pop = springAt(frame, UEBERGEBEN.pill, {damping: 11, stiffness: 190, mass: 0.8});
  const check = prog(frame, UEBERGEBEN.pill + 4, UEBERGEBEN.pill + 12);
  const out = prog(frame, END.gather[0], END.gather[0] + 8);
  const s = L.name === 'screen' ? 1 : 1.05;
  return (
    <div
      style={{
        position: 'absolute',
        left: center(L.paper).x,
        top: L.paper.y + L.paper.h,
        transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * pop) * (1 - 0.2 * out)})`,
        opacity: Math.min(1, pop * 1.6) * (1 - out),
      }}
    >
      <ReadyPill t={check} scale={s} />
    </div>
  );
};

/** END: K mark leaves the icon and the letters slide out from behind it. */
const Lockup: React.FC<{frame: number; L: Layout}> = ({frame, L}) => {
  const kIn = span(frame, END.kIn);
  if (kIn <= 0) return null;
  const f = Math.min(frame, END.holdFrom);
  const unpack = span(f, END.unpack);
  const {cx, cy, iconSize, logoW} = L.end;
  const logoCy = cy - (L.name === 'screen' ? 44 : 56);
  const sA = (iconSize * 0.42) / 100;
  const sB = logoW / 472.29;
  const kx = lerp(cx - 66 * sA + iconSize * 0.01, cx - logoW / 2, unpack);
  const ky = lerp(cy - 50 * sA, logoCy - 50 * sB, unpack);
  const ks = lerp(sA, sB, unpack) * (0.85 + 0.15 * kIn);
  const wx = cx - logoW / 2;
  const wy = logoCy - 50 * sB;
  const t1 = prog(f, END.tagline1, END.tagline1 + 12);
  const t2 = prog(f, END.tagline2, END.tagline2 + 12);
  const fs1 = L.name === 'screen' ? 56 : 64;
  const fs2 = L.name === 'screen' ? 42 : 48;
  return (
    <AbsoluteFill>
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id="behind-k">
            <rect x={134} y={-20} width={400} height={140} />
          </clipPath>
        </defs>
        <g transform={`translate(${wx} ${wy}) scale(${sB})`} clipPath="url(#behind-k)">
          {GLYPHS.slice(1).map((d, i) => {
            const t = prog(f, END.unpack[0] + 11 + i * 2, END.unpack[0] + 22 + i * 2, ease.out);
            return <path key={i} d={d} fill="#fff" fillRule="evenodd" opacity={t} transform={`translate(${-(1 - t) * 150} 0)`} />;
          })}
        </g>
        <path
          d={K_MARK}
          fill="#fff"
          opacity={kIn}
          transform={`translate(${kx} ${ky}) scale(${ks})`}
          style={{filter: unpack < 1 ? `drop-shadow(0 0 ${8 * (1 - unpack)}px rgba(255,255,255,0.6))` : undefined}}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: logoCy + (logoW / 4.7229) / 2 + (L.name === 'screen' ? 42 : 56),
          textAlign: 'center',
          fontFamily: FONT,
        }}
      >
        <div style={{fontSize: fs1, fontWeight: 600, color: palette.lavender, opacity: t1, transform: `translateY(${(1 - t1) * 16}px)`}}>
          {copy.endCard.feature}
        </div>
        <div
          style={{
            marginTop: L.name === 'screen' ? 8 : 12,
            fontSize: fs2,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            opacity: t2,
            transform: `translateY(${(1 - t2) * 14}px)`,
          }}
        >
          {copy.endCard.soon}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StoryStage: React.FC<{layout: Layout}> = ({layout: L}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: palette.white, overflow: 'hidden'}}>
      <StoryBackground />
      <Captions layout={L} />
      <Phone frame={frame} L={L} />
      <Document frame={frame} L={L} />
      <Pill frame={frame} L={L} />
      <Lockup frame={frame} L={L} />
      <StoryGrain />
    </AbsoluteFill>
  );
};

const StoryAudio: React.FC<TeaserProps> = ({withMusic, withSfx}) => (
  <>
    {withSfx ? <StorySfx /> : null}
    {withMusic ? <Audio src={staticFile('sound.mp3')} /> : null}
  </>
);

export const StoryScreen: React.FC<TeaserProps> = (props) => (
  <AbsoluteFill style={{background: palette.bg}}>
    <StoryStage layout={LAYOUTS.screen} />
    <StoryAudio {...props} />
  </AbsoluteFill>
);

export const StoryVertical: React.FC<TeaserProps> = (props) => (
  <AbsoluteFill style={{background: palette.bg}}>
    <StoryStage layout={LAYOUTS.vertical} />
    <StoryAudio {...props} />
  </AbsoluteFill>
);
