import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {Duck, Edit, Music, Shot, Title, Voice} from './types';
import {fontFaces} from './fonts';

export const FPS = 30;

export type Placed = Shot & {start: number};

/** Calcula o início de cada take considerando os dissolves (xin). */
export const place = (shots: Shot[]): Placed[] => {
  const out: Placed[] = [];
  let t = 0;
  shots.forEach((s, i) => {
    const start = i === 0 ? 0 : t - (s.xin ?? 0);
    out.push({...s, start});
    t = start + s.dur;
  });
  return out;
};

export const editDuration = (e: Edit) => {
  if (e.total) return e.total;
  const p = place(e.shots);
  const last = p[p.length - 1];
  return last.start + last.dur;
};

const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------- Color grade ---------- */
const COLOR =
  'contrast(1.07) saturate(0.78) brightness(0.97) sepia(0.12) hue-rotate(-4deg)';
const BW = 'grayscale(1) contrast(1.18) brightness(0.96)';

const ShotView: React.FC<{s: Placed}> = ({s}) => {
  const frame = useCurrentFrame();
  const dF = f(s.dur);
  const p = frame / Math.max(1, dF - 1);

  // dissolve de entrada
  const xinF = f(s.xin ?? 0);
  let opacity = xinF > 0 ? interpolate(frame, [0, xinF], [0, 1], clamp) : 1;
  let blur = 0;
  if (s.blur && xinF > 0) {
    blur = interpolate(frame, [0, xinF], [18, 0], {...clamp, easing: Easing.out(Easing.quad)});
  }
  // fade do preto / para o preto
  let black = 0;
  if (s.fromBlack) black = Math.max(black, interpolate(frame, [0, f(s.fromBlack)], [1, 0], clamp));
  if (s.toBlack) black = Math.max(black, interpolate(frame, [dF - f(s.toBlack), dF], [0, 1], clamp));

  const [z0, z1] = s.zoom ?? [1.04, 1.1];
  const scale = interpolate(p, [0, 1], [z0, z1], {easing: Easing.inOut(Easing.sin)});
  const [x0, y0, x1, y1] = s.pan ?? [0, 0, 0, 0];
  const tx = interpolate(p, [0, 1], [x0, x1]);
  const ty = interpolate(p, [0, 1], [y0, y1]);

  const vol = s.vol ?? 0;
  const speed = s.speed ?? 1;

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)${s.flip ? ' scaleX(-1)' : ''}`,
          filter: `${s.bw ? BW : COLOR}${blur > 0.2 ? ` blur(${blur}px)` : ''}`,
        }}
      >
        <OffthreadVideo
          src={staticFile(`proxies/${s.src}.mp4`)}
          startFrom={f(s.in)}
          playbackRate={speed}
          muted={vol === 0}
          volume={(fr) => {
            if (vol === 0) return 0;
            const a = interpolate(fr, [0, 6], [0, 1], clamp);
            const b = interpolate(fr, [dF - 8, dF], [1, 0], clamp);
            return vol * Math.min(a, b);
          }}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
      {black > 0 ? <AbsoluteFill style={{background: '#000', opacity: black}} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- Textura de filme ---------- */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const ox = Math.floor(random(`gx${seed}`) * 200);
  const oy = Math.floor(random(`gy${seed}`) * 200);
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.22, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{transform: `translate(${-ox}px, ${-oy}px)`, width: 2120, height: 1280}}>
        <filter id={`n${seed % 7}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed % 7} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#n${seed % 7})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Look: React.FC = () => (
  <>
    {/* pretos levemente levantados e quentes */}
    <AbsoluteFill style={{background: 'rgb(28,18,10)', mixBlendMode: 'lighten', opacity: 0.55}} />
    {/* tom quente sutil nos meios-tons */}
    <AbsoluteFill style={{background: 'rgb(255,214,170)', mixBlendMode: 'soft-light', opacity: 0.16}} />
    {/* vinheta */}
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 88%, rgba(0,0,0,0.6) 100%)',
      }}
    />
    <Grain />
  </>
);

