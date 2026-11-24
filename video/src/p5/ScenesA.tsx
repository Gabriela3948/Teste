import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {BODY, C, HEAD, LIMEGRAD, headStyle} from '../common/brand';
import {Rise} from '../common/Fx';
import {Icon} from '../common/Icons';
import {BgLight} from '../p4/Stage';
import {Avatar, BaseBlock, BgNavy, BgSlate, CL, Dots, Drift, Stars, Tag, lerp, sp} from './Kit';
import {I, OVER, S2, S3, S4, ws} from './timing';

// ---------- Cena 1: todo dono de central fala a mesma coisa ----------
export const S1_CUE = {rows: [ws(I.todo) - 12, ws(I.central) - 6, ws(I.insatisfeito)], merge: ws(I.fala) + 2, grow: ws(I.eu) - 9, hl: ws(I.migracao)};
const QUOTE: [string, number][][] = [
  [['Eu', I.eu], ['até', I.ate]],
  [['trocaria…', I.trocaria]],
  [['mas', I.mas], ['e', I.e2], ['a', I.a2]],
];
const RATE = [2, 1, 2];

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const merge = sp(frame, S1_CUE.merge, {damping: 20, stiffness: 110, mass: 0.9});
  const grow = sp(frame, S1_CUE.grow, {damping: 17, stiffness: 120, mass: 0.8});
  // cada balao: A (avaliacoes, um embaixo do outro) -> M (empilhados: "a mesma coisa") -> B (balao grande com a frase)
  const A = [{x: 220, y: 470, r: 0}, {x: 220, y: 650, r: 0}, {x: 220, y: 830, r: 0}];
  const M = [{x: 202, y: 612, r: -3}, {x: 220, y: 632, r: 0}, {x: 238, y: 652, r: 3}];
  const B = [{x: 50, y: 478, r: -2.2}, {x: 70, y: 450, r: 0}, {x: 94, y: 500, r: 2}];
  const wA = 640, hA = 130, wB = 940, hB = 680;
  const avA = [{x: 80, y: 480}, {x: 890, y: 660}, {x: 80, y: 840}];
  const hl = interpolate(frame, [S1_CUE.hl - 2, S1_CUE.hl + 10], [0, 1], CL);
  const badge = sp(frame, S1_CUE.grow + 8, {damping: 11, stiffness: 200, mass: 0.6});
  return (
    <AbsoluteFill>
      <BgNavy />
      <Drift dur={S2 + OVER}>
        {[0, 2, 1].map((i) => {
          const pop = sp(frame, S1_CUE.rows[i], {damping: 12, stiffness: 190, mass: 0.6});
          const x = lerp(lerp(A[i].x, M[i].x, merge), B[i].x, grow);
          const y = lerp(lerp(A[i].y, M[i].y, merge), B[i].y, grow);
          const r = lerp(lerp(A[i].r, M[i].r, merge), B[i].r, grow);
          const front = i === 1;
          const bg = front ? interpolateColors(Math.min(1, Math.max(0, grow)), [0, 0.7], [C.slate2, C.off]) : i === 0 ? C.slate : '#3A6577';
          const dotsO = front ? interpolate(grow, [0, 0.3], [1, 0], CL) : interpolate(merge, [0.3, 0.8], [1, 0], CL);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: lerp(wA, wB, grow), height: lerp(hA, hB, grow), borderRadius: lerp(44, 62, grow), background: bg, boxShadow: '0 24px 60px rgba(0,0,0,.32)',
              transform: `rotate(${r}deg) scale(${interpolate(pop, [0, 1], [0.4, 1])})`, transformOrigin: i === 1 ? '100% 50%' : '0% 50%', opacity: Math.min(1, pop * 1.8)}}>
              <div style={{position: 'absolute', left: 44, top: hA / 2 - 22, opacity: interpolate(merge, [0, 0.45], [1, 0], CL)}}><Stars on={RATE[i]} t={frame - S1_CUE.rows[i]} /></div>
              <div style={{position: 'absolute', left: lerp(488, 266, front ? merge : 0), top: hA / 2 - 13, opacity: dotsO}}><Dots color={C.off} size={26} t={frame - i * 5} /></div>
              {front && (
                <div style={{position: 'absolute', left: 66, top: 92, opacity: interpolate(grow, [0.55, 0.9], [0, 1], CL), ...headStyle(124, C.ink), lineHeight: 1.1}}>
                  {QUOTE.map((line, k) => (
                    <div key={k} style={{whiteSpace: 'nowrap'}}>
                      {line.map(([w, wi]) => <Rise key={wi} at={ws(wi) - 2} style={{marginRight: 30}}>{w}</Rise>)}
                    </div>
                  ))}
                  <div style={{position: 'relative', display: 'inline-block', marginTop: 6, padding: '0 22px 6px 20px', marginLeft: -20}}>
                    <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: LIMEGRAD, transform: `scaleX(${hl})`, transformOrigin: '0% 50%'}} />
                    <Rise at={S1_CUE.hl - 2} style={{position: 'relative'}}>migração?</Rise>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* aspas do balao grande */}
        <div style={{position: 'absolute', left: 106, top: 396, width: 112, height: 112, borderRadius: 56, background: LIMEGRAD, boxShadow: '0 12px 28px rgba(0,0,0,.3)', transform: `scale(${badge}) rotate(${interpolate(badge, [0, 1], [-30, 0])}deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 132, color: C.ink, lineHeight: 1, marginTop: 52}}>“</div>
        </div>
        {/* rabicho do balao, apontando para quem fala */}
        <svg width={110} height={74} viewBox="0 0 110 74" style={{position: 'absolute', left: 150, top: 1124, opacity: interpolate(grow, [0.7, 1], [0, 1], CL)}}>
          <path d="M14 0 C 18 30 10 54 0 72 C 36 62 74 38 96 0 Z" fill={C.off} />
        </svg>
        {/* quem fala: os tres donos de central */}
        {[0, 1, 2].map((i) => {
          const pop = sp(frame, S1_CUE.rows[i] - 3, {damping: 12, stiffness: 190, mass: 0.6});
          const ax = lerp(lerp(avA[i].x, 236 + i * 74, merge), 84 + i * 76, grow);
          const ay = lerp(lerp(avA[i].y, 826, merge), 1196, grow);
          return (
            <Avatar key={i} size={lerp(110, 104, merge)} bg={C.navy3} fg={C.off} ring={i === 1 ? C.limeHi : C.off}
              style={{position: 'absolute', left: ax, top: ay, transform: `scale(${pop})`, zIndex: 3 - i, boxShadow: '0 10px 24px rgba(0,0,0,.3)'}} />
          );
        })}
        <div style={{position: 'absolute', left: 352, top: 1214, fontFamily: BODY, fontWeight: 600, fontSize: 33, lineHeight: 1.2, color: C.off, opacity: interpolate(grow, [0.8, 1], [0, 0.9], CL)}}>
          todo dono de central<br />insatisfeito com a plataforma
        </div>
      </Drift>
    </AbsoluteFill>
  );
};

// ---------- Cena 2: faz sentido ter medo, e a base inteira ----------
export const S2_CUE = {h1: ws(I.faz) - S2 - 2, h2: ws(I.medo) - S2 - 10, tag: ws(I.eA) - S2 - 2, blocks: [ws(I.contrato) - S2 - 3, ws(I.chip) - S2 - 3, ws(I.cliente) - S2 - 3]};
const BASE: [string, string][] = [['file', 'Contrato'], ['sim', 'Chip'], ['user', 'Cliente']];
const BX = 70, BY = 652, BW = 940, BH = 640, PER = 2 * (BW + BH);

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = sp(frame, S2_CUE.tag, {damping: 12, stiffness: 190, mass: 0.6});
  const draw = interpolate(frame, [S2_CUE.tag + 2, S2_CUE.tag + 30], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
  const t0 = S2_CUE.blocks[2] + 9;
  const shake = frame > t0 ? Math.sin((frame - t0) / 1.4) * 8 * Math.exp(-(frame - t0) / 10) : 0;
  return (
    <AbsoluteFill>
      <BgLight seed={8} />
      <Drift dur={S3 - S2 + OVER}>
        <div style={{position: 'absolute', left: 70, top: 276, ...headStyle(134, C.head), fontWeight: 600}}>
          <div><Rise at={S2_CUE.h1}>Faz sentido</Rise></div>
          <div><Rise at={S2_CUE.h2} style={{fontWeight: 700}}>ter medo.</Rise></div>
        </div>
        {/* a base inteira: um contorno que abraca os tres itens */}
        <div style={{position: 'absolute', left: shake, top: 0, width: 1080, height: 1920}}>
          <svg width={BW} height={BH} style={{position: 'absolute', left: BX, top: BY, overflow: 'visible'}}>
            <rect x={2} y={2} width={BW - 4} height={BH - 4} rx={50} fill={`rgba(39,79,100,${0.06 * draw})`} stroke={C.slate} strokeWidth={4} strokeDasharray={PER} strokeDashoffset={PER * (1 - draw)} />
          </svg>
          <div style={{position: 'absolute', left: BX + 46, top: BY - 29, background: LIMEGRAD, borderRadius: 40, padding: '13px 30px', boxShadow: '0 10px 24px rgba(3,37,56,.18)', transform: `scale(${interpolate(tag, [0, 1], [0.5, 1])})`, transformOrigin: '0% 50%', opacity: Math.min(1, tag * 1.6)}}>
            <Tag color={C.ink} size={30}>É a base inteira</Tag>
          </div>
          {BASE.map(([icon, label], i) => {
            const d = sp(frame, S2_CUE.blocks[i], {damping: 12, stiffness: 170, mass: 0.6});
            return <BaseBlock key={label} icon={icon} label={label} w={818} h={156} pile style={{left: BX + 50, top: BY + 70 + i * 186 + interpolate(d, [0, 1], [70, 0]), opacity: Math.min(1, d * 2), transform: `scale(${interpolate(d, [0, 1], [0.9, 1])})`}} />;
          })}
        </div>
      </Drift>
    </AbsoluteFill>
  );
};

// ---------- Cena 3: ficar tambem custa, todo mes ----------
export const S3_CUE = {
  l1: ws(I.ficar) - S3 - 3, l2: ws(I.queNao) - S3 - 3, l3: ws(I.tambem) - S3 - 2, hit: ws(I.custa) - S3,
  months: ws(I.todoMes) - S3 - 2, sweep: ws(I.mes) - S3, cardA: ws(I.emRetrabalho) - S3 - 2, cardB: ws(I.emCliente) - S3 - 2, cancel: ws(I.cancela) - S3,
};
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN'];
const cardBox: React.CSSProperties = {position: 'absolute', left: 70, width: 940, height: 184, borderRadius: 36, background: 'rgba(255,255,255,.06)', border: '2px solid rgba(255,255,255,.14)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 30, padding: '0 34px'};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const under = interpolate(frame, [S3_CUE.hit, S3_CUE.hit + 12], [0, 1], CL);
  const hd = frame - S3_CUE.hit;
  const kick = hd >= 0 && hd < 10 ? Math.sin((hd / 10) * Math.PI) * 0.07 : 0; // batida no "custa"
  const a = sp(frame, S3_CUE.cardA), b = sp(frame, S3_CUE.cardB);
  const loop = Math.max(0, frame - S3_CUE.cardA - 8) % 30; // barra que enche e volta: retrabalho
  return (
    <AbsoluteFill>
      <BgSlate />
      <Drift dur={S4 - S3 + OVER}>
        <div style={{position: 'absolute', left: 70, top: 262, ...headStyle(84, C.off), fontWeight: 600}}>
          <div><Rise at={S3_CUE.l1}>Ficar numa plataforma</Rise></div>
          <div><Rise at={S3_CUE.l2}>que não te atende</Rise></div>
          <div style={{...headStyle(124, C.orange), marginTop: 12, transform: `scale(${1 + kick})`, transformOrigin: '0% 60%'}}>
            <Rise at={S3_CUE.l3}>também custa.</Rise>
          </div>
          <div style={{width: 730 * under, height: 12, borderRadius: 6, background: C.orange, marginTop: 8, opacity: 0.9}} />
        </div>
        {/* todo mes */}
        <div style={{position: 'absolute', left: 70, top: 654, opacity: sp(frame, S3_CUE.months)}}><Tag color={C.pale} size={28}>Todo mês</Tag></div>
        {MONTHS.map((m, k) => {
          const pop = sp(frame, S3_CUE.months + k * 2, {damping: 13, stiffness: 200, mass: 0.6});
          const paid = sp(frame, S3_CUE.sweep + k * 5, {damping: 11, stiffness: 240, mass: 0.5});
          const pc = Math.min(1, Math.max(0, paid));
          return (
            <div key={m} style={{position: 'absolute', left: 70 + k * 159, top: 704, width: 144, height: 138, borderRadius: 26, boxSizing: 'border-box', background: `rgba(242,139,48,${0.16 * pc})`, border: `2px solid ${interpolateColors(pc, [0, 1], ['rgba(255,255,255,0.16)', C.orange])}`,
              transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, opacity: Math.min(1, pop * 1.6), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: C.off}}>{m}</div>
              <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 27, color: '#1B1206', background: C.orange, borderRadius: 16, padding: '2px 13px', transform: `scale(${paid})`, whiteSpace: 'nowrap'}}>− R$</div>
            </div>
          );
        })}
        {/* retrabalho */}
        <div style={{...cardBox, top: 884, opacity: Math.min(1, a * 1.6), transform: `translateY(${interpolate(a, [0, 1], [50, 0])}px)`}}>
          <div style={{width: 112, height: 112, borderRadius: 30, background: 'rgba(242,139,48,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Icon name="repeat" color={C.orange} size={66} sw={2.2} style={{transform: `rotate(${-(frame - S3_CUE.cardA) * 6}deg)`}} />
          </div>
          <div style={{flex: 1}}>
            <div style={{...headStyle(62, C.off)}}>Retrabalho</div>
            <div style={{height: 16, borderRadius: 8, background: 'rgba(255,255,255,.12)', marginTop: 18, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${interpolate(loop, [0, 22, 23, 30], [0, 100, 100, 0], CL)}%`, background: C.orange, borderRadius: 8}} />
            </div>
          </div>
        </div>
        {/* cliente que cancela */}
        <div style={{...cardBox, top: 1090, opacity: Math.min(1, b * 1.6), transform: `translateY(${interpolate(b, [0, 1], [50, 0])}px)`}}>
          <div style={{width: 112, height: 112, borderRadius: 30, background: 'rgba(233,66,37,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Icon name="userx" color="#FF6A4D" size={66} sw={2.2} />
          </div>
          <div style={{...headStyle(54, C.off), flex: 1}}>Cliente que cancela</div>
          <div style={{display: 'flex', gap: 10}}>
            {[0, 1, 2].map((k) => {
              const gone = k === 0 ? 0 : sp(frame, S3_CUE.cancel - 2 + (2 - k) * 9, {damping: 14, stiffness: 150, mass: 0.7});
              return (
                <div key={k} style={{position: 'relative', transform: `translateY(${gone * 46}px) rotate(${gone * 14}deg)`, opacity: 1 - gone * 0.72}}>
                  <Avatar size={62} bg={gone > 0.3 ? 'rgba(233,66,37,.28)' : 'rgba(255,255,255,.14)'} fg={gone > 0.3 ? '#FF6A4D' : C.off} />
                </div>
              );
            })}
          </div>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
