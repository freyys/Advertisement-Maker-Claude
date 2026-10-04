// P13 · Outro: "Offline · Daten bleiben hier" trust beat, the feature chips
// converge, bloom on the downbeat → Kavox wordmark, tagline and CTA. The last
// 30 frames hold still.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {outro} from '../copy';
import {d, FONT, rgba} from '../tokens';
import {GLYPHS, WORDMARK_RATIO} from '../../components/Logo';
import {CutFlash, ease, prog, rise, Sparkles} from '../kit/stage';
import {IShield} from '../kit/icons';
import {OUTRO} from '../timeline';
import {S} from '../kit/sfx';

const LOGO_W = 780;

const Wordmark: React.FC<{t: number}> = ({t}) => {
  const h = LOGO_W / WORDMARK_RATIO;
  return (
    <svg width={LOGO_W} height={h} viewBox="-10 0 492.29 100" style={{overflow: 'visible'}}>
      {GLYPHS.map((p, i) => {
        const gt = prog(t, i * 0.06, 0.55 + i * 0.06, ease.out);
        return (
          <path
            key={i}
            d={p}
            fill={i === 0 ? d.accent : '#fff'}
            fillRule="evenodd"
            opacity={gt}
            transform={`translate(${(1 - gt) * (i === 0 ? -30 : 24 + i * 6)} 0)`}
            style={i === 0 ? {filter: `drop-shadow(0 0 10px ${rgba(d.accent, 0.6)})`} : undefined}
          />
        );
      })}
    </svg>
  );
};

