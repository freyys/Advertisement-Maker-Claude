import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {palette} from '../theme';
import {S7_BEATS as B, S8_BEATS} from '../timeline';
import {clamp01, ease, keys, prog, springAt, tween} from '../lib/anim';
import * as copy from '../copy';
import {Camera} from '../components/Camera';
import {BAR, BAR_TOP, barCamera, CommandBar} from '../components/CommandBar';
import {Calc, Check, Cursor, Invoice, Mail} from '../components/Icons';

const MENU = {x: BAR.cx - BAR.w / 2 + 24, w: 620, row: 82, pad: 14};
const MENU_H = MENU.row * copy.commandBar.options.length + MENU.pad * 2;
const MENU_BOTTOM = BAR_TOP - 20;
const MENU_TOP = MENU_BOTTOM - MENU_H;
const rowTop = (i: number) => MENU_TOP + MENU.pad + i * MENU.row;

const TARGET = {x: MENU.x + 330, y: rowTop(copy.commandBar.target) + MENU.row / 2 + 6};
const START = {x: 1640, y: 1060};

const bez = (t: number, a: number, b: number, c: number, d: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

const ICONS = {
  check: () => <Check size={28} color={palette.success} stroke={2.8} />,
  calc: (c: string) => <Calc size={28} color={c} />,
  invoice: (c: string) => <Invoice size={28} color={c} />,
  mail: (c: string) => <Mail size={28} color={c} />,
};

const Sparkles: React.FC<{frame: number; x: number; y: number}> = ({frame, x, y}) => {
  const t = prog(frame, B.click, B.click + 16, ease.out);
  if (frame < B.click || t >= 1) return null;
  return (
    <>
      {new Array(8).fill(0).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2 + random(`sp-a-${i}`) * 0.5;
        const dist = 80 + random(`sp-d-${i}`) * 90;
        const size = 22 + random(`sp-s-${i}`) * 18;
        const px = x + Math.cos(ang) * dist * t;
        const py = y + Math.sin(ang) * dist * t;
        const o = 1 - prog(frame, B.click + 6, B.click + 16, ease.soft);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            style={{
              position: 'absolute',
              left: px - size / 2,
              top: py - size / 2,
              opacity: o,
              transform: `rotate(${t * 90 + i * 20}deg) scale(${0.6 + 0.6 * (1 - t)})`,
              filter: `drop-shadow(0 0 10px ${palette.lavender}) drop-shadow(0 0 4px #fff)`,
            }}
          >
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={i % 3 === 0 ? '#fff' : palette.lavender} />
          </svg>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: x - 50,
          top: y - 50,
          width: 100,
          height: 100,
          borderRadius: 99,
          border: `2px solid rgba(169,139,255,${0.8 * (1 - t)})`,
          transform: `scale(${0.3 + t * 1.2})`,
        }}
      />
    </>
  );
};

