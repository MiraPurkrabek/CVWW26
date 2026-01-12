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

// Auto-alternate section backgrounds so authors only set the first one manually.
const alternatingSections = document.querySelectorAll('main > section.section');
if (alternatingSections.length) {
  let shouldAlt = alternatingSections[0].classList.contains('alt');
  alternatingSections.forEach(section => {
    section.classList.toggle('alt', shouldAlt);
    shouldAlt = !shouldAlt;
  });
}

// Allow promo cards with data-link to be clickable while preserving nested links.
const linkedRateCards = document.querySelectorAll('.rate-card[data-link]');
linkedRateCards.forEach(card => {
  const url = card.getAttribute('data-link');
  if (!url) return;

  const openCardLink = () => {
    const target = card.getAttribute('data-link-target');
    if (target === '_blank') {
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
    } else {
      window.location.assign(url);
    }
  };

  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    openCardLink();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      openCardLink();
    }
  });
});

// News list fade indicators
const newsScrollers = document.querySelectorAll('.news-scroller');
newsScrollers.forEach(scroller => {
  const updateFade = () => {
    const { scrollTop, scrollHeight, clientHeight } = scroller;
    if (scrollTop > 2) scroller.classList.add('has-top-fade');
    else scroller.classList.remove('has-top-fade');

    if (scrollTop + clientHeight < scrollHeight - 2) scroller.classList.add('has-bottom-fade');
    else scroller.classList.remove('has-bottom-fade');
  };

  updateFade();
  scroller.addEventListener('scroll', updateFade, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(updateFade);
    resizeObserver.observe(scroller);
  }
});

// Submission deadline countdown
// Assumption: Deadline is AoE end (23:59:59 UTC) unless changed via data-deadline attribute.
// To change, edit the data-deadline on the .countdown span in HTML.
const countdownEls = document.querySelectorAll('.countdown[data-deadline]');

function isDSTEurope(year) {
  // DST starts last Sunday of March, ends last Sunday of October (Europe/Prague rules)
  const lastSunday = (month) => {
    // month: 2=March, 9=October (0-based)
    const d = new Date(Date.UTC(year, month + 1, 0)); // last day of month in UTC
    // Walk backwards to Sunday
    while (d.getUTCDay() !== 0) d.setUTCDate(d.getUTCDate() - 1);
    return d; // UTC date of last Sunday
  };
  const start = lastSunday(2); // March
  // DST change at 01:00 UTC -> after this moment DST applies
  start.setUTCHours(1,0,0,0);
  const end = lastSunday(9); // October
  end.setUTCHours(1,0,0,0); // moment DST ends
  const nowUTC = Date.now();
  return nowUTC >= start.getTime() && nowUTC < end.getTime();
}

function parseCentralEuropean(deadlineStr) {
  // Accept formats: YYYY-MM-DDTHH:MM[:SS] optional seconds, no timezone
  const m = deadlineStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return NaN;
  const [_, y, mo, d, h, mi, s] = m;
  const year = +y; const month = +mo; const day = +d; const hour = +h; const min = +mi; const sec = +(s||'0');
  // Determine offset: CET = UTC+1, CEST = UTC+2 during DST.
  const dst = isDSTEurope(year);
  const offsetHours = dst ? 2 : 1;
  // Produce UTC timestamp by subtracting offset.
  return Date.UTC(year, month - 1, day, hour - offsetHours, min, sec);
}
function formatRemaining(ms) {
  if (ms <= 0) return null;
  const dMs = 24 * 60 * 60 * 1000;
  const hMs = 60 * 60 * 1000;
  const mMs = 60 * 1000;
  const days = Math.floor(ms / dMs);
  const hours = Math.floor((ms % dMs) / hMs);
  const mins = Math.floor((ms % hMs) / mMs);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 1) return `${mins}m`;
  if (mins === 1) return `1m`;
  // Under a minute: show seconds (rare; only during final minute)
  const secs = Math.floor((ms % mMs) / 1000);
  if (secs > 0) return `${secs}s left`;
  return null;
}

function updateCountdown() {
  const now = Date.now();
  countdownEls.forEach(el => {
    const deadlineStr = el.getAttribute('data-deadline');
    let deadlineMs;
    if (el.getAttribute('data-tz') === 'CET') {
      // Treat given string as Central European local time (handles DST).
      deadlineMs = parseCentralEuropean(deadlineStr);
    } else {
      deadlineMs = Date.parse(deadlineStr);
    }
    if (isNaN(deadlineMs)) {
      el.textContent = 'invalid deadline';
      el.setAttribute('data-expired', 'true');
      el.setAttribute('aria-label', 'Invalid deadline date');
      return;
    }
    const diff = deadlineMs - now;
    const remaining = formatRemaining(diff);
    if (!remaining) {
      el.textContent = 'Deadline passed';
      el.setAttribute('data-expired', 'true');
      el.setAttribute('aria-label', 'Paper submission deadline has passed');
    } else {
      el.textContent = remaining;
      el.removeAttribute('data-expired');
      el.setAttribute('aria-label', `Time remaining until paper submission deadline: ${remaining}`);
      el.title = `Remaining until deadline: ${remaining}`;
    }
  });
}
if (countdownEls.length) {
  updateCountdown();
  // Update every minute; also a quick 1s tick to smooth display if user opens near rollover
  setInterval(updateCountdown, 60 * 1000);
  setTimeout(updateCountdown, 1000);
}
