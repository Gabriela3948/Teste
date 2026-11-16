import type {Edit, Music, Voice} from '../types';
import {S} from './helpers';
import {place} from '../Film';

/**
 * CERIMÔNIA (~1:10) — entrada, falas da tia, votos dele e dela, olhares e reações,
 * alianças e beijo. Música: O Que É o Amor (abaixa sob as falas).
 */
const v = (src: string, from: number, dur: number, subs: Voice['subs']): Voice => ({src, at: 0, from, dur, vol: 1, duck: true, fin: 0.12, fout: 0.2, subs});

export const cerimonia: Edit = {
  duckLevel: 0.14,
  shots: [
    // Entrada
    S('1122', 2.2, 2.8, {speed: 0.8, fromBlack: 0.8, tag: 'ENTRADA'}),
    S('9790', 3.8, 2.4),
    S('1123', 0.4, 2.6, {speed: 0.6}),
    // Tia
    S('1132', 0.9, 2.6, {vol: 1, tag: 'TIA', subs: [{t: 'Estamos aqui para celebrar o amor.', at: 0.2, d: 2.2}]}),
    S('1134', 0.4, 2.6, {
      vo: v('9810', 0.0, 6.1, [
        {t: '...no gosto musical,', at: 0.1, d: 1.5},
        {t: 'e até nutre uma paixão por Star Wars e Harry Potter.', at: 1.7, d: 4.3},
      ]),
    }),
    S('1136', 0.6, 1.8),
    S('9811', 0.5, 1.7),
    S('1141', 5.3, 7.85, {
      vol: 1,
      subs: [
        {t: 'Porque amar não é encontrar alguém perfeito,', at: 0.25, d: 2.7},
        {t: 'não é tentar transformar o outro naquilo que a gente quer que ele seja.', at: 3.0, d: 3.3},
        {t: 'Amar é conhecer.', at: 6.35, d: 1.45},
      ],
    }),
    // Votos dele
    S('9818', 0.0, 1.9, {vol: 1, tag: 'VOTOS DELE', subs: [{t: '...jamais sairia da minha vida.', at: 0.05, d: 1.5}]}),
    S('1145', 4.3, 6.6, {
      vol: 1,
      subs: [
        {t: 'E eu confio sempre que o acaso', at: 0.3, d: 1.6},
        {t: 'vai trazer a gente pro lugar correto.', at: 2.0, d: 1.6},
        {t: 'Eu sei que isso te irrita pra caramba.', at: 4.7, d: 1.8},
      ],
    }),
    // Votos dela
    S('9828', 5.9, 2.6, {vol: 1, tag: 'VOTOS DELA', subs: [{t: 'Quero que todos vocês aqui fechem os olhos.', at: 0.2, d: 2.2}]}),
    S('1152', 1.5, 1.8),
    S('1151', 2.0, 1.6),
    S('9832', 0.0, 4.65, {
      vo: v('9832', 0.0, 8.25, [
        {t: '...aos 37 anos, depois de conhecer você', at: 0.1, d: 2.4},
        {t: 'e cultivar a nossa relação dia após dia,', at: 2.5, d: 2.1},
        {t: 'eu já entendi que amor, na verdade, é como as nossas manhãs de sábado.', at: 4.7, d: 3.5},
      ]),
    }),
    S('9836', 0.0, 3.6),
    S('9837', 2.8, 3.6, {
      vo: v('9837', 2.8, 3.6, [{t: 'Então, sabe quando eu tive a certeza absoluta de que eu queria me casar com você?', at: 0.1, d: 3.4}]),
    }),
    S('9834', 0.2, 3.8, {
      vo: v('9837', 7.1, 3.8, [{t: 'Quando eu comecei a sonhar com uma terceira pessoinha bagunçando tudo isso.', at: 0.2, d: 3.5}]),
    }),
    S('1153', 2.0, 2.9, {
      vo: v('9837', 11.6, 2.9, [{t: 'E eu mal posso esperar por essa nova fase. Te amo.', at: 0.15, d: 2.7}]),
    }),
    // Alianças e beijo
    S('9838', 1.0, 2.4, {tag: 'ALIANÇAS'}),
    S('9839', 0.2, 2.2),
    S('1158', 2.5, 1.6),
    S('9840', 2.0, 3.6, {speed: 0.55, zoom: [1.04, 1.12], toBlack: 1.3, tag: 'BEIJO'}),
  ],
  music: [],
  titles: [{text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: 0.8, dur: 3.4, kind: 'open'}],
};
{
  const p = place(cerimonia.shots);
  const last = p[p.length - 1];
  const end = last.start + last.dur;
  cerimonia.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: end - 0.4, dur: 4.4, kind: 'close'});
  cerimonia.total = end + 4.0;
  const m: Music = {src: 'amor.wav', at: 0, from: 13.0, dur: cerimonia.total, fin: 1.0, fout: 3.5, vol: 0.95};
  cerimonia.music = [m];
}
