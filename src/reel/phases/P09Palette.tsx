// P09 · Befehlspalette (Strg + K): two keycaps press, the palette springs
// open over the dimmed Cockpit, "Rech" is typed and the results stream in.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions, palette} from '../copy';
import {d, FONT, rgba, tnum} from '../tokens';
import {Caption, CutFlash, ease, Keycap, keys, prog, springAtLocal, UnderCaption, Whip} from '../kit/stage';
import {camAt, DesktopApp, DesktopShot} from '../kit/desktop';
import {CockpitPage} from '../pages/Cockpit';
import {IReceipt} from '../kit/icons';
import {CutWhoosh, S, Ticks} from '../kit/sfx';

const PZ = 1.72; // palette zoom
const T = {strg: 10, k: 17, open: 26, type: [36, 50] as const, sel1: 74, sel2: 86, enter: 100};

const Kbd: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 22,
      height: 22,
      padding: '0 6px',
      borderRadius: 5,
      background: '#25262C',
      border: '1px solid rgba(255,255,255,0.1)',
      fontSize: 12,
      color: '#fff',
      marginRight: 6,
    }}
  >
    {children}
  </span>
);

const Group: React.FC<{children: string}> = ({children}) => (
  <div style={{fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', color: d.muted, padding: '14px 20px 6px'}}>{children}</div>
);

const Row: React.FC<{title: string; right: string; sel: number; t: number; tone?: string}> = ({title, right, sel, t, tone}) => (
  <div
    style={{
      margin: '0 8px',
      height: 41,
      borderRadius: 9,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 12px',
      background: sel > 0 ? rgba('#2B4553', 0.85 * sel) : 'transparent',
      boxShadow: sel > 0.5 ? `inset 0 0 0 1px ${rgba(d.accent, 0.35)}` : undefined,
      opacity: t,
      transform: `translateY(${(1 - t) * 10}px)`,
      fontSize: 14.5,
      color: '#fff',
      whiteSpace: 'nowrap',
    }}
  >
    <IReceipt size={17} color={sel > 0.5 ? d.accent : d.textSoft} />
    <span style={{overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0}}>{title}</span>
    <span style={{flex: 1}} />
    <span style={{fontSize: 13.5, color: tone ?? d.textSoft, flexShrink: 0, ...tnum}}>{right}</span>
  </div>
);

export const P09Palette: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const keysIn = prog(frame, 2, 12, ease.out);
  const keysOut = prog(frame, T.open - 2, T.open + 10, ease.in);
  const strg = keys(frame, [[T.strg - 2, 0], [T.strg + 1, 1], [T.open + 4, 1]]);
  const kk = keys(frame, [[T.k - 2, 0], [T.k + 1, 1], [T.open + 4, 1]]);
  const open = springAtLocal(frame, T.open, {damping: 15, stiffness: 190});
  const q = palette.query.slice(0, Math.floor(keys(frame, [[T.type[0], 0], [T.type[1], palette.query.length]], ease.soft)));
  const res = (i: number) => (q.length >= 2 ? prog(frame, T.type[0] + 8 + i * 3, T.type[0] + 20 + i * 3, ease.out) : 0);
  // selected row index: 0 action, 1 page, 2.. docs
  const selIdx = frame < T.sel1 ? 0 : frame < T.sel2 ? 4 : 7;
  const selMove = prog(frame, frame < T.sel2 ? T.sel1 : T.sel2, (frame < T.sel2 ? T.sel1 : T.sel2) + 5);
  const enter = prog(frame, T.enter, T.enter + 4) * (1 - prog(frame, T.enter + 6, T.enter + 16));
  const sel = (i: number) => (i === selIdx ? (selIdx === 0 ? 1 : selMove) + enter * 0.6 : 0);
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const bgCam = camAt(frame, [
    [0, {fx: 900, fy: 420, s: 1.0, rx: 10, ry: -8}],
    [dur, {fx: 900, fy: 440, s: 1.12, rx: 4, ry: -2}],
  ]);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <AbsoluteFill style={{filter: `blur(${2 + open * 5}px) brightness(${1 - open * 0.55})`}}>
            <DesktopShot cam={bgCam} cy={1180}>
              <DesktopApp active="cockpit" scrollY={715} sticky={{title: 'Cockpit', meta: '02 / 02 · Schnellstart', progress: 0.62, opacity: 1}}>
                <CockpitPage s={{}} />
              </DesktopApp>
            </DesktopShot>
          </AbsoluteFill>
        </UnderCaption>

        {/* keycaps */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 980,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 34,
            opacity: keysIn * (1 - keysOut),
            transform: `translateY(${(1 - keysIn) * 80 - keysOut * 200}px) scale(${1 - keysOut * 0.3})`,
            filter: keysOut > 0 ? `blur(${keysOut * 12}px)` : undefined,
          }}
        >
          <Keycap label="Strg" press={strg} w={230} />
          <span style={{fontSize: 70, fontWeight: 300, color: 'rgba(255,255,255,0.5)'}}>+</span>
          <Keycap label="K" press={kk} w={160} />
        </div>

        {/* palette */}
        {open > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 540 - (560 * PZ) / 2,
              top: 640,
              width: 560 * PZ,
              transformOrigin: '50% 0%',
              transform: `scale(${0.86 + 0.14 * open}) translateY(${(1 - open) * 40}px)`,
              opacity: Math.min(1, open * 1.4),
            }}
          >
            <div
              style={{
                zoom: PZ,
                width: 560,
                borderRadius: 16,
                background: d.palette,
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: `0 40px 100px rgba(0,0,0,0.75), 0 0 80px ${rgba(d.accent, 0.12)}`,
                overflow: 'hidden',
              }}
            >
              <div style={{height: 62, display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 19, color: '#fff', borderBottom: `1px solid ${d.line}`}}>
                {q || <span style={{color: d.faint}}>Suchen oder Befehl …</span>}
                {caretOn ? <span style={{width: 1.5, height: 22, background: '#fff', marginLeft: 1}} /> : null}
              </div>
              <div style={{opacity: q.length >= 2 ? 1 : 0}}>
                <Group>AKTIONEN</Group>
                <Row title={palette.action} right="Aktion" sel={sel(0)} t={res(0)} />
                <Group>SEITEN</Group>
                <Row title={palette.page} right="Seite öffnen" sel={sel(1)} t={res(1)} />
                <Group>DOKUMENTE</Group>
                {palette.docs.map((doc, i) => (
                  <Row
                    key={doc.no}
                    title={`${doc.no} · ${doc.who}`}
                    right={`${doc.status} · ${doc.sum} ›`}
                    sel={sel(i + 2)}
                    t={res(i + 2)}
                    tone={doc.status === 'Überfällig' ? d.rose : undefined}
                  />
                ))}
              </div>
              <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', marginTop: 6, borderTop: `1px solid ${d.line}`, fontSize: 13, color: d.muted}}>
                <span>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>auswählen
                </span>
                <span>
                  <Kbd>Enter</Kbd>ausführen
                </span>
                <span>
                  <Kbd>Esc</Kbd>schließen
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Whip>
      <Caption c={captions.palette} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={T.strg} src="click.wav" vol={0.8} />
      <S at={T.k} src="click.wav" vol={0.9} />
      <S at={T.open - 4} src="whoosh-soft.wav" vol={0.6} />
      <Ticks from={T.type[0]} to={T.type[1]} n={4} vol={0.5} />
      <S at={T.sel1} src="tick.wav" vol={0.6} />
      <S at={T.sel2} src="tick.wav" vol={0.6} />
      <S at={T.enter} src="click.wav" vol={0.7} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
