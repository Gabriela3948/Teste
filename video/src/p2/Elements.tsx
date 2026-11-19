import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {A1, A2, A3, S2, S3} from './timing';
import {CONNECT, GESTOR, RED, TEC, TRACKING, dots} from './brand';

const f = (s: number) => Math.round(s * 30);
const g1 = (src: number) => f(src - A1);
const g2 = (src: number) => S2 + f(src - A2);
const g3 = (src: number) => S3 + f(src - A3);

const icons: Record<string, React.ReactNode> = {
  money: <><circle cx="12" cy="12" r="9" /><path d="M14.800 9.200c-.500-.900-1.500-1.400-2.800-1.400-1.700 0-2.900.800-2.900 2.100 0 3 5.900 1.300 5.900 4.200 0 1.300-1.200 2.100-3 2.100-1.400 0-2.500-.600-3-1.500M12 6v1.800M12 16.200V18" /></>,
  pin: <><path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z" /><circle cx="12" cy="10.500" r="2.400" /></>,
  chat: <><path d="M4 5.500h16v10.500H10l-4.500 3.500V16H4z" /><path d="M8 9.500h8M8 12.500h5" /></>,
  sheet: <><rect x="4" y="4.500" width="16" height="15" rx="2" /><path d="M4 9.500h16M4 14.500h16M10 4.500v15" /></>,
  broken: <><path d="M9.500 14.500l-2 2a3.200 3.200 0 0 1-4.500-4.500l2-2M14.500 9.500l2-2a3.200 3.200 0 0 1 4.500 4.500l-2 2" transform="translate(0 0)" /><path d="M8 3.500v2.500M3.500 8h2.500M16 20.500V18M20.500 16H18" /></>,
};
const Icon: React.FC<{name: string; color: string; size?: number}> = ({name, color, size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>
);

const items = [
  {label: 'Financeiro', icon: 'money', at: g1(6.7)},
  {label: 'Rastreamento', icon: 'pin', at: g1(8.05)},
  {label: 'Grupo de WhatsApp', icon: 'chat', at: g1(9.45)},
  {label: 'Planilha de chip', icon: 'sheet', at: g1(10.85)},
];
const PANEL = g1(6.25);
const BREAK = g1(12.85);
const REWORK = g1(15.05);
const JOIN = g2(3.1);
const ONE = g2(4.4);
const OUT1 = g2(5.5) + 6;
export const CUES = {panel: PANEL, items: items.map((i) => i.at), BREAK, REWORK, JOIN, ONE, trio: g2(14.75), one2: g2(15.5), frag: g3(3.2), unite: g3(4.2), one3: g3(4.75), link: g3(6.85)};

const ROW = 122, GAP = 14, HEAD = 96, PAD = 30;
const FULL = HEAD + items.length * (ROW + GAP) + PAD;

// painel "sua central hoje": os sistemas soltos entram, se desconectam e depois viram uma so plataforma
const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < PANEL || frame > OUT1) return null;
  const inn = spring({frame: frame - PANEL, fps, config: {damping: 16, stiffness: 120, mass: 0.8}});
  const brk = spring({frame: frame - BREAK, fps, config: {damping: 8, stiffness: 150, mass: 0.7}});
  const join = spring({frame: frame - JOIN, fps, config: {damping: 22, stiffness: 100, mass: 0.9}});
  const one = spring({frame: frame - ONE, fps, config: {damping: 13, stiffness: 150, mass: 0.7}});
  const up = spring({frame: frame - ONE - 8, fps, config: {damping: 20, stiffness: 90, mass: 0.9}});
  const out = interpolate(frame, [OUT1 - 8, OUT1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bad = frame >= BREAK && frame < JOIN + 4;
  const hit = frame - (REWORK + 6);
  const shake = hit >= 0 && hit < 10 ? Math.sin(hit * 2.8) * (10 - hit) * 1.5 : 0;
  const n = items.filter((it) => frame >= it.at).length;
  const h = interpolate(join, [0, 1], [FULL, 270]);
  const ring = interpolate(frame - ONE, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 50, top: interpolate(up, [0, 1], [118, 120]), width: 980, height: h, transformOrigin: '50% 0%',
      transform: `translate(${shake}px, ${interpolate(inn, [0, 1], [-780, 0])}px) scale(${interpolate(up, [0, 1], [1, 0.72])})`, opacity: out}}>
      {frame >= ONE && <div style={{position: 'absolute', left: 490 - 520 * (0.3 + ring), top: 135 - 520 * (0.3 + ring), width: 1040 * (0.3 + ring), height: 1040 * (0.3 + ring), borderRadius: '50%', border: `7px solid ${TEC.mint}`, opacity: (1 - ring) * 0.9}} />}
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, overflow: 'hidden', background: `linear-gradient(150deg, #0A22A8 0%, ${TEC.blue} 60%)`, border: `2px solid ${bad ? RED : 'rgba(205,233,194,.35)'}`, boxShadow: '0 30px 70px rgba(0,8,60,.55)'}}>
        <div style={{position: 'absolute', inset: 0, ...dots(TEC.mint, 0.13)}} />

        {/* cabecalho */}
        <div style={{position: 'absolute', left: 36, right: 36, top: 26, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 1 - join, fontFamily: 'Montserrat'}}>
          <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 3, textTransform: 'uppercase', color: bad ? '#FF8B78' : TEC.mint}}>{bad ? 'Nenhum conversa entre si' : 'Sua central hoje'}</div>
          <div style={{fontWeight: 800, fontSize: 30, color: bad ? '#fff' : TEC.blue, background: bad ? RED : TEC.mint, padding: '6px 20px', borderRadius: 30}}>{n} {n === 1 ? 'sistema' : 'sistemas'}</div>
        </div>

        {/* linhas */}
        {items.map((it, i) => {
          const s = spring({frame: frame - it.at, fps, config: {damping: 13, stiffness: 170, mass: 0.6}});
          if (frame < it.at) return null;
          const dir = i % 2 ? 1 : -1;
          const y = HEAD + i * (ROW + GAP);
          return (
            <div key={it.label} style={{position: 'absolute', left: 30, right: 30, top: interpolate(join, [0, 1], [y, 74]), height: ROW, borderRadius: 26, boxSizing: 'border-box',
              background: bad ? 'rgba(233,66,37,.2)' : 'rgba(255,255,255,.09)', border: `2px solid ${bad ? RED : 'rgba(255,255,255,.14)'}`, display: 'flex', alignItems: 'center', gap: 26, padding: '0 30px',
              opacity: Math.min(s, 1 - join), transform: `translateX(${interpolate(s, [0, 1], [120, 0]) + dir * 20 * brk * (1 - join)}px) rotate(${dir * 1.6 * brk * (1 - join)}deg) scale(${interpolate(join, [0, 1], [1, 0.8])})`}}>
              <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 38, color: bad ? '#FF8B78' : TEC.mint, width: 62}}>0{i + 1}</div>
              <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: 46, color: '#fff', flex: 1, letterSpacing: -0.5}}>{it.label}</div>
              <div style={{width: 76, height: 76, borderRadius: 22, background: bad ? RED : TEC.mint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={bad ? 'broken' : it.icon} color={bad ? '#fff' : TEC.blue} size={46} />
              </div>
            </div>
          );
        })}

        {/* uma so plataforma */}
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: Math.min(1, one * 1.5), transform: `scale(${interpolate(one, [0, 1], [0.6, 1])})`}}>
          <Img src={staticFile('p2/logo_tec.png')} style={{height: 118}} />
          <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 34, letterSpacing: 3, textTransform: 'uppercase', color: TEC.blue, background: TEC.mint, padding: '6px 26px', borderRadius: 14}}>Uma só plataforma</div>
        </div>
      </div>

      {/* carimbo */}
      {frame >= REWORK + 6 && frame < JOIN && (() => {
        const s = spring({frame: frame - REWORK - 6, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
        return (
          <div style={{position: 'absolute', left: 130, top: 250, width: 720, height: 170, borderRadius: 28, border: `9px solid ${RED}`, background: 'rgba(20,6,4,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Montserrat', fontWeight: 800, fontSize: 92, letterSpacing: 4, color: '#FF5A42', textTransform: 'uppercase', opacity: Math.min(1, s * 2) * (1 - join), transform: `rotate(-7deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`}}>
            Retrabalho
          </div>
        );
      })()}
    </div>
  );
};

