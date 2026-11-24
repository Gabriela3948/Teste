import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {BODY, C, LIMEGRAD, headStyle} from '../common/brand';
import {LinkPill, LogoReveal, Mark, Rise} from '../common/Fx';
import {Icon} from '../common/Icons';
import {BgDark, BgLight} from '../p4/Stage';
import {Avatar, BaseBlock, CL, Dots, Drift, Tag, lerp, sp} from './Kit';
import {END, I, OVER, S4, S4B, S5, ws} from './timing';

// ---------- Cena 4: na Aldeia, a migracao e feita junto com a nossa equipe ----------
const feita = ws(I.feita) - S4;
export const S4_CUE = {
  logo: ws(I.na) - S4 - 2, h1: ws(I.aMigracao) - S4 - 2, h2: ws(I.junto) - S4 - 2, h3: ws(I.nossa) - S4 - 2, hl: ws(I.equipe) - S4,
  team: [feita - 6, feita - 1, feita + 4], go: [feita + 8, feita + 15, feita + 22], check: [feita + 23, feita + 30, feita + 37],
};
const BASE: [string, string][] = [['file', 'Contrato'], ['sim', 'Chip'], ['user', 'Cliente']];
const PY = 690, PH = 560, LX = 60, RX = 585, PW = 435, CW = 395, CH = 124;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const panels = sp(frame, 4, {damping: 18, stiffness: 120, mass: 0.7});
  const hl = interpolate(frame, [S4_CUE.hl - 2, S4_CUE.hl + 9], [0, 1], CL);
  return (
    <AbsoluteFill>
      <BgLight seed={14} />
      <Drift dur={S4B - S4 + OVER} to={1.025}>
      <div style={{position: 'absolute', left: 70, top: 150}}><LogoReveal start={S4_CUE.logo} height={104} variant="dark" shadow={false} speed={1.25} /></div>
      <div style={{position: 'absolute', left: 70, top: 296, ...headStyle(100, C.head), fontWeight: 600}}>
        <div><Rise at={S4_CUE.h1}>A migração é feita</Rise></div>
        <div><Rise at={S4_CUE.h2}>junto com a</Rise></div>
        <div style={{position: 'relative', display: 'inline-block', padding: '0 20px 8px 18px', marginLeft: -18, marginTop: 4}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: LIMEGRAD, transform: `scaleX(${hl})`, transformOrigin: '0% 50%'}} />
          <Rise at={S4_CUE.h3} style={{position: 'relative', fontWeight: 700, color: C.ink}}>nossa equipe.</Rise>
        </div>
      </div>

      {/* de onde sai e para onde vai */}
      <div style={{position: 'absolute', left: LX, top: PY, width: PW, height: PH, borderRadius: 40, border: `3px dashed rgba(39,79,100,.45)`, background: 'rgba(39,79,100,.05)', boxSizing: 'border-box',
        opacity: panels, transform: `translateY(${interpolate(panels, [0, 1], [40, 0])}px)`}}>
        <Tag color={C.slate} size={22} style={{position: 'absolute', left: 30, top: 34}}>Plataforma atual</Tag>
      </div>
      <div style={{position: 'absolute', left: RX, top: PY, width: PW, height: PH, borderRadius: 40, background: `linear-gradient(165deg, ${C.navy3} 0%, ${C.navy} 80%)`, boxShadow: '0 26px 60px rgba(3,37,56,.3)',
        opacity: panels, transform: `translateY(${interpolate(panels, [0, 1], [40, 0])}px)`}}>
        <Tag color={C.limeHi} size={22} style={{position: 'absolute', left: 30, top: 34}}>Aldeia</Tag>
        {BASE.map((_, i) => <div key={i} style={{position: 'absolute', left: 20, top: 96 + i * 148, width: CW, height: CH, borderRadius: 26, border: '2px dashed rgba(255,255,255,.2)', boxSizing: 'border-box'}} />)}
      </div>

      {/* a base atravessa, item por item */}
      {BASE.map(([icon, label], i) => {
        const inn = sp(frame, 8 + i * 3, {damping: 14, stiffness: 170, mass: 0.6});
        const go = sp(frame, S4_CUE.go[i], {damping: 17, stiffness: 120, mass: 0.7});
        const check = sp(frame, S4_CUE.check[i], {damping: 10, stiffness: 240, mass: 0.5});
        return (
          <BaseBlock key={label} icon={icon} label={label} w={CW} h={CH} check={check}
            style={{left: lerp(LX + 20, RX + 20, go), top: PY + 96 + i * 148 - Math.sin(Math.min(1, Math.max(0, go)) * Math.PI) * 18, opacity: Math.min(1, inn * 1.6), transform: `scale(${interpolate(inn, [0, 1], [0.8, 1])})`}} />
        );
      })}

      {/* a equipe, no meio do caminho */}
      {BASE.map((_, i) => {
        const pop = sp(frame, S4_CUE.team[i], {damping: 11, stiffness: 210, mass: 0.6});
        const d = frame - S4_CUE.go[i] - 4;
        const pulse = d > 0 && d < 12 ? Math.sin((d / 12) * Math.PI) * 0.14 : 0;
        return (
          <Avatar key={i} size={96} bg={C.limeHi} fg={C.ink} ring="#fff" icon="headset"
            style={{position: 'absolute', left: 540 - 48, top: PY + 96 + i * 148 + CH / 2 - 48, transform: `scale(${pop * (1 + pulse)})`, boxShadow: '0 12px 28px rgba(3,37,56,.3)', background: LIMEGRAD}} />
        );
      })}
      </Drift>
    </AbsoluteFill>
  );
};

