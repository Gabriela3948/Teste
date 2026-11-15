import type {Edit} from '../types';
import {S} from './helpers';
import {place} from '../Film';
import {snapToBeats} from './beatSnap';
import amorBeats from '../beats/amor.json';
import type {Music} from '../types';

/** VÍDEO DO CASAL (~1:00) — só os dois: ensaio, ida à recepção, poucos cumprimentos, altar e beijo. */
export const casal: Edit = {
  shots: [
    S('9687', 0.3, 3.6, {fromBlack: 1.5, zoom: [1.0, 1.06], tag: 'ENSAIO'}),
    S('9680', 0.5, 2.4, {xin: 0.6}),
    S('9683', 0.6, 1.9),
    S('9686', 0.6, 2.6),
    S('9693', 0.0, 1.8, {bw: true}),
    S('9689', 1.0, 2.2),
    S('9690', 0.0, 1.7),
    S('9698', 4.0, 2.2),
    S('9701', 1.0, 3.0, {bw: true}),
    S('9707', 0.0, 2.0),
    S('9708', 0.5, 3.4, {xin: 0.4, tag: 'RECEPÇÃO'}),
    S('9711', 0.6, 2.0),
    S('9738', 0.6, 2.4, {toBlack: 0.5}),
    S('9799', 0.6, 2.6, {fromBlack: 0.5, tag: 'ALTAR'}),
    S('9800', 3.5, 2.4),
    S('1139', 0.5, 2.2, {bw: true}),
    S('9823', 5.6, 2.8),
    S('9836', 0.2, 2.4),
    S('9840', 1.75, 3.0, {speed: 0.55, zoom: [1.06, 1.14]}),
    S('1201', 0.0, 2.6, {xin: 0.4, tag: 'FESTA'}),
    S('9935', 0.0, 1.7),
    S('9936', 0.0, 10.9, {vol: 0.2, tag: 'FINAL'}),
  ],
  music: [],
  titles: [{text: 'Babita & Tetê', at: 1.0, dur: 3.0, kind: 'open'}],
};
{
  const m: Music = {src: 'amor.wav', at: 0, from: 13.0, dur: 80, fin: 1.0, fout: 3.5, vol: 0.95};
  casal.shots = snapToBeats(casal.shots, m, amorBeats, {tol: 0.3});
  casal.music = [m];
  const p = place(casal.shots);
  const fin = p[p.length - 1].start;
  casal.darken = {at: fin + 9.15, dur: 1.6};
  casal.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: fin + 9.9, dur: 4.6, kind: 'close'});
  casal.total = fin + 14.5;
  m.dur = casal.total;
}
