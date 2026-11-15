import type {Edit} from '../types';
import {S} from './helpers';
import {place} from '../Film';
import {snapToBeats} from './beatSnap';
import homeBeats from '../beats/home.json';
import type {Music} from '../types';

/** REDES SOCIAIS (~1:00) — geral do dia, mais rápido, menos cenas e menos pessoas. */
export const social: Edit = {
  shots: [
    S('9649', 0.0, 3.0, {fromBlack: 1.0, zoom: [1.0, 1.06], tag: 'LOCAL'}),
    S('9639', 0.6, 1.5),
    S('9642', 1.6, 1.8),
    S('9619', 2.0, 1.3),
    S('9613', 1.0, 1.2, {zoom: [1.12, 1.05]}),
    S('9686', 0.6, 1.7, {tag: 'ENSAIO'}),
    S('9690', 0.0, 1.4),
    S('9701', 1.2, 1.7, {bw: true}),
    S('9708', 0.8, 2.0, {tag: 'RECEPÇÃO'}),
    S('9711', 0.6, 1.4),
    S('9738', 0.8, 1.5),
    S('1122', 1.0, 2.2, {speed: 0.8, tag: 'CERIMÔNIA'}),
    S('9790', 2.4, 1.7),
    S('1123', 1.0, 1.8, {speed: 0.6}),
    S('1141', 11.3, 1.85, {vol: 1, subs: [{t: 'Amar é conhecer.', at: 0.1, d: 1.7}]}),
    S('9823', 5.8, 1.7),
    S('9836', 0.4, 1.4),
    S('9840', 1.85, 2.4, {speed: 0.55, zoom: [1.06, 1.14]}),
    S('1101', 0.6, 1.3, {tag: 'NOITE'}),
    S('9853', 0.6, 1.5),
    S('9863', 2.0, 2.2),
    S('9921', 1.2, 1.5, {tag: 'PISTA'}),
    S('9924', 1.2, 2.0),
    S('9930', 3.2, 1.5),
    S('9936', 0.0, 10.9, {vol: 0.2, tag: 'FINAL'}),
  ],
  music: [],
  titles: [{text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: 0.5, dur: 2.6, kind: 'open'}],
};
{
  const m: Music = {src: 'home.wav', at: 0, from: 17.0, dur: 80, fin: 0.6, fout: 3.0, vol: 0.95};
  social.shots = snapToBeats(social.shots, m, homeBeats, {tol: 0.3});
  social.music = [m];
  const p = place(social.shots);
  const fin = p[p.length - 1].start;
  social.darken = {at: fin + 9.15, dur: 1.6};
  social.titles.push({text: 'Babita & Tetê', at: fin + 9.9, dur: 3.6, kind: 'close'});
  social.total = fin + 13.5;
  m.dur = social.total;
}
