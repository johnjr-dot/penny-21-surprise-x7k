/* ==========================================================
   EDIT THESE LISTS TO MAKE THE SITE YOURS
   ========================================================== */

// Memory lane: add more photos to /images and add a line here.
// "when" is optional (e.g. "Our first date, March 2025").
const MEMORIES = [
  { img: "butterfly.jpg",    alt: "Penny with a small, knowing smile", caption: "That small, knowing smile.", when: "" },
  { img: "sweater-grid.jpg", alt: "Four playful poses of Penny",       caption: "Four poses, zero rehearsal. All my favourite.", when: "" },
  { img: "mirror.jpg",       alt: "Penny dressed up in a mirror selfie", caption: "All dressed up, soft and sparkly.", when: "" },
];

// Silly photos for the banter section.
const BANTER = [
  { img: "laugh.jpg",       alt: "Penny laughing with a peace sign",      caption: "Blurry, but iconic", tilt: -3 },
  { img: "thumbsup.jpg",    alt: "Penny with two thumbs up and a pout",   caption: "Wearable art, apparently", tilt: 2 },
  { img: "hoodie-grid.jpg", alt: "Four silly faces of Penny in a hoodie", caption: "Four faces in four seconds", tilt: -1.5 },
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

/* ----- Memory lane ----- */
$("#lane").innerHTML = MEMORIES.map((m) => `
  <li>
    <figure class="polaroid">
      <img src="images/${m.img}" alt="${m.alt}" loading="lazy">
      <figcaption>${m.when ? `<span class="when">${m.when}</span>` : ""}${m.caption}</figcaption>
    </figure>
  </li>`).join("");

/* ----- Banter ----- */
$("#collage").innerHTML = BANTER.map((b) => `
  <figure class="snap" style="--tilt:${b.tilt}deg">
    <img src="images/${b.img}" alt="${b.alt}" loading="lazy">
    <figcaption>${b.caption}</figcaption>
  </figure>`).join("");

/* ----- 21 reasons ----- */
const dialog = $("#reasonDialog");
const seen = new Set();
$("#reasons").innerHTML = REASONS.map((_, i) =>
  `<button class="reason-btn" data-i="${i}" aria-label="Reason ${i + 1}">${i + 1}</button>`).join("");

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
