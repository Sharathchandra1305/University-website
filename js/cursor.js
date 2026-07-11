// ============================================
// CUSTOM CURSOR — dot + lagging ring, follows pointer
// ============================================
(function () {
  // Skip entirely on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.body.classList.add('no-cursor');
    return;
  }

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;
  const ease = 0.16; // lag amount — lower = more lag

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  }, { passive: true });

  function tick() {
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Grow the ring + color shift over interactive elements
  const hoverables = 'a, button, .info-card, .gallery-item, .news-card, .value-card, .person-card, input, textarea, .filter-tab, .tab-btn, .t-dot';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove('hover');
  });
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup', () => ring.classList.remove('click'));

  // Hide cursor visuals when pointer leaves the window
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 0.55; });
})();