/**
 * Shared layout: header + main content.
 * No location data collected in the shell.
 */
import { playTap } from './sounds.js';
import { initWeatherBanner } from './weatherBanner.js';

const WHEEL_OPTIONS = [
  {
    path: '/',
    label: 'Home',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11L12 3l9 8"/><path d="M5 10v10h14V10"/></svg></span>',
  },
  {
    path: '/emergency',
    label: 'Emergency',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v6"/><path d="M12 16h.01"/></svg></span>',
  },
  {
    path: '/missing',
    label: 'Missing person',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="5.2"/><circle cx="12" cy="9.6" r="1.7"/><path d="M9 14c.6-1.8 1.6-2.8 3-2.8s2.4 1 3 2.8"/><line x1="15.5" y1="14.5" x2="20" y2="19"/></svg></span>',
  },
  {
    path: '/shelter',
    label: 'Find shelter',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18"/><path d="M5 10v8h14v-8"/><path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/></svg></span>',
  },
  {
    path: '/outreach',
    label: 'Outreach',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="9" r="2"/><circle cx="16" cy="9" r="2"/><circle cx="12" cy="7" r="2"/><path d="M4 17c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M12 17c0-2.2 1.8-4 4-4s4 1.8 4 4"/></svg></span>',
  },
  {
    path: '/events',
    label: 'Events',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>',
  },
  {
    path: '/veterans',
    label: 'Veterans',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><span class="icon-dogtags-wrap"><img src="' + import.meta.env.BASE_URL + 'dogtags-icon.png?v=2" alt="" class="icon-dogtags" width="16" height="16"/></span></span>',
  },
  {
    path: '/services',
    label: 'Services',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>',
  },
  {
    path: '/rehab',
    label: 'Rehab & treatment',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg></span>',
  },
  {
    path: '/privacy',
    label: 'Privacy & location',
    icon: '<span class="header-wheel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10z"/><path d="M9 11a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/></svg></span>',
  },
];

export function layout(inner) {
  const fragment = document.createDocumentFragment();

  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="header-inner">
      <button type="button" class="header-btn logo header-title" data-header-btn aria-expanded="false" aria-haspopup="dialog" aria-controls="header-wheel" aria-label="Menu" aria-describedby="header-tooltip">
        <img src="${import.meta.env.BASE_URL}door-button.png" alt="" class="header-door-img" width="120" height="120" />
      </button>
      <span class="header-tooltip" role="tooltip" id="header-tooltip" aria-label="Help starts here">
        <span class="header-tooltip-line">Help</span>
        <span class="header-tooltip-line">starts</span>
        <span class="header-tooltip-line">here</span>
      </span>
    </div>
  `;

  let headerScrollTimeout;
  const handleScroll = () => {
    header.classList.add('header--highlight');
    if (headerScrollTimeout) {
      clearTimeout(headerScrollTimeout);
    }
    headerScrollTimeout = setTimeout(() => {
      header.classList.remove('header--highlight');
    }, 200);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  const wheel = document.createElement('div');
  wheel.className = 'header-wheel';
  wheel.id = 'header-wheel';
  wheel.setAttribute('role', 'dialog');
  wheel.setAttribute('aria-label', 'Menu');
  const currentPath = (window.location.hash.slice(1) || '/').replace(/^#/, '') || '/';
  wheel.innerHTML = `
    <div class="header-wheel-scroll">
      ${WHEEL_OPTIONS.map((o) => {
        const isCurrent = o.path === currentPath;
        const isEmergency = o.label === 'Emergency';
        const isMissing = o.label === 'Missing person';
        const icon = o.icon || '';
        return `<a href="#${o.path}" class="header-wheel-option${isCurrent ? ' is-current' : ''}${isEmergency ? ' is-emergency' : ''}${isMissing ? ' is-missing' : ''}" data-wheel-option data-path="${o.path}"><span class="header-wheel-option-inner"><span class="header-wheel-label">${o.label}</span>${icon}</span></a>`;
      }).join('')}
    </div>
  `;

  fragment.appendChild(header);
  fragment.appendChild(wheel);

  wheel.querySelectorAll('[data-wheel-option]').forEach((el) => {
    el.addEventListener('pointerdown', () => {
      playTap();
    });
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.navTo(el.getAttribute('href').slice(1));
      const w = document.getElementById('header-wheel');
      const b = document.querySelector('[data-header-btn]');
      if (w) w.classList.remove('is-open');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (w) w.setAttribute('aria-hidden', 'true');
    });
  });

  const main = document.createElement('main');
  main.className = 'page';
  if (typeof inner === 'function') {
    main.append(inner());
  } else if (inner instanceof Node) {
    main.appendChild(inner);
  } else if (inner) {
    main.appendChild(inner);
  }
  initWeatherBanner(main);

  // Delegated [data-nav]: SPA navigation + tap sound for all in-page nav links (including dynamic content).
  main.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a')) playTap();
  });
  main.addEventListener('click', (e) => {
    const a = e.target.closest('[data-nav]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href) window.navTo((href.replace(/^#/, '') || '/').replace(/^\/?/, '/'));
  });

  fragment.appendChild(main);

  // Attach explain-on-hover tooltips for buttons that opt in.
  setupExplainPopovers(main);

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <a href="#/privacy">Privacy &amp; location</a>
  `;
  const footerLink = footer.querySelector('a');
  footerLink.addEventListener('pointerdown', () => {
    playTap();
  });
  footerLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.navTo('/privacy');
  });
  fragment.appendChild(footer);

  return fragment;
}

function setupExplainPopovers(root) {
  let pop = document.querySelector('.explain-popover');
  if (!pop) {
    pop = document.createElement('div');
    pop.className = 'explain-popover';
    document.body.appendChild(pop);
  }
  const hide = () => {
    pop.classList.remove('is-visible');
  };
  const showFor = (el) => {
    const text = el.getAttribute('data-explain');
    if (!text) return;
    pop.textContent = text;
    const rect = el.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    const top = rect.top + (rect.height / 2) - (popRect.height / 2);
    let left = rect.right + 10;
    if (left + popRect.width + 8 > window.innerWidth) {
      left = rect.left - popRect.width - 10;
    }
    pop.style.top = `${Math.max(8, Math.min(top, window.innerHeight - popRect.height - 8))}px`;
    pop.style.left = `${Math.max(8, left)}px`;
    pop.classList.add('is-visible');
  };

  root.querySelectorAll('[data-explain]').forEach((el) => {
    el.addEventListener('mouseenter', () => showFor(el));
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', () => showFor(el));
    el.addEventListener('blur', hide);
  });

  window.addEventListener('scroll', hide, { passive: true });
}