/* ---------- Títulos ---------- */
const TitleView: React.FC<{t: Title}> = ({t}) => {
  const frame = useCurrentFrame();
  const dF = f(t.dur);
  const inF = t.kind === 'small' ? 15 : 36;
  const outF = t.kind === 'close' ? 30 : 24;
  const o = Math.min(
    interpolate(frame, [0, inF], [0, 1], {...clamp, easing: Easing.out(Easing.quad)}),
    interpolate(frame, [dF - outF, dF], [1, 0], clamp),
  );
  const blur = interpolate(frame, [0, inF], [10, 0], clamp);
  const track = interpolate(frame, [0, dF], [0.03, 0.07]);
  const subO = interpolate(frame, [inF * 0.8, inF * 1.8], [0, 1], clamp) * o;

  if (t.kind === 'small') {
    return (
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <div style={{fontFamily: 'Jost', fontWeight: 300, fontSize: 24, letterSpacing: '0.5em', color: '#f3eadc', opacity: o, textTransform: 'uppercase'}}>
          {t.text}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: 'Bodoni',
          fontWeight: 400,
          fontSize: t.kind === 'open' ? 118 : 104,
          color: '#f6efe3',
          display: 'flex',
          opacity: o,
          filter: `blur(${blur}px)`,
          textShadow: '0 2px 30px rgba(0,0,0,0.45)',
          lineHeight: 1,
        }}
      >
        {/* espaçamento por letra (letter-spacing desloca acentos como o de "Tetê") */}
        {[...t.text.normalize('NFC')].map((ch, i, arr) => (
          <span key={i} style={{marginRight: i < arr.length - 1 ? `${track}em` : 0, whiteSpace: 'pre'}}>
            {ch}
          </span>
        ))}
      </div>
      {t.sub ? (
        <div
          style={{
            marginTop: 34,
            fontFamily: 'Jost',
            fontWeight: 300,
            fontSize: 22,
            letterSpacing: '0.62em',
            color: '#efe5d4',
            opacity: subO,
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}
        >
          {t.sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- Legendas ---------- */
const SubView: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const frame = useCurrentFrame();
  const dF = f(dur);
  const o = Math.min(interpolate(frame, [0, 8], [0, 1], clamp), interpolate(frame, [dF - 8, dF], [1, 0], clamp));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 78}}>
      <div
        style={{
          fontFamily: 'Garamond',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 50,
          color: '#f7efdf',
          opacity: o,
          maxWidth: 1400,
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Música ---------- */
const duckAt = (ducks: Duck[], t: number) => {
  let m = 1;
  for (const d of ducks) {
    const r = 0.5;
    const v = interpolate(t, [d.at - r, d.at, d.at + d.dur, d.at + d.dur + r], [1, d.level, d.level, 1], clamp);
    m = Math.min(m, v);
  }
  return m;
};

const MusicTrack: React.FC<{m: Music; ducks: Duck[]}> = ({m, ducks}) => (
  <Audio
    src={staticFile(`music/${m.src}`)}
    startFrom={f(m.from)}
    volume={(fr) => {
      const t = fr / FPS;
      const a = m.fin > 0 ? interpolate(t, [0, m.fin], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)}) : 1;
      const b = m.fout > 0 ? interpolate(t, [m.dur - m.fout, m.dur], [1, 0], {...clamp, easing: Easing.inOut(Easing.sin)}) : 1;
      return m.vol * Math.min(a, b) * duckAt(ducks, m.at + t);
    }}
  />
);

const VoiceTrack: React.FC<{v: Voice}> = ({v}) => (
  <Audio
    src={staticFile(`proxies/${v.src}.mp4`)}
    startFrom={f(v.from)}
    volume={(fr) => {
      const t = fr / FPS;
      const a = interpolate(t, [0, v.fin ?? 0.2], [0, 1], clamp);
      const b = interpolate(t, [v.dur - (v.fout ?? 0.25), v.dur], [1, 0], clamp);
      return v.vol * Math.min(a, b);
    }}
  />
);

/** Ducking automático: takes com som de fala (vol >= 0.8) e vozes marcadas. */
export const allVoices = (edit: Edit): Voice[] => [
  ...(edit.voices ?? []),
  ...place(edit.shots).flatMap((s) => (s.vo ? [{...s.vo, at: s.start + s.vo.at}] : [])),
];

export const autoDucks = (edit: Edit): Duck[] => {
  const d: Duck[] = [...(edit.ducks ?? [])];
  for (const s of place(edit.shots)) if ((s.vol ?? 0) >= 0.8) d.push({at: s.start, dur: s.dur, level: 0.2});
  for (const v of allVoices(edit)) if (v.duck) d.push({at: v.at, dur: v.dur, level: 0.2});
  return d;
};

/* ---------- Escurecimento final ---------- */
const Darken: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, f(Math.min(1.2, dur))], [0, 0.9], {...clamp, easing: Easing.out(Easing.quad)});
  const b = interpolate(frame, [0, f(1.5)], [0, 14], clamp);
  return <AbsoluteFill style={{background: '#000', opacity: o, backdropFilter: `blur(${b}px)`}} />;
};

export const Film: React.FC<{edit: Edit}> = ({edit}) => {
  const placed = place(edit.shots);
  const ducks = autoDucks(edit);
  const voices = allVoices(edit);
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{fontFaces}</style>
      {placed.map((s, i) => (
        <Sequence key={`s${i}`} from={f(s.start)} durationInFrames={f(s.dur)} name={`${s.src}`}>
          <ShotView s={s} />
        </Sequence>
      ))}
      <Look />
      {edit.darken ? (
        <Sequence from={f(edit.darken.at)} durationInFrames={durationInFrames - f(edit.darken.at)}>
          <Darken dur={edit.darken.dur} />
        </Sequence>
      ) : null}
      {placed.flatMap((s, i) =>
        (s.subs ?? []).map((sb, j) => (
          <Sequence key={`sub${i}-${j}`} from={f(s.start + sb.at)} durationInFrames={f(sb.d)}>
            <SubView text={sb.t} dur={sb.d} />
          </Sequence>
        )),
      )}
      {edit.titles.map((t, i) => (
        <Sequence key={`t${i}`} from={f(t.at)} durationInFrames={f(t.dur)}>
          <TitleView t={t} />
        </Sequence>
      ))}
      {edit.music.map((m, i) => (
        <Sequence key={`m${i}`} from={f(m.at)} durationInFrames={f(m.dur)}>
          <MusicTrack m={m} ducks={ducks} />
        </Sequence>
      ))}
      {voices.map((v, i) => (
        <Sequence key={`v${i}`} from={f(v.at)} durationInFrames={f(v.dur)}>
          <VoiceTrack v={v} />
        </Sequence>
      ))}
      {voices.flatMap((v, i) =>
        (v.subs ?? []).map((sb, j) => (
          <Sequence key={`vs${i}-${j}`} from={f(v.at + sb.at)} durationInFrames={f(sb.d)}>
            <SubView text={sb.t} dur={sb.d} />
          </Sequence>
        )),
      )}
    </AbsoluteFill>
  );
};
