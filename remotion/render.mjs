// Uso: node render.mjs <CompositionId> <saida.mp4> [--draft]
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, out, flag] = process.argv.slice(2);
const draft = flag === '--draft';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.CHROME ?? '/opt/pw-browsers/chromium';
const composition = await selectComposition({serveUrl, id, browserExecutable});
let last = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  outputLocation: out,
  browserExecutable,
  concurrency: Number(process.env.CONC ?? 3),
  crf: draft ? 28 : 16,
  scale: draft ? 0.5 : 1,
  audioBitrate: '320k',
  x264Preset: draft ? 'veryfast' : 'slow',
  colorSpace: 'bt709',
  offthreadVideoCacheSizeInBytes: 2 * 1024 ** 3,
  onProgress: ({progress}) => {
    const p = Math.floor(progress * 20);
    if (p !== last) { last = p; console.log(`${id}: ${Math.round(progress * 100)}%`); }
  },
});
fs.rmSync(serveUrl, {recursive: true, force: true});
console.log('done', out);
