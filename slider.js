/**
 * LTC HUB — ad slider
 * Reads every image in /slider (any name, any count) and page-turns every 5s.
 */
(function () {
  'use strict';

  var root = document.getElementById('adSlider');
  if (!root) return;

  var frame = document.getElementById('adFrame');
  var under = document.getElementById('adUnder');
  var sheet = document.getElementById('adSheet');
  var sheetImg = document.getElementById('adSheetImg');
  var dotsEl = document.getElementById('adDots');

  var slides = [];
  var index = 0;
  var busy = false;
  var timer = null;
  var paused = false;
  var INTERVAL = 5000;
  var EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function label(name) {
    return String(name || '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  }

  function setImg(img, slide) {
    if (!slide) return;
    img.src = slide.src;
    img.alt = label(slide.name);
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
            .filter(function (item) {
              return item && item.type === 'file' && EXT.test(item.name);
            })
            .sort(function (a, b) {
              return a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' });
            })
            .map(function (item) {
              return { src: 'slider/' + encodeURIComponent(item.name), name: item.name };
            });
        }
      }
    } catch (err) {}
    return [];
  }

  function renderDots() {
    dotsEl.innerHTML = '';
    slides.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ad-dot' + (i === index ? ' is-on' : '');
      btn.setAttribute('aria-label', 'اسلاید ' + (i + 1));
      btn.addEventListener('click', function () {
        var delta = i - index;
        if (!delta) return;
        go(delta > 0 ? 1 : -1, i);
      });
      dotsEl.appendChild(btn);
    });
  }

  function arm() {
    clearTimeout(timer);
    if (paused || slides.length < 2 || document.hidden) return;
    timer = setTimeout(function () { go(1); }, INTERVAL);
  }

  function finish(next) {
    sheet.classList.remove('flip-next', 'flip-prev', 'fade-next');
    index = next;
    setImg(sheetImg, slides[index]);
    renderDots();
    busy = false;
    arm();
  }

  function go(dir, target) {
    if (busy || slides.length < 2 || !dir) return;
    var next = typeof target === 'number'
      ? ((target % slides.length) + slides.length) % slides.length
      : (index + dir + slides.length) % slides.length;
    if (next === index) return;

    busy = true;
    clearTimeout(timer);
    setImg(under, slides[next]);

    var cls = reduceMotion ? 'fade-next' : (dir > 0 ? 'flip-next' : 'flip-prev');
    sheet.classList.remove('flip-next', 'flip-prev', 'fade-next');
    void sheet.offsetWidth;
    sheet.classList.add(cls);

    var done = false;
    var complete = function () {
      if (done) return;
      done = true;
      sheet.removeEventListener('animationend', complete);
      finish(next);
    };
    sheet.addEventListener('animationend', complete);
    setTimeout(complete, reduceMotion ? 420 : 900);
  }

  function start(list) {
    slides = list;
    if (!slides.length) {
      root.hidden = true;
      return;
    }
    root.hidden = false;
    index = 0;
    setImg(sheetImg, slides[0]);
    setImg(under, slides[slides.length > 1 ? 1 : 0]);
    dotsEl.hidden = slides.length < 2;
    renderDots();
    arm();
  }

  root.addEventListener('mouseenter', function () { paused = true; clearTimeout(timer); });
  root.addEventListener('mouseleave', function () { paused = false; arm(); });
  root.addEventListener('focusin', function () { paused = true; clearTimeout(timer); });
  root.addEventListener('focusout', function () { paused = false; arm(); });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(timer);
    else arm();
  });

  var dragX = 0;
  var dragging = false;

  function endDrag(clientX) {
    if (!dragging) return;
    dragging = false;
    frame.classList.remove('is-dragging');
    var dx = clientX - dragX;
    sheet.style.transform = '';
    paused = false;
    if (Math.abs(dx) > 46) go(dx < 0 ? 1 : -1);
    else arm();
  }

  frame.addEventListener('pointerdown', function (e) {
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
    if (!dragging || busy) return;
    sheet.style.transform = 'translateX(' + ((e.clientX - dragX) * 0.2) + 'px)';
  });
  frame.addEventListener('pointerup', function (e) { endDrag(e.clientX); });
  frame.addEventListener('pointercancel', function (e) { endDrag(e.clientX); });

  discover().then(start);
})();
