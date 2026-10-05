document.addEventListener('DOMContentLoaded', function () {
  var css = ['https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', 'https://unpkg.com/aos@2.3.4/dist/aos.css'];
  css.forEach(function (href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
  function load(src, next) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = next;
    document.body.appendChild(s);
  }
  load('https://unpkg.com/aos@2.3.4/dist/aos.js', function () {
    load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', function () {
      var s = document.createElement('script');
      s.src = 'motion.js';
      document.body.appendChild(s);
    });
  });
});
