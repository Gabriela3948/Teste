import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [id, s, out] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium';
const composition = await selectComposition({serveUrl, id, browserExecutable});
await renderStill({serveUrl, composition, frame: Math.round(Number(s) * 30), output: out, imageFormat: 'png', browserExecutable});
