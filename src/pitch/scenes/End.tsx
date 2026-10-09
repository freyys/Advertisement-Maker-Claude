import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, EASE, EASE_IO, FONT, HY} from '../theme';
import {prog} from '../../showreel/util';
import {BlackStage, H, LinenStage, useShotFrame, W, Wordmark} from '../ui';
import {VP} from './Values';
import type {SceneProps} from '../Pitch';

// 0:21 – 0:24. The linen value plane floods the frame on the final hit and
// becomes the end card: wordmark, the brand line with "half your evening"
// underlined in hyacinth (a callback to the 22:47 hook), the facts.
// Everything is still from frame 70 on (last 20 frames hold).

const LOGO_W = 700;
const LOGO_H = (LOGO_W / 472.29) * 100;

export const End: React.FC<SceneProps & {credit?: string}> = ({copy, credit}) => {
  const f = useShotFrame();
  const c = copy.end;
  const grow = prog(f, 0, 14, EASE_IO);
  const word = 1 - prog(f, 2, 10);
  const pw = VP.w + (W + 4 - VP.w) * grow;
  const ph = VP.h + (H + 4 - VP.h) * grow;
  const kT = prog(f, 10, 22, EASE);
  const letters = [0, 1, 2, 3].map((i) => prog(f, 14 + i * 2.5, 28 + i * 2.5, EASE));
  const tag = prog(f, 26, 40, EASE);
  const under = prog(f, 38, 52, EASE_IO);
  const facts = prog(f, 42, 56, EASE);
  const settle = 1.03 - 0.03 * prog(f, 10, 70, EASE);

  return (
    <AbsoluteFill>
      {grow < 1 && <BlackStage f={f + 60} glow={1.1 * (1 - grow)} />}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - pw / 2,
          top: H / 2 - ph / 2,
          width: pw,
          height: ph,
          borderRadius: 40 * (1 - grow),
          overflow: 'hidden',
          boxShadow: `0 40px 120px rgba(${HY},${0.45 * (1 - grow)})`,
        }}
      >
        <div style={{position: 'absolute', left: -(W - pw) / 2, top: -(H - ph) / 2, width: W, height: H}}>
          <LinenStage f={f + 400} glowX={0.5} glowY={0.42} glow={0.75 * grow} />
        </div>
        {/* the value plane's flat linen, the "04" and its word, leaving */}
        <div style={{position: 'absolute', inset: 0, background: B.linen, opacity: 1 - grow}} />
        <div style={{position: 'absolute', left: 46, top: 40, fontFamily: FONT, fontSize: 22, fontWeight: 600, letterSpacing: '0.28em', color: B.hyacinth, opacity: word}}>
          04
        </div>
        {word > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontSize: 118,
              fontWeight: 600,
              letterSpacing: '-0.035em',
              color: B.black,
              opacity: word,
              transform: `scale(${1 + 0.25 * (1 - word)})`,
              filter: word < 0.98 ? `blur(${(1 - word) * 12}px)` : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {copy.values[3].slice(0, -1)}
            <span style={{color: B.hyacinth}}>.</span>
          </div>
        )}
      </div>

      <AbsoluteFill style={{transform: `scale(${settle})`}}>
        <div style={{position: 'absolute', left: W / 2 - LOGO_W / 2, top: 420 - LOGO_H / 2}}>
          <Wordmark id="end" width={LOGO_W} k={kT} kScale={1.2 - 0.2 * kT} kBlur={(1 - kT) * 5} letters={letters} mode="rise" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 580,
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 50,
            letterSpacing: '-0.025em',
            color: B.ink,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {c.tag[0]}
          <span style={{position: 'relative', display: 'inline-block', fontWeight: 600, color: B.black}}>
            {c.tag[1]}
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -6,
                height: 7,
                borderRadius: 7,
                background: B.hyacinth,
                transformOrigin: '0 50%',
                transform: `scaleX(${under})`,
              }}
            />
          </span>
          {c.tag[2].endsWith('.') ? (
            <>
              {c.tag[2].slice(0, -1)}
              <span style={{color: B.hyacinth}}>.</span>
            </>
          ) : (
            c.tag[2]
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 716,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 22,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: '0.01em',
            color: B.grey,
            opacity: facts,
            transform: `translateY(${(1 - facts) * 16}px)`,
          }}
        >
          <div style={{display: 'flex', gap: 8}}>
            <span style={{width: 14, height: 14, borderRadius: 14, background: B.linen, boxShadow: 'inset 0 0 0 1.5px rgba(10,10,12,0.25)'}} />
            <span style={{width: 14, height: 14, borderRadius: 14, background: B.black}} />
            <span style={{width: 14, height: 14, borderRadius: 14, background: B.hyacinth}} />
          </div>
          {c.facts}
        </div>
      </AbsoluteFill>
      {credit && (
        <div
          style={{
            position: 'absolute',
            right: 64,
            bottom: 52,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: B.grey,
            opacity: facts * 0.9,
          }}
        >
          {credit}
        </div>
      )}
    </AbsoluteFill>
  );
};
