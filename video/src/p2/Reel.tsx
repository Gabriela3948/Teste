import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {Scene} from './Scene';
import {CONNECT, GESTOR, TRACKING} from './brand';
import {CUES, Elements, LightFlash} from './Elements';
import {A2, END, ENDLEN, L1, L2, L3, S2, S3, TOTAL} from './timing';

const f = (s: number) => Math.round(s * 30);
const g2 = (src: number) => S2 + f(src - A2);

// posicao do rosto no material bruto e onde ele deve ficar na tela (centralizado)
const FACE = {x: 0.54, y: 0.535};
const TARGET = {x: 0.5, y: 0.35};

// movimento de camera por pontos-chave: [frame local, escala, altura do rosto na tela]
type KF = [number, number, number][];
const E = {easing: Easing.inOut(Easing.sin), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const cam = (frame: number, kf: KF) => ({
  s: interpolate(frame, kf.map((k) => k[0]), kf.map((k) => k[1]), E),
  y: interpolate(frame, kf.map((k) => k[0]), kf.map((k) => k[2]), E),
});

const Talk: React.FC<{src: string; kf: KF; offset: number}> = ({src, kf, offset}) => {
  const frame = useCurrentFrame();
  const g = frame + offset;
  const {s, y} = cam(frame, kf);
  const hit = g - (CUES.REWORK + 6);
  const shake = hit >= 0 && hit < 9 ? Math.sin(hit * 2.6) * (9 - hit) * 1.6 : 0;
  const drift = Math.sin(g / 47) * 10;
  const tx = 1080 * (TARGET.x - s * FACE.x) + shake + drift;
  const ty = 1920 * (y - s * FACE.y) + shake * 0.6;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}} />
    </AbsoluteFill>
  );
};

const HI = 0.35, LO = 0.575; // rosto no alto (close) / mais baixo (abre espaco para o painel)
const PN = CUES.panel, B = CUES.BREAK, R = CUES.REWORK + 6;
const KF1: KF = [[0, 1.88, HI], [96, 2.32, HI], [PN - 10, 2.34, HI], [PN + 20, 1.72, LO], [B - 6, 1.86, LO], [B + 9, 2.02, LO], [R - 3, 1.94, LO], [R + 5, 2.12, LO], [L1, 2.04, LO]];
const o2 = CUES.ONE - S2, e2 = g2(14.6) - S2;
const KF2: KF = [[0, 1.76, LO], [o2 + 2, 1.86, LO], [o2 + 22, 2.36, HI], [e2 - 1, 2.36, HI], [e2, 1.92, HI], [CUES.one2 - S2 - 4, 2.08, HI], [CUES.one2 - S2 + 8, 2.4, HI], [L2, 2.44, HI]];
const u3 = CUES.unite - S3, l3 = CUES.link - S3;
const KF3: KF = [[0, 1.9, HI], [u3 - 6, 2.15, HI], [u3 + 8, 2.42, HI], [l3 - 22, 2.05, HI], [l3 - 4, 2.08, HI], [l3 + 8, 2.46, HI], [L3, 2.4, HI]];

const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.5}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60}><Audio src={staticFile(`p2/sfx/${name}.mp3`)} volume={vol} /></Sequence>
);

export const ReelPlataforma: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 30, TOTAL], [0, 0.16, 0.16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gA = g2(5.5), gB = g2(7.95), gC = g2(10.95), gD = g2(14.6);
  const X = 12;
  return (
    <AbsoluteFill style={{background: '#141F52'}}>
      <Sequence durationInFrames={L1}><Talk src="p2/t1.mp4" kf={KF1} offset={0} /></Sequence>
      <Sequence from={S2} durationInFrames={L2}><Talk src="p2/t2.mp4" kf={KF2} offset={S2} /></Sequence>
      <Sequence from={S3} durationInFrames={L3}><Talk src="p2/t3.mp4" kf={KF3} offset={S3} /></Sequence>

      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(6,12,40,.5) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,14,44,.6) 0%, rgba(8,14,44,.3) 16%, rgba(8,14,44,0) 27%)'}} />

      <Elements />

      <Sequence from={gA} durationInFrames={gB - gA + X}><Scene dark={GESTOR.dark} accent={GESTOR.accent} logo="p2/lg_gestor.png" mock="p2/m_gestor.png" mockW={1900} mockX={-430} mockY={585} tilt={-7} dur={gB - gA + X}
        chips={[{text: 'Financeiro', at: g2(6.4) - gA}, {text: 'Clientes', at: g2(7.15) - gA}]} /></Sequence>
      <Sequence from={gB} durationInFrames={gC - gB + X}><Scene dark={TRACKING.dark} accent={TRACKING.accent} logo="p2/lg_tracking.png" mock="p2/m_tracking.png" mockW={1800} mockX={-370} mockY={640} tilt={6} dur={gC - gB + X}
        chips={[{text: 'App da sua central', at: g2(8.75) - gB}, {text: 'Usuário final', at: g2(10.0) - gB}]} /></Sequence>
      <Sequence from={gC} durationInFrames={gD - gC}><Scene dark={CONNECT.dark} accent={CONNECT.accent} logo="p2/lg_connect.png" mock="p2/m_connect.png" mockW={1900} mockX={-20} mockY={580} tilt={-6} dur={gD - gC} fadeOut
        chips={[{text: 'Técnicos homologados', at: g2(12.55) - gC}, {text: 'Brasil inteiro', at: g2(13.6) - gC}]} /></Sequence>

      <LightFlash at={S2} />
      <LightFlash at={S3} />
      <LightFlash at={END} />

      <Captions />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>

      {/* efeitos sonoros */}
      <Sfx at={CUES.panel - 2} name="whoosh" vol={0.4} />
      {CUES.items.map((at) => <Sfx key={at} at={at} name="pop" />)}
      <Sfx at={CUES.BREAK} name="error" vol={0.6} />
      <Sfx at={CUES.REWORK + 5} name="thud" vol={0.6} />
      <Sfx at={S2 - 6} name="whoosh" vol={0.45} />
      <Sfx at={CUES.JOIN} name="whoosh" vol={0.3} />
      <Sfx at={CUES.ONE - 2} name="chime" vol={0.45} />
      {[gA, gB, gC].map((at) => <Sfx key={at} at={at - 2} name="whoosh" vol={0.4} />)}
      {[6.4, 7.15, 8.75, 10.0, 12.55, 13.6].map((t) => <Sfx key={t} at={g2(t)} name="pop" vol={0.45} />)}
      {[0, 5, 10].map((d) => <Sfx key={d} at={CUES.trio + d} name="pop" vol={0.4} />)}
      <Sfx at={CUES.one2} name="chime" vol={0.45} />
      <Sfx at={S3 - 6} name="whoosh" vol={0.45} />
      {[0, 3, 6, 9].map((d) => <Sfx key={d} at={CUES.frag + d} name="pop" vol={0.35} />)}
      <Sfx at={CUES.one3} name="chime" vol={0.45} />
      <Sfx at={CUES.link} name="pop" vol={0.55} />
      <Sfx at={END - 6} name="whoosh" vol={0.45} />

      <Audio src={staticFile('p2/music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
