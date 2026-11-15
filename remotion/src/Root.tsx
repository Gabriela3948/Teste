import React from 'react';
import {Composition} from 'remotion';
import {Film, FPS, editDuration} from './Film';
import {afterMovie} from './edl/afterMovie';
import {casal} from './edl/casal';
import {social} from './edl/social';
import type {Edit} from './types';

const comp = (id: string, edit: Edit) => (
  <Composition
    key={id}
    id={id}
    component={Film}
    defaultProps={{edit}}
    durationInFrames={Math.round(editDuration(edit) * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

export const Root: React.FC = () => (
  <>
    {comp('AfterMovie', afterMovie)}
    {comp('Casal', casal)}
    {comp('Social', social)}
  </>
);
