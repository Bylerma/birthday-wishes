/* ================================
   1) LOADER + HERO TYPING EFFECT
================================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const heroTitle = document.getElementById("heroTitle");

  // Save original text, then type it
  const fullText = heroTitle.textContent.trim();
  heroTitle.textContent = "";
  heroTitle.classList.add("reveal");

  let i = 0;
  const typeInterval = setInterval(() => {
    heroTitle.textContent += fullText[i];
    i++;
    if (i >= fullText.length) clearInterval(typeInterval);
  }, 60);

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 900);
});

/* ================================
   2) SMOOTH SCROLL WITH EASING
================================== */
function smoothScrollTo(target, duration = 900) {
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + start;
  const distance = end - start;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutQuad(progress));
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

document.getElementById("startBtn").addEventListener("click", () => {
  smoothScrollTo(document.getElementById("timeline"));
});

/* ================================
   3) INTERSECTION OBSERVER + STAGGER
================================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add("show"), delay);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".timeline-item").forEach((item, idx) => {
  item.dataset.delay = idx * 150; // stagger
  observer.observe(item);
});

document.querySelectorAll(".wish-line").forEach((line, idx) => {
  line.dataset.delay = idx * 180; // stagger
  observer.observe(line);
});

/* ================================
   4) PARALLAX MOTION
================================== */
const parallaxElements = [
  document.querySelector(".hero-card"),
  document.querySelector(".wishes-card"),
  document.querySelector(".finale-card")
].filter(Boolean);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  parallaxElements.forEach((el, i) => {
    const speed = (i + 1) * 0.04;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

/* ================================
   5) ADVANCED CONFETTI (GRAVITY+WIND)
================================== */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let confettiActive = false;
let wind = 0.02;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burstConfetti(x, y, count = 100){
  for(let i=0; i<count; i++){
    confetti.push({
      x, y,
      size: Math.random() * 6 + 4,
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * -5 - 2,
      color: `hsl(${Math.random()*360}, 90%, 60%)`,
      rotation: Math.random() * 360,
      gravity: 0.08 + Math.random() * 0.05
    });
  }
}

function animateConfetti(){
  if(!confettiActive) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  confetti.forEach((p, idx) => {
    p.speedY += p.gravity;
    p.speedX += wind;

    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += 0.1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
    ctx.restore();

    if (p.y > canvas.height + 30) confetti.splice(idx, 1);
  });

  requestAnimationFrame(animateConfetti);
}

// Confetti on click
window.addEventListener("click", (e) => {
  if(confettiActive){
    burstConfetti(e.clientX, e.clientY, 80);
  }
});

// Trigger confetti at finale
const finale = document.getElementById("finale");
const finaleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !confettiActive){
      confettiActive = true;
      canvas.style.display = "block";
      burstConfetti(window.innerWidth/2, window.innerHeight/2, 180);
      animateConfetti();
    }
  });
}, { threshold: 0.5 });

finaleObserver.observe(finale);

/* ================================
   6) FLOATING WISH PARTICLES
================================== */
const wishesSection = document.getElementById("wishes");
const wishCanvas = document.createElement("canvas");
wishCanvas.id = "wish-canvas";
wishCanvas.style.position = "absolute";
wishCanvas.style.inset = 0;
wishCanvas.style.pointerEvents = "none";
wishesSection.appendChild(wishCanvas);

const wctx = wishCanvas.getContext("2d");
let wishParticles = [];

function resizeWishCanvas(){
  wishCanvas.width = wishesSection.offsetWidth;
  wishCanvas.height = wishesSection.offsetHeight;
}
window.addEventListener("resize", resizeWishCanvas);
resizeWishCanvas();

function createWishParticles(){
  wishParticles = Array.from({length: 40}, () => ({
    x: Math.random() * wishCanvas.width,
    y: Math.random() * wishCanvas.height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.6 + 0.2
  }));
}
createWishParticles();

function animateWishParticles(){
  wctx.clearRect(0,0,wishCanvas.width, wishCanvas.height);
  wishParticles.forEach(p => {
    p.y -= p.speed;
    if (p.y < -10) p.y = wishCanvas.height + 10;

    wctx.beginPath();
    wctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    wctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    wctx.fill();
  });
  requestAnimationFrame(animateWishParticles);
}
animateWishParticles();

/* ================================
   7) OPTIONAL AUDIO TRIGGER
================================== */
// If you add <audio id="bg-audio" src="YOUR_AUDIO.mp3" loop></audio> to HTML,
// this will start music on first user interaction.
const bgAudio = document.getElementById("bg-audio");
if (bgAudio) {
  const startAudio = () => {
    bgAudio.play().catch(()=>{});
    window.removeEventListener("click", startAudio);
    window.removeEventListener("keydown", startAudio);
  };
  window.addEventListener("click", startAudio);
  window.addEventListener("keydown", startAudio);
}
