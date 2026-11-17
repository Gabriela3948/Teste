import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {Product} from './Product';
import {A1, A2, END, L1, L2, T2} from './theme';

const ENDLEN = 180; // animacao final oficial (6s)
export const TOTAL = END + ENDLEN;
const f = (s: number) => Math.round(s * 30);
const g1 = (src: number) => src - A1; // tempo no take 1 -> tempo global
const g2 = (src: number) => T2 / 30 + src - A2;

const BRoll: React.FC<{src: string; dur: number}> = ({src, dur}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1.02, 1.09]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    </AbsoluteFill>
  );
};

// [arquivo, inicio, fim] em tempo global, ancorado nas palavras da fala
const cuts: [string, number, number][] = [
  ['crowd.mp4', g1(3.04), g1(3.9)], ['sign.mp4', g1(3.9), g1(4.72)],
  ['scania.mp4', g1(4.72), g1(5.78)], ['daf.mp4', g1(5.78), g1(6.82)], ['hall.mp4', g1(6.82), g1(7.92)],
  ['handshake.mp4', g1(9.4), g1(10.08)], ['group.mp4', g1(10.08), g1(10.64)], ['monitor.mp4', g1(10.64), g1(11.52)],
];

const punches: [number, number][] = [[0, 1], [g1(1.9), 1.1], [g1(7.92), 1.0], [g1(11.52), 1.1], [g1(12.5), 1.0], [g2(A2), 1.07], [g2(6.14), 1.0], [g2(7.9), 1.1]];

const Talk: React.FC<{src: string; offset: number}> = ({src, offset}) => {
  const t = (useCurrentFrame() + offset) / 30;
  let sc = 1;
  for (const [s, v] of punches) if (t >= s) sc = v;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc})`, transformOrigin: '50% 32%'}} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 12, TOTAL - 24, TOTAL], [0, 0.06, 0.06, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pA = f(g2(2.38)), pB = f(g2(4.38)), pC = f(g2(6.14));
  return (
    <AbsoluteFill style={{background: '#141F52'}}>
      <Sequence durationInFrames={L1}><Talk src="take1.mp4" offset={0} /></Sequence>
      <Sequence from={T2} durationInFrames={L2}><Talk src="take2.mp4" offset={T2} /></Sequence>

      {cuts.map(([src, a, b]) => (
        <Sequence key={src} from={f(a)} durationInFrames={f(b) - f(a)}><BRoll src={src} dur={f(b) - f(a)} /></Sequence>
      ))}

      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(6,12,40,.45) 100%)'}} />

      {/* plataforma de rastreamento: material oficial Aldeia Tracking / Aldeia Fleet */}
      <Sequence from={pA} durationInFrames={pB - pA}><Product logo="trk_logo.png" pills="trk_pills.png" panel="trk_panel.jpg" dur={pB - pA} fadeIn logoW={560} panFrom={-330} panTo={-450} /></Sequence>
      <Sequence from={pB} durationInFrames={pC - pB}><Product logo="flt_logo.png" pills="flt_pills.png" panel="flt_panel.jpg" dur={pC - pB} lead={9} logoW={500} panFrom={-40} panTo={-150} /></Sequence>

      <Captions hideAfter={END} />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
