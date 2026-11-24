import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, LIMEGRAD, clamp, headStyle} from '../common/brand';
import {Icon} from '../common/Icons';
import {MapLines, Mark, Rise, SceneShell, Stamp} from '../common/Fx';

type SState = 'ok' | 'down' | 'active';
const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// servidor ilustrado: gabinete com 3 baias, leds e aletas
const Server: React.FC<{x: number; y: number; w: number; h: number; label?: string; labelRight?: boolean; state: SState; appear: number; theme: 'grey' | 'navy'; tilt?: number; dy?: number; shake?: number}> = ({x, y, w, h, label, labelRight, state, appear, theme, tilt = 0, dy = 0, shake = 0}) => {
  const frame = useCurrentFrame();
  const pal = theme === 'grey' ? {a: '#3D4A58', b: '#262F39', bay: 'rgba(0,0,0,.36)', line: 'rgba(255,255,255,.16)'} : {a: '#2F6883', b: '#1A4359', bay: 'rgba(0,22,36,.45)', line: 'rgba(255,255,255,.22)'};
  const led = state === 'down' ? C.red : C.limeHi;
  const pad = w * 0.09, gap = h * 0.045, bh = (h - pad * 2 - gap * 2) / 3;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transformOrigin: '50% 100%', opacity: Math.min(1, appear * 1.6),
      transform: `translate(${shake}px, ${dy}px) rotate(${tilt}deg) scale(${interpolate(appear, [0, 1], [0.5, 1])})`}}>
      {state === 'active' && <div style={{position: 'absolute', inset: -14, borderRadius: w * 0.14, boxShadow: `0 0 0 4px ${C.limeHi}, 0 0 60px 10px rgba(217,248,114,.55)`, opacity: 0.75 + Math.sin(frame / 4) * 0.25}} />}
      <div style={{position: 'absolute', inset: 0, borderRadius: w * 0.1, background: `linear-gradient(160deg, ${pal.a} 0%, ${pal.b} 100%)`, border: `2px solid ${state === 'down' ? 'rgba(233,66,37,.8)' : pal.line}`, boxShadow: '0 24px 50px rgba(0,0,0,.4)',
        filter: state === 'down' ? 'saturate(.35) brightness(.72)' : undefined, overflow: 'hidden'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: pad, right: pad, top: pad + i * (bh + gap), height: bh, borderRadius: w * 0.05, background: pal.bay, display: 'flex', alignItems: 'center', padding: `0 ${w * 0.07}px`, gap: w * 0.045, boxSizing: 'border-box'}}>
            {[0, 1].map((j) => {
              const on = state === 'down' ? 0.85 : clamp(0.55 + Math.sin(frame / 4 + i * 1.7 + j * 2.3) * 0.6, 0.25, 1);
              return <div key={j} style={{width: w * 0.062, height: w * 0.062, borderRadius: '50%', background: led, opacity: on, boxShadow: `0 0 ${w * 0.05}px ${led}`}} />;
            })}
            <div style={{flex: 1}} />
            {[0, 1, 2, 3, 4].map((j) => <div key={j} style={{width: w * 0.022, height: bh * 0.5, borderRadius: 3, background: 'rgba(255,255,255,.2)'}} />)}
          </div>
        ))}
      </div>
      {label && (
        <div style={{position: 'absolute', left: labelRight ? w * 0.76 : -w * 0.1, top: -w * 0.1, width: w * 0.34, height: w * 0.34, borderRadius: '50%', background: state === 'down' ? C.red : LIMEGRAD, color: state === 'down' ? '#fff' : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: BODY, fontWeight: 800, fontSize: w * 0.19, boxShadow: '0 8px 20px rgba(0,0,0,.35)'}}>{label}</div>
      )}
    </div>
  );
};

