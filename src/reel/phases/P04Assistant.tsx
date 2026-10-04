// P04 · KI-Assistent (phone): the job is dictated, sent, and Kavox answers
// with a priced "Entwurf zum Prüfen" built from the user's own catalog.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions, dictation, NETTO, positions, reply} from '../copy';
import {m, rgba, tnum} from '../tokens';
import {de, eur} from '../../lib/format';
import {Caption, clamp01, CutFlash, ease, keys, prog, Tap, UnderCaption, Whip} from '../kit/stage';
import {MButton, MPill, MTitle, Phone, PW, Screen} from '../kit/mobile';
import {IArrowUp, IMic} from '../kit/icons';
import {CutWhoosh, S, Ticks} from '../kit/sfx';

const K = 1.9;
const T = {dictate: [12, 70] as const, send: 74, typing: 96, reply: [106, 128] as const, card: 120, rows: 128, netto: [140, 166] as const, scroll: [146, 166] as const, tap: 168};

const words = dictation.split(' ');
const replyWords = reply.split(' ');

const Words: React.FC<{list: string[]; n: number}> = ({list, n}) => (
  <>
    {list.map((w, i) => (
      <span key={i} style={{opacity: clamp01(n - i), filter: n - i < 1 ? `blur(${(1 - clamp01(n - i)) * 3}px)` : undefined}}>
        {w}{' '}
      </span>
    ))}
  </>
);

const Toggle: React.FC = () => (
  <div style={{width: 46, height: 28, borderRadius: 14, background: m.accent, position: 'relative'}}>
    <div style={{position: 'absolute', right: 3, top: 3, width: 22, height: 22, borderRadius: 11, background: '#439288'}} />
  </div>
);

