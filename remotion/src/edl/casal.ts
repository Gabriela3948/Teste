import type {Edit, Music} from '../types';
import {S} from './helpers';
import {place} from '../Film';
import {snapToBeats} from './beatSnap';
import amorBeats from '../beats/amor.json';

/** VÍDEO DO CASAL (~1:00) — só os dois: ensaio e poses, ida à recepção, altar com beijo, poses à noite. */
export const casal: Edit = {
  shots: [
    S('9687', 0.2, 3.2, {fromBlack: 1.2, zoom: [1.0, 1.05], tag: 'ENSAIO'}),
    S('9680', 1.0, 2.0),
    S('9683', 1.0, 1.6),
    S('9684', 1.0, 1.5),
    S('9682', 1.5, 2.0),
    S('9686', 1.0, 2.0),
    S('9689', 0.8, 1.8),
    S('9695', 1.0, 2.0),
    S('9696', 0.2, 2.6),
    S('9698', 4.0, 2.0),
    S('9699', 1.5, 1.8),
    S('9702', 0.3, 1.8),
    S('9701', 3.5, 2.2, {bw: true}),
    S('9697', 1.5, 1.8),
    S('9706', 0.1, 1.8),
    S('9707', 0.2, 1.8),
    S('9691', 0.6, 2.2, {zoom: [1.02, 1.1]}),
    S('9708', 1.0, 2.4, {xin: 0.3, tag: 'RECEPÇÃO'}),
    S('9711', 1.2, 1.7),
    S('9714', 0.5, 1.9, {toBlack: 0.4}),
    S('9799', 0.8, 1.9, {fromBlack: 0.4, tag: 'ALTAR'}),
    S('9813', 0.0, 1.7),
    S('9811', 0.5, 2.0),
    S('9823', 9.0, 2.0),
    S('9838', 1.5, 1.8),
    S('9840', 2.3, 2.7, {speed: 0.55, zoom: [1.04, 1.12]}),
    S('1201', 0.5, 1.8, {xin: 0.3, tag: 'NOITE'}),
    S('1202', 0.3, 2.0),
    S('1203', 1.0, 1.6),
    S('1199', 4.0, 4.6, {zoom: [1.02, 1.1]}),
    S('9840', 3.8, 2.0, {xin: 0.5, tag: 'FINAL'}),
    S('9840', 8.8, 2.1, {speed: 0.7, zoom: [1.02, 1.08], toBlack: 1.4}),
  ],
  music: [],
  titles: [{text: 'Babita & Tetê', at: 1.0, dur: 3.0, kind: 'open'}],
};
{
  const m: Music = {src: 'amor.wav', at: 0, from: 13.0, dur: 80, fin: 1.0, fout: 3.5, vol: 0.95};
  casal.shots = snapToBeats(casal.shots, m, amorBeats, {tol: 0.3});
  casal.music = [m];
  const p = place(casal.shots);
  const last = p[p.length - 1];
  const end = last.start + last.dur;
  casal.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: end - 0.4, dur: 4.4, kind: 'close'});
  casal.total = end + 4.0;
  m.dur = casal.total;
}
