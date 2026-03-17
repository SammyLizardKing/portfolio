/* ============================
   SAM KIM PORTFOLIO — script.js
   ============================ */

// ── Simple Black Cursor ───────────────────────────────
const cursorDot = document.getElementById('cursorDot');

document.addEventListener('mousemove', e => {
  if (cursorDot) {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top  = e.clientY + 'px';
  }
});

let mouseX = 0, mouseY = 0;

// ── Noise Canvas ──────────────────────────────────────
const noiseCanvas = document.getElementById('noise');
const nCtx = noiseCanvas.getContext('2d');

function resizeNoise() {
  noiseCanvas.width  = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
}
resizeNoise();
window.addEventListener('resize', resizeNoise);

function renderNoise() {
  const w = noiseCanvas.width, h = noiseCanvas.height;
  const data = nCtx.createImageData(w, h);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255 | 0;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 255;
  }
  nCtx.putImageData(data, 0, 0);
}
setInterval(renderNoise, 120);
renderNoise();

// ── Date ──────────────────────────────────────────────
const dateEl = document.getElementById('headerDate');
const yearEl  = document.getElementById('year');
const now     = new Date();
if (dateEl) dateEl.textContent = now.toISOString().slice(0,10).replace(/-/g,'.');
if (yearEl) yearEl.textContent = now.getFullYear();

// ── Title Glitch on Hover ─────────────────────────────
const siteTitle = document.getElementById('siteTitle');
const glyphSet  = '!@#/<>[]{}|ABCDEFGHIJKLMNabcdefghijklmn';
let glitchTimer = null;

function glitch(el) {
  const orig = el.dataset.original;
  let ticks = 0;
  clearInterval(glitchTimer);
  glitchTimer = setInterval(() => {
    if (ticks++ > 7) { el.textContent = orig; clearInterval(glitchTimer); return; }
    el.textContent = orig.split('').map(c =>
      c === ' ' ? c : (Math.random() > 0.55
        ? glyphSet[Math.floor(Math.random() * glyphSet.length)]
        : c)
    ).join('');
  }, 55);
}

if (siteTitle) siteTitle.addEventListener('mouseenter', () => glitch(siteTitle));

// ── Barcode ───────────────────────────────────────────
function generateBarcode(el) {
  const widths = ['1px','2px','1px','3px','1px','4px','2px','1px','2px','3px'];
  for (let i = 0; i < 64; i++) {
    const bar = document.createElement('div');
    bar.style.cssText = `
      width: ${widths[i % widths.length]};
      background: ${Math.random() > 0.35 ? '#111' : '#ddd'};
      flex-shrink: 0;
    `;
    el.appendChild(bar);
  }
}
const barcodeEl = document.getElementById('barcode');
if (barcodeEl) generateBarcode(barcodeEl);

// ── Project Accordion ─────────────────────────────────
function toggleProject(headerEl) {
  const item   = headerEl.closest('.project-item');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.project-item.open').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.project-toggle').textContent = '[ + ]';
  });

  if (!isOpen) {
    item.classList.add('open');
    headerEl.querySelector('.project-toggle').textContent = '[ − ]';
    // Smooth scroll to opened project
    setTimeout(() => {
      item.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

// ── Scroll Reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.05 });

document.querySelectorAll('.section-inner').forEach(el => revealObserver.observe(el));

// Header appears immediately
setTimeout(() => {
  const h = document.querySelector('.header-inner');
  if (h) h.classList.add('visible');
}, 80);

// ── Typing effect for section labels ─────────────────
const labelObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const label = e.target.querySelector('.receipt-label');
    if (!label || label.dataset.typed) return;
    label.dataset.typed = '1';
    const text = label.textContent;
    label.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      label.textContent += text[i++];
      if (i >= text.length) clearInterval(t);
    }, 38);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section').forEach(s => labelObserver.observe(s));

// ── Print scan-line on load ───────────────────────────
(function() {
  const line = document.createElement('div');
  line.style.cssText = `
    position:fixed; left:0; right:0; top:0; height:2px;
    background:linear-gradient(90deg,transparent,#111 40%,transparent);
    opacity:0.12; z-index:998; pointer-events:none;
    animation:scan-down 1.1s ease-out forwards;
  `;
  const st = document.createElement('style');
  st.textContent = `@keyframes scan-down{from{top:0;opacity:0.18}to{top:100vh;opacity:0}}`;
  document.head.appendChild(st);
  document.body.appendChild(line);
  setTimeout(() => line.remove(), 1300);
})();

// ── Nav active state on scroll ────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      l.style.opacity = l.getAttribute('href') === '#' + e.target.id ? '1' : '0.4';
    });
  });
}, { threshold: 0.4 }).observe.call(
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(l => {
        l.style.opacity = l.getAttribute('href') === '#' + e.target.id ? '1' : '0.4';
      });
    });
  }, { threshold: 0.4 }),
  ...sections
);

