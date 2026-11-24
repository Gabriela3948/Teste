import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {Captions} from '../common/Captions';
import {C} from '../common/brand';
import {LightFlash, Sfx} from '../common/Fx';
import {Wipe} from '../p4/Stage';
import {CL, RiseIn} from './Kit';
import {S1_CUE, S2_CUE, S3_CUE, Scene1, Scene2, Scene3} from './ScenesA';
import {S4B_CUE, S4_CUE, S5_CUE, Scene4, Scene4B, Scene5} from './ScenesB';
import {END, ENDLEN, NARR0, OVER, S2, S3, S4, S4B, S5, TOTAL} from './timing';
import {WORDS} from './words';

const every = (from: number, to: number, step: number) => Array.from({length: Math.max(0, Math.floor((to - from) / step) + 1)}, (_, k) => from + k * step);

// "E a migracao?": video inteiro em motion, com narracao
export const ReelMigracao: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 30, TOTAL], [0, 0.16, 0.16, 0], CL);
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Sequence durationInFrames={S2 + OVER}><Scene1 /></Sequence>
      <Sequence from={S2} durationInFrames={S3 - S2 + OVER}><Wipe><Scene2 /></Wipe></Sequence>
      <Sequence from={S3} durationInFrames={S4 - S3 + OVER}><RiseIn><Scene3 /></RiseIn></Sequence>
      <Sequence from={S4} durationInFrames={S4B - S4 + OVER}><Wipe><Scene4 /></Wipe></Sequence>
      <Sequence from={S4B} durationInFrames={S5 - S4B + OVER}><Wipe><Scene4B /></Wipe></Sequence>
      <Sequence from={S5} durationInFrames={END - S5 + 8}><RiseIn><Scene5 /></RiseIn></Sequence>

      <Sequence from={NARR0}><Audio src={staticFile('p5/narr.mp3')} /></Sequence>
      <Captions words={WORDS} end={END} light={[[S2 + 3, S3 + 1], [S4 + 3, S4B + 3], [S5 + 1, END]]} />

      <LightFlash at={END} />
      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>

      {/* efeitos sonoros */}
      {S1_CUE.rows.map((c) => <Sfx key={`r${c}`} at={c} name="pop" vol={0.4} />)}
      <Sfx at={S1_CUE.merge - 2} name="whoosh" vol={0.28} />
      <Sfx at={S1_CUE.grow - 2} name="whoosh" vol={0.36} />
      <Sfx at={S1_CUE.grow + 8} name="pop" vol={0.4} />
      <Sfx at={S1_CUE.hl} name="ping" vol={0.34} />

      <Sfx at={S2 - 3} name="whoosh" vol={0.4} />
      <Sfx at={S2 + S2_CUE.tag} name="pop" vol={0.32} />
      {S2_CUE.blocks.map((c) => <Sfx key={`b${c}`} at={S2 + c} name="pop" vol={0.44} />)}
      <Sfx at={S2 + S2_CUE.blocks[2] + 9} name="thud" vol={0.3} />

      <Sfx at={S3 - 3} name="whoosh" vol={0.4} />
      <Sfx at={S3 + S3_CUE.hit} name="thud" vol={0.5} />
      {[0, 1, 2, 3, 4, 5].map((k) => <Sfx key={`m${k}`} at={S3 + S3_CUE.sweep + k * 5} name="tick" vol={0.34} />)}
      <Sfx at={S3 + S3_CUE.cardA} name="pop" vol={0.38} />
      <Sfx at={S3 + S3_CUE.cardB} name="pop" vol={0.38} />
      <Sfx at={S3 + S3_CUE.cancel} name="powerdown" vol={0.26} />

      <Sfx at={S4 - 3} name="whoosh" vol={0.4} />
      {S4_CUE.team.map((c) => <Sfx key={`t${c}`} at={S4 + c} name="pop" vol={0.34} />)}
      {S4_CUE.check.map((c) => <Sfx key={`c${c}`} at={S4 + c} name="tick" vol={0.5} />)}
      <Sfx at={S4 + S4_CUE.check[2] + 2} name="chime" vol={0.34} />

      <Sfx at={S4B - 3} name="whoosh" vol={0.4} />
      {every(S4B + S4B_CUE.count, S4B + S4B_CUE.done - 3, 3).map((c) => <Sfx key={`n${c}`} at={c} name="tick" vol={0.26} />)}
      <Sfx at={S4B + S4B_CUE.done} name="thud" vol={0.45} />
      <Sfx at={S4B + S4B_CUE.done + 2} name="chime" vol={0.34} />
      <Sfx at={S4B + S4B_CUE.chip} name="pop" vol={0.38} />

      <Sfx at={S5 - 3} name="whoosh" vol={0.4} />
      <Sfx at={S5 + S5_CUE.card} name="whoosh" vol={0.26} />
      <Sfx at={S5 + S5_CUE.pill} name="pop" vol={0.55} />
      {every(S5 + S5_CUE.type, S5 + S5_CUE.sent - 6, 4).map((c) => <Sfx key={`k${c}`} at={c} name="tick" vol={0.24} />)}
      <Sfx at={S5 + S5_CUE.sent} name="pop" vol={0.36} />
      <Sfx at={S5 + S5_CUE.reply} name="ping" vol={0.38} />
      <Sfx at={END - 6} name="whoosh" vol={0.42} />

      <Audio src={staticFile('p5/music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
