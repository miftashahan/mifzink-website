(function () {
  'use strict';

  /* ---------------- Dynamic time-of-day greeting ---------------- */
  var greetingEl = document.getElementById('greetingText');
  if (greetingEl) {
    var hour = new Date().getHours();
    var greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    greetingEl.textContent = greeting;
  }

  /* ---------------- Hamburger menu drawer ---------------- */
  var menuOpenBtn = document.getElementById('menuOpenBtn');
  var menuOpenBtn2 = document.getElementById('menuOpenBtn2');
  var menuCloseBtn = document.getElementById('menuCloseBtn');
  var menuBackdrop = document.getElementById('menuBackdrop');
  var menuDrawer = document.getElementById('menuDrawer');
  function openMenu() { if (menuDrawer) { menuDrawer.classList.add('open'); menuBackdrop.classList.add('open'); } }
  function closeMenu() { if (menuDrawer) { menuDrawer.classList.remove('open'); menuBackdrop.classList.remove('open'); } }
  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
  if (menuOpenBtn2) menuOpenBtn2.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

  /* ---------------- Card slide navigation ---------------- */
  var cardTrack = document.getElementById('cardTrack');
  var goNext = document.getElementById('goNext');
  var goPrev = document.getElementById('goPrev');

  if (cardTrack) {
    if (goNext) goNext.addEventListener('click', function () { cardTrack.classList.remove('nudge'); cardTrack.classList.add('page-2'); });
    if (goPrev) goPrev.addEventListener('click', function () { cardTrack.classList.remove('nudge'); cardTrack.classList.remove('page-2'); });

    /* Basic swipe support */
    var startX = null;
    cardTrack.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    cardTrack.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (diff < -40) cardTrack.classList.add('page-2');
      if (diff > 40) cardTrack.classList.remove('page-2');
      startX = null;
    }, { passive: true });

    /* Auto nudge hint ~1.5s after load, only if still on page 1 */
    setTimeout(function () {
      if (!cardTrack.classList.contains('page-2')) {
        cardTrack.classList.add('nudge');
        setTimeout(function () { cardTrack.classList.remove('nudge'); }, 1400);
      }
    }, 1500);
  }

  /* ---------------- Add to Contact (vCard download) ---------------- */
  var addContactBtn = document.getElementById('addContactBtn');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Ashbury;Tess;;;',
        'FN:Tess Ashbury',
        'ORG:Aurelia Realty Group',
        'TITLE:Realtor',
        'TEL;TYPE=CELL:+16155550148',
        'EMAIL:tess@aureliarealtygroup.com',
        'END:VCARD'
      ].join('\n');
      var blob = new Blob([vcard], { type: 'text/vcard' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'Tess_Ashbury.vcf';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ---------------- Tap-to-reveal contact popover ---------------- */
  var detailsBtn = document.getElementById('detailsBtn');
  var popover = document.getElementById('contactPopover');
  if (detailsBtn && popover) {
    detailsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      popover.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!detailsBtn.contains(e.target) && !popover.contains(e.target)) popover.classList.remove('open');
    });
    popover.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var text = btn.getAttribute('data-copy');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            var original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = original; }, 1500);
          });
        }
      });
    });
  }

  /* ---------------- Scroll reveal (Recent Success page) ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .success-item');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
