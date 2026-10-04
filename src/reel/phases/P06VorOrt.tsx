// P06 · Summe vor Ort + Unterschrift (phone): totals count up, the customer
// signs on the phone, a green check confirms it.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRUTTO, captions, MWST, NETTO} from '../copy';
import {FONT, m, rgba, tnum} from '../tokens';
import {eur} from '../../lib/format';
import {Caption, CutFlash, ease, keys, prog, Sparkles, Tap, UnderCaption, Whip} from '../kit/stage';
import {MButton, MCard, MSection, Phone, Screen} from '../kit/mobile';
import {ICheck, IPen} from '../kit/icons';
import {AufmassHeader} from './P05Aufmass';
import {CutWhoosh, S} from '../kit/sfx';

const K = 1.75;
const TOP = 650;
const T = {count: [6, 36] as const, tap: 42, sheet: [44, 60] as const, sign: [60, 92] as const, done: 96};

const SIGNATURE =
  'M14 82 C 22 30, 34 18, 42 62 S 54 96, 62 52 S 74 22, 82 64 S 96 90, 104 60 C 108 46, 116 46, 118 62 C 120 76, 128 76, 132 60 C 135 47, 140 46, 144 58 C 148 72, 154 74, 160 54 L 166 26 M154 48 L 180 45 C 182 62, 188 72, 198 60 C 206 50, 212 50, 214 62 C 216 74, 224 76, 232 58 C 236 50, 242 48, 248 56 C 252 62, 256 64, 262 56 M 34 98 C 100 106, 190 102, 286 88';

