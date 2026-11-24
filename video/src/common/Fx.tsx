import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from '../p2/logoParts.json';
import {BODY, C, HEAD, LIMEGRAD} from './brand';
import {MARK_BODY, MARK_H, MARK_W, MARK_WEDGE} from './markPaths';

export const Sfx: React.FC<{at: number; name: string; vol?: number}> = ({at, name, vol = 0.5}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={70}><Audio src={staticFile(`common/sfx/${name}.mp3`)} volume={vol} /></Sequence>
);

// flash de luz na troca de takes
export const LightFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -7 || d > 12) return null;
  const o = d < 0 ? interpolate(d, [-7, 0], [0, 0.9]) : interpolate(d, [0, 12], [0.9, 0]);
  const sweep = interpolate(d, [-7, 12], [-60, 160]);
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse 90% 60% at ${sweep}% 35%, rgba(255,255,255,1) 0%, rgba(233,246,255,.92) 35%, rgba(217,248,114,.5) 70%, rgba(255,255,255,.35) 100%)`, mixBlendMode: 'screen'}} />
  );
};

// pseudo-aleatorio deterministico
export const rnd = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// textura de linhas de mapa, como no fundo das artes
export const MapLines: React.FC<{color: string; opacity: number; seed?: number; shift?: number}> = ({color, opacity, seed = 7, shift = 0}) => {
  const lines = React.useMemo(() => {
    const r = rnd(seed);
    const out: {x1: number; y1: number; x2: number; y2: number; w: number}[] = [];
    for (let i = 0; i < 34; i++) {
      const base = i % 2 ? 0.42 : -1.1; // duas direcoes dominantes, como quadras
      const ang = base + (r() - 0.5) * 0.5;
      const cx = r() * 1400 - 160, cy = r() * 2300 - 190, len = 500 + r() * 1300;
      out.push({x1: cx - Math.cos(ang) * len, y1: cy - Math.sin(ang) * len, x2: cx + Math.cos(ang) * len, y2: cy + Math.sin(ang) * len, w: 2 + r() * 4});
    }
    return out;
  }, [seed]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity, transform: `translate(${-shift}px, ${-shift * 0.6}px) scale(1.06)`}}>
      {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth={l.w} strokeLinecap="round" />)}
    </svg>
  );
};

// simbolo da logo como grafismo (corpo do A + cunha), com entrada em duas pecas
export const Mark: React.FC<{size: number; body: string; wedge?: string; p?: number; style?: React.CSSProperties}> = ({size, body, wedge, p = 1, style}) => {
  const b = Math.min(1, p * 1.25), w = Math.max(0, Math.min(1, (p - 0.25) / 0.75));
  return (
    <svg width={size * (MARK_W / MARK_H)} height={size} viewBox={`0 0 ${MARK_W} ${MARK_H}`} style={{overflow: 'visible', ...style}}>
      <path d={MARK_BODY} fill={body} opacity={Math.min(1, b * 2)} transform={`translate(${(1 - b) * -60} ${(1 - b) * -90}) rotate(${(1 - b) * -40} ${MARK_W / 2} ${MARK_H * 0.7})`} />
      {wedge && <path d={MARK_WEDGE} fill={wedge} opacity={Math.min(1, w * 2)} transform={`translate(${(1 - w) * -140} ${(1 - w) * 50})`} />}
    </svg>
  );
};

type Part = {f: string; x: number; y: number; w: number; h: number; kind: string};
const parts = data.parts as Part[];
const mark = parts.filter((p) => p.kind === 'mark');
const top = parts.filter((p) => p.kind === 'top');
const bot = parts.filter((p) => p.kind === 'bot');

// Logo montada em movimento (simbolo encaixa, letras sobem, brilho). variant: 'light' = texto branco; 'dark' = texto azul-marinho
export const LogoReveal: React.FC<{start: number; height: number; variant?: 'light' | 'dark'; speed?: number; shadow?: boolean}> = ({start, height, variant = 'light', speed = 1, shadow = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame - start) * speed;
  const k = height / data.H;
  const dir = `common/logo_${variant}`;
  const sp = (d: number, cfg = {damping: 13, stiffness: 150, mass: 0.7}) => spring({frame: t - d, fps, config: cfg});
  const body = sp(0, {damping: 11, stiffness: 120, mass: 0.8});
  const wedge = sp(5, {damping: 10, stiffness: 170, mass: 0.6});
  const shine = interpolate(t, [24, 46], [-30, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pos = (p: Part): React.CSSProperties => ({position: 'absolute', left: p.x * k, top: p.y * k, width: p.w * k, height: p.h * k});
  return (
    <div style={{position: 'relative', width: data.W * k, height, filter: shadow ? 'drop-shadow(0 6px 18px rgba(0,0,0,.55))' : undefined}}>
      <Img src={staticFile(`${dir}/${mark[1].f}`)} style={{...pos(mark[1]), opacity: Math.min(1, body * 2.2), transformOrigin: '50% 70%',
        transform: `translate(${interpolate(body, [0, 1], [-90 * k, 0])}px, ${interpolate(body, [0, 1], [-160 * k, 0])}px) rotate(${interpolate(body, [0, 1], [-95, 0])}deg) scale(${interpolate(body, [0, 1], [0.35, 1])})`}} />
      <Img src={staticFile(`${dir}/${mark[0].f}`)} style={{...pos(mark[0]), opacity: Math.min(1, wedge * 2.2),
        transform: `translate(${interpolate(wedge, [0, 1], [-260 * k, 0])}px, ${interpolate(wedge, [0, 1], [90 * k, 0])}px) scale(${interpolate(wedge, [0, 1], [0.5, 1])})`}} />
      {top.map((p, i) => {
        const s = sp(7 + i * 2.2, {damping: 14, stiffness: 190, mass: 0.6});
        return (
          <div key={p.f} style={{...pos(p), overflow: 'hidden', paddingBottom: 2}}>
            <Img src={staticFile(`${dir}/${p.f}`)} style={{width: '100%', height: p.h * k, transform: `translateY(${interpolate(s, [0, 1], [112, 0])}%)`}} />
          </div>
        );
      })}
      {bot.map((p, i) => {
        const s = sp(17 + i * 1.1, {damping: 18, stiffness: 160, mass: 0.6});
        return <Img key={p.f} src={staticFile(`${dir}/${p.f}`)} style={{...pos(p), opacity: s, transform: `translateX(${interpolate(s, [0, 1], [(i + 2) * 9 * k, 0])}px)`}} />;
      })}
      <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `url(${staticFile('p2/logo_tec.png')})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile('p2/logo_tec.png')})`, maskSize: '100% 100%',
        background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine - 16}%, rgba(255,255,255,.95) ${shine}%, rgba(255,255,255,0) ${shine + 16}%)`, opacity: t > 22 && t < 48 ? 1 : 0}} />
    </div>
  );
};

