// Valida as EDLs: pontos de entrada/saída dentro dos takes e duração das seções.
import {build} from 'esbuild';
import fs from 'node:fs';
const cat = JSON.parse(fs.readFileSync('/home/user/work/catalog.json'));
const dur = Object.fromEntries(cat.map((x) => [x.f.replace(/^IMG_|\.(MOV|mov)$/g, ''), x.dur]));
await build({entryPoints: ['validate-entry.ts'], bundle: true, platform: 'node', format: 'esm', outfile: '.edl-check.mjs', external: ['remotion', 'react'], logLevel: 'error'});
const m = await import('./.edl-check.mjs?' + Date.now());
for (const [name, e] of Object.entries(m.edits)) {
  const p = m.place(e.shots);
  console.log(`\n== ${name}: total ${(e.total ?? 0).toFixed(1)}s, ${e.shots.length} takes`);
  let sec = null, secStart = 0;
  p.forEach((s, i) => {
    const used = s.in + s.dur * (s.speed ?? 1);
    if (dur[s.src] === undefined) console.log('  !! take inexistente', s.src);
    else if (used > dur[s.src] + 0.01) console.log(`  !! ${s.src} passa do fim: usa até ${used.toFixed(2)} de ${dur[s.src]}`);
    if (!fs.existsSync(`public/proxies/${s.src}.mp4`)) console.log('  (sem proxy ainda)', s.src);
    if (s.tag) { if (sec) console.log(`  ${sec.padEnd(16)} ${secStart.toFixed(1).padStart(6)}s  (${(s.start - secStart).toFixed(1)}s)`); sec = s.tag; secStart = s.start; }
  });
  const end = p[p.length - 1].start + p[p.length - 1].dur;
  console.log(`  ${sec.padEnd(16)} ${secStart.toFixed(1).padStart(6)}s  (${(end - secStart).toFixed(1)}s)`);
}
