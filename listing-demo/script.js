(function () {
  'use strict';

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- Interest activity ticker ---------------- */
  var activityText = document.getElementById('activityText');
  var messages = [
    '6 people viewing this home right now',
    '23 showing requests this week',
    '3 tour bookings made today',
    '5 people saved this listing in the last hour',
    '12 buyers requested the video tour this week'
  ];
  var msgIndex = 0;
  if (activityText) {
    setInterval(function () {
      activityText.classList.add('fade');
      setTimeout(function () {
        msgIndex = (msgIndex + 1) % messages.length;
        activityText.textContent = messages[msgIndex];
        activityText.classList.remove('fade');
      }, 400);
    }, 5000);
  }

  /* ---------------- Open House countdown (always rolls to next Saturday) ---------------- */
  var ohDays = document.getElementById('ohDays');
  var ohHours = document.getElementById('ohHours');
  var ohMinutes = document.getElementById('ohMinutes');
  var ohSeconds = document.getElementById('ohSeconds');

  function nextOpenHouseWindow() {
    var now = new Date();
    var target = new Date(now);
    var day = now.getDay(); // 0 Sun ... 6 Sat
    var daysUntilSat = (6 - day + 7) % 7;
    target.setDate(now.getDate() + daysUntilSat);
    target.setHours(13, 0, 0, 0); // 1:00 PM

    var end = new Date(target);
    end.setHours(15, 0, 0, 0); // 3:00 PM

    // If today is Saturday but the window has already ended, jump to next Saturday
    if (now > end) {
      target.setDate(target.getDate() + 7);
    }
    return target;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tickCountdown() {
    if (!ohDays) return;
    var now = new Date();
    var target = nextOpenHouseWindow();
    var diff = target - now;
    if (diff < 0) diff = 0;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    ohDays.textContent = pad(days);
    ohHours.textContent = pad(hours);
    ohMinutes.textContent = pad(minutes);
    ohSeconds.textContent = pad(seconds);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------- Gallery lightbox ---------------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  var galleryData = galleryItems.map(function (item) {
    return {
      src: item.querySelector('img').getAttribute('src'),
      alt: item.querySelector('img').getAttribute('alt'),
      caption: item.querySelector('.gallery-caption').textContent
    };
  });

  function openLightbox(index) {
    if (!lightbox || !galleryData[index]) return;
    currentIndex = index;
    lightboxImg.src = galleryData[index].src;
    lightboxImg.alt = galleryData[index].alt;
    lightboxCaption.textContent = galleryData[index].caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    lightboxImg.src = galleryData[currentIndex].src;
    lightboxImg.alt = galleryData[currentIndex].alt;
    lightboxCaption.textContent = galleryData[currentIndex].caption;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    lightboxImg.src = galleryData[currentIndex].src;
    lightboxImg.alt = galleryData[currentIndex].alt;
    lightboxCaption.textContent = galleryData[currentIndex].caption;
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  /* ---------------- FAQ accordion ---------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Video play ---------------- */
  var video = document.getElementById('tourVideo');
  var playBtn = document.getElementById('videoPlayBtn');
  if (video && playBtn) {
    playBtn.addEventListener('click', function () {
      video.play().then(function () {
        playBtn.classList.add('hidden');
      }).catch(function () {
        // No video source available yet (demo placeholder) — keep button visible
      });
    });
    video.addEventListener('pause', function () { playBtn.classList.remove('hidden'); });
    video.addEventListener('ended', function () { playBtn.classList.remove('hidden'); });
  }

  /* ---------------- Mortgage calculator ---------------- */
  var HOME_PRICE = 1395000;
  var downSlider = document.getElementById('calcDown');
  var downLabel = document.getElementById('calcDownLabel');
  var rateSlider = document.getElementById('calcRate');
  var rateLabel = document.getElementById('calcRateLabel');
  var monthlyOut = document.getElementById('calcMonthly');

  function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function updateCalculator() {
    if (!downSlider || !rateSlider) return;
    var downPct = parseFloat(downSlider.value);
    var rate = parseFloat(rateSlider.value);
    downLabel.textContent = downPct + '%';
    rateLabel.textContent = rate.toFixed(2) + '%';

    var loanAmount = HOME_PRICE * (1 - downPct / 100);
    var monthlyRate = rate / 100 / 12;
    var numPayments = 30 * 12;
    var monthly;
    if (monthlyRate === 0) {
      monthly = loanAmount / numPayments;
    } else {
      monthly = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    monthlyOut.textContent = formatCurrency(monthly);
  }
  if (downSlider) downSlider.addEventListener('input', updateCalculator);
  if (rateSlider) rateSlider.addEventListener('input', updateCalculator);
  updateCalculator();

  /* ---------------- Share buttons ---------------- */
  var shareUrl = 'https://118AshgroveLane.com';
  var shareMessage = 'Take a look at 118 Ashgrove Lane in Franklin, TN — ' + shareUrl;

  var waLink = document.getElementById('shareWhatsapp');
  if (waLink) waLink.href = 'https://wa.me/?text=' + encodeURIComponent(shareMessage);

  var smsLink = document.getElementById('shareSms');
  if (smsLink) smsLink.href = 'sms:?&body=' + encodeURIComponent(shareMessage);

  var emailLink = document.getElementById('shareEmail');
  if (emailLink) {
    emailLink.href = 'mailto:?subject=' + encodeURIComponent('118 Ashgrove Lane, Franklin, TN') +
      '&body=' + encodeURIComponent(shareMessage);
  }

  var copyBtn = document.getElementById('shareCopy');
  var copyLabel = document.getElementById('shareCopyLabel');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(function () {
          copyLabel.textContent = 'Copied!';
          setTimeout(function () { copyLabel.textContent = 'Copy Link'; }, 2000);
        });
      }
    });
  }
})();
