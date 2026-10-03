import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Plus Jakarta Sans (OFL), bundled locally so renders work offline.
const WEIGHTS = ['400', '500', '600', '700', '800'] as const;

export const fontsLoaded = Promise.all(
  WEIGHTS.map((weight) =>
    loadFont({
      family: 'Plus Jakarta Sans',
      url: staticFile(`fonts/plus-jakarta-sans-latin-${weight}-normal.woff2`),
      weight,
      format: 'woff2',
    }),
  ),
);
