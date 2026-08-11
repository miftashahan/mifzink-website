/* Aurelia Realty Group — gallery carousel + lightbox
   Used on listing detail pages. Call initGallery([{src, alt}, ...]) once
   the DOM for .gv-main, .gv-thumbs and #lightbox is in place. */

function initGallery(images) {
  let idx = 0;

  const mainImg = document.getElementById('gv-image');
  const countEl = document.querySelector('.gv-count');
  const thumbs = Array.from(document.querySelectorAll('.gv-thumb'));
  const prevBtn = document.querySelector('.gv-prev');
  const nextBtn = document.querySelector('.gv-next');
  const expandBtn = document.querySelector('.gv-expand');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCount = document.querySelector('.lightbox-count');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!mainImg || !images || !images.length) return;

  function render() {
    mainImg.src = images[idx].src;
    mainImg.alt = images[idx].alt || '';
    if (countEl) countEl.textContent = (idx + 1) + ' / ' + images.length;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
    if (lightbox && lightbox.classList.contains('open')) renderLightbox();
  }

  function renderLightbox() {
    lightboxImg.src = images[idx].src;
    lightboxImg.alt = images[idx].alt || '';
    if (lightboxCount) lightboxCount.textContent = (idx + 1) + ' / ' + images.length;
  }

  function go(step) {
    idx = (idx + step + images.length) % images.length;
    render();
  }

  function openLightbox() {
    if (!lightbox) return;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));
  if (expandBtn) expandBtn.addEventListener('click', openLightbox);
  mainImg.addEventListener('click', openLightbox);

  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => { idx = i; render(); });
  });

  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => go(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => go(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  }

  render();
}

/* ---------------- Mobile / tablet nav overlay ---------------- */
function initMobileMenu() {
  const trigger = document.querySelector('.mobile-menu-trigger');
  const cardMenuBtns = document.querySelectorAll('.card-menu-btn');
  const overlay = document.getElementById('mobileMenu');
  const closeBtn = document.querySelector('.mobile-menu-close');
  if (!overlay) return;

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (trigger) trigger.addEventListener('click', open);
  cardMenuBtns.forEach((btn) => btn.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

/* ---------------- Mobile card swipe (page 1 <-> page 2) ---------------- */
function initCardSwipe() {
  const track = document.getElementById('cardTrack');
  if (!track) return;

  let page = 0;
  function goTo(p) {
    page = p;
    track.classList.toggle('page-2', page === 1);
  }

  document.querySelectorAll('[data-card-next]').forEach((el) => {
    el.addEventListener('click', () => goTo(1));
  });
  document.querySelectorAll('[data-card-prev]').forEach((el) => {
    el.addEventListener('click', () => goTo(0));
  });

  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && page === 0) goTo(1);
    if (dx > 0 && page === 1) goTo(0);
  }, { passive: true });
}

/* ---------------- Add to Contact (vCard download) ---------------- */
function initAddContact() {
  const btn = document.getElementById('addContactBtn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'N:Ashbury;Tess;;;',
      'FN:Tess Ashbury',
      'ORG:Aurelia Realty Group',
      'TITLE:Realtor',
      'TEL;TYPE=CELL:+16155550148',
      'EMAIL:tess@aureliarealtygroup.com',
      'END:VCARD'
    ].join('\n');
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Tess_Ashbury.vcf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCardSwipe();
  initAddContact();
});
