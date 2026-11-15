import type {Edit, Shot} from '../types';
import {S} from './helpers';

/**
 * AFTER MOVIE — Babita & Tetê (~2:50)
 * Ordem pedida: local/decoração → making of → ida à recepção → recepção →
 * entrada da cerimônia (flores) → tia celebrante → votos → alianças/beijo →
 * decoração à noite → bolo → brinde → pista (sorrindo → música da festa) → final.
 */

const local: Shot[] = [
  S('9649', 0.0, 5.0, {fromBlack: 2.0, zoom: [1.0, 1.08], tag: 'LOCAL'}),
  S('9639', 0.4, 3.2, {xin: 1.0, zoom: [1.02, 1.1]}),
  S('9633', 0.8, 2.4, {xin: 0.5}),
  S('9642', 1.2, 3.0, {xin: 0.4, zoom: [1.02, 1.06]}),
  S('9623', 5.0, 2.2),
  S('9619', 2.0, 2.2),
  S('9613', 1.0, 2.0, {zoom: [1.12, 1.03]}),
  S('9615', 1.5, 2.0),
  S('9657', 1.0, 2.4),
  S('9664', 1.5, 2.0, {zoom: [1.02, 1.12]}),
];

const makingOf: Shot[] = [
  S('9696', 4.2, 2.4, {xin: 0.8, blur: true, tag: 'MAKING OF'}),
  S('9683', 0.6, 1.9),
  S('9693', 0.0, 1.8, {bw: true}),
  S('9686', 0.6, 2.8),
  S('9690', 0.0, 1.7),
  S('9698', 2.2, 2.2),
  S('9701', 1.0, 2.8, {bw: true}),
  S('9707', 0.0, 2.0),
];

const recepcao: Shot[] = [
  S('9708', 0.5, 3.8, {xin: 0.5, zoom: [1.02, 1.08], tag: 'IDA À RECEPÇÃO'}),
  S('9711', 0.6, 2.2, {tag: 'RECEPÇÃO'}),
  S('9712', 2.4, 2.4),
  S('9738', 0.6, 2.4),
  S('9749', 0.0, 1.8),
  S('9732', 1.0, 2.4, {toBlack: 0.6}),
];

const cerimonia: Shot[] = [
  S('1122', 0.5, 3.4, {fromBlack: 0.6, speed: 0.8, tag: 'CERIMÔNIA'}),
  S('9790', 2.2, 3.0),
  S('1123', 0.8, 2.8, {speed: 0.6}),
  S('1125', 0.4, 2.2, {bw: true}),
  // Tia celebrante
  S('1132', 0.95, 2.3, {
    vol: 1,
    tag: 'TIA',
    subs: [{t: 'Estamos aqui para celebrar o amor.', at: 0.1, d: 2.1}],
  }),
  S('1134', 0.4, 2.9, {
    vo: {
      src: '9810', at: 0, from: 0.0, dur: 6.1, vol: 1, duck: true,
      subs: [
        {t: '...no gosto musical,', at: 0.1, d: 1.5},
        {t: 'e até nutre uma paixão por Star Wars e Harry Potter.', at: 1.7, d: 4.3},
      ],
    },
  }),
  S('9811', 0.3, 3.2),
  S('1141', 5.4, 7.75, {
    vol: 1,
    subs: [
      {t: 'Porque amar não é encontrar alguém perfeito,', at: 0.15, d: 2.7},
      {t: 'não é tentar transformar o outro naquilo que a gente quer que ele seja.', at: 2.9, d: 3.3},
      {t: 'Amar é conhecer.', at: 6.25, d: 1.6},
    ],
  }),
  // Votos — ele
  S('1145', 4.3, 4.1, {
    vol: 1,
    tag: 'VOTOS',
    subs: [
      {t: 'E eu confio sempre que o acaso', at: 0.2, d: 1.9},
      {t: 'vai trazer a gente pro lugar correto.', at: 2.25, d: 1.8},
    ],
  }),
  S('9822', 0.9, 2.1, {vol: 1, subs: [{t: 'Eu sei que isso te irrita pra caramba.', at: 0.15, d: 1.9}]}),
  S('9823', 5.6, 2.8, {vol: 0.5}),
  // Votos — ela
  S('9832', 0.1, 4.6, {
    vol: 1,
    subs: [
      {t: 'Hoje, aos 37 anos, depois de conhecer você', at: 0.0, d: 2.5},
      {t: 'e cultivar a nossa relação dia após dia,', at: 2.5, d: 2.1},
    ],
  }),
  S('9836', 0.0, 3.6, {
    vo: {
      src: '9832', at: 0, from: 4.7, dur: 3.6, vol: 1, duck: true,
      subs: [{t: 'eu já entendi que amor, na verdade, é como as nossas manhãs de sábado.', at: 0.0, d: 3.5}],
    },
  }),
  // Alianças e beijo
  S('9838', 1.5, 2.4, {tag: 'BEIJO'}),
  S('9840', 1.75, 3.0, {speed: 0.55, zoom: [1.06, 1.14]}),
  S('1156', 2.0, 2.4),
  S('9841', 0.2, 1.9, {toBlack: 0.7}),
];

const noite: Shot[] = [
  S('1101', 0.5, 2.4, {fromBlack: 0.5, tag: 'NOITE'}),
  S('9771', 0.5, 2.0),
  S('1108', 2.0, 2.4),
  S('9760', 3.0, 2.0),
  // bolo
  S('1201', 0.0, 2.6, {tag: 'BOLO'}),
  S('9851', 0.5, 2.0),
  S('9853', 0.5, 2.2),
  S('9859', 0.0, 2.3),
  S('9862', 0.3, 2.2),
  // brinde
  S('9863', 1.4, 3.4, {tag: 'BRINDE'}),
];

const pista: Shot[] = [
  S('9917', 0.3, 2.3, {xin: 0.4, tag: 'PISTA'}),
  S('9902', 0.0, 1.8),
  S('9935', 0.0, 1.7),
  // virada para a música da festa
  S('9919', 0.6, 2.6, {
    tag: 'PISTA-FESTA',
    vo: {src: '9919', at: 0, from: 0.0, dur: 18.5, vol: 1.0, fin: 0.6, fout: 1.2},
  }),
  S('9921', 1.0, 2.2),
  S('9922', 0.5, 2.0),
  S('9924', 1.0, 3.0),
  S('9923', 2.0, 1.8),
  S('9930', 3.0, 2.2),
  S('9931', 1.0, 1.8),
  S('9928', 2.0, 2.0),
];

const final: Shot[] = [S('9936', 0.0, 10.9, {vol: 1, tag: 'FINAL'})];

const shots = [...local, ...makingOf, ...recepcao, ...cerimonia, ...noite, ...pista, ...final];

export const afterMovie: Edit = {
  shots,
  music: [],
  titles: [
    {text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: 1.0, dur: 4.0, kind: 'open'},
  ],
};

// Final: a mão do noivo cobre a câmera (~9,3s do take) → escurece → título
import {place} from '../Film';
const p = place(afterMovie.shots);
const fin = p[p.length - 1].start;
afterMovie.darken = {at: fin + 9.15, dur: 1.6};
afterMovie.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: fin + 9.9, dur: 5.2, kind: 'close'});
afterMovie.total = fin + 15.1;
