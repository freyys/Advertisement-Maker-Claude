import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT, STRIPES, tabular} from '../theme';
import {beat} from '../timeline';
import {keys, prog, useFormat} from '../util';
import {Headline} from '../components/Headline';
import {Dust} from '../components/Stage';

// 0:05 – Late evening at the kitchen table: lamp, three unwritten quotes and
// a clock at 22:47. Shapes and type only.

const WARM = '255,206,130';

const Paper: React.FC<{w: number; h: number; tint: number}> = ({w, h, tint}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 6,
      background: `linear-gradient(170deg, rgba(240,234,222,${0.92 * tint}) 0%, rgba(214,208,196,${0.88 * tint}) 100%)`,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
      overflow: 'hidden',
    }}
  >
    {/* corner stripes, like the Kavox PDF */}
    <svg style={{position: 'absolute', right: 0, top: 0}} width={w * 0.24} height={w * 0.24} viewBox="0 0 100 100">
      {STRIPES.map((c, i) => (
        <polygon key={c} points={`${18 + i * 16},0 ${30 + i * 16},0 100,${70 - i * 16} 100,${82 - i * 16}`} fill={c} opacity={0.75 * tint} />
      ))}
    </svg>
    <div style={{position: 'absolute', left: w * 0.1, top: h * 0.09, width: w * 0.36, height: h * 0.028, background: `rgba(40,44,52,${0.7 * tint})`, borderRadius: 3}} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: w * 0.1, top: h * (0.17 + i * 0.03), width: w * (0.3 - i * 0.05), height: h * 0.012, background: `rgba(40,44,52,${0.35 * tint})`, borderRadius: 3}} />
    ))}
    <div style={{position: 'absolute', left: w * 0.1, right: w * 0.1, top: h * 0.36, height: h * 0.035, background: `rgba(0,147,213,${0.55 * tint})`, borderRadius: 2}} />
    {new Array(7).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: w * 0.1,
          right: w * 0.1,
          top: h * (0.42 + i * 0.055),
          height: h * 0.012,
          background: `rgba(40,44,52,${0.22 * tint})`,
          borderRadius: 3,
          width: w * (0.8 - (i % 3) * 0.12),
        }}
      />
    ))}
  </div>
);

