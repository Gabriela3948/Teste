import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from './logoParts.json';
import {TEC} from './brand';

type Part = {f: string; x: number; y: number; w: number; h: number; kind: string};
const parts = data.parts as Part[];
const mark = parts.filter((p) => p.kind === 'mark'); // [cunha, corpo do A]
const top = parts.filter((p) => p.kind === 'top'); // A L D E I A
const bot = parts.filter((p) => p.kind === 'bot'); // T E C N O L O G I A

// Logo montada em movimento: simbolo se encaixa, letras sobem por tras de uma mascara, brilho no final
export const LogoReveal: React.FC<{start: number; height: number; tag?: boolean; speed?: number}> = ({start, height, tag = true, speed = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame - start) * speed;
  const k = height / data.H;
  const sp = (d: number, cfg = {damping: 13, stiffness: 150, mass: 0.7}) => spring({frame: t - d, fps, config: cfg});
  const body = sp(0, {damping: 11, stiffness: 120, mass: 0.8});
  const wedge = sp(5, {damping: 10, stiffness: 170, mass: 0.6});
  const shine = interpolate(t, [24, 46], [-30, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tagS = sp(22, {damping: 16, stiffness: 130, mass: 0.7});
  const pos = (p: Part): React.CSSProperties => ({position: 'absolute', left: p.x * k, top: p.y * k, width: p.w * k, height: p.h * k});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: height * 0.12}}>
      <div style={{position: 'relative', width: data.W * k, height, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.6))'}}>
        {/* simbolo: corpo gira e assenta; a cunha entra por baixo e trava */}
        <Img src={staticFile(`p2/logo/${mark[1].f}`)} style={{...pos(mark[1]), opacity: Math.min(1, body * 2.2), transformOrigin: '50% 70%',
          transform: `translate(${interpolate(body, [0, 1], [-90 * k, 0])}px, ${interpolate(body, [0, 1], [-160 * k, 0])}px) rotate(${interpolate(body, [0, 1], [-95, 0])}deg) scale(${interpolate(body, [0, 1], [0.35, 1])})`}} />
        <Img src={staticFile(`p2/logo/${mark[0].f}`)} style={{...pos(mark[0]), opacity: Math.min(1, wedge * 2.2),
          transform: `translate(${interpolate(wedge, [0, 1], [-260 * k, 0])}px, ${interpolate(wedge, [0, 1], [90 * k, 0])}px) scale(${interpolate(wedge, [0, 1], [0.5, 1])})`}} />

        {/* ALDEIA: cada letra sobe por tras da mascara */}
        {top.map((p, i) => {
          const s = sp(7 + i * 2.2, {damping: 14, stiffness: 190, mass: 0.6});
          return (
            <div key={p.f} style={{...pos(p), overflow: 'hidden', paddingBottom: 2}}>
              <Img src={staticFile(`p2/logo/${p.f}`)} style={{width: '100%', height: p.h * k, transform: `translateY(${interpolate(s, [0, 1], [112, 0])}%)`}} />
            </div>
          );
        })}

        {/* TECNOLOGIA: letras chegam espacadas e fecham */}
        {bot.map((p, i) => {
          const s = sp(17 + i * 1.1, {damping: 18, stiffness: 160, mass: 0.6});
          return <Img key={p.f} src={staticFile(`p2/logo/${p.f}`)} style={{...pos(p), opacity: s, transform: `translateX(${interpolate(s, [0, 1], [(i + 2) * 9 * k, 0])}px)`}} />;
        })}

        {/* brilho passando so por cima da logo */}
        <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `url(${staticFile('p2/logo_tec.png')})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile('p2/logo_tec.png')})`, maskSize: '100% 100%',
          background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine - 16}%, rgba(255,255,255,.95) ${shine}%, rgba(255,255,255,0) ${shine + 16}%)`, opacity: t > 22 && t < 48 ? 1 : 0}} />
      </div>

      {tag && (
        <div style={{position: 'relative', overflow: 'hidden', borderRadius: height * 0.09, clipPath: `inset(0 ${interpolate(tagS, [0, 1], [100, 0])}% 0 0 round ${height * 0.09}px)`}}>
          <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: height * 0.23, letterSpacing: height * 0.02, textTransform: 'uppercase', color: TEC.blue, background: TEC.mint, padding: `${height * 0.035}px ${height * 0.16}px`, whiteSpace: 'nowrap'}}>
            <span style={{display: 'inline-block', transform: `translateX(${interpolate(tagS, [0, 1], [-40, 0])}px)`}}>Uma só plataforma</span>
          </div>
        </div>
      )}
    </div>
  );
};
