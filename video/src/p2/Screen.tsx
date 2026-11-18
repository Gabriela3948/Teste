import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Motion com material oficial do produto: logo, recursos e telas do app
export const Screen: React.FC<{logo: string; pills: string; panel: string; dur: number; logoW: number; panX: number; panFrom: number; panTo: number; fadeOut?: boolean}> = ({logo, pills, panel, dur, logoW, panX, panFrom, panTo, fadeOut}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number) => spring({frame: frame - d, fps, config: {damping: 20, stiffness: 90, mass: 0.9}});
  const a = sp(3), b = sp(9), c = sp(5);
  const fin = interpolate(frame, [0, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fout = fadeOut ? interpolate(frame, [dur - 9, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const ease = interpolate(frame, [0, dur], [0, 1], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  const pan = interpolate(ease, [0, 1], [panFrom, panTo]);
  const zoom = interpolate(ease, [0, 1], [1.0, 1.07]);
  return (
    <AbsoluteFill style={{background: '#fff', opacity: Math.min(fin, fout)}}>
      <Img src={staticFile(logo)} style={{position: 'absolute', left: 70, top: 150, width: logoW, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [-30, 0])}px)`}} />
      <Img src={staticFile(pills)} style={{position: 'absolute', left: 60, top: 395, width: 960, opacity: b, transform: `translateY(${interpolate(b, [0, 1], [24, 0])}px)`}} />
      <div style={{position: 'absolute', left: 60, top: 560, width: 960, height: 1230, borderRadius: 48, overflow: 'hidden', boxShadow: '0 30px 70px rgba(10,20,60,.28)',
        opacity: c, transform: `translateY(${interpolate(c, [0, 1], [110, 0])}px)`}}>
        <Img src={staticFile(panel)} style={{position: 'absolute', left: panX, top: pan, width: 1140, transform: `scale(${zoom})`, transformOrigin: '50% 40%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(180deg, rgba(8,14,40,0) 0%, rgba(8,14,40,.62) 60%, rgba(8,14,40,.72) 100%)'}} />
      </div>
    </AbsoluteFill>
  );
};
