// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Highlight current page in nav
(function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

// Sticky nav shrink/shadow on scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 50);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
const statEls = document.querySelectorAll('.stat-num');
if (statEls.length) {
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCount(entry.target); statObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.magnetic').forEach(el => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
});

// ============================================
// TESTIMONIAL CAROUSEL (auto + dots)
// ============================================
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.t-dot');
if (slides.length) {
  let active = 0;
  let autoTimer;
  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    active = i;
  }
  function nextSlide() { showSlide((active + 1) % slides.length); }
  function startAuto() { autoTimer = setInterval(nextSlide, 5000); }
  function stopAuto() { clearInterval(autoTimer); }
  dots.forEach((d, idx) => d.addEventListener('click', () => { showSlide(idx); stopAuto(); startAuto(); }));
  startAuto();
}

// ============================================
// TABS (academics degree levels)
// ============================================
document.querySelectorAll('.tab-bar').forEach(bar => {
  const buttons = bar.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === targetId);
      });
    });
  });
});

// ============================================
// NEWS FILTER TABS
// ============================================
const filterTabs = document.querySelectorAll('.filter-tab');
if (filterTabs.length) {
  const newsCards = document.querySelectorAll('.news-card');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      newsCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

// ============================================
// CONTACT FORM VALIDATION
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      const isEmail = field.type === 'email';
      const filled = field.value.trim().length > 0;
      const emailOk = !isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      const ok = filled && emailOk;
      group.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    const successBox = document.getElementById('formSuccess');
    if (valid) {
      contactForm.reset();
      if (successBox) successBox.classList.add('show');
    } else if (successBox) {
      successBox.classList.remove('show');
    }
  });
}