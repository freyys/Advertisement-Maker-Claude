import React from 'react';
import {AbsoluteFill} from 'remotion';
import {IMG} from '../../showreel/assets';
import type {Img} from '../../showreel/assets';
import {B, EASE_CAM, FONT, HY} from '../theme';
import {pop, prog, tween} from '../../showreel/util';
import {Pill, Place, Shot, Space3D, useShotFrame} from '../ui';
import {TextBlock} from './common';
import type {SceneProps} from '../Pitch';

// 0:15 – 0:17. The iPhone companion (coming soon): three real screens fan out
// as suspended planes — spoken job → draft, measurement, signature on site.
const SW = 330;
const BEZ = 9;
const SH = (IMG.h02.h / IMG.h02.w) * SW;

const PhonePlane: React.FC<{img: Img}> = ({img}) => (
  <div
    style={{
      width: SW + BEZ * 2,
      height: SH + BEZ * 2,
      borderRadius: 54,
      background: B.black,
      padding: BEZ,
      boxSizing: 'border-box',
      boxShadow: '0 0 0 1px rgba(10,10,12,0.12), 0 40px 80px -20px rgba(40,24,90,0.45), 0 12px 24px rgba(10,10,12,0.16)',
    }}
  >
    <Shot img={img} w={SW} radius={45} shadow={0} />
  </div>
);

const Wave: React.FC<{f: number}> = ({f}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 5, height: 40}}>
    {new Array(22).fill(0).map((_, i) => {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(f * 0.33 + i * 0.9) * Math.sin(f * 0.11 + i * 0.37));
      return <div key={i} style={{width: 5, height: 6 + 32 * a, borderRadius: 4, background: B.hyacinth, opacity: 0.55 + 0.45 * a}} />;
    })}
  </div>
);

export const Companion: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  const c = copy.companion;
  const pw = SW + BEZ * 2;
  const ph = SH + BEZ * 2;
  const a = pop(f, 0, {damping: 16, stiffness: 120});
  const b = pop(f, 5, {damping: 16, stiffness: 120});
  const d = pop(f, 9, {damping: 16, stiffness: 120});
  const wave = prog(f, 16, 26);
  const spread = tween(f, 0, dur, 0, 1, EASE_CAM);

  return (
    <AbsoluteFill>
      <Space3D perspective={2000}>
        <Place x={1060 - 30 * spread} y={545 + 900 * (1 - b)} z={-200} ry={20} rz={-4} w={pw} h={ph}>
          <PhonePlane img={IMG.h03} />
        </Place>
        <Place x={1680 + 30 * spread} y={545 + 900 * (1 - d)} z={-200} ry={-20} rz={4} w={pw} h={ph}>
          <PhonePlane img={IMG.h04} />
        </Place>
        <Place x={1370} y={560 + 900 * (1 - a)} z={60} rx={4} w={pw} h={ph}>
          <PhonePlane img={IMG.h02} />
          {/* the spoken job */}
          <div
            style={{
              position: 'absolute',
              left: pw / 2 - 170,
              bottom: 70,
              width: 340,
              height: 78,
              borderRadius: 40,
              background: 'rgba(250,248,243,0.95)',
              boxShadow: `0 0 0 1px rgba(10,10,12,0.08), 0 20px 40px -10px rgba(${HY},0.55)`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 26px',
              boxSizing: 'border-box',
              opacity: wave,
              transform: `translateZ(80px) translateY(${(1 - wave) * 30}px) scale(${0.9 + 0.1 * wave})`,
              fontFamily: FONT,
            }}
          >
            <svg width={26} height={34} viewBox="0 0 26 34">
              <rect x={7} y={1} width={12} height={21} rx={6} fill={B.hyacinth} />
              <path d="M2.5 15a10.5 10.5 0 0 0 21 0M13 26v6" stroke={B.hyacinth} strokeWidth={3} fill="none" strokeLinecap="round" />
            </svg>
            <Wave f={f} />
          </div>
        </Place>
      </Space3D>
      <TextBlock
        f={f}
        n="06"
        kicker={c.kicker}
        title={c.title}
        sub={c.sub}
        extra={
          <Pill tone="outline" size={16} style={{letterSpacing: '0.04em', marginLeft: 8, opacity: prog(f, 8, 16)}}>
            {c.soon}
          </Pill>
        }
      />
    </AbsoluteFill>
  );
};
