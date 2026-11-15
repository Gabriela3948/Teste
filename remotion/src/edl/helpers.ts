import type {Shot} from '../types';

/** Atalho para declarar um take: S(id, entrada, duração, opções) */
export const S = (src: string, inS: number, dur: number, o: Partial<Shot> = {}): Shot => ({
  src,
  in: inS,
  dur,
  ...o,
});
