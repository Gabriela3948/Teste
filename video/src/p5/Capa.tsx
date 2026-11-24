import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, HEAD} from '../common/brand';
import {MapLines, Mark} from '../common/Fx';
import {Avatar, Dots, Stars} from './Kit';

// Arte da capa do Reel "E a migracao?": os donos de central avaliando mal a plataforma e o balao da frase.
// O titulo e a logo entram por cima, no Canva, no padrao das capas (branco + verde-menta).
const MINT = '#C6EBBE';
const X0 = 108, W = 864; // mesma margem do titulo e da logo nos modelos de capa
const ROWS = [{y: 328, rate: 2, side: 0, bg: C.slate}, {y: 482, rate: 1, side: 1, bg: C.slate2}, {y: 636, rate: 2, side: 0, bg: '#3A6577'}];
const BY = 850, BH = 480, R = 62;

const bubble = `M ${X0 + R} ${BY} L 196 ${BY} C 184 ${BY - 26} 174 ${BY - 52} 166 ${BY - 82} C 196 ${BY - 44} 236 ${BY - 16} 292 ${BY} L ${X0 + W - R} ${BY} A ${R} ${R} 0 0 1 ${X0 + W} ${BY + R} L ${X0 + W} ${BY + BH - R} A ${R} ${R} 0 0 1 ${X0 + W - R} ${BY + BH} L ${X0 + R} ${BY + BH} A ${R} ${R} 0 0 1 ${X0} ${BY + BH - R} L ${X0} ${BY + R} A ${R} ${R} 0 0 1 ${X0 + R} ${BY} Z`;

export const CapaMigracaoArte: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(165deg, ${C.navy2} 0%, ${C.navy} 70%)`}}>
    <MapLines color="#fff" opacity={0.045} seed={11} />
    <Mark size={1050} body={C.slate} p={1} style={{position: 'absolute', left: 470, top: 1210, opacity: 0.4, transform: 'rotate(8deg)'}} />

    {/* quem fala: tres donos de central, nota baixa para a plataforma atual, digitando */}
    {ROWS.map((r, i) => (
      <React.Fragment key={i}>
        <Avatar size={116} bg={C.navy3} fg={C.off} ring={i === 1 ? MINT : C.off}
          style={{position: 'absolute', left: r.side ? X0 + W - 116 : X0, top: r.y + 2, boxShadow: '0 12px 28px rgba(0,0,0,.35)'}} />
        <div style={{position: 'absolute', left: r.side ? X0 + 96 : X0 + 144, top: r.y, width: W - 240, height: 120, borderRadius: 44, background: r.bg, boxShadow: '0 22px 50px rgba(0,0,0,.34)'}}>
          <div style={{position: 'absolute', left: 42, top: 36}}><Stars on={r.rate} t={200} size={48} /></div>
          <div style={{position: 'absolute', right: 44, top: 46}}><Dots color={C.off} size={26} t={6 + i * 9} /></div>
        </div>
      </React.Fragment>
    ))}

    {/* o balao da frase (o titulo entra aqui dentro) */}
    <div style={{position: 'absolute', left: X0 - 20, top: BY + 26, width: W, height: BH, borderRadius: R, background: '#1F4558', transform: 'rotate(-2.4deg)', boxShadow: '0 24px 60px rgba(0,0,0,.3)'}} />
    <div style={{position: 'absolute', left: X0 + 24, top: BY + 44, width: W, height: BH, borderRadius: R, background: '#2B566B', transform: 'rotate(2deg)'}} />
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 26px 44px rgba(0,0,0,.38))'}}>
      <defs>
        <linearGradient id="bb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B687C" />
          <stop offset="1" stopColor={C.slate} />
        </linearGradient>
      </defs>
      <path d={bubble} fill="url(#bb)" stroke={MINT} strokeWidth={5} strokeLinejoin="round" />
    </svg>
    {/* aspas */}
    <div style={{position: 'absolute', left: X0 + W - 150, top: BY - 58, width: 116, height: 116, borderRadius: 58, background: MINT, boxShadow: '0 12px 28px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 138, color: C.ink, lineHeight: 1, marginTop: 56}}>“</div>
    </div>
  </AbsoluteFill>
);
