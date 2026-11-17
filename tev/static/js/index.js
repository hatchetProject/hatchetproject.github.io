document.addEventListener('DOMContentLoaded', function () {
  // Scroll reveal animation
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  // Play muted demo videos only while they are on screen (saves bandwidth/CPU)
  const videoObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting && v.offsetParent !== null) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  const lazyVideos = document.querySelectorAll('video.lazy-video');
  lazyVideos.forEach((v) => videoObs.observe(v));

  // Re-check visibility when hidden content (tabs / details) is revealed
  function refresh(container) {
    container.querySelectorAll('video.lazy-video').forEach((v) => {
      videoObs.unobserve(v);
      videoObs.observe(v);
    });
  }

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach((wrap) => {
    const btns = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.toggle('active', b === btn));
        panels.forEach((p) => {
          const on = p.dataset.panel === btn.dataset.tab;
          p.classList.toggle('active', on);
          p.querySelectorAll('video').forEach((v) => { if (!on) v.pause(); else v.currentTime = 0; });
        });
        refresh(wrap);
      });
    });
  });

  document.querySelectorAll('details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!d.open) d.querySelectorAll('video').forEach((v) => v.pause());
      refresh(d);
    });
  });

  // Sticky top bar: show after hero, highlight current section
  const topbar = document.getElementById('topbar');
  const hero = document.getElementById('top');
  if (topbar && hero) {
    new IntersectionObserver(
      ([e]) => topbar.classList.toggle('shown', !e.isIntersecting),
      { rootMargin: '-60px 0px 0px 0px' }
    ).observe(hero);
  }
  const navLinks = document.querySelectorAll('.topbar-links a');
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  let ticking = false;
  function spy() {
    ticking = false;
    const line = window.innerHeight * 0.35;
    let cur = null;
    sections.forEach((sec) => { if (sec.getBoundingClientRect().top <= line) cur = sec; });
    navLinks.forEach((a) =>
      a.classList.toggle('current', !!cur && a.getAttribute('href') === '#' + cur.id)
    );
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  // Copy BibTeX
  const copyBtn = document.getElementById('copy-bib');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('bib-text').innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(() => (copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy'), 1800);
      });
    });
  }
});
