import React from 'react';
import {Composition} from 'remotion';
import {Reel, TOTAL} from './Reel';
import {ReelPlataforma} from './p2/Reel';
import {TOTAL as TOTAL2} from './p2/timing';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';

export const Root: React.FC = () => (
  <>
  <Composition id="AldeiaFenatran" component={Reel} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="AldeiaPlataforma" component={ReelPlataforma} durationInFrames={TOTAL2} fps={30} width={1080} height={1920} />
  </>
);
