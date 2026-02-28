import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';
import { playTap } from '../lib/sounds.js';

export function renderShareMessage() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="SHARE A MESSAGE">Share a message</h1>
      <p style="margin:0 0 0.75rem 0;">
        Leave short, encouraging messages that could be shared with people checking this app.
        Don’t include last names, phone numbers, or anything that could identify you or someone else.
      </p>
      <div class="card">
        <h2>Add your message</h2>
        <form class="share-message-form missing-notes-form" style="margin-top:0.75rem;">
          <div class="missing-notes-row">
            <label for="share-message-name">First name or initials</label>
            <input id="share-message-name" type="text" required placeholder="e.g. J., Maria" />
          </div>
          <div class="missing-notes-row">
            <label for="share-message-text">Message</label>
            <textarea id="share-message-text" rows="4" placeholder="Write a few sentences of encouragement, hope, or support."></textarea>
          </div>
          <p class="missing-notes-hint">
            Your message is sent for review. It will appear on the board only after it’s approved.
          </p>
          <p style="margin-top:0.5rem; text-align:center;">
            <button type="submit" class="btn">Post message</button>
          </p>
          <p id="share-message-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
        </form>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/outreach" class="btn secondary" data-nav>Back to Outreach</a>
      </p>
    `;
    const formEl = section.querySelector('.share-message-form');
    const nameInput = section.querySelector('#share-message-name');
    const textareaEl = section.querySelector('#share-message-text');
    const statusEl = section.querySelector('#share-message-status');

    const submitBtn = section.querySelector('.share-message-form button[type="submit"]');
    if (submitBtn) submitBtn.addEventListener('pointerdown', () => playTap());
    if (formEl && textareaEl && statusEl) {
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = textareaEl.value.trim();
        if (!text) return;
        const name = nameInput?.value?.trim() || null;
        if (!supabase) {
          statusEl.textContent = 'Posting is not available right now.';
          statusEl.style.color = '#b91c1c';
          return;
        }
        statusEl.textContent = 'Sending…';
        statusEl.style.color = '';
        try {
          const { error } = await supabase
            .from('messages')
            .insert([{ text, name_or_initials: name }]);
          if (error) throw error;
          statusEl.textContent = 'Message sent for review. It may appear on the board after approval.';
          statusEl.style.color = '#16a34a';
          textareaEl.value = '';
          if (nameInput) nameInput.value = '';
        } catch (err) {
          console.error(err);
          statusEl.textContent = 'Could not post. Please try again.';
          statusEl.style.color = '#b91c1c';
        }
      });
    }

    return section;
  };
  return layout(inner);
}


