import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, EASE, EASE_CAM, EASE_IO, FONT, HY, LN, tabular} from '../theme';
import {prog, tween} from '../../showreel/util';
import {BlackStage, H, Title, useShotFrame, W} from '../ui';
import type {SceneProps} from '../Pitch';

// 0:00 – 0:03. The problem: late evening, quotes still open.
// The minute rolls over on the first bar line (f30), the evening drains in a
// hyacinth hairline, then a linen plane slides up and lands on the drop (f90).
export const Hook: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  const enter = prog(f, 0, 18);
  const push = tween(f, 0, dur, 1, 1.08, EASE_CAM);
  const roll = prog(f, 29, 37, EASE);
  const colon = Math.floor(f / 15) % 2 === 0 ? 1 : 0.28;
  const drain = tween(f, 4, 84, 0, 1, EASE_CAM);
  const lift = prog(f, 72, dur, EASE_IO);
  const size = 250;
  const digitH = size * 1.0;

  return (
    <AbsoluteFill>
      <BlackStage f={f} glowY={0.5} glow={0.8 + 0.4 * enter} />
      <AbsoluteFill style={{transform: `scale(${push})`, opacity: 1 - lift * 0.5, filter: lift > 0.05 ? `blur(${lift * 6}px)` : undefined}}>
        {/* clock */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 230,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: B.linen,
            opacity: enter,
            filter: enter < 0.98 ? `blur(${(1 - enter) * 14}px)` : undefined,
            transform: `scale(${1.04 - 0.04 * enter})`,
            ...tabular,
          }}
        >
          <span>22</span>
          <span style={{opacity: colon, color: `rgba(${HY},1)`, margin: '0 0.02em', transform: 'translateY(-0.06em)'}}>:</span>
          <span>4</span>
          <span style={{display: 'inline-block', height: digitH, overflow: 'hidden', verticalAlign: 'top'}}>
            <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-roll * digitH}px)`}}>
              <span style={{height: digitH}}>6</span>
              <span style={{height: digitH}}>7</span>
            </span>
          </span>
        </div>
        {/* problem line */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
          <Title text={copy.hook.line} f={f} at={40} size={58} weight={500} color={`rgba(${LN},0.82)`} align="center" />
        </div>
        {/* the evening drains */}
        <div style={{position: 'absolute', left: W / 2 - 260, top: 700, width: 520, height: 3, borderRadius: 3, background: `rgba(${LN},0.12)`, opacity: enter}}>
          <div style={{width: `${drain * 100}%`, height: '100%', borderRadius: 3, background: B.hyacinth, boxShadow: `0 0 18px rgba(${HY},0.9)`}} />
        </div>
      </AbsoluteFill>
      {/* linen plane rises and lands on the drop */}
      {lift > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: H * (1 - lift),
            width: W,
            height: H + 80,
            background: B.linen,
            borderRadius: `${60 * (1 - lift)}px ${60 * (1 - lift)}px 0 0`,
            boxShadow: `0 -30px 80px rgba(${HY},${0.35 * (1 - lift)})`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
