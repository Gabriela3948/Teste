import type {Edit} from '../types';
import {S} from './helpers';
import {place} from '../Film';
import {snapToBeats} from './beatSnap';
import amorBeats from '../beats/amor.json';
import type {Music} from '../types';

/** VÍDEO DO CASAL (~1:00) — só os dois: ensaio, ida à recepção, poucos cumprimentos, altar e beijo. */
export const casal: Edit = {
  shots: [
    S('9687', 4.5, 3.0, {fromBlack: 1.2, zoom: [1.0, 1.05], tag: 'ENSAIO'}),
    S('9683', 1.0, 1.6),
    S('9684', 1.0, 1.5),
    S('9686', 1.0, 2.0),
    S('9688', 1.2, 1.8),
    S('9690', 0.0, 1.7),
    S('9696', 3.5, 1.8, {bw: true}),
    S('9698', 6.8, 2.0),
    S('9702', 0.3, 1.8),
    S('9701', 3.5, 2.2, {bw: true}),
    S('9704', 0.5, 1.6),
    S('9707', 0.4, 1.9),
    S('9708', 1.0, 2.4, {xin: 0.3, tag: 'RECEPÇÃO'}),
    S('9711', 1.2, 1.7),
    S('9726', 2.5, 1.8),
    S('9738', 1.0, 1.8, {toBlack: 0.4}),
    S('9799', 0.8, 1.9, {fromBlack: 0.4, tag: 'ALTAR'}),
    S('9813', 0.0, 1.7),
    S('9811', 0.5, 2.0),
    S('9823', 9.0, 2.0),
    S('9836', 0.3, 1.8),
    S('9838', 1.5, 1.8),
    S('9840', 1.75, 3.0, {speed: 0.55, zoom: [1.06, 1.14]}),
    S('1201', 0.5, 1.8, {xin: 0.3, tag: 'FESTA'}),
    S('1203', 1.0, 1.6),
    S('9902', 0.6, 1.5),
    S('9935', 0.0, 1.7),
    S('9936', 2.4, 8.5, {vol: 0.2, tag: 'FINAL'}),
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
  casal.darken = {at: fin + 7.55, dur: 1.4};
  casal.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: fin + 8.2, dur: 4.6, kind: 'close'});
  casal.total = fin + 12.8;
  m.dur = casal.total;
}
