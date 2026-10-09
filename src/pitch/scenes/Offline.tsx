import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, FONT, LN} from '../theme';
import {pop, prog} from '../../showreel/util';
import {BlackStage, Ring, Sub, Title, useShotFrame} from '../ui';
import type {SceneProps} from '../Pitch';

// 0:17 – 0:19. Stop-time on black: one line per beat, the offline badge
// pulses with the music.
const BX = 1530;
const BY = 520;
const BR = 200;

export const Offline: React.FC<SceneProps> = ({copy}) => {
  const f = useShotFrame();
  const c = copy.offline;
  const badge = pop(f, 0, {damping: 12, stiffness: 160});
  const beat = f >= 0 ? Math.exp(-(f % 15) / 3.5) : 0;
  const glow = 0.8 + 0.4 * beat;

  return (
    <AbsoluteFill>
      <BlackStage f={f} glowX={BX / 1920} glowY={BY / 1080} glow={glow} />
      <div style={{position: 'absolute', left: 150, top: 236, display: 'flex', flexDirection: 'column', gap: 18}}>
        {c.lines.map((l, i) => (
          <Title key={i} text={l} f={f} at={i * 15} dur={9} size={112} color={B.linen} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 154, top: 700}}>
        <Sub text={c.sub} f={f} at={40} size={36} color={`rgba(${LN},0.6)`} />
      </div>
      {[0, 15, 30, 45].map((at) => (
        <Ring key={at} f={f} at={at} x={BX} y={BY} r={BR * 1.9} len={22} color="rgba(181,162,255,0.8)" />
      ))}
      <div
        style={{
          position: 'absolute',
          left: BX - BR,
          top: BY - BR,
          width: BR * 2,
          height: BR * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, #8C6BFF, ${B.hyacinth} 60%, #5A33E6)`,
          boxShadow: `0 0 ${120 * glow}px rgba(110,68,255,${0.55 * glow})`,
          transform: `scale(${badge * (1 + 0.035 * beat)})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          color: B.linen,
        }}
      >
        <div style={{fontSize: 92, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1}}>{c.badge[0]}</div>
        <div style={{fontSize: 38, fontWeight: 500, letterSpacing: '0.02em', marginTop: 8, opacity: prog(f, 6, 16)}}>{c.badge[1]}</div>
      </div>
    </AbsoluteFill>
  );
};