// ---------- Cena 4B: mais de 40 mil veiculos ja passaram para a plataforma ----------
const q = ws(I.quarenta) - S4B;
export const S4B_CUE = {tag: 3, num: q - 3, count: q - 1, done: q + 23, veic: ws(I.veiculos) - S4B - 2, line: ws(I.ja) - S4B - 2, chip: ws(I.desde) - S4B - 2};
const COLS = 8, ROWS = 5, STEP = 24 / 40;

export const Scene4B: React.FC = () => {
  const frame = useCurrentFrame();
  const num = sp(frame, S4B_CUE.num, {damping: 12, stiffness: 160, mass: 0.7});
  const n = Math.round(interpolate(frame, [S4B_CUE.count, S4B_CUE.done], [0, 40], CL));
  const d = frame - S4B_CUE.done;
  const bump = d >= 0 && d < 12 ? Math.sin((d / 12) * Math.PI) * 0.07 : 0;
  const chip = sp(frame, S4B_CUE.chip, {damping: 12, stiffness: 190, mass: 0.6});
  return (
    <AbsoluteFill>
      <BgDark seed={9} />
      <Drift dur={S5 - S4B + OVER}>
      <div style={{position: 'absolute', left: 74, top: 262}}><Rise at={S4B_CUE.tag}><Tag color={C.pale} size={30}>Mais de</Tag></Rise></div>
      <div style={{position: 'absolute', left: 60, top: 300, display: 'flex', alignItems: 'baseline', ...headStyle(264, C.limeHi), fontWeight: 800, fontVariantNumeric: 'tabular-nums',
        opacity: Math.min(1, num * 1.8), transform: `scale(${interpolate(num, [0, 1], [0.7, 1]) * (1 + bump)})`, transformOrigin: '0% 70%'}}>
        <span style={{display: 'inline-block', minWidth: 458}}>+{n}</span>
        <span>mil</span>
      </div>
      <div style={{position: 'absolute', left: 70, top: 566, ...headStyle(150, '#fff')}}><Rise at={S4B_CUE.veic}>veículos</Rise></div>
      <div style={{position: 'absolute', left: 74, top: 748, fontFamily: BODY, fontWeight: 600, fontSize: 45, color: C.off}}><Rise at={S4B_CUE.line}>já passaram para a plataforma</Rise></div>
      <div style={{position: 'absolute', left: 70, top: 832, border: `3px solid ${C.limeHi}`, borderRadius: 40, padding: '11px 28px', opacity: Math.min(1, chip * 1.6), transform: `scale(${interpolate(chip, [0, 1], [0.5, 1])})`, transformOrigin: '0% 50%'}}>
        <Tag color={C.limeHi} size={27}>Desde o lançamento</Tag>
      </div>
      {/* 40 carros: cada um acende junto com a contagem */}
      {Array.from({length: COLS * ROWS}).map((_, k) => {
        const col = k % COLS, row = Math.floor(k / COLS);
        const inn = sp(frame, 4 + col + row * 2, {damping: 16, stiffness: 160, mass: 0.6});
        const lit = sp(frame, S4B_CUE.count + k * STEP, {damping: 10, stiffness: 230, mass: 0.5});
        return (
          <div key={k} style={{position: 'absolute', left: 70 + col * 117.5 + 20, top: 966 + row * 70, opacity: inn, transform: `translateX(${interpolate(inn, [0, 1], [-40, 0])}px) scale(${interpolate(lit, [0, 1], [0.82, 1])})`}}>
            <Icon name="car" color={interpolateColors(Math.min(1, Math.max(0, lit)), [0, 1], ['rgba(255,255,255,0.22)', C.limeHi])} size={76} sw={1.9} />
          </div>
        );
      })}
      </Drift>
    </AbsoluteFill>
  );
};