// logo animada centralizada no topo, sobre o video
export const LogoTop: React.FC<{from: number; to: number; top?: number; height?: number}> = ({from, to, top = 150, height = 150}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const out = interpolate(frame, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ring = interpolate(frame - from - 6, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 380 * (0.3 + ring), top: top + height / 2 - 380 * (0.3 + ring), width: 760 * (0.3 + ring), height: 760 * (0.3 + ring), borderRadius: '50%', border: `5px solid ${C.limeHi}`, opacity: ring > 0 ? (1 - ring) * 0.8 : 0}} />
      <div style={{position: 'absolute', left: 0, right: 0, top, height, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: out, transform: `scale(${interpolate(out, [0, 1], [0.9, 1])})`}}>
        <LogoReveal start={from} height={height} />
      </div>
    </>
  );
};

// botao "Link na bio" na altura do peito, com seta
export const LinkPill: React.FC<{from: number; top?: number; arrow?: string}> = ({from, top = 1150, arrow}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 160, mass: 0.6}});
  const pulse = 1 + Math.sin((frame - from) / 5) * 0.03;
  const bob = Math.abs(Math.sin((frame - from) / 6)) * 16;
  return (
    <>
      <div style={{position: 'absolute', left: 210, top, width: 660, height: 132, borderRadius: 66, background: LIMEGRAD, border: `4px solid ${C.ink}`, boxShadow: '0 18px 44px rgba(0,20,40,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
        fontFamily: BODY, fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: 1.5, textTransform: 'uppercase', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.5, 1]) * pulse})`}}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
        Link na bio
      </div>
      <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={arrow ?? C.limeHi} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', left: 495, top: top - 110 - bob, opacity: s, filter: arrow ? undefined : 'drop-shadow(0 4px 10px rgba(0,0,0,.6))'}}><path d="M12 4v15M5.5 12.5L12 19l6.500-6.500" /></svg>
    </>
  );
};

// carimbo (caixa solida inclinada que bate na tela)
export const Stamp: React.FC<{from: number; to: number; text: string; top: number; size?: number; bg?: string; color?: string; rot?: number}> = ({from, to, text, top, size = 120, bg = C.red, color = '#fff', rot = -6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
  const out = interpolate(frame, [to - 6, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(1, s * 2, out)}}>
      <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: size, letterSpacing: -0.03 * size, lineHeight: 1, color, background: bg, padding: `${size * 0.16}px ${size * 0.36}px ${size * 0.2}px`, borderRadius: size * 0.2, boxShadow: '0 20px 50px rgba(0,0,0,.45)', whiteSpace: 'nowrap',
        transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`}}>
        {text}
      </div>
    </div>
  );
};

// palavra que sobe por tras de uma mascara
export const Rise: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({at, children, style, dy = 110}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 170, mass: 0.6}});
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
      <span style={{display: 'inline-block', transform: `translateY(${interpolate(s, [0, 1], [dy, 0])}%)`, ...style}}>{children}</span>
    </span>
  );
};

// casca das cenas de motion em tela cheia: entra deslizando com uma faixa verde-limao na frente
export const SceneShell: React.FC<{dur: number; children: React.ReactNode; bg: string; fadeOut?: boolean}> = ({dur, children, bg, fadeOut}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 200, stiffness: 170, mass: 0.6}});
  const b = spring({frame: frame - 3, fps, config: {damping: 200, stiffness: 150, mass: 0.6}});
  const out = fadeOut ? interpolate(frame, [dur - 8, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: LIMEGRAD, transform: `translateX(${interpolate(a, [0, 1], [1080, 0])}px)`}} />
      <AbsoluteFill style={{background: bg, overflow: 'hidden', transform: `translateX(${interpolate(b, [0, 1], [1080, 0])}px)`, boxShadow: '-30px 0 60px rgba(0,0,0,.35)'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
