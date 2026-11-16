export type Sub = {t: string; at: number; d: number};

export type Shot = {
  /** id do proxy em public/proxies (ex.: "9649") */
  src: string;
  /** segundo de entrada no take original */
  in: number;
  /** duração na timeline (s) */
  dur: number;
  /** velocidade (0.5 = câmera lenta) */
  speed?: number;
  /** preto e branco */
  bw?: boolean;
  /** escala inicial/final (movimento de câmera sutil) */
  zoom?: [number, number];
  /** deslocamento inicial/final em % [x0, y0, x1, y1] */
  pan?: [number, number, number, number];
  /** volume do som ambiente do take (0 = mudo) */
  vol?: number;
  /** dissolve de entrada (s), sobrepondo o take anterior */
  xin?: number;
  /** transição com desfoque (borrão) na entrada */
  blur?: boolean;
  /** fade a partir do preto na entrada (s) */
  fromBlack?: number;
  /** fade para o preto na saída (s) */
  toBlack?: number;
  /** legendas relativas ao início do take */
  subs?: Sub[];
  /** espelhar horizontalmente */
  flip?: boolean;
  /** áudio de outro take ancorado neste (at relativo ao início do take) */
  vo?: Voice;
  /** marca de seção (só para referência) */
  tag?: string;
};

export type Music = {
  src: string;
  /** início na timeline (s) */
  at: number;
  /** ponto de entrada no arquivo (s) */
  from: number;
  dur: number;
  fin: number;
  fout: number;
  vol: number;
};

export type Duck = {at: number; dur: number; level: number};

/** Áudio de um take tocando independente da imagem (J-cut / L-cut / trilha da festa). */
export type Voice = {
  src: string;
  at: number;
  from: number;
  dur: number;
  vol: number;
  fin?: number;
  fout?: number;
  /** abaixa a música enquanto toca (falas) */
  duck?: boolean;
  subs?: Sub[];
};

export type Title = {
  text: string;
  sub?: string;
  at: number;
  dur: number;
  kind: 'open' | 'close' | 'small';
};

export type Edit = {
  shots: Shot[];
  music: Music[];
  ducks?: Duck[];
  /** nível da música sob falas (padrão 0.2) */
  duckLevel?: number;
  voices?: Voice[];
  titles: Title[];
  /** escurecimento final (mão na câmera) */
  darken?: {at: number; dur: number};
  /** duração total opcional (s); se ausente, fim do último take */
  total?: number;
};
