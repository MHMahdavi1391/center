/**
 * LTC HUB slider — horizontal slide, centered with the page.
 * Images in /slider play in name order. Auto every 5s. Drag left/right to move.
 */
(function () {
  'use strict';

  var root = document.getElementById('adSlider');
  var frame = document.getElementById('adFrame');
  var track = document.getElementById('adTrack');
  var dotsEl = document.getElementById('adDots');
  if (!root || !frame || !track || !dotsEl) return;

  var slides = [];
  var index = 0;
  var busy = false;
  var timer = null;
  var paused = false;
  var INTERVAL = 5000;
  var EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

  function label(name) {
    return String(name || '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  }

  async function discover() {
    try {
      var res = await fetch('https://api.github.com/repos/MHMahdavi1391/center/contents/slider?ref=main', {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (res.ok) {
        var items = await res.json();
        if (Array.isArray(items)) {
          return items
            .filter(function (item) { return item && item.type === 'file' && EXT.test(item.name); })
            .sort(function (a, b) { return a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' }); })
            .map(function (item) { return { src: 'slider/' + encodeURIComponent(item.name), name: item.name }; });
        }
      }
    } catch (err) {}
    return [];
  }

  function place(offsetPx) {
    var shift = -index * frame.clientWidth + (offsetPx || 0);
    track.style.transform = 'translate3d(' + shift + 'px,0,0)';
  }

  function renderDots() {
    dotsEl.innerHTML = '';
    dotsEl.hidden = slides.length < 2;
    slides.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ad-dot' + (i === index ? ' is-on' : '');
      btn.setAttribute('aria-label', 'اسلاید ' + (i + 1));
      btn.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(btn);
    });
  }

  function arm() {
    clearTimeout(timer);
    if (paused || slides.length < 2 || document.hidden) return;
    timer = setTimeout(function () { goTo(index + 1); }, INTERVAL);
  }

  function goTo(next) {
    if (!slides.length) return;
    next = ((next % slides.length) + slides.length) % slides.length;
    if (next === index) {
      place(0);
      arm();
      return;
    }
    index = next;
    place(0);
    renderDots();
    arm();
  }

  function start(list) {
    slides = list;
    if (!slides.length) {
      root.hidden = true;
      return;
    }
    track.innerHTML = '';
    slides.forEach(function (slide) {
      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = label(slide.name);
      img.draggable = false;
      track.appendChild(img);
    });
    root.hidden = false;
    index = 0;
    place(0);
    renderDots();
    arm();
  }

  var dragX = 0;
  var dragging = false;

  frame.addEventListener('pointerdown', function (e) {
    if (slides.length < 2) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.ad-dot')) return;
    dragging = true;
    dragX = e.clientX;
    paused = true;
    clearTimeout(timer);
    frame.classList.add('is-dragging');
    if (frame.setPointerCapture) frame.setPointerCapture(e.pointerId);
  });

  frame.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    place(e.clientX - dragX);
  });

  function endDrag(clientX) {
    if (!dragging) return;
    dragging = false;
    frame.classList.remove('is-dragging');
    var dx = clientX - dragX;
    paused = false;
    if (dx <= -48) goTo(index + 1);
    else if (dx >= 48) goTo(index - 1);
    else {
      place(0);
      arm();
    }
  }

  frame.addEventListener('pointerup', function (e) { endDrag(e.clientX); });
  frame.addEventListener('pointercancel', function (e) { endDrag(dragX); });
  window.addEventListener('resize', function () { place(0); });

  root.addEventListener('mouseenter', function () { paused = true; clearTimeout(timer); });
  root.addEventListener('mouseleave', function () { if (!dragging) { paused = false; arm(); } });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(timer);
    else arm();
  });

  discover().then(start);
})();
