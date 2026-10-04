// P01 · Hook: the sky-blue K draws on, "Weniger Büro. Mehr Baustelle." and
// fragments of the app float past in depth.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {d, FONT, m, rgba, tnum} from '../tokens';
import {KMark} from '../../components/Logo';
import {ease, prog, rise, Whip, CutFlash} from '../kit/stage';
import {StatusPill, DocThumb} from '../kit/desktop';
import {PdfPage} from '../kit/pdf';
import {IFilePdf, IWallet} from '../kit/icons';
import {intro} from '../copy';
import {S, CutWhoosh} from '../kit/sfx';

const Frag: React.FC<{
  frame: number;
  x: number;
  y: number;
  depth: number; // 0 near … 1 far
  rot: number;
  at: number;
  children: React.ReactNode;
  dur: number;
}> = ({frame, x, y, depth, rot, at, children, dur}) => {
  const t = prog(frame, at, at + 24, ease.out);
  const out = prog(frame, dur - 18, dur, ease.in);
  const par = 1.6 - depth;
  const dy = -frame * 1.1 * par - out * 400 * par;
  const dx = (x > 540 ? 1 : -1) * out * 260 * par;
  const s = (1 - depth * 0.35) * (0.85 + t * 0.15);
  return (
    <div
      style={{
        position: 'absolute',
        left: x + dx,
        top: y + dy + (1 - t) * 80,
        transform: `rotate(${rot + frame * 0.03 * (depth - 0.5)}deg) scale(${s})`,
        transformOrigin: '0 0',
        opacity: t * (0.45 + (1 - depth) * 0.5),
        filter: `blur(${depth * 5 + (1 - t) * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

const MiniStat: React.FC = () => (
  <div style={{width: 380, padding: '28px 30px', borderRadius: 24, background: d.card, border: `1.5px solid ${d.lineStrong}`, fontFamily: FONT}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 600, color: d.textSoft}}>
      <IWallet size={26} color={d.yellow} stroke={2} /> Offene Rechnungen
    </div>
    <div style={{marginTop: 14, fontSize: 52, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', ...tnum}}>8.222,67 €</div>
  </div>
);

const Bubble: React.FC = () => (
  <div
    style={{
      width: 420,
      padding: '22px 26px',
      borderRadius: 30,
      background: m.accent,
      color: m.accentInk,
      fontFamily: FONT,
      fontSize: 26,
      fontWeight: 500,
      lineHeight: 1.3,
    }}
  >
    Wohnzimmer 5 mal 4, 2,60 hoch, zwei Fenster …
  </div>
);

export const P01Intro: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  // synced to the voiceover: "Weniger Büro." f4 · "Mehr Baustelle!" f39 · "Das ist Kavox." f84
  const draw = prog(frame, 0, 26, ease.inOut);
  const fill = prog(frame, 80, 92, ease.out);
  const pulse = prog(frame, 82, 88, ease.out) * (1 - prog(frame, 88, 116, ease.soft));
  const kSize = 150;
  const kY = 520;
  const l1 = (i: number) => prog(frame, 3 + i * 9, 19 + i * 9, ease.out);
  const l2 = (i: number) => prog(frame, 37 + i * 10, 53 + i * 10, ease.out);
  const sub = prog(frame, 86, 100, ease.out);
  const streak = prog(frame, 0, 22, ease.inOut);
  const words1 = intro.line1.split(' ');
  const words2 = intro.line2.split(' ');

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* floating app fragments */}
      <Frag frame={frame} dur={dur} x={-40} y={300} depth={0.75} rot={-9} at={10}>
        <MiniStat />
      </Frag>
      <Frag frame={frame} dur={dur} x={760} y={430} depth={0.55} rot={7} at={14}>
        <div style={{transform: 'scale(3.2)', transformOrigin: '0 0'}}>
          <StatusPill status="Bezahlt" />
        </div>
      </Frag>
      <Frag frame={frame} dur={dur} x={750} y={1180} depth={0.85} rot={11} at={18}>
        <div style={{width: 595 * 0.62, height: 842 * 0.62, overflow: 'hidden', borderRadius: 6, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
          <div style={{zoom: 0.62}}>
            <PdfPage />
          </div>
        </div>
      </Frag>
      <Frag frame={frame} dur={dur} x={30} y={1430} depth={0.45} rot={-5} at={22}>
        <Bubble />
      </Frag>
      <Frag frame={frame} dur={dur} x={80} y={1180} depth={0.6} rot={-4} at={26}>
        <div style={{transform: 'scale(3)', transformOrigin: '0 0'}}>
          <StatusPill status="Überfällig" />
        </div>
      </Frag>
      <Frag frame={frame} dur={dur} x={640} y={1620} depth={0.35} rot={5} at={30}>
        <div
          style={{
            height: 92,
            padding: '0 36px',
            borderRadius: 20,
            background: d.accent,
            color: d.accentInk,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <IFilePdf size={34} color={d.accentInk} /> Angebot generieren
        </div>
      </Frag>
      <Frag frame={frame} dur={dur} x={790} y={760} depth={0.7} rot={-6} at={34}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderRadius: 20, background: d.card, border: `1.5px solid ${d.lineStrong}`}}>
          <DocThumb size={40} />
          <div style={{fontSize: 34, fontWeight: 700, color: '#fff', ...tnum}}>41,8 m²</div>
        </div>
      </Frag>

      <Whip frame={frame} dur={dur} noIn>
        {/* light streak */}
        <div
          style={{
            position: 'absolute',
            left: -200 + streak * 1480 - 300,
            top: kY - 2,
            width: 600,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${d.accent}, #fff, transparent)`,
            opacity: 1 - prog(frame, 16, 24),
            filter: 'blur(1px)',
            boxShadow: `0 0 24px ${d.accent}`,
          }}
        />
        {/* bloom behind the K */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 520,
            top: kY - 520,
            width: 1040,
            height: 1040,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(d.accent, 0.5 * pulse + 0.12 * fill)} 0%, ${rgba(d.accent, 0.1 * pulse)} 35%, transparent 65%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: kY,
            transform: `translate(-50%, -50%) scale(${1 + pulse * 0.06})`,
            filter: `drop-shadow(0 0 ${30 * fill}px ${rgba(d.accent, 0.6)})`,
          }}
        >
          <KMark size={kSize} color={d.accent} draw={draw} fill={fill} strokeWidth={3} />
        </div>

        <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center'}}>
          <div style={{fontSize: 116, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.02, color: '#fff'}}>
            {words1.map((w, i) => (
              <span key={i} style={{display: 'inline-block', marginRight: i < words1.length - 1 ? 30 : 0, ...rise(l1(i), 60, 14)}}>
                {w.replace('.', '')}
                {w.endsWith('.') ? <span style={{color: d.accent}}>.</span> : null}
              </span>
            ))}
          </div>
          <div
            style={{
              fontSize: 116,
              fontWeight: 800,
              letterSpacing: '-0.045em',
              lineHeight: 1.08,
              color: d.accent,
              textShadow: `0 0 60px ${rgba(d.accent, 0.35)}`,
            }}
          >
            {words2.map((w, i) => (
              <span key={i} style={{display: 'inline-block', marginRight: i < words2.length - 1 ? 30 : 0, ...rise(l2(i), 60, 14)}}>
                {w}
              </span>
            ))}
          </div>
          <div style={{marginTop: 46, fontSize: 38, fontWeight: 500, color: 'rgba(255,255,255,0.7)', ...rise(sub, 20, 6)}}>{intro.sub}</div>
        </div>
      </Whip>
      <CutFlash frame={frame} dur={dur} noIn />

      <S at={0} src="whoosh-soft.wav" vol={0.35} />
      <S at={60} src="riser.wav" vol={0.25} />
      <S at={84} src="impact.wav" vol={0.45} />
      <S at={86} src="shimmer.wav" vol={0.4} />
      <S at={36} src="whoosh-soft.wav" vol={0.6} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
