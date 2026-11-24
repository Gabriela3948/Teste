// Renderiza varios quadros de teste com um unico bundle: node scripts/stills.mjs <composicao> <pasta> <escala> <frames...>
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
const [, , comp, out, scale, ...frames] = process.argv;
fs.mkdirSync(out, {recursive: true});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: 'src/index.ts', publicDir: 'public'});
const browser = await openBrowser('chrome', {browserExecutable});
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser, browserExecutable});
for (const fr of frames) {
  await renderStill({composition, serveUrl, frame: Number(fr), output: `${out}/f${String(fr).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 86, scale: Number(scale), puppeteerInstance: browser, browserExecutable, logLevel: 'error'});
}
await browser.close({silent: true});
console.log('ok', frames.length);
