/**
 * Connect — Services & Community
 * Lightweight app for connecting with others and local services.
 * No location data unless user opts in or emergency/missing persons.
 */

import { renderHome } from './pages/home.js';
import { renderServices } from './pages/services.js';
import { renderPrivacy } from './pages/privacy.js';
import { renderEmergency } from './pages/emergency.js';
import { renderMissing } from './pages/missing.js';
import { renderHelp211 } from './pages/help211.js';
import { renderShelter } from './pages/shelter.js';
import { renderOutreach } from './pages/outreach.js';
import { renderShareMessage } from './pages/sharemessage.js';
import { renderShareStory } from './pages/sharestory.js';
import { renderAdmin } from './pages/admin.js';
import { renderVolunteer } from './pages/volunteer.js';
import { renderEvents } from './pages/events.js';
import { renderVeterans } from './pages/veterans.js';
import { renderRehab } from './pages/rehab.js';
import { playMenuToggle } from './lib/sounds.js';

const routes = {
  '/': renderHome,
  '/services': renderServices,
  '/privacy': renderPrivacy,
  '/emergency': renderEmergency,
  '/missing': renderMissing,
  '/help211': renderHelp211,
  '/shelter': renderShelter,
  '/outreach': renderOutreach,
  '/volunteer': renderVolunteer,
  '/events': renderEvents,
  '/veterans': renderVeterans,
  '/rehab': renderRehab,
  '/share-message': renderShareMessage,
  '/share-story': renderShareStory,
  '/admin': renderAdmin,
};

const ROUTE_SEO = {
  '/': { title: 'Not Forgotten — Services & Community', description: 'Connect with local services, shelter info, 211, outreach, and community.' },
  '/services': { title: 'Services & Support — Not Forgotten', description: 'Find shelters, soup kitchens, and day centers by location or name.' },
  '/privacy': { title: 'Privacy & Location — Not Forgotten', description: 'How we handle your data and location. Lightweight and private.' },
  '/emergency': { title: 'Emergency — Not Forgotten', description: 'Emergency contacts and quick help.' },
  '/missing': { title: 'Missing Person — Not Forgotten', description: 'Steps and resources when someone is missing.' },
  '/help211': { title: '211 & Help Lines — Not Forgotten', description: 'Call 211 for shelter, meals, and local services.' },
  '/shelter': { title: 'Find Shelter — Not Forgotten', description: 'Shelter availability and 211. Get help finding a place.' },
  '/outreach': { title: 'Outreach — Not Forgotten', description: 'Community messages, events, and ways to volunteer.' },
  '/volunteer': { title: 'Offer Help — Not Forgotten', description: 'Volunteer your time or sign up to help locally.' },
  '/events': { title: 'Events — Not Forgotten', description: 'Upcoming meals, shelter intake, and outreach events.' },
  '/veterans': { title: 'Veterans — Not Forgotten', description: 'Crisis line, VA housing, and resources for veterans.' },
  '/rehab': { title: 'Rehab & Treatment — Not Forgotten', description: 'Overdose emergency, crisis support, and finding substance use treatment.' },
  '/share-message': { title: 'Share a Message — Not Forgotten', description: 'Leave an encouraging message for the community.' },
  '/share-story': { title: 'Share Your Story — Not Forgotten', description: 'Share your experience anonymously.' },
  '/admin': { title: 'Admin — Not Forgotten', description: 'Moderate messages and events.' },
};

function updateDocHead(path) {
  const seo = ROUTE_SEO[path] || ROUTE_SEO['/'];
  document.title = seo.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && seo.description) metaDesc.setAttribute('content', seo.description);
}

function getPath() {
  return window.location.hash.slice(1) || '/';
}

function render() {
  const path = getPath();
  updateDocHead(path);
  const renderFn = routes[path] || renderHome;
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '';
    app.appendChild(renderFn());
  }
}

function navTo(path) {
  window.location.hash = path;
}

window.navTo = navTo;
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-header-btn]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  playMenuToggle();
  const wheel = document.getElementById('header-wheel');
  if (wheel) {
    wheel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', wheel.classList.contains('is-open') ? 'true' : 'false');
    wheel.setAttribute('aria-hidden', wheel.classList.contains('is-open') ? 'false' : 'true');
  }
});