// Simpler nav observer
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      l.style.opacity = l.getAttribute('href') === '#' + e.target.id ? '1' : '0.4';
    });
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

// ── Lightbox ──────────────────────────────────────────
(function() {
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCaption');
  const lbCount  = document.getElementById('lbCounter');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');

  if (!lb) return;

  let gallery = [];
  let current = 0;
  let lbScale = 1;

  function resetZoom() {
    lbScale = 1;
    lbImg.style.transform = '';
    lbImg.style.cursor = 'zoom-in';
  }

  function openLb(imgs, idx) {
    gallery = imgs;
    current = idx;
    resetZoom();
    showSlide();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
  }

  function showSlide() {
    const img = gallery[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    lbCount.textContent = '[ ' + (current + 1) + ' / ' + gallery.length + ' ]';
    resetZoom();
  }

  function prev() { current = (current - 1 + gallery.length) % gallery.length; showSlide(); }
  function next() { current = (current + 1) % gallery.length; showSlide(); }

  // Scroll to zoom
  lb.addEventListener('wheel', e => {
    if (!lb.classList.contains('active')) return;
    e.preventDefault();
    const rect = lbImg.getBoundingClientRect();
    const ox = ((e.clientX - rect.left) / rect.width)   * 100;
    const oy = ((e.clientY - rect.top)  / rect.height)  * 100;
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    lbScale = Math.max(1, Math.min(8, lbScale + delta));
    lbImg.style.transformOrigin = lbScale > 1 ? `${ox}% ${oy}%` : '50% 50%';
    lbImg.style.transform = lbScale > 1 ? `scale(${lbScale})` : '';
    lbImg.style.cursor = lbScale > 1 ? 'zoom-out' : 'zoom-in';
  }, { passive: false });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLb();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLb();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Attach to all lb-trigger images, scoped per project-gallery
  document.querySelectorAll('.project-gallery').forEach(pg => {
    const imgs = Array.from(pg.querySelectorAll('.lb-trigger'));
    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLb(imgs, i));
    });
  });
})();

// ── Konami Easter Egg ─────────────────────────────────
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  ki = e.key === ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'][ki] ? ki + 1 : 0;
  if (ki === konami.length) { ki = 0; easterEgg(); }
});

function easterEgg() {
  const msg = document.createElement('div');
  msg.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
    background:#111; color:#fff; font-family:'Share Tech Mono',monospace;
    font-size:12px; padding:12px 24px; letter-spacing:0.2em;
    z-index:9999; white-space:nowrap;
    animation:eg 3.2s ease forwards;
  `;
  msg.textContent = '◆  CHEAT CODE ACCEPTED. YOU PASS STUDIO.  ◆';
  const s = document.createElement('style');
  s.textContent = `@keyframes eg{
    0%{opacity:0;transform:translateX(-50%) translateY(8px)}
    12%{opacity:1;transform:translateX(-50%) translateY(0)}
    80%{opacity:1} 100%{opacity:0}
  }`;
  document.head.appendChild(s);
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3300);
}
