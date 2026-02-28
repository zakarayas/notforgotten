import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';
import { playTap } from '../lib/sounds.js';

export function renderAdmin() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1>Admin</h1>
      <div id="admin-login-card" class="card">
        <h2>Sign in</h2>
        <p class="muted" style="margin:0 0 0.75rem 0; font-size:0.9rem;">Use your admin account to approve or remove messages and events.</p>
        <form id="admin-login-form" class="missing-notes-form" style="margin-top:0.75rem;">
          <div class="missing-notes-row">
            <label for="admin-email">Email</label>
            <input id="admin-email" type="email" required placeholder="admin@example.com" />
          </div>
          <div class="missing-notes-row">
            <label for="admin-password">Password</label>
            <input id="admin-password" type="password" required placeholder="••••••••" />
          </div>
          <p style="margin-top:0.5rem;">
            <button type="submit" class="btn">Sign in</button>
          </p>
          <p id="admin-login-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
        </form>
      </div>
      <div id="admin-panel" class="card" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="margin:0;">Messages</h2>
          <button type="button" id="admin-sign-out" class="btn secondary">Sign out</button>
        </div>
        <p id="admin-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;">Loading…</p>
        <ul id="admin-message-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.5rem;"></ul>
        <hr style="border:none; border-top:1px solid rgba(148, 163, 184, 0.4); margin:1rem 0;" />
        <div>
          <h2 style="margin:0 0 0.25rem 0;">Events</h2>
          <p id="admin-events-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;">Loading…</p>
          <ul id="admin-events-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.5rem;"></ul>
        </div>
        <hr style="border:none; border-top:1px solid rgba(148, 163, 184, 0.4); margin:1rem 0;" />
        <div>
          <h2 style="margin:0 0 0.25rem 0;">Shelter availability</h2>
          <p id="admin-shelter-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;">Loading…</p>
          <ul id="admin-shelter-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.5rem;"></ul>
        </div>
        <hr style="border:none; border-top:1px solid rgba(148, 163, 184, 0.4); margin:1rem 0;" />
        <div>
          <h2 style="margin:0 0 0.25rem 0;">Volunteer availability</h2>
          <p id="admin-volunteer-loading" class="muted" style="margin:0 0 0.5rem 0; font-size:0.85rem;">Loading…</p>
          <ul id="admin-volunteer-list" style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0.5rem;"></ul>
        </div>
      </div>
    `;

    const loginCard = section.querySelector('#admin-login-card');
    const loginForm = section.querySelector('#admin-login-form');
    const loginStatus = section.querySelector('#admin-login-status');
    const panel = section.querySelector('#admin-panel');
    const listEl = section.querySelector('#admin-message-list');
    const loadingEl = section.querySelector('#admin-loading');
    const eventsListEl = section.querySelector('#admin-events-list');
    const eventsLoadingEl = section.querySelector('#admin-events-loading');
    const shelterListEl = section.querySelector('#admin-shelter-list');
    const shelterLoadingEl = section.querySelector('#admin-shelter-loading');
    const volunteerListEl = section.querySelector('#admin-volunteer-list');
    const volunteerLoadingEl = section.querySelector('#admin-volunteer-loading');
    const signOutBtn = section.querySelector('#admin-sign-out');

    function showLogin() {
      if (loginCard) loginCard.style.display = '';
      if (panel) panel.style.display = 'none';
    }

    function showPanel() {
      if (loginCard) loginCard.style.display = 'none';
      if (panel) panel.style.display = '';
    }

    function renderMessageRow(msg) {
      const li = document.createElement('li');
      li.dataset.id = msg.id;
      li.style.padding = '0.6rem 0.75rem';
      li.style.borderRadius = '0.75rem';
      li.style.background = msg.approved ? 'rgba(22, 163, 74, 0.08)' : 'rgba(251, 191, 36, 0.12)';
      li.style.border = '1px solid ' + (msg.approved ? 'rgba(22, 163, 74, 0.3)' : 'rgba(251, 191, 36, 0.4)');
      const top = document.createElement('div');
      top.style.display = 'flex';
      top.style.justifyContent = 'space-between';
      top.style.alignItems = 'flex-start';
      top.style.gap = '0.5rem';
      top.style.marginBottom = '0.25rem';
      const meta = document.createElement('span');
      meta.className = 'muted';
      meta.style.fontSize = '0.8rem';
      try {
        meta.textContent = new Date(msg.created_at).toLocaleString() + (msg.name_or_initials ? ` · ${msg.name_or_initials}` : '');
      } catch {
        meta.textContent = msg.name_or_initials || '';
      }
      const badge = document.createElement('span');
      badge.style.fontSize = '0.7rem';
      badge.style.padding = '0.15rem 0.4rem';
      badge.style.borderRadius = '4px';
      badge.style.fontWeight = '600';
      if (msg.approved) {
        badge.textContent = 'Approved';
        badge.style.background = 'rgba(22, 163, 74, 0.2)';
        badge.style.color = '#15803d';
      } else {
        badge.textContent = 'Pending';
        badge.style.background = 'rgba(217, 119, 6, 0.2)';
        badge.style.color = '#b45309';
      }
      top.appendChild(meta);
      top.appendChild(badge);
      li.appendChild(top);
      const body = document.createElement('p');
      body.style.margin = '0 0 0.5rem 0';
      body.style.fontSize = '0.95rem';
      body.textContent = msg.text;
      li.appendChild(body);
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.flexWrap = 'wrap';
      if (!msg.approved) {
        const approveBtn = document.createElement('button');
        approveBtn.type = 'button';
        approveBtn.className = 'btn';
        approveBtn.textContent = 'Approve';
        approveBtn.style.fontSize = '0.85rem';
        approveBtn.style.padding = '0.35rem 0.75rem';
        approveBtn.addEventListener('pointerdown', () => playTap());
        approveBtn.addEventListener('click', () => approveMessage(msg.id));
        actions.appendChild(approveBtn);
      }
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn secondary';
      removeBtn.textContent = 'Remove';
      removeBtn.style.fontSize = '0.85rem';
      removeBtn.style.padding = '0.35rem 0.75rem';
      removeBtn.addEventListener('pointerdown', () => playTap());
      removeBtn.addEventListener('click', () => removeMessage(msg.id, li));
      actions.appendChild(removeBtn);
      li.appendChild(actions);
      return li;
    }

    function renderEventRow(ev) {
      const li = document.createElement('li');
      li.dataset.id = ev.id;
      li.style.padding = '0.6rem 0.75rem';
      li.style.borderRadius = '0.75rem';
      li.style.background = ev.approved ? 'rgba(22, 163, 74, 0.08)' : 'rgba(59, 130, 246, 0.06)';
      li.style.border = '1px solid ' + (ev.approved ? 'rgba(22, 163, 74, 0.3)' : 'rgba(59, 130, 246, 0.35)');

      const top = document.createElement('div');
      top.style.display = 'flex';
      top.style.justifyContent = 'space-between';
      top.style.alignItems = 'flex-start';
      top.style.gap = '0.5rem';
      top.style.marginBottom = '0.25rem';

      const meta = document.createElement('span');
      meta.className = 'muted';
      meta.style.fontSize = '0.8rem';
      try {
        meta.textContent =
          new Date(ev.event_date || ev.created_at).toLocaleString() +
          (ev.city ? ` · ${ev.city}` : '');
      } catch {
        meta.textContent = ev.city || '';
      }

      const badge = document.createElement('span');
      badge.style.fontSize = '0.7rem';
      badge.style.padding = '0.15rem 0.4rem';
      badge.style.borderRadius = '4px';
      badge.style.fontWeight = '600';
      if (ev.approved) {
        badge.textContent = 'Approved';
        badge.style.background = 'rgba(22, 163, 74, 0.2)';
        badge.style.color = '#15803d';
      } else {
        badge.textContent = 'Pending';
        badge.style.background = 'rgba(59, 130, 246, 0.18)';
        badge.style.color = '#1d4ed8';
      }

      top.appendChild(meta);
      top.appendChild(badge);
      li.appendChild(top);

      const title = document.createElement('p');
      title.style.margin = '0 0 0.25rem 0';
      title.style.fontSize = '0.96rem';
      title.style.fontWeight = '600';
      title.textContent = ev.title || '(No title)';
      li.appendChild(title);

      if (ev.description) {
        const desc = document.createElement('p');
        desc.style.margin = '0 0 0.4rem 0';
        desc.style.fontSize = '0.9rem';
        desc.textContent = ev.description;
        li.appendChild(desc);
      }

      const contact = document.createElement('p');
      contact.className = 'muted';
      contact.style.margin = '0 0 0.4rem 0';
      contact.style.fontSize = '0.8rem';
      const parts = [];
      if (ev.contact_phone) parts.push(ev.contact_phone);
      if (ev.contact_email) parts.push(ev.contact_email);
      contact.textContent = parts.join(' · ');
      li.appendChild(contact);

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.flexWrap = 'wrap';
      if (!ev.approved) {
        const approveBtn = document.createElement('button');
        approveBtn.type = 'button';
        approveBtn.className = 'btn';
        approveBtn.textContent = 'Approve';
        approveBtn.style.fontSize = '0.85rem';
        approveBtn.style.padding = '0.35rem 0.75rem';
        approveBtn.addEventListener('pointerdown', () => playTap());
        approveBtn.addEventListener('click', () => approveEvent(ev.id));
        actions.appendChild(approveBtn);
      }
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn secondary';
      removeBtn.textContent = 'Remove';
      removeBtn.style.fontSize = '0.85rem';
      removeBtn.style.padding = '0.35rem 0.75rem';
      removeBtn.addEventListener('pointerdown', () => playTap());
      removeBtn.addEventListener('click', () => removeEvent(ev.id, li));
      actions.appendChild(removeBtn);
      li.appendChild(actions);

      return li;
    }

    async function loadEvents() {
      if (!eventsListEl || !eventsLoadingEl) return;
      if (!supabase) {
        eventsLoadingEl.textContent = 'Not connected.';
        return;
      }
      eventsLoadingEl.textContent = 'Loading…';
      eventsListEl.innerHTML = '';
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, description, event_date, city, contact_phone, contact_email, approved')
          .order('event_date', { ascending: false });
        if (error) throw error;
        eventsLoadingEl.textContent = (data || []).length === 0 ? 'No events.' : '';
        (data || []).forEach((ev) => eventsListEl.appendChild(renderEventRow(ev)));
      } catch (err) {
        console.error(err);
        eventsLoadingEl.textContent = 'Could not load events.';
      }
    }

    async function loadMessages() {
      if (!listEl || !loadingEl) return;
      if (!supabase) {
        loadingEl.textContent = 'Not connected. Check your Supabase setup.';
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showLogin();
        return;
      }
      showPanel();
      loadingEl.textContent = 'Loading…';
      listEl.innerHTML = '';
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, text, name_or_initials, created_at, approved')
          .order('created_at', { ascending: false });
        if (error) throw error;
        loadingEl.textContent = (data || []).length === 0 ? 'No messages.' : '';
        (data || []).forEach((msg) => listEl.appendChild(renderMessageRow(msg)));
        loadEvents();
        loadShelter();
        loadVolunteers();
      } catch (err) {
        console.error(err);
        loadingEl.textContent = 'Could not load messages. Sign in may be required.';
      }
    }

    async function approveMessage(id) {
      if (!supabase) return;
      try {
        const { error } = await supabase
          .from('messages')
          .update({ approved: true, reviewed_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        await loadMessages();
      } catch (err) {
        console.error(err);
      }
    }

    async function removeMessage(id, rowEl) {
      if (!supabase) return;
      if (!confirm('Remove this message? It will be deleted.')) return;
      try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) throw error;
        rowEl.remove();
      } catch (err) {
        console.error(err);
      }
    }

    async function approveEvent(id) {
      if (!supabase) return;
      try {
        const { error } = await supabase
          .from('events')
          .update({ approved: true, reviewed_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        await loadEvents();
      } catch (err) {
        console.error(err);
      }
    }

    async function removeEvent(id, rowEl) {
      if (!supabase) return;
      if (!confirm('Remove this event? It will be deleted.')) return;
      try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        rowEl.remove();
      } catch (err) {
        console.error(err);
      }
    }

    function renderShelterRow(s) {
      const li = document.createElement('li');
      li.dataset.id = s.id;
      li.style.padding = '0.6rem 0.75rem';
      li.style.borderRadius = '0.75rem';
      li.style.background = s.approved ? 'rgba(22, 163, 74, 0.08)' : 'rgba(59, 130, 246, 0.06)';
      li.style.border = '1px solid ' + (s.approved ? 'rgba(22, 163, 74, 0.3)' : 'rgba(59, 130, 246, 0.35)');

      const top = document.createElement('div');
      top.style.display = 'flex';
      top.style.justifyContent = 'space-between';
      top.style.alignItems = 'flex-start';
      top.style.gap = '0.5rem';
      top.style.marginBottom = '0.25rem';

      const meta = document.createElement('span');
      meta.className = 'muted';
      meta.style.fontSize = '0.8rem';
      meta.textContent = (s.city || '') + (s.updated_at ? ' · ' + new Date(s.updated_at).toLocaleString() : '');

      const badge = document.createElement('span');
      badge.style.fontSize = '0.7rem';
      badge.style.padding = '0.15rem 0.4rem';
      badge.style.borderRadius = '4px';
      badge.style.fontWeight = '600';
      if (s.approved) {
        badge.textContent = 'Approved';
        badge.style.background = 'rgba(22, 163, 74, 0.2)';
        badge.style.color = '#15803d';
      } else {
        badge.textContent = 'Pending';
        badge.style.background = 'rgba(59, 130, 246, 0.18)';
        badge.style.color = '#1d4ed8';
      }

      top.appendChild(meta);
      top.appendChild(badge);
      li.appendChild(top);

      const title = document.createElement('p');
      title.style.margin = '0 0 0.25rem 0';
      title.style.fontSize = '0.96rem';
      title.style.fontWeight = '600';
      title.textContent = s.name || '(No name)';
      li.appendChild(title);

      const beds = document.createElement('p');
      beds.style.margin = '0 0 0.25rem 0';
      beds.style.fontSize = '0.9rem';
      beds.textContent = `${s.available_beds} of ${s.total_beds} beds available`;
      li.appendChild(beds);

      if (s.notes) {
        const notes = document.createElement('p');
        notes.className = 'muted';
        notes.style.margin = '0 0 0.4rem 0';
        notes.style.fontSize = '0.85rem';
        notes.textContent = s.notes;
        li.appendChild(notes);
      }

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.flexWrap = 'wrap';
      if (!s.approved) {
        const approveBtn = document.createElement('button');
        approveBtn.type = 'button';
        approveBtn.className = 'btn';
        approveBtn.textContent = 'Approve';
        approveBtn.style.fontSize = '0.85rem';
        approveBtn.style.padding = '0.35rem 0.75rem';
        approveBtn.addEventListener('pointerdown', () => playTap());
        approveBtn.addEventListener('click', () => approveShelter(s.id));
        actions.appendChild(approveBtn);
      }
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn secondary';
      removeBtn.textContent = 'Remove';
      removeBtn.style.fontSize = '0.85rem';
      removeBtn.style.padding = '0.35rem 0.75rem';
      removeBtn.addEventListener('pointerdown', () => playTap());
      removeBtn.addEventListener('click', () => removeShelter(s.id, li));
      actions.appendChild(removeBtn);
      li.appendChild(actions);

      return li;
    }

    async function loadShelter() {
      if (!shelterListEl || !shelterLoadingEl) return;
      if (!supabase) {
        shelterLoadingEl.textContent = 'Not connected.';
        return;
      }
      shelterLoadingEl.textContent = 'Loading…';
      shelterListEl.innerHTML = '';
      try {
        const { data, error } = await supabase
          .from('shelter_availability')
          .select('id, name, city, total_beds, available_beds, notes, updated_at, approved')
          .order('updated_at', { ascending: false });
        if (error) throw error;
        shelterLoadingEl.textContent = (data || []).length === 0 ? 'No shelter availability submissions.' : '';
        (data || []).forEach((s) => shelterListEl.appendChild(renderShelterRow(s)));
      } catch (err) {
        console.error(err);
        shelterLoadingEl.textContent = 'Could not load shelter availability.';
      }
    }

    async function approveShelter(id) {
      if (!supabase) return;
      try {
        const { error } = await supabase
          .from('shelter_availability')
          .update({ approved: true, reviewed_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        await loadShelter();
      } catch (err) {
        console.error(err);
      }
    }

    async function removeShelter(id, rowEl) {
      if (!supabase) return;
      if (!confirm('Remove this shelter availability? It will be deleted.')) return;
      try {
        const { error } = await supabase.from('shelter_availability').delete().eq('id', id);
        if (error) throw error;
        rowEl.remove();
      } catch (err) {
        console.error(err);
      }
    }

    function renderVolunteerRow(v) {
      const li = document.createElement('li');
      li.dataset.id = v.id;
      li.style.padding = '0.6rem 0.75rem';
      li.style.borderRadius = '0.75rem';
      li.style.background = v.approved ? 'rgba(22, 163, 74, 0.08)' : 'rgba(59, 130, 246, 0.06)';
      li.style.border = '1px solid ' + (v.approved ? 'rgba(22, 163, 74, 0.3)' : 'rgba(59, 130, 246, 0.35)');

      const top = document.createElement('div');
      top.style.display = 'flex';
      top.style.justifyContent = 'space-between';
      top.style.alignItems = 'flex-start';
      top.style.gap = '0.5rem';
      top.style.marginBottom = '0.25rem';

      const meta = document.createElement('span');
      meta.className = 'muted';
      meta.style.fontSize = '0.8rem';
      try {
        meta.textContent =
          new Date(v.event_date || v.created_at).toLocaleString() +
          (v.city ? ` · ${v.city}` : '');
      } catch {
        meta.textContent = v.city || '';
      }

      const badge = document.createElement('span');
      badge.style.fontSize = '0.7rem';
      badge.style.padding = '0.15rem 0.4rem';
      badge.style.borderRadius = '4px';
      badge.style.fontWeight = '600';
      if (v.approved) {
        badge.textContent = 'Approved';
        badge.style.background = 'rgba(22, 163, 74, 0.2)';
        badge.style.color = '#15803d';
      } else {
        badge.textContent = 'Pending';
        badge.style.background = 'rgba(59, 130, 246, 0.18)';
        badge.style.color = '#1d4ed8';
      }

      top.appendChild(meta);
      top.appendChild(badge);
      li.appendChild(top);

      const title = document.createElement('p');
      title.style.margin = '0 0 0.25rem 0';
      title.style.fontSize = '0.96rem';
      title.style.fontWeight = '600';
      title.textContent = v.title || '(No title)';
      li.appendChild(title);

      if (v.description) {
        const desc = document.createElement('p');
        desc.style.margin = '0 0 0.4rem 0';
        desc.style.fontSize = '0.9rem';
        desc.textContent = v.description;
        li.appendChild(desc);
      }

      const contact = document.createElement('p');
      contact.className = 'muted';
      contact.style.margin = '0 0 0.4rem 0';
      contact.style.fontSize = '0.8rem';
      const parts = [];
      if (v.contact_phone) parts.push(v.contact_phone);
      if (v.contact_email) parts.push(v.contact_email);
      contact.textContent = parts.join(' · ');
      li.appendChild(contact);

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.flexWrap = 'wrap';
      if (!v.approved) {
        const approveBtn = document.createElement('button');
        approveBtn.type = 'button';
        approveBtn.className = 'btn';
        approveBtn.textContent = 'Approve';
        approveBtn.style.fontSize = '0.85rem';
        approveBtn.style.padding = '0.35rem 0.75rem';
        approveBtn.addEventListener('pointerdown', () => playTap());
        approveBtn.addEventListener('click', () => approveVolunteer(v.id));
        actions.appendChild(approveBtn);
      }
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn secondary';
      removeBtn.textContent = 'Remove';
      removeBtn.style.fontSize = '0.85rem';
      removeBtn.style.padding = '0.35rem 0.75rem';
      removeBtn.addEventListener('pointerdown', () => playTap());
      removeBtn.addEventListener('click', () => removeVolunteer(v.id, li));
      actions.appendChild(removeBtn);
      li.appendChild(actions);

      return li;
    }

    async function loadVolunteers() {
      if (!volunteerListEl || !volunteerLoadingEl) return;
      if (!supabase) {
        volunteerLoadingEl.textContent = 'Not connected.';
        return;
      }
      volunteerLoadingEl.textContent = 'Loading…';
      volunteerListEl.innerHTML = '';
      try {
        const { data, error } = await supabase
          .from('volunteer_availability')
          .select('id, title, description, event_date, city, contact_phone, contact_email, approved')
          .order('event_date', { ascending: false });
        if (error) throw error;
        volunteerLoadingEl.textContent = (data || []).length === 0 ? 'No volunteer submissions.' : '';
        (data || []).forEach((v) => volunteerListEl.appendChild(renderVolunteerRow(v)));
      } catch (err) {
        console.error(err);
        volunteerLoadingEl.textContent = 'Could not load volunteer availability.';
      }
    }

    async function approveVolunteer(id) {
      if (!supabase) return;
      try {
        const { error } = await supabase
          .from('volunteer_availability')
          .update({ approved: true, reviewed_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        await loadVolunteers();
      } catch (err) {
        console.error(err);
      }
    }

    async function removeVolunteer(id, rowEl) {
      if (!supabase) return;
      if (!confirm('Remove this volunteer submission? It will be deleted.')) return;
      try {
        const { error } = await supabase.from('volunteer_availability').delete().eq('id', id);
        if (error) throw error;
        rowEl.remove();
      } catch (err) {
        console.error(err);
      }
    }

    const loginSubmitBtn = section.querySelector('#admin-login-form button[type="submit"]');
    if (loginSubmitBtn) loginSubmitBtn.addEventListener('pointerdown', () => playTap());
    if (loginForm && loginStatus) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = section.querySelector('#admin-email').value.trim();
        const password = section.querySelector('#admin-password').value;
        if (!email || !password || !supabase) {
          loginStatus.textContent = 'Enter email and password.';
          loginStatus.style.color = '#b91c1c';
          return;
        }
        loginStatus.textContent = 'Signing in…';
        loginStatus.style.color = '';
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          loginStatus.textContent = '';
          loadMessages();
        } catch (err) {
          loginStatus.textContent = err.message || 'Sign in failed.';
          loginStatus.style.color = '#b91c1c';
        }
      });
    }

    if (signOutBtn) {
      signOutBtn.addEventListener('pointerdown', () => playTap());
      signOutBtn.addEventListener('click', async () => {
        if (supabase) await supabase.auth.signOut();
        showLogin();
      });
    }

    loadMessages();

    return section;
  };
  return layout(inner);
}
