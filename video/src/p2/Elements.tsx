import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {A1, A2, A3, S2, S3} from './timing';

const f = (s: number) => Math.round(s * 30);
const g1 = (src: number) => f(src - A1);
const g2 = (src: number) => S2 + f(src - A2);
const g3 = (src: number) => S3 + f(src - A3);
const GRAD = 'linear-gradient(90deg, #2F7FEA 0%, #3BD8B2 100%)';
const NAVY = '#141F52';
const RED = '#FF3B30';

const icons: Record<string, React.ReactNode> = {
  money: <><circle cx="12" cy="12" r="9" /><path d="M14.800 9.200c-.500-.900-1.500-1.400-2.800-1.400-1.700 0-2.900.800-2.900 2.100 0 3 5.900 1.300 5.900 4.200 0 1.300-1.200 2.100-3 2.100-1.400 0-2.500-.600-3-1.500M12 6v1.800M12 16.200V18" /></>,
  pin: <><path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z" /><circle cx="12" cy="10.500" r="2.400" /></>,
  chat: <><path d="M4 5.500h16v10.500H10l-4.500 3.500V16H4z" /><path d="M8 9.500h8M8 12.500h5" /></>,
  sheet: <><rect x="4" y="4.500" width="16" height="15" rx="2" /><path d="M4 9.500h16M4 14.500h16M10 4.500v15" /></>,
};
const Icon: React.FC<{name: string; color: string; size?: number}> = ({name, color, size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>
);

// os quatro "sistemas soltos" citados no take 1
const items = [
  {label: 'Financeiro', icon: 'money', at: g1(6.7), x: 60, y: 258, rot: -3, dx: -22, dy: -12},
  {label: 'Rastreamento', icon: 'pin', at: g1(8.05), x: 550, y: 258, rot: 2.5, dx: 22, dy: -14},
  {label: 'Grupo de WhatsApp', icon: 'chat', at: g1(9.45), x: 60, y: 346, rot: 2, dx: -20, dy: 14},
  {label: 'Planilha de chip', icon: 'sheet', at: g1(10.85), x: 550, y: 346, rot: -2.5, dx: 22, dy: 16},
];
const BREAK = g1(12.85); // "nenhum dos sistemas conversa entre si"
const REWORK = g1(15.05); // "todo erro vira retrabalho seu"
const JOIN = g2(3.1); // "junta tudo isso"
const ONE = g2(4.4); // "em uma só plataforma"
const OUT1 = g2(5.5) + 4;

const Pill: React.FC<{it: (typeof items)[number]; i: number}> = ({it, i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame: frame - it.at, fps, config: {damping: 13, stiffness: 170, mass: 0.6}});
  const brk = spring({frame: frame - BREAK - i * 2, fps, config: {damping: 9, stiffness: 120, mass: 0.7}});
  const join = spring({frame: frame - JOIN - i * 2, fps, config: {damping: 20, stiffness: 110, mass: 0.8}});
  if (frame < it.at || frame > ONE + 6) return null;
  const shake = frame >= REWORK && frame < JOIN ? Math.sin((frame - REWORK) * 1.7 + i) * interpolate(frame, [REWORK, REWORK + 26], [7, 0], {extrapolateRight: 'clamp'}) : 0;
  const bad = interpolate(frame, [BREAK, BREAK + 8, JOIN, JOIN + 8], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cx = 540 - 235, cy = 300;
  const x = interpolate(join, [0, 1], [it.x + it.dx * brk, cx]) + shake;
  const y = interpolate(join, [0, 1], [it.y + it.dy * brk, cy]);
  const color = bad > 0.5 ? RED : '#2F7FEA';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 470, height: 76, borderRadius: 20, background: '#fff', border: `3px solid ${color}`,
      boxShadow: '0 14px 34px rgba(8,14,40,.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', boxSizing: 'border-box',
      fontFamily: 'Montserrat', fontWeight: 700, fontSize: 29, color: '#1b1f2e', letterSpacing: -0.3,
      opacity: Math.min(inn, interpolate(join, [0.75, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})),
      transform: `scale(${interpolate(inn, [0, 1], [0.6, 1]) * interpolate(join, [0, 1], [1, 0.7])}) rotate(${it.rot * brk * (1 - join)}deg)`}}>
      <span>{it.label}</span>
      <Icon name={it.icon} color={color} size={38} />
    </div>
  );
};

