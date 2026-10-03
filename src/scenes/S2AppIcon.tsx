import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette, STAGE} from '../theme';
import {SCENES} from '../timeline';
import {ease, keys, prog, springAt, tween} from '../lib/anim';
import {AppIcon, ICON_END_SCALE, ICON_SIZE, iconDrift} from '../components/AppIcon';
import {Bloom, BLOOM_RADIUS} from './S1Ignition';

const {start, end} = SCENES.S2;

export const S2AppIcon: React.FC = () => {
  const frame = useCurrentFrame();

  // Bloom collapses into the icon
  const collapse = prog(frame, start, start + 13, ease.in);
  const bloomR = BLOOM_RADIUS + (ICON_SIZE * 0.75 - BLOOM_RADIUS) * collapse;
  const bloomOpacity = tween(frame, start + 9, start + 18, 1, 0, ease.soft);

  const pop = springAt(frame, start + 8, {damping: 9, stiffness: 150, mass: 0.8});
  const iconScale = (0.6 + 0.4 * pop) * tween(frame, start + 22, end, 1, ICON_END_SCALE, ease.soft);
  const iconOpacity = tween(frame, start + 8, start + 13, 0, 1);

  const draw = prog(frame, start + 11, start + 28, ease.inOut);
  const fill = prog(frame, start + 24, start + 34, ease.soft);
  const glow = keys(frame, [
    [start + 8, 1.6],
    [start + 20, 1],
    [end, 0.85],
  ]);

  const ring = prog(frame, start + 18, end - 2, ease.out);
  const {x: dx, y: dy} = iconDrift(frame);

  const cx = STAGE.width / 2 + dx;
  const cy = STAGE.height / 2 + dy;

  return (
    <AbsoluteFill>
      {bloomOpacity > 0 ? <Bloom radius={bloomR} heat={0.45 + collapse * 0.4} opacity={bloomOpacity} x={cx} y={cy} /> : null}
      {/* expanding ring */}
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: cx - ICON_SIZE / 2,
            top: cy - ICON_SIZE / 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: ICON_SIZE * 0.3,
            border: `2px solid ${palette.lavender}`,
            opacity: 0.85 * (1 - ring),
            transform: `scale(${1 + ring * 1.6})`,
            boxShadow: `0 0 26px rgba(169,139,255,${0.6 * (1 - ring)}), inset 0 0 26px rgba(169,139,255,${0.4 * (1 - ring)})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: cx - ICON_SIZE / 2,
          top: cy - ICON_SIZE / 2,
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
        }}
      >
        <AppIcon size={ICON_SIZE} draw={draw} fill={fill} glow={glow} />
      </div>
    </AbsoluteFill>
  );
};
