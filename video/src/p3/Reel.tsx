import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../common/Captions';
import {KF, Talk} from '../common/Talk';
import {BODY, C, LIMEGRAD, headStyle} from '../common/brand';
import {LightFlash, LinkPill, LogoTop, Rise, Sfx, Stamp} from '../common/Fx';
import {A_CUE, P_CUE, SceneAldeia, SceneProblem} from './Scenes';
import {ALD, ALD_LEN, END, ENDLEN, L1A, L1B, L2, L3, L4, PROB, PROB_LEN, S1B, S2, S3, S4, TOTAL} from './timing';
import {WORDS} from './words';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
// posicao do rosto em cada take (0-1 do quadro bruto)
const F1 = {x: 0.485, y: 0.425}, F2 = {x: 0.5, y: 0.417}, F3 = {x: 0.475, y: 0.415}, F4 = {x: 0.49, y: 0.43};
// camera: [frame, escala, altura do rosto]
const KA: KF = [[0, 1.02, 0.42], [L1A, 1.2, 0.4]];
const KB: KF = [[0, 1.0, 0.425], [50, 1.05, 0.42], [61, 1.18, 0.41], [L1B, 1.18, 0.41]];
const K2: KF = [[0, 1.0, 0.42], [58, 1.16, 0.4], [104, 1.06, 0.41], [L2, 1.06, 0.41]];
const K3: KF = [[0, 1.0, 0.415], [44, 1.2, 0.39], [L3, 1.2, 0.39]];
const NOW = 59, LOGO = 152, LINK = 206; // cues do ultimo take (frames locais)
const K4: KF = [[0, 1.0, 0.43], [NOW, 1.06, 0.425], [100, 1.19, 0.4], [126, 1.17, 0.4], [LOGO - 4, 1.02, 0.43], [LINK - 8, 1.03, 0.43], [LINK + 10, 1.18, 0.4], [L4, 1.13, 0.41]];

// titulo de abertura na caixa verde-limao das artes (texto do roteiro)
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame >= L1A) return null;
  const s = spring({frame: frame - 3, fps, config: {damping: 12, stiffness: 150, mass: 0.7}});
  const out = interpolate(frame, [L1A - 5, L1A], [1, 0], CL);
  const fall = spring({frame: frame - 80, fps, config: {damping: 7, stiffness: 160, mass: 0.7}});
  return (
    <div style={{position: 'absolute', left: 70, top: 1078, width: 940, borderRadius: 40, background: LIMEGRAD, boxShadow: '0 24px 60px rgba(0,20,40,.5)', padding: '38px 20px 44px', boxSizing: 'border-box', textAlign: 'center',
      opacity: Math.min(1, s * 1.6, out), transform: `scale(${interpolate(s, [0, 1], [0.7, 1])}) rotate(${interpolate(s, [0, 1], [-3, 0])}deg)`, ...headStyle(78, C.ink)}}>
      <div><Rise at={7}>Seu sistema</Rise> <Rise at={34}>sobrevive</Rise></div>
      <div><Rise at={58}>se o servidor</Rise> <span style={{display: 'inline-block', transformOrigin: '0% 100%', transform: `rotate(${fall * 8}deg) translateY(${fall * 8}px)`}}><Rise at={76} style={{color: '#C3301A'}}>cair?</Rise></span></div>
    </div>
  );
};

