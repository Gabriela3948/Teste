// "O Futuro e Agora": abertura (take) -> miolo em motion design com narracao -> fechamento (take) -> animacao final
export const L1 = 122; // take de abertura
export const MOT = L1; // inicio do motion
export const NARR0 = MOT + 4; // inicio da narracao
export const MOT_LEN = 1108;
export const S_B2 = MOT + MOT_LEN; // take de fechamento
export const L2 = 212;
export const END = S_B2 + L2;
export const ENDLEN = 180;
export const TOTAL = END + ENDLEN;
// tempo da narracao (s) -> frame local do motion
export const n = (t: number) => 4 + Math.round(t * 30);
// limites das 6 cenas (frames locais do motion)
export const B = [0, n(7.28), n(15.0), n(19.44), n(23.66), n(29.42), MOT_LEN];
export const CUT_B2 = 2.28; // inicio do take de fechamento no arquivo original (s)
