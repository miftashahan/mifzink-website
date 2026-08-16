(function () {
  'use strict';

  /* ---------------- Dynamic time-of-day greeting ---------------- */
  var greetingEl = document.getElementById('greetingText');
  if (greetingEl) {
    var hour = new Date().getHours();
    var greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    greetingEl.textContent = greeting;
  }

  /* ---------------- Flip card navigation ---------------- */
  var flipCard = document.getElementById('flipCard');
  var goNext = document.getElementById('goNext');
  var goPrev = document.getElementById('goPrev');

  if (flipCard) {
    if (goNext) goNext.addEventListener('click', function () { flipCard.classList.add('flipped'); });
    if (goPrev) goPrev.addEventListener('click', function () { flipCard.classList.remove('flipped'); });

    /* Basic swipe support */
    var startX = null;
    flipCard.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    flipCard.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (diff < -40) flipCard.classList.add('flipped');
      if (diff > 40) flipCard.classList.remove('flipped');
      startX = null;
    }, { passive: true });

    /* Auto nudge hint ~1.5s after load, only if still on front */
    setTimeout(function () {
      if (!flipCard.classList.contains('flipped')) {
        flipCard.classList.add('nudge');
        setTimeout(function () { flipCard.classList.remove('nudge'); }, 1200);
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