export const S7CommandBar: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = barCamera(frame);

  // typing
  const full = copy.commandBar.text;
  const chars = Math.round(keys(frame, [[B.typeStart, 0], [B.typeEnd, full.length]], ease.soft));
  const text = full.slice(0, chars);
  const caret = frame < S8_BEATS.stretch && (frame < B.typeEnd || frame % 16 < 9);

  // menu
  const menu = springAt(frame, B.menuOpen, {damping: 17, stiffness: 200});
  const menuClose = prog(frame, B.menuClose, B.menuClose + 8, ease.in);
  const menuOpacity = clamp01(menu * 1.4) * (1 - menuClose);

  // cursor along a bezier path
  const ct = prog(frame, B.cursorIn, B.cursorArrive, ease.inOut);
  const cx = bez(ct, START.x, START.x - 120, TARGET.x + 320, TARGET.x);
  const cy = bez(ct, START.y, START.y - 260, TARGET.y + 140, TARGET.y);
  const cursorIn = prog(frame, B.cursorIn, B.cursorIn + 5);
  const cursorOut = prog(frame, B.menuClose + 2, B.menuClose + 9);
  const press = keys(frame, [[B.click - 2, 1], [B.click, 0.82], [B.click + 4, 1]]);

  const hoverRow = (() => {
    if (frame < B.cursorIn || cx < MENU.x || cx > MENU.x + MENU.w) return -1;
    const i = Math.floor((cy - 4 - MENU_TOP - MENU.pad) / MENU.row);
    return i >= 0 && i < copy.commandBar.options.length ? i : -1;
  })();
  const clicked = frame >= B.click;
  const flash = prog(frame, B.click, B.click + 3) * (1 - prog(frame, B.click + 3, B.click + 12));

  const sendGlow = prog(frame, B.click, B.click + 14, ease.out);
  const sendActive = keys(frame, [[B.click - 1, 0], [B.click + 2, 1], [B.click + 12, 0.85]]);

  // stretch into the bloom (S8 takes over at the flash)
  const stretch = prog(frame, S8_BEATS.stretch, S8_BEATS.bloom + 1, ease.in);
  const contentOut = tween(frame, S8_BEATS.stretch, S8_BEATS.stretch + 4, 1, 0);

  return (
    <AbsoluteFill>
      <Camera frame={frame} {...cam}>
        {/* dropdown */}
        {menuOpacity > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: MENU.x,
              top: MENU_TOP,
              width: MENU.w,
              height: MENU_H,
              padding: MENU.pad,
              borderRadius: 26,
              background: 'linear-gradient(180deg, rgba(36,30,66,0.94), rgba(20,17,38,0.96))',
              border: '1.5px solid rgba(255,255,255,0.09)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 100px rgba(0,0,0,0.6), 0 0 60px rgba(109,74,255,0.18)',
              opacity: menuOpacity,
              transform: `translateY(${(1 - menu) * 24 + menuClose * 14}px) scale(${0.94 + 0.06 * menu - menuClose * 0.03})`,
              transformOrigin: '30% 100%',
            }}
          >
            {copy.commandBar.options.map((o, i) => {
              const hovered = hoverRow === i;
              const isTarget = i === copy.commandBar.target;
              const sel = isTarget && clicked;
              const rowIn = prog(frame, B.menuOpen + 2 + i * 2, B.menuOpen + 8 + i * 2);
              const iconColor = hovered || sel ? '#fff' : 'rgba(255,255,255,0.75)';
              return (
                <div
                  key={o.label}
                  style={{
                    height: MENU.row,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '0 18px',
                    borderRadius: 16,
                    background:
                      hovered || sel
                        ? `rgba(109,74,255,${0.32 + flash * 0.35})`
                        : 'transparent',
                    boxShadow: hovered || sel ? `inset 0 0 0 1.5px rgba(169,139,255,${0.5 + flash * 0.5})` : undefined,
                    opacity: rowIn,
                    transform: `translateY(${(1 - rowIn) * 8}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 13,
                      flex: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: o.done ? 'rgba(74,222,155,0.12)' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {ICONS[o.icon](iconColor)}
                  </div>
                  <div
                    style={{
                      fontSize: 31,
                      fontWeight: 600,
                      color: o.done ? 'rgba(255,255,255,0.62)' : '#fff',
                    }}
                  >
                    {o.label}
                  </div>
                  {o.done ? (
                    <div style={{marginLeft: 'auto', fontSize: 20, fontWeight: 700, color: palette.success, letterSpacing: '0.08em'}}>
                      FERTIG
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* the bar */}
        <div
          style={{
            position: 'absolute',
            left: BAR.cx - BAR.w / 2,
            top: BAR_TOP,
            transform: `scaleX(${1 + stretch * 1.9}) scaleY(${1 - stretch * 0.82})`,
            transformOrigin: '50% 50%',
            filter: stretch > 0 ? `brightness(${1 + stretch * 2.5})` : undefined,
          }}
        >
          <CommandBar
            text={text}
            placeholder={copy.commandBar.placeholder}
            caret={caret}
            sendGlow={sendGlow > 0 && sendGlow < 1 ? sendGlow : 0}
            sendActive={sendActive}
            glow={Math.max(flash, stretch)}
            contentOpacity={contentOut}
          />
          {stretch > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 30,
                opacity: stretch,
                background: 'linear-gradient(90deg, rgba(169,139,255,0.9), #ffffff 50%, rgba(169,139,255,0.9))',
                boxShadow: `0 0 ${120 * stretch}px ${30 * stretch}px rgba(169,139,255,0.8)`,
              }}
            />
          ) : null}
        </div>

        <Sparkles frame={frame} x={TARGET.x} y={TARGET.y} />

        {/* cursor */}
        {frame >= B.cursorIn && cursorOut < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: cx - 3,
              top: cy - 2,
              opacity: cursorIn * (1 - cursorOut),
              transform: `scale(${press})`,
              transformOrigin: '3px 2px',
              filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
            }}
          >
            <Cursor size={56} />
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};
