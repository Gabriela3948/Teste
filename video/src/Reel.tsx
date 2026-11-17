import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from './Captions';
import {Chip, DriverCard, FleetCard, TrackCard} from './Tracking';
import {END, MINT, NAVY, BLUE, T2} from './theme';

const ENDLEN = 72;
export const TOTAL = END + ENDLEN;
const f = (s: number) => Math.round(s * 30);

const BRoll: React.FC<{src: string; dur: number}> = ({src, dur}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1.02, 1.09]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    </AbsoluteFill>
  );
};

// [arquivo, inicio (s, tempo global), fim]
const T2S = T2 / 30;
const cuts: [string, number, number][] = [
  ['crowd.mp4', 2.14, 3.0], ['sign.mp4', 3.0, 3.82],
  ['scania.mp4', 3.82, 4.88], ['daf.mp4', 4.88, 5.92], ['hall.mp4', 5.92, 7.02],
  ['handshake.mp4', 8.5, 9.18], ['group.mp4', 9.18, 9.74], ['monitor.mp4', 9.74, 10.62],
  ['truck.mp4', T2S + 1.45, T2S + 3.5], ['driver.mp4', T2S + 3.5, T2S + 4.45], ['fleet.mp4', T2S + 4.45, T2S + 5.3],
];

// punch-ins na apresentadora (tempo global em s -> escala)
const punches: [number, number][] = [[0, 1], [1.0, 1.1], [7.02, 1.0], [10.62, 1.1], [12.0, 1.0], [T2S, 1.06], [T2S + 5.3, 1.0], [T2S + 6.95, 1.1]];

const Talk: React.FC<{src: string; offset: number}> = ({src, offset}) => {
  const frame = useCurrentFrame() + offset;
  const t = frame / 30;
  let sc = 1;
  for (const [s, v] of punches) if (t >= s) sc = v;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc})`, transformOrigin: '50% 32%'}} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bg = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const logo = spring({frame: frame - 5, fps, config: {damping: 15, stiffness: 140}});
  const txt = spring({frame: frame - 16, fps, config: {damping: 18, stiffness: 140}});
  return (
    <AbsoluteFill style={{opacity: bg, background: `linear-gradient(165deg, ${BLUE} 0%, ${NAVY} 70%)`, alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat'}}>
      <Img src={staticFile('logo_tec.png')} style={{width: 720, opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.86, 1])})`}} />
      <div style={{marginTop: 70, fontSize: 54, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2, opacity: txt, transform: `translateY(${interpolate(txt, [0, 1], [30, 0])}px)`}}>
        Rastreamento e gestão<br />de <span style={{color: MINT}}>frotas</span> em um só lugar
      </div>
      <div style={{marginTop: 46, fontSize: 38, fontWeight: 600, color: MINT, opacity: txt}}>@aldeiatecnologia</div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = (fr: number) => interpolate(fr, [0, 10, END - 6, END + 10, TOTAL - 18, TOTAL], [0, 0.11, 0.11, 0.4, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wm = interpolate(frame, [END - 4, END + 4], [0.92, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence durationInFrames={T2}><Talk src="take1.mp4" offset={0} /></Sequence>
      <Sequence from={T2} durationInFrames={240 + 8}><Talk src="take2.mp4" offset={T2} /></Sequence>

      {cuts.map(([src, a, b]) => (
        <Sequence key={src} from={f(a)} durationInFrames={f(b) - f(a)}><BRoll src={src} dur={f(b) - f(a)} /></Sequence>
      ))}

      {/* vinheta para leitura da legenda */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,16,48,.38) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 52%, rgba(6,12,40,.6) 100%)'}} />

      {/* rastreamento */}
      <Sequence from={T2 + f(1.6)} durationInFrames={f(1.9)}><TrackCard dur={f(1.9)} /></Sequence>
      <Sequence from={T2 + f(3.5)} durationInFrames={f(0.95)}><DriverCard dur={f(0.95)} /></Sequence>
      <Sequence from={T2 + f(4.45)} durationInFrames={f(0.85)}><FleetCard dur={f(0.85)} /></Sequence>
      <Sequence from={T2 + f(5.55)} durationInFrames={f(2.2)}><Chip text="Logística" dur={f(2.2)} left={70} top={300} /></Sequence>
      <Sequence from={T2 + f(6.25)} durationInFrames={f(1.5)}><Chip text="Agro" dur={f(1.5)} left={70} top={400} /></Sequence>

      <Captions hideAfter={END} />
      <Img src={staticFile('logo_tec.png')} style={{position: 'absolute', left: 60, top: 96, height: 92, opacity: wm}} />

      <Sequence from={END} durationInFrames={ENDLEN}><EndCard /></Sequence>
      <Audio src={staticFile('music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