export const P06VorOrt: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const c = prog(frame, T.count[0], T.count[1], ease.out);
  const press = keys(frame, [[T.tap - 3, 0], [T.tap, 1], [T.tap + 6, 0]]);
  const sheet = prog(frame, T.sheet[0], T.sheet[1], ease.out);
  const sign = prog(frame, T.sign[0], T.sign[1], ease.inOut);
  const done = prog(frame, T.done, T.done + 12, ease.out);
  const ry = keys(frame, [[0, -10], [40, -3], [dur, 4]], ease.inOut);
  const btnY = TOP + (8 + 520 + 24) * K;
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <Phone cx={540} top={TOP} k={K} ry={ry} rx={4} glow={0.3}>
            <Screen>
              <AufmassHeader title="Wohnzimmer" />
              <div style={{position: 'absolute', left: 20, right: 20, top: 0}}>
                <MButton style={{position: 'absolute', left: 0, right: 0, top: 124, background: '#141416'}}>+ Weiterer Raum</MButton>
                <MSection no="03" title="Fotos" style={{position: 'absolute', left: 0, right: 0, top: 196}} />
                <div style={{position: 'absolute', left: 0, right: 0, top: 240, fontSize: 13.5, lineHeight: 1.4, color: m.muted}}>
                  Vorher-Fotos, Schäden, Anschlüsse – landen mit dem Aufmaß am Rechner.
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, top: 292, display: 'flex', gap: 10}}>
                  <MButton style={{flex: 1}}>Foto aufnehmen</MButton>
                  <MButton style={{flex: 1}}>Aus Fotos</MButton>
                </div>
                <MSection no="04" title="Summe vor Ort" right={eur(BRUTTO * c)} style={{position: 'absolute', left: 0, right: 0, top: 364}} />
                <MCard style={{position: 'absolute', left: 0, right: 0, top: 404, padding: '16px 16px 14px', ...tnum}}>
                  <div style={{display: 'flex', fontSize: 15.5, color: m.textSoft}}>
                    Netto <span style={{flex: 1}} /> <b style={{color: '#fff'}}>{eur(NETTO * c)}</b>
                  </div>
                  <div style={{display: 'flex', fontSize: 15.5, color: m.textSoft, marginTop: 8}}>
                    MwSt 19 % <span style={{flex: 1}} /> <b style={{color: '#fff'}}>{eur(MWST * c)}</b>
                  </div>
                  <div style={{height: 1, background: m.line, margin: '13px 0 10px'}} />
                  <div style={{display: 'flex', alignItems: 'baseline', fontSize: 16, fontWeight: 800}}>
                    Brutto <span style={{flex: 1}} /> <span style={{fontSize: 27, letterSpacing: '-0.02em'}}>{eur(BRUTTO * c)}</span>
                  </div>
                </MCard>
                <MButton primary press={press} glow={prog(frame, T.tap - 12, T.tap - 2) * (1 - sheet)} style={{position: 'absolute', left: 0, right: 0, top: 528}}>
                  Kunde unterschreibt vor Ort
                </MButton>
                <MSection no="05" title="Notiz vom Termin" style={{position: 'absolute', left: 0, right: 0, top: 604}} />
              </div>

              {/* signature sheet */}
              <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.55 * sheet})`}} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 290 + (1 - sheet) * 560,
                  bottom: 0,
                  borderRadius: '28px 28px 0 0',
                  background: '#141416',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  padding: '12px 20px',
                }}
              >
                <div style={{width: 44, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)', margin: '0 auto'}} />
                <div style={{marginTop: 18, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 800}}>
                  <IPen size={20} color={m.accent} stroke={2.2} /> Unterschrift
                </div>
                <div style={{marginTop: 8, fontSize: 13.5, lineHeight: 1.4, color: m.muted}}>
                  Familie Muster bestätigt das Angebot über <b style={{color: '#fff'}}>{eur(BRUTTO)}</b> brutto.
                </div>
                <div
                  style={{
                    marginTop: 16,
                    height: 168,
                    borderRadius: 16,
                    background: '#0B0B0C',
                    border: `1.5px dashed ${done > 0 ? rgba(m.green, 0.6) : 'rgba(255,255,255,0.18)'}`,
                    position: 'relative',
                  }}
                >
                  <div style={{position: 'absolute', left: 18, right: 18, bottom: 34, height: 1, background: 'rgba(255,255,255,0.18)'}} />
                  <div style={{position: 'absolute', left: 18, bottom: 40, fontSize: 18, color: m.muted}}>×</div>
                  <svg width={310} height={130} viewBox="0 0 300 120" style={{position: 'absolute', left: 20, top: 14}}>
                    <path
                      d={SIGNATURE}
                      fill="none"
                      stroke="#fff"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray="1 1"
                      strokeDashoffset={1 - sign}
                    />
                  </svg>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    height: 50,
                    borderRadius: 13,
                    background: done > 0 ? mixGreen(done) : m.accent,
                    color: done > 0.5 ? '#04241A' : m.accentInk,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 16,
                    fontWeight: 800,
                    boxShadow: done > 0 ? `0 0 ${36 * done}px ${rgba(m.green, 0.5)}` : undefined,
                  }}
                >
                  {done > 0.5 ? (
                    <>
                      <ICheck size={18} color="#04241A" stroke={3} /> Unterschrieben · 04.10.2026
                    </>
                  ) : (
                    'Bestätigen'
                  )}
                </div>
              </div>
            </Screen>
          </Phone>
          <Tap frame={frame} at={T.tap} x={540} y={btnY} color={m.accent} />
          <Sparkles frame={frame} at={T.done + 2} x={540} y={TOP + (8 + 290 + 316) * K} color={m.green} r={200} n={10} />
        </UnderCaption>
      </Whip>
      <Caption c={captions.vorOrt} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={T.tap} src="click.wav" vol={0.7} />
      <S at={T.sheet[0]} src="whoosh-soft.wav" vol={0.5} />
      <S at={T.sign[0]} src="whoosh-a.wav" vol={0.18} />
      <S at={T.done} src="shimmer.wav" vol={0.55} />
      <S at={T.done} src="click.wav" vol={0.5} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};

const mixGreen = (t: number) => `rgba(${Math.round(121 + (52 - 121) * t)},${Math.round(194 + (211 - 194) * t)},${Math.round(227 + (153 - 227) * t)},1)`;