// ---------- Cena 5: chame a gente pelo link da bio ----------
const MSG = 'Como seria a minha migração?';
const ent = ws(I.eEntenda) - S5;
export const S5_CUE = {h1: ws(I.se) - S5 - 1, h2: ws(I.medo2) - S5 - 8, card: ws(I.chame) - S5 - 3, pill: ws(I.pelo) - S5 + 2, type: ent - 2, sent: ent + 34, dots: ent + 39, reply: ent + 53};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const card = sp(frame, S5_CUE.card, {damping: 15, stiffness: 130, mass: 0.7});
  const chars = Math.round(interpolate(frame, [S5_CUE.type, S5_CUE.sent - 4], [0, MSG.length], CL));
  const bubble = sp(frame, S5_CUE.type - 3, {damping: 13, stiffness: 190, mass: 0.6});
  const sent = sp(frame, S5_CUE.sent, {damping: 12, stiffness: 220, mass: 0.5});
  const dots = sp(frame, S5_CUE.dots, {damping: 13, stiffness: 190, mass: 0.6});
  const reply = sp(frame, S5_CUE.reply, {damping: 13, stiffness: 190, mass: 0.6});
  const caret = frame < S5_CUE.sent && Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <BgLight seed={21} />
      <Drift dur={END - S5 + 8}>
      <div style={{position: 'absolute', left: 70, top: 272, ...headStyle(104, C.head), fontWeight: 600}}>
        <div><Rise at={S5_CUE.h1}>O que te segura</Rise></div>
        <div><Rise at={S5_CUE.h2} style={{fontWeight: 700}}>é o </Rise><Rise at={S5_CUE.h2 + 4} style={{fontWeight: 700, color: C.olive, marginLeft: 22}}>medo de trocar?</Rise></div>
      </div>

      {/* conversa com a Aldeia */}
      <div style={{position: 'absolute', left: 70, top: 580, width: 940, height: 420, borderRadius: 40, background: '#fff', boxShadow: '0 30px 70px rgba(3,37,56,.2)', overflow: 'hidden',
        opacity: Math.min(1, card * 1.6), transform: `translateY(${interpolate(card, [0, 1], [90, 0])}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 118, background: C.navy, display: 'flex', alignItems: 'center', gap: 22, padding: '0 32px'}}>
          <div style={{width: 76, height: 76, borderRadius: 38, background: C.navy3, border: `3px solid ${C.limeHi}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Mark size={38} body={C.limeHi} wedge={C.limeHi} />
          </div>
          <div>
            <div style={{...headStyle(40, '#fff')}}>Aldeia Tecnologia</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontFamily: BODY, fontWeight: 600, fontSize: 24, color: C.pale}}>
              <div style={{width: 14, height: 14, borderRadius: 7, background: C.limeHi}} />online
            </div>
          </div>
        </div>
        {/* mensagem de quem chama */}
        <div style={{position: 'absolute', right: 32, top: 150, background: LIMEGRAD, borderRadius: '34px 34px 8px 34px', padding: '20px 30px', fontFamily: BODY, fontWeight: 700, fontSize: 41, color: C.ink, whiteSpace: 'pre',
          opacity: Math.min(1, bubble * 1.6), transform: `scale(${interpolate(bubble, [0, 1], [0.6, 1])})`, transformOrigin: '100% 100%', display: 'flex', alignItems: 'center', minHeight: 52}}>
          {MSG.slice(0, chars)}
          <span style={{display: 'inline-block', width: caret ? 4 : 0, height: 44, background: C.ink, marginLeft: caret ? 4 : 0}} />
          <span style={{display: 'inline-flex', marginLeft: sent * 10, width: sent * 34, overflow: 'hidden', opacity: sent}}><Icon name="check" color={C.ink} size={34} sw={3} /></span>
        </div>
        {/* resposta */}
        <div style={{position: 'absolute', left: 32, top: 286, background: C.off, borderRadius: '34px 34px 34px 8px', padding: '20px 30px', minHeight: 52, display: 'flex', alignItems: 'center',
          opacity: Math.min(1, dots * 1.6), transform: `scale(${interpolate(dots, [0, 1], [0.6, 1])})`, transformOrigin: '0% 100%'}}>
          {reply < 0.5
            ? <Dots color={C.slate} size={20} t={frame} />
            : <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 41, color: C.ink, whiteSpace: 'nowrap', opacity: interpolate(reply, [0.5, 1], [0, 1], CL)}}>A gente te mostra.</div>}
        </div>
      </div>

      <LinkPill from={S5_CUE.pill} top={1140} arrow={C.ink} />
      </Drift>
    </AbsoluteFill>
  );
};
