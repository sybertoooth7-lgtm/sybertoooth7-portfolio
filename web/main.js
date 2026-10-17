(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal: hide only when motion is allowed and JS is running, so a no-JS or
     reduced-motion visitor always sees full content. */
  var revealTargets = document.querySelectorAll('main section > .wrap > *');
  if (!reduce) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  }

  /* Scroll-spy on the section nav. */
  var links = {};
  document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var link = links[e.target.id];
      if (!link) return;
      if (e.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

  /* Count-up on the readout; final value is always the exact one from the markup. */
  if (reduce) return;
  document.querySelectorAll('.stat-n[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!isFinite(target)) return;
    var start = null, dur = 900;
    var tick = function (now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-US');
    };
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      /* Blank it only once the figure is on screen: if rAF never runs, the real
         number is what a visitor is left looking at. */
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
    io.observe(el);
  });
})();
