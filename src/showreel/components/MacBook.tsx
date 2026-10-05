import React from 'react';

// Minimal MacBook (no logos): thin-bezel lid that leans back slightly, and an
// aluminium deck drawn as a real 3D plane, so camera tilts read correctly.
export const DESK_SRC_W = 2880;
export const DESK_SRC_H = 1800;

export const macSize = (screenW: number) => {
  const bezel = screenW * 0.016;
  const screenH = screenW * (DESK_SRC_H / DESK_SRC_W);
  const lidW = screenW + bezel * 2;
  const lidH = screenH + bezel * 2.4;
  return {screenW, screenH, bezel, lidW, lidH, k: screenW / DESK_SRC_W, deckW: lidW * 1.12, deckD: lidW * 0.62};
};

/** `content` is laid out in screenshot pixels (2880 × 1800). */
export const MacBook: React.FC<{
  screenW: number;
  content: React.ReactNode;
  lean?: number;
  showDeck?: boolean;
  rim?: number;
  glare?: number;
  power?: number; // 0 = screen off, 1 = on
  style?: React.CSSProperties;
}> = ({screenW, content, lean = 6, showDeck = true, rim = 1, glare = 1, power = 1, style}) => {
  const m = macSize(screenW);
  return (
    <div style={{position: 'relative', width: m.lidW, height: m.lidH, transformStyle: 'preserve-3d', ...style}}>
      {/* deck */}
      {showDeck && (
        <div
          style={{
            position: 'absolute',
            left: (m.lidW - m.deckW) / 2,
            top: m.lidH,
            width: m.deckW,
            height: m.deckD,
            transformOrigin: '50% 0',
            transform: 'rotateX(90deg)',
            borderRadius: `${m.lidW * 0.012}px ${m.lidW * 0.012}px ${m.lidW * 0.03}px ${m.lidW * 0.03}px`,
            background: 'linear-gradient(180deg, #2a2e34 0%, #3a3f46 55%, #4a5058 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* hinge shadow */}
          <div style={{position: 'absolute', left: '6%', right: '6%', top: 0, height: '5%', background: 'linear-gradient(#0b0c0e, rgba(11,12,14,0))'}} />
          {/* keyboard well */}
          <div
            style={{
              position: 'absolute',
              left: '9%',
              right: '9%',
              top: '9%',
              height: '42%',
              borderRadius: m.lidW * 0.008,
              background:
                'repeating-linear-gradient(90deg, #121417 0 5.6%, #1c1f23 5.6% 6.25%), linear-gradient(#121417, #121417)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.6)',
              opacity: 0.95,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(180deg, transparent 0 15.5%, #1c1f23 15.5% 16.66%)',
              }}
            />
          </div>
          {/* trackpad */}
          <div
            style={{
              position: 'absolute',
              left: '32%',
              right: '32%',
              top: '57%',
              height: '34%',
              borderRadius: m.lidW * 0.01,
              background: 'linear-gradient(180deg, #34393f, #3e444b)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          />
          {/* front lip, faces the viewer */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              width: '100%',
              height: m.lidW * 0.014,
              transformOrigin: '50% 0',
              transform: 'rotateX(-90deg)',
              background: 'linear-gradient(180deg, #5a616a, #22262b)',
              borderRadius: `0 0 ${m.lidW * 0.02}px ${m.lidW * 0.02}px`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '44%',
                width: '12%',
                top: 0,
                height: '55%',
                background: '#1a1d21',
                borderRadius: `0 0 ${m.lidW * 0.01}px ${m.lidW * 0.01}px`,
              }}
            />
          </div>
        </div>
      )}
      {/* lid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 100%',
          transform: `rotateX(${lean}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: m.lidW * 0.022,
            background: 'linear-gradient(160deg, #50565e, #1d2024 30%, #2c3036 70%, #474d55)',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.10)',
              `0 ${m.lidW * 0.04}px ${m.lidW * 0.1}px rgba(0,0,0,0.6)`,
              `0 0 ${m.lidW * 0.12 * rim}px rgba(91,200,232,${0.2 * rim})`,
            ].join(', '),
          }}
        />
        <div style={{position: 'absolute', inset: m.lidW * 0.003, borderRadius: m.lidW * 0.02, background: '#040506'}} />
        {/* camera */}
        <div
          style={{
            position: 'absolute',
            left: m.lidW / 2 - m.bezel * 0.18,
            top: m.bezel * 0.32,
            width: m.bezel * 0.36,
            height: m.bezel * 0.36,
            borderRadius: 99,
            background: '#15191d',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: m.bezel,
            top: m.bezel,
            width: m.screenW,
            height: m.screenH,
            overflow: 'hidden',
            borderRadius: m.lidW * 0.006,
            background: '#000',
          }}
        >
          <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${m.k})`, opacity: power}}>
            {content}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: glare,
              background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 45%)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: m.lidW * 0.022,
            boxShadow: `inset 0 0 0 1.5px rgba(160,225,245,${0.25 * rim})`,
          }}
        />
      </div>
    </div>
  );
};
