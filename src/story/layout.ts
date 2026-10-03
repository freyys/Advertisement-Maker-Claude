// Per-format layout for "KavoxStory". The app screen is rendered in app
// points (390 pt wide) times `k`; everything else is in stage pixels.
export type Rect = {x: number; y: number; w: number; h: number};

export type Layout = {
  name: 'screen' | 'vertical';
  W: number;
  H: number;
  k: number;
  /** The phone's screen (without bezel), stage px. */
  phone: Rect;
  /** Visible app height in points. */
  vpH: number;
  caption: {
    x: number;
    w: number;
    top?: number;
    centerY?: number;
    label: number;
    head: number;
    sub: number;
  };
  icon: {cx: number; cy: number; size: number};
  paper: Rect;
  phoneBack: {dx: number; dy: number; scale: number};
  end: {cx: number; cy: number; logoW: number; iconSize: number};
};

const screenPhone: Rect = {x: 990, y: 50, w: 390 * 1.75, h: 980};
const verticalPhone: Rect = {x: 150, y: 560, w: 390 * 2, h: 980};

export const LAYOUTS: Record<'screen' | 'vertical', Layout> = {
  screen: {
    name: 'screen',
    W: 1920,
    H: 1080,
    k: 1.75,
    phone: screenPhone,
    vpH: screenPhone.h / 1.75,
    caption: {x: 150, w: 780, centerY: 540, label: 26, head: 74, sub: 31},
    icon: {cx: screenPhone.x + screenPhone.w / 2, cy: 540, size: 210},
    paper: {x: 1170 - 300, y: 540 - 425, w: 600, h: 850},
    phoneBack: {dx: 170, dy: 10, scale: 0.84},
    end: {cx: 960, cy: 540, logoW: 620, iconSize: 210},
  },
  vertical: {
    name: 'vertical',
    W: 1080,
    H: 1920,
    k: 2,
    phone: verticalPhone,
    vpH: verticalPhone.h / 2,
    // 9:16 safe zone: top 220 px / bottom 380 px stay clear
    caption: {x: 90, w: 900, top: 250, label: 28, head: 68, sub: 32},
    icon: {cx: 540, cy: 1050, size: 230},
    paper: {x: 540 - 320, y: 600, w: 640, h: 880},
    phoneBack: {dx: 0, dy: 150, scale: 0.84},
    end: {cx: 540, cy: 880, logoW: 680, iconSize: 230},
  },
};
