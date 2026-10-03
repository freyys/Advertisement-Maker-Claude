import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {app, palette, tabular} from '../theme';
import {S4_BEATS as B, SCENES} from '../timeline';
import {ease, keys, prog, tween} from '../lib/anim';
import {eur, qty} from '../lib/format';
import * as copy from '../copy';
import {Camera, DirBlur} from '../components/Camera';
import {CloseIcon, Field, PositionCard, SectionHeader} from '../components/app/KavoxUI';

const K = 2.2;
const CALC = {x: 310, y: 300, w: 440};
const LIST = {x: 840, y: 70, w: 770};

const CalcLine: React.FC<{t: number; left: string; right: string; strong?: boolean}> = ({t, left, right, strong}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      opacity: t,
      transform: `translateY(${(1 - t) * 14}px)`,
      fontSize: strong ? 40 : 26,
      fontWeight: strong ? 800 : 600,
      color: strong ? palette.white : 'rgba(255,255,255,0.86)',
      marginTop: strong ? 10 : 14,
      ...tabular,
    }}
  >
    <span style={{color: strong ? palette.lavender : undefined}}>{left}</span>
    <span>{right}</span>
  </div>
);

export const S4Positions: React.FC = () => {
  const frame = useCurrentFrame();
  const {start, end} = SCENES.S4;

  // Whip-in from the right, push-in onto the list
  const land = prog(frame, start, B.land, ease.out);
  const camX = 960 - (1 - land) * 1500;
  const zoom =
    keys(frame, [
      [start, 0.8],
      [B.land, 1],
      [B.out, 1.08],
    ], ease.out) * tween(frame, B.out, end + 8, 1, 1.12, ease.in);
  const camY = keys(frame, [
    [B.land, 540],
    [B.out, 600],
  ]);
  const dirBlur = tween(frame, start, start + 8, 60, 0, ease.out);
  const fadeIn = prog(frame, start, start + 4, ease.soft);
  const fadeOut = tween(frame, B.out, end + 6, 1, 0, ease.soft);

  const calcAt = [B.land - 2, B.land + 4, B.land + 9, B.land + 16];
  const calc = calcAt.map((a) => prog(frame, a, a + 7));

  return (
    <AbsoluteFill style={{opacity: fadeIn * fadeOut}}>
      <DirBlur x={dirBlur}>
        <Camera frame={frame} zoom={zoom} x={camX} y={camY} seed={5} driftAmp={8}>
          {/* calculation card: quantities come from the room size */}
          <div
            style={{
              position: 'absolute',
              left: CALC.x,
              top: CALC.y,
              width: CALC.w,
              padding: '30px 32px 30px',
              borderRadius: 26,
              background: 'rgba(18,13,46,0.72)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 90px rgba(0,0,0,0.5), 0 0 80px rgba(109,74,255,0.15)',
              opacity: prog(frame, start + 2, B.land),
            }}
          >
            <div style={{fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', color: palette.lavender}}>
              WANDFLÄCHE · {copy.room.toUpperCase()}
            </div>
            <CalcLine t={calc[0]} left="18,0 m × 2,60 m" right="46,8 m²" />
            <CalcLine t={calc[1]} left="− 2 Fenster" right="3,0 m²" />
            <CalcLine t={calc[2]} left="− 1 Tür" right="2,0 m²" />
            <div
              style={{
                height: 1,
                marginTop: 18,
                background: `linear-gradient(90deg, rgba(169,139,255,0.6), rgba(169,139,255,0) ${calc[3] * 100}%)`,
              }}
            />
            <CalcLine t={calc[3]} left="=" right="41,8 m²" strong />
          </div>

          {/* Aufmaß screen: Räume & Positionen (rebuilt from the app) */}
          <div style={{position: 'absolute', left: LIST.x, top: LIST.y, width: LIST.w, fontFamily: 'inherit'}}>
            <SectionHeader k={K} no={copy.aufmass.sectionNo} title={copy.aufmass.section} />
            <div
              style={{
                marginTop: 28,
                padding: 13 * K,
                borderRadius: 14 * K,
                background: app.surface,
                border: '1.5px solid rgba(255,255,255,0.07)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
              }}
            >
              <Field k={K} value={copy.room} bold right={<CloseIcon k={K} />} />
              {copy.positions.map((p, i) => {
                const at = B.rowSweepStart + i * B.rowSweepEvery;
                const sweep = prog(frame, at, at + 12, ease.soft);
                const lit = prog(frame, at, at + 4) * (1 - 0.6 * prog(frame, at + 8, at + 20));
                const mark = prog(frame, at + 2, at + 8);
                return (
                  <PositionCard
                    key={p.name}
                    k={K}
                    name={p.name}
                    formula={copy.formula}
                    qty={qty(p.qty, p.unit)}
                    price={eur(copy.lineTotal(p))}
                    style={{
                      marginTop: 10 * K,
                      borderColor: `rgba(169,139,255,${0.08 + 0.55 * lit})`,
                      boxShadow: `0 0 ${40 * lit}px rgba(109,74,255,${0.35 * lit})`,
                    }}
                  >
                    {/* violet bar sweeping left → right */}
                    {sweep > 0 && sweep < 1 ? (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(90deg, rgba(109,74,255,0) ${sweep * 140 - 60}%, rgba(109,74,255,0.38) ${sweep * 140 - 12}%, rgba(169,139,255,0.55) ${sweep * 140 - 4}%, rgba(109,74,255,0) ${sweep * 140}%)`,
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 10,
                        bottom: 10,
                        width: 5,
                        borderRadius: 4,
                        background: palette.violet,
                        boxShadow: `0 0 14px ${palette.violet}`,
                        transform: `scaleY(${mark})`,
                      }}
                    />
                  </PositionCard>
                );
              })}
            </div>
          </div>
        </Camera>
      </DirBlur>
    </AbsoluteFill>
  );
};
