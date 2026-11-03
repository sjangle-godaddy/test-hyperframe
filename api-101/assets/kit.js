// Shared, deterministic motion helpers. Every helper only adds tweens to the
// timeline it is given; nothing reads the clock.
window.KIT = (function () {
  const q = (x) => (typeof x === "string" ? document.querySelector(x) : x);
  const rnd = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const IR = { immediateRender: false };

  // Split every text node under el into character spans, keeping nested
  // elements (so a typed line can still hold a span that gets swept later).
  function chars(el) {
    el = q(el);
    if (el.__ch) return el.__ch;
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((c) => {
            const s = document.createElement("span");
            s.className = "k-ch";
            s.textContent = c;
            frag.appendChild(s);
            out.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    el.__ch = out;
    return out;
  }

  // The character spans already made inside el by an ancestor's split.
  function sub(el) {
    el = q(el);
    return el.__ch || (el.querySelector(".k-ch") ? (el.__ch = [...el.querySelectorAll(".k-ch")]) : chars(el));
  }

  // Typewriter: uneven key intervals like a real hand; caret blinks 3x then rests.
  function type(tl, el, at, opts = {}) {
    const cps = opts.cps || 16;
    const cs = chars(el);
    let t = at;
    cs.forEach((c, i) => {
      tl.set(c, { opacity: 1, "--cur": 1 }, t);
      if (i > 0) tl.set(cs[i - 1], { "--cur": 0 }, t);
      t += (1 / cps) * (0.55 + 0.9 * rnd(i + cs.length * 7));
    });
    const last = cs[cs.length - 1];
    if (opts.blink === false) {
      tl.set(last, { "--cur": 0 }, t + 0.2);
    } else {
      tl.to(last, { "--cur": 0, duration: 0.4, ease: "steps(1)", repeat: 5, yoyo: true, ...IR }, t);
      tl.set(last, { "--cur": 0 }, t + 2.45);
    }
    return t;
  }

  // Backspace a typed string, last character first.
  function erase(tl, el, at, cps = 30) {
    const cs = chars(el);
    let t = at;
    for (let i = cs.length - 1; i >= 0; i--) {
      tl.set(cs[i], { opacity: 0, "--cur": 0 }, t);
      if (i > 0) tl.set(cs[i - 1], { "--cur": 1 }, t);
      t += 1 / cps;
    }
    return t;
  }

  // Character-highlight sweep: each character takes the colour in turn.
  function sweep(tl, el, at, color, gap = 0.035) {
    const cs = sub(el);
    cs.forEach((c, i) => {
      tl.set(c, { opacity: 1 }, at);
      tl.to(c, { color, duration: 0.12, ease: "power1.out", ...IR }, at + i * gap);
    });
    return at + cs.length * gap;
  }

  function count(tl, el, at, dur, from, to, fmt, ease = "none") {
    el = q(el);
    const p = { v: from };
    if (!el.__counted) { el.textContent = fmt(from); el.__counted = true; }
    tl.to(p, { v: to, duration: dur, ease, ...IR, onUpdate: () => { el.textContent = fmt(p.v); } }, at);
  }

  // Scene opening: container fades in with a subtle scale bounce.
  function open(tl, el, at = 0, fromOpacity = 0) {
    tl.fromTo(q(el), { opacity: fromOpacity, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.75, ease: "back.out(1.6)", ...IR }, at);
  }
  // A card module floating in: fade with a small bounce.
  function pop(tl, el, at, d = 0.55) {
    tl.fromTo(q(el), { opacity: 0, scale: 0.9, y: 14 },
      { opacity: 1, scale: 1, y: 0, duration: d, ease: "back.out(1.8)", ...IR }, at);
  }
  // Scene close: blur swap, the ground never cuts.
  function close(tl, el, at) {
    tl.fromTo(q(el), { opacity: 1, filter: "blur(0px)" },
      { opacity: 0, filter: "blur(8px)", duration: 0.3, ease: "power2.in", ...IR }, at);
  }
  // Reveal a dashed path left-to-right (dir "x") or top-to-bottom (dir "y").
  function draw(tl, el, at, d = 0.5, dir = "x") {
    const from = dir === "x" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 100% 0%)";
    tl.fromTo(q(el), { clipPath: from, opacity: 1 },
      { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: d, ease: "power2.inOut", ...IR }, at);
  }
  function underline(tl, el, at, d = 0.45) {
    el = q(el);
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    tl.fromTo(el, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease: "power2.out", ...IR }, at);
  }
  // A data packet travelling along a path link.
  function travel(tl, el, at, d, a, b, color) {
    el = q(el);
    if (color) tl.set(el, { backgroundColor: color }, at);
    tl.fromTo(el, { x: a[0], y: a[1], opacity: 1, scale: 1 },
      { x: b[0], y: b[1], opacity: 1, scale: 1, duration: d, ease: "power1.inOut", ...IR }, at);
    tl.to(el, { opacity: 0, scale: 0.4, duration: 0.15, ease: "power2.in", ...IR }, at + d);
  }
  function slam(tl, el, at, rot = -4) {
    tl.fromTo(q(el), { opacity: 0, scale: 1.45, rotation: rot },
      { opacity: 1, scale: 1, rotation: rot, duration: 0.32, ease: "power4.out", ...IR }, at);
  }
  function shake(tl, el, at) {
    tl.fromTo(q(el), { x: 0 }, { x: 7, duration: 0.05, repeat: 7, yoyo: true, ease: "none", ...IR }, at);
  }
  // Swap two stacked elements instantly (a value or a label changing state).
  function swap(tl, out, inn, at) {
    tl.set(q(out), { opacity: 0 }, at);
    tl.set(q(inn), { opacity: 1 }, at);
  }

  return { q, rnd, IR, chars, type, erase, sweep, count, open, pop, close, draw, underline, travel, slam, shake, swap };
})();
