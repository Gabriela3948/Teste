import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [id, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium';
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const s of secs) {
  await renderStill({serveUrl, composition, frame: Math.round(Number(s) * 30), output: `out/still_${id}_${s}.jpg`, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5, browserExecutable});
  console.log('ok', s);
}