const AssistantScreen: React.FC<{frame: number}> = ({frame}) => {
  const nWords = keys(frame, [[T.dictate[0], 0], [T.dictate[1], words.length]], ease.soft);
  const sent = frame >= T.send;
  const bubble = prog(frame, T.send, T.send + 14, ease.out);
  const typing = prog(frame, T.typing, T.typing + 6) * (1 - prog(frame, T.reply[0], T.reply[0] + 4));
  const nReply = keys(frame, [[T.reply[0], 0], [T.reply[1], replyWords.length]], ease.soft);
  const card = prog(frame, T.card, T.card + 18, ease.out);
  const row = (i: number) => prog(frame, T.rows + i * 5, T.rows + i * 5 + 12, ease.out);
  const netto = NETTO * prog(frame, T.netto[0], T.netto[1], ease.out);
  const scroll = 196 * prog(frame, T.scroll[0], T.scroll[1], ease.inOut);
  const press = keys(frame, [[T.tap - 3, 0], [T.tap, 1], [T.tap + 6, 0]]);
  const btnGlow = prog(frame, T.tap - 10, T.tap - 2) * (1 - prog(frame, T.tap + 4, T.tap + 12));
  const mic = !sent && frame >= T.dictate[0] - 4;
  const inLines = sent ? 1 : Math.min(4, Math.max(1, Math.ceil((nWords / words.length) * 4.4)));
  const inH = sent ? 62 : 30 + inLines * 20;
  const listen = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.7 + i * 1.9) * Math.cos(frame * 0.29 + i));

  return (
    <Screen>
      <div style={{position: 'absolute', left: 0, top: -scroll, width: PW}}>
        <div style={{position: 'absolute', left: 20, top: 60}}>
          <MPill>KI · Assistent</MPill>
        </div>
        <div style={{position: 'absolute', left: 20, top: 102}}>
          <MTitle size={32}>Assistent</MTitle>
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 152, display: 'flex', alignItems: 'center', fontSize: 14, color: m.textSoft}}>
          Antworten vorlesen <span style={{flex: 1}} /> <Toggle />
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 194, height: 1, background: m.line}} />

        {/* user bubble */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 212,
            width: 306,
            padding: '13px 17px',
            borderRadius: 24,
            background: m.accent,
            color: m.accentInk,
            fontSize: 14.6,
            lineHeight: 1.38,
            fontWeight: 500,
            opacity: bubble,
            transform: `translateY(${(1 - bubble) * 60}px) scale(${0.9 + bubble * 0.1})`,
            transformOrigin: '100% 100%',
          }}
        >
          {dictation}
        </div>

        {/* typing dots */}
        {typing > 0 ? (
          <div style={{position: 'absolute', left: 20, top: 340, padding: '16px 18px', borderRadius: 22, background: m.card, border: `1px solid ${m.line}`, display: 'flex', gap: 6, opacity: typing}}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{width: 8, height: 8, borderRadius: 4, background: m.muted, opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.3 - i * 0.8))}} />
            ))}
          </div>
        ) : null}

        {/* reply */}
        {frame >= T.reply[0] ? (
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 340,
              width: 306,
              padding: '13px 17px',
              borderRadius: 24,
              background: m.card,
              border: `1px solid ${m.line}`,
              fontSize: 14.6,
              lineHeight: 1.38,
              fontWeight: 500,
              color: '#fff',
            }}
          >
            <Words list={replyWords} n={nReply} />
          </div>
        ) : null}

        {/* draft card */}
        {card > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 470,
              borderRadius: 20,
              border: `1.5px solid ${rgba(m.accent, 0.85)}`,
              background: '#0E0E10',
              padding: '22px 19px 19px',
              opacity: card,
              transform: `translateY(${(1 - card) * 40}px)`,
              boxShadow: `0 0 ${40 * card}px ${rgba(m.accent, 0.15)}`,
            }}
          >
            <div style={{fontSize: 12.5, fontWeight: 800, letterSpacing: '0.13em', color: m.accent}}>ENTWURF ZUM PRÜFEN</div>
            <div style={{marginTop: 12, fontSize: 18, fontWeight: 800, color: '#fff'}}>Familie Muster</div>
            <div style={{marginTop: 16, fontSize: 15, fontWeight: 700, color: '#fff'}}>Wohnzimmer</div>
            {positions.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  marginTop: 5,
                  fontSize: 14.6,
                  color: m.textSoft,
                  opacity: row(i),
                  transform: `translateX(${(1 - row(i)) * -16}px)`,
                  ...tnum,
                }}
              >
                {p.name}
                <span style={{flex: 1}} />
                <span style={{color: m.textSoft}}>{de(p.qty, p.qty % 1 ? 1 : 0)} m²</span>
              </div>
            ))}
            <div style={{marginTop: 16, fontSize: 16.5, fontWeight: 800, color: '#fff', ...tnum}}>Netto laut Katalog: {eur(netto)}</div>
            <div style={{marginTop: 10, fontSize: 12.6, lineHeight: 1.4, color: m.muted}}>
              Mengen rechnet Kavox aus den Raummaßen, Preise kommen aus deinem Katalog. Ändern kannst du alles im nächsten Schritt – oder sag es mir einfach („Decke weg“, „Bad dazu“).
            </div>
            <MButton primary press={press} glow={btnGlow} style={{marginTop: 16}}>
              Prüfen & als Aufmaß übernehmen
            </MButton>
            <MButton style={{marginTop: 10}}>Verwerfen</MButton>
          </div>
        ) : null}
      </div>

      {/* empty-state hint + suggestions above the input (gone once sent) */}
      {!sent ? (
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 26 + inH + 16, opacity: 1 - prog(frame, T.send - 6, T.send)}}>
          <div style={{fontSize: 13.5, lineHeight: 1.45, color: m.muted, marginBottom: 12, padding: '0 4px'}}>
            Sag einfach, was gemacht werden soll – Räume, Maße, Arbeiten. Kavox rechnet mit deinem Katalog.
          </div>
          {['„Bad 3 × 2, Fliesen raus“', '„Flur streichen, 2,50 hoch“', '„Fassade 120 m², Silikatfarbe“'].map((s, i) => (
            <div
              key={s}
              style={{
                display: 'inline-flex',
                marginRight: 8,
                marginTop: 8,
                height: 34,
                padding: '0 14px',
                alignItems: 'center',
                borderRadius: 17,
                border: `1px solid ${rgba(m.accent, 0.35)}`,
                background: rgba(m.accent, 0.08),
                color: m.textSoft,
                fontSize: 13.5,
                opacity: prog(frame, 2 + i * 4, 14 + i * 4),
              }}
            >
              {s}
            </div>
          ))}
        </div>
      ) : null}

      {/* input bar */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, #0A0A0A 30%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 16,
          width: 300,
          bottom: 26,
          height: inH,
          borderRadius: 24,
          background: m.field,
          border: `1.5px solid ${mic ? rgba(m.accent, 0.7) : 'rgba(255,255,255,0.12)'}`,
          padding: '13px 16px',
          fontSize: 14.6,
          lineHeight: 1.37,
          color: '#fff',
          overflow: 'hidden',
          boxShadow: mic ? `0 0 24px ${rgba(m.accent, 0.25)}` : undefined,
        }}
      >
        {sent ? (
          <span style={{color: m.muted}}>Ändern? z. B. „Bad 3 × 2 dazu“</span>
        ) : frame < T.dictate[0] ? (
          <span style={{color: m.muted}}>Sag mir, was gemacht werden soll …</span>
        ) : (
          <div style={{position: 'absolute', left: 16, right: 16, bottom: 13}}>
            <Words list={words} n={nWords} />
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 30,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: mic ? m.accent : m.accentDeep,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          boxShadow: mic ? `0 0 0 ${6 + listen(0) * 8}px ${rgba(m.accent, 0.18)}` : undefined,
        }}
      >
        {mic ? (
          frame < T.dictate[1] ? (
            [0, 1, 2, 3, 4].map((i) => <span key={i} style={{width: 3.5, height: 6 + listen(i) * 20, borderRadius: 2, background: m.accentInk}} />)
          ) : (
            <IArrowUp size={22} color={m.accentInk} stroke={2.6} />
          )
        ) : (
          sent ? <IArrowUp size={22} color={m.accentInk} stroke={2.6} /> : <IMic size={22} color={m.accentInk} />
        )}
      </div>
    </Screen>
  );
};

