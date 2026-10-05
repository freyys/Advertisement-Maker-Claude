import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, EASE, EASE_IN, FONT} from '../theme';
import {pop, prog} from '../util';

/**
 * Big bold German headline. Words rise in one by one (blur → sharp); the
 * final full stop is the cyan brand dot and always pops in last.
 * Use "\n" for a line break. Frames are local to the current Sequence.
 */
export const Headline: React.FC<{
  text: string;
  at: number;
  size?: number;
  stagger?: number;
  align?: 'left' | 'center' | 'right';
  out?: number; // frame where it leaves
  color?: string;
  dotColor?: string;
  maxWidth?: number;
  weight?: number;
  style?: React.CSSProperties;
  /** Extra delay before the dot pops. */
  dotDelay?: number;
  /** Optional per-word start frames (overrides stagger). */
  wordAt?: number[];
}> = ({
  text,
  at,
  size = 96,
  stagger = 4,
  align = 'left',
  out,
  color = C.white,
  dotColor = C.cyan,
  maxWidth,
  weight = 800,
  style,
  dotDelay = 5,
  wordAt,
}) => {
  const f = useCurrentFrame();
  const hasDot = text.endsWith('.');
  const body = hasDot ? text.slice(0, -1) : text;
  const lines = body.split('\n').map((l) => l.split(' ').filter(Boolean));
  let idx = 0;
  const total = lines.reduce((n, l) => n + l.length, 0);
  const lastStart = wordAt ? wordAt[total - 1] ?? at : at + (total - 1) * stagger;
  const dotAt = lastStart + dotDelay + 4;
  const dot = pop(f, dotAt, {damping: 9, stiffness: 220, mass: 0.6});
  const leave = out !== undefined ? prog(f, out, out + 12, EASE_IN) : 0;

  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: '-0.035em',
        color,
        textAlign: align,
        maxWidth,
        opacity: 1 - leave,
        transform: `translateY(${-leave * size * 0.3}px)`,
        filter: leave > 0.01 ? `blur(${leave * 10}px)` : undefined,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {words.map((w, wi) => {
            const i = idx++;
            const start = wordAt ? wordAt[i] ?? at : at + i * stagger;
            const t = prog(f, start, start + 16, EASE);
            const isLast = li === lines.length - 1 && wi === words.length - 1;
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: t,
                    transform: `translateY(${(1 - t) * size * 0.42}px)`,
                    filter: t < 0.98 ? `blur(${(1 - t) * 12}px)` : undefined,
                  }}
                >
                  {w}
                  {isLast && hasDot && (
                    <span
                      style={{
                        display: 'inline-block',
                        color: dotColor,
                        transformOrigin: '50% 82%',
                        transform: `scale(${dot})`,
                        textShadow: `0 0 ${size * 0.25 * dot}px rgba(91,200,232,0.9)`,
                        // keep the dot hidden until it pops, even while the word lands
                        opacity: f >= dotAt ? 1 : 0,
                      }}
                    >
                      .
                    </span>
                  )}
                </span>
                {wi < words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small uppercase label like the UI's section kickers ("01 — KUNDE"). */
export const Kicker: React.FC<{text: string; at: number; size?: number; color?: string; style?: React.CSSProperties}> = ({
  text,
  at,
  size = 22,
  color = C.cyan,
  style,
}) => {
  const f = useCurrentFrame();
  const t = prog(f, at, at + 14);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color,
        opacity: t,
        transform: `translateX(${(1 - t) * -20}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
