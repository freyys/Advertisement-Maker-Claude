import React from 'react';
import {Audio, Loop, Sequence, staticFile} from 'remotion';
import {FPS, SCENES, sec} from './timeline';

// Sound design only, no music. Shared hits come from public/sfx (scripts/make-sfx.mjs),
// the reel's own sounds from public/gold/sfx (scripts/make-gold-sfx.mjs).
const Clip: React.FC<{at: number; src: string; volume?: number; len?: number}> = ({at, src, volume = 1, len}) => (
  <Sequence from={Math.max(0, sec(at))} durationInFrames={len ? sec(len) : undefined} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const WH = 0.3; // whooshes peak 0.3 s after they start

export const GoldSfx: React.FC = () => {
  const counterTicks = (from: number, to: number, step = 0.09) =>
    new Array(Math.floor((to - from) / step)).fill(0).map((_, i) => from + i * step);
  const pressHits = new Array(Math.floor((SCENES.s5[1] - SCENES.s3[0]) / 0.45)).fill(0).map((_, i) => SCENES.s3[0] + 0.3 + i * 0.45);
  return (
    <>
      <Loop durationInFrames={8 * FPS} layout="none">
        <Audio src={staticFile('gold/sfx/roomtone.wav')} volume={0.8} />
      </Loop>
      {/* S1 */}
      <Clip at={0} src="sfx/shimmer.wav" volume={0.5} />
      <Clip at={5.1 - WH} src="sfx/whoosh-soft.wav" volume={0.8} />
      <Clip at={5.0} src="gold/sfx/flutter.wav" volume={0.35} />
      {/* S2 */}
      <Clip at={SCENES.s2[0] - WH} src="sfx/whoosh-a.wav" volume={0.7} />
      <Clip at={SCENES.s2[0] + 0.2} src="gold/sfx/coin.wav" />
      <Clip at={11.5} src="gold/sfx/coin-lo.wav" volume={0.7} />
      {counterTicks(14.9, 17.0).map((f, i) => (
        <Clip key={`c${i}`} at={f} src="sfx/tick.wav" volume={0.8} />
      ))}
      <Clip at={17.9 - 1.0} src="sfx/riser.wav" volume={0.5} />
      <Clip at={17.9} src="sfx/impact.wav" volume={0.75} />
      {/* S3 + S5: the press keeps stamping (quieter once we are in the vault scene) */}
      <Clip at={SCENES.s3[0] - WH} src="sfx/whoosh-b.wav" volume={0.7} />
      {pressHits.map((f, i) => (
        <Clip key={`p${i}`} at={f} src="gold/sfx/press.wav" volume={f < SCENES.s3[1] ? 0.42 : f >= SCENES.s5[0] ? 0.16 : 0} />
      ))}
      <Clip at={20.4} src="gold/sfx/flutter.wav" volume={0.5} />
      <Clip at={22.9} src="gold/sfx/flutter.wav" volume={0.4} />
      <Clip at={24.75} src="gold/sfx/coin-lo.wav" volume={0.9} />
      <Clip at={24.75} src="sfx/shimmer.wav" volume={0.5} />
      {/* S4 */}
      <Clip at={SCENES.s4[0] - WH} src="sfx/whoosh-a.wav" volume={0.7} />
      <Clip at={29.4 - WH} src="sfx/whoosh-soft.wav" volume={0.6} />
      <Clip at={30.4} src="gold/sfx/zap.wav" volume={0.4} len={0.8} />
      {counterTicks(31.0, 34.2, 0.07).map((f, i) => (
        <Clip key={`v${i}`} at={f} src="sfx/tick.wav" volume={0.7} />
      ))}
      <Clip at={33.0} src="sfx/riser.wav" volume={0.5} />
      <Clip at={34.1} src="sfx/impact.wav" volume={0.8} />
      <Clip at={36.4} src="gold/sfx/coin.wav" volume={0.9} />
      {/* S5 */}
      <Clip at={SCENES.s5[0] - WH} src="sfx/whoosh-soft.wav" volume={0.7} />
      <Clip at={40.5 - 0.02} src="gold/sfx/vault.wav" volume={1} />
      {/* S6 montage */}
      {[0, 1, 2, 3].map((i) => (
        <Clip key={`m${i}`} at={SCENES.s6[0] + i * 1.95 - WH} src="sfx/whoosh-whip.wav" volume={0.75} />
      ))}
      <Clip at={SCENES.s6[0] + 0.1} src="gold/sfx/coin.wav" volume={0.7} />
      <Clip at={SCENES.s6[0] + 0.6} src="gold/sfx/coin-lo.wav" volume={0.5} />
      <Clip at={SCENES.s6[0] + 1.95} src="gold/sfx/zap.wav" volume={0.6} />
      <Clip at={SCENES.s6[0] + 3.9} src="gold/sfx/zap.wav" volume={0.45} />
      <Clip at={SCENES.s6[0] + 5.85} src="gold/sfx/servers.wav" volume={0.8} />
      {/* S7 */}
      <Clip at={SCENES.s7[0] - WH} src="sfx/whoosh-soft.wav" volume={0.7} />
      <Clip at={55.0} src="sfx/shimmer.wav" volume={0.6} />
      <Clip at={56.0} src="sfx/whoosh-b.wav" volume={0.4} />
      <Clip at={57.4} src="sfx/click.wav" volume={0.6} />
      <Clip at={58.2} src="sfx/whoosh-soft.wav" volume={0.5} />
      {/* S8 */}
      <Clip at={SCENES.s8[0] - 0.2} src="gold/sfx/underwater.wav" volume={0.9} />
      <Clip at={SCENES.s8[0]} src="gold/sfx/flutter.wav" volume={0.3} />
      <Clip at={SCENES.s8[0] + 3.3} src="sfx/impact.wav" volume={0.55} />
      {/* S9 */}
      <Clip at={SCENES.s9[0] - WH} src="sfx/whoosh-a.wav" volume={0.55} />
      <Clip at={SCENES.s9[0] + 0.4} src="sfx/riser.wav" volume={0.35} />
      <Clip at={SCENES.s9[0] + 2.0} src="sfx/shimmer.wav" volume={0.8} />
    </>
  );
};
