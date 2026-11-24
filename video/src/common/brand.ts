import type React from 'react';
// Identidade usada nas artes de redes da Aldeia (serie "NOVIDADE!"): cores amostradas das artes oficiais
export const C = {
  navy: '#032538', navy2: '#113646', navy3: '#0A3857',
  slate: '#274F64', slate2: '#325A6C',
  off: '#EEF3ED', ink: '#052538', head: '#1B455C',
  lime: '#B6D150', limeHi: '#D9F872', olive: '#708E00', oliveHi: '#93B417', pale: '#F3FF8F',
  teal: '#0CB198', sky: '#01ACEE', red: '#E94225', orange: '#F28B30', white: '#FFFFFF',
};
export const CAPGRAD = 'linear-gradient(90deg, #2F7FEA 0%, #3BD8B2 100%)';
export const LIMEGRAD = `linear-gradient(135deg, ${C.limeHi} 0%, ${C.lime} 70%)`;
export const HEAD = 'Noto Sans'; // titulos, com espacamento apertado como nas artes
export const BODY = 'Montserrat'; // textos e legendas
export const headStyle = (size: number, color: string): React.CSSProperties => ({
  fontFamily: HEAD, fontWeight: 700, fontSize: size, lineHeight: 1.04, letterSpacing: `${-0.045 * size}px`, color,
});
export const f = (s: number) => Math.round(s * 30);
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