export const P04Assistant: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  // phone "camera": show the input while dictating, then glide down to the chat
  const top = keys(frame, [[0, -40], [T.send, -110], [T.send + 26, 560]], ease.inOut);
  const ry = keys(frame, [[0, -8], [40, -3], [T.send + 26, 4], [dur, 0]], ease.inOut);
  const tapY = top + (8 + 470 + 22 + 12 + 18 + 16 + 15 + positions.length * 26 + 16 + 20 + 10 + 68 + 16 + 24 - 196) * K;
  return (
    <AbsoluteFill>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={500}>
          <Phone cx={540} top={top} k={K} ry={ry} glow={0.4}>
            <AssistantScreen frame={frame} />
          </Phone>
          <Tap frame={frame} at={T.tap} x={540} y={tapY} color={m.accent} />
        </UnderCaption>
      </Whip>
      <Caption c={captions.assistant} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <Ticks from={T.dictate[0]} to={T.dictate[1]} n={words.length} vol={0.32} />
      <S at={T.send} src="click.wav" vol={0.7} />
      <S at={T.send - 2} src="whoosh-soft.wav" vol={0.6} />
      <Ticks from={T.reply[0]} to={T.reply[1]} n={8} vol={0.22} />
      <S at={T.card} src="whoosh-soft.wav" vol={0.45} />
      <S at={T.netto[1] - 8} src="shimmer.wav" vol={0.4} />
      <S at={T.tap} src="click.wav" vol={0.7} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
