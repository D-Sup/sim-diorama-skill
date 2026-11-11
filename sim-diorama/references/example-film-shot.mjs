// Twilight Marina GP · Threads clip: island aerial with fireworks → swoop onto my car → pit lane → full stop with crew → release.
export const duration = +(process.env.DUR || 13);
export const query = 'seed=' + (process.env.SEED || 4242);
export const clip = '#frame';

const LEAD = +(process.env.LEAD || 4.8);   // video seconds between the first frame and the car turning into the pit lane

export async function setup(page) {
  await page.evaluate(([LEAD, PIX, TEAM]) => {
    // ---- highest settings, share frame 4:5, no captions until the stop
    for (const id of ['optShadow', 'optBloom', 'optSlow']) document.getElementById(id).checked = true;
    view.pix = PIX; cineAsp = '4:5'; cine.cap = true; setCine(true);
    document.getElementById('cineBar').style.display = 'none';
    // ---- find when my lead car turns into the pit lane, then replay the same seed up to LEAD s before that
    const ff = s => __sim.fastForward(s), me = () => myCars()[0];
    const run = () => { team = TEAM; newRace(R.seed); setSpeed(1); for (const c of myCars()) c.auto = true; ff(200); __sim.box(0, 'H'); };
    run(); let n = 0; while (me().state !== 'pit' && n < 4000) { __sim.fastForward(0.05); n++; }
    run(); ff(Math.max(0, n * 0.05 - LEAD));
    __sim.jump(20.7); setFw(true);
    cine.car = me(); showCap(); clearTimeout(cine.capT);
    document.getElementById('cineCap').classList.remove('show'); document.getElementById('cineTag').classList.add('show');
    resize();

    // ---- scripted camera replaces the SHARE director for this film
    const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
    const W = new V3(), WL = new V3(), C = new V3(), CL = new V3(), PP = new V3(), PL = new V3(), T = new V3(), TL = new V3();
    window.__film = { t: 0, pitW: 0, capShown: false };
    window.cineUpdate = function (rdt) {
      const F = __film, t = F.t, c = me();
      // 1) aerial: slow orbit around the island, descending
      const u = sm(0, 4.5, t), a = 2.15 + t * 0.075;
      W.set(30 + Math.cos(a) * lerp(330, 230, u), lerp(230, 120, u), 82 + Math.sin(a) * lerp(330, 230, u)); WL.set(20, 0, lerp(80, 60, u));
      // 2) chase: behind and on the track side of the car (cars drive +x down the pit straight), so the main straight traffic passes in frame
      C.set(c.wx - 12, c.wy + 12, c.wz - 11); CL.set(c.wx + 6, c.wy, c.wz + 1.5);
      // 3) the box: same side, closer and lower, framing the crew around my team's mark
      const bx = BOXX[c.ti];
      PP.set(bx - 6.2, 4.6, BOXZ - 7.4); PL.set(bx + 0.8, 0.3, BOXZ + 0.6);
      let pw = 0; const P = c.pit;
      if (c.state === 'pit' && P && !P.queued) { const da = boxArc[c.ti] - arcOfP(P.p); pw = P.released ? (F.relT = (F.relT || 0) + rdt, 1 - sm(0.8, 2.2, F.relT)) : sm(28, 2, da); }
      else if (F.relT) pw = 0;
      F.pitW = pw;
      const b1 = sm(3.0, 5.6, t);
      T.copy(W).lerp(C, b1).lerp(PP, F.pitW); TL.copy(WL).lerp(CL, b1).lerp(PL, F.pitW);
      if (F.pitW > 0.6 && !F.relT && (F.capT = (F.capT || 0) - rdt) <= 0) { F.capT = 0.25; cine.car = c; showCap(); clearTimeout(cine.capT); }
      if (F.relT > 1.2) document.getElementById('cineCap').classList.remove('show');
      cine.pos.copy(T); cine.look.copy(TL);
      pcam.fov = lerp(42, 34, Math.max(b1, F.pitW)); pcam.position.copy(cine.pos); pcam.aspect = cssW / cssH; pcam.lookAt(cine.look); pcam.updateProjectionMatrix(); pcam.updateMatrixWorld();
    };
    // sky already full on frame 1: run the fireworks for 2.5 s from the opening pose (scenery only, the race doesn't move)
    placeCars(0); cineUpdate(0); for (let i = 0; i < 75; i++) updateScenery(1 / 30);
  }, [LEAD, +(process.env.PIX || 1), +(process.env.TEAM || 2)]);
  if (process.env.EVAL) await page.evaluate(process.env.EVAL);
}

// pit lane drive is sped up so the clip stays short; the stop itself plays in the page's own slow-mo
export function perFrame(t) {
  __film.t = t; const c = myCars()[0], P = c.pit;
  let s = 1;
  if (c.state === 'pit' && P && !P.queued) { const da = boxArc[c.ti] - arcOfP(P.p); s = P.stopped || P.released ? 3.2 : da > 30 ? 6 : da > 3 ? 3 : 5; }
  if (speed !== s) setSpeed(s);
}
