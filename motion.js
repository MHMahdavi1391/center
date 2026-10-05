(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var nodes = document.querySelectorAll('.header, .brand, .tagline, .about-block, .v-card, .quote-box, .contact-card, .social-row, .link-card, .topbar, .intro, .card, footer');
  nodes.forEach(function (el, i) {
    el.setAttribute('data-aos', i % 2 ? 'fade-up' : 'fade-up');
    el.setAttribute('data-aos-delay', String((i % 6) * 70));
    el.setAttribute('data-aos-duration', '700');
  });
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 40, easing: 'ease-out-cubic' });
  if (window.gsap) {
    gsap.from('.brand-icon, .brand img, .brand-text h1, .intro h1', { y: 18, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' });
    document.querySelectorAll('.link-card, .v-card, .card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(el, { y: -4, duration: 0.35, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { y: 0, duration: 0.35, ease: 'power2.out' });
      });
    });
  }
  var grid = document.getElementById('link-list') || document.getElementById('grid');
  if (grid && window.MutationObserver) {
    new MutationObserver(function () {
      grid.querySelectorAll('.link-card, .card').forEach(function (el, i) {
        if (el.dataset.aos) return;
        el.classList.add('animate__animated', 'animate__fadeInUp');
        el.style.setProperty('--animate-delay', (i * 0.08) + 's');
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', String(i * 70));
      });
      if (window.AOS) AOS.refresh();
    }).observe(grid, { childList: true });
  }
})();
