import React from 'react';

// Paths from Kavox_Wortmarke (viewBox 0 0 472.29 100), split per glyph so the
// mark can be drawn on and the letters can be tracked individually.
export const K_MARK =
  'M71.24 98.47C63.35 73.98 44.53 55.96 18.32 53.23C12.45 52.62 5.87 53.13 0 53.74L30.06 0L88.45 1.42L60.31 53.63L109.39 57.68L132.01 100L71.24 98.47Z';

export const GLYPHS = [
  K_MARK,
  // A (outer + counter)
  'M135.4 86.52L169.61 13.97L194.4 13.76L228.71 86.52L196.73 86.42L193.29 79.34L161.92 79.34L158.48 86.42L135.4 86.52Z M183.17 59C183.17 58.9 183.27 58.69 183.37 58.49L178.01 46.75C177.91 46.75 177.6 46.55 177.5 46.55L171.43 59.1L183.17 59Z',
  // V
  'M250.26 86.52L215.96 13.86L249.05 13.76L266.66 50.9L283.96 13.97L307.03 13.86L272.83 86.42L250.26 86.52Z',
  // O (outer + counter)
  'M304.61 50.19C304.61 27.63 324.64 11.54 346.2 11.64C367.75 11.64 387.59 27.83 387.59 50.19C387.59 72.96 367.45 88.55 345.69 88.55C324.44 88.55 304.61 72.26 304.61 50.19Z M358.24 50.19C358.24 43.41 353.79 34.91 346.1 34.91C338.41 34.91 333.95 43.41 333.95 50.19C333.95 57.18 338.41 65.17 346.2 65.27C353.79 65.27 358.24 56.87 358.24 50.19Z',
  // X
  'M381.31 86.52L409.35 51.91L380.81 13.86L417.75 13.76L428.47 28.23L440.31 13.76L471.38 13.86L443.55 48.27L472.29 86.42L435.35 86.52L424.32 71.85L412.28 86.52L381.31 86.52Z',
];

export const WORDMARK_RATIO = 472.29 / 100;
export const MARK_RATIO = 132.01 / 100;

export const Wordmark: React.FC<{
  width: number;
  color?: string;
  /** Extra space between glyphs, in % of the wordmark height. */
  tracking?: number;
  style?: React.CSSProperties;
}> = ({width, color = '#fff', tracking = 0, style}) => {
  const height = width / WORDMARK_RATIO;
  const pad = Math.abs(tracking) * 2.2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-pad} 0 ${472.29 + pad * 2} 100`}
      style={{overflow: 'visible', ...style}}
    >
      {GLYPHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={color}
          fillRule="evenodd"
          transform={`translate(${(i - 2) * tracking} 0)`}
        />
      ))}
    </svg>
  );
};

/** The K mark. `draw` 0→1 strokes the outline on, `fill` 0→1 fills it. */
export const KMark: React.FC<{
  size: number; // height in px
  color?: string;
  draw?: number;
  fill?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({size, color = '#fff', draw = 1, fill = 1, strokeWidth = 2.4, style}) => (
  <svg
    width={size * (140.01 / 108)}
    height={size}
    viewBox="-4 -4 140.01 108"
    style={{overflow: 'visible', ...style}}
  >
    <path
      d={K_MARK}
      fill={color}
      fillOpacity={fill}
      stroke={color}
      strokeOpacity={draw > 0 && draw < 1 ? 1 : 1 - fill}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
  </svg>
);
