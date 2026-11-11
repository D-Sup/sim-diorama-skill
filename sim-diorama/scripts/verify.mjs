// 사용: node verify.mjs <html 절대경로> <출력 접두사> [낮 대기초=12] [밤 대기초=9]
// 헤드리스 크롬(창 안 띄움)으로 낮 → 8배속 → 밤을 돌려 스크린샷 3장 + state/invariants + 콘솔 에러를 출력한다.
// 페이지에 window.__sim = { setSpeed, jump, state, invariants } 훅이 있어야 한다.
import fs from 'node:fs';
import path from 'node:path';

// playwright 찾기: 이 스킬 폴더에서 `npm install` 했으면 그대로, 아니면 PLAYWRIGHT_PATH(…/node_modules/playwright/index.mjs)
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright')); }
catch { console.error('playwright가 없음. 이 스킬 폴더에서: npm install && npx playwright install chromium'); process.exit(2); }

const [file, out, dayS = '12', nightS = '9'] = process.argv.slice(2);
if (!file || !out) { console.error('usage: node verify.mjs <html> <outPrefix> [daySec] [nightSec]'); process.exit(2); }

const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1400, height: 860 } });
const errs = [];
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { const t = m.text(); if (!/ReadPixels/.test(t)) errs.push(m.type() + ': ' + t); } });
p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message + '\n' + e.stack));

const snap = async (label) => {
  const r = await p.evaluate(() => {
    const s = window.__sim; if (!s) return { error: 'window.__sim 없음' };
    return { state: s.state?.(), invariants: s.invariants?.() };
  });
  console.log(`\n== ${label}\n` + JSON.stringify(r, null, 1));
  return r;
};

await p.goto('file://' + path.resolve(file));
await p.waitForTimeout(4000);
await p.screenshot({ path: out + '-1-start.png' });
await snap('start');

await p.evaluate(() => window.__sim?.setSpeed?.(8));
await p.waitForTimeout(+dayS * 1000);
await p.screenshot({ path: out + '-2-day8x.png' });
await snap('day @8x');

await p.evaluate(() => window.__sim?.jump?.(21));
await p.waitForTimeout(+nightS * 1000);
await p.screenshot({ path: out + '-3-night.png' });
const last = await snap('night');

const inv = last.invariants || {};
if (last.error) errs.push('HOOK: ' + last.error);
const bad = Object.entries(inv).filter(([, v]) => v === false).map(([k]) => k);
console.log('\nSCREENSHOTS: ' + ['1-start', '2-day8x', '3-night'].map(s => `${out}-${s}.png`).join('  '));
console.log('INVARIANTS FAILED: ' + (bad.length ? bad.join(', ') : 'none'));
console.log('ERRORS (' + errs.length + '):\n' + errs.slice(0, 15).join('\n'));
await b.close();
process.exit(errs.length || bad.length ? 1 : 0);
