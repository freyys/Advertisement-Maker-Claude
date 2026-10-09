import React from 'react';
import {B} from '../theme';
import {Kicker, Sub, Title} from '../ui';

/** The montage's copy block: chapter kicker, two-line headline, one fact line. */
export const TextBlock: React.FC<{
  f: number;
  n: string;
  kicker: string;
  title: string;
  sub: string;
  x?: number;
  top?: number;
  size?: number;
  at?: number;
  extra?: React.ReactNode;
}> = ({f, n, kicker, title, sub, x = 128, top = 330, size = 88, at = 2, extra}) => (
  <div style={{position: 'absolute', left: x, top}}>
    <Kicker n={n} label={kicker} f={f} at={at} extra={extra} />
    <div style={{height: 34}} />
    <Title text={title} f={f} at={at + 3} size={size} color={B.black} />
    <div style={{height: 34}} />
    <Sub text={sub} f={f} at={at + 13} />
  </div>
);
