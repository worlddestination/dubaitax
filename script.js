/* ══════════════════════════════════════════════════════════
   EMUNIB — MAIN SCRIPT  |  v3.0
   Cursor · Particles · 3D Card · Nav · Ticker · Stats
   Count-up · Scroll Reveal · Parallax · Interactions
══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. CURSOR SYSTEM (Custom cursor fix)
───────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  // Show cursors only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) {
    document.body.style.cursor = 'auto';
    glow.style.display = 'none';
    dot.style.display  = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX   = mouseX;
  let dotY   = mouseY;
  let glowX  = mouseX;
  let glowY  = mouseY;
  let isHovering = false;
  let raf;

  // Track real mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Show/hide on window enter/leave
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
    dot.style.opacity  = '1';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    dot.style.opacity  = '0';
  });

  // Cursor hover effects on interactive elements
  const interactiveSelectors = 'a, button, [role="button"], input, select, textarea, .rate-pill, .svc-bento-card, .stat-card, .blog-post, .nav-link, .btn-cta-nav, .btn-primary, .btn-ghost, .amount-slider';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = true;
      dot.style.transform  = 'translate(-50%, -50%) scale(2.5)';
      dot.style.background = 'var(--pink)';
      dot.style.boxShadow  = '0 0 20px var(--pink), 0 0 40px rgba(255,45,120,0.4)';
      glow.style.background = 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = false;
      dot.style.transform  = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'var(--purple)';
      dot.style.boxShadow  = '0 0 10px var(--purple), 0 0 20px rgba(180,79,255,0.5)';
      glow.style.background = 'radial-gradient(circle, rgba(180,79,255,0.12) 0%, transparent 70%)';
    }
  });

  // Click ripple
  document.addEventListener('mousedown', () => {
    dot.style.transform = isHovering
      ? 'translate(-50%, -50%) scale(1.8)'
      : 'translate(-50%, -50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = isHovering
      ? 'translate(-50%, -50%) scale(2.5)'
      : 'translate(-50%, -50%) scale(1)';
  });

  // Smooth lag animation loop
  function animateCursor() {
    // Dot follows instantly
    dotX  += (mouseX - dotX)  * 0.92;
    dotY  += (mouseY - dotY)  * 0.92;
    // Glow follows with lag
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    dot.style.left  = dotX  + 'px';
    dot.style.top   = dotY  + 'px';
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';

    raf = requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();


/* ─────────────────────────────────────────
   2. WEBGL PARTICLE CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  const PARTICLE_COUNT = 120;
  const COLORS = ['#FF2D78', '#B44FFF', '#00F5FF', '#06FFA5', '#FFD166'];
  const MAX_CONNECT_DIST = 130;
  const MOUSE_REPEL_DIST = 160;
  const MOUSE_REPEL_FORCE = 0.18;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.15 + Math.random() * 0.4;
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      r:     0.8 + Math.random() * 1.8,
      alpha: 0.3 + Math.random() * 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `${r},${g},${b}`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    particles.forEach((p) => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL_DIST && dist > 0) {
        const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
        p.vx += (dx / dist) * force * MOUSE_REPEL_FORCE;
        p.vy += (dy / dist) * force * MOUSE_REPEL_FORCE;
      }

      // Velocity damping
      p.vx *= 0.992;
      p.vy *= 0.992;

      // Max speed cap
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 1.5) {
        p.vx = (p.vx / spd) * 1.5;
        p.vy = (p.vy / spd) * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Pulsing alpha
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(p.color)},${a})`;
      ctx.fill();

      // Glow
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grd.addColorStop(0, `rgba(${hexToRgb(p.color)},${a * 0.4})`);
      grd.addColorStop(1, `rgba(${hexToRgb(p.color)},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_CONNECT_DIST) {
          const alpha = (1 - d / MAX_CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(180,79,255,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach((p) => {
      if (p.x > W) p.x = Math.random() * W;
      if (p.y > H) p.y = Math.random() * H;
    });
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  draw();
})();


/* ─────────────────────────────────────────
   3. NAVIGATION — Scroll effect & Active link
───────────────────────────────────────── */
(function initNav() {
  const nav      = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.nav-active-indicator');
  if (!nav) return;

  // Scroll effect
  function onScroll() {
    if (window.scrollY > 40) {
      nav.style.background = 'none';
      const inner = nav.querySelector('.nav-inner');
      if (inner) {
        inner.style.background    = 'rgba(4,2,15,0.85)';
        inner.style.backdropFilter = 'blur(40px) saturate(200%)';
      }
    } else {
      const inner = nav.querySelector('.nav-inner');
      if (inner) {
        inner.style.background    = 'rgba(4,2,15,0.55)';
        inner.style.backdropFilter = 'blur(32px) saturate(200%)';
      }
    }

    // Highlight active section
    const sections = ['hero', 'services', 'how', 'blog'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${id}"]`);
        if (match) {
          match.classList.add('active');
          moveIndicator(match);
        }
      }
    });
  }

  // Move active indicator pill
  function moveIndicator(activeLink) {
    if (!indicator) return;
    const pill = document.querySelector('.nav-pill');
    if (!pill) return;
    const pillRect = pill.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicator.style.width  = linkRect.width  + 'px';
    indicator.style.left   = (linkRect.left - pillRect.left) + 'px';
  }

  // Init indicator on active link
  const active = document.querySelector('.nav-link.active');
  if (active) moveIndicator(active);

  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navLinks.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
      moveIndicator(this);
    });
    link.addEventListener('mouseenter', function () {
      moveIndicator(this);
    });
    link.addEventListener('mouseleave', function () {
      const currentActive = document.querySelector('.nav-link.active');
      if (currentActive) moveIndicator(currentActive);
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─────────────────────────────────────────
   4. HERO 3D CARD — Mouse tilt
───────────────────────────────────────── */
(function initHeroCard() {
  const scene = document.querySelector('.card-3d-scene');
  const wrap  = document.getElementById('heroCard3D');
  if (!scene || !wrap) return;

  let isHovering = false;
  let currentX = 0, currentY = 0;
  let targetX  = 0, targetY  = 0;

  scene.addEventListener('mousemove', (e) => {
    isHovering = true;
    const rect = scene.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    targetX = ((e.clientY - cy) / (rect.height / 2)) * -12;
    targetY = ((e.clientX - cx) / (rect.width  / 2)) *  14;
  });

  scene.addEventListener('mouseleave', () => {
    isHovering = false;
    targetX = 0;
    targetY = 0;
  });

  function animateCard() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    if (isHovering || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
      wrap.style.animation  = 'none';
      wrap.style.transform  = `perspective(1200px) rotateX(${currentX}deg) rotateY(${currentY}deg) translateY(-8px)`;
    } else {
      wrap.style.animation  = 'cardOrbit 9s ease-in-out infinite';
      wrap.style.transform  = '';
    }

    requestAnimationFrame(animateCard);
  }
  animateCard();
})();


/* ─────────────────────────────────────────
   5. VAT CALCULATOR (Hero Card)
───────────────────────────────────────── */
(function initHeroCalculator() {
  const slider      = document.getElementById('amountSlider');
  const amountDisp  = document.getElementById('amountDisplay');
  const riBase      = document.getElementById('riBase');
  const riTax       = document.getElementById('riTax');
  const riTotal     = document.getElementById('riTotal');
  const cardGlow    = document.getElementById('cardGlow');
  if (!slider) return;

  let currentRate  = 5;
  let currentColor = 'var(--pink)';
  let baseAmount   = 10000;

  const RATE_COLORS = {
    5: { color: 'var(--pink)',   glow: 'rgba(255,45,120,0.35)',  gradient: 'linear-gradient(90deg, var(--pink), var(--orange))' },
    9: { color: 'var(--purple)', glow: 'rgba(180,79,255,0.35)',  gradient: 'linear-gradient(90deg, var(--purple), var(--pink))' },
    0: { color: 'var(--cyan)',   glow: 'rgba(0,245,255,0.25)',   gradient: 'linear-gradient(90deg, var(--cyan), var(--green))' },
  };

  function formatAED(n) {
    return n.toLocaleString('en-AE') + ' AED';
  }

  function updateCalc() {
    const tax   = Math.round(baseAmount * currentRate / 100);
    const total = baseAmount + tax;
    const cfg   = RATE_COLORS[currentRate];

    // Animate number change
    animateNumber(amountDisp, parseInt(amountDisp.textContent.replace(/,/g, '') || 0), baseAmount, cfg.gradient);

    riBase.textContent  = formatAED(baseAmount);
    riTax.textContent   = formatAED(tax);
    riTotal.textContent = formatAED(total);

    if (cardGlow) {
      cardGlow.style.background = cfg.color;
      cardGlow.style.boxShadow  = `0 0 80px ${cfg.glow}`;
    }
  }

  function animateNumber(el, from, to, gradient) {
    if (!el) return;
    let start = null;
    const duration = 300;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * ease);
      el.textContent = current.toLocaleString('en-AE');
      if (gradient) {
        el.style.background             = gradient;
        el.style.webkitBackgroundClip   = 'text';
        el.style.webkitTextFillColor    = 'transparent';
        el.style.backgroundClip         = 'text';
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Slider input
  slider.addEventListener('input', function () {
    baseAmount = parseInt(this.value);
    updateSliderTrack(this);
    updateCalc();
  });

  function updateSliderTrack(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.background = `linear-gradient(90deg, var(--pink) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  }

  updateSliderTrack(slider);

  // Rate pill selection (called globally)
  window.selectRate = function (el) {
    document.querySelectorAll('.rate-pill').forEach((p) => p.classList.remove('active'));
    el.classList.add('active');
    currentRate  = parseInt(el.dataset.rate);
    currentColor = RATE_COLORS[currentRate].color;
    updateCalc();

    // Pulse animation
    el.style.transform = 'translateY(-6px) scale(1.06)';
    setTimeout(() => { el.style.transform = ''; }, 300);
  };

  updateCalc();
})();


/* ─────────────────────────────────────────
   6. COUNT-UP ANIMATION (Stats section)
───────────────────────────────────────── */
(function initCountUp() {
  // Pull counts from localStorage with persistent increment
  let bCount = parseInt(localStorage.getItem('emunib_bCount') || '1240') || 1240;
  let tCount = parseInt(localStorage.getItem('emunib_tCount') || '8500') || 8500;

  // Increment business count on each visit (max cap)
  bCount = Math.min(bCount + 1, 9999);
  localStorage.setItem('emunib_bCount', bCount);

  // Update data-target values
  document.querySelectorAll('.count-up').forEach((el) => {
    const t = el.dataset.target;
    if (t === '1240') el.dataset.target = bCount;
    if (t === '8500') el.dataset.target = tCount;
  });

  // Increment tool count on tool clicks
  ['vat.html', 'corporate-tax.html', 'ai-assistant.html', 'freezone.html'].forEach((href) => {
    const links = document.querySelectorAll(`a[href="${href}"]`);
    links.forEach((link) => {
      link.addEventListener('click', () => {
        const t = parseInt(localStorage.getItem('emunib_tCount') || '8500');
        localStorage.setItem('emunib_tCount', t + 1);
      });
    });
  });

  function countUp(el) {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    let current  = 0;
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      current = Math.round(target * eased);
      el.textContent = current.toLocaleString('en-AE');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger when stat section enters viewport
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.count-up').forEach(countUp);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();


/* ─────────────────────────────────────────
   7. SCROLL REVEAL — Intersection Observer
───────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = [
    { selector: '.stat-card',       delay: 80  },
    { selector: '.svc-bento-card',  delay: 100 },
    { selector: '.step-card',       delay: 120 },
    { selector: '.blog-post',       delay: 90  },
    { selector: '.section-header',  delay: 0   },
    { selector: '.cta-card',        delay: 0   },
  ];

  revealEls.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(48px)';
      el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms`;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      observer.observe(el);
    });
  });
})();


