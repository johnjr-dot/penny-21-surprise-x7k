/* ==========================================================
   EDIT THESE LISTS TO MAKE THE SITE YOURS
   ========================================================== */

// Memory lane: add more photos to /images and add a line here.
// "when" is optional (e.g. "Our first date, March 2025").
const MEMORIES = [
  { img: "butterfly.jpg",    alt: "Penny with a small, knowing smile",    caption: "That small, knowing smile.", when: "" },
  { img: "sweater-grid.jpg", alt: "Four playful poses of Penny",          caption: "Four poses, zero rehearsal. All my favourite.", when: "" },
  { img: "mirror.jpg",       alt: "Penny dressed up in a mirror selfie",  caption: "All dressed up, soft and sparkly.", when: "" },
  { img: "thumbsup.jpg",     alt: "Penny with two thumbs up and a pout",  caption: "Paint on the shirt, thumbs up, zero worries.", when: "" },
];

// Goofy side: tap a photo and the caption changes. Add as many captions as you like.
const GOOFY = [
  { img: "goofy-eyes.jpg",    alt: "Penny giving a dramatic side-eye",       tilt: -3,  captions: ["Side-eye, activated", "Who, me?", "Caught mid-scheme"] },
  { img: "goofy-pout.jpg",    alt: "Penny pouting with her hand on her cheek", tilt: 2,   captions: ["Peak pout", "Serious business", "The kiss face of destiny"] },
  { img: "goofy-sideeye.jpg", alt: "Penny peeking with a sideways glance",   tilt: -1.5, captions: ["Plotting something", "Up to no good", "That look means snacks"] },
];

// Dance floor photos (they bob when the music plays).
const DANCE_PHOTOS = [
  { img: "laugh.jpg",       alt: "Penny laughing with a peace sign",      caption: "Blurry, but iconic" },
  { img: "hoodie-grid.jpg", alt: "Four silly faces of Penny in a hoodie", caption: "Four faces in four seconds" },
];

// Exactly 21 reasons. Replace any of these with your own words.
const REASONS = [
  "You're kind in ways nobody asked you to be.",
  "Your voice is soft, and everything feels calmer when you talk.",
  "You can turn a plain day into a favourite one.",
  "The way you smile when you think nobody's watching.",
  "You light up when you dance.",
  "You sing like nobody's listening, and it's my favourite sound.",
  "You love flowers, and you notice the small things.",
  "You're shy at first, then you show the funniest side of you.",
  "A cute date with you beats any fancy plan.",
  "You make people feel safe around you.",
  "Your laugh is contagious.",
  "You care quietly and completely.",
  "Purple looks like it was invented for you.",
  "You're gentle, even when things are hard.",
  "You make me want to be softer too.",
  "Your pouts and your peace signs.",
  "You keep growing into someone wonderful.",
  "You make memories worth keeping.",
  "I can be completely myself around you.",
  "Every day with you is a little brighter.",
  "Because you're you, Penny.",
];

// Music: drop an mp3 into /audio and match the file name here.
const SONG = { file: "audio/her-song.mp3", title: "Her song" };

/* ==========================================================
   Code below this line can stay as it is
   ========================================================== */

const $ = (s) => document.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----- Envelope ----- */
const envelope = $("#envelope");
envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  $("#hint").textContent = "";
  startPetals();
  setTimeout(() => {
    $("#hero").classList.add("opened");
    document.body.classList.remove("locked");
  }, 1500);
});

/* ----- Falling petals ----- */
function startPetals() {
  if (reduceMotion) return;
  const box = $("#petals");
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    const size = 10 + Math.random() * 14;
    p.className = "petal";
    p.style.cssText =
      `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 12}s;` +
      `--drift:${(Math.random() - 0.5) * 160}px`;
    box.appendChild(p);
  }
}

/* ----- Render sections ----- */
$("#lane").innerHTML = MEMORIES.map((m) => `
  <li>
    <figure class="polaroid">
      <img src="images/${m.img}" alt="${m.alt}" loading="lazy">
      <figcaption>${m.when ? `<span class="when">${m.when}</span>` : ""}${m.caption}</figcaption>
    </figure>
  </li>`).join("");

$("#pile").innerHTML = GOOFY.map((g, i) => `
  <figure class="snap" style="--tilt:${g.tilt}deg" data-i="${i}" data-c="0" tabindex="0" role="button" aria-label="Tap to change the caption">
    <img src="images/${g.img}" alt="${g.alt}" loading="lazy">
    <figcaption>${g.captions[0]}</figcaption>
  </figure>`).join("");

$("#danceRow").innerHTML = DANCE_PHOTOS.map((d) => `
  <figure class="polaroid">
    <img src="images/${d.img}" alt="${d.alt}" loading="lazy">
    <figcaption>${d.caption}</figcaption>
  </figure>`).join("");

/* ----- Goofy: tap to change the caption ----- */
function cycleCaption(snap) {
  const g = GOOFY[Number(snap.dataset.i)];
  const next = (Number(snap.dataset.c) + 1) % g.captions.length;
  snap.dataset.c = next;
  snap.querySelector("figcaption").textContent = g.captions[next];
  snap.classList.remove("wiggle");
  void snap.offsetWidth;
  snap.classList.add("wiggle");
}
$("#pile").addEventListener("click", (e) => { const s = e.target.closest(".snap"); if (s) cycleCaption(s); });
$("#pile").addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const s = e.target.closest(".snap");
  if (s) { e.preventDefault(); cycleCaption(s); }
});

