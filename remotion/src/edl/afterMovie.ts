import type {Edit, Music, Shot} from '../types';
import {S} from './helpers';
import {place} from '../Film';
import {snapToBeats} from './beatSnap';
import homeBeats from '../beats/home.json';
import mrazBeats from '../beats/mraz.json';
import amorBeats from '../beats/amor.json';
import garrafaBeats from '../beats/garrafa.json';

/**
 * AFTER MOVIE — Babita & Tetê (~2:50)
 * Ordem pedida: local/decoração → making of → ida à recepção → recepção →
 * entrada da cerimônia (flores) → tia celebrante → votos → alianças/beijo →
 * decoração à noite → bolo → brinde → pista (sorrindo → música da festa) → final.
 */

const local: Shot[] = [
  S('9649', 0.0, 5.0, {fromBlack: 2.0, zoom: [1.0, 1.08], tag: 'LOCAL'}),
  S('9639', 0.6, 2.4, {xin: 1.0, zoom: [1.02, 1.1]}),
  S('9633', 0.8, 2.4, {xin: 0.5}),
  S('9642', 1.4, 2.4, {xin: 0.4, zoom: [1.02, 1.06]}),
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
  S('9702', 0.3, 1.8),
  S('9686', 1.0, 2.1),
  S('9689', 0.8, 1.8),
  S('9698', 4.0, 2.0),
  S('9701', 3.5, 2.2, {bw: true}),
  S('9707', 0.2, 1.8),
];

const recepcao: Shot[] = [
  S('9708', 1.0, 2.6, {xin: 0.5, zoom: [1.02, 1.08], tag: 'IDA À RECEPÇÃO'}),
  S('9711', 0.6, 2.2, {tag: 'RECEPÇÃO'}),
  S('9712', 2.4, 2.4),
  S('9714', 0.5, 2.0),
  S('9749', 0.0, 1.8),
  S('9732', 1.0, 2.4, {toBlack: 0.6}),
];

const cerimonia: Shot[] = [
  S('1122', 2.2, 2.8, {fromBlack: 0.6, speed: 0.8, tag: 'CERIMÔNIA'}),
  S('9790', 3.8, 2.4),
  S('1123', 0.4, 2.8, {speed: 0.6}),
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
      {t: '...aos 37 anos, depois de conhecer você', at: 0.0, d: 2.5},
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
  S('9840', 2.3, 2.7, {speed: 0.55, zoom: [1.04, 1.12]}),
  S('1156', 7.5, 2.4),
  S('9841', 0.2, 1.9, {toBlack: 0.7}),
];

const noite: Shot[] = [
  S('1101', 0.5, 2.4, {fromBlack: 0.5, tag: 'NOITE'}),
  S('9771', 0.5, 2.0),
  S('1108', 2.0, 2.4),
  S('9760', 3.0, 2.0, {tag: 'COMIDA'}),
  S('9775', 1.0, 1.6, {zoom: [1.1, 1.03]}),
  S('9764', 1.0, 1.5),
  S('9766', 1.5, 1.6),
  S('9763', 1.5, 1.5, {zoom: [1.03, 1.1]}),
  S('9871', 0.6, 1.8),
  S('9777', 1.5, 1.5),
  // bolo
  S('1201', 0.0, 2.6, {tag: 'BOLO'}),
  S('9851', 0.5, 2.0),
  S('9853', 0.5, 2.2),
  S('9859', 0.0, 2.3),
  S('9862', 0.3, 2.2),
  // brinde
  S('9863', 1.6, 2.8, {tag: 'BRINDE'}),
];

const pista: Shot[] = [
  S('9917', 0.3, 2.3, {xin: 0.4, tag: 'PISTA'}),
  S('9902', 0.0, 1.8),
  // virada para a música da festa
  S('9919', 0.6, 2.6, {tag: 'PISTA-FESTA'}),
  S('9921', 1.0, 2.2),
  S('9922', 0.5, 2.0),
  S('9924', 1.2, 2.4),
  S('9923', 2.0, 1.8),
  S('9930', 3.0, 2.2),
  S('9931', 1.0, 1.8),
  S('9928', 4.2, 1.8),
];

const final: Shot[] = [S('9936', 3.0, 7.9, {vol: 0.3, tag: 'FINAL'})];

const rawShots = [...local, ...makingOf, ...recepcao, ...cerimonia, ...noite, ...pista, ...final];

/* ---------- Trilha: 4 músicas, cortes encaixados na batida ---------- */
const T = (shots: Shot[], tag: string) => place(shots).find((x) => x.tag === tag)!.start;
const nearest = (arr: number[], t: number) => arr.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));

let shots = rawShots;
// 1) Home — local, making of, recepção
const home: Music = {src: 'home.wav', at: 0, from: 5.0, dur: 0, fin: 0.5, fout: 2.2, vol: 0.9};
home.dur = T(shots, 'CERIMÔNIA') + 0.8;
shots = snapToBeats(shots, home, homeBeats, {to: T(shots, 'CERIMÔNIA') - 0.1});
home.dur = T(shots, 'CERIMÔNIA') + 0.8;

// 2) 93 Million Miles — cerimônia ("people get ready" na entrada da noiva)
const mraz: Music = {src: 'mraz.wav', at: T(shots, 'CERIMÔNIA') - 0.3, from: 22.0, dur: 0, fin: 1.0, fout: 2.0, vol: 0.85};
mraz.dur = T(shots, 'NOITE') - mraz.at + 0.8;
shots = snapToBeats(shots, mraz, mrazBeats, {from: mraz.at, to: T(shots, 'TIA') - 0.1});
shots = snapToBeats(shots, mraz, mrazBeats, {from: T(shots, 'BEIJO'), to: T(shots, 'NOITE') - 0.1});
mraz.dur = T(shots, 'NOITE') - mraz.at + 0.8;

// 3) O Que É o Amor — noite, bolo, brinde, abertura da pista
const amor: Music = {src: 'amor.wav', at: T(shots, 'NOITE') - 0.3, from: 13.5, dur: 0, fin: 0.8, fout: 1.0, vol: 0.9};
amor.dur = T(shots, 'PISTA-FESTA') - amor.at + 0.5;
shots = snapToBeats(shots, amor, amorBeats, {from: amor.at + 0.5, to: T(shots, 'PISTA-FESTA') - 0.1});
amor.dur = T(shots, 'PISTA-FESTA') - amor.at + 0.5;

// 4) Na Boquinha da Garrafa — pista até o fim (entra seca, na batida, no corte)
const pf = T(shots, 'PISTA-FESTA');
const gFrom = nearest(garrafaBeats, 31.0);
const garrafa: Music = {src: 'garrafa.wav', at: pf, from: gFrom, dur: 0, fin: 0.05, fout: 3.5, vol: 0.95};
garrafa.dur = 30;
shots = snapToBeats(shots, garrafa, garrafaBeats, {from: pf + 0.5, tol: 0.32});

export const afterMovie: Edit = {
  shots,
  music: [home, mraz, amor, garrafa],
  titles: [
    {text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: 0.8, dur: 3.5, kind: 'open'},
  ],
};

// Final: a mão do noivo cobre a câmera (~9,3s do take) → escurece → título
const p = place(afterMovie.shots);
const fin = p[p.length - 1].start;
afterMovie.darken = {at: fin + 7.0, dur: 1.4};
afterMovie.titles.push({text: 'Babita & Tetê', sub: '14 . 11 . 2026', at: fin + 7.65, dur: 5.2, kind: 'close'});
afterMovie.total = fin + 12.85;
garrafa.dur = afterMovie.total - garrafa.at;
