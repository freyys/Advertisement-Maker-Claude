import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette} from '../theme';
import {HOLD_FROM, S8_BEATS as B} from '../timeline';
import {ease, keys, prog} from '../lib/anim';
import * as copy from '../copy';
import {Wordmark} from '../components/Logo';
import {Wallpaper} from '../components/Background';

/**
 * Bloom flash → signature wallpaper → wordmark.
 * `standalone` draws its own wallpaper (used full-frame in the vertical cut).
 */
export const S8Logo: React.FC<{
  width?: number;
  height?: number;
  standalone?: boolean;
  bloomY?: number;
}> = ({width = 1920, height = 1080, standalone = false, bloomY}) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, HOLD_FROM); // everything is settled for the final hold
  const portrait = height > width;

  // Bloom
  const expand = prog(f, B.bloom - 3, B.bloom + 5, ease.out);
  const maxR = Math.hypot(width, height) * 0.75;
  const r = 500 + (maxR - 500) * expand;
  const bloomOpacity = keys(f, [
    [B.bloom - 3, 0],
    [B.bloom, 1],
    [B.bloom + 3, 1],
    [B.bloom + 9, 0],
  ], ease.soft);
  // violet afterglow so the flash resolves into colour, not grey
  const afterglow = keys(f, [
    [B.bloom, 0],
    [B.bloom + 5, 0.9],
    [B.bloom + 18, 0],
  ], ease.soft);
  const streak = keys(f, [
    [B.bloom - 4, 0],
    [B.bloom, 1],
    [B.bloom + 10, 0],
  ]);
  const by0 = bloomY ?? (portrait ? height * 0.46 : 646);
  const centerY = portrait ? height * 0.458 : height / 2;
  const by = by0 + (centerY - by0) * prog(f, B.bloom, B.bloom + 12, ease.soft);
  const cx = width / 2;

  // Wordmark
  const logoT = prog(f, B.logoIn, HOLD_FROM - 1, ease.out);
  const logoW = portrait ? 660 : 600;
  const logoBlur = 20 * (1 - logoT);
  const logoScale = 1.08 - 0.08 * logoT;
  const tracking = 14 * (1 - logoT);
  const t1 = prog(f, B.tagline1, Math.min(B.tagline1 + 9, HOLD_FROM - 1));
  const t2 = prog(f, B.tagline2, Math.min(B.tagline2 + 8, HOLD_FROM - 1));
  const wall = prog(f, B.bloom + 4, B.bloom + 22, ease.soft);

  const fs1 = portrait ? 64 : 56;
  const fs2 = portrait ? 48 : 42;

  return (
    <AbsoluteFill>
      {standalone ? <Wallpaper opacity={wall} breathe={0.5 + 0.5 * Math.sin((f / 30) * 1.3)} /> : null}
      {/* centred lockup */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: centerY,
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            opacity: prog(f, B.logoIn, B.logoIn + 8),
            transform: `scale(${logoScale})`,
            filter: logoBlur > 0.05 ? `blur(${logoBlur}px)` : undefined,
          }}
        >
          <Wordmark width={logoW} tracking={tracking} />
        </div>
        <div
          style={{
            marginTop: portrait ? 56 : 46,
            fontSize: fs1,
            fontWeight: 600,
            color: palette.lavender,
            letterSpacing: '-0.01em',
            opacity: t1,
            transform: `translateY(${(1 - t1) * 18}px)`,
          }}
        >
          {copy.endCard.feature}
        </div>
        <div
          style={{
            marginTop: portrait ? 14 : 10,
            fontSize: fs2,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            opacity: t2,
            transform: `translateY(${(1 - t2) * 16}px)`,
          }}
        >
          {copy.endCard.soon}
        </div>
      </div>
      {/* bloom flash on top */}
      {bloomOpacity > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: cx - r,
              top: by - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              opacity: bloomOpacity,
              background:
                'radial-gradient(circle, #ffffff 0%, rgba(248,244,255,1) 22%, rgba(214,198,255,0.95) 42%, rgba(169,139,255,0.8) 58%, rgba(109,74,255,0.5) 72%, rgba(109,74,255,0) 86%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: cx - width * 0.9,
              top: by - 40,
              width: width * 1.8,
              height: 80,
              borderRadius: '50%',
              opacity: streak,
              background: 'radial-gradient(ellipse at center, #fff 0%, rgba(214,198,255,0.85) 30%, rgba(169,139,255,0) 70%)',
            }}
          />
        </>
      ) : null}
      {afterglow > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: cx - maxR,
            top: by - maxR,
            width: maxR * 2,
            height: maxR * 2,
            borderRadius: '50%',
            opacity: afterglow,
            mixBlendMode: 'screen',
            background:
              'radial-gradient(circle, rgba(196,176,255,0.95) 0%, rgba(150,118,255,0.75) 28%, rgba(109,74,255,0.45) 50%, rgba(60,40,170,0.15) 70%, rgba(42,27,110,0) 86%)',
          }}
        />
      ) : null}
      {/* thin white veil right after the hit */}
      <AbsoluteFill
        style={{
          background: '#fff',
          opacity: keys(f, [[B.bloom - 1, 0], [B.bloom + 2, 0.45], [B.bloom + 9, 0]], ease.soft),
        }}
      />
    </AbsoluteFill>
  );
};
