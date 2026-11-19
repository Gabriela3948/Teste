import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './Captions';
import {Screen} from './Screen';
import {Elements, LightFlash} from './Elements';
import {A2, END, ENDLEN, L1, L2, L3, S2, S3, TOTAL} from './timing';

const f = (s: number) => Math.round(s * 30);
const g2 = (src: number) => S2 + f(src - A2); // tempo no take 2 -> frame global

// zoom lento e continuo (sem cortes secos)
const Talk: React.FC<{src: string; dur: number; from: number; to: number}> = ({src, dur, from, to}) => {
  const frame = useCurrentFrame();
  const sc = interpolate(frame, [0, dur], [from, to], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc})`, transformOrigin: '50% 53%'}} />
    </AbsoluteFill>
  );
};

export const ReelPlataforma: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 30, TOTAL], [0, 0.16, 0.16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Gestor / Tracking / Connect, ancorados na fala do take 2
  const gA = g2(5.5), gB = g2(7.95), gC = g2(10.95), gD = g2(14.6);
  const X = 9; // sobreposicao para a fusao entre telas
  return (
    <AbsoluteFill style={{background: '#141F52'}}>
      <Sequence durationInFrames={L1}><Talk src="p2/t1.mp4" dur={L1} from={1.42} to={1.78} /></Sequence>
      <Sequence from={S2} durationInFrames={L2}><Talk src="p2/t2.mp4" dur={L2} from={1.4} to={1.74} /></Sequence>
      <Sequence from={S3} durationInFrames={L3}><Talk src="p2/t3.mp4" dur={L3} from={1.45} to={1.8} /></Sequence>

      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(6,12,40,.5) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,14,44,.62) 0%, rgba(8,14,44,.34) 22%, rgba(8,14,44,0) 40%)'}} />

      <Elements />

      <Sequence from={gA} durationInFrames={gB - gA + X}><Screen logo="p2/gst_logo.png" pills="p2/gst_pills.png" panel="p2/gst_panel.jpg" dur={gB - gA + X} logoW={520} panX={-90} panFrom={-260} panTo={-380} /></Sequence>
      <Sequence from={gB} durationInFrames={gC - gB + X}><Screen logo="p2/trk_logo.png" pills="p2/trk_pills.png" panel="p2/trk_panel.jpg" dur={gC - gB + X} logoW={560} panX={-90} panFrom={-330} panTo={-450} /></Sequence>
      <Sequence from={gC} durationInFrames={gD - gC}><Screen logo="p2/con_logo.png" pills="p2/con_pills.png" panel="p2/con_panel.jpg" dur={gD - gC} logoW={540} panX={-90} panFrom={-150} panTo={-290} fadeOut /></Sequence>

      <LightFlash at={S2} />
      <LightFlash at={S3} />
      <LightFlash at={END} />

      <Captions />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>
      <Audio src={staticFile('p2/music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