/* ─────────────────────────────────────────
   8. PARALLAX — Floating badges on hero
───────────────────────────────────────── */
(function initParallax() {
  const badges = document.querySelectorAll('.hero-float-badge');
  if (!badges.length) return;

  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      badges.forEach((b) => {
        const depth = parseFloat(b.dataset.depth) || 0.3;
        const mx    = dx * depth * 24;
        const my    = dy * depth * 18;
        b.style.transform = `translate(${mx}px, ${my}px)`;
      });

      // Orbs parallax (subtle)
      document.querySelectorAll('.orb').forEach((orb, i) => {
        const factor = (i + 1) * 0.4;
        orb.style.transform = `translate(${dx * factor * 15}px, ${dy * factor * 10}px)`;
      });

      ticking = false;
    });
  });
})();


/* ─────────────────────────────────────────
   9. TICKER — pause on hover
───────────────────────────────────────── */
(function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  const wrap = track.parentElement;
  wrap.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  wrap.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ─────────────────────────────────────────
   10. MINI BAR CHART — Animated bars
───────────────────────────────────────── */
(function initMiniChart() {
  const bars = document.querySelectorAll('.mc-bar');
  if (!bars.length) return;

  // Animate bars in on page load
  bars.forEach((bar, i) => {
    const targetHeight = bar.style.height;
    bar.style.height   = '0%';
    setTimeout(() => {
      bar.style.transition = `height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`;
      bar.style.height     = targetHeight;
    }, 800);
  });
})();


/* ─────────────────────────────────────────
   11. STAT CARD — Hover ripple effect
───────────────────────────────────────── */
(function initStatCards() {
  document.querySelectorAll('.stat-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();


/* ─────────────────────────────────────────
   12. SERVICE BENTO CARDS — Shine effect
───────────────────────────────────────── */
(function initBentoCards() {
  document.querySelectorAll('.svc-bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const pctX = (x / rect.width  * 100).toFixed(1);
      const pctY = (y / rect.height * 100).toFixed(1);

      card.style.background = `
        radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.04) 40%, transparent 70%),
        rgba(255,255,255,0.04)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'rgba(255,255,255,0.04)';
    });
  });
})();


/* ─────────────────────────────────────────
   13. BLOG POST — Read time estimator
───────────────────────────────────────── */
(function initBlogPosts() {
  document.querySelectorAll('.blog-post').forEach((post) => {
    const excerpt = post.querySelector('.bp-excerpt');
    if (!excerpt) return;

    const wordCount = excerpt.textContent.split(/\s+/).length * 10; // estimate full article
    const readTime  = Math.max(1, Math.round(wordCount / 200));

    const footer = post.querySelector('.bp-footer');
    if (footer) {
      const readTimeEl = document.createElement('span');
      readTimeEl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.2);font-weight:600;';
      readTimeEl.textContent   = `${readTime} min read`;
      footer.insertBefore(readTimeEl, footer.querySelector('.bp-read-more'));
    }
  });
})();


/* ─────────────────────────────────────────
   14. SMOOTH SCROLL — Internal anchor links
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   15. BUTTON — Click ripple animation
───────────────────────────────────────── */
(function initButtonRipples() {
  document.querySelectorAll('.btn-primary, .btn-cta-nav, .btn-ghost').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        background: rgba(255,255,255,0.15);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id    = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ─────────────────────────────────────────
   16. BACKGROUND ORBS — Scroll parallax
───────────────────────────────────────── */
(function initOrbParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let lastY  = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.08;
          const baseTransform = orb.style.transform || '';
          // Keep mouse offset if any, just add scroll
          const scrollOffset = lastY * speed;
          orb.dataset.scrollY = scrollOffset;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   17. SECTION HEADER — Gradient text animation
───────────────────────────────────────── */
(function initSectionHeaders() {
  const accents = document.querySelectorAll('.title-accent');
  accents.forEach((el, i) => {
    el.style.backgroundSize     = '300%';
    el.style.animation          = `gradShift ${4 + i * 0.5}s linear infinite`;
    el.style.animationDelay     = `${i * -1.2}s`;
  });
})();


/* ─────────────────────────────────────────
   18. FOOTER — Link hover underline effect
───────────────────────────────────────── */
(function initFooterLinks() {
  document.querySelectorAll('.footer-col a').forEach((link) => {
    link.style.position  = 'relative';
    link.style.display   = 'inline-block';

    const underline = document.createElement('span');
    underline.style.cssText = `
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: linear-gradient(90deg, var(--pink), var(--purple));
      transition: width 0.3s ease;
      display: block;
    `;
    link.appendChild(underline);

    link.addEventListener('mouseenter', () => { underline.style.width = '100%'; });
    link.addEventListener('mouseleave', () => { underline.style.width = '0'; });
  });
})();


/* ─────────────────────────────────────────
   19. MOBILE — Responsive nav hamburger
───────────────────────────────────────── */
(function initMobileNav() {
  const navInner = document.querySelector('.nav-inner');
  if (!navInner) return;

  // Only on mobile
  if (window.innerWidth > 640) return;

  // Create hamburger button
  const hamburger = document.createElement('button');
  hamburger.innerHTML = `
    <span style="display:block;width:22px;height:2px;background:#fff;border-radius:2px;margin:4px 0;transition:all 0.3s;"></span>
    <span style="display:block;width:22px;height:2px;background:#fff;border-radius:2px;margin:4px 0;transition:all 0.3s;"></span>
    <span style="display:block;width:22px;height:2px;background:#fff;border-radius:2px;margin:4px 0;transition:all 0.3s;"></span>
  `;
  hamburger.style.cssText = `
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;

  // Mobile dropdown menu
  const mobileMenu = document.createElement('div');
  mobileMenu.style.cssText = `
    position: fixed;
    top: 76px;
    left: 0; right: 0;
    background: rgba(4,2,15,0.97);
    backdrop-filter: blur(40px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 20px;
    display: none;
    flex-direction: column;
    gap: 4px;
    z-index: 199;
  `;

  const mobileLinks = [
    { text: 'Platform',   href: '#' },
    { text: 'Tools',      href: '#services' },
    { text: 'Insights',   href: '#blog' },
    { text: 'Company',    href: '#' },
    { text: 'Start Filing', href: 'vat.html', cta: true },
  ];

  mobileLinks.forEach(({ text, href, cta }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.style.cssText = cta
      ? `display:block;padding:14px 20px;border-radius:12px;background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;font-weight:700;font-size:15px;text-align:center;margin-top:8px;`
      : `display:block;padding:14px 20px;border-radius:12px;color:rgba(255,255,255,0.7);font-weight:600;font-size:15px;transition:background 0.2s;`;
    if (!cta) {
      a.addEventListener('mouseenter', () => { a.style.background = 'rgba(255,255,255,0.06)'; });
      a.addEventListener('mouseleave', () => { a.style.background = 'transparent'; });
    }
    mobileMenu.appendChild(a);
  });

  document.body.appendChild(mobileMenu);

  let menuOpen = false;
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.display = menuOpen ? 'flex' : 'none';
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.style.display = 'none';
      hamburger.querySelectorAll('span').forEach((s) => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });

  const navRight = navInner.querySelector('.nav-right');
  if (navRight) navRight.appendChild(hamburger);
})();


/* ─────────────────────────────────────────
   20. PAGE LOAD — Entry animation sequence
───────────────────────────────────────── */
(function initPageLoad() {
  // Inject page-load overlay
  const overlay = document.createElement('div');
  overlay.id = 'pageLoadOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #04020F;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.6s ease, transform 0.6s ease;
  `;

  // Logo mark inside loader
  overlay.innerHTML = `
    <div style="text-align:center;">
      <div style="
        width:60px;height:60px;border-radius:20px;
        background:linear-gradient(135deg,#B44FFF,#FF2D78,#00F5FF);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 16px;
        animation:loaderPulse 1s ease-in-out infinite;
        box-shadow:0 0 40px rgba(180,79,255,0.5);
      ">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" width="28" height="28">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div style="color:rgba(255,255,255,0.4);font-size:12px;font-weight:700;letter-spacing:3px;font-family:'Space Grotesk',sans-serif;">EMUNIB</div>
      <div style="
        width:40px;height:2px;
        background:linear-gradient(90deg,var(--pink,#FF2D78),var(--cyan,#00F5FF));
        border-radius:1px;margin:12px auto 0;
        animation:loaderBar 0.8s ease-in-out infinite alternate;
      "></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const loaderStyle = document.createElement('style');
  loaderStyle.textContent = `
    @keyframes loaderPulse {
      0%,100% { transform:scale(1); box-shadow:0 0 40px rgba(180,79,255,0.5); }
      50%      { transform:scale(1.1); box-shadow:0 0 70px rgba(180,79,255,0.8); }
    }
    @keyframes loaderBar {
      from { transform:scaleX(0.4); }
      to   { transform:scaleX(1); }
    }
  `;
  document.head.appendChild(loaderStyle);

  // Hide overlay after content loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.style.opacity   = '0';
      overlay.style.transform = 'scale(1.02)';
      setTimeout(() => overlay.remove(), 700);
    }, 500);
  });

  // Fallback: always remove after 3s
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 700);
    }
  }, 3000);
})();


