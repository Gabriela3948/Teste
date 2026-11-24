import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, LIMEGRAD, headStyle} from '../common/brand';
import {MapLines, Mark, Rise} from '../common/Fx';

export const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// fundo claro das artes: off-white com linhas de mapa e as formas da logo nos cantos
export const BgLight: React.FC<{seed?: number}> = ({seed = 3}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 4, fps, config: {damping: 22, stiffness: 60, mass: 1}});
  return (
    <AbsoluteFill style={{background: C.off}}>
      <MapLines color="#F9FCF8" opacity={1} seed={seed} shift={frame * 0.2} />
      <Mark size={600} body={C.slate} p={p} style={{position: 'absolute', left: 770, top: -350, transform: `rotate(${18 + frame * 0.012}deg)`}} />
      <Mark size={720} body={C.slate} p={p} style={{position: 'absolute', left: -330, top: 1500, transform: `rotate(${-12 - frame * 0.012}deg)`}} />
    </AbsoluteFill>
  );
};

// fundo escuro: azul-marinho com linhas e forma da logo
export const BgDark: React.FC<{seed?: number}> = ({seed = 5}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 4, fps, config: {damping: 22, stiffness: 60, mass: 1}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${C.navy2} 0%, ${C.navy} 70%)`}}>
      <MapLines color="#fff" opacity={0.04} seed={seed} shift={frame * 0.2} />
      <Mark size={1050} body={C.slate} p={p} style={{position: 'absolute', left: 420, top: 1120, opacity: 0.42, transform: `rotate(${8 - frame * 0.01}deg)`}} />
    </AbsoluteFill>
  );
};

// cabecalho fixo: logo + selo "NOVIDADE n/6"
export const Header: React.FC<{dark?: boolean; idx: number}> = ({dark, idx}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 6, fps, config: {damping: 13, stiffness: 170, mass: 0.6}});
  return (
    <>
      <Img src={staticFile(dark ? 'common/logo_ondark.png' : 'common/logo_onlight.png')} style={{position: 'absolute', left: 70, top: 150, height: 80}} />
      <div style={{position: 'absolute', right: 70, top: 160, display: 'flex', alignItems: 'center', gap: 12, background: LIMEGRAD, borderRadius: 34, padding: '10px 22px 10px 24px', boxShadow: '0 10px 24px rgba(3,37,56,.22)',
        fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 2.5, color: C.ink, opacity: Math.min(1, s * 1.5), transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, transformOrigin: '100% 50%'}}>
        NOVIDADE
        <span style={{background: C.ink, color: C.limeHi, borderRadius: 20, padding: '2px 12px', fontSize: 22, letterSpacing: 1}}>{idx}/6</span>
      </div>
    </>
  );
};

// titulo no estilo das artes: Noto Sans apertada, com trecho destacado
export type Seg = {t: string; hl?: boolean; bold?: boolean};
export const Headline: React.FC<{lines: Seg[][]; dark?: boolean; at?: number; size?: number; top?: number}> = ({lines, dark, at = 8, size = 88, top = 286}) => {
  let k = 0;
  return (
    <div style={{position: 'absolute', left: 70, right: 60, top, ...headStyle(size, dark ? '#fff' : C.head), fontWeight: 600}}>
      {lines.map((segs, i) => (
        <div key={i} style={{whiteSpace: 'nowrap'}}>
          {segs.map((sg, j) => {
            const d = at + k++ * 5;
            return <Rise key={j} at={d} style={{color: sg.hl ? (dark ? C.pale : C.olive) : undefined, fontWeight: sg.hl || sg.bold ? 700 : 600, whiteSpace: 'pre'}}>{sg.t}</Rise>;
          })}
        </div>
      ))}
    </div>
  );
};

// entrada de cena em corte diagonal, com uma faixa verde-limao na frente (como os recortes das artes)
export const Wipe: React.FC<{children: React.ReactNode; skip?: boolean}> = ({children, skip}) => {
  const frame = useCurrentFrame();
  const p = skip ? 1 : interpolate(frame, [0, 14], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const xt = interpolate(p, [0, 1], [112, -40]);
  const xb = xt + 26;
  return (
    <>
      {p < 1 && <AbsoluteFill style={{background: LIMEGRAD, clipPath: `polygon(${xt - 9}% 0, ${xt + 1}% 0, ${xb + 1}% 100%, ${xb - 9}% 100%)`}} />}
      <AbsoluteFill style={{clipPath: p < 1 ? `polygon(${xt}% 0, 101% 0, 101% 100%, ${xb}% 100%)` : undefined}}>{children}</AbsoluteFill>
    </>
  );
};

// cursor de mouse
export const Cursor: React.FC<{x: number; y: number; press?: number; opacity?: number}> = ({x, y, press = 0, opacity = 1}) => (
  <svg width={58} height={58} viewBox="0 0 24 24" style={{position: 'absolute', left: x - 6, top: y - 4, opacity, transform: `scale(${1 - press * 0.16})`, transformOrigin: '20% 15%', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.35))'}}>
    <path d="M5 3l14 7.200-6.300 1.700L10.200 19z" fill="#fff" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// cartao branco base das cenas
export const card = (extra?: React.CSSProperties): React.CSSProperties => ({background: '#fff', borderRadius: 36, boxShadow: '0 30px 70px rgba(3,37,56,.22)', ...extra});
export {LIMEGRAD};
