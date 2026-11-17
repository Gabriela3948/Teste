export const MINT = '#C5EBC3';
export const NAVY = '#0B1B4D';
export const FPS = 30;
// janela usada de cada take (segundos no arquivo original)
export const A1 = 0.9, B1 = 13.9;
export const A2 = 1.28, B2 = 8.75;
export const L1 = Math.round((B1 - A1) * FPS);
export const L2 = Math.round((B2 - A2) * FPS);
export const T2 = L1; // inicio do take 2 (frames)
export const END = T2 + L2; // inicio da animacao final
