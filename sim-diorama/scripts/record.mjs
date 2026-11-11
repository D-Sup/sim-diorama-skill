// 사용: node record.mjs <html 경로> <샷 파일.mjs> <출력.mp4> [--w 1080] [--h 1350] [--fps 30] [--preview 0,2.5,5] [--query "seed=7"]
// 가짜 시계(performance.now·rAF·setTimeout·Math.random 고정)로 한 프레임씩 넘기며 찍어서, 느린 PC에서도 끊김 없는 영상이 된다.
// RECORD_LOG=1 이면 페이지의 console.log를 그대로 출력(perFrame에서 상태 찍어 타이밍 맞출 때).
// 헤드리스(창 안 띄움). 맥이면 GPU(Metal). ffmpeg가 PATH에 있어야 한다. --preview를 주면 그 초들만 PNG로 찍고 끝난다(카메라 동선 다듬을 때).
//
// 샷 파일 형식 (ESM):
//   export const duration = 12;                       // 초
//   export const query = 'seed=4242&fireworks';        // 선택: URL 뒤에 붙일 것
//   export async function setup(page) { ... }         // 한 번: 배속·시각·카메라 덮어쓰기 등 (page.evaluate 사용)
//   export function perFrame(t) { ... }               // 매 프레임 페이지 안에서 실행됨(t = 영상 초). 직렬화되므로 바깥 변수 못 씀
//   export const clip = '#frame';                     // 선택: 이 요소만 잘라 찍기
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// playwright 찾기: 이 스킬 폴더에서 `npm install` 했으면 그대로, 아니면 PLAYWRIGHT_PATH(…/node_modules/playwright/index.mjs)
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright')); }
catch { console.error('playwright가 없음. 이 스킬 폴더에서: npm install && npx playwright install chromium'); process.exit(2); }

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const [file, shotFile, out] = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
if (!file || !shotFile || !out) { console.error('usage: node record.mjs <html> <shot.mjs> <out.mp4> [--w --h --fps --preview --query]'); process.exit(2); }
const W = +opt('w', 1080), H = +opt('h', 1350), FPS = +opt('fps', 30);
const shot = await import(path.resolve(shotFile));
const preview = opt('preview', null)?.split(',').map(Number);
const query = opt('query', shot.query || '');

// 맥은 GPU(Metal)로 빠르게, 그 밖에는 기본 GL(없으면 소프트웨어 렌더라 느림)
const gpuArgs = process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--enable-gpu', '--ignore-gpu-blocklist'];
const b = await chromium.launch({ headless: true, args: gpuArgs });
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'log' && process.env.RECORD_LOG) console.log('LOG ' + m.text()); if (m.type() === 'error' && !/ReadPixels/.test(m.text())) errs.push(m.text()); });
await p.addInitScript(() => {
  let vt = 0, tid = 1, seed = 20261101; const q = [], timers = [];
  Math.random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  performance.now = () => vt; const d0 = Date.now(); Date.now = () => d0 + vt;
  window.requestAnimationFrame = cb => { q.push(cb); return q.length; };
  window.cancelAnimationFrame = () => {};
  window.setTimeout = (f, ms, ...a) => { const id = tid++; timers.push({ id, at: vt + (+ms || 0), f, a }); return id; };
  window.clearTimeout = id => { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); };
  window.setInterval = () => 0;
  window.__vt = {
    step(ms) {
      vt += ms; timers.sort((x, y) => x.at - y.at);
      while (timers.length && timers[0].at <= vt) { const t = timers.shift(); try { if (typeof t.f === 'function') t.f(...t.a); } catch (e) { console.error(e); } }
      q.splice(0).forEach(cb => cb(vt));
    },
    now: () => vt,
  };
});
await p.goto('file://' + path.resolve(file) + (query ? '?' + query : ''));
await p.waitForFunction(() => window.__sim && window.__vt, null, { timeout: 30000 });
for (let i = 0; i < 10; i++) await p.evaluate(() => __vt.step(1000 / 30));   // 첫 프레임들 데우기
if (shot.setup) await shot.setup(p);

const dir = fs.mkdtempSync(path.join(path.dirname(path.resolve(out)), '.frames-'));
const el = shot.clip ? await p.$(shot.clip) : null;
const snapTo = async f => el ? el.screenshot({ path: f }) : p.screenshot({ path: f });
const N = Math.round(shot.duration * FPS), dt = 1000 / FPS;
const want = preview ? new Set(preview.map(s => Math.round(s * FPS))) : null;
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await p.evaluate(([fn, t]) => { (0, eval)('(' + fn + ')')(t); }, [shot.perFrame ? shot.perFrame.toString() : '()=>{}', i / FPS]);
  await p.evaluate(ms => __vt.step(ms), dt);
  if (want && !want.has(i)) continue;
  const f = want ? out.replace(/\.mp4$/, '') + `-t${(i / FPS).toFixed(1)}.png` : path.join(dir, String(i).padStart(5, '0') + '.png');
  await snapTo(f);
  if (!want && i % FPS === 0) process.stdout.write(`\r${i}/${N} frames · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (want && [...want].every(k => k <= i)) break;
}
await b.close();
if (!want) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%05d.png'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`\nVIDEO ${out} · ${N} frames · ${W}x${H}@${FPS}`);
} else { fs.rmSync(dir, { recursive: true, force: true }); console.log('PREVIEW', preview.join(', ')); }
console.log('ERRORS (' + errs.length + ')' + (errs.length ? ':\n' + errs.slice(0, 10).join('\n') : ''));
