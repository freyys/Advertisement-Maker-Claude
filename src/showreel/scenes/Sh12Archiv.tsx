import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {EASE, EASE_CAM} from '../theme';
import {beat} from '../timeline';
import {D04, D08, IMG, Rect} from '../assets';
import {mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Display} from '../components/Display';
import {Highlight} from '../components/Screen';
import {Headline} from '../components/Headline';
import {Callout} from '../components/Callout';
import {LightSweep} from '../components/Fx';

// 1:05 – Split screen: the document archive (with the invoice ledger as
// Excel) next to the analytics, where 13.834,00 € counts up.

const LEFT: Rect = {x: 720, y: 130, w: 2016, h: 907};
const RIGHT: Rect = {x: 720, y: 130, w: 2016, h: 878};
const UMSATZ = 13834;

export const Sh12Archiv: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tL = beat('archiv', 'left');
  const tR = beat('archiv', 'right');
  const tCount = beat('archiv', 'count');
  const tCountEnd = beat('archiv', 'countEnd');
  const tZahl = beat('archiv', 'zahldauer');
  const tExcel = beat('archiv', 'excel');
  const tGriff = beat('archiv', 'griff');
  const cam = prog(f, 0, dur, EASE_CAM);
  const inL = prog(f, tL, tL + 22, EASE);
  const inR = prog(f, tR, tR + 22, EASE);

  const pw = v ? 980 : 880;
  const lh = (pw / LEFT.w) * LEFT.h;
  const rh = (pw / RIGHT.w) * RIGHT.h;

  const left = (
    <Display img={IMG.d04} view={LEFT} w={pw} h={lh} radius={24}>
      <Highlight rect={D04.excel} t={prog(f, tExcel, tExcel + 8)} radius={26} pad={4} />
      <div style={{position: 'absolute', left: D04.excel.x, top: D04.excel.y, width: D04.excel.w, height: D04.excel.h, overflow: 'hidden', borderRadius: 26}}>
        <LightSweep t={prog(f, tExcel + 2, tExcel + 26, EASE_CAM)} strength={0.25} />
      </div>
      <Highlight rect={D04.summary} t={prog(f, tCount, tCount + 8) * (1 - prog(f, tExcel - 6, tExcel))} radius={10} pad={6} />
    </Display>
  );
  const right = (
    <Display img={IMG.d08} view={RIGHT} w={pw} h={rh} radius={24}>
      <Highlight rect={D08.umsatz} t={prog(f, tCount, tCount + 8) * (1 - prog(f, tZahl, tZahl + 8))} radius={30} pad={4} />
      <Highlight rect={D08.zahldauer} t={prog(f, tZahl, tZahl + 8) * (1 - prog(f, tExcel + 10, tExcel + 18))} radius={30} pad={4} />
    </Display>
  );

  const headline = (size: number, text: string) => (
    <Headline text={text} at={4} size={size} wordAt={[4, tExcel - 4, tGriff, tGriff + 4]} />
  );

  if (v) {
    return (
      <AbsoluteFill>
        <Stage glowX={0.5} glowY={0.55} />
        <Camera>
          <Plane w={pw} h={lh} y={-270 + (1 - inL) * 0} x={(1 - inL) * -1200} z={cam * 40} rx={6} ry={mix(10, 6, inL)}>
            {left}
          </Plane>
          <Plane w={pw} h={rh} y={205} x={(1 - inR) * 1200} z={cam * 40} rx={6} ry={mix(-10, -6, inR)}>
            {right}
          </Plane>
        </Camera>
        <div style={{position: 'absolute', left: 70, top: 220}}>{headline(84, 'Alles. Sauber.\nIm Griff.')}</div>
        <div style={{position: 'absolute', right: 60, top: 1390}}>
          <Callout label="UMSATZ NETTO · LETZTE 12 MONATE" value={UMSATZ} at={tCount} countFrom={tCount + 2} countTo={tCountEnd} size={62} />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Stage glowX={0.5} glowY={0.55} />
      <Camera perspective={2400}>
        <Plane w={pw} h={lh} x={-470 + (1 - inL) * -1300} y={70} z={cam * 60} rx={6} ry={mix(20, 11, inL)}>
          {left}
        </Plane>
        <Plane w={pw} h={rh} x={470 + (1 - inR) * 1300} y={64} z={cam * 60} rx={6} ry={mix(-20, -11, inR)}>
          {right}
        </Plane>
      </Camera>
      <div style={{position: 'absolute', left: 120, top: 96}}>{headline(96, 'Alles. Sauber. Im Griff.')}</div>
      <div style={{position: 'absolute', right: 110, top: 820}}>
        <Callout label="UMSATZ NETTO · LETZTE 12 MONATE" value={UMSATZ} at={tCount} countFrom={tCount + 2} countTo={tCountEnd} size={78} sub="11 Rechnungen · Zahldauer 11 Tage" />
      </div>
    </AbsoluteFill>
  );
};
