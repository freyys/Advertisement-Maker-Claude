// The generated Angebot PDF (A4, 595 × 842 pt), rebuilt from the app's real
// output: blue table header, light-blue title rows, tricolour corner stripes.
import React from 'react';
import {pdf, PDF_FONT, tnum} from '../tokens';
import {de} from '../../lib/format';
import {doc} from '../copy';

export const A4W = 595;
export const A4H = 842;

const COLS = [0.119, 0.329, 0.103, 0.103, 0.173, 0.173];
const ROW_H = [62, 37, 45, 62, 70];
const TX = 83;
const TW = 432;

const Stripes: React.FC<{corner: 'tr' | 'bl'}> = ({corner}) => {
  // three parallel diagonals (blue, green, red), clipped by the page edge
  const cols = [pdf.stripeBlue, pdf.green, pdf.red];
  const w = 4.6;
  return (
    <svg
      width={A4W}
      height={A4H}
      viewBox={`0 0 ${A4W} ${A4H}`}
      style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
    >
      {cols.map((c, i) => {
        const o = i * 8.5;
        if (corner === 'tr') {
          // runs from the top edge down to the right edge
          const x0 = 488 + o;
          return <line key={i} x1={x0} y1={-2} x2={A4W + 2} y2={A4W + 2 - x0 - 4} stroke={c} strokeWidth={w} />;
        }
        const y0 = 728 + i * 8.5;
        return <line key={i} x1={-2} y1={y0} x2={A4H - y0 + 2} y2={A4H + 2} stroke={cols[2 - i]} strokeWidth={w} />;
      })}
    </svg>
  );
};

/**
 * `rows` 0…5 reveals table rows progressively (fractional = fading in),
 * `sub` 0…1 the subtotal, `head` 0…1 the letterhead/addresses.
 */
export const PdfPage: React.FC<{rows?: number; sub?: number; head?: number; highlight?: number; style?: React.CSSProperties}> = ({
  rows = 5,
  sub = 1,
  head = 1,
  highlight = -1,
  style,
}) => {
  const xs = COLS.reduce<number[]>((acc, c, i) => [...acc, (acc[i] ?? 0) + c * TW], [0]);
  const cell = (i: number): React.CSSProperties => ({
    position: 'absolute',
    left: xs[i],
    width: COLS[i] * TW,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderLeft: i > 0 ? '0.9px solid #111' : undefined,
  });
  let y = 336 + 27 + 29;
  return (
    <div
      style={{
        width: A4W,
        height: A4H,
        position: 'relative',
        background: '#fff',
        color: pdf.ink,
        fontFamily: PDF_FONT,
        overflow: 'hidden',
        ...style,
      }}
    >
      <Stripes corner="tr" />
      <Stripes corner="bl" />
      <div style={{opacity: head}}>
        <div style={{position: 'absolute', left: TX, top: 84, fontSize: 12.6, fontWeight: 700}}>{doc.company}</div>
        <div style={{position: 'absolute', right: 595 - 487, top: 88, fontSize: 9.6, lineHeight: '12.2px', textAlign: 'right'}}>
          <div>
            <b>Angebot Nr.:</b> {doc.number}
          </div>
          <div>
            <b>Datum:</b> {doc.date}
          </div>
          <div>
            <b>Gültig bis:</b> {doc.valid}
          </div>
        </div>
        <div style={{position: 'absolute', left: TX, top: 149, fontSize: 6.1, color: pdf.grey}}>{doc.sender}</div>
        <div style={{position: 'absolute', left: TX, top: 163, fontSize: 7.9, lineHeight: '10.2px'}}>
          {doc.to.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div style={{position: 'absolute', left: TX, top: 228, fontSize: 12.2, fontWeight: 700}}>Angebot Nr. {doc.number}</div>
        <div style={{position: 'absolute', left: TX, top: 248, fontSize: 6.6, lineHeight: '8.8px'}}>
          {doc.greeting.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{position: 'absolute', left: TX, top: 336, width: TW, borderRight: '0.9px solid #111', borderLeft: '0.9px solid #111'}}>
        <div style={{position: 'relative', height: 27, background: pdf.blue, color: '#fff', fontSize: 6.8}}>
          {['Pos.', 'Bezeichnung', 'Menge', 'Einh.', 'Einzelpreis', 'Gesamtpreis'].map((h, i) => (
            <div key={h} style={cell(i)}>
              {h}
            </div>
          ))}
        </div>
        <div style={{height: 29, background: pdf.blueLight, display: 'flex', alignItems: 'center', paddingLeft: 4, fontSize: 8, fontWeight: 700}}>
          {doc.title1}
        </div>
        {doc.rows.map((r, i) => {
          const t = Math.max(0, Math.min(1, rows - i));
          const h = ROW_H[i];
          const top = y;
          y += h;
          if (t <= 0) return <div key={r.pos} style={{height: h, borderTop: '0.6px solid #888'}} />;
          return (
            <div
              key={r.pos}
              style={{
                position: 'relative',
                height: h,
                borderTop: '0.6px solid #888',
                fontSize: 6.2,
                opacity: t,
                background: highlight === i ? 'rgba(0,147,217,0.10)' : undefined,
                transform: `translateY(${(1 - t) * 6}px)`,
                ...tnum,
              }}
              data-top={top}
            >
              <div style={cell(0)}>{r.pos}</div>
              <div style={{...cell(1), flexDirection: 'column', padding: '0 5px'}}>
                <div style={{fontSize: 6.6, marginBottom: 2}}>{r.name}</div>
                <div style={{fontSize: 5.2, lineHeight: '6.6px', color: '#3A3A3A'}}>{r.desc}</div>
              </div>
              <div style={cell(2)}>{r.qty}</div>
              <div style={cell(3)}>{r.unit}</div>
              <div style={cell(4)}>{r.price}</div>
              <div style={cell(5)}>{de(r.total)} €</div>
            </div>
          );
        })}
        <div style={{position: 'relative', height: 30, borderTop: '0.6px solid #888', opacity: sub, fontSize: 7.2, fontWeight: 700, ...tnum}}>
          <div style={{...cell(1), left: xs[1], width: TW * (COLS[1] + COLS[2] + COLS[3] + COLS[4]), justifyContent: 'flex-end', paddingRight: 4}}>
            Zwischensumme Wohnzimmer
          </div>
          <div style={{...cell(5), justifyContent: 'flex-end', paddingRight: 4}}>{de(doc.subtotal)} €</div>
        </div>
        <div
          style={{
            height: 29,
            background: pdf.blueLight,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 4,
            fontSize: 8,
            fontWeight: 700,
            borderTop: '0.6px solid #888',
            borderBottom: '0.9px solid #111',
            opacity: sub,
          }}
        >
          {doc.title2}
        </div>
      </div>

      <div style={{position: 'absolute', left: 14, top: 802, fontSize: 6.2, lineHeight: '8.6px', color: pdf.grey, opacity: head}}>
        {doc.footer.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 18, top: 810.6, fontSize: 6.2, color: pdf.grey, opacity: head}}>Seite 1 von 2</div>
    </div>
  );
};