/* ─────────────────────────────────────────
   21. TOAST NOTIFICATION SYSTEM
───────────────────────────────────────── */
window.showToast = function (message, type = 'info', duration = 3500) {
  const colors = {
    info:    { bg: 'rgba(180,79,255,0.15)', border: 'rgba(180,79,255,0.4)', icon: '💡' },
    success: { bg: 'rgba(6,255,165,0.12)',  border: 'rgba(6,255,165,0.4)',  icon: '✅' },
    error:   { bg: 'rgba(255,45,120,0.15)', border: 'rgba(255,45,120,0.4)', icon: '⚠️' },
    warning: { bg: 'rgba(255,209,102,0.15)',border: 'rgba(255,209,102,0.4)',icon: '🔔' },
  };
  const cfg = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: ${cfg.bg};
    border: 1px solid ${cfg.border};
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    z-index: 99998;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease;
    opacity: 0;
    max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    white-space: nowrap;
  `;
  toast.innerHTML = `<span style="font-size:18px;">${cfg.icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity   = '1';
    });
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 500);
  }, duration);
};


/* ─────────────────────────────────────────
   22. CTA CARD — Magnetic button effect
───────────────────────────────────────── */
(function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-cta-nav').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect  = btn.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) * 0.25;
      const dy    = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy - 4}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────
   23. GLOBAL KEYBOARD SHORTCUTS
───────────────────────────────────────── */
(function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + V → VAT Calculator
    if (e.altKey && e.key === 'v') {
      e.preventDefault();
      window.location.href = 'vat.html';
    }
    // Alt + C → Corporate Tax
    if (e.altKey && e.key === 'c') {
      e.preventDefault();
      window.location.href = 'corporate-tax.html';
    }
    // Alt + A → AI Assistant
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      window.location.href = 'ai-assistant.html';
    }
    // Escape → close any open modals/menus
    if (e.key === 'Escape') {
      const overlay = document.getElementById('pageLoadOverlay');
      if (overlay) overlay.remove();
    }
  });
})();


/* ─────────────────────────────────────────
   24. PERFORMANCE — Reduced motion support
───────────────────────────────────────── */
(function initReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ─────────────────────────────────────────
   END OF script.js
───────────────────────────────────────── */
