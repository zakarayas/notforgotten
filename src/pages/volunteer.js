import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';
import { playTap } from '../lib/sounds.js';

export function renderVolunteer() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="OFFER HELP">Offer help</h1>
      <p class="muted" style="margin:0 0 0.5rem 0;">Sign up to leave your availability or the service you want to volunteer. Anyone can submit; listings appear after review.</p>
      <div class="card">
        <button
          type="button"
          class="btn btn-tile events-toggle"
          id="volunteer-toggle"
          aria-expanded="false"
          aria-controls="volunteer-panel"
        >
          <span class="cta-label events-toggle-line">Add</span>
          <span class="cta-label events-toggle-line">availability</span>
          <span class="events-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
        </button>
        <div id="volunteer-panel" class="events-panel">
          <p class="muted" style="margin:0.5rem 0 0.75rem 0; font-size:0.9rem;">Share when you're available or what you'd like to volunteer (meals, driving, supplies, etc.). Your submission will appear after review.</p>
          <form id="volunteer-form" class="missing-notes-form" style="margin-top:0.5rem;">
            <div class="missing-notes-row">
              <label for="volunteer-title">Service or role</label>
              <input id="volunteer-title" type="text" required placeholder="e.g. Meal delivery, Driving, Supplies" />
            </div>
            <div class="missing-notes-row">
              <label for="volunteer-description">Description</label>
              <textarea id="volunteer-description" rows="2" required placeholder="What you can offer, when, or any details."></textarea>
            </div>
            <div class="missing-notes-row">
              <label for="volunteer-date">Date and time available</label>
              <input id="volunteer-date" type="datetime-local" required />
            </div>
            <div class="missing-notes-row">
              <label for="volunteer-city">City</label>
              <input id="volunteer-city" type="text" required placeholder="e.g. Seattle" />
            </div>
            <div class="missing-notes-row">
              <label for="volunteer-phone">Contact phone</label>
              <input id="volunteer-phone" type="tel" placeholder="e.g. (206) 555-0123" />
            </div>
            <div class="missing-notes-row">
              <label for="volunteer-email">Contact email</label>
              <input id="volunteer-email" type="email" required placeholder="e.g. you@example.com" />
            </div>
            <p class="missing-notes-hint" style="margin-top:0.5rem;">Your submission will be reviewed before it appears on the list.</p>
            <p style="margin-top:0.75rem; text-align:center;">
              <button type="submit" class="btn">Submit</button>
            </p>
            <p id="volunteer-form-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
          </form>
        </div>
      </div>
      <div class="card">
        <h2>Volunteer availability</h2>
        <p style="margin:0 0 0.5rem 0;">
          <input
            id="volunteer-search-input"
            type="text"
            placeholder="Search by city, date, or keyword"
            style="width:100%; max-width:100%; padding:0.45rem 0.6rem; border-radius:0.6rem; border:1px solid rgba(148,163,184,0.8); font-size:0.9rem;"
          />
        </p>
        <p id="volunteer-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;"></p>
        <ul id="volunteer-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.75rem;"></ul>
      </div>
      <div class="card">
        <h2>Other ways to help</h2>
        <p style="margin:0 0 0.75rem 0;">Contact your local outreach or search for opportunities.</p>
        <p style="margin-top:0.75rem;">
          <a href="mailto:outreach@example.com?subject=Offer%20to%20help" class="btn btn-tile" data-explain="Opens your email app to send a message to outreach.">
            <span class="cta-label">Email outreach</span>
          </a>
        </p>
        <p style="margin-top:0.5rem;">
          <a href="https://www.volunteermatch.org" target="_blank" rel="noopener" class="btn btn-tile" data-explain="Opens VolunteerMatch to search for local volunteer opportunities.">Search VolunteerMatch</a>
        </p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/outreach" class="btn secondary" data-nav>Back to Outreach</a>
      </p>
    `;

    const formEl = section.querySelector('#volunteer-form');
    const statusEl = section.querySelector('#volunteer-form-status');
    const listEl = section.querySelector('#volunteer-list');
    const loadingEl = section.querySelector('#volunteer-loading');
    const searchInput = section.querySelector('#volunteer-search-input');
    const toggleBtn = section.querySelector('#volunteer-toggle');
    const panelEl = section.querySelector('#volunteer-panel');

    if (toggleBtn && panelEl) {
      toggleBtn.addEventListener('pointerdown', () => playTap());
      toggleBtn.addEventListener('click', () => {
        const isOpen = panelEl.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    const submitBtn = formEl?.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.addEventListener('pointerdown', () => playTap());

    let allVolunteers = [];

    function formatDate(iso) {
      try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
      } catch {
        return iso || '';
      }
    }

    function renderVolunteerRow(v) {
      if (!listEl) return;
      const li = document.createElement('li');
      li.className = 'share-message-bubble';
      li.style.borderLeftColor = 'var(--primary, #f59e0b)';
      const title = document.createElement('p');
      title.className = 'share-message-bubble-text';
      title.style.fontWeight = '600';
      title.style.marginBottom = '0.25rem';
      title.textContent = v.title;
      li.appendChild(title);
      if (v.description) {
        const desc = document.createElement('p');
        desc.className = 'share-message-bubble-text';
        desc.style.marginBottom = '0.25rem';
        desc.textContent = v.description;
        li.appendChild(desc);
      }
      const meta = document.createElement('p');
      meta.className = 'muted share-message-bubble-meta';
      meta.style.fontSize = '0.85rem';
      const parts = [formatDate(v.event_date), v.city];
      if (v.contact_phone) parts.push(v.contact_phone);
      if (v.contact_email) parts.push(v.contact_email);
      meta.textContent = parts.join(' · ');
      li.appendChild(meta);
      listEl.appendChild(li);
    }

    function renderList(items, isFiltering) {
      if (!listEl || !loadingEl) return;
      listEl.innerHTML = '';
      if (!items.length) {
        loadingEl.textContent = isFiltering
          ? 'No results match.'
          : 'No volunteer availability yet. Add one above.';
        return;
      }
      loadingEl.textContent = '';
      items.forEach(renderVolunteerRow);
    }

    function applyFilter() {
      if (!listEl || !loadingEl) return;
      const term = (searchInput?.value || '').trim().toLowerCase();
      if (!term) {
        renderList(allVolunteers, false);
        return;
      }
      const filtered = allVolunteers.filter((v) => {
        const haystack = [
          v.title,
          v.description,
          v.city,
          v.contact_phone,
          v.contact_email,
          formatDate(v.event_date),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
      renderList(filtered, true);
    }

    async function loadVolunteers() {
      if (!listEl || !loadingEl) return;
      loadingEl.textContent = 'Loading…';
      if (!supabase) {
        loadingEl.textContent = 'Not connected. Check your Supabase setup.';
        return;
      }
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('volunteer_availability')
          .select('id, title, description, event_date, city, contact_phone, contact_email')
          .eq('approved', true)
          .gte('event_date', now)
          .order('event_date', { ascending: true })
          .limit(50);
        if (error) throw error;
        allVolunteers = data || [];
        applyFilter();
      } catch (err) {
        console.error(err);
        loadingEl.textContent = 'Could not load volunteer availability.';
      }
    }

    if (formEl && statusEl) {
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = section.querySelector('#volunteer-title')?.value?.trim();
        const description = section.querySelector('#volunteer-description')?.value?.trim() || null;
        const eventDate = section.querySelector('#volunteer-date')?.value;
        const city = section.querySelector('#volunteer-city')?.value?.trim();
        const contact_phone = section.querySelector('#volunteer-phone')?.value?.trim() || null;
        const contact_email = section.querySelector('#volunteer-email')?.value?.trim() || null;
        if (!title || !eventDate || !city) {
          statusEl.textContent = 'Please fill in service/role, date/time, and city.';
          statusEl.style.color = '#b91c1c';
          return;
        }
        if (!supabase) {
          statusEl.textContent = 'Submitting is not available right now.';
          statusEl.style.color = '#b91c1c';
          return;
        }
        statusEl.textContent = 'Submitting…';
        statusEl.style.color = '';
        try {
          const { error } = await supabase.from('volunteer_availability').insert([{
            title,
            description,
            event_date: new Date(eventDate).toISOString(),
            city,
            contact_phone,
            contact_email,
          }]);
          if (error) throw error;
          statusEl.textContent = 'Submitted. It will appear after review.';
          statusEl.style.color = '#16a34a';
          formEl.reset();
          loadVolunteers();
        } catch (err) {
          console.error(err);
          statusEl.textContent = 'Could not submit. Please try again.';
          statusEl.style.color = '#b91c1c';
        }
      });
    }

    if (searchInput) searchInput.addEventListener('input', () => applyFilter());

    loadVolunteers();

    return section;
  };
  return layout(inner);
}