/* ----- 21 reasons ----- */
const dialog = $("#reasonDialog");
const seen = new Set();
$("#reasons").innerHTML = REASONS.map((_, i) =>
  `<button class="reason-btn" style="--i:${i}" data-i="${i}" aria-label="Reason ${i + 1}">${i + 1}</button>`).join("");

$("#reasons").addEventListener("click", (e) => {
  const btn = e.target.closest(".reason-btn");
  if (!btn) return;
  const i = Number(btn.dataset.i);
  $("#reasonNum").textContent = i + 1;
  $("#reasonText").textContent = REASONS[i];
  btn.classList.add("seen");
  seen.add(i);
  $("#count").textContent = seen.size === REASONS.length
    ? "You opened all 21. Happy birthday, Penny."
    : `${seen.size} of ${REASONS.length} opened`;
  dialog.showModal();
});
$("#reasonClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

/* ----- Section openings: each section reveals in its own way ----- */
const revealMap = [
  ...document.querySelectorAll(".lane li"),   // slide in from the sides
  ...document.querySelectorAll(".snap"),      // pop in with a bounce
  $("#reasons"),                              // flowers bloom one by one
  $("#music"),                                // spotlights sweep in
  $("#finale"),                               // curtains open
];
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.25 });
  revealMap.forEach((el) => io.observe(el));
} else {
  revealMap.forEach((el) => el.classList.add("in"));
}

/* ----- Heart bridges: a heart drifts across at every section change ----- */
const bridges = [...document.querySelectorAll(".bridge")];
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
bridges.forEach((b) => {
  ["h3", "h2", "h1"].forEach((c) => {
    const h = document.createElement("div");
    h.className = `heart ${c}`;
    h.innerHTML = HEART;
    b.prepend(h);
  });
});

const LAGS = { h1: 0, h2: 0.07, h3: 0.14 };
function updateBridges() {
  if (reduceMotion) return;
  const vh = innerHeight;
  bridges.forEach((b) => {
    const r = b.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    const prog = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    b.style.setProperty("--text-o", Math.max(0, 1 - Math.abs(prog - 0.5) * 3.2).toFixed(2));
    b.querySelectorAll(".heart").forEach((h) => {
      const key = h.classList.contains("h1") ? "h1" : h.classList.contains("h2") ? "h2" : "h3";
      const p = Math.min(1, Math.max(0, prog - LAGS[key]));
      const x = -20 + p * 130;                       // glides across the screen
      const y = Math.sin(p * Math.PI * 2) * 16;      // gentle wave
      const s = key === "h1" ? 0.6 + Math.sin(p * Math.PI) * 2.2 : 1 + Math.sin(p * Math.PI) * 0.6;
      const rot = Math.sin(p * 7) * 14;
      h.style.transform = `translate(${x}vw, ${y}vh) scale(${s.toFixed(2)}) rotate(${rot.toFixed(1)}deg)`;
    });
  });
}
addEventListener("scroll", () => requestAnimationFrame(updateBridges), { passive: true });
addEventListener("resize", updateBridges);
updateBridges();

/* ----- Music + dance mode ----- */
const audio = new Audio(SONG.file);
audio.loop = true;
let noteTimer = null;

function floatNote() {
  const n = document.createElement("span");
  n.className = "note-float";
  n.textContent = Math.random() > 0.5 ? "♪" : "♫";
  n.style.left = Math.random() * 95 + "%";
  n.style.fontSize = 18 + Math.random() * 22 + "px";
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}

$("#danceBtn").addEventListener("click", (e) => {
  const on = !document.body.classList.contains("dance");
  document.body.classList.toggle("dance", on);
  e.currentTarget.setAttribute("aria-pressed", on);
  e.currentTarget.textContent = on ? "Pause" : "Play and dance";
  if (on) {
    audio.play().then(() => { $("#songNote").textContent = `Now playing: ${SONG.title}`; })
      .catch(() => { $("#songNote").textContent = "Add her song to the audio folder to hear music."; });
    if (!reduceMotion) noteTimer = setInterval(floatNote, 600);
  } else {
    audio.pause();
    clearInterval(noteTimer);
    $("#songNote").textContent = "";
  }
});

/* ----- Cake ----- */
$("#candles").innerHTML = '<span class="candle"><i class="flame"></i></span>'.repeat(21);

$("#blowBtn").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  document.querySelectorAll(".flame").forEach((f, i) => setTimeout(() => f.classList.add("out"), i * 70));
  setTimeout(() => {
    btn.hidden = true;
    $("#letter").hidden = false;
    $("#letter").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    confetti();
  }, 21 * 70 + 500);
});

/* ----- Confetti ----- */
function confetti() {
  if (reduceMotion) return;
  const c = $("#confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = ["#7c3aed", "#b983ff", "#ff8fd8", "#ffc857", "#ffffff"];
  const bits = Array.from({ length: 160 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
    r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    bits.forEach((b) => {
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.color; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    });
    if (++frames < 260) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
