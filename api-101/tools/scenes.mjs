// Scene markup and motion. Times are seconds local to each scene and follow the
// narration cues printed by `node tools/script.mjs`.
const dots = (n) => Array.from({ length: n }, (_, i) => `<i class="bo-dot" id="bo-dot-${i}"></i>`).join("");

export const scenes = {
  // ---------------------------------------------------------------- hook
  hook: {
    title: "The morning rush",
    openFrom: 1,
    css: `
      #hook-browser { left: 0; top: 0; width: 756px; height: 372px; padding: 0; opacity: 1; overflow: hidden; }
      .hk-chrome { display: flex; align-items: center; gap: 12px; height: 62px; padding: 0 22px; border-bottom: 2px solid var(--line); }
      .hk-url { margin-left: 14px; flex: 1; height: 38px; border: 2px solid var(--line); border-radius: 10px;
        font-size: 28px; line-height: 34px; padding: 0 14px; color: var(--muted); }
      .hk-body { padding: 24px 28px; }
      .hk-route { font-size: 44px; font-weight: 700; line-height: 60px; }
      .hk-route b { color: var(--orange); font-weight: 700; }
      .hk-meta { font-size: 28px; color: var(--muted); margin-top: 6px; }
      #hook-btn { position: absolute; left: 28px; top: 252px; width: 700px; height: 90px; border: 2.5px solid var(--orange);
        border-radius: 16px; }
      .hk-btn-in { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 18px;
        font-size: 32px; font-weight: 700; }
      #hook-btn-busy { opacity: 0; color: var(--muted); }
      #hook-spin { width: 40px; height: 40px; }
      #hook-spin circle { fill: none; stroke: var(--blue); stroke-width: 5; stroke-linecap: round; stroke-dasharray: 70 200; }
      #hook-cursor { position: absolute; left: 0; top: 0; width: 44px; height: 54px; opacity: 0; }
      #hook-term { left: 0; top: 396px; width: 756px; height: 128px; }
      #hook-note { left: 470px; top: 196px; }
    `,
    html: `
      <div class="k-card" id="hook-browser">
        <div class="hk-chrome"><span class="k-dot o"></span><span class="k-dot"></span><span class="k-dot g"></span>
          <div class="hk-url">rail.app/book</div></div>
        <div class="hk-body">
          <div class="hk-route"><b>08:12</b> CENTRAL → HARBOUR</div>
          <div class="hk-meta">1 adult · general · ₹30</div>
        </div>
        <div id="hook-btn">
          <div class="hk-btn-in" id="hook-btn-idle">Book ticket</div>
          <div class="hk-btn-in" id="hook-btn-busy"><svg id="hook-spin" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/></svg>Processing…</div>
        </div>
      </div>
      <svg id="hook-cursor" viewBox="0 0 44 54"><path d="M3 3 L3 44 L14 34 L22 51 L30 47 L22 31 L37 31 Z" fill="#f2f2f5" stroke="#0f0f11" stroke-width="3" stroke-linejoin="round"/></svg>
      <div class="k-card k-term" id="hook-term">
        <div class="k-head"><span class="k-dot"></span>client<span class="k-right" id="hook-wait">waiting 00s</span></div>
        <div class="k-tline" id="hook-req">POST /bookings</div>
      </div>
      <div class="k-note" id="hook-note">still spinning…</div>
    `,
    js: `
      tl.fromTo("#hook-cursor", { opacity: 0, x: 690, y: 520 }, { opacity: 1, x: 380, y: 300, duration: 1.2, ease: "power3.out", immediateRender: false }, 0.8);
      tl.to("#hook-cursor", { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", transformOrigin: "10% 10%" }, 2.15);
      K.swap(tl, "#hook-btn-idle", "#hook-btn-busy", 2.25);
      tl.to("#hook-cursor", { opacity: 0, duration: 0.3, ease: "power2.in" }, 3.0);
      tl.fromTo("#hook-spin", { rotation: 0 }, { rotation: 360 * 14, duration: 5.6, ease: "none", transformOrigin: "50% 50%", immediateRender: false }, 2.25);
      K.pop(tl, "#hook-term", 2.4);
      K.type(tl, "#hook-req", 2.6, { cps: 22, blink: false });
      const sec = (v) => "waiting " + String(Math.floor(v)).padStart(2, "0") + "s";
      K.count(tl, "#hook-wait", 2.6, 2.3, 0, 6, sec);
      K.count(tl, "#hook-wait", 4.99, 2.5, 6, 30, sec, "power2.in");
      K.slam(tl, "#hook-note", 5.1, -4);
    `,
  },

  // ------------------------------------------------------------ timeouts
  timeouts: {
    title: "Timeouts",
    css: `
      #to-client { left: 0; top: 0; width: 340px; height: 232px; }
      #to-server { left: 416px; top: 0; width: 340px; height: 232px; }
      #to-link { left: 340px; top: 108px; width: 76px; height: 4px; }
      .to-code { margin-top: 22px; font-size: 30px; line-height: 44px; white-space: pre; }
      .to-code em { font-style: normal; color: var(--blue); }
      #to-stamp { left: 72px; top: 176px; }
      #to-done { left: 476px; top: 176px; border-color: var(--green); color: var(--green); }
      #to-db { left: 0; top: 268px; width: 756px; height: 256px; }
      #to-db .k-tline { font-size: 30px; line-height: 50px; }
      #to-db-h { color: var(--muted); margin-top: 16px; }
      #to-note { left: 420px; top: 420px; }
      #to-packet { left: 340px; top: 110px; }
    `,
    html: `
      <div class="k-card" id="to-client">
        <div class="k-head"><span class="k-dot"></span>client<span class="k-right" id="to-c-t">0s</span></div>
        <div class="to-code" id="to-c-code">timeout = 10s</div>
        <div class="k-bar"><div class="k-fill" id="to-c-fill"></div></div>
      </div>
      <svg class="k-path" id="to-link" viewBox="0 0 76 4"><line x1="0" y1="2" x2="76" y2="2"/></svg>
      <div class="k-packet" id="to-packet"></div>
      <div class="k-card" id="to-server">
        <div class="k-head"><span class="k-dot o"></span>server<span class="k-right" id="to-s-t">0s</span></div>
        <div class="to-code" id="to-s-code">max_time = 30s</div>
        <div class="k-bar"><div class="k-fill" id="to-s-fill"></div></div>
      </div>
      <div class="k-stamp" id="to-stamp">GAVE UP @10s</div>
      <div class="k-stamp" id="to-done">DONE @12s</div>
      <div class="k-card k-term" id="to-db">
        <div class="k-head"><span class="k-dot g"></span>bookings table</div>
        <div class="k-tline" id="to-db-h">id      status</div>
        <div class="k-tline" id="to-db-row">#4821   <span id="to-db-ok">CONFIRMED</span></div>
      </div>
      <div class="k-note" id="to-note">timeout ≠ cancel</div>
    `,
    js: `
      const s = (v) => Math.floor(v) + "s";
      gsap.set(["#to-c-fill", "#to-s-fill"], { scaleX: 0 });
      K.pop(tl, "#to-client", 3.0);
      K.type(tl, "#to-c-code", 3.3, { cps: 18, blink: false });
      K.draw(tl, "#to-link", 3.6, 0.4);
      K.travel(tl, "#to-packet", 3.9, 0.6, [0, 0], [76, 0]);
      tl.fromTo("#to-c-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "none", immediateRender: false }, 4.0);
      K.count(tl, "#to-c-t", 4.0, 1.7, 0, 10, s);
      tl.to("#to-c-fill", { backgroundColor: "#ff8a3d", duration: 0.2 }, 5.6);
      K.slam(tl, "#to-stamp", 5.7, -4);
      K.pop(tl, "#to-server", 6.5);
      K.type(tl, "#to-s-code", 6.8, { cps: 18, blink: false });
      // The server keeps working after the client gave up, and finishes inside its own limit.
      tl.fromTo("#to-s-fill", { scaleX: 0 }, { scaleX: 0.4, duration: 1.8, ease: "none", immediateRender: false }, 7.4);
      K.count(tl, "#to-s-t", 7.4, 1.8, 0, 12, s);
      tl.to("#to-s-fill", { backgroundColor: "#3ddc97", duration: 0.2 }, 9.2);
      K.slam(tl, "#to-done", 9.25, 3);
      K.pop(tl, "#to-db", 9.4);
      K.type(tl, "#to-db-h", 9.7, { cps: 30, blink: false });
      K.type(tl, "#to-db-row", 10.3, { cps: 18 });
      K.sweep(tl, "#to-db-ok", 11.4, "#3ddc97");
      K.slam(tl, "#to-note", 12.0, -3);
    `,
  },

  // --------------------------------------------------------------- retry
  retry: {
    title: "Retry",
    css: `
      #rt-client { left: 0; top: 30px; width: 270px; height: 200px; }
      #rt-server { left: 496px; top: 30px; width: 260px; height: 200px; }
      .rt-sw { position: relative; height: 68px; margin-top: 30px; }
      .rt-sw > div { position: absolute; left: 0; top: 0; }
      .rt-ok { color: var(--green); }
      .rt-bad { color: var(--orange); }
      #rt-req { left: 260px; top: 96px; width: 236px; height: 4px; }
      #rt-res { left: 260px; top: 170px; width: 236px; height: 4px; }
      .rt-lab { position: absolute; width: 236px; left: 260px; text-align: center; font-family: var(--mono); font-size: 28px; color: var(--muted); opacity: 0; }
      #rt-lab-req { top: 48px; }
      #rt-lab-res { top: 184px; }
      #rt-p1 { left: 260px; top: 98px; }
      #rt-p2 { left: 260px; top: 172px; }
      #rt-x { left: 350px; top: 146px; padding: 2px 14px; }
      #rt-term { left: 0; top: 270px; width: 756px; height: 254px; }
      #rt-term .k-tline { font-size: 28px; line-height: 44px; }
      #rt-term .k-tline:first-of-type { margin-top: 14px; }
      #rt-note { left: 268px; top: 214px; }
    `,
    html: `
      <div class="k-card" id="rt-client">
        <div class="k-head"><span class="k-dot"></span>client</div>
        <div class="rt-sw"><div class="k-big" id="rt-c-a">ticket</div><div class="k-big rt-ok k-hide" id="rt-c-b">✓ ticket</div></div>
      </div>
      <div class="k-card" id="rt-server">
        <div class="k-head"><span class="k-dot o"></span>server</div>
        <div class="rt-sw"><div class="k-big" id="rt-s-a">ready</div><div class="k-big rt-bad k-hide" id="rt-s-b">CRASH</div>
          <div class="k-big k-hide" id="rt-s-c">ready</div><div class="k-big rt-ok k-hide" id="rt-s-d">200 OK</div></div>
      </div>
      <div class="rt-lab" id="rt-lab-req">request →</div>
      <svg class="k-path" id="rt-req" viewBox="0 0 236 4"><line x1="0" y1="2" x2="236" y2="2"/></svg>
      <svg class="k-path" id="rt-res" viewBox="0 0 236 4"><line x1="0" y1="2" x2="236" y2="2"/></svg>
      <div class="rt-lab" id="rt-lab-res">← response</div>
      <div class="k-packet" id="rt-p1"></div>
      <div class="k-packet" id="rt-p2"></div>
      <div class="k-stamp" id="rt-x">✕ lost</div>
      <div class="k-card k-term" id="rt-term">
        <div class="k-head"><span class="k-dot"></span>client.log</div>
        <div class="k-tline" id="rt-l1">POST /bookings ........ sent</div>
        <div class="k-tline rt-bad" id="rt-l2">server crashed · no response</div>
        <div class="k-tline" id="rt-l3">retry 1 · POST /bookings</div>
        <div class="k-tline rt-ok" id="rt-l4">200 OK · booking #4821</div>
      </div>
      <div class="k-note" id="rt-note">send it again</div>
    `,
    js: `
      K.pop(tl, "#rt-client", 0.6);
      K.pop(tl, "#rt-server", 0.8);
      K.draw(tl, "#rt-req", 1.1, 0.5);
      K.draw(tl, "#rt-res", 1.3, 0.5);
      tl.fromTo(["#rt-lab-req", "#rt-lab-res"], { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.2, immediateRender: false }, 1.4);
      K.pop(tl, "#rt-term", 3.6);
      K.type(tl, "#rt-l1", 4.1, { cps: 30, blink: false });
      K.travel(tl, "#rt-p1", 4.1, 0.7, [0, 0], [236, 0]);
      K.swap(tl, "#rt-s-a", "#rt-s-b", 4.85);
      tl.to("#rt-server", { borderColor: "#ff8a3d", duration: 0.15 }, 4.85);
      K.shake(tl, "#rt-server", 4.85);
      // The reply never makes it back.
      tl.fromTo("#rt-p2", { x: 236, y: 0, opacity: 0 }, { x: 120, opacity: 1, duration: 0.6, ease: "power1.out", immediateRender: false }, 5.4);
      tl.to("#rt-p2", { opacity: 0, scale: 0.3, duration: 0.15 }, 6.0);
      K.slam(tl, "#rt-x", 6.05, -3);
      K.type(tl, "#rt-l2", 6.2, { cps: 26, blink: false });
      tl.to("#rt-x", { opacity: 0, duration: 0.2 }, 8.0);
      K.swap(tl, "#rt-s-b", "#rt-s-c", 8.1);
      tl.to("#rt-server", { borderColor: "#2c2c34", duration: 0.3 }, 8.1);
      K.slam(tl, "#rt-note", 8.3, -3);
      K.type(tl, "#rt-l3", 10.6, { cps: 24, blink: false });
      K.travel(tl, "#rt-p1", 10.9, 0.7, [0, 0], [236, 0]);
      K.swap(tl, "#rt-s-c", "#rt-s-d", 11.65);
      K.travel(tl, "#rt-p2", 11.9, 0.7, [236, 0], [0, 0], "#3ddc97");
      K.swap(tl, "#rt-c-a", "#rt-c-b", 12.65);
      tl.to("#rt-client", { borderColor: "#3ddc97", duration: 0.2 }, 12.65);
      K.type(tl, "#rt-l4", 12.9, { cps: 24 });
    `,
  },

  // ------------------------------------------------------------- backoff
  backoff: {
    title: "Exponential backoff",
    css: `
      #bo-a, #bo-b { position: absolute; inset: 0; }
      #bo-crowd { left: 0; top: 0; width: 400px; height: 480px; }
      .bo-grid { display: grid; grid-template-columns: repeat(10, 22px); gap: 12px 10px; margin-top: 26px; }
      .bo-dot { display: block; width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid var(--blue); box-sizing: border-box; }
      #bo-crowd .k-label { margin-top: 22px; }
      #bo-count { font-size: 44px; font-weight: 700; color: var(--orange); }
      #bo-server { left: 476px; top: 90px; width: 280px; height: 260px; }
      #bo-load { font-size: 56px; font-weight: 700; margin-top: 10px; }
      .bo-sw { position: relative; height: 40px; margin-top: 16px; font-size: 28px; }
      .bo-sw > div { position: absolute; left: 0; top: 0; white-space: nowrap; }
      #bo-st-b { color: var(--orange); }
      #bo-links { left: 400px; top: 60px; width: 76px; height: 320px; }
      .bo-pk { left: 400px; }
      #bo-stamp { left: 500px; top: 384px; }
      #bo-formula { left: 0; top: 0; width: 756px; height: 124px; }
      #bo-formula .k-tline { font-size: 34px; margin-top: 12px; }
      #bo-axis { left: 0; top: 148px; width: 756px; height: 232px; }
      #bo-axis-line { left: 26px; top: 150px; width: 704px; height: 4px; }
      #bo-arcs { position: absolute; left: 0; top: 0; width: 756px; height: 232px; overflow: visible; }
      #bo-arcs path { fill: none; stroke: var(--orange); stroke-width: 3; stroke-linecap: round; }
      .bo-mk { position: absolute; top: 140px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%;
        background: var(--card); border: 3px solid var(--blue); opacity: 0; }
      .bo-mk.first { border-color: var(--ink); }
      .bo-tl { position: absolute; top: 172px; width: 80px; margin-left: -40px; text-align: center; font-size: 28px; color: var(--muted); opacity: 0; }
      .bo-gap { position: absolute; top: 76px; width: 90px; margin-left: -45px; text-align: center; font-size: 28px; font-weight: 700; color: var(--orange); opacity: 0; }
      #bo-limit { left: 0; top: 404px; width: 756px; height: 120px; padding-top: 18px; }
      #bo-limit .k-tline { font-size: 30px; line-height: 42px; }
      #bo-lim2 { color: var(--muted); }
      #bo-stop { left: 590px; top: 216px; }
    `,
    html: `
      <div id="bo-a">
        <div class="k-card" id="bo-crowd">
          <div class="k-head"><span class="k-dot"></span>users</div>
          <div class="bo-grid">${dots(80)}</div>
          <div class="k-label">retrying now</div>
          <div id="bo-count">0</div>
        </div>
        <svg class="k-path" id="bo-links" viewBox="0 0 76 320"><path d="M0 40 C40 40 40 160 76 160 M0 160 L76 160 M0 280 C40 280 40 160 76 160"/></svg>
        <div class="k-packet bo-pk" id="bo-pk0" style="top: 100px"></div>
        <div class="k-packet bo-pk" id="bo-pk1" style="top: 220px"></div>
        <div class="k-packet bo-pk" id="bo-pk2" style="top: 340px"></div>
        <div class="k-card" id="bo-server">
          <div class="k-head"><span class="k-dot o"></span>server</div>
          <div class="k-label">load</div>
          <div id="bo-load">12%</div>
          <div class="k-bar"><div class="k-fill" id="bo-fill"></div></div>
          <div class="bo-sw"><div id="bo-st-a">status: ok</div><div id="bo-st-b" class="k-hide">503 overload</div></div>
        </div>
        <div class="k-stamp" id="bo-stamp">OVERLOAD</div>
      </div>
      <div id="bo-b">
        <div class="k-card k-term" id="bo-formula">
          <div class="k-head"><span class="k-dot o"></span>backoff.js</div>
          <div class="k-tline" id="bo-f">delay = 1s × 2^attempt</div>
        </div>
        <div class="k-card" id="bo-axis">
          <div class="k-head"><span class="k-dot"></span>attempts over time</div>
          <svg class="k-path" id="bo-axis-line" viewBox="0 0 704 4"><line x1="0" y1="2" x2="704" y2="2"/></svg>
          <svg id="bo-arcs" viewBox="0 0 756 232">
            <path id="bo-arc1" d="M30 132 Q70 96 110 132"/>
            <path id="bo-arc2" d="M118 132 Q202 70 286 132"/>
            <path id="bo-arc3" d="M294 132 Q468 50 638 132"/>
          </svg>
          <i class="bo-mk first" id="bo-mk0" style="left: 26px"></i>
          <i class="bo-mk" id="bo-mk1" style="left: 114px"></i>
          <i class="bo-mk" id="bo-mk2" style="left: 290px"></i>
          <i class="bo-mk" id="bo-mk3" style="left: 642px"></i>
          <div class="bo-tl" id="bo-tl0" style="left: 40px">0s</div>
          <div class="bo-tl" id="bo-tl1" style="left: 114px">1s</div>
          <div class="bo-tl" id="bo-tl2" style="left: 290px">3s</div>
          <div class="bo-tl" id="bo-tl3" style="left: 642px">7s</div>
          <div class="bo-gap" id="bo-g1" style="left: 70px">+1s</div>
          <div class="bo-gap" id="bo-g2" style="left: 202px">+2s</div>
          <div class="bo-gap" id="bo-g3" style="left: 466px">+4s</div>
        </div>
        <div class="k-card k-term" id="bo-limit">
          <div class="k-tline" id="bo-lim1">max_retries = 3</div>
          <div class="k-tline" id="bo-lim2">attempt 4 → stop, show an error</div>
        </div>
        <div class="k-stamp" id="bo-stop">LIMIT</div>
      </div>
    `,
    js: `
      gsap.set("#bo-fill", { scaleX: 0.12 });
      K.pop(tl, "#bo-crowd", 0.6);
      K.pop(tl, "#bo-server", 1.2);
      for (let i = 0; i < 4; i++) tl.to("#bo-dot-" + (i * 23 % 80), { borderColor: "#ff8a3d", duration: 0.15 }, 1.6 + i * 0.3);
      K.draw(tl, "#bo-links", 1.8, 0.5);
      // Millions retry: every user turns orange in a seeded scatter, load climbs.
      for (let i = 0; i < 80; i++) tl.to("#bo-dot-" + i, { borderColor: "#ff8a3d", backgroundColor: "rgba(255,138,61,0.25)", duration: 0.15 }, 3.7 + K.rnd(i) * 4.6);
      K.count(tl, "#bo-count", 3.7, 5.4, 4, 1000000, (v) => Math.round(v).toLocaleString("en-US") + (v > 999999 ? "+" : ""), "power3.in");
      for (let k = 0; k < 9; k++) K.travel(tl, "#bo-pk" + (k % 3), 3.8 + k * 0.6, 0.45, [0, 0], [76, 220 - [100, 220, 340][k % 3]]);
      K.count(tl, "#bo-load", 3.8, 5.5, 12, 100, (v) => Math.round(v) + "%", "power2.in");
      tl.fromTo("#bo-fill", { scaleX: 0.12 }, { scaleX: 1, duration: 5.5, ease: "power2.in", immediateRender: false }, 3.8);
      tl.to("#bo-fill", { backgroundColor: "#ff8a3d", duration: 0.4 }, 7.6);
      K.swap(tl, "#bo-st-a", "#bo-st-b", 9.38);
      tl.to("#bo-server", { borderColor: "#ff8a3d", duration: 0.15 }, 9.38);
      K.shake(tl, "#bo-server", 9.38);
      K.slam(tl, "#bo-stamp", 9.45, -4);
      K.close(tl, "#bo-a", 11.3);

      K.pop(tl, "#bo-formula", 11.6);
      K.type(tl, "#bo-f", 11.95, { cps: 15 });
      K.pop(tl, "#bo-axis", 13.6);
      K.draw(tl, "#bo-axis-line", 13.9, 0.6);
      const mk = (i, at) => {
        tl.fromTo("#bo-mk" + i, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)", immediateRender: false }, at);
        tl.fromTo("#bo-tl" + i, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, at + 0.1);
      };
      mk(0, 14.5);
      [[1, 15.0], [2, 16.6], [3, 18.2]].forEach(([i, at]) => {
        K.underline(tl, "#bo-arc" + i, at, 0.25 * Math.pow(2, i - 1) + 0.3);
        tl.fromTo("#bo-g" + i, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, at + 0.2);
        mk(i, at + 0.25 * Math.pow(2, i - 1) + 0.3);
      });
      K.pop(tl, "#bo-limit", 20.3);
      K.type(tl, "#bo-lim1", 20.6, { cps: 16, blink: false });
      K.type(tl, "#bo-lim2", 22.0, { cps: 22 });
      K.slam(tl, "#bo-stop", 23.6, -5);
    `,
  },

  // --------------------------------------------------------------- debit
  debit: {
    title: "Charged again?",
    css: `
      #db-bank { left: 98px; top: 0; width: 560px; height: 430px; }
      #db-bal { font-size: 64px; font-weight: 700; line-height: 80px; }
      .db-rule { height: 2px; background: var(--line); margin: 16px 0 10px; }
      #db-bank .k-tline { font-size: 30px; line-height: 50px; color: var(--orange); }
      #db-stamp { left: 420px; top: 330px; font-size: 36px; }
    `,
    html: `
      <div class="k-card" id="db-bank">
        <div class="k-head"><span class="k-dot o"></span>bank · a/c ••4821</div>
        <div class="k-label">balance</div>
        <div id="db-bal">₹1,200</div>
        <div class="db-rule"></div>
        <div class="k-tline" id="db-l1">−₹30   rail booking   08:12</div>
        <div class="k-tline" id="db-l2">−₹30   rail booking   08:12</div>
        <div class="k-tline" id="db-l3">−₹30   rail booking   08:12</div>
      </div>
      <div class="k-stamp" id="db-stamp">3 DEBITS?</div>
    `,
    js: `
      const inr = (v) => "₹" + Math.round(v).toLocaleString("en-US");
      K.pop(tl, "#db-bank", 0.5);
      K.type(tl, "#db-l1", 0.9, { cps: 26, blink: false });
      K.count(tl, "#db-bal", 1.8, 0.5, 1200, 1170, inr, "power2.out");
      K.type(tl, "#db-l2", 3.4, { cps: 34, blink: false });
      K.count(tl, "#db-bal", 4.2, 0.4, 1170, 1140, inr, "power2.out");
      K.type(tl, "#db-l3", 4.6, { cps: 40, blink: false });
      K.count(tl, "#db-bal", 5.3, 0.4, 1140, 1110, inr, "power2.out");
      K.shake(tl, "#db-bank", 5.3);
      K.slam(tl, "#db-stamp", 5.8, -6);
    `,
  },

  // ---------------------------------------------------------------- idem
  idem: {
    title: "Idempotency",
    css: `
      #id-req { left: 0; top: 0; width: 430px; height: 300px; }
      #id-req .k-tline { font-size: 28px; line-height: 50px; }
      #id-req .k-tline:first-of-type { margin-top: 18px; }
      .id-key { color: var(--blue); }
      #id-srv { left: 496px; top: 0; width: 260px; height: 300px; }
      #id-srv .k-tline { font-size: 28px; line-height: 44px; }
      #id-srv .k-label { margin-top: 18px; }
      #id-link { left: 430px; top: 150px; width: 66px; height: 4px; }
      #id-pk { left: 430px; top: 152px; }
      #id-seen { left: 532px; top: 236px; border-color: var(--green); color: var(--green); }
      #id-res { left: 0; top: 326px; width: 756px; height: 198px; }
      #id-res .k-tline { font-size: 30px; line-height: 50px; }
      #id-res .k-tline:first-of-type { margin-top: 16px; }
      #id-once { color: var(--ink); }
    `,
    html: `
      <div class="k-card k-term" id="id-req">
        <div class="k-head"><span class="k-dot"></span>requests</div>
        <div class="k-tline" id="id-r0">1st   key=<span class="id-key" id="id-k0">7f3a-91c2</span></div>
        <div class="k-tline" id="id-r1">retry key=<span class="id-key" id="id-k1">7f3a-91c2</span></div>
        <div class="k-tline" id="id-r2">retry key=<span class="id-key" id="id-k2">7f3a-91c2</span></div>
      </div>
      <svg class="k-path" id="id-link" viewBox="0 0 66 4"><line x1="0" y1="2" x2="66" y2="2"/></svg>
      <div class="k-packet" id="id-pk"></div>
      <div class="k-card k-term" id="id-srv">
        <div class="k-head"><span class="k-dot o"></span>server</div>
        <div class="k-label">seen keys</div>
        <div class="k-tline" id="id-s0"><span class="id-key" id="id-sk">7f3a-91c2</span></div>
        <div class="k-tline" id="id-s1">→ #4821</div>
      </div>
      <div class="k-stamp" id="id-seen">SEEN ✓</div>
      <div class="k-card k-term" id="id-res">
        <div class="k-head"><span class="k-dot g"></span>response<span class="k-right">debits: 1</span></div>
        <div class="k-tline" id="id-o1">200 OK · stored result, not re-run</div>
        <div class="k-tline" id="id-o2">booking #4821 · <span id="id-once">charged once</span></div>
      </div>
    `,
    js: `
      K.pop(tl, "#id-req", 3.0);
      K.type(tl, "#id-r0", 3.3, { cps: 14, blink: false });
      K.pop(tl, "#id-srv", 4.4);
      K.draw(tl, "#id-link", 4.7, 0.3);
      K.travel(tl, "#id-pk", 5.0, 0.5, [0, 0], [66, 0]);
      K.type(tl, "#id-s0", 5.6, { cps: 20, blink: false });
      K.type(tl, "#id-s1", 6.3, { cps: 20, blink: false });
      // Retries reuse the very same key: sweep it to show it is identical.
      K.type(tl, "#id-r1", 7.0, { cps: 28, blink: false });
      K.sweep(tl, "#id-k1", 7.7, "#ff8a3d");
      K.travel(tl, "#id-pk", 8.1, 0.5, [0, 0], [66, 0], "#ff8a3d");
      K.type(tl, "#id-r2", 8.5, { cps: 28, blink: false });
      K.sweep(tl, "#id-k2", 9.2, "#ff8a3d");
      K.travel(tl, "#id-pk", 9.6, 0.5, [0, 0], [66, 0], "#ff8a3d");
      K.sweep(tl, "#id-sk", 10.3, "#3ddc97");
      K.slam(tl, "#id-seen", 10.6, -4);
      K.pop(tl, "#id-res", 12.86);
      K.type(tl, "#id-o1", 13.1, { cps: 24, blink: false });
      K.type(tl, "#id-o2", 14.6, { cps: 22 });
      K.sweep(tl, "#id-once", 15.8, "#3ddc97");
    `,
  },

  // --------------------------------------------------------------- recap
  recap: {
    title: "Ship the safeguards",
    css: `
      .rc-step { left: 0; width: 340px; height: 84px; padding: 22px 24px; }
      .rc-step .k-head { color: var(--ink); font-size: 28px; letter-spacing: 0; }
      .rc-step .k-right { color: var(--muted); }
      #rc-s0 { top: 0; } #rc-s1 { top: 112px; } #rc-s2 { top: 224px; } #rc-s3 { top: 336px; }
      #rc-links { left: 168px; top: 84px; width: 4px; height: 280px; }
      #rc-join { left: 340px; top: 210px; width: 60px; height: 4px; }
      #rc-ticket { left: 400px; top: 40px; width: 356px; height: 340px; border-style: dashed; }
      #rc-time { font-size: 72px; font-weight: 700; line-height: 92px; margin-top: 16px; }
      #rc-ticket .k-label { margin-top: 4px; }
      #rc-ok { left: 470px; top: 300px; border-color: var(--green); color: var(--green); }
      #rc-note { left: 0; top: 448px; width: 756px; }
    `,
    html: `
      <div class="k-card rc-step" id="rc-s0"><div class="k-head"><span class="k-dot"></span>timeout<span class="k-right">10s</span></div></div>
      <div class="k-card rc-step" id="rc-s1"><div class="k-head"><span class="k-dot"></span>retry<span class="k-right">max 3</span></div></div>
      <div class="k-card rc-step" id="rc-s2"><div class="k-head"><span class="k-dot o"></span>backoff<span class="k-right">1·2·4s</span></div></div>
      <div class="k-card rc-step" id="rc-s3"><div class="k-head"><span class="k-dot g"></span>idem. key<span class="k-right">reuse</span></div></div>
      <svg class="k-path" id="rc-links" viewBox="0 0 4 280"><path d="M2 0 V28 M2 112 V140 M2 224 V252"/></svg>
      <svg class="k-path" id="rc-join" viewBox="0 0 60 4"><line x1="0" y1="2" x2="60" y2="2"/></svg>
      <div class="k-card" id="rc-ticket">
        <div class="k-head"><span class="k-dot o"></span>ticket #4821</div>
        <div id="rc-time">08:12</div>
        <div class="k-label">CENTRAL → HARBOUR</div>
        <div class="k-label">1 adult · ₹30</div>
      </div>
      <div class="k-stamp" id="rc-ok">CONFIRMED</div>
      <div class="k-note" id="rc-note">Govt app devs: please ship these!</div>
    `,
    js: `
      K.pop(tl, "#rc-s0", 0.6);
      K.draw(tl, "#rc-links", 0.9, 3.0, "y");
      K.pop(tl, "#rc-s1", 1.5);
      K.pop(tl, "#rc-s2", 2.4);
      K.pop(tl, "#rc-s3", 3.3);
      K.draw(tl, "#rc-join", 4.6, 0.4);
      K.pop(tl, "#rc-ticket", 4.99, 0.7);
      K.slam(tl, "#rc-ok", 6.0, -5);
      K.slam(tl, "#rc-note", 8.02, -1.5);
      // Each safeguard lights up in turn, then the ticket's dashed edge goes solid.
      ["#rc-s0", "#rc-s1", "#rc-s2", "#rc-s3"].forEach((id, i) =>
        tl.to(id, { borderColor: "#3ddc97", duration: 0.2 }, 9.2 + i * 0.45));
      tl.to("#rc-ticket", { borderColor: "#3ddc97", borderStyle: "solid", duration: 0.2 }, 11.1);
    `,
  },

  // --------------------------------------------------------------- outro
  outro: {
    title: "Before you go",
    noClose: true,
    css: `
      #ou-term { left: 0; top: 40px; width: 756px; height: 300px; }
      #ou-term .k-tline { font-size: 32px; line-height: 64px; }
      #ou-term .k-tline:first-of-type { margin-top: 24px; }
      .ou-p { color: var(--orange); }
      #ou-bye { color: var(--green); }
      #ou-note { left: 0; top: 390px; width: 756px; font-size: 40px; }
    `,
    html: `
      <div class="k-card k-term" id="ou-term">
        <div class="k-head"><span class="k-dot o"></span><span class="k-dot"></span><span class="k-dot g"></span>~/api-101</div>
        <div class="k-tline" id="ou-l1">$ like &amp;&amp; comment &amp;&amp; save</div>
        <div class="k-tline" id="ou-l2">$ follow --for-more</div>
        <div class="k-tline" id="ou-bye">✓ see you in the next one</div>
      </div>
      <div class="k-note" id="ou-note">See you in the next one</div>
    `,
    js: `
      K.pop(tl, "#ou-term", 0.4);
      K.type(tl, "#ou-l1", 0.8, { cps: 14, blink: false });
      K.type(tl, "#ou-l2", 4.6, { cps: 14, blink: false });
      K.type(tl, "#ou-bye", 7.2, { cps: 18 });
      K.slam(tl, "#ou-note", 8.4, -2);
    `,
  },
};
