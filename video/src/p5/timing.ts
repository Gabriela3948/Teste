// "E a migracao?": video 100% motion design com narracao. Os tempos saem das palavras da narracao.
import narr from './narr.json';

type N = {w: string; s: number; e: number};
export const NW = narr as N[];
export const TEMPO = 1.05; // a narracao foi acelerada 5%
export const NARR0 = 8; // frame em que a narracao comeca

// frame global em que a palavra i comeca / termina
export const ws = (i: number) => NARR0 + Math.round((NW[i].s / TEMPO) * 30);
export const we = (i: number) => NARR0 + Math.round((NW[i].e / TEMPO) * 30);

// indice de cada palavra usada como deixa
export const I = {
  todo: 0, central: 3, insatisfeito: 4, fala: 8, eu: 12, ate: 13, trocaria: 14, mas: 15, e2: 16, a2: 17, migracao: 18,
  eFaz: 19, faz: 20, medo: 23, eA: 24, inteira: 27, contrato: 28, chip: 29, cliente: 31,
  so: 32, ficar: 34, queNao: 37, tambem: 41, custa: 42, todoMes: 43, mes: 44, emRetrabalho: 45, retrabalho: 46, emCliente: 48, cancela: 51,
  na: 52, aMigracao: 54, migracao2: 55, feita: 57, junto: 58, nossa: 61, equipe: 62,
  eMais: 63, quarenta: 66, mil: 67, veiculos: 68, ja: 69, para: 71, desde: 74,
  se: 77, segura: 81, medo2: 84, trocar: 86, chame: 87, pelo: 90, link: 91, bio: 93, eEntenda: 94, como: 96, aconteceria: 100,
};

// inicio de cada cena (frames globais)
export const S1 = 0;
export const S2 = ws(I.eFaz) - 6; // "E faz sentido ter medo..."
export const S3 = ws(I.so) + 2; // "So que ficar numa plataforma..."
export const S4 = ws(I.na) - 5; // "Na Aldeia..."
export const S4B = ws(I.eMais) + 2; // "E mais de 40 mil veiculos..."
export const S5 = ws(I.se) - 5; // "Se o que te segura..."
export const END = we(I.aconteceria) + 14; // entra a animacao final da logo
export const ENDLEN = 180;
export const TOTAL = END + ENDLEN;
export const OVER = 18; // quadros em que a cena anterior continua por baixo da transicao
