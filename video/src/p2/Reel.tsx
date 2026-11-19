import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {Screen} from './Screen';
import {CUES, Elements, LightFlash} from './Elements';
import {A2, END, ENDLEN, L1, L2, L3, S2, S3, TOTAL} from './timing';

const f = (s: number) => Math.round(s * 30);
const g2 = (src: number) => S2 + f(src - A2);

// posicao do rosto no material bruto e onde ele deve ficar na tela (centralizado)
const FACE = {x: 0.54, y: 0.535};
const TARGET = {x: 0.5, y: 0.35};

// movimento de camera por pontos-chave: aproxima e afasta varias vezes em cada take
type KF = [number, number][]; // [frame local, escala]
const cam = (frame: number, kf: KF) =>
  interpolate(frame, kf.map((k) => k[0]), kf.map((k) => k[1]), {easing: Easing.inOut(Easing.sin), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Talk: React.FC<{src: string; kf: KF; offset: number}> = ({src, kf, offset}) => {
  const frame = useCurrentFrame();
  const g = frame + offset;
  const s = cam(frame, kf);
  const hit = g - (CUES.REWORK + 6);
  const shake = hit >= 0 && hit < 9 ? Math.sin(hit * 2.6) * (9 - hit) * 1.6 : 0;
  const drift = Math.sin(g / 47) * 10; // leve deriva lateral
  const tx = 1080 * (TARGET.x - s * FACE.x) + shake + drift;
  const ty = 1920 * (TARGET.y - s * FACE.y) + shake * 0.6;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}} />
    </AbsoluteFill>
  );
};

const B = CUES.BREAK, R = CUES.REWORK + 6;
const KF1: KF = [[0, 1.85], [96, 2.32], [120, 2.32], [158, 1.92], [250, 2.12], [B - 6, 2.05], [B + 9, 2.42], [R - 12, 2.28], [R - 2, 2.2], [R + 5, 2.5], [L1, 2.42]];
const o2 = CUES.ONE - S2, e2 = g2(14.6) - S2;
const KF2: KF = [[0, 1.88], [o2 - 8, 2.08], [o2 + 6, 2.42], [o2 + 40, 2.36], [e2 - 1, 2.36], [e2, 1.95], [CUES.one2 - S2 - 4, 2.1], [CUES.one2 - S2 + 8, 2.42], [L2, 2.45]];
const u3 = CUES.unite - S3, l3 = CUES.link - S3;
const KF3: KF = [[0, 1.9], [u3 - 6, 2.15], [u3 + 8, 2.42], [l3 - 22, 2.05], [l3 - 4, 2.08], [l3 + 8, 2.46], [L3, 2.4]];

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

      <Sequence from={gA} durationInFrames={gB - gA + X}><Screen logo="p2/gst_logo.png" pills="p2/gst_pills.png" panel="p2/gst_panel.jpg" dur={gB - gA + X} logoW={520} panX={-90} panFrom={-240} panTo={-420} /></Sequence>
      <Sequence from={gB} durationInFrames={gC - gB + X}><Screen logo="p2/trk_logo.png" pills="p2/trk_pills.png" panel="p2/trk_panel.jpg" dur={gC - gB + X} logoW={560} panX={-90} panFrom={-300} panTo={-480} /></Sequence>
      <Sequence from={gC} durationInFrames={gD - gC}><Screen logo="p2/con_logo.png" pills="p2/con_pills.png" panel="p2/con_panel.jpg" dur={gD - gC} logoW={540} panX={-90} panFrom={-120} panTo={-320} fadeOut /></Sequence>

      <LightFlash at={S2} />
      <LightFlash at={S3} />
      <LightFlash at={END} />

      <Captions />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>

      {/* efeitos sonoros */}
      <Sfx at={CUES.start} name="pop" vol={0.4} />
      {CUES.items.map((at) => <Sfx key={at} at={at} name="pop" />)}
      <Sfx at={CUES.BREAK} name="error" vol={0.6} />
      <Sfx at={CUES.REWORK + 5} name="thud" vol={0.6} />
      <Sfx at={S2 - 6} name="whoosh" vol={0.45} />
      <Sfx at={CUES.JOIN} name="whoosh" vol={0.3} />
      <Sfx at={CUES.ONE - 4} name="chime" vol={0.45} />
      <Sfx at={gA - 2} name="whoosh" vol={0.4} />
      <Sfx at={gB - 2} name="whoosh" vol={0.4} />
      <Sfx at={gC - 2} name="whoosh" vol={0.4} />
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
