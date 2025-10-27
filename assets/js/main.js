// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  
  // Close mobile nav only when clicking on leaf items (links inside dropdown or regular links)
  siteNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      // Don't close if clicking a dropdown parent (node)
      if (a.parentElement.classList.contains('has-dropdown')) {
        return; // This is a node, not a leaf - don't close nav
      }
      // This is a leaf - close the mobile nav
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Dropdown menu handling for all screen sizes
const dropdownParents = document.querySelectorAll('.has-dropdown');
dropdownParents.forEach(parent => {
  const parentLink = parent.querySelector('a');
  
  // Prevent navigation and toggle dropdown on click
  parentLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event from bubbling
    
    const isOpen = parent.classList.toggle('open');
    parentLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Close other dropdowns
    dropdownParents.forEach(otherParent => {
      if (otherParent !== parent) {
        otherParent.classList.remove('open');
        const otherLink = otherParent.querySelector('a');
        if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
      }
    });
  }, true); // Use capture phase to ensure this runs first
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.has-dropdown')) {
    dropdownParents.forEach(parent => {
      parent.classList.remove('open');
    });
  }
});

// Keyboard navigation for dropdowns
dropdownParents.forEach(parent => {
  const parentLink = parent.querySelector('a');
  
  parentLink.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation(); // Stop event from bubbling
      
      const isOpen = parent.classList.toggle('open');
      parentLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      // Close other dropdowns
      dropdownParents.forEach(otherParent => {
        if (otherParent !== parent) {
          otherParent.classList.remove('open');
          const otherLink = otherParent.querySelector('a');
          if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }, true); // Use capture phase to ensure this runs first
});

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
    // Skip dropdown parent links - they should only toggle menus
    if (link.parentElement.classList.contains('has-dropdown')) {
      return;
    }
    
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
