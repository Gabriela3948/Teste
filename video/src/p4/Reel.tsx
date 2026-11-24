import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../common/Captions';
import {KF, Talk} from '../common/Talk';
import {BODY, C, LIMEGRAD, headStyle} from '../common/brand';
import {LightFlash, LinkPill, LogoTop, Rise, Sfx} from '../common/Fx';
import {Icon} from '../common/Icons';
import {S1_CUE, S2_CUE, S3_CUE, Scene1, Scene2, Scene3} from './ScenesA';
import {S4_CUE, S5_CUE, S6_CUE, Scene4, Scene5, Scene6} from './ScenesB';
import {Wipe} from './Stage';
import {B, END, ENDLEN, L1, L2, MOT, MOT_LEN, NARR0, S_B2, TOTAL} from './timing';
import {WORDS} from './words';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const FB1 = {x: 0.44, y: 0.45}, FB2 = {x: 0.468, y: 0.453};
const K1: KF = [[0, 1.16, 0.4], [L1, 1.42, 0.37], [L1 + 18, 1.47, 0.37]];
const SEM = 38, LOGO = 119, LINK = 166; // cues do take de fechamento (frames locais)
const K2: KF = [[0, 1.2, 0.39], [SEM - 2, 1.24, 0.39], [70, 1.44, 0.37], [108, 1.38, 0.37], [LOGO + 4, 1.2, 0.4], [LINK - 8, 1.21, 0.4], [LINK + 10, 1.44, 0.37], [L2, 1.38, 0.37]];

// abertura: texto na tela do roteiro, na altura do peito
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame >= L1 + 16) return null;
  const k = spring({frame: frame - 3, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
  const out = interpolate(frame, [L1 - 4, L1 + 6], [1, 0], CL);
  const sh = '0 4px 18px rgba(0,0,0,.65), 0 1px 3px rgba(0,0,0,.7)';
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1060, textAlign: 'center', opacity: out}}>
      <div style={{display: 'inline-block', background: LIMEGRAD, borderRadius: 30, padding: '8px 26px', fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.ink, boxShadow: '0 10px 26px rgba(0,0,0,.35)',
        opacity: Math.min(1, k * 1.6), transform: `scale(${interpolate(k, [0, 1], [0.5, 1])})`}}>O FUTURO É AGORA</div>
      <div style={{...headStyle(112, '#fff'), textShadow: sh, marginTop: 14}}>
        <Rise at={6}>A Aldeia</Rise> <Rise at={24} style={{color: C.limeHi}}>não para.</Rise>
      </div>
      <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, lineHeight: 1.18, color: '#fff', textShadow: sh, marginTop: 10}}>
        <div><Rise at={52}>Olha tudo que mudou</Rise></div>
        <div><Rise at={76}>nas últimas semanas.</Rise></div>
      </div>
    </div>
  );
};

