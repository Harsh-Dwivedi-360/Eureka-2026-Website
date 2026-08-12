/* === NAVBAR SCROLL === */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const backTop = document.getElementById('back-top');
const floatCta = document.getElementById('float-cta');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  // Navbar
  navbar.classList.toggle('scrolled', scrollY > 60);
  // Progress bar
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollY / docH * 100) + '%';
  // Back to top + float CTA
  if(scrollY > 400){ backTop.classList.add('show'); floatCta.classList.add('show'); }
  else { backTop.classList.remove('show'); floatCta.classList.remove('show'); }
});

/* === HAMBURGER === */
const ham = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (ham && mobileMenu) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* === ACTIVE NAV === */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if(active) active.classList.add('active');
    }
  });
}, { threshold: 0, rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

/* === COUNTDOWN (Target: Aug 20, 2026) === */
function updateCountdown(){
  const target = new Date("2026-08-20T09:00:00").getTime();
  const now = Date.now();
  const diff = target - now;
  if(diff <= 0){
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* === GLOBAL CANVAS PARTICLES (all sections) === */
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'global-particles';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:0;opacity:0.7;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS_GOLD = ['rgba(245,158,11,VAL)','rgba(251,191,36,VAL)','rgba(253,230,138,VAL)'];
  const COLORS_CYAN = ['rgba(0,212,255,VAL)','rgba(56,189,248,VAL)','rgba(0,180,220,VAL)'];

  // Create dots
  const dots = [];
  const COUNT = 60;
  for(let i = 0; i < COUNT; i++){
    const isGold = i < COUNT * 0.6;
    const palette = isGold ? COLORS_GOLD : COLORS_CYAN;
    const colorTemplate = palette[Math.floor(Math.random() * palette.length)];
    const alpha = (Math.random() * 0.5 + 0.2).toFixed(2);
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: colorTemplate.replace('VAL', alpha),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      glow: Math.random() < 0.25  // 25% have glow effect
    });
  }

  function drawDot(d){
    d.pulse += d.pulseSpeed;
    const r = Math.max(0.1, d.r + Math.sin(d.pulse) * 0.6);

    if(d.glow){
      ctx.shadowBlur = 8;
      ctx.shadowColor = d.color;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.fillStyle = d.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      // Wrap around edges
      if(d.x < -5) d.x = W + 5;
      if(d.x > W + 5) d.x = -5;
      if(d.y < -5) d.y = H + 5;
      if(d.y > H + 5) d.y = -5;
      drawDot(d);
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* Particles handled by global canvas above */

/* === SCROLL REVEAL === */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* === STAT COUNTER === */
let statsDone = false;
const statsRow = document.getElementById('stats-row');
const statsObs = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting && !statsDone){
    statsDone = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();
      function tick(now){
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if(progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }
}, { threshold: 0.3 });
statsObs.observe(statsRow);

/* === FAQ === */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!isOpen) item.classList.add('open');
  });
});

/* === REGISTRATION === */
async function submitReg() {

    const team_name = document.getElementById("f-team").value;
    const leader_name = document.getElementById("f-leader").value;
    const leader_email = document.getElementById("f-email").value;
    const leader_phone = document.getElementById("f-phone").value;
    const college_name = document.getElementById("f-college").value;
    const ltce_roll_no = document.getElementById("f-roll").value;
    const department = document.getElementById("f-dept").value;
    const team_size = document.getElementById("f-size").value;
    const project_title = document.getElementById("f-proj").value;
    const project_category = document.getElementById("f-cat").value;
    const project_description = document.getElementById("f-desc").value;
    const github_portfolio = document.getElementById("f-git").value;

    const { error } = await supabaseClient
        .from("Registrations")
        .insert([
            {
                team_name,
                leader_name,
                leader_email,
                leader_phone,
                college_name,
                ltce_roll_no,
                department,
                team_size,
                project_title,
                project_category,
                project_description,
                github_portfolio
            }
        ]);

    if (error) {
    console.log("SUPABASE ERROR:", error);
    alert(error.message);
    return;
}

    alert("Registration Successful 🎉");

    document.getElementById("reg-form-wrap").reset?.();

}

/* === CONTACT === */
function sendMsg(){
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg = document.getElementById('c-msg').value.trim();
  if(!name||!email||!msg){ alert('Please fill all contact fields.'); return; }
  document.getElementById('c-success').style.display='block';
  document.getElementById('c-name').value='';
  document.getElementById('c-email').value='';
  document.getElementById('c-msg').value='';
}