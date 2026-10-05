import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {CUTS} from '../timeline';

const GRAIN = [0, 1, 2].map((i) => staticFile(`assets/showreel/fx/grain-${i}.jpg`));

/**
 * Film grain, a new pattern every frame. Overlay blend keeps blacks black;
 * at 0.24 opacity the luminance varies by roughly ±3–4 % on the UI greys.
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.24}) => {
  const f = useCurrentFrame();
  const i = f % GRAIN.length;
  const ox = Math.floor(random(`gx${f}`) * 200);
  const oy = Math.floor(random(`gy${f}`) * 200);
  const flip = random(`gf${f}`) > 0.5 ? -1 : 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <Img
        src={GRAIN[i]}
        style={{position: 'absolute', left: -ox, top: -oy, width: 2400, height: 2400, maxWidth: 'none', transform: `scaleX(${flip})`}}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** How hard the current frame is hit by a cut (1 on the cut, fading out). */
export const cutHit = (f: number, cuts: number[] = CUTS) => {
  let best = 0;
  for (const c of cuts) {
    const d = f - c;
    if (d >= -1 && d <= 5) {
      const v = d < 0 ? 0.5 : Math.pow(1 - d / 6, 2);
      best = Math.max(best, v);
    }
  }
  return best;
};

/**
 * Chromatic aberration, only around cuts: the red and blue channels split
 * sideways for a few frames and snap back together.
 */
export const ChromaticCut: React.FC<{children: React.ReactNode; cuts?: number[]}> = ({children, cuts}) => {
  const f = useCurrentFrame();
  const hit = cutHit(f, cuts);
  const amt = Math.round(hit * 9 * 10) / 10;
  const id = 'kv-ca';
  return (
    <AbsoluteFill>
      {amt > 0.2 && (
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={amt} dy={amt * 0.15} result="r1" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx={-amt} dy={-amt * 0.15} result="b1" />
            <feBlend in="r1" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b1" mode="screen" />
          </filter>
        </svg>
      )}
      <AbsoluteFill style={{filter: amt > 0.2 ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
      {/* exposure kick on the cut frame */}
      {hit > 0.05 && <AbsoluteFill style={{background: '#BFEFFF', opacity: hit * 0.05, mixBlendMode: 'screen'}} />}
    </AbsoluteFill>
  );
};