export const P13Outro: React.FC<{dur: number}> = ({dur}) => {
  const raw = useCurrentFrame();
  const frame = Math.min(raw, OUTRO.holdFrom); // perfectly still end card
  const L = OUTRO.logo;

  // trust beat
  const pill = prog(frame, 4, 18, ease.out);
  const shield = prog(frame, 0, 16, ease.out);
  const h1 = prog(frame, 10, 28, ease.out);
  const h2 = prog(frame, 18, 36, ease.out);
  const sub = prog(frame, 30, 46, ease.out);
  const trustOut = prog(frame, 62, 76, ease.in);

  // chips converge into the logo
  const chipsIn = (i: number) => prog(frame, 60 + i * 2, 74 + i * 2, ease.out);
  const converge = prog(frame, 76, L, ease.in);

  // logo
  const bloom = prog(frame, L - 4, L + 2, ease.out) * (1 - prog(frame, L + 2, L + 26, ease.soft));
  const logoT = prog(frame, L, L + 30, ease.out);
  const blur = (1 - prog(frame, L, L + 16, ease.out)) * 18;
  const tag = prog(frame, L + 14, L + 30, ease.out);
  const cta = prog(frame, L + 24, L + 40, ease.out);
  const shine = prog(raw, L + 44, L + 74, ease.inOut);
  const ring = prog(frame, L, L + 34, ease.out);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.25);

  return (
    <AbsoluteFill style={{fontFamily: FONT, color: '#fff'}}>
      {/* trust beat */}
      {trustOut < 1 ? (
        <AbsoluteFill style={{opacity: 1 - trustOut, transform: `translateY(${-trustOut * 120}px)`, filter: trustOut > 0 ? `blur(${trustOut * 14}px)` : undefined}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', ...rise(shield, 30, 10)}}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 42,
                background: `linear-gradient(145deg, ${rgba(d.green, 0.25)}, ${rgba(d.green, 0.06)})`,
                border: `1.5px solid ${rgba(d.green, 0.5)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 80px ${rgba(d.green, 0.25)}`,
              }}
            >
              <IShield size={84} color={d.green} stroke={1.8} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', ...rise(pill, 20, 6)}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                height: 66,
                padding: '0 30px',
                borderRadius: 33,
                background: '#0F1412',
                border: `1.5px solid ${rgba(d.green, 0.4)}`,
                fontSize: 30,
                fontWeight: 600,
                color: '#fff',
              }}
            >
              <span style={{width: 16, height: 16, borderRadius: 8, background: d.green, boxShadow: `0 0 ${10 + pulse * 14}px ${d.green}`}} />
              {outro.offline}
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontSize: 112, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.05}}>
            <div style={rise(h1, 50, 12)}>
              Deine Daten<span style={{color: d.accent}}>.</span>
            </div>
            <div style={{...rise(h2, 50, 12), color: d.accent}}>Dein Rechner.</div>
          </div>
          <div style={{position: 'absolute', left: 90, right: 90, top: 1150, textAlign: 'center', fontSize: 36, fontWeight: 500, color: 'rgba(255,255,255,0.68)', ...rise(sub, 20, 6)}}>
            Kavox läuft offline – alles bleibt auf deinem Gerät.
          </div>
        </AbsoluteFill>
      ) : null}

      {/* feature chips converge */}
      {frame >= 58 && frame < L + 2
        ? outro.features.map((f, i) => {
            const a = (i / outro.features.length) * Math.PI * 2 - Math.PI / 2;
            const R = 380 * (1 - converge);
            const t = chipsIn(i);
            const x = 540 + Math.cos(a + converge * 1.2) * R * 1.05;
            const y = 900 + Math.sin(a + converge * 1.2) * R * 1.25;
            return (
              <div
                key={f}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * t) * (1 - converge * 0.7)})`,
                  opacity: t * (1 - prog(frame, L - 6, L)),
                  height: 70,
                  padding: '0 28px',
                  borderRadius: 35,
                  background: d.card,
                  border: `1.5px solid ${rgba(d.accent, 0.45)}`,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 30px ${rgba(d.accent, 0.2)}`,
                }}
              >
                {f}
              </div>
            );
          })
        : null}

      {/* logo end card */}
      {frame >= L - 2 ? (
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 540 - 460 * (0.4 + ring),
              top: 870 - 460 * (0.4 + ring),
              width: 920 * (0.4 + ring),
              height: 920 * (0.4 + ring),
              borderRadius: '50%',
              border: `2px solid ${rgba(d.accent, 0.5 * (1 - ring))}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 540 - LOGO_W / 2,
              top: 870 - LOGO_W / WORDMARK_RATIO / 2,
              transform: `scale(${1.08 - 0.08 * logoT})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
            }}
          >
            <Wordmark t={logoT} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontSize: 40, fontWeight: 600, color: 'rgba(255,255,255,0.82)', ...rise(tag, 20, 6)}}>
            {outro.tagline}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1110, display: 'flex', justifyContent: 'center', ...rise(cta, 24, 6)}}>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                height: 96,
                padding: '0 48px',
                borderRadius: 48,
                background: d.accent,
                color: d.accentInk,
                display: 'flex',
                alignItems: 'center',
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: '-0.01em',
                boxShadow: `0 20px 60px ${rgba(d.accent, 0.35)}`,
              }}
            >
              {outro.cta}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${-40 + shine * 160}%`,
                  width: '30%',
                  background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)',
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* bloom */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 50% at 50% 46%, rgba(255,255,255,${0.85 * bloom}) 0%, ${rgba(d.accent, 0.55 * bloom)} 30%, transparent 70%)`,
        }}
      />
      <Sparkles frame={frame} at={L + 2} x={540} y={870} color={d.accent} r={420} n={12} />
      <CutFlash frame={raw} dur={dur} noOut />

      <S at={2} src="whoosh-soft.wav" vol={0.5} />
      <S at={12} src="shimmer.wav" vol={0.3} />
      <S at={58} src="whoosh-a.wav" vol={0.45} />
      <S at={L - 28} src="riser.wav" vol={0.55} />
      <S at={L} src="impact.wav" vol={0.75} />
      <S at={L + 2} src="shimmer.wav" vol={0.6} />
      <S at={L + 26} src="click.wav" vol={0.4} />
    </AbsoluteFill>
  );
};
