import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';
import { playTap } from '../lib/sounds.js';

export function renderEvents() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="EVENTS">Events</h1>
      <p class="muted" style="margin:0 0 0.5rem 0;">Upcoming meals, shelter intake, and outreach events. Add one if you’re hosting.</p>
      <div class="events-warning-row" style="display:flex; align-items:flex-start; gap:0.5rem; margin:0 0 1rem 0;">
        <span class="events-warning-icon" aria-hidden="true" style="flex-shrink:0; margin-top:0.15rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--warn, #d97706);">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <p class="muted" style="margin:0; font-size:0.85rem;">
          Events are submitted by community members and organizations. Not Forgotten does not endorse or have official affiliation with any specific event or group&mdash;choose wisely.
        </p>
      </div>
      <div class="card">
        <button
          type="button"
          class="btn btn-tile events-toggle"
          id="events-toggle"
          aria-expanded="false"
          aria-controls="events-panel"
        >
          <span class="cta-label events-toggle-line">Add</span>
          <span class="cta-label events-toggle-line">an</span>
          <span class="cta-label events-toggle-line">Event</span>
          <span class="events-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
        </button>
        <div id="events-panel" class="events-panel">
          <p class="muted" style="margin:0.5rem 0 0.75rem 0; font-size:0.9rem;">Outreach volunteers and facilities: list your upcoming event so people can find it. Events appear after review.</p>
          <form id="events-form" class="missing-notes-form" style="margin-top:0.5rem;">
            <div class="missing-notes-row">
              <label for="event-title">Event name</label>
              <input id="event-title" type="text" required placeholder="e.g. Community meal, Tuesday dinner" />
            </div>
            <div class="missing-notes-row">
              <label for="event-description">Description</label>
              <textarea id="event-description" rows="2" required placeholder="Time, address, what to expect, who it’s for."></textarea>
            </div>
            <div class="missing-notes-row">
              <label for="event-date">Date and time</label>
              <input id="event-date" type="datetime-local" required />
            </div>
            <div class="missing-notes-row">
              <label for="event-city">City</label>
              <input id="event-city" type="text" required placeholder="e.g. Seattle" />
            </div>
            <div class="missing-notes-row">
              <label for="event-phone">Contact phone</label>
              <input id="event-phone" type="tel" placeholder="e.g. (206) 555-0123" />
            </div>
            <div class="missing-notes-row">
              <label for="event-email">Contact email</label>
              <input id="event-email" type="email" required placeholder="e.g. outreach@example.com" />
            </div>
            <p class="missing-notes-hint" style="margin-top:0.5rem;">Your event will be reviewed before it appears on the list.</p>
            <p style="margin-top:0.75rem; text-align:center;">
              <button type="submit" class="btn">Submit event</button>
            </p>
            <p id="events-form-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
          </form>
        </div>
      </div>
      <div class="card">
        <h2>Upcoming events</h2>
        <p style="margin:0 0 0.5rem 0;">
          <input
            id="events-search-input"
            type="text"
            placeholder="Search by city, date, or keyword"
            style="width:100%; max-width:100%; padding:0.45rem 0.6rem; border-radius:0.6rem; border:1px solid rgba(148,163,184,0.8); font-size:0.9rem;"
          />
        </p>
        <p id="events-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;"></p>
        <ul id="events-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.75rem;"></ul>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/outreach" class="btn secondary" data-nav>Back to Outreach</a>
      </p>
    `;

    const formEl = section.querySelector('#events-form');
    const statusEl = section.querySelector('#events-form-status');
    const listEl = section.querySelector('#events-list');
    const loadingEl = section.querySelector('#events-loading');
    const searchInput = section.querySelector('#events-search-input');
    const toggleBtn = section.querySelector('#events-toggle');
    const panelEl = section.querySelector('#events-panel');

    if (toggleBtn && panelEl) {
      toggleBtn.addEventListener('pointerdown', () => playTap());
      toggleBtn.addEventListener('click', () => {
        const isOpen = panelEl.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    const submitBtn = formEl?.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.addEventListener('pointerdown', () => playTap());

    let allEvents = [];

    function formatEventDate(iso) {
      try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
      } catch {
        return iso || '';
      }
    }

    function renderEvent(ev) {
      if (!listEl) return;
      const li = document.createElement('li');
      li.className = 'share-message-bubble';
      li.style.borderLeftColor = 'var(--primary, #f59e0b)';
      const title = document.createElement('p');
      title.className = 'share-message-bubble-text';
      title.style.fontWeight = '600';
      title.style.marginBottom = '0.25rem';
      title.textContent = ev.title;
      li.appendChild(title);
      if (ev.description) {
        const desc = document.createElement('p');
        desc.className = 'share-message-bubble-text';
        desc.style.marginBottom = '0.25rem';
        desc.textContent = ev.description;
        li.appendChild(desc);
      }
      const meta = document.createElement('p');
      meta.className = 'muted share-message-bubble-meta';
      meta.style.fontSize = '0.85rem';
      const parts = [formatEventDate(ev.event_date), ev.city];
      if (ev.contact_phone) parts.push(ev.contact_phone);
      if (ev.contact_email) parts.push(ev.contact_email);
      meta.textContent = parts.join(' · ');
      li.appendChild(meta);
      listEl.appendChild(li);
    }

    function renderEventsList(items, isFiltering) {
      if (!listEl || !loadingEl) return;
      listEl.innerHTML = '';
      if (!items.length) {
        loadingEl.textContent = isFiltering
          ? 'No events match what you typed.'
          : 'No upcoming events yet. Add one above.';
        return;
      }
      loadingEl.textContent = '';
      items.forEach(renderEvent);
    }

    function applyFilter() {
      if (!listEl || !loadingEl) return;
      const term = (searchInput?.value || '').trim().toLowerCase();
      if (!term) {
        renderEventsList(allEvents, false);
        return;
      }
      const filtered = allEvents.filter((ev) => {
        const haystack = [
          ev.title,
          ev.description,
          ev.city,
          ev.contact_phone,
          ev.contact_email,
          formatEventDate(ev.event_date),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
      renderEventsList(filtered, true);
    }

    async function loadEvents() {
      if (!listEl || !loadingEl) return;
      loadingEl.textContent = 'Loading…';
      if (!supabase) {
        loadingEl.textContent = 'Events are not connected. Check your Supabase setup.';
        return;
      }
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('events')
          .select('id, title, description, event_date, city, contact_phone, contact_email')
          .eq('approved', true)
          .gte('event_date', now)
          .order('event_date', { ascending: true })
          .limit(50);
        if (error) throw error;
        allEvents = data || [];
        applyFilter();
      } catch (err) {
        console.error(err);
        loadingEl.textContent = 'Could not load events.';
      }
    }

    if (formEl && statusEl) {
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = section.querySelector('#event-title')?.value?.trim();
        const description = section.querySelector('#event-description')?.value?.trim() || null;
        const eventDate = section.querySelector('#event-date')?.value;
        const city = section.querySelector('#event-city')?.value?.trim();
        const contact_phone = section.querySelector('#event-phone')?.value?.trim() || null;
        const contact_email = section.querySelector('#event-email')?.value?.trim() || null;
        if (!title || !eventDate || !city) {
          statusEl.textContent = 'Please fill in event name, date/time, and city.';
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
          const { error } = await supabase.from('events').insert([{
            title,
            description,
            event_date: new Date(eventDate).toISOString(),
            city,
            contact_phone,
            contact_email,
          }]);
          if (error) throw error;
          statusEl.textContent = 'Event submitted. It will appear after review.';
          statusEl.style.color = '#16a34a';
          formEl.reset();
          loadEvents();
        } catch (err) {
          console.error(err);
          statusEl.textContent = 'Could not submit. Please try again.';
          statusEl.style.color = '#b91c1c';
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        applyFilter();
      });
    }

    loadEvents();

    return section;
  };
  return layout(inner);
}

