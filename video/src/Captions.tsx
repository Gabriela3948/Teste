import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import w1 from './words1.json';
import w2 from './words2.json';
import {A1, A2, T2} from './theme';

type W = {w: string; s: number; e: number};

// tempos dos takes -> tempo global (take1 cortado em 0.9s, take2 em 0.95s)
const fix = (ws: W[], cut: number, off: number): W[] =>
  ws.map((x, i) => ({w: x.w, s: Math.max(i === 0 ? 0.05 : 0, x.s - cut) + off, e: x.e - cut + off}));
const a = fix(w1 as W[], A1, 0);
a[0].s = 0.06;
const b = fix(w2 as W[], A2, T2 / 30);
b[0].s = T2 / 30 + 0.03;

const group = (ws: W[]): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  for (const x of ws) {
    const len = cur.map((c) => c.w).join(' ').length;
    const gap = cur.length ? x.s - cur[cur.length - 1].e : 0;
    const conn = /^(e|de|da|do|os|a|para|com|ou|seja)$/i.test(x.w);
    if (cur.length && (len + x.w.length > 20 || cur.length >= 3 || gap > 0.35 || (conn && cur.length >= 2))) {
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
    <div style={{position: 'absolute', left: 60, right: 60, top: 1405, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: 'Montserrat', fontWeight: 800, fontSize: 47, lineHeight: 1.3, letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase',
          color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.8)', whiteSpace: 'nowrap',
          transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`, opacity: interpolate(pop, [0, 1], [0.3, 1]),
        }}
      >
        {g.map((x, i) => {
          const clean = x.w.replace(/[.,]$/, '');
          const next = g[i + 1];
          const active = t >= x.s - 0.03 && (!next || t < next.s - 0.03);
          return (
            <span key={i} style={{display: 'inline-block', padding: '1px 11px', margin: '0 1px', borderRadius: 11,
              background: active ? 'linear-gradient(90deg, #2F7FEA 0%, #3BD8B2 100%)' : 'transparent',
              textShadow: active ? '0 2px 6px rgba(0,0,0,.35)' : undefined}}>
              {clean}
            </span>
          );
        })}
      </div>
    </div>
  );
};
