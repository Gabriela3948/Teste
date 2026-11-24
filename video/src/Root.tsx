import React from 'react';
import {Composition} from 'remotion';
import {Reel, TOTAL} from './Reel';
import {ReelPlataforma} from './p2/Reel';
import {TOTAL as TOTAL2} from './p2/timing';
import {ReelRedundancia} from './p3/Reel';
import {TOTAL as TOTAL3} from './p3/timing';
import {ReelFuturo} from './p4/Reel';
import {TOTAL as TOTAL4} from './p4/timing';
import {ReelMigracao} from './p5/Reel';
import {TOTAL as TOTAL5} from './p5/timing';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@fontsource/noto-sans/700.css';
import '@fontsource/noto-sans/800.css';

export const Root: React.FC = () => (
  <>
  <Composition id="AldeiaFenatran" component={Reel} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="AldeiaPlataforma" component={ReelPlataforma} durationInFrames={TOTAL2} fps={30} width={1080} height={1920} />
  <Composition id="AldeiaRedundancia" component={ReelRedundancia} durationInFrames={TOTAL3} fps={30} width={1080} height={1920} />
  <Composition id="AldeiaFuturo" component={ReelFuturo} durationInFrames={TOTAL4} fps={30} width={1080} height={1920} />
  <Composition id="AldeiaMigracao" component={ReelMigracao} durationInFrames={TOTAL5} fps={30} width={1080} height={1920} />
  </>
);