const Tag: React.FC<{at: number; x: number; y: number; text: string; bg: string; color: string; rot?: number}> = ({at, x, y, text, bg, color, rot = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 10, stiffness: 220, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 2, textTransform: 'uppercase', color, background: bg, padding: '10px 22px', borderRadius: 14, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.4)',
      opacity: Math.min(1, s * 2), transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.3, 1])})`, transformOrigin: '0% 100%'}}>{text}</div>
  );
};

/* ---------- Cena 1: outras plataformas — tudo em um servidor so, que cai ---------- */
const NODES = [
  {x: 140, icon: 'database', at: 8}, {x: 300, icon: 'car', at: 28}, {x: 460, icon: 'truck', at: 34},
  {x: 620, icon: 'database', at: 14}, {x: 780, icon: 'car', at: 40}, {x: 940, icon: 'truck', at: 46},
];
export const P_CUE = {nodes: NODES.map((n) => n.at), only: 86, fall: 122, drop: 146, stamp: 166};

export const SceneProblem: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const F = P_CUE.fall;
  const sv = spring({frame: frame - 2, fps, config: {damping: 13, stiffness: 140, mass: 0.8}});
  const hit = frame - F;
  const shake = hit >= 0 && hit < 12 ? Math.sin(hit * 2.4) * (12 - hit) * 1.3 : 0;
  const fall = spring({frame: frame - F - 8, fps, config: {damping: 9, stiffness: 120, mass: 0.9}});
  const red = interpolate(frame, [F, F + 8], [0, 1], CL);
  const ring = interpolate(frame - P_CUE.only, [0, 22], [0, 1], CL);
  const sh = frame - P_CUE.stamp;
  const quake = sh >= 0 && sh < 9 ? Math.sin(sh * 2.7) * (9 - sh) * 1.6 : 0;
  return (
    <SceneShell dur={dur} bg="linear-gradient(170deg, #1B232C 0%, #0E1318 100%)">
      <MapLines color="#fff" opacity={0.035} seed={11} shift={frame * 0.25} />
      <AbsoluteFill style={{transform: `translate(${quake}px, ${quake * 0.5}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 176, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: 'rgba(255,255,255,.78)', border: '2px solid rgba(255,255,255,.4)', borderRadius: 40, padding: '8px 26px',
            opacity: interpolate(frame, [4, 12], [0, 1], CL)}}>OUTRAS PLATAFORMAS</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 254, textAlign: 'center', ...headStyle(90, '#fff')}}>
          <div><Rise at={50}>Tudo vai pra</Rise></div>
          <div><Rise at={68} style={{color: frame >= F ? '#FF6A4D' : C.limeHi}}>um servidor só.</Rise></div>
        </div>

        {/* ligacoes: dados e veiculos sobem para o unico servidor */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {NODES.map((n, i) => {
            const tx = 540 + (i - 2.5) * 48;
            const d = `M ${n.x} 1150 C ${n.x} 1070, ${tx} 1090, ${tx} 1004`;
            const p = clamp((frame - n.at - 4) / 14, 0, 1);
            const gone = interpolate(frame, [P_CUE.drop + i * 4, P_CUE.drop + i * 4 + 8], [1, 0], CL);
            return (
              <g key={i} opacity={gone}>
                <path d={d} fill="none" stroke={red > 0.5 ? C.red : 'rgba(255,255,255,.26)'} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
                <path d={d} fill="none" stroke="#9CC4E4" strokeWidth={5} strokeLinecap="round" strokeDasharray="4 26" strokeDashoffset={frame * 2.2} opacity={p * (1 - red) * 0.95} />
              </g>
            );
          })}
        </svg>

        <div style={{position: 'absolute', left: 140, top: 480, width: 800, height: 700, borderRadius: '50%', background: `radial-gradient(closest-side, ${red > 0.5 ? 'rgba(233,66,37,.26)' : 'rgba(130,180,230,.2)'} 0%, transparent 100%)`, opacity: sv}} />
        <div style={{position: 'absolute', left: 340, top: 990, width: 400, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.45)', filter: 'blur(14px)', opacity: sv}} />
        {ring > 0 && ring < 1 && <div style={{position: 'absolute', left: 540 - 340 * (0.5 + ring), top: 800 - 340 * (0.5 + ring), width: 680 * (0.5 + ring), height: 680 * (0.5 + ring), borderRadius: '50%', border: `5px solid ${C.limeHi}`, opacity: (1 - ring) * 0.8}} />}
        <Server x={540} y={800} w={360} h={404} state={frame >= F ? 'down' : 'ok'} appear={sv} theme="grey" shake={shake} dy={fall * 40} tilt={fall * 7} />
        <Tag at={F + 6} x={716} y={566} text="Offline" bg={C.red} color="#fff" rot={6} />

        {NODES.map((n, i) => {
          const s = spring({frame: frame - n.at, fps, config: {damping: 12, stiffness: 190, mass: 0.6}});
          const t = Math.max(0, frame - P_CUE.drop - i * 4);
          const dy = t * t * 1.5, rot = t * (i % 2 ? 2.2 : -2.2);
          return (
            <div key={i} style={{position: 'absolute', left: n.x - 62, top: 1150, width: 124, height: 124, borderRadius: 30, background: '#252E38', border: `2px solid ${red > 0.5 ? C.red : 'rgba(255,255,255,.16)'}`, boxShadow: '0 14px 30px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: Math.min(1, s * 1.6) * interpolate(t, [10, 22], [1, 0], CL), transform: `translateY(${dy}px) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.4, 1])})`}}>
              <Icon name={n.icon} color={red > 0.5 ? '#FF8A70' : 'rgba(255,255,255,.92)'} size={66} sw={1.7} />
            </div>
          );
        })}
        <Stamp from={P_CUE.stamp} to={dur + 5} text="Operação parada" top={1020} size={86} rot={-5} />
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ---------- Cena 2: na Aldeia — servidores conectados; um cai, o outro assume ---------- */
const SA = {x: 540, y: 745}, SB = {x: 236, y: 1120}, SC = {x: 844, y: 1120}, HUB = {x: 540, y: 1000};
export const A_CUE = {hub: 4, a: 22, b: 34, c: 46, mesh: 50, down: 123, up: 153, status: 166};
type Pt = {x: number; y: number};
const quad = (p0: Pt, c: Pt, p1: Pt, u: number): Pt => ({x: (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * c.x + u * u * p1.x, y: (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * c.y + u * u * p1.y});
const LINKS: {a: Pt; b: Pt; c: Pt; at: number; touchesA: boolean; hub: boolean}[] = [
  {a: HUB, b: SA, c: {x: 540, y: 880}, at: A_CUE.a, touchesA: true, hub: true},
  {a: HUB, b: SB, c: {x: 380, y: 1066}, at: A_CUE.b, touchesA: false, hub: true},
  {a: HUB, b: SC, c: {x: 700, y: 1066}, at: A_CUE.c, touchesA: false, hub: true},
  {a: SA, b: SB, c: {x: 240, y: 790}, at: A_CUE.mesh, touchesA: true, hub: false},
  {a: SA, b: SC, c: {x: 840, y: 790}, at: A_CUE.mesh + 6, touchesA: true, hub: false},
  {a: SB, b: SC, c: {x: 540, y: 1300}, at: A_CUE.mesh + 12, touchesA: false, hub: false},
];

export const SceneAldeia: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (at: number, cfg = {damping: 12, stiffness: 170, mass: 0.7}) => spring({frame: frame - at, fps, config: cfg});
  const down = frame >= A_CUE.down, up = frame >= A_CUE.up;
  const hit = frame - A_CUE.down;
  const shake = hit >= 0 && hit < 12 ? Math.sin(hit * 2.4) * (12 - hit) * 1.1 : 0;
  const burst = interpolate(frame - A_CUE.up, [0, 20], [0, 1], CL);
  const st = sp(A_CUE.status, {damping: 11, stiffness: 180, mass: 0.6});
  const mk = sp(6, {damping: 20, stiffness: 60, mass: 1});
  return (
    <SceneShell dur={dur} bg={`linear-gradient(165deg, ${C.navy2} 0%, ${C.navy} 70%)`}>
      <MapLines color="#fff" opacity={0.04} seed={5} shift={frame * 0.25} />
      <Mark size={980} body={C.slate} p={mk} style={{position: 'absolute', left: 430, top: 1090, opacity: 0.5, transform: `rotate(${8 - frame * 0.01}deg)`}} />
      <Img src={staticFile('common/logo_ondark.png')} style={{position: 'absolute', left: 540 - 112, top: 150, height: 84, opacity: interpolate(frame, [2, 12], [0, 1], CL)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', ...headStyle(86, '#fff')}}>
        <div><Rise at={30}>Seus dados em</Rise></div>
        <div><Rise at={56} style={{color: C.pale}}>mais de um servidor.</Rise></div>
      </div>

      <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 820, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(182,209,80,.16) 0%, transparent 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {LINKS.map((l, i) => {
          const d = `M ${l.a.x} ${l.a.y} Q ${l.c.x} ${l.c.y} ${l.b.x} ${l.b.y}`;
          const p = clamp((frame - l.at - 2) / 14, 0, 1);
          const dead = down && l.touchesA;
          const hot = up && !l.touchesA;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={dead ? C.red : l.hub ? 'rgba(255,255,255,.5)' : C.lime} strokeWidth={dead ? 4 : hot ? 7 : 5} strokeLinecap="round"
                strokeDasharray={dead ? '10 16' : undefined} pathLength={dead ? undefined : 1} {...(dead ? {} : {strokeDasharray: '1', strokeDashoffset: 1 - p})} opacity={dead ? 0.7 : l.hub ? 0.9 : 0.95} />
              {!dead && p >= 1 && [0, 1, ...(hot ? [2] : [])].map((k) => {
                const speed = hot ? 0.03 : 0.018;
                const u = ((frame * speed + k / (hot ? 3 : 2) + i * 0.17) % 1 + 1) % 1;
                const pt = quad(l.a, l.c, l.b, i % 2 || l.hub ? u : 1 - u);
                return <circle key={k} cx={pt.x} cy={pt.y} r={hot ? 10 : 8} fill={l.hub ? '#fff' : C.limeHi} opacity={Math.sin(u * Math.PI) * 0.95} />;
              })}
            </g>
          );
        })}
      </svg>

      {burst > 0 && burst < 1 && <div style={{position: 'absolute', left: SB.x - 300 * (0.4 + burst), top: SB.y - 300 * (0.4 + burst), width: 600 * (0.4 + burst), height: 600 * (0.4 + burst), borderRadius: '50%', border: `6px solid ${C.limeHi}`, opacity: (1 - burst) * 0.9}} />}
      <Server {...SA} w={250} h={282} label="A" state={down ? 'down' : 'ok'} appear={sp(A_CUE.a)} theme="navy" shake={shake} />
      <Server {...SB} w={250} h={282} label="B" state={up ? 'active' : 'ok'} appear={sp(A_CUE.b)} theme="navy" />
      <Server {...SC} w={250} h={282} label="C" labelRight state="ok" appear={sp(A_CUE.c)} theme="navy" />
      <Tag at={A_CUE.down + 5} x={690} y={566} text="Fora do ar" bg={C.red} color="#fff" rot={5} />
      <Tag at={A_CUE.up + 4} x={30} y={920} text="Assumiu" bg={C.limeHi} color={C.ink} rot={-5} />

      {/* a central do cliente, ligada a todos os servidores */}
      {(() => {
        const s = sp(A_CUE.hub, {damping: 11, stiffness: 190, mass: 0.6});
        return (
          <div style={{position: 'absolute', left: HUB.x - 168, top: HUB.y - 50, width: 336, height: 100, borderRadius: 50, background: LIMEGRAD, boxShadow: '0 14px 34px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: BODY, fontWeight: 800, fontSize: 38, color: C.ink, opacity: Math.min(1, s * 1.6), transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`}}>
            <Icon name="building" color={C.ink} size={44} sw={2.1} />Sua central
          </div>
        );
      })()}

      <div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', justifyContent: 'center', opacity: Math.min(1, st * 1.6), transform: `translateY(${interpolate(st, [0, 1], [50, 0])}px) scale(${interpolate(st, [0, 1], [0.8, 1])})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(3,37,56,.92)', border: `3px solid ${C.limeHi}`, borderRadius: 50, padding: '14px 34px', fontFamily: BODY, fontWeight: 800, fontSize: 40, color: '#fff', boxShadow: '0 14px 34px rgba(0,0,0,.4)'}}>
          <div style={{width: 22, height: 22, borderRadius: '50%', background: C.limeHi, boxShadow: `0 0 0 ${8 + Math.sin(frame / 4) * 5}px rgba(217,248,114,.28)`}} />
          Operação online
        </div>
      </div>
    </SceneShell>
  );
};
