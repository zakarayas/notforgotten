import { layout } from '../lib/layout.js';

const emergencyIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const missingPersonIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="11" r="5.2"/>
  <circle cx="12" cy="9.6" r="1.7"/>
  <path d="M9 14c.6-1.8 1.6-2.8 3-2.8s2.4 1 3 2.8"/>
  <line x1="15.5" y1="14.5" x2="20" y2="19"/>
</svg>`;
const shelterIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const servicesIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
const help211Icon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const outreachIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="8" cy="11" r="2.2"/>
  <circle cx="16" cy="11" r="2.2"/>
  <circle cx="12" cy="8" r="2.2"/>
  <path d="M4 19c0-2.4 2-4.4 4.4-4.4s4.4 2 4.4 4.4"/>
  <path d="M11.2 19c0-2.4 2-4.4 4.4-4.4S20 16.6 20 19"/>
</svg>`;
const veteranIcon = `<span class="icon-dogtags-wrap"><img src="${import.meta.env.BASE_URL}dogtags-icon.png?v=2" alt="" class="icon-dogtags" width="28" height="28"/></span>`;
const rehabIcon = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;

const testimonials = [
  { quote: 'Found a warm place same night. So grateful this exists.', name: '— J.' },
  { quote: 'Called 211 from here and got connected to shelter. Simple and private.', name: '— M.' },
  { quote: 'No fluff, no sign-up. Just what I needed when I needed it.', name: '— K.' },
  { quote: 'Used it on a slow connection. It actually loaded.', name: '— R.' },
];

const positiveReviewIcon = `<svg class="testimonial-positive-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`;

const TESTIMONIAL_READ_MS = 6000;
const TESTIMONIAL_FADE_MS = 800;
const TESTIMONIAL_TYPING_MS = 65;

function typeWriter(el, fullText, speedMs, onComplete) {
  if (el._typingTimer) clearTimeout(el._typingTimer);
  let idx = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  function step() {
    if (idx <= fullText.length) {
      el.textContent = fullText.slice(0, idx);
      el.appendChild(cursor);
      idx++;
      el._typingTimer = setTimeout(step, speedMs);
    } else {
      cursor.remove();
      el.textContent = fullText;
      el._typingTimer = null;
      if (typeof onComplete === 'function') onComplete();
    }
  }
  step();
}

function startTestimonialRotator(section) {
  const slot = section.querySelector('.testimonial-slot');
  const quoteEl = slot?.querySelector('.testimonial-quote');
  const nameEl = slot?.querySelector('.testimonial-name');
  if (!slot || !quoteEl || !nameEl || !testimonials.length) return;

  let idx = 0;

  function showCurrentAndType() {
    const t = testimonials[idx];
    quoteEl.textContent = '';
    nameEl.textContent = '';
    const fullText = `"${t.quote}"`;
    typeWriter(quoteEl, fullText, TESTIMONIAL_TYPING_MS, () => {
      nameEl.textContent = t.name;
      slot._holdTimer = setTimeout(cycle, TESTIMONIAL_READ_MS);
    });
  }

  function cycle() {
    if (slot._holdTimer) {
      clearTimeout(slot._holdTimer);
      slot._holdTimer = null;
    }
    if (quoteEl._typingTimer) {
      clearTimeout(quoteEl._typingTimer);
      quoteEl._typingTimer = null;
    }
    slot.classList.add('testimonial-fade-out');
    setTimeout(() => {
      idx = (idx + 1) % testimonials.length;
      quoteEl.textContent = '';
      nameEl.textContent = '';
      slot.classList.remove('testimonial-fade-out');
      requestAnimationFrame(() => {
        requestAnimationFrame(showCurrentAndType);
      });
    }, TESTIMONIAL_FADE_MS);
  }

  showCurrentAndType();
}

export function renderHome() {
  const inner = () => {
    const section = document.createElement('div');
    section.className = 'home-wrap';
    section.innerHTML = `
      <div class="home-main">
        <div class="hero">
          <h1 class="app-title"><span class="word-not">NO<span class="letter-t">T</span></span> <span class="word-forgotten">F<span class="letter-o">O</span>rg<span class="letter-o">O</span>tten.</span></h1>
          <p>Welcome. Here you can contact 911/emergency services, report a missing person, find shelter, get in contact with local services and more.</p>
        </div>
        <section class="testimonials testimonials--rotator" aria-label="Testimonials">
          <div class="testimonial-slot">
            <div class="testimonial-bubble">
              <p class="testimonial-quote"></p>
            </div>
            <div class="testimonial-meta">
              <span class="testimonial-positive">${positiveReviewIcon}</span>
              <p class="testimonial-name"></p>
            </div>
          </div>
        </section>
        <p class="muted" style="margin:0 0 0.7rem 0; font-size:0.9rem; text-align:center;">
          <a href="#/share-story" data-nav>Share your experience</a>
        </p>
        <div class="cta-grid cta-grid--eight">
          <a href="#/emergency" class="btn btn-tile btn-standout" data-nav>
            <span class="cta-label">Emergency</span>
            <span class="cta-icon" aria-hidden="true">${emergencyIcon}</span>
          </a>
          <a href="#/missing" class="btn btn-tile btn-missing" data-nav>
            <span class="cta-label">Missing person</span>
            <span class="cta-icon" aria-hidden="true">${missingPersonIcon}</span>
          </a>
          <a href="#/shelter" class="btn btn-tile" data-nav>
            <span class="cta-label">Find shelter</span>
            <span class="cta-icon" aria-hidden="true">${shelterIcon}</span>
          </a>
          <a href="#/outreach" class="btn btn-tile" data-nav>
            <span class="cta-label">Outreach</span>
            <span class="cta-icon" aria-hidden="true">${outreachIcon}</span>
          </a>
          <a href="#/veterans" class="btn btn-tile" data-nav>
            <span class="cta-label">Veterans</span>
            <span class="cta-icon" aria-hidden="true">${veteranIcon}</span>
          </a>
          <a href="#/rehab" class="btn btn-tile" data-nav>
            <span class="cta-label">Rehab &amp; treatment</span>
            <span class="cta-icon" aria-hidden="true">${rehabIcon}</span>
          </a>
          <a href="#/services" class="btn btn-tile" data-nav>
            <span class="cta-label">Services</span>
            <span class="cta-icon" aria-hidden="true">${servicesIcon}</span>
          </a>
          <a href="#/help211" class="btn btn-tile" data-nav>
            <span class="cta-label">211 &amp; Hotlines</span>
            <span class="cta-icon" aria-hidden="true">${help211Icon}</span>
          </a>
        </div>
      </div>
    `;
    startTestimonialRotator(section);
    return section;
  };
  return layout(inner);
}
