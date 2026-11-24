import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {BODY, C, LIMEGRAD, headStyle} from '../common/brand';
import {MapLines} from '../common/Fx';
import {Icon} from '../common/Icons';

export const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const FPS = 30;
// mola a partir de um quadro
export const sp = (frame: number, at: number, cfg: {damping: number; stiffness: number; mass: number} = {damping: 13, stiffness: 170, mass: 0.6}) =>
  spring({frame: frame - at, fps: FPS, config: cfg});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// fundos sem a logo: azul-marinho (abertura) e cinza-azulado (problema)
export const BgNavy: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${C.navy2} 0%, ${C.navy} 72%)`}}>
      <MapLines color="#fff" opacity={0.04} seed={11} shift={frame * 0.2} />
    </AbsoluteFill>
  );
};
export const BgSlate: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(165deg, #25343D 0%, #131B20 78%)'}}>
      <MapLines color="#fff" opacity={0.035} seed={23} shift={frame * 0.2} />
    </AbsoluteFill>
  );
};

// entrada de cena subindo de baixo, com uma faixa verde-limao na frente
export const RiseIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const y = interpolate(p, [0, 1], [104, -12]);
  return (
    <>
      {p < 1 && <AbsoluteFill style={{background: LIMEGRAD, clipPath: `polygon(0 ${y - 1}%, 100% ${y - 7}%, 100% ${y + 1}%, 0 ${y + 7}%)`}} />}
      <AbsoluteFill style={{clipPath: p < 1 ? `polygon(0 ${y + 6}%, 100% ${y}%, 100% 101%, 0 101%)` : undefined}}>{children}</AbsoluteFill>
    </>
  );
};

// empurrao lento de camera no conteudo da cena (o fundo fica parado)
export const Drift: React.FC<{dur: number; children: React.ReactNode; to?: number}> = ({dur, children, to = 1.035}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{transform: `scale(${interpolate(frame, [0, dur], [1, to], CL)})`, transformOrigin: '50% 42%'}}>{children}</AbsoluteFill>;
};

// nota de avaliacao em estrelas (as acesas ficam laranja: avaliacao baixa)
const STAR = 'M12 3.2l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.600 20l1.1-6.1L3.200 9.600l6.1-.8z';
export const Stars: React.FC<{on: number; t: number; size?: number}> = ({on, t, size = 44}) => (
  <div style={{display: 'flex', gap: 6}}>
    {[0, 1, 2, 3, 4].map((k) => {
      const p = sp(t, 3 + k * 2, {damping: 11, stiffness: 220, mass: 0.5});
      const lit = k < on;
      return (
        <svg key={k} width={size} height={size} viewBox="0 0 24 24" style={{transform: `scale(${p})`}}>
          <path d={STAR} fill={lit ? C.orange : 'none'} stroke={lit ? C.orange : 'rgba(238,243,237,.4)'} strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
      );
    })}
  </div>
);

// avatar simples (pessoa)
export const Avatar: React.FC<{size: number; bg: string; fg: string; ring?: string; icon?: string; style?: React.CSSProperties}> = ({size, bg, fg, ring, icon = 'user', style}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: bg, border: ring ? `${Math.max(3, size * 0.045)}px solid ${ring}` : undefined, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style}}>
    <Icon name={icon} color={fg} size={size * 0.56} sw={2} />
  </div>
);

// tres pontinhos de "digitando"
export const Dots: React.FC<{color: string; size?: number; t: number}> = ({color, size = 20, t}) => (
  <div style={{display: 'flex', gap: size * 0.55, alignItems: 'center'}}>
    {[0, 1, 2].map((i) => {
      const k = Math.max(0, Math.sin((t - i * 4) / 4.2));
      return <div key={i} style={{width: size, height: size, borderRadius: size / 2, background: color, opacity: 0.45 + k * 0.55, transform: `translateY(${-k * size * 0.45}px)`}} />;
    })}
  </div>
);

// bloco da base (contrato, chip, cliente): cartao com icone e nome; "pilha" indica volume
export const BaseBlock: React.FC<{icon: string; label: string; w: number; h: number; pile?: boolean; check?: number; style?: React.CSSProperties}> = ({icon, label, w, h, pile, check = 0, style}) => {
  const tile = h - (h > 150 ? 48 : 36);
  return (
    <div style={{position: 'absolute', width: w, height: h, ...style}}>
      {pile && <div style={{position: 'absolute', left: 22, top: 20, width: w - 22, height: h, borderRadius: 34, background: '#C9D6CD'}} />}
      {pile && <div style={{position: 'absolute', left: 11, top: 10, width: w - 11, height: h, borderRadius: 34, background: '#DCE6DE'}} />}
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: h > 150 ? 34 : 26, background: '#fff', boxShadow: '0 18px 40px rgba(3,37,56,.18)', display: 'flex', alignItems: 'center', gap: h > 150 ? 30 : 20, padding: `0 ${h > 150 ? 26 : 18}px`, boxSizing: 'border-box'}}>
        <div style={{width: tile, height: tile, borderRadius: tile * 0.26, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <Icon name={icon} color={C.limeHi} size={tile * 0.6} sw={2} />
        </div>
        <div style={{...headStyle(h > 150 ? 76 : 46, C.ink)}}>{label}</div>
        {check > 0 && (
          <div style={{marginLeft: 'auto', width: 50, height: 50, borderRadius: 25, background: LIMEGRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`, flexShrink: 0}}>
            <Icon name="check" color={C.ink} size={34} sw={3.2} />
          </div>
        )}
      </div>
    </div>
  );
};

// etiqueta em caixa alta
export const Tag: React.FC<{children: React.ReactNode; color: string; size?: number; style?: React.CSSProperties}> = ({children, color, size = 28, style}) => (
  <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size, letterSpacing: size * 0.13, color, textTransform: 'uppercase', whiteSpace: 'nowrap', ...style}}>{children}</div>
);
