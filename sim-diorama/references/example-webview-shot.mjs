// Twilight Marina GP · plain web view at 8×: whole map → zoom onto my car racing → pit stop → whole map again.
// The page's own isometric camera and broadcast UI; only view.tx/tz/zoom and the speed are driven, smoothly.
export const duration = +(process.env.DUR || (process.env.SHORT ? 15 : 22.5));
export const query = 'seed=' + (process.env.SEED || 4242);

export async function setup(page) {
  if (process.env.PREEVAL) await page.evaluate(process.env.PREEVAL);
  await page.evaluate(([PIX, TEAM, PRE, SHORT]) => {
    for (const id of ['optShadow', 'optBloom']) document.getElementById(id).checked = true;
    for (const id of ['optCam', 'optSlow']) document.getElementById(id).checked = false;   // the film drives camera and speed itself
    view.pix = PIX; resize();
    const me = () => myCars()[0];
    const run = () => { team = TEAM; newRace(R.seed); setSpeed(8); for (const c of myCars()) c.auto = true; __sim.fastForward(200); __sim.box(0, 'H'); };
    run(); let n = 0; while (me().state !== 'pit' && n < 6000) { __sim.fastForward(0.05); n++; }
    run(); __sim.fastForward(Math.max(0, n * 0.05 - PRE));
    __sim.jump(20.7); setFw(true);
    view.mode = 'film'; view.followId = null; view.tgt = null; view.zoomT = 0;
    document.querySelectorAll('[data-cam]').forEach(b => b.classList.remove('on'));

    // timing knobs: SHORT=1 gives the 15 s cut
    const K = SHORT ? { z0: 1.3, z1: 3.4, out: 1.6, e0: 1.5, e1: 3.9, slow: 20, up: 1.0, lo: 0.2 } : { z0: 2.6, z1: 5.4, out: 2.2, e0: 2.4, e1: 5.6, slow: 32, up: 1.6, lo: 1.5 };
    const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
    const O = window.__O || { x: 50, z: 80, z0: 0.72 };
    window.__film = { t: 0, relT: 0, pitW: 0, done: false };
    // camera pose as a function of film time: log-space zoom so the fly-in feels even
    window.__filmCam = function (rdt) {
      const F = __film, t = F.t, c = me(), P = c.pit;
      const w1 = sm(K.z0, K.z1, t);
      let pw = 0;
      if (c.state === 'pit' && P && !P.queued) {
        const da = boxArc[c.ti] - arcOfP(P.p);
        if (P.released) { F.relT += rdt; pw = 1 - sm(0.4, K.out, F.relT); } else pw = sm(45, 6, da);
      } else if (F.relT > 0) F.relT += rdt;
      const wEnd = sm(K.e0, K.e1, F.relT);
      const bx = BOXX[c.ti];
      let x = lerp(O.x, c.wx, w1), z = lerp(O.z, c.wz, w1), lz = lerp(Math.log(O.z0), Math.log(3.4), w1);
      x = lerp(x, bx, pw); z = lerp(z, 51.6, pw); lz = lerp(lz, Math.log(9.5), pw);
      x = lerp(x, O.x, wEnd); z = lerp(z, O.z, wEnd); lz = lerp(lz, Math.log(O.z0), wEnd);
      view.tx = x; view.tz = z; view.zoom = Math.exp(lz); document.getElementById('zoom').value = view.zoom;
      // speed eases down to 1× for the stop and back up to 8× after it, like someone riding the speed buttons
      let s = 8;
      if (c.state === 'pit' && P && !P.queued && !P.released) s = 1 + 7 * sm(K.lo, K.slow, boxArc[c.ti] - arcOfP(P.p));
      if (P && P.released || F.relT > 0) s = 1 + 7 * sm(0.2, K.up, F.relT);
      s = Math.round(s * 4) / 4; if (speed !== s) { setSpeed(s); document.getElementById('hSpeed').textContent = Math.round(s) + '×'; }
    };
    placeCars(0); __filmCam(0); for (let i = 0; i < 75; i++) updateScenery(1 / 30);   // sky already full of fireworks on frame 1
  }, [+(process.env.PIX || 1), +(process.env.TEAM || 2), +(process.env.PRE || (process.env.SHORT ? 34 : 64)), !!process.env.SHORT]);
  if (process.env.EVAL) await page.evaluate(process.env.EVAL);
}

export function perFrame(t) {
  __film.t = t; __filmCam(1 / 30);
  if (window.__LOG && Math.round(t * 30) % 15 === 0) { const c = myCars()[0], P = c.pit; console.log(t.toFixed(1) + ' ' + c.state + ' spd' + speed + (P ? (P.stopped ? ' STOP' : '') + (P.released ? ' REL' : '') : '') + ' rel' + __film.relT.toFixed(1)); }
}
