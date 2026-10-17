/* Two behaviours, both functional: the running contents list, and the enquiry
   form. Nothing on this page animates. */
(function () {
  'use strict';

  /* ---------- running head: mark the section a reader is actually in ------- */

  var links = [].slice.call(document.querySelectorAll('.toc a'));
  var targets = links.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  }).filter(Boolean);

  if (targets.length) {
    var currentId = null;

    function setCurrent(id) {
      if (id === currentId) return;
      currentId = id;
      links.forEach(function (a) {
        a.classList.toggle('current', a.getAttribute('href') === '#' + id);
      });
    }

    /* Measured against a reading line rather than an IntersectionObserver
       callback, because the observer does not run in a hidden tab and
       requestAnimationFrame does not either. Thirteen getBoundingClientRect
       calls per scroll event is cheaper than either workaround. */
    function update() {
      var line = window.innerHeight * 0.28;
      var found = targets[0].id;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= line) found = targets[i].id;
        else break;
      }
      /* The last section can be shorter than the reading line. */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        found = targets[targets.length - 1].id;
      }
      setCurrent(found);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* A closed <details> prints as nothing at all, so the appendix would vanish
     from the copy a client hands round a table. */
  window.addEventListener('beforeprint', function () {
    [].slice.call(document.querySelectorAll('details')).forEach(function (d) { d.open = true; });
  });

  /* ---------- enquiry: compose in the visitor's own mail client ------------ */

  var form = document.getElementById('enquiry');
  if (!form) return;

  var status = document.getElementById('q-status');
  var TO = 'sybertoooth7@gmail.com';

  function say(text, bad) {
    status.textContent = text;
    status.classList.toggle('bad', !!bad);
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    /* form.elements, never form.<name>: HTMLFormElement already owns a `name`
       property, so form.name silently returns the form's own name attribute. */
    var f = form.elements;
    var name = f.name.value.trim();
    var message = f.message.value.trim();

    if (!name || !message) {
      say('Name and situation are both needed before this is worth sending.', true);
      (name ? f.message : f.name).focus();
      return;
    }

    var lines = [
      message,
      '',
      '--',
      'Name: ' + name
    ];
    if (f.org.value.trim()) lines.push('Organisation: ' + f.org.value.trim());
    lines.push('What is needed: ' + f.service.value);
    lines.push('Timeframe: ' + f.when.value);
    lines.push('From: ' + document.querySelector('link[rel=canonical]').href);

    var url = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(f.service.value + ' — enquiry from ' + name) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    var link = document.getElementById('q-mailto');
    link.href = url;
    /* Some browsers block a scripted mailto, so leave a real link behind. */
    document.getElementById('q-fallback').hidden = false;
    say('Draft ready — your mail app should be open. Nothing was sent yet.', false);
    window.location.href = url;
  });
}());
