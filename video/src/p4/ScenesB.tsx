import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, HEAD, LIMEGRAD, clamp, headStyle} from '../common/brand';
import {Icon} from '../common/Icons';
import {Mark} from '../common/Fx';
import {BgDark, BgLight, CL, Header, Headline, card} from './Stage';

const useSp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number, cfg = {damping: 12, stiffness: 170, mass: 0.7}) => spring({frame: frame - at, fps, config: cfg});
};
const Skel: React.FC<{w: number; top: number; left: number; h?: number}> = ({w, top, left, h = 12}) => <div style={{position: 'absolute', left, top, width: w, height: h, borderRadius: h / 2, background: '#DDE4E9'}} />;

/* ================= Cena 4: gestao de tickets ================= */
const TK = [
  {y: 640, icons: ['car', 'alert'], color: C.lime, at: 5},
  {y: 830, icons: ['truck', 'pin'], color: '#F26B3A', at: 11},
  {y: 1020, icons: ['wrench', 'clock'], color: C.sky, at: 17},
];
const ST = [
  {y: 620, label: 'Novo', nto: 12, color: '#9BC400', at: 53},
  {y: 770, label: 'Em atendimento', nto: 8, color: '#F26B3A', at: 61},
  {y: 920, label: 'Aguardando', nto: 5, color: C.sky, at: 69},
  {y: 1070, label: 'Resolvido', nto: 32, color: '#1FA65A', at: 77},
];
export const S4_CUE = {tickets: TK.map((t) => t.at), main: 22, status: ST.map((s) => s.at), panel: 95};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  const main = sp(S4_CUE.main, {damping: 11, stiffness: 150, mass: 0.8});
  const pf = interpolate(frame, [S4_CUE.panel, S4_CUE.panel + 20], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
  const tab = sp(S4_CUE.panel + 6, {damping: 12, stiffness: 190, mass: 0.6});
  return (
    <AbsoluteFill>
      <BgLight seed={14} />
      <Header idx={4} />
      <Headline lines={[[{t: 'Gestão de '}, {t: 'tickets', hl: true}], [{t: 'direto no seu painel.'}]]} />

      {/* moldura do painel */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={40} y={578} width={1000} height={760} rx={44} fill="none" stroke={C.slate} strokeWidth={4} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - pf} opacity={0.75} />
        {TK.map((t, i) => {
          const p = clamp((frame - t.at - 8) / 14, 0, 1);
          return <path key={i} d={`M 318 ${t.y + 75} C 360 ${t.y + 75}, 350 ${880 + (i - 1) * 46}, 398 ${880 + (i - 1) * 46}`} fill="none" stroke={t.color} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />;
        })}
        {ST.map((s, i) => {
          const p = clamp((frame - s.at + 8) / 10, 0, 1);
          const y0 = 800 + i * 54;
          return (
            <g key={i} opacity={p > 0 ? 1 : 0}>
              <path d={`M 664 ${y0} C 706 ${y0}, 696 ${s.y + 52}, 732 ${s.y + 52}`} fill="none" stroke={s.color} strokeWidth={4} strokeDasharray="9 9" strokeDashoffset={-frame * 0.8} opacity={p} />
              <path d={`M 724 ${s.y + 42} L 740 ${s.y + 52} L 724 ${s.y + 62} Z`} fill={s.color} opacity={p} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 84, top: 556, background: LIMEGRAD, borderRadius: 22, padding: '8px 22px', fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.ink, boxShadow: '0 8px 20px rgba(3,37,56,.2)',
        opacity: Math.min(1, tab * 1.6), transform: `scale(${interpolate(tab, [0, 1], [0.5, 1])})`, transformOrigin: '0% 50%'}}>SEU PAINEL</div>

      {/* chamados que chegam */}
      {TK.map((t, i) => {
        const s = sp(t.at, {damping: 13, stiffness: 150, mass: 0.7});
        return (
          <div key={i} style={{position: 'absolute', left: 70, top: t.y, width: 250, height: 150, ...card({borderRadius: 24}), opacity: Math.min(1, s * 1.6), transform: `translateX(${interpolate(s, [0, 1], [-200, 0])}px) rotate(${interpolate(s, [0, 1], [-8, i % 2 ? 2 : -2])}deg)`}}>
            <div style={{position: 'absolute', left: 22, top: 20, display: 'flex', gap: 12}}>
              <div style={{width: 58, height: 58, borderRadius: 16, background: '#EAF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name={t.icons[0]} color={C.slate} size={36} sw={2} /></div>
              <div style={{width: 58, height: 58, borderRadius: 16, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name={t.icons[1]} color="#fff" size={34} sw={2.3} /></div>
            </div>
            <Skel left={22} top={98} w={190} /><Skel left={22} top={120} w={130} />
          </div>
        );
      })}

      {/* ticket central */}
      <div style={{position: 'absolute', left: 396, top: 716, width: 270, height: 400, opacity: Math.min(1, main * 1.6), transform: `scale(${interpolate(main, [0, 1], [0.5, 1])}) rotate(${interpolate(main, [0, 1], [10, 0])}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: '#9FD4F2', transform: 'rotate(7deg) translate(14px, 6px)'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: '#CBE8F8', transform: 'rotate(3.500deg) translate(7px, 3px)'}} />
        <div style={{position: 'absolute', inset: 0, ...card({borderRadius: 28})}}>
          <div style={{position: 'absolute', right: 20, top: 20, background: C.sky, color: '#fff', borderRadius: 12, padding: '4px 12px', fontFamily: BODY, fontWeight: 800, fontSize: 22}}>#12847</div>
          <div style={{position: 'absolute', left: 24, top: 70, width: 92, height: 92, borderRadius: 24, background: '#EAF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="car" color={C.slate} size={58} sw={1.9} /></div>
          <Skel left={132} top={92} w={110} h={14} /><Skel left={132} top={122} w={74} h={14} />
          <div style={{position: 'absolute', left: 24, top: 196, right: 24, borderTop: '2px dashed #D3DBE1'}} />
          <div style={{position: 'absolute', left: 24, top: 222}}><Icon name="pin" color="#94A3AF" size={34} sw={2} /></div><Skel left={70} top={234} w={170} h={14} />
          <div style={{position: 'absolute', left: 24, top: 280}}><Icon name="clock" color="#94A3AF" size={34} sw={2} /></div><Skel left={70} top={292} w={120} h={14} />
          <div style={{position: 'absolute', left: 24, right: 24, bottom: 22, height: 44, borderRadius: 14, background: LIMEGRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: C.ink}}>SUPORTE</div>
        </div>
      </div>

      {/* status do chamado */}
      {ST.map((s, i) => {
        const a = sp(s.at, {damping: 11, stiffness: 190, mass: 0.6});
        const num = Math.round(s.nto * clamp((frame - s.at) / 16, 0, 1));
        return (
          <div key={i} style={{position: 'absolute', left: 742, top: s.y, width: 278, height: 108, ...card({borderRadius: 24}), display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px 0 16px', boxSizing: 'border-box',
            opacity: Math.min(1, a * 1.6), transform: `translateX(${interpolate(a, [0, 1], [70, 0])}px) scale(${interpolate(a, [0, 1], [0.8, 1])})`}}>
            <div style={{width: 24, height: 24, borderRadius: 12, background: s.color, flexShrink: 0}} />
            <div style={{flex: 1, fontFamily: BODY, fontWeight: 800, fontSize: 27, lineHeight: 1.04, color: C.ink}}>{s.label}</div>
            <div style={{minWidth: 50, textAlign: 'center', background: '#E6ECF0', borderRadius: 14, padding: '6px 8px', fontFamily: BODY, fontWeight: 800, fontSize: 26, color: C.head}}>{num}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ================= Cena 5: chips em tempo real ================= */
const ROWS = [
  {name: 'Chip 01', num: '•••• 4821', mb: 392, at: 6, on: true},
  {name: 'Chip 02', num: '•••• 7305', mb: 226, at: 13, on: true},
  {name: 'Chip 03', num: '•••• 1164', mb: 0, at: 20, on: false},
  {name: 'Chip 04', num: '•••• 9058', mb: 455, at: 27, on: true},
];
export const S5_CUE = {rows: ROWS.map((r) => r.at), use: 83, status: 107, act: 126, toggle: 133, live: 139};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  const panel = sp(2, {damping: 16, stiffness: 110, mass: 0.9});
  const col = (at: number) => clamp((frame - at) / 8, 0, 1);
  const heads = [{t: 'LINHA', x: 40, a: 1}, {t: 'CONSUMO', x: 330, a: col(S5_CUE.use)}, {t: 'STATUS', x: 640, a: col(S5_CUE.status)}, {t: 'ATIVAÇÃO', x: 790, a: col(S5_CUE.act)}];
  return (
    <AbsoluteFill>
      <BgDark seed={17} />
      <Header dark idx={5} />
      <Headline dark lines={[[{t: 'Seus chips em'}], [{t: 'tempo real.', hl: true}]]} />

      <div style={{position: 'absolute', left: 60, top: 566, width: 960, height: 760, borderRadius: 40, background: 'rgba(255,255,255,.07)', border: '2px solid rgba(255,255,255,.16)', boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(0,0,0,.35)',
        opacity: Math.min(1, panel * 1.5), transform: `translateY(${interpolate(panel, [0, 1], [130, 0])}px)`}}>
        <div style={{position: 'absolute', left: 30, top: -24, display: 'flex', alignItems: 'center', gap: 12, background: C.ink, border: `2px solid ${C.limeHi}`, borderRadius: 26, padding: '8px 20px', fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 2.5, color: C.limeHi}}>
          <span style={{width: 14, height: 14, borderRadius: 7, background: '#FF4B3A', boxShadow: `0 0 0 ${4 + Math.sin(frame / 3.500) * 4}px rgba(255,75,58,.3)`}} />TEMPO REAL
        </div>
        {heads.map((h) => (
          <div key={h.t} style={{position: 'absolute', left: h.x, top: 48, fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: 2.5, color: h.t === 'LINHA' ? 'rgba(255,255,255,.55)' : `rgba(${interpolate(h.a, [0, 1], [255, 217])},${interpolate(h.a, [0, 1], [255, 248])},${interpolate(h.a, [0, 1], [255, 114])},${interpolate(h.a, [0, 1], [0.55, 1])})`}}>
            {h.t}
            {h.t !== 'LINHA' && <div style={{height: 4, borderRadius: 2, background: C.limeHi, marginTop: 6, width: `${h.a * 100}%`}} />}
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, right: 30, top: 100, borderTop: '1.500px solid rgba(255,255,255,.14)'}} />

        {ROWS.map((r, i) => {
          const s = sp(r.at, {damping: 14, stiffness: 150, mass: 0.7});
          const y = 112 + i * 158;
          const live = !r.on && frame >= S5_CUE.live;
          const active = r.on || live;
          const target = r.on ? r.mb : 38;
          const fill = r.on ? clamp((frame - S5_CUE.use - i * 3) / 26, 0, 1) : clamp((frame - S5_CUE.live - 4) / 22, 0, 1);
          const eased = 1 - Math.pow(1 - fill, 3);
          const mb = Math.round(target * eased);
          const stA = sp(S5_CUE.status + i * 5, {damping: 11, stiffness: 200, mass: 0.6});
          const knob = r.on ? 1 : sp(S5_CUE.toggle, {damping: 13, stiffness: 220, mass: 0.6});
          const tg = sp(S5_CUE.act + i * 3, {damping: 12, stiffness: 190, mass: 0.6});
          return (
            <div key={r.name} style={{position: 'absolute', left: 0, right: 0, top: y, height: 150, opacity: Math.min(1, s * 1.6), transform: `translateX(${interpolate(s, [0, 1], [90, 0])}px)`}}>
              {i > 0 && <div style={{position: 'absolute', left: 30, right: 30, top: 0, borderTop: '1.500px solid rgba(255,255,255,.1)'}} />}
              <div style={{position: 'absolute', left: 36, top: 34, width: 84, height: 84, borderRadius: 24, background: active ? LIMEGRAD : 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="sim" color={active ? C.ink : 'rgba(255,255,255,.6)'} size={52} sw={2} /></div>
              <div style={{position: 'absolute', left: 138, top: 40, fontFamily: BODY, fontWeight: 800, fontSize: 32, color: '#fff'}}>{r.name}</div>
              <div style={{position: 'absolute', left: 138, top: 82, fontFamily: BODY, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,.55)', letterSpacing: 1}}>{r.num}</div>
              <div style={{position: 'absolute', left: 330, top: 38, fontFamily: BODY, fontWeight: 800, fontSize: 28, color: '#fff'}}>{mb} <span style={{fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,.6)'}}>MB</span></div>
              <div style={{position: 'absolute', left: 330, top: 86, width: 262, height: 16, borderRadius: 8, background: 'rgba(255,255,255,.14)', overflow: 'hidden'}}>
                <div style={{height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${C.limeHi}, ${C.teal})`, width: `${(mb / 500) * 100}%`}} />
              </div>
              <div style={{position: 'absolute', left: 640, top: 50, fontFamily: BODY, fontWeight: 800, fontSize: 24, color: active ? C.ink : 'rgba(255,255,255,.75)', background: active ? LIMEGRAD : 'rgba(255,255,255,.16)', borderRadius: 16, padding: '8px 18px',
                opacity: Math.min(1, stA * 1.6), transform: `scale(${interpolate(stA, [0, 1], [0.4, 1]) * (live ? 1 + Math.sin(clamp((frame - S5_CUE.live) / 10, 0, 1) * Math.PI) * 0.18 : 1)})`}}>{active ? 'Ativo' : 'Inativo'}</div>
              <div style={{position: 'absolute', left: 800, top: 48, width: 104, height: 54, borderRadius: 27, background: knob > 0.5 ? LIMEGRAD : 'rgba(255,255,255,.2)', opacity: Math.min(1, tg * 1.6), transform: `scale(${interpolate(tg, [0, 1], [0.4, 1])})`}}>
                <div style={{position: 'absolute', top: 6, left: 6 + knob * 50, width: 42, height: 42, borderRadius: 21, background: knob > 0.5 ? C.ink : '#fff', boxShadow: '0 4px 10px rgba(0,0,0,.3)'}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================= Cena 6: equipamentos homologados ================= */
const DEV = [
  {y: 560, kicker: 'CÂMERA', name: 'Jimi 181', seal: 'Homologada', img: 'common/dev_jimi.png', w: 400, left: 14, top: 2, at: 74, nameAt: 87, sealAt: 112},
  {y: 955, kicker: 'APARELHO', name: 'BWS NB2', seal: 'Homologado', img: 'common/dev_bws.png', w: 150, left: 146, top: -36, at: 132, nameAt: 152, sealAt: 182},
];
export const S6_CUE = {slots: [24, 34], cards: DEV.map((d) => d.at), seals: DEV.map((d) => d.sealAt)};

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const sp = useSp();
  return (
    <AbsoluteFill>
      <BgLight seed={23} />
      <Header idx={6} />
      <Headline lines={[[{t: 'Dois novos equipamentos'}], [{t: 'homologados', hl: true}, {t: ' na Aldeia.'}]]} size={78} top={290} />

      {DEV.map((d, i) => {
        const slot = sp(S6_CUE.slots[i], {damping: 13, stiffness: 170, mass: 0.6});
        const c = sp(d.at, {damping: 15, stiffness: 120, mass: 0.9});
        const dv = sp(d.at + 5, {damping: 10, stiffness: 110, mass: 0.9});
        const mk = sp(d.at + 2, {damping: 18, stiffness: 80, mass: 1});
        const nm = sp(d.nameAt, {damping: 14, stiffness: 170, mass: 0.6});
        const seal = sp(d.sealAt, {damping: 9, stiffness: 230, mass: 0.7});
        const float = Math.sin((frame + i * 20) / 14) * 7;
        return (
          <React.Fragment key={d.name}>
            {/* vaga pontilhada, preenchida quando o equipamento e citado */}
            <div style={{position: 'absolute', left: 70, top: d.y, width: 940, height: 370, borderRadius: 40, border: `4px dashed ${C.slate}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: Math.min(1, slot * 1.5) * 0.45 * (1 - Math.min(1, c * 1.5)), transform: `scale(${interpolate(slot, [0, 1], [0.9, 1])})`, ...headStyle(150, C.slate)}}>0{i + 1}</div>
            <div style={{position: 'absolute', left: 70, top: d.y, width: 940, height: 370, opacity: Math.min(1, c * 1.6), transform: `translateX(${interpolate(c, [0, 1], [330, 0])}px)`}}>
              <div style={{position: 'absolute', inset: 0, ...card({borderRadius: 40}), overflow: 'hidden'}}>
                <Mark size={390} body={C.slate} wedge={C.lime} p={mk} style={{position: 'absolute', left: 40, top: 18, transform: 'rotate(-10deg)'}} />
              </div>
              <Img src={staticFile(d.img)} style={{position: 'absolute', left: d.left, top: d.top + float, width: d.w, filter: 'drop-shadow(0 26px 26px rgba(3,37,56,.38))',
                opacity: Math.min(1, dv * 1.8), transform: `translate(${interpolate(dv, [0, 1], [160, 0])}px, ${interpolate(dv, [0, 1], [-60, 0])}px) rotate(${interpolate(dv, [0, 1], [16, 0])}deg) scale(${interpolate(dv, [0, 1], [0.8, 1])})`}} />
              <div style={{position: 'absolute', left: 452, top: 64}}>
                <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: C.slate, opacity: nm}}>{d.kicker}</div>
                <div style={{overflow: 'hidden', paddingBottom: 14}}>
                  <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 104, lineHeight: 1.08, letterSpacing: -5, color: C.olive, whiteSpace: 'nowrap', transform: `translateY(${interpolate(nm, [0, 1], [112, 0])}%)`}}>{d.name}</div>
                </div>
                <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: LIMEGRAD, borderRadius: 22, padding: '12px 24px 12px 14px', marginTop: 6, boxShadow: '0 12px 28px rgba(3,37,56,.22)', fontFamily: BODY, fontWeight: 800, fontSize: 32, color: C.ink,
                  opacity: Math.min(1, seal * 2), transform: `rotate(-4deg) scale(${interpolate(seal, [0, 1], [2.1, 1])})`, transformOrigin: '20% 50%'}}>
                  <div style={{width: 48, height: 48, borderRadius: 24, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="check" color={C.limeHi} size={32} sw={3.2} /></div>{d.seal}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
