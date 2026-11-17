import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import w1 from './words1.json';
import w2 from './words2.json';
import {MINT, T2} from './theme';

type W = {w: string; s: number; e: number};
const HL = /fenatran|américa|latina|parcerias|novidades|rastreamento|motoristas|frota|logística|agro|aldeia/i;

// tempos dos takes -> tempo global (take1 cortado em 0.9s, take2 em 0.95s)
const fix = (ws: W[], cut: number, off: number): W[] =>
  ws.map((x, i) => ({w: x.w, s: Math.max(i === 0 ? 0.05 : 0, x.s - cut) + off, e: x.e - cut + off}));
const a = fix(w1 as W[], 0.9, 0);
a[0].s = 0.08;
const b = fix(w2 as W[], 0.95, T2 / 30);

const group = (ws: W[]): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  for (const x of ws) {
    const len = cur.map((c) => c.w).join(' ').length;
    const gap = cur.length ? x.s - cur[cur.length - 1].e : 0;
    const conn = /^(e|de|da|do|os|a|para|com|ou|seja)$/i.test(x.w);
    if (cur.length && (len + x.w.length > 17 || cur.length >= 3 || gap > 0.35 || (conn && cur.length >= 2))) {
      out.push(cur);
      cur = [];
    }
    cur.push(x);
    if (/[.,!?]$/.test(x.w)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
};
const groups = [...group(a), ...group(b)];

export const Captions: React.FC<{hideAfter: number}> = ({hideAfter}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (frame >= hideAfter) return null;
  const idx = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    return t >= g[0].s - 0.03 && t < (next ? Math.min(next[0].s - 0.03, g[g.length - 1].e + 0.5) : g[g.length - 1].e + 0.3);
  });
  if (idx < 0) return null;
  const g = groups[idx];
  const local = frame - Math.round((g[0].s - 0.03) * fps);
  const pop = spring({frame: local, fps, config: {damping: 16, stiffness: 240, mass: 0.5}});
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1270, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: 'Montserrat', fontWeight: 800, fontSize: 74, lineHeight: 1.12, letterSpacing: -1.5, textAlign: 'center',
          color: '#fff', textShadow: '0 4px 22px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)',
          transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})`, opacity: interpolate(pop, [0, 1], [0.2, 1]),
        }}
      >
        {g.map((x, i) => {
          const clean = x.w.replace(/[.,]$/, '');
          const hl = HL.test(clean);
          return (
            <span key={i} style={{color: hl ? MINT : t >= x.s - 0.03 ? '#fff' : 'rgba(255,255,255,.72)'}}>
              {clean}{i < g.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
