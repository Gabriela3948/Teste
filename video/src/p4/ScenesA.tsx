import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import brazil from '@svg-maps/brazil';
import {BODY, C, LIMEGRAD, clamp, headStyle} from '../common/brand';
import {Icon} from '../common/Icons';
import {rnd} from '../common/Fx';
import {BgDark, BgLight, CL, Cursor, Header, Headline, card} from './Stage';
import {B, n} from './timing';

const useSp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number, cfg = {damping: 12, stiffness: 170, mass: 0.7}) => spring({frame: frame - at, fps, config: cfg});
};

/* ================= Cena 1: pontos de interesse no mapa ================= */
// mapa vetorial claro (ruas, avenidas, rio, parques), desenhado por codigo
const CityMap: React.FC = () => {
  const m = React.useMemo(() => {
    const r = rnd(21);
    const W = 1200, H = 1000, cx = W / 2, cy = H / 2;
    const streets: {x1: number; y1: number; x2: number; y2: number; major: boolean}[] = [];
    [-0.3, -0.3 + Math.PI / 2].forEach((ang, fam) => {
      const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
      let k = 0;
      for (let off = -760; off <= 760; off += 62 + r() * 26) {
        const px = cx + nx * off, py = cy + ny * off;
        streets.push({x1: px - dx * 1100, y1: py - dy * 1100, x2: px + dx * 1100, y2: py + dy * 1100, major: (k + fam) % 4 === 1});
        k++;
      }
    });
    return {W, H, streets};
  }, []);
  const lbl = (x: number, y: number, t: string, size = 17): React.ReactNode => <text x={x} y={y} fontFamily={BODY} fontWeight={700} fontSize={size} letterSpacing={3} fill="#8A97A4" textAnchor="middle">{t}</text>;
  return (
    <svg width={m.W} height={m.H} viewBox={`0 0 ${m.W} ${m.H}`}>
      <rect width={m.W} height={m.H} fill="#E7ECF0" />
      <path d="M 120 140 q 90 -50 190 -10 q 60 60 10 150 q -110 60 -190 0 q -60 -80 -10 -140 z" fill="#CFE9C8" />
      <path d="M 820 560 q 120 -40 200 30 q 30 110 -60 170 q -130 30 -180 -60 q -20 -90 40 -140 z" fill="#CFE9C8" />
      <path d="M 470 760 q 70 -30 130 10 q 20 70 -40 100 q -90 10 -110 -50 q -10 -40 20 -60 z" fill="#CFE9C8" />
      <path d="M -40 640 C 180 560, 300 700, 520 610 S 860 380, 1240 470" fill="none" stroke="#BCDDF4" strokeWidth={46} strokeLinecap="round" />
      {m.streets.map((s, i) => <line key={`c${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#D3DAE2" strokeWidth={s.major ? 26 : 12} />)}
      {m.streets.map((s, i) => <line key={`s${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#FFFFFF" strokeWidth={s.major ? 21 : 8.500} />)}
      <path d="M 60 880 C 260 520, 520 300, 1160 220" fill="none" stroke="#EBC766" strokeWidth={24} strokeLinecap="round" />
      <path d="M 60 880 C 260 520, 520 300, 1160 220" fill="none" stroke="#FBE6A6" strokeWidth={18} strokeLinecap="round" />
      {lbl(600, 505, 'GOIÂNIA', 30)}
      {lbl(330, 760, 'ST. BUENO')}
      {lbl(880, 360, 'JD. GOIÁS')}
      {lbl(250, 430, 'ST. OESTE')}
      {lbl(820, 840, 'JD. AMÉRICA')}
    </svg>
  );
};

const POIS = [
  {x: 226, y: 346, label: 'Posto', icon: 'fuel', color: '#F28B30', at: 107, left: false},
  {x: 676, y: 256, label: 'Hotel credenciado', icon: 'bed', color: '#17A398', at: 127, left: true},
  {x: 250, y: 640, label: 'Cliente', icon: 'user', color: '#3B7DED', at: 167, left: false},
  {x: 736, y: 512, label: 'Ponto de apoio', icon: 'support', color: '#E44165', at: 188, left: true},
];
export const S1_CUE = {btn: 23, click: 54, pins: POIS.map((p) => p.at)};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  const cardIn = sp(2, {damping: 16, stiffness: 110, mass: 0.9});
  const t = frame / (B[1] - B[0]);
  // trajetoria do cursor (coordenadas do cartao)
  const kf = [44, 54, 100, 106, 122, 126, 160, 166, 183, 187, 215];
  const xs = [1000, 792, 226, 226, 676, 676, 250, 250, 736, 736, 980];
  const ys = [-40, 62, 346, 346, 256, 256, 640, 640, 512, 512, 700];
  const E = {...CL, easing: Easing.inOut(Easing.cubic)};
  const curX = interpolate(frame, kf, xs, E), curY = interpolate(frame, kf, ys, E);
  const press = [S1_CUE.click, 104, 124, 164, 185].reduce((a, c) => Math.max(a, clamp(1 - Math.abs(frame - c) / 4, 0, 1)), 0);
  const btn = sp(S1_CUE.btn, {damping: 11, stiffness: 190, mass: 0.6});
  const armed = frame >= S1_CUE.click + 2;
  const count = POIS.filter((p) => frame >= p.at).length;
  return (
    <AbsoluteFill>
      <BgLight seed={3} />
      <Header idx={1} />
      <Headline lines={[[{t: 'Cadastre '}, {t: 'pontos de', hl: true}], [{t: 'interesse', hl: true}, {t: ' no mapa.'}]]} />

      <div style={{position: 'absolute', left: 70, top: 560, width: 940, height: 770, ...card({borderRadius: 44, border: '10px solid #fff', overflow: 'hidden', boxSizing: 'border-box'}),
        opacity: Math.min(1, cardIn * 1.5), transform: `translateY(${interpolate(cardIn, [0, 1], [140, 0])}px) scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`}}>
        <div style={{position: 'absolute', left: -120 - t * 40, top: -110 - t * 26, transform: `scale(${1 + t * 0.07})`, transformOrigin: '50% 50%'}}><CityMap /></div>

        {/* barra da plataforma */}
        <div style={{position: 'absolute', left: 26, top: 26, height: 68, borderRadius: 34, background: '#fff', boxShadow: '0 8px 22px rgba(3,37,56,.16)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px 0 20px', fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.head}}>
          <Icon name="pin" color={C.oliveHi} size={34} sw={2.2} />Pontos de interesse
        </div>
        <div style={{position: 'absolute', right: 26, top: 26, height: 68, borderRadius: 34, background: armed ? C.ink : LIMEGRAD, color: armed ? C.limeHi : C.ink, boxShadow: '0 8px 22px rgba(3,37,56,.2)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px 0 20px',
          fontFamily: BODY, fontWeight: 800, fontSize: 26, opacity: Math.min(1, btn * 1.6), transform: `scale(${interpolate(btn, [0, 1], [0.5, 1]) * (1 - press * (Math.abs(frame - S1_CUE.click) < 5 ? 0.1 : 0))})`, transformOrigin: '100% 50%'}}>
          <Icon name={armed ? 'pin' : 'plus'} color={armed ? C.limeHi : C.ink} size={32} sw={2.6} />{armed ? 'Clique no mapa' : 'Novo ponto'}
        </div>

        {/* pinos que caem conforme a narracao */}
        {POIS.map((p) => {
          const s = sp(p.at, {damping: 9, stiffness: 170, mass: 0.7});
          const chip = sp(p.at + 7, {damping: 14, stiffness: 180, mass: 0.6});
          const ring = interpolate(frame - p.at - 4, [0, 20], [0, 1], CL);
          if (frame < p.at) return null;
          return (
            <React.Fragment key={p.label}>
              <div style={{position: 'absolute', left: p.x - 70 * (0.3 + ring), top: p.y - 26 * (0.3 + ring), width: 140 * (0.3 + ring), height: 52 * (0.3 + ring), borderRadius: '50%', border: `4px solid ${p.color}`, opacity: (1 - ring) * 0.8}} />
              <div style={{position: 'absolute', left: p.x - 22, top: p.y - 8, width: 44, height: 16, borderRadius: '50%', background: 'rgba(3,37,56,.28)', filter: 'blur(4px)', transform: `scale(${s})`}} />
              <svg width={84} height={106} viewBox="0 0 84 106" style={{position: 'absolute', left: p.x - 42, top: p.y - 102, transform: `translateY(${interpolate(s, [0, 1], [-190, 0])}px)`, opacity: Math.min(1, s * 3), filter: 'drop-shadow(0 8px 10px rgba(3,37,56,.3))'}}>
                <path d="M42 102 C42 102 6 64 6 39 A36 36 0 1 1 78 39 C78 64 42 102 42 102 Z" fill={p.color} />
                <circle cx={42} cy={39} r={25} fill="#fff" />
              </svg>
              <div style={{position: 'absolute', left: p.x - 16, top: p.y - 79, transform: `translateY(${interpolate(s, [0, 1], [-190, 0])}px)`, opacity: Math.min(1, s * 3)}}><Icon name={p.icon} color={p.color} size={32} sw={2.3} /></div>
              <div style={{position: 'absolute', ...(p.left ? {right: 940 - 20 - p.x + 52} : {left: p.x + 52}), top: p.y - 92, background: '#fff', borderRadius: 20, padding: '12px 22px', boxShadow: '0 10px 24px rgba(3,37,56,.2)', display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap',
                fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.ink, opacity: Math.min(1, chip * 1.6), transform: `translateX(${interpolate(chip, [0, 1], [p.left ? 30 : -30, 0])}px)`}}>
                <span style={{width: 16, height: 16, borderRadius: 8, background: p.color}} />{p.label}
              </div>
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 26, bottom: 26, height: 60, borderRadius: 30, background: 'rgba(255,255,255,.96)', boxShadow: '0 8px 22px rgba(3,37,56,.16)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.head,
          opacity: interpolate(frame, [S1_CUE.pins[0] - 6, S1_CUE.pins[0] + 4], [0, 1], CL)}}>
          <span style={{background: LIMEGRAD, color: C.ink, borderRadius: 16, minWidth: 34, textAlign: 'center', padding: '2px 8px', fontWeight: 800}}>{count}</span>{count === 1 ? 'ponto no mapa' : 'pontos no mapa'}
        </div>
        <Cursor x={curX} y={curY} press={press} opacity={interpolate(frame, [42, 48, 208, 216], [0, 1, 1, 0], CL)} />
      </div>
    </AbsoluteFill>
  );
};

/* ================= Cena 2: cobertura de antenas 4G ================= */
type Loc = {id: string; name: string; path: string};
const BR = (brazil.default ?? brazil) as {viewBox: string; locations: Loc[]};
const COV: Record<string, string> = {am: '#8EAD00', rr: '#B6D150', ap: '#CDE66B', pa: '#A3C22B', ac: '#B6D150', ro: '#0CB198', to: '#CDE66B', mt: '#B6D150', ms: '#0CB198', go: '#12A088', df: '#CDE66B',
  ma: '#B6D150', pi: '#8EAD00', ce: '#CDE66B', rn: '#B6D150', pb: '#0CB198', pe: '#CDE66B', al: '#B6D150', se: '#0CB198', ba: '#8EAD00', mg: '#1C74B8', es: '#0CB198', rj: '#1C74B8', sp: '#155E9A', pr: '#0CB198', sc: '#1C74B8', rs: '#12A088'};
const TOWERS = [{x: 196, y: 152, at: 53}, {x: 372, y: 372, at: 59}, {x: 428, y: 470, at: 65}, {x: 586, y: 236, at: 71}];
export const S2_CUE = {towers: TOWERS.map((t) => t.at), call: 116, lost: 135, chip1: 186, chip2: 210};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  const dots = React.useMemo(() => {
    const r = rnd(8);
    const pal = ['#0E4F80', '#1C74B8', '#0CB198', '#CDE66B', '#0E4F80', '#12A088'];
    return Array.from({length: 300}, () => {
      const y = 60 + Math.pow(r(), 0.55) * 570; // mais denso ao sul
      return {x: 60 + r() * 540, y, r: 4 + r() * 11, c: pal[Math.floor(r() * pal.length)], d: r()};
    });
  }, []);
  const t = frame / (B[2] - B[1]);
  const K = 1.2; // escala do mapa
  const call = sp(S2_CUE.call, {damping: 10, stiffness: 190, mass: 0.7});
  // veiculo que sai da area de cobertura
  const v = interpolate(frame, [92, 132], [0, 1], {...CL, easing: Easing.inOut(Easing.quad)});
  const vx = interpolate(v, [0, 1], [372, 262]), vy = interpolate(v, [0, 1], [372, 268]);
  const lost = frame >= S2_CUE.lost;
  const blink = lost ? 0.55 + Math.sin((frame - S2_CUE.lost) / 2.2) * 0.45 : 0;
  return (
    <AbsoluteFill>
      <BgDark seed={5} />
      <Header dark idx={2} />
      <Headline dark lines={[[{t: 'Cobertura de'}], [{t: 'antenas 4G '}, {t: 'no mapa.', hl: true}]]} />

      <svg width={613 * K} height={639 * K} viewBox={BR.viewBox} style={{position: 'absolute', left: 16, top: 548, overflow: 'visible', transform: `scale(${1 + t * 0.04})`, transformOrigin: '45% 55%'}}>
        <defs><clipPath id="br">{BR.locations.map((l) => <path key={l.id} d={l.path} />)}</clipPath></defs>
        {BR.locations.map((l, i) => {
          const s = sp(6 + ((i * 37) % 27) * 1.3, {damping: 16, stiffness: 150, mass: 0.7});
          return <path key={l.id} d={l.path} fill={COV[l.id] ?? '#B6D150'} stroke={C.navy} strokeWidth={1.2} opacity={Math.min(1, s * 1.4)} />;
        })}
        <g clipPath="url(#br)">
          {dots.map((d, i) => {
            const a = clamp((frame - 22 - d.d * 34) / 8, 0, 1);
            return <circle key={i} cx={d.x} cy={d.y} r={d.r * a} fill={d.c} opacity={0.9} />;
          })}
        </g>
        {/* rota do veiculo */}
        <path d="M 372 372 L 262 268" fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="7 7" opacity={interpolate(frame, [90, 100], [0, 0.85], CL)} pathLength={undefined} />
        {TOWERS.map((tw, i) => {
          const s = sp(tw.at, {damping: 10, stiffness: 190, mass: 0.6});
          if (frame < tw.at) return null;
          return (
            <g key={i}>
              {[0, 1].map((k) => {
                const u = (((frame - tw.at) / 34 + k / 2) % 1 + 1) % 1;
                return <circle key={k} cx={tw.x} cy={tw.y} r={14 + u * 46} fill="none" stroke="#fff" strokeWidth={2.5} opacity={(1 - u) * 0.8} />;
              })}
              <circle cx={tw.x} cy={tw.y} r={19 * s} fill="#fff" stroke={C.navy} strokeWidth={2} />
            </g>
          );
        })}
        {frame >= 90 && (
          <g>
            {lost && <circle cx={vx} cy={vy} r={22 + blink * 16} fill="none" stroke={C.red} strokeWidth={3} opacity={1 - blink * 0.5} />}
            <circle cx={vx} cy={vy} r={17} fill={lost ? C.red : '#fff'} stroke={C.navy} strokeWidth={2} />
          </g>
        )}
      </svg>
      {/* icones sobre o mapa (em pixels de tela) */}
      {TOWERS.map((tw, i) => {
        const s = sp(tw.at, {damping: 10, stiffness: 190, mass: 0.6});
        return frame >= tw.at ? <div key={i} style={{position: 'absolute', left: 16 + tw.x * K - 15, top: 548 + tw.y * K - 15, transform: `scale(${s})`}}><Icon name="tower" color={C.navy} size={30} sw={2.2} /></div> : null;
      })}
      {frame >= 90 && <div style={{position: 'absolute', left: 16 + vx * K - 14, top: 548 + vy * K - 14}}><Icon name="car" color={lost ? '#fff' : C.navy} size={28} sw={2.2} /></div>}
      {lost && <div style={{position: 'absolute', left: 16 + vx * K - 150, top: 548 + vy * K - 86, background: C.red, color: '#fff', borderRadius: 12, padding: '6px 14px', fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 1.5, whiteSpace: 'nowrap', opacity: 0.6 + blink * 0.4}}>SEM SINAL</div>}

      <div style={{position: 'absolute', left: 566, top: 600, width: 454, borderRadius: 30, background: LIMEGRAD, boxShadow: '0 22px 50px rgba(0,0,0,.4)', padding: '26px 30px 30px', boxSizing: 'border-box', fontFamily: BODY, fontWeight: 800, fontSize: 48, lineHeight: 1.1, color: C.ink,
        opacity: Math.min(1, call * 1.6), transform: `scale(${interpolate(call, [0, 1], [0.5, 1])}) rotate(${interpolate(call, [0, 1], [6, 0])}deg)`, transformOrigin: '100% 0%'}}>
        Veículo<br />perdeu sinal?
      </div>
      {[{at: S2_CUE.chip1, top: 836, icon: 'tower', bg: C.teal, text: 'É a região'}, {at: S2_CUE.chip2, top: 956, icon: 'box', bg: C.orange, text: 'ou o equipamento'}].map((c) => {
        const s = sp(c.at, {damping: 12, stiffness: 180, mass: 0.6});
        return (
          <div key={c.text} style={{position: 'absolute', left: 566, top: c.top, width: 454, height: 100, ...card({borderRadius: 26}), display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', boxSizing: 'border-box', fontFamily: BODY, fontWeight: 800, fontSize: 34, color: C.ink,
            opacity: Math.min(1, s * 1.6), transform: `translateX(${interpolate(s, [0, 1], [90, 0])}px)`}}>
            <div style={{width: 66, height: 66, borderRadius: 18, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon name={c.icon} color="#fff" size={40} sw={2.1} /></div>{c.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================= Cena 3: assinatura digital ================= */
export const S3_CUE = {sign: 52, chip: 66, seal: 76, steps: [97, 105, 113]};
const SIGN = 'M 62 104 C 66 40, 112 14, 122 56 C 130 92, 86 124, 78 98 C 70 70, 132 50, 152 86 C 160 102, 152 112, 168 96 C 184 78, 190 58, 204 84 C 212 100, 220 106, 232 88 C 244 70, 254 62, 266 86 C 274 102, 290 100, 304 80 C 322 54, 348 48, 356 78 C 360 96, 344 106, 336 92 C 326 72, 372 58, 404 70 C 424 78, 442 70, 462 48';
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  const doc = sp(3, {damping: 15, stiffness: 120, mass: 0.9});
  const lines = [0.92, 0.78, 0.86, 0.6, 0.9, 0.7, 0.82, 0.48];
  const sg = interpolate(frame, [S3_CUE.sign, S3_CUE.sign + 22], [0, 1], {...CL, easing: Easing.inOut(Easing.quad)});
  const und = interpolate(frame, [S3_CUE.sign + 20, S3_CUE.sign + 28], [0, 1], CL);
  const seal = sp(S3_CUE.seal, {damping: 9, stiffness: 220, mass: 0.7});
  const chip = sp(S3_CUE.chip, {damping: 12, stiffness: 180, mass: 0.6});
  return (
    <AbsoluteFill>
      <BgLight seed={9} />
      <Header idx={3} />
      <Headline lines={[[{t: 'Contrato e '}, {t: 'assinatura', hl: true}], [{t: 'digital', hl: true}, {t: ' direto na Aldeia.'}]]} size={84} />

      <div style={{position: 'absolute', left: 190, top: 566, width: 640, height: 640, ...card({borderRadius: 30}), opacity: Math.min(1, doc * 1.5),
        transform: `translateY(${interpolate(doc, [0, 1], [160, 0])}px) rotate(${interpolate(doc, [0, 1], [-9, -2.500])}deg)`}}>
        <div style={{position: 'absolute', left: 44, top: 40, display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 62, height: 62, borderRadius: 18, background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="file" color={C.limeHi} size={38} sw={2} /></div>
          <div>
            <div style={{...headStyle(40, C.head)}}>Contrato de serviço</div>
            <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 20, color: '#8A97A4', marginTop: 2}}>Enviado pela plataforma</div>
          </div>
        </div>
        {lines.map((w, i) => (
          <div key={i} style={{position: 'absolute', left: 44, top: 146 + i * 34, height: 14, borderRadius: 7, background: '#E1E7EB', width: 552 * w * clamp((frame - 8 - i * 3) / 10, 0, 1)}} />
        ))}
        <div style={{position: 'absolute', left: 44, right: 44, top: 440, borderTop: '2px dashed #C9D2D9'}} />
        <div style={{position: 'absolute', left: 44, top: 590, fontFamily: BODY, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: '#8A97A4'}}>ASSINATURA DO CLIENTE</div>
        <div style={{position: 'absolute', left: 44, width: 470, top: 578, borderTop: `3px solid ${C.head}`}} />
        <svg width={520} height={150} style={{position: 'absolute', left: 40, top: 436}}>
          <path d={SIGN} fill="none" stroke={C.navy3} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - sg} />
          <path d="M 70 126 Q 260 146 460 112" fill="none" stroke={C.navy3} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - und} />
        </svg>
        {/* selo */}
        <div style={{position: 'absolute', right: -70, top: 396, display: 'flex', alignItems: 'center', gap: 12, background: LIMEGRAD, borderRadius: 22, padding: '14px 26px 14px 18px', boxShadow: '0 16px 36px rgba(3,37,56,.3)', fontFamily: BODY, fontWeight: 800, fontSize: 32, color: C.ink, whiteSpace: 'nowrap',
          opacity: Math.min(1, seal * 2), transform: `rotate(-6deg) scale(${interpolate(seal, [0, 1], [2.2, 1])})`}}>
          <div style={{width: 50, height: 50, borderRadius: 25, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="check" color={C.limeHi} size={34} sw={3.2} /></div>Assinado digitalmente
        </div>
        <div style={{position: 'absolute', right: -44, top: -30, display: 'flex', alignItems: 'center', gap: 10, background: C.ink, borderRadius: 30, padding: '12px 24px 12px 18px', boxShadow: '0 12px 28px rgba(3,37,56,.3)', fontFamily: BODY, fontWeight: 700, fontSize: 26, color: '#fff', whiteSpace: 'nowrap',
          opacity: Math.min(1, chip * 1.6), transform: `rotate(4deg) scale(${interpolate(chip, [0, 1], [0.4, 1])})`}}>
          <Icon name="layers" color={C.limeHi} size={30} sw={2.2} />Integrado com a <b style={{color: C.limeHi, fontWeight: 800}}>ClickSign</b>
        </div>
      </div>

      {/* envie, assine, acompanhe */}
      <div style={{position: 'absolute', left: 70, right: 70, top: 1250, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {['Enviado', 'Assinado', 'Concluído'].map((s, i) => {
          const a = sp(S3_CUE.steps[i], {damping: 11, stiffness: 200, mass: 0.6});
          return (
            <React.Fragment key={s}>
              {i > 0 && <div style={{flex: 1, height: 6, borderRadius: 3, margin: '0 10px', background: '#D5DDE2', overflow: 'hidden'}}><div style={{height: 6, background: C.oliveHi, width: `${clamp((frame - S3_CUE.steps[i] + 8) / 8, 0, 1) * 100}%`}} /></div>}
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: BODY, fontWeight: 800, fontSize: 30, color: C.head, opacity: 0.35 + Math.min(1, a) * 0.65}}>
                <div style={{width: 52, height: 52, borderRadius: 26, background: a > 0.05 ? LIMEGRAD : '#D5DDE2', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + Math.sin(Math.min(1, a) * Math.PI) * 0.25})`}}>
                  {a > 0.05 && <Icon name="check" color={C.ink} size={32} sw={3.2} />}
                </div>{s}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
export {n};