const Badge: React.FC<{from: number; to: number; top: number}> = ({from, to, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to) return null;
  const inn = spring({frame: frame - from, fps, config: {damping: 12, stiffness: 150, mass: 0.7}});
  const out = interpolate(frame, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ring = interpolate(frame - from, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 360 * (0.4 + ring), top: top + 95 - 360 * (0.4 + ring), width: 720 * (0.4 + ring), height: 720 * (0.4 + ring), borderRadius: '50%', border: `6px solid ${TEC.mint}`, opacity: (1 - ring) * 0.9}} />
      <div style={{position: 'absolute', left: 200, top, width: 680, height: 190, borderRadius: 40, overflow: 'hidden', background: `linear-gradient(150deg, #0A22A8 0%, ${TEC.blue} 60%)`, border: '2px solid rgba(205,233,194,.35)', boxShadow: '0 22px 50px rgba(0,8,60,.55)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: Math.min(1, inn * 1.4, out), transform: `scale(${interpolate(inn, [0, 1], [0.6, 1])})`}}>
        <div style={{position: 'absolute', inset: 0, ...dots(TEC.mint, 0.13)}} />
        <Img src={staticFile('p2/logo_tec.png')} style={{height: 86}} />
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 25, letterSpacing: 2.5, textTransform: 'uppercase', color: TEC.blue, background: TEC.mint, padding: '4px 18px', borderRadius: 10}}>Uma só plataforma</div>
      </div>
    </>
  );
};

