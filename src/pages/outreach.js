import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';
import { playTap } from '../lib/sounds.js';

export function renderOutreach() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="OUTREACH">Outreach</h1>
      <p class="muted" style="margin:0 0 1rem 0;">Community members can leave positive messages or offer help here.</p>
      <div class="card">
        <h2>Leave a positive message</h2>
        <p style="margin-top:0.75rem;">
          <a href="#/share-message" class="btn btn-tile" data-nav data-explain="Write a short encouraging message that you can share with outreach workers or people using this app.">
            <span class="cta-label">Share a message</span>
            <span class="outreach-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6h12a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4.5L8 19.5V16H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z"/>
                <path d="M9 10h6"/>
                <path d="M9 13h3"/>
              </svg>
            </span>
          </a>
        </p>
      </div>
      <div class="card share-message-board">
        <div class="share-message-chat">
          <ul class="share-message-list"></ul>
          <p id="share-message-loading" class="muted share-message-loading"></p>
        </div>
      </div>
      <div class="card">
        <h2>Events</h2>
        <p style="margin:0 0 0.75rem 0;">Meals, shelter intake, and outreach events. Add one or view upcoming.</p>
        <p style="margin-top:0.75rem;">
          <a href="#/events" class="btn btn-tile" data-nav data-explain="Add an upcoming event or see events near you.">
            <span class="cta-label">Add or view events</span>
            <span class="outreach-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
          </a>
        </p>
      </div>
      <div class="card">
        <h2>Offer help</h2>
        <p style="margin-top:0.75rem;">
          <a href="#/volunteer" class="btn btn-tile" data-nav data-explain="Volunteer your time, skills, or resources. Connect with local outreach to offer meals, supplies, or support.">
            <span class="cta-label">I want to help</span>
            <span class="outreach-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="11" r="2.4"/>
                <circle cx="16" cy="11" r="2.4"/>
                <circle cx="12" cy="7.5" r="2.4"/>
                <path d="M3.5 19c0-2.6 2.1-4.7 4.7-4.7s4.7 2.1 4.7 4.7"/>
                <path d="M11 19c0-2.6 2.1-4.7 4.7-4.7S20.4 16.4 20.4 19"/>
              </svg>
            </span>
          </a>
        </p>
      </div>
      <p class="muted" style="font-size:0.9rem; margin-top:1rem;">You can replace these simple links with a full outreach system or moderation flow when you’re ready.</p>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    const listEl = section.querySelector('.share-message-list');
    const loadingEl = section.querySelector('#share-message-loading');

    const UPVOTED_KEY = 'nf_upvoted_messages';

    function renderMessage(msg) {
      if (!listEl) return;
      const li = document.createElement('li');
      li.className = 'share-message-bubble';
      li.dataset.messageId = msg.id;
      const body = document.createElement('p');
      body.className = 'share-message-bubble-text';
      body.textContent = msg.text;
      li.appendChild(body);
      const meta = document.createElement('p');
      meta.className = 'muted share-message-bubble-meta';
      const by = msg.name_or_initials ? ` · ${msg.name_or_initials}` : '';
      try {
        const d = new Date(msg.created_at || Date.now());
        meta.textContent = d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) + by;
      } catch {
        meta.textContent = by || '';
      }
      li.appendChild(meta);
      const upvoteRow = document.createElement('p');
      upvoteRow.className = 'share-message-upvote-row';
      const upvoteBtn = document.createElement('button');
      upvoteBtn.type = 'button';
      upvoteBtn.className = 'share-message-upvote-btn';
      upvoteBtn.setAttribute('aria-label', 'Upvote this message');
      upvoteBtn.innerHTML = `
        <span class="share-message-upvote-arrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </span>
        <span class="share-message-upvote-count">${Number(msg.upvotes) || 0}</span>
      `;
      const countEl = upvoteBtn.querySelector('.share-message-upvote-count');
      let upvotedSet = new Set(JSON.parse(localStorage.getItem(UPVOTED_KEY) || '[]'));
      if (upvotedSet.has(msg.id)) {
        upvoteBtn.classList.add('is-upvoted');
        upvoteBtn.disabled = true;
        upvoteBtn.setAttribute('aria-label', 'Upvoted');
      }
      upvoteBtn.addEventListener('pointerdown', () => playTap());
      upvoteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (upvoteBtn.disabled || !supabase) return;
        try {
          await supabase.rpc('increment_message_upvote', { msg_id: msg.id });
          upvotedSet.add(msg.id);
          localStorage.setItem(UPVOTED_KEY, JSON.stringify([...upvotedSet]));
          const n = Number(countEl.textContent) || 0;
          countEl.textContent = n + 1;
          upvoteBtn.classList.add('is-upvoted');
          upvoteBtn.disabled = true;
          upvoteBtn.setAttribute('aria-label', 'Upvoted');
        } catch (err) {
          console.error('Upvote error:', err);
        }
      });
      upvoteRow.appendChild(upvoteBtn);
      li.appendChild(upvoteRow);
      listEl.appendChild(li);
    }

    async function loadMessages() {
      if (!listEl) return;
      if (loadingEl) loadingEl.textContent = 'Loading…';
      if (!supabase) {
        if (loadingEl) loadingEl.textContent = 'Message board is not connected.';
        return;
      }
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, text, name_or_initials, created_at, upvotes')
          .eq('approved', true)
          .order('created_at', { ascending: true })
          .limit(100);
        if (loadingEl) loadingEl.textContent = '';
        if (error) {
          console.error('Messages fetch error:', error);
          throw error;
        }
        listEl.innerHTML = '';
        (data || []).forEach(renderMessage);
        if ((data || []).length === 0 && loadingEl) loadingEl.textContent = 'No messages yet.';
        const chatEl = listEl.closest('.share-message-chat');
        if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
      } catch (err) {
        console.error(err);
        if (loadingEl) loadingEl.textContent = 'Could not load messages.';
      }
    }

    loadMessages();

    return section;
  };
  return layout(inner);
}

