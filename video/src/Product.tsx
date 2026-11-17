import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Tela de produto com material oficial (logo, recursos e telas do app)
export const Product: React.FC<{logo: string; pills: string; panel: string; dur: number; logoW: number; panFrom: number; panTo: number; fadeIn?: boolean; lead?: number}> = ({logo, pills, panel, dur, logoW, panFrom, panTo, fadeIn, lead = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (d: number) => spring({frame: frame + lead - d, fps, config: {damping: 17, stiffness: 150, mass: 0.7}});
  const a = sp(0), b = sp(5), c = sp(2);
  const pan = interpolate(frame, [0, dur], [panFrom, panTo]);
  return (
    <AbsoluteFill style={{background: '#fff', opacity: fadeIn ? interpolate(frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'}) : 1}}>
      <Img src={staticFile(logo)} style={{position: 'absolute', left: 70, top: 150, width: logoW, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [-40, 0])}px)`}} />
      <Img src={staticFile(pills)} style={{position: 'absolute', left: 60, top: 395, width: 960, opacity: b, transform: `scale(${interpolate(b, [0, 1], [0.92, 1])})`}} />
      <div style={{position: 'absolute', left: 60, top: 560, width: 960, height: 1230, borderRadius: 48, overflow: 'hidden', boxShadow: '0 30px 70px rgba(10,20,60,.28)',
        opacity: c, transform: `translateY(${interpolate(c, [0, 1], [160, 0])}px)`}}>
        <Img src={staticFile(panel)} style={{position: 'absolute', left: -90, top: pan, width: 1140}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(180deg, rgba(8,14,40,0) 0%, rgba(8,14,40,.62) 60%, rgba(8,14,40,.72) 100%)'}} />
      </div>
    </AbsoluteFill>
  );
};
