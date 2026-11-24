// "Redundancia em 30 segundos": takes em ordem e duracao (frames, 30 fps)
export const L1A = 96, L1B = 68, L2 = 291, L3 = 240, L4 = 249;
export const S1B = L1A, S2 = S1B + L1B, S3 = S2 + L2, S4 = S3 + L3, END = S4 + L4;
export const ENDLEN = 180;
export const TOTAL = END + ENDLEN;
// inicio de cada trecho no arquivo original (s), para alinhar a legenda
export const CUT = {a: 2.15, b: 5.68, t2: 1.27, t3: 1.39, t4: 1.34};
// cenas de motion em tela cheia (frames globais)
export const PROB = S2 + 104, PROB_LEN = S3 - PROB; // "todos os seus dados e veiculos vao pra um servidor so..."
export const ALD = S3 + 57, ALD_LEN = S4 - ALD; // "os seus dados ficam hospedados em mais de um servidor..."
