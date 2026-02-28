import { layout } from '../lib/layout.js';
import { playTap } from '../lib/sounds.js';
import { supabase } from '../lib/supabase.js';
import { has211Api, search211 } from '../lib/api211.js';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function formatUpdatedAt(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString();
  } catch {
    return '—';
  }
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

let allShelters = [];

function renderShelterRow(container, row) {
  const li = document.createElement('li');
  li.style.padding = '0.5rem 0';
  li.style.borderBottom = '1px solid var(--border)';
  li.innerHTML = `
    <strong>${escapeHtml(row.name)}</strong> — ${escapeHtml(row.city)}<br>
    <span class="muted">${row.available_beds} of ${row.total_beds} beds available · Updated ${formatUpdatedAt(row.updated_at)}</span>
    ${row.notes ? `<br><span class="muted" style="font-size:0.85rem;">${escapeHtml(row.notes)}</span>` : ''}
  `;
  container.appendChild(li);
}

function applyShelterFilter(listContainer, loadingEl, term) {
  listContainer.innerHTML = '';
  const q = (term || '').trim().toLowerCase();
  const items = q
    ? allShelters.filter((s) => {
        const haystack = [s.name, s.city, s.notes].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      })
    : allShelters;
  if (!items.length) {
    loadingEl.textContent = q ? 'No shelters match your search.' : 'No shelter availability yet. Add one above or call 211.';
    return;
  }
  loadingEl.textContent = '';
  items.forEach((row) => renderShelterRow(listContainer, row));
}

async function loadShelterAvailability(listContainer, loadingEl, searchInput) {
  if (!listContainer || !loadingEl) return;
  if (!supabase) {
    listContainer.innerHTML = '';
    loadingEl.textContent = 'For current shelter availability, call 211.';
    listContainer.closest('.card')?.insertAdjacentHTML('beforeend', '<p class="muted" style="margin-top:0.5rem;"><a href="#/help211" data-nav>Go to 211 & help</a></p>');
    return;
  }
  loadingEl.textContent = 'Loading…';
  listContainer.innerHTML = '';
  const { data, error } = await supabase
    .from('shelter_availability')
    .select('id, name, city, total_beds, available_beds, notes, updated_at')
    .eq('approved', true)
    .order('updated_at', { ascending: false });
  if (error) {
    loadingEl.textContent = 'Could not load availability. For current options, call 211.';
    return;
  }
  allShelters = data || [];
  applyShelterFilter(listContainer, loadingEl, searchInput?.value?.trim());
}