// contador: "?" -> 1 -> 2 -> 3 -> 4 sistemas
const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = g1(2.9);
  if (frame < start || frame > JOIN + 10) return null;
  const inn = spring({frame: frame - start, fps, config: {damping: 13, stiffness: 150, mass: 0.7}});
  const out = interpolate(frame, [JOIN, JOIN + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const n = items.filter((it) => frame >= it.at).length;
  const last = n ? items[n - 1].at : start;
  const bump = spring({frame: frame - last, fps, config: {damping: 9, stiffness: 220, mass: 0.5}});
  const bad = frame >= BREAK;
  return (
    <div style={{position: 'absolute', left: 60, top: 128, display: 'flex', alignItems: 'center', gap: 20, opacity: Math.min(inn, out), transform: `translateY(${interpolate(inn, [0, 1], [-40, 0])}px)`}}>
      <div style={{width: 106, height: 106, borderRadius: 53, background: bad ? RED : GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 34px rgba(8,14,40,.4)',
        fontFamily: 'Montserrat', fontWeight: 800, fontSize: 62, color: '#fff', transform: `scale(${interpolate(bump, [0, 1], [0.7, 1])})`}}>
        {n === 0 ? '?' : n}
      </div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 42, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05, textShadow: '0 3px 12px rgba(0,0,0,.7)'}}>
        {n <= 1 ? 'sistema' : 'sistemas'}<br />
        <span style={{fontSize: 26, fontWeight: 700, opacity: 0.92, letterSpacing: 0.5}}>{bad ? 'que não se conversam' : 'na sua central'}</span>
      </div>
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
    <div style={{position: 'absolute', left: 540 - 330 * (0.4 + ring), top: top + 90 - 330 * (0.4 + ring), width: 660 * (0.4 + ring), height: 660 * (0.4 + ring), borderRadius: '50%', border: '6px solid #3BD8B2', opacity: (1 - ring) * 0.9}} />
    <div style={{position: 'absolute', left: 230, top, width: 620, height: 180, borderRadius: 38, background: NAVY, boxShadow: '0 22px 50px rgba(8,14,40,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: Math.min(1, inn * 1.4, out), transform: `scale(${interpolate(inn, [0, 1], [0.6, 1])})`}}>
      <Img src={staticFile('p2/logo_tec.png')} style={{height: 86}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 25, letterSpacing: 2.5, textTransform: 'uppercase', color: '#fff', background: GRAD, padding: '4px 18px', borderRadius: 12}}>Uma só plataforma</div>
    </div>
    </>
  );
};