// fim do take 2: os tres produtos, cada um na sua cor oficial
const prods = [{logo: 'p2/lg_gestor.png', bg: GESTOR.dark, ac: GESTOR.accent}, {logo: 'p2/lg_tracking.png', bg: TRACKING.dark, ac: TRACKING.accent}, {logo: 'p2/lg_connect.png', bg: CONNECT.dark, ac: CONNECT.accent}];
const Trio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = CUES.trio, to = S3 + 2;
  if (frame < from || frame > to) return null;
  const out = interpolate(frame, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      {prods.map((p, i) => {
        const s = spring({frame: frame - from - i * 5, fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
        return (
          <div key={p.logo} style={{position: 'absolute', left: 50 + i * 332, top: 120, width: 316, height: 112, borderRadius: 26, background: p.bg, borderBottom: `6px solid ${p.ac}`, boxShadow: '0 14px 34px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: Math.min(s, out), transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`}}>
            <Img src={staticFile(p.logo)} style={{width: 246}} />
          </div>
        );
      })}
    </>
  );
};

const frag = [{icon: 'money', x: 80, y: 190, r: -14}, {icon: 'pin', x: 350, y: 140, r: 10}, {icon: 'chat', x: 630, y: 200, r: -8}, {icon: 'sheet', x: 880, y: 150, r: 16}];
const Fragments: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = CUES.frag, unite = CUES.unite, done = g3(5.0);
  if (frame < from || frame > done + 4) return null;
  const u = spring({frame: frame - unite, fps, config: {damping: 18, stiffness: 120, mass: 0.8}});
  return (
    <>
      {frag.map((it, i) => {
        const s = spring({frame: frame - from - i * 3, fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
        const fl = Math.sin((frame + i * 9) / 9) * 8 * (1 - u);
        return (
          <div key={i} style={{position: 'absolute', left: interpolate(u, [0, 1], [it.x, 490]), top: interpolate(u, [0, 1], [it.y, 215]) + fl, width: 104, height: 104, borderRadius: 28, background: TEC.mint, boxShadow: '0 14px 34px rgba(0,8,60,.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(s, interpolate(u, [0.7, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})), transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${it.r * (1 - u)}deg)`}}>
            <Icon name={it.icon} color={TEC.blue} size={56} />
          </div>
        );
      })}
    </>
  );
};

const LinkBio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = CUES.link;
  if (frame < from) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 160, mass: 0.6}});
  const pulse = 1 + Math.sin((frame - from) / 5) * 0.03;
  return (
    <div style={{position: 'absolute', left: 230, top: 200, width: 620, height: 124, borderRadius: 62, background: TEC.mint, border: `4px solid ${TEC.blue}`, boxShadow: '0 18px 44px rgba(0,8,60,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
      fontFamily: 'Montserrat', fontWeight: 800, fontSize: 48, color: TEC.blue, letterSpacing: 1.5, textTransform: 'uppercase', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.6, 1]) * pulse})`}}>
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={TEC.blue} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1" /><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" /></svg>
      Link na bio
    </div>
  );
};

export const Elements: React.FC = () => (
  <AbsoluteFill>
    <Panel />
    <Trio />
    <Badge from={CUES.one2} to={S3 + 2} top={250} />
    <Fragments />
    <Badge from={CUES.one3} to={g3(6.7)} top={165} />
    <LinkBio />
  </AbsoluteFill>
);

export const LightFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -7 || d > 12) return null;
  const o = d < 0 ? interpolate(d, [-7, 0], [0, 0.92]) : interpolate(d, [0, 12], [0.92, 0]);
  const sweep = interpolate(d, [-7, 12], [-60, 160]);
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse 90% 60% at ${sweep}% 35%, rgba(255,255,255,1) 0%, rgba(214,240,255,.92) 35%, rgba(205,233,194,.55) 70%, rgba(255,255,255,.35) 100%)`, mixBlendMode: 'screen'}} />
  );
};
