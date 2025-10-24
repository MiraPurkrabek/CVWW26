// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close nav on link click (mobile)
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));
}

// Back to top current year (force 2026 for CVWW 2026)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = '2026';

// Back-to-top visibility
const backToTop = document.querySelector('.back-to-top');
const toggleBackToTop = () => {
  if (!backToTop) return;
  if (window.scrollY > 320) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
};
toggleBackToTop();
window.addEventListener('scroll', toggleBackToTop, { passive: true });

// Smooth scroll adjustment for sticky header (if needed)
const header = document.querySelector('.site-header');
if ('scrollBehavior' in document.documentElement.style && header) {
  const offset = () => header.getBoundingClientRect().height + 8;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      if (id === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', '#top');
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset();
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', id);
    }, { passive: false });
  });
}
