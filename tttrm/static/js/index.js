document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }

  const dialog = document.querySelector('.figure-dialog');
  const expandedImage = dialog.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!dialog.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      expandedImage.src = link.href;
      expandedImage.alt = link.querySelector('img').alt;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });

});