export const Sh02Nacht: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {W, H, v} = useFormat();

  const tLamp = beat('nacht', 'lamp');
  const tPapers = beat('nacht', 'papers');
  const every = beat('nacht', 'paperEvery');
  const tClock = beat('nacht', 'clock');
  const tHead = beat('nacht', 'headline');
  const tLine2 = beat('nacht', 'line2');

  // lamp switches on with a short flicker
  const light = keys(f, [
    [tLamp, 0],
    [tLamp + 2, 0.7],
    [tLamp + 4, 0.15],
    [tLamp + 7, 0.95],
    [tLamp + 9, 0.55],
    [tLamp + 14, 1],
  ]);

  const L = v
    ? {horizon: 1010, poolX: 560, poolY: 1330, poolW: 1100, poolH: 420, lampX: 70, lampY: 660, lampS: 0.95, papersX: 560, papersY: 1360, paperW: 420, clockX: 700, clockY: 950, clockS: 0.82, headX: 70, headY: 250, headSize: 84}
    : {horizon: 600, poolX: 960, poolY: 800, poolW: 1250, poolH: 360, lampX: 190, lampY: 250, lampS: 0.92, papersX: 980, papersY: 800, paperW: 380, clockX: 1440, clockY: 560, clockS: 1, headX: 120, headY: 120, headSize: 96};

  const cam = prog(f, 0, dur, EASE_CAM);
  const zoom = (depth: number) => 1 + cam * 0.06 * depth;
  const camStyle = (depth: number): React.CSSProperties => ({
    transformOrigin: `${L.papersX}px ${L.papersY}px`,
    transform: `scale(${zoom(depth)}) translateY(${-cam * 14 * depth}px)`,
  });

  // clock: 22:46 rolls to 22:47
  const roll = prog(f, tClock + 18, tClock + 28, EASE);
  const colon = Math.floor(f / 15) % 2 === 0 ? 1 : 0.25;
  const clockIn = prog(f, tClock, tClock + 18, EASE);

  return (
    <AbsoluteFill style={{background: '#040507', overflow: 'hidden'}}>
      {/* wall + desk */}
      <AbsoluteFill style={camStyle(0.4)}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: L.horizon, background: 'linear-gradient(180deg, #05070a 0%, #0a0d11 100%)'}} />
        <div
          style={{
            position: 'absolute',
            left: -200,
            top: L.horizon,
            width: W + 400,
            height: H - L.horizon + 200,
            background: 'linear-gradient(180deg, #0d1014 0%, #12161b 60%, #0b0d10 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        />
        {/* light pool */}
        <div
          style={{
            position: 'absolute',
            left: L.poolX - L.poolW / 2,
            top: L.poolY - L.poolH / 2,
            width: L.poolW,
            height: L.poolH,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(${WARM},${0.2 * light}), rgba(${WARM},${0.07 * light}) 55%, rgba(${WARM},0))`,
          }}
        />
        {/* wall glow above the lamp */}
        <div
          style={{
            position: 'absolute',
            left: L.lampX + 120 * L.lampS - 500,
            top: L.lampY - 420,
            width: 1000,
            height: 900,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(${WARM},${0.07 * light}), rgba(${WARM},0))`,
          }}
        />
      </AbsoluteFill>

      {/* lamp */}
      <AbsoluteFill style={camStyle(0.7)}>
        <svg
          width={900}
          height={900}
          viewBox="0 0 900 900"
          style={{position: 'absolute', left: L.lampX, top: L.lampY, transformOrigin: '0 0', transform: `scale(${L.lampS})`, overflow: 'visible'}}
        >
          <defs>
            <linearGradient id="cone" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stopColor={`rgb(${WARM})`} stopOpacity={0.32 * light} />
              <stop offset="1" stopColor={`rgb(${WARM})`} stopOpacity="0" />
            </linearGradient>
            <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          {/* light cone */}
          <polygon points="520,250 640,205 1130,640 560,690" fill="url(#cone)" filter="url(#soft)" />
          {/* base */}
          <ellipse cx="180" cy="610" rx="120" ry="24" fill="#0b0d10" />
          <path d="M70 606 Q180 560 290 606 L290 616 Q180 640 70 616 Z" fill="#1b1f24" />
          {/* arm */}
          <path d="M176 590 L250 250" stroke="#22262c" strokeWidth="16" strokeLinecap="round" />
          <path d="M250 250 L520 185" stroke="#22262c" strokeWidth="14" strokeLinecap="round" />
          <path d="M176 590 L250 250" stroke={`rgba(${WARM},${0.25 * light})`} strokeWidth="3" strokeLinecap="round" transform="translate(6 0)" />
          <circle cx="250" cy="250" r="16" fill="#2a2f36" />
          {/* head */}
          <path d="M470 150 L560 120 L660 230 L530 270 Z" fill="#1d2126" />
          <path d="M530 270 L660 230" stroke={`rgba(${WARM},${0.8 * light})`} strokeWidth="5" strokeLinecap="round" />
          {/* bulb */}
          <circle cx="598" cy="250" r="26" fill={`rgba(255,236,200,${light})`} filter="url(#soft)" />
          <circle cx="598" cy="246" r="12" fill={`rgba(255,246,228,${light})`} />
        </svg>
      </AbsoluteFill>

      {/* clock */}
      <AbsoluteFill style={camStyle(0.8)}>
        <div
          style={{
            position: 'absolute',
            left: L.clockX,
            top: L.clockY,
            transformOrigin: '0 0',
            transform: `scale(${L.clockS}) translateY(${(1 - clockIn) * 30}px)`,
            opacity: clockIn,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 330,
              height: 140,
              borderRadius: 28,
              background: 'linear-gradient(180deg, #14171b, #0a0c0f)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 92, letterSpacing: '0.01em', color: C.yellow, textShadow: '0 0 24px rgba(245,192,74,0.75)', display: 'flex', ...tabular}}>
              <span>22</span>
              <span style={{opacity: colon, margin: '0 2px'}}>:</span>
              <span>4</span>
              <span style={{position: 'relative', display: 'inline-block', height: 110, overflow: 'hidden'}}>
                <span style={{display: 'block', transform: `translateY(${-roll * 110}px)`, lineHeight: '110px'}}>
                  <span style={{display: 'block'}}>6</span>
                  <span style={{display: 'block'}}>7</span>
                </span>
              </span>
            </div>
          </div>
          {/* reflection on the desk */}
          <div style={{position: 'absolute', left: 30, top: 150, width: 270, height: 40, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(245,192,74,0.22), rgba(245,192,74,0))'}} />
        </div>
      </AbsoluteFill>

      {/* three quotes on the table */}
      <AbsoluteFill style={camStyle(1.3)}>
        <div style={{position: 'absolute', left: L.papersX, top: L.papersY, width: 0, height: 0, perspective: 1600}}>
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'rotateX(58deg)'}}>
            {[0, 1, 2].map((i) => {
              const at = tPapers + i * every;
              const t = prog(f, at, at + 20, EASE);
              const pw = L.paperW;
              const ph = pw * 1.414;
              const rot = [-9, 4, 13][i];
              const off = [
                [-40, 10],
                [10, -20],
                [55, 5],
              ][i];
              return (
                <React.Fragment key={i}>
                  {/* shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -pw / 2 + off[0] + 18,
                      top: -ph / 2 + off[1] + 26,
                      width: pw,
                      height: ph,
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.55)',
                      filter: `blur(${10 + (1 - t) * 30}px)`,
                      opacity: t,
                      transform: `rotateZ(${rot}deg)`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: -pw / 2 + off[0],
                      top: -ph / 2 + off[1],
                      width: pw,
                      height: ph,
                      opacity: Math.min(1, t * 2),
                      transform: `translateZ(${(1 - t) * 420 + i * 2}px) rotateZ(${rot + (1 - t) * 18}deg) rotateX(${(1 - t) * -20}deg)`,
                    }}
                  >
                    <Paper w={pw} h={ph} tint={0.35 + 0.65 * light} />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <Dust amount={0.6} camX={cam * 40} />

      {/* deep shadow at the edges so the lamp pool carries the frame */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 65% at ${(L.poolX / W) * 100}% ${(L.poolY / H) * 100 - 8}%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)`}} />

      <div style={{position: 'absolute', left: L.headX, top: L.headY}}>
        <Headline text={'22:47 Uhr.\nNoch drei Angebote.'} at={tHead} size={L.headSize} wordAt={[tHead, tHead + 4, tLine2, tLine2 + 4, tLine2 + 8]} />
      </div>
    </AbsoluteFill>
  );
};
