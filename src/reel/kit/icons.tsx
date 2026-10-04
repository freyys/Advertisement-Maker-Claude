// Line icons in the style the Kavox app uses (24×24, round caps). Drawn as
// SVG so they stay sharp at any zoom.
import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties; fill?: string};

const mk = (children: React.ReactNode, filled = false): React.FC<P> => {
  const Icon: React.FC<P> = ({size = 18, color = 'currentColor', stroke = 1.8, style, fill}) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : fill ?? 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{flexShrink: 0, display: 'block', ...style}}
    >
      {children}
    </svg>
  );
  return Icon;
};

export const ICockpit = mk(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M9 11h12" />
  </>,
);
export const IBell = mk(
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <path d="M4 2C2.8 3.7 2 5.7 2 8M22 8c0-2.3-.8-4.3-2-6" />
  </>,
);
export const ITasks = mk(<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8" />);
export const IChart = mk(
  <>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 17v-3M11 17v-6M15 17v-4M19 17V8" />
    <path d="m7 10 4-4 4 3 5-5" />
  </>,
);
export const ISearch = mk(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </>,
);
export const IFile = mk(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
  </>,
);
export const IReceipt = mk(
  <>
    <path d="M5 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M15 8H9M15 12H9M13 16H9" />
  </>,
);
export const IFolder = mk(
  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
);
export const IFolderOpen = mk(
  <path d="m6 14 1.5-2.9A2 2 0 0 1 9.2 10H20a2 2 0 0 1 1.9 2.5l-1.5 6A2 2 0 0 1 18.5 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.7.9l.8 1.2a2 2 0 0 0 1.7.9H18a2 2 0 0 1 2 2v2" />,
);
export const IUsers = mk(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </>,
);
export const IArchive = mk(
  <>
    <rect x="3" y="3" width="18" height="5" rx="1" />
    <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4" />
  </>,
);
export const IGear = mk(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9" />
    <circle cx="12" cy="12" r="6.6" />
  </>,
);
export const IKey = mk(
  <>
    <circle cx="7.5" cy="12" r="4.5" />
    <path d="M12 12h10M18 12v3M21 12v2" />
  </>,
);
export const IChevronsLeft = mk(<path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />);
export const IChevronDown = mk(<path d="m6 9 6 6 6-6" />);
export const IChevronRight = mk(<path d="m9 18 6-6-6-6" />);
export const IArrowRight = mk(<path d="M5 12h14M13 5l7 7-7 7" />);
export const IArrowLeft = mk(<path d="M19 12H5M11 19l-7-7 7-7" />);
export const IArrowUp = mk(<path d="M12 19V5M5 12l7-7 7 7" />);
export const ICheck = mk(<path d="M20 6 9 17l-5-5" />);
export const IClock = mk(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);
export const ITrend = mk(<path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" />);
export const IHourglass = mk(
  <path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2" />,
);
export const IWallet = mk(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M21 9h-5a3 3 0 0 0 0 6h5" />
    <path d="M16 12h.01" />
  </>,
);
export const ISliders = mk(<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />);
export const IUserPlus = mk(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </>,
);
export const ICheckCircle = mk(
  <>
    <path d="M21.8 10A10 10 0 1 1 17 3.3" />
    <path d="m9 11 3 3L22 4" />
  </>,
);
export const IMessages = mk(
  <>
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
  </>,
);
export const ISun = mk(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
  </>,
);
export const ITable = mk(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18" />
  </>,
);
export const IPhone = mk(
  <>
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M11 18h2" />
  </>,
);
export const IMic = mk(
  <>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
  </>,
);
export const IMaximize = mk(<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />);
export const IHelp = mk(
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
  </>,
);
export const ISave = mk(
  <>
    <path d="M15.2 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.8a2 2 0 0 0-.6-1.4l-3.8-3.8a2 2 0 0 0-1.4-.6Z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7" />
  </>,
);
export const IDoor = mk(<path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01M13 4.6v16.2a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.5-1.9l4-1A2 2 0 0 1 13 4.6Z" />);
export const IFilePdf = mk(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M8 13h1.5a1.5 1.5 0 0 1 0 3H8v-3Zm0 3v2M13 13v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z" />
  </>,
);
export const IPen = mk(<path d="M12 20h9M16.4 3.6a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />);
export const ICamera = mk(
  <>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z" />
    <circle cx="12" cy="13" r="3" />
  </>,
);
export const IWifiOff = mk(
  <>
    <path d="M12 20h.01M8.5 16.4a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8A15 15 0 0 0 10.7 5.1M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.1-1.6" />
    <path d="m2 2 20 20" />
  </>,
);
export const IShield = mk(
  <>
    <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);
export const ISend = mk(<path d="M5 4.5v15l14-7.5Z" />, true);
export const IAlert = mk(<path d="M12 3 2 20h20Z" />, true);
export const ISparkle = mk(
  <path d="M12 2c.6 4.4 2.6 6.9 8 8-5.4 1.1-7.4 3.6-8 8-.6-4.4-2.6-6.9-8-8 5.4-1.1 7.4-3.6 8-8Z" />,
  true,
);
