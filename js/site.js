(function () {
  'use strict';
  var d = document, root = d.documentElement; root.classList.add('js');
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* WhatsApp a partir de js/config.js */
  var S = window.SITE || {};
  $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/' + (S.whatsapp || '') + '?text=' + encodeURIComponent(S.mensagemInicial || ''); });
  $$('[data-wa-text]').forEach(function (n) { if (S.whatsappExibicao) n.textContent = S.whatsappExibicao; });
  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  /* Cabeçalho + link ativo */
  var hd = $('.hd');
  var links = $$('.nav a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function onScroll() {
    hd.classList.toggle('solid', window.scrollY > 12 || d.body.classList.contains('lock'));
    var mid = window.innerHeight * .4, cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < mid) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    // linha de progresso dos passos
    var st = $('[data-steps]');
    if (st) {
      var r = st.getBoundingClientRect(), h = window.innerHeight;
      var p = Math.max(0, Math.min(1, (h * .7 - r.top) / (r.height + h * .1)));
      st.style.setProperty('--p', p.toFixed(3));
      var items = $$('.step', st);
      items.forEach(function (it, i) { it.classList.toggle('on', p >= (i + .35) / items.length - .02); });
    }
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var burger = $('.burger'), drawer = $('.drawer');
  function menu(open) {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    drawer.classList.toggle('open', open); d.body.classList.toggle('lock', open); drawer.toggleAttribute('inert', !open); onScroll();
  }
  drawer.setAttribute('inert', '');
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  window.matchMedia('(min-width:960px)').addEventListener('change', function (e) { if (e.matches) menu(false); });

  /* Revelações */
  var rv = $$('.rv, .rv-clip');
  if ('IntersectionObserver' in window && !reduce) {
    /* Elementos com clip-path nunca "aparecem" para o observador; por isso observamos o pai deles. */
    var clipMap = new Map();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in'); (clipMap.get(e.target) || []).forEach(function (c) { c.classList.add('in'); });
          io.unobserve(e.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (n) {
      if (n.classList.contains('rv-clip')) {
        var p = n.parentElement; if (!clipMap.has(p)) clipMap.set(p, []); clipMap.get(p).push(n); io.observe(p);
      } else io.observe(n);
    });
  } else rv.forEach(function (n) { n.classList.add('in'); });
  // o "@" desenha o traço quando o contato aparece
  var at = $('.at');
  if (at) {
    if ('IntersectionObserver' in window && !reduce) {
      var ao = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { at.classList.add('draw'); ao.disconnect(); } }); }, { threshold: .6 });
      ao.observe(at);
    } else at.classList.add('draw');
  }

  /* Parallax suave do hero (só com mouse) */
  var art = $('.hero-art');
  if (art && fine && !reduce) {
    $('.hero').addEventListener('pointermove', function (e) {
      var x = (e.clientX / window.innerWidth - .5) * -18, yy = (e.clientY / window.innerHeight - .5) * -12;
      art.style.transform = 'scale(1.04) translate(' + x + 'px,' + yy + 'px)';
    });
  }

  /* Botões "magnéticos" e brilho que segue o mouse nas cartas */
  if (fine && !reduce) {
    $$('[data-magnet]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .28) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    $$('.tile').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* WhatsApp flutuante: pulso ocasional */
  var fl = $('.wa-float');
  if (fl && !reduce) setInterval(function () { fl.classList.add('pulse'); setTimeout(function () { fl.classList.remove('pulse'); }, 3800); }, 11000);
})();
