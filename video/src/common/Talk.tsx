import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './brand';

// ponto-chave de camera: [frame local, escala, altura do rosto na tela (0-1), posicao horizontal do rosto (0-1)]
export type KF = [number, number, number, number?][];
const E = {easing: Easing.inOut(Easing.sin), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Take com movimento de camera por pontos-chave. face = posicao do rosto no material bruto (0-1).
// A imagem nunca sai do quadro: translacao limitada para sempre cobrir a tela.
export const Talk: React.FC<{src: string; face: {x: number; y: number}; kf: KF; dur: number; diveIn?: boolean; diveOut?: boolean; shakeAt?: number[]; muted?: boolean; volume?: number}> = ({src, face, kf, dur, diveIn, diveOut, shakeAt, muted, volume = 1}) => {
  const frame = useCurrentFrame();
  const fr = kf.map((k) => k[0]);
  let s = interpolate(frame, fr, kf.map((k) => k[1]), E);
  const yT = interpolate(frame, fr, kf.map((k) => k[2]), E);
  const xT = interpolate(frame, fr, kf.map((k) => k[3] ?? 0.5), E);
  // mergulho de zoom nas viradas de take
  if (diveOut) s += interpolate(frame, [dur - 7, dur], [0, 0.22], {easing: Easing.in(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (diveIn) s += interpolate(frame, [0, 10], [0.22, 0], {easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let shake = 0;
  for (const at of shakeAt ?? []) {
    const h = frame - at;
    if (h >= 0 && h < 9) shake += Math.sin(h * 2.6) * (9 - h) * 1.5;
  }
  const drift = Math.sin(frame / 47) * 8;
  const tx = clamp(1080 * (xT - s * face.x) + drift + shake, 1080 - s * 1080, 0);
  const ty = clamp(1920 * (yT - s * face.y) + shake * 0.6, 1920 - s * 1920, 0);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} muted={muted} volume={volume} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}} />
    </AbsoluteFill>
  );
};
