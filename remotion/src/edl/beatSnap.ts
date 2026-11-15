import type {Music, Shot} from '../types';
import durations from '../clipDurations.json';

/**
 * Move cada corte (fim de um take) para a batida mais próxima da música,
 * dentro de uma tolerância. Takes com fala (vol >= 0.8) não são alterados.
 */
export const snapToBeats = (
  shots: Shot[],
  music: Music,
  beats: number[],
  opts: {from?: number; to?: number; tol?: number; minDur?: number} = {},
): Shot[] => {
  const tol = opts.tol ?? 0.3;
  const minDur = opts.minDur ?? 0.9;
  const timeline = beats.map((b) => music.at + (b - music.from)).filter((t) => t > music.at && t < music.at + music.dur);
  const out: Shot[] = [];
  let t = 0;
  shots.forEach((s, i) => {
    const start = i === 0 ? 0 : t - (s.xin ?? 0);
    let dur = s.dur;
    const end = start + dur;
    const inRange = end >= (opts.from ?? -1) && end <= (opts.to ?? 1e9);
    const next = shots[i + 1];
    const speech = (s.vol ?? 0) >= 0.8 || s.vo !== undefined;
    if (inRange && !speech && next) {
      let best = end;
      let bd = tol;
      for (const b of timeline) {
        const d = Math.abs(b - end);
        if (d < bd) { bd = d; best = b; }
      }
      const nd = dur + (best - end);
      const max = ((durations as Record<string, number>)[s.src] ?? 1e9) - s.in;
      if (nd >= minDur && nd * (s.speed ?? 1) <= max - 0.02) dur = Math.round(nd * 1000) / 1000;
    }
    out.push({...s, dur});
    t = start + dur;
  });
  return out;
};
