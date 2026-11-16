import type {Edit, Music, Voice} from '../types';
import {S} from './helpers';
import {place} from '../Film';

/**
 * CERIMÔNIA — foco na tia (celebrante): entrada, falas da tia, votos dele e dela, olhares e reações,
 * alianças e beijo. Música: O Que É o Amor (abaixa sob as falas).
 */
const v = (src: string, from: number, dur: number, subs: Voice['subs']): Voice => ({src, at: 0, from, dur, vol: 1, duck: true, fin: 0.12, fout: 0.2, subs});

export const cerimonia: Edit = {
  duckLevel: 0.14,
  shots: [
    // Entrada
    S('1122', 2.2, 2.5, {speed: 0.8, fromBlack: 0.8, tag: 'ENTRADA'}),
    S('9790', 3.8, 2.1),
    S('1123', 0.4, 2.4, {speed: 0.6}),
    // Tia — quem celebrou
    S('9795', 0.2, 4.4, {tag: 'TIA', vo: v('9796', 0.3, 4.4, [{t: '...e participo de tudo, tudo, como aquela tia mais babona possível.', at: 0.1, d: 4.2}])}),
    S('1132', 0.9, 2.6, {vol: 1, subs: [{t: 'Estamos aqui para celebrar o amor.', at: 0.2, d: 2.2}]}),
    S('1133', 0.0, 2.9, {vol: 1, subs: [{t: '“Gostaria de ter alguém para dividir a vida comigo.”', at: 0.1, d: 2.7}]}),
    S('9805', 0.6, 2.8, {vo: v('1133', 4.1, 2.8, [{t: 'Isso a gente sabia. Já o Tetê...', at: 0.1, d: 2.6}])}),
    S('9804', 0.3, 5.7, {
      vol: 1,
      subs: [
        {t: '...ele estava aproveitando a vida...', at: 0.1, d: 2.9},
        {t: '...loucamente.', at: 3.3, d: 2.2},
      ],
    }),
    S('9807', 0.6, 3.7, {vol: 1, subs: [{t: 'E quando o treino terminou, Bárbara só conseguia pensar:', at: 0.2, d: 3.4}]}),
    S('9808', 0.0, 1.8, {vol: 1, subs: [{t: '“Quero conversar mais com ele.”', at: 0.05, d: 1.7}]}),
    S('1134', 0.0, 6.2, {
      vol: 1,
      subs: [
        {t: 'Porque o amor deles não começou com uma promessa de eternidade.', at: 0.05, d: 3.2},
        {t: 'Começou com a vontade de prolongar a vida.', at: 3.4, d: 2.7},
      ],
    }),
    S('9797', 0.4, 2.0, {
      vo: v('9810', 0.0, 6.1, [
        {t: '...no gosto musical,', at: 0.1, d: 1.5},
        {t: 'e até nutre uma paixão por Star Wars e Harry Potter.', at: 1.7, d: 4.3},
      ]),
    }),
    S('9811', 0.5, 2.1),
    S('1128', 3.0, 2.0),
    S('1137', 0.3, 2.5, {vo: v('1137', 0.3, 5.0, [{t: 'Gosta de planejar, calcular e, se possível, antecipar até o imprevisto.', at: 0.2, d: 4.7}])}),
    S('1127', 3.0, 2.5),
    S('1140', 0.3, 2.7, {vo: v('1141', 0.9, 2.7, [{t: 'E isso é uma compreensão muito madura do amor.', at: 0.1, d: 2.5}])}),
    S('1141', 5.3, 7.85, {
      vol: 1,
      subs: [
        {t: 'Porque amar não é encontrar alguém perfeito,', at: 0.25, d: 2.7},
        {t: 'não é tentar transformar o outro naquilo que a gente quer que ele seja.', at: 3.0, d: 3.3},
        {t: 'Amar é conhecer.', at: 6.35, d: 1.45},
      ],
    }),
    S('9812', 1.5, 3.65, {vol: 1, subs: [{t: 'E quando olham para o futuro, eles imaginam uma casa...', at: 0.1, d: 3.5}]}),
    S('9813', 0.0, 1.8, {vol: 1, subs: [{t: '...de vida, de afeto, de família.', at: 0.0, d: 1.8}]}),
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
    S('9837', 2.8, 3.6, {
      vo: v('9837', 2.8, 3.6, [{t: 'Então, sabe quando eu tive a certeza absoluta de que eu queria me casar com você?', at: 0.1, d: 3.4}]),
    }),
    S('9834', 0.2, 3.8, {
      vo: v('9837', 7.1, 3.8, [{t: 'Quando eu comecei a sonhar com uma terceira pessoinha bagunçando tudo isso.', at: 0.2, d: 3.5}]),
    }),
    S('1153', 2.0, 2.9, {
      vo: v('9837', 11.6, 2.9, [{t: 'E eu mal posso esperar por essa nova fase. Te amo.', at: 0.15, d: 2.7}]),
    }),
    // Bênção, alianças e beijo
    S('9843', 0.0, 2.1, {vol: 1, tag: 'BÊNÇÃO', subs: [{t: '...oração do amor, da paz e da luz.', at: 0.05, d: 2.0}]}),
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
