import type {W} from '../common/Captions';
import {NARR0, NW, TEMPO} from './timing';

// texto da legenda: igual ao narrado, com o numero em algarismos
const TXT: Record<number, string> = {14: 'trocaria', 66: '40'};
export const WORDS: W[] = NW.map((x, i) => ({w: TXT[i] ?? x.w, s: x.s / TEMPO + NARR0 / 30, e: x.e / TEMPO + NARR0 / 30}));
