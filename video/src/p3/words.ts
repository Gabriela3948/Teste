import type {W} from '../common/Captions';
import a from './w8064.json';
import b from './w8071.json';
import c from './w8073.json';
import d from './w8075.json';
import {CUT, S1B, S2, S3, S4} from './timing';

const place = (ws: W[], cut: number, off: number): W[] => {
  const out = ws.map((x) => ({w: x.w, s: Math.max(0.04, x.s - cut) + off / 30, e: Math.max(0.1, x.e - cut) + off / 30}));
  out[0].s = off / 30 + 0.04;
  return out;
};
const fixText = (ws: W[]) => ws.map((x) => ({...x, w: x.w.replace(/^terrupções/, 'interrupções').replace(/^aldeia/, 'Aldeia')}));
const w8064 = a as W[];
export const WORDS: W[] = fixText([
  ...place(w8064.filter((x) => x.s < 5.5), CUT.a, 0),
  ...place(w8064.filter((x) => x.s >= 5.5), CUT.b, S1B),
  ...place(b as W[], CUT.t2, S2),
  ...place(c as W[], CUT.t3, S3),
  ...place(d as W[], CUT.t4, S4),
]);