// fechamento: "sem custo extra para quem ja e cliente"
const Free: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
  const out = interpolate(frame, [to - 7, to], [1, 0], CL);
  const sub = spring({frame: frame - from - 26, fps, config: {damping: 14, stiffness: 160, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: 130, top: 1140, width: 820, height: 170, borderRadius: 40, background: LIMEGRAD, boxShadow: '0 22px 54px rgba(0,20,40,.5)', display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px', boxSizing: 'border-box',
      opacity: Math.min(1, s * 1.6, out), transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-4, 0])}deg)`}}>
      <div style={{width: 96, height: 96, borderRadius: 48, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon name="check" color={C.limeHi} size={62} sw={3.2} /></div>
      <div>
        <div style={{...headStyle(70, C.ink)}}>Sem custo extra</div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 28, color: C.head, marginTop: 6, opacity: sub, transform: `translateY(${interpolate(sub, [0, 1], [14, 0])}px)`}}>pra quem já é cliente</div>
      </div>
    </div>
  );
};

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
const Motion: React.FC = () => (
  <AbsoluteFill>
    {SCENES.map((S, i) => (
      <Sequence key={i} from={B[i]} durationInFrames={B[i + 1] - B[i] + (i < 5 ? 18 : 0)}>
        <Wipe><S /></Wipe>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const ReelFuturo: React.FC = () => {
  const musicVol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 30, TOTAL], [0, 0.16, 0.16, 0], CL);
  const m = (i: number, c: number) => MOT + B[i] + c; // cue local de uma cena -> frame global
  return (
    <AbsoluteFill style={{background: '#141F52'}}>
      <Sequence durationInFrames={L1 + 18}><Talk src="p4/t1.mp4" face={FB1} kf={K1} dur={L1 + 18} /></Sequence>
      <Sequence from={S_B2} durationInFrames={L2}><Talk src="p4/t2.mp4" face={FB2} kf={K2} dur={L2} diveIn diveOut /></Sequence>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(3,20,34,.58) 100%)'}} />
      <Hook />

      <Sequence from={MOT} durationInFrames={MOT_LEN}><Motion /></Sequence>
      <Sequence from={NARR0}><Audio src={staticFile('p4/narr.mp3')} /></Sequence>

      <Free from={S_B2 + SEM} to={S_B2 + 112} />
      <LogoTop from={S_B2 + LOGO} to={S_B2 + LINK} top={150} height={150} />
      <LinkPill from={S_B2 + LINK} top={1160} />
      <LightFlash at={S_B2} />
      <LightFlash at={END} />

      <Captions words={WORDS} end={END} light={[[MOT + B[0], MOT + B[1]], [MOT + B[2], MOT + B[4]], [MOT + B[5], MOT + B[6]]]} />

      <Sequence from={END} durationInFrames={ENDLEN}>
        <AbsoluteFill style={{background: '#141F52'}}><OffthreadVideo src={staticFile('p2/closing.mp4')} style={{width: '100%', height: '100%'}} /></AbsoluteFill>
      </Sequence>

      {/* efeitos sonoros */}
      <Sfx at={3} name="pop" vol={0.45} />
      <Sfx at={MOT - 12} name="riser" vol={0.45} />
      {[1, 2, 3, 4, 5].map((i) => <Sfx key={i} at={MOT + B[i] - 3} name="whoosh" vol={0.4} />)}
      <Sfx at={m(0, S1_CUE.btn)} name="pop" vol={0.35} />
      <Sfx at={m(0, S1_CUE.click)} name="tick" vol={0.6} />
      {S1_CUE.pins.map((c) => <Sfx key={c} at={m(0, c)} name="pop" vol={0.5} />)}
      {[S2_CUE.towers[0], S2_CUE.towers[2]].map((c) => <Sfx key={c} at={m(1, c)} name="ping" vol={0.4} />)}
      <Sfx at={m(1, S2_CUE.call)} name="pop" vol={0.5} />
      <Sfx at={m(1, S2_CUE.lost)} name="error" vol={0.32} />
      <Sfx at={m(1, S2_CUE.chip1)} name="tick" vol={0.6} />
      <Sfx at={m(1, S2_CUE.chip2)} name="tick" vol={0.6} />
      <Sfx at={m(2, S3_CUE.sign)} name="sign" vol={0.6} />
      <Sfx at={m(2, S3_CUE.chip)} name="pop" vol={0.4} />
      <Sfx at={m(2, S3_CUE.seal)} name="thud" vol={0.4} />
      <Sfx at={m(2, S3_CUE.seal + 3)} name="chime" vol={0.4} />
      {S3_CUE.steps.map((c) => <Sfx key={c} at={m(2, c)} name="tick" vol={0.5} />)}
      {S4_CUE.tickets.map((c) => <Sfx key={c} at={m(3, c)} name="tick" vol={0.5} />)}
      <Sfx at={m(3, S4_CUE.main)} name="pop" vol={0.5} />
      {S4_CUE.status.map((c) => <Sfx key={c} at={m(3, c)} name="pop" vol={0.32} />)}
      {S5_CUE.rows.map((c) => <Sfx key={c} at={m(4, c)} name="tick" vol={0.45} />)}
      <Sfx at={m(4, S5_CUE.use)} name="riser" vol={0.25} />
      <Sfx at={m(4, S5_CUE.status)} name="pop" vol={0.4} />
      <Sfx at={m(4, S5_CUE.toggle)} name="tick" vol={0.7} />
      <Sfx at={m(4, S5_CUE.live - 2)} name="powerup" vol={0.4} />
      {S6_CUE.slots.map((c) => <Sfx key={c} at={m(5, c)} name="tick" vol={0.45} />)}
      {S6_CUE.cards.map((c) => <Sfx key={c} at={m(5, c - 2)} name="whoosh" vol={0.38} />)}
      {S6_CUE.seals.map((c) => <Sfx key={c} at={m(5, c)} name="thud" vol={0.42} />)}
      {S6_CUE.seals.map((c) => <Sfx key={`c${c}`} at={m(5, c + 3)} name="chime" vol={0.38} />)}
      <Sfx at={S_B2 - 6} name="whoosh" vol={0.42} />
      <Sfx at={S_B2 + SEM} name="pop" vol={0.5} />
      <Sfx at={S_B2 + LOGO} name="whoosh" vol={0.3} />
      <Sfx at={S_B2 + LOGO + 22} name="chime" vol={0.4} />
      <Sfx at={S_B2 + LINK} name="pop" vol={0.55} />
      <Sfx at={END - 6} name="whoosh" vol={0.42} />

      <Audio src={staticFile('p4/music.mp3')} volume={musicVol} />
    </AbsoluteFill>
  );
};
