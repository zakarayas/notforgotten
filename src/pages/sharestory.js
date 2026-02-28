import { layout } from '../lib/layout.js';
import { supabase } from '../lib/supabase.js';

export function renderShareStory() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="SHARE YOUR EXPERIENCE">Share your experience</h1>
      <div class="card">
        <p style="margin:0 0 0.75rem 0;">
          If this app helped you find safety, shelter, or support, share a short experience here. Your words might encourage someone else to reach out for help.
        </p>
        <form class="share-story-form missing-notes-form" style="margin-top:0.75rem;">
          <div class="missing-notes-row">
            <label for="share-story-name">First name or initials</label>
            <input id="share-story-name" type="text" placeholder="For example: J., Maria, S.T." required />
          </div>
          <div class="missing-notes-row">
            <label for="share-story-text">How did this help you?</label>
            <textarea id="share-story-text" rows="5" placeholder="A few sentences about what was going on and how this app helped. Please avoid full names, phone numbers, or addresses."></textarea>
          </div>
          <p class="missing-notes-hint">
            Once you’re finished, hit Send. Our team reviews submissions, and your experience may be featured on the home page.
          </p>
          <p style="margin-top:0.5rem; text-align:center;">
            <button type="submit" class="btn">Send</button>
          </p>
          <p id="share-story-status" class="muted" style="font-size:0.85rem; margin-top:0.5rem;"></p>
        </form>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;

    const form = section.querySelector('.share-story-form');
    const nameInput = section.querySelector('#share-story-name');
    const textInput = section.querySelector('#share-story-text');
    const statusEl = section.querySelector('#share-story-status');

    if (form && nameInput && textInput && statusEl) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const story = textInput.value.trim();

        if (!name) {
          statusEl.textContent = 'Please add a first name or initials.';
          statusEl.style.color = '#b91c1c';
          return;
        }

        if (!story) {
          statusEl.textContent = 'Please share a few words about your experience.';
          statusEl.style.color = '#b91c1c';
          return;
        }

        if (!supabase) {
          statusEl.textContent = 'Submission is not configured. Please try again later.';
          statusEl.style.color = '#b91c1c';
          return;
        }

        statusEl.textContent = 'Sending…';
        statusEl.style.color = '';

        try {
          const { error } = await supabase
            .from('testimonials')
            .insert([{ story, name_or_initials: name }]);
          if (error) throw error;
          statusEl.textContent = 'Thank you. We’ve received it and will take a look.';
          statusEl.style.color = '#16a34a';
          textInput.value = '';
        } catch (err) {
          console.error(err);
          statusEl.textContent = 'Could not send right now. Please try again later.';
          statusEl.style.color = '#b91c1c';
        }
      });
    }

    return section;
  };
  return layout(inner);
}


