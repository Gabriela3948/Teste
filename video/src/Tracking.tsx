import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {MINT, NAVY} from './theme';

const card: React.CSSProperties = {
  position: 'absolute', left: 60, top: 230, width: 620, borderRadius: 34, padding: '30px 34px',
  background: 'rgba(9,18,48,.82)', border: '1.5px solid rgba(255,255,255,.14)',
  boxShadow: '0 24px 60px rgba(0,0,0,.45)', fontFamily: 'Montserrat', color: '#fff',
};
const label: React.CSSProperties = {fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,.62)', letterSpacing: 0.4};

const useEnter = (dur: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame, fps, config: {damping: 18, stiffness: 170, mass: 0.7}});
  const out = interpolate(frame, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {opacity: Math.min(inn, out), transform: `translateY(${interpolate(inn, [0, 1], [50, 0])}px)`};
};

const Header: React.FC<{title: string}> = ({title}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22}}>
    <Img src={staticFile('logo_tracking.png')} style={{height: 54}} />
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: MINT}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: MINT, boxShadow: `0 0 0 6px rgba(197,235,195,.22)`}} />
      {title}
    </div>
  </div>
);

const ROUTE = 'M 30 205 C 110 195, 120 120, 200 118 S 300 150, 350 92 S 470 40, 530 52';

export const TrackCard: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const s = useEnter(dur);
  const p = interpolate(frame, [6, dur - 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const speed = Math.round(interpolate(p, [0, 1], [54, 68]));
  return (
    <div style={{...card, ...s}}>
      <Header title="Ao vivo" />
      <div style={{borderRadius: 22, overflow: 'hidden', background: '#101d47', height: 240, position: 'relative'}}>
        <svg viewBox="0 0 560 240" width="100%" height="100%">
          {[40, 100, 160, 220].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y - 26} stroke="rgba(255,255,255,.07)" strokeWidth="10" />)}
          {[70, 190, 310, 430].map((x) => <line key={x} x1={x} x2={x + 46} y1="0" y2="240" stroke="rgba(255,255,255,.07)" strokeWidth="10" />)}
          <path d={ROUTE} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="7" strokeLinecap="round" strokeDasharray="2 16" />
          <path d={ROUTE} fill="none" stroke={MINT} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
          <circle cx="30" cy="205" r="9" fill="#fff" />
          <circle cx="530" cy="52" r="11" fill="none" stroke="#fff" strokeWidth="4" />
          <g style={{offsetPath: `path('${ROUTE}')`, offsetDistance: `${p * 100}%`} as React.CSSProperties}>
            <circle r="24" fill="rgba(255,60,20,.25)" />
            <circle r="12" fill="#FF3B14" stroke="#fff" strokeWidth="4" />
          </g>
        </svg>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22}}>
        <div><div style={label}>Status</div><div style={{fontSize: 34, fontWeight: 700}}>Em rota</div></div>
        <div><div style={label}>Velocidade</div><div style={{fontSize: 34, fontWeight: 700}}>{speed} km/h</div></div>
        <div><div style={label}>Ignição</div><div style={{fontSize: 34, fontWeight: 700, color: MINT}}>Ligada</div></div>
      </div>
    </div>
  );
};

export const DriverCard: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const s = useEnter(dur);
  const bar = interpolate(frame, [4, 20], [0, 0.64], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{...card, ...s, width: 560}}>
      <Header title="Motorista" />
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: MINT, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 34}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill={NAVY}><circle cx="12" cy="8" r="4.2" /><path d="M3.5 21c.6-4.6 4-7 8.5-7s7.900 2.400 8.500 7z" /></svg>
        </div>
        <div>
          <div style={label}>Jornada de hoje</div>
          <div style={{fontSize: 40, fontWeight: 700}}>05h12 dirigindo</div>
        </div>
      </div>
      <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,.14)', marginTop: 24}}>
        <div style={{height: 12, borderRadius: 6, background: MINT, width: `${bar * 100}%`}} />
      </div>
    </div>
  );
};

const rows = [['Caminhão 01', 'Em rota', MINT], ['Caminhão 02', 'Em rota', MINT], ['Caminhão 03', 'Parado', '#FFB020']] as const;
export const FleetCard: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const s = useEnter(dur);
  return (
    <div style={{...card, ...s, width: 560}}>
      <Header title="Frota" />
      {rows.map(([n, st, c], i) => (
        <div key={n} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderTop: i ? '1px solid rgba(255,255,255,.1)' : 'none',
          opacity: interpolate(frame, [3 + i * 4, 9 + i * 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <span style={{fontSize: 32, fontWeight: 700}}>{n}</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 600, color: c}}>
            <span style={{width: 12, height: 12, borderRadius: 6, background: c}} />{st}
          </span>
        </div>
      ))}
    </div>
  );
};

export const Chip: React.FC<{text: string; dur: number; left: number; top: number}> = ({text, dur, left, top}) => {
  const s = useEnter(dur);
  return (
    <div style={{position: 'absolute', left, top, ...s, fontFamily: 'Montserrat', fontWeight: 700, fontSize: 40, color: NAVY, background: MINT, padding: '14px 30px', borderRadius: 60, boxShadow: '0 14px 34px rgba(0,0,0,.35)'}}>
      {text}
    </div>
  );
};