export function renderShelter() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="FIND SHELTER">Find shelter</h1>
      <p class="muted" style="margin:0 0 1rem 0;">Warm places, overnight shelter, and day centers.</p>
      <div class="card">
        <button type="button" class="btn btn-tile shelter-toggle" id="shelter-toggle" aria-expanded="false" aria-controls="shelter-panel">
          <span class="cta-label">Add</span>
          <span class="cta-label">shelter</span>
          <span class="cta-label">availability</span>
          <span class="shelter-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
        </button>
        <div id="shelter-panel" class="events-panel">
          <p class="muted" style="margin:0.5rem 0 0.75rem 0; font-size:0.9rem;">Facilities: submit current bed availability. It will appear after review.</p>
          <form id="shelter-form" class="missing-notes-form" style="margin-top:0.5rem;">
            <div class="missing-notes-row">
              <label for="shelter-name">Shelter / facility name</label>
              <input id="shelter-name" type="text" required placeholder="e.g. Community Shelter" />
            </div>
            <div class="missing-notes-row">
              <label for="shelter-city">City</label>
              <input id="shelter-city" type="text" required placeholder="e.g. Seattle" />
            </div>
            <div class="missing-notes-row">
              <label for="shelter-total">Total beds</label>
              <input id="shelter-total" type="number" min="0" required placeholder="e.g. 50" />
            </div>
            <div class="missing-notes-row">
              <label for="shelter-available">Available beds now</label>
              <input id="shelter-available" type="number" min="0" required placeholder="e.g. 12" />
            </div>
            <div class="missing-notes-row">
              <label for="shelter-notes">Notes (optional)</label>
              <textarea id="shelter-notes" rows="2" placeholder="Intake times, requirements, contact info."></textarea>
            </div>
            <p class="missing-notes-hint" style="margin-top:0.5rem;">Your submission will be reviewed before it appears on the list.</p>
            <p style="margin-top:0.75rem; text-align:center;">
              <button type="submit" class="btn">Submit availability</button>
            </p>
            <p id="shelter-form-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
          </form>
        </div>
      </div>
      <div class="card" id="shelter-live-card">
        <h2>Live availability</h2>
        <p style="margin:0 0 0.5rem 0;">
          <input
            id="shelter-search-input"
            type="text"
            placeholder="Search by name or city"
            style="width:100%; max-width:100%; padding:0.45rem 0.6rem; border-radius:0.6rem; border:1px solid rgba(148,163,184,0.8); font-size:0.9rem;"
          />
        </p>
        <p id="shelter-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;"></p>
        <ul id="shelter-availability-list" style="list-style:none; margin:0; padding:0;"></ul>
        <p style="margin-top:0.75rem;">
          <button type="button" class="btn secondary" id="shelter-refresh-btn">Refresh availability</button>
        </p>
      </div>
      <div class="card" id="shelter-211-card">
        <h2>From 211</h2>
        <p class="muted" style="margin:0 0 0.5rem 0;" id="shelter-211-desc">211 has detailed shelter and warming/cooling center data. Call 211 for current options.</p>
        <div id="shelter-211-actions"></div>
        <div id="shelter-211-results"></div>
      </div>
      <div class="card">
        <h2>211 for shelter</h2>
        <p style="margin-top:0.75rem;"><a href="#/help211" class="btn btn-tile" data-nav data-explain="Call 211 for up-to-date shelter availability, warming centers, and intake requirements in your area.">Go to 211 &amp; help</a></p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;

    const listEl = section.querySelector('#shelter-availability-list');
    const loadingEl = section.querySelector('#shelter-loading');
    const searchInput = section.querySelector('#shelter-search-input');
    const refreshBtn = section.querySelector('#shelter-refresh-btn');
    const toggleBtn = section.querySelector('#shelter-toggle');
    const shelterPanel = section.querySelector('#shelter-panel');
    const formEl = section.querySelector('#shelter-form');
    const formStatus = section.querySelector('#shelter-form-status');

    if (toggleBtn && shelterPanel) {
      toggleBtn.addEventListener('pointerdown', () => playTap());
      toggleBtn.addEventListener('click', () => {
        const isOpen = shelterPanel.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    const load = () => loadShelterAvailability(listEl, loadingEl, searchInput);
    refreshBtn.addEventListener('click', () => {
      playTap();
      load();
    });
    if (searchInput) {
      searchInput.addEventListener('input', () => applyShelterFilter(listEl, loadingEl, searchInput.value));
    }

    if (formEl && formStatus) {
      formEl.querySelector('button[type="submit"]')?.addEventListener('pointerdown', () => playTap());
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = section.querySelector('#shelter-name')?.value?.trim();
        const city = section.querySelector('#shelter-city')?.value?.trim();
        const total = parseInt(section.querySelector('#shelter-total')?.value, 10);
        const available = parseInt(section.querySelector('#shelter-available')?.value, 10);
        const notes = section.querySelector('#shelter-notes')?.value?.trim() || null;
        if (!name || !city || Number.isNaN(total) || Number.isNaN(available)) {
          formStatus.textContent = 'Please fill in name, city, total beds, and available beds.';
          formStatus.style.color = '#b91c1c';
          return;
        }
        if (!supabase) {
          formStatus.textContent = 'Submitting is not available right now.';
          formStatus.style.color = '#b91c1c';
          return;
        }
        formStatus.textContent = 'Submitting…';
        formStatus.style.color = '';
        try {
          const { error } = await supabase.from('shelter_availability').insert([{
            name,
            city,
            total_beds: total,
            available_beds: available,
            notes,
          }]);
          if (error) throw error;
          formStatus.textContent = 'Submitted. It will appear after review.';
          formStatus.style.color = '#16a34a';
          formEl.reset();
          load();
        } catch (err) {
          console.error(err);
          formStatus.textContent = 'Could not submit. Please try again.';
          formStatus.style.color = '#b91c1c';
        }
      });
    }

    load();
    let refreshTimer = null;
    const scheduleRefresh = () => {
      if (refreshTimer) clearInterval(refreshTimer);
      refreshTimer = setInterval(load, REFRESH_INTERVAL_MS);
    };
    scheduleRefresh();

    const card211 = section.querySelector('#shelter-211-card');
    const desc211 = section.querySelector('#shelter-211-desc');
    const actions211 = section.querySelector('#shelter-211-actions');
    const results211 = section.querySelector('#shelter-211-results');
    if (card211 && actions211) {
      if (has211Api) {
        if (desc211) desc211.textContent = 'Search 211 for shelters and warming centers near you.';
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.className = 'btn';
        searchBtn.textContent = 'Search shelters near me';
        searchBtn.addEventListener('pointerdown', () => playTap());
        searchBtn.addEventListener('click', async () => {
          if (!navigator.geolocation) {
            results211.innerHTML = '<p class="muted">Location is not available. Call 211 for shelter options.</p>';
            return;
          }
          results211.innerHTML = '<p class="muted">Getting location…</p>';
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              results211.innerHTML = '<p class="muted">Searching 211…</p>';
              const { results, error } = await search211(
                { lat: pos.coords.latitude, lon: pos.coords.longitude },
                { keyword: 'shelter', radiusMiles: 25 }
              );
              if (error) {
                results211.innerHTML = `<p class="muted">${escapeHtml(error)}</p><p style="margin-top:0.5rem;"><a href="#/help211" data-nav>Go to 211 & help</a></p>`;
                return;
              }
              const list = Array.isArray(results) ? results : results?.resources || results?.services || [];
              if (!list.length) {
                results211.innerHTML = '<p class="muted">No 211 results for this area. Call 211 for current options.</p><p style="margin-top:0.5rem;"><a href="#/help211" data-nav>Go to 211 & help</a></p>';
                return;
              }
              let html = '<ul style="list-style:none; margin:0.5rem 0 0 0; padding:0;">';
              list.slice(0, 15).forEach((r) => {
                const name = r.name || r.organization?.name || r.resource_name || 'Shelter';
                const phone = r.phones?.[0]?.number || r.phone || '';
                const addr = r.addresses?.[0]?.address_line_1 || r.address || '';
                html += `<li style="padding:0.4rem 0; border-bottom:1px solid var(--border);"><strong>${escapeHtml(name)}</strong>${phone ? `<br><span class="muted">${escapeHtml(phone)}</span>` : ''}${addr ? `<br><span class="muted">${escapeHtml(addr)}</span>` : ''}</li>`;
              });
              html += '</ul>';
              if (list.length > 15) html += '<p class="muted" style="margin-top:0.5rem;">Call 211 for more options.</p>';
              html += '<p style="margin-top:0.5rem;"><a href="#/help211" data-nav>Go to 211 & help</a></p>';
              results211.innerHTML = html;
            },
            () => {
              results211.innerHTML = '<p class="muted">Location was denied. Call 211 for shelter options.</p><p style="margin-top:0.5rem;"><a href="#/help211" data-nav>Go to 211 & help</a></p>';
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
          );
        });
        actions211.appendChild(searchBtn);
        actions211.insertAdjacentHTML('beforeend', ' <a href="#/help211" class="btn secondary" data-nav>Go to 211 & help</a>');
      } else {
        actions211.innerHTML = '<a href="#/help211" class="btn btn-tile" data-nav>Go to 211 & help</a>';
      }
    }

    return section;
  };
  return layout(inner);
}