// fim do take 2: os tres produtos juntos
const prods = ['p2/gst_logo.png', 'p2/trk_logo.png', 'p2/con_logo.png'];
const Trio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = g2(14.7), to = S3 + 2;
  if (frame < from || frame > to) return null;
  const out = interpolate(frame, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      {prods.map((p, i) => {
        const s = spring({frame: frame - from - i * 5, fps, config: {damping: 13, stiffness: 160, mass: 0.6}});
        return (
          <div key={p} style={{position: 'absolute', left: 60 + i * 325, top: 128, width: 310, height: 106, borderRadius: 24, background: '#fff', boxShadow: '0 14px 34px rgba(8,14,40,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: Math.min(s, out), transform: `translateY(${interpolate(s, [0, 1], [-50, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`}}>
            <Img src={staticFile(p)} style={{width: 236}} />
          </div>
        );
      })}
    </>
  );
};

// take 3: o que esta fragmentado se une; depois "link na bio"
const frag = [
  {icon: 'money', x: 80, y: 190, r: -14}, {icon: 'pin', x: 350, y: 140, r: 10}, {icon: 'chat', x: 630, y: 200, r: -8}, {icon: 'sheet', x: 880, y: 150, r: 16},
];
const Fragments: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = g3(3.2), unite = g3(4.2), done = g3(5.0);
  if (frame < from || frame > done + 4) return null;
  const u = spring({frame: frame - unite, fps, config: {damping: 18, stiffness: 120, mass: 0.8}});
  return (
    <>
      {frag.map((it, i) => {
        const s = spring({frame: frame - from - i * 3, fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
        const fl = Math.sin((frame + i * 9) / 9) * 8 * (1 - u);
        return (
          <div key={i} style={{position: 'absolute', left: interpolate(u, [0, 1], [it.x, 490]), top: interpolate(u, [0, 1], [it.y, 210]) + fl, width: 100, height: 100, borderRadius: 28, background: '#fff', border: '3px solid #2F7FEA', boxShadow: '0 14px 34px rgba(8,14,40,.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(s, interpolate(u, [0.7, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})), transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${it.r * (1 - u)}deg)`}}>
            <Icon name={it.icon} color="#2F7FEA" size={52} />
          </div>
        );
      })}
    </>
  );
};

const LinkBio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const from = g3(6.85);
  if (frame < from) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 160, mass: 0.6}});
  const pulse = 1 + Math.sin((frame - from) / 5) * 0.025;
  return (
    <div style={{position: 'absolute', left: 250, top: 205, width: 580, height: 116, borderRadius: 58, background: GRAD, boxShadow: '0 18px 44px rgba(8,14,40,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
      fontFamily: 'Montserrat', fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.6, 1]) * pulse})`}}>
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1" /><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" /></svg>
      Link na bio
    </div>
  );
};

const Cross: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < BREAK || frame > JOIN + 6) return null;
  const s = spring({frame: frame - BREAK, fps, config: {damping: 9, stiffness: 200, mass: 0.6}});
  const out = interpolate(frame, [JOIN, JOIN + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 540 - 46, top: 340 - 46, width: 92, height: 92, borderRadius: 46, background: RED, boxShadow: '0 10px 30px rgba(255,59,48,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, s * 1.5, out), transform: `scale(${interpolate(s, [0, 1], [0.2, 1])}) rotate(${interpolate(s, [0, 1], [-90, 0])}deg)`}}>
      <svg width="50" height="50" viewBox="0 0 24 24" stroke="#fff" strokeWidth="3.400" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </div>
  );
};

const Stamp: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = REWORK + 6;
  if (frame < at || frame > S2 + 2) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
  const out = interpolate(frame, [S2 - 6, S2 + 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 190, top: 1090, width: 700, height: 150, borderRadius: 26, border: `8px solid ${RED}`, background: 'rgba(255,59,48,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 800, fontSize: 84, letterSpacing: 4, color: RED, textTransform: 'uppercase', textShadow: '0 4px 18px rgba(0,0,0,.45)',
      opacity: Math.min(1, s * 2, out), transform: `rotate(-7deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`}}>
      Retrabalho
    </div>
  );
};

export const CUES = {start: g1(2.9), items: items.map((i) => i.at), BREAK, REWORK, JOIN, ONE, trio: g2(14.7), one2: g2(15.45), frag: g3(3.2), unite: g3(4.2), one3: g3(4.75), link: g3(6.85)};

export const Elements: React.FC = () => (
  <AbsoluteFill>
    <Counter />
    {items.map((it, i) => <Pill key={it.label} it={it} i={i} />)}
    <Cross />
    <Stamp />
    <Badge from={ONE - 4} to={OUT1} top={215} />
    <Trio />
    <Badge from={g2(15.45)} to={S3 + 2} top={250} />
    <Fragments />
    <Badge from={g3(4.75)} to={g3(6.7)} top={170} />
    <LinkBio />
  </AbsoluteFill>
);

// flash de luz na troca de takes
export const LightFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -7 || d > 12) return null;
  const o = d < 0 ? interpolate(d, [-7, 0], [0, 0.92]) : interpolate(d, [0, 12], [0.92, 0]);
  const sweep = interpolate(d, [-7, 12], [-60, 160]);
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse 90% 60% at ${sweep}% 35%, rgba(255,255,255,1) 0%, rgba(214,240,255,.92) 35%, rgba(170,225,235,.55) 70%, rgba(255,255,255,.35) 100%)`, mixBlendMode: 'screen'}} />
  );
};
