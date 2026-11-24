import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C, CAPGRAD} from './brand';

export type W = {w: string; s: number; e: number};
const CONN = /^(e|de|da|do|os|o|a|as|para|pra|com|ou|um|uma|em|que|na|no|pelo|se)$/i;

// agrupa as palavras em blocos curtos (ate 3 palavras), quebrando em pausas e pontuacao
export const groupWords = (ws: W[]): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  for (const x of ws) {
    const len = cur.map((c) => c.w).join(' ').length;
    const gap = cur.length ? x.s - cur[cur.length - 1].e : 0;
    const conn = CONN.test(x.w.replace(/[.,?!:]/g, ''));
    if (cur.length && (len + x.w.length > 20 || cur.length >= 3 || gap > 0.35 || (conn && cur.length >= 2))) {
      out.push(cur);
      cur = [];
    }
    cur.push(x);
    if (/[.,!?:]$/.test(x.w)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

const inside = (frame: number, ranges?: [number, number][]) => !!ranges && ranges.some(([a, b]) => frame >= a && frame < b);

// Legenda no padrao dos videos da Aldeia: caixa alta, palavra falada na caixinha azul-verde.
// hidden: trechos (frames) sem legenda; light: trechos sobre fundo claro (texto escuro)
export const Captions: React.FC<{words: W[]; end: number; top?: number; hidden?: [number, number][]; light?: [number, number][]}> = ({words, end, top = 1405, hidden, light}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const groups = React.useMemo(() => groupWords(words), [words]);
  const t = frame / fps;
  if (frame >= end || inside(frame, hidden)) return null;
  const idx = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    return t >= g[0].s - 0.03 && t < (next ? Math.min(next[0].s - 0.03, g[g.length - 1].e + 0.5) : g[g.length - 1].e + 0.3);
  });
  if (idx < 0) return null;
  const g = groups[idx];
  const local = frame - Math.round((g[0].s - 0.03) * fps);
  const pop = spring({frame: local, fps, config: {damping: 16, stiffness: 240, mass: 0.5}});
  const onLight = inside(frame, light);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: BODY, fontWeight: 800, fontSize: 47, lineHeight: 1.3, letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase', whiteSpace: 'nowrap',
          color: onLight ? C.ink : '#fff', textShadow: onLight ? 'none' : '0 3px 10px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.8)',
          transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`, opacity: interpolate(pop, [0, 1], [0.3, 1]),
        }}
      >
        {g.map((x, i) => {
          const clean = x.w.replace(/[.,?!:]$/, '');
          const next = g[i + 1];
          const active = t >= x.s - 0.03 && (!next || t < next.s - 0.03);
          return (
            <span key={i} style={{display: 'inline-block', padding: '1px 11px', margin: '0 1px', borderRadius: 11, color: active ? '#fff' : undefined,
              background: active ? CAPGRAD : 'transparent', textShadow: active ? '0 2px 6px rgba(0,0,0,.35)' : undefined}}>
              {clean}
            </span>
          );
        })}
      </div>
    </div>
  );
};