// "operacao sem interrupcoes": cartao com linha de pulso continua
const Pulse: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 12, stiffness: 160, mass: 0.7}});
  const out = interpolate(frame, [to - 7, to], [1, 0], CL);
  const seg = 'l 34 0 l 10 -30 l 13 62 l 13 -50 l 9 18 l 41 0 ';
  const x = -(((frame - from) * 5) % 120);
  return (
    <div style={{position: 'absolute', left: 150, top: 1158, width: 780, height: 150, borderRadius: 38, background: 'rgba(3,37,56,.93)', border: `3px solid ${C.limeHi}`, boxShadow: '0 20px 50px rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px', boxSizing: 'border-box',
      opacity: Math.min(1, s * 1.6, out), transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`}}>
      <div style={{width: 230, height: 90, overflow: 'hidden', borderRadius: 14, background: 'rgba(255,255,255,.06)'}}>
        <svg width={600} height={90} style={{transform: `translateX(${x}px)`}}>
          <path d={`M 0 50 ${seg.repeat(5)}`} fill="none" stroke={C.limeHi} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.limeHi}}>OPERAÇÃO</div>
        <div style={{...headStyle(54, '#fff'), marginTop: 4}}>Sem interrupções</div>
      </div>
    </div>
  );
};

export const ReelRedundancia: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 30, TOTAL], [0, 0.16, 0.16, 0], CL);
  return (
    <AbsoluteFill style={{background: '#141F52'}}>
      <Sequence durationInFrames={L1A}><Talk src="p3/t1a.mp4" face={F1} kf={KA} dur={L1A} /></Sequence>
      <Sequence from={S1B} durationInFrames={L1B}><Talk src="p3/t1b.mp4" face={F1} kf={KB} dur={L1B} diveOut shakeAt={[59]} /></Sequence>
      <Sequence from={S2} durationInFrames={L2}><Talk src="p3/t2.mp4" face={F2} kf={K2} dur={L2} diveIn /></Sequence>
      <Sequence from={S3} durationInFrames={L3}><Talk src="p3/t3.mp4" face={F3} kf={K3} dur={L3} diveIn /></Sequence>
      <Sequence from={S4} durationInFrames={L4}><Talk src="p3/t4.mp4" face={F4} kf={K4} dur={L4} diveIn diveOut /></Sequence>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(3,20,34,.5) 100%)'}} />

      <Hook />
      <Stamp from={S1B + 59} to={S2 + 2} text="NÃO." top={1120} size={150} rot={-5} />

      <Sequence from={PROB} durationInFrames={PROB_LEN}><SceneProblem dur={PROB_LEN} /></Sequence>
      <Sequence from={ALD} durationInFrames={ALD_LEN}><SceneAldeia dur={ALD_LEN} /></Sequence>

      <Pulse from={S4 + NOW} to={S4 + 128} />
      <LogoTop from={S4 + LOGO} to={S4 + LINK} top={150} height={150} />
      <LinkPill from={S4 + LINK} top={1160} />

      <LightFlash at={S2} />
      <LightFlash at={S3} />
      <LightFlash at={S4} />
      <LightFlash at={END} />

      <Captions words={WORDS} end={END} hidden={[[0, L1A], [S1B + 56, S2]]} />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>

      {/* efeitos sonoros */}
      <Sfx at={3} name="pop" vol={0.45} />
      <Sfx at={79} name="thud" vol={0.4} />
      <Sfx at={S1B + 58} name="thud" vol={0.6} />
      {[S2, S3, S4, END].map((at) => <Sfx key={at} at={at - 6} name="whoosh" vol={0.42} />)}
      <Sfx at={PROB - 2} name="riser" vol={0.4} />
      {P_CUE.nodes.map((at) => <Sfx key={at} at={PROB + at} name="tick" vol={0.5} />)}
      <Sfx at={PROB + P_CUE.only} name="ping" vol={0.35} />
      <Sfx at={PROB + P_CUE.fall - 4} name="powerdown" vol={0.6} />
      <Sfx at={PROB + P_CUE.fall + 4} name="error" vol={0.5} />
      <Sfx at={PROB + P_CUE.stamp - 1} name="thud" vol={0.6} />
      <Sfx at={ALD - 2} name="riser" vol={0.4} />
      <Sfx at={ALD + A_CUE.hub} name="pop" vol={0.4} />
      {[A_CUE.a, A_CUE.b, A_CUE.c].map((at) => <Sfx key={at} at={ALD + at} name="pop" vol={0.5} />)}
      <Sfx at={ALD + A_CUE.down - 4} name="powerdown" vol={0.45} />
      <Sfx at={ALD + A_CUE.up - 4} name="powerup" vol={0.55} />
      <Sfx at={ALD + A_CUE.status} name="chime" vol={0.45} />
      <Sfx at={S4 + NOW} name="pop" vol={0.45} />
      <Sfx at={S4 + LOGO} name="whoosh" vol={0.3} />
      <Sfx at={S4 + LOGO + 22} name="chime" vol={0.4} />
      <Sfx at={S4 + LINK} name="pop" vol={0.55} />

      <Audio src={staticFile('p3/music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
