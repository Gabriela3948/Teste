import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {dots} from './brand';

type Chip = {text: string; at: number};
// Cena de produto com a identidade oficial: cor do produto, logo e mockup real do app
export const Scene: React.FC<{dark: string; accent: string; logo: string; mock: string; mockW: number; mockX: number; mockY: number; tilt: number; chips: Chip[]; dur: number; fadeOut?: boolean}> = ({dark, accent, logo, mock, mockW, mockX, mockY, tilt, chips, dur, fadeOut}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = spring({frame, fps, config: {damping: 200, stiffness: 190, mass: 0.6}});
  const fout = fadeOut ? interpolate(frame, [dur - 9, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const lg = spring({frame: frame - 5, fps, config: {damping: 16, stiffness: 140, mass: 0.7}});
  const hero = spring({frame: frame - 7, fps, config: {damping: 15, stiffness: 95, mass: 0.9}});
  const t = interpolate(frame, [0, dur], [0, 1], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  const float = Math.sin(frame / 17) * 9;
  return (
    <AbsoluteFill style={{opacity: fout, transform: `translateX(${interpolate(slide, [0, 1], [1080, 0])}px)`, background: dark, overflow: 'hidden', boxShadow: '-40px 0 80px rgba(0,0,0,.45)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 55% at 62% 74%, ${accent}66 0%, ${accent}1f 45%, transparent 72%)`}} />
      <AbsoluteFill style={{...dots('#ffffff', 0.1), transform: `translate(${-t * 34}px, ${-t * 34}px) scale(1.1)`}} />
      {/* grafismo: aro do acento */}
      <div style={{position: 'absolute', left: 430, top: 720, width: 900, height: 900, borderRadius: '50%', border: `3px solid ${accent}`, opacity: 0.28, transform: `scale(${interpolate(hero, [0, 1], [0.5, 1]) + t * 0.08})`}} />
      <div style={{position: 'absolute', left: 560, top: 850, width: 640, height: 640, borderRadius: '50%', border: `2px solid ${accent}`, opacity: 0.2, transform: `scale(${interpolate(hero, [0, 1], [0.4, 1]) + t * 0.12})`}} />

      <Img src={staticFile(logo)} style={{position: 'absolute', left: 70, top: 160, height: 128, opacity: lg, transform: `translateX(${interpolate(lg, [0, 1], [-70, 0])}px)`}} />
      <div style={{position: 'absolute', left: 70, top: 338, height: 6, borderRadius: 3, background: accent, width: interpolate(lg, [0, 1], [0, 150])}} />

      <div style={{position: 'absolute', left: 70, top: 386, display: 'flex', gap: 16, flexWrap: 'wrap', width: 960}}>
        {chips.map((c) => {
          const s = spring({frame: frame - c.at, fps, config: {damping: 11, stiffness: 190, mass: 0.6}});
          return (
            <div key={c.text} style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, letterSpacing: -0.5, color: dark, background: accent, padding: '14px 28px', borderRadius: 18, boxShadow: '0 12px 30px rgba(0,0,0,.3)',
              opacity: Math.min(1, s * 1.6), transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${interpolate(s, [0, 1], [-6, 0])}deg)`, transformOrigin: '0% 100%'}}>
              {c.text}
            </div>
          );
        })}
      </div>

      <Img src={staticFile(mock)} style={{position: 'absolute', left: mockX, top: mockY + float, width: mockW, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,.45))',
        opacity: Math.min(1, hero * 1.5), transform: `translateY(${interpolate(hero, [0, 1], [520, 0])}px) rotate(${interpolate(hero, [0, 1], [tilt, 0])}deg) scale(${1 + t * 0.07})`, transformOrigin: '50% 60%'}} />

      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 66%, ${dark}80 80%, ${dark}e0 100%)`}} />
    </AbsoluteFill>
  );
};
