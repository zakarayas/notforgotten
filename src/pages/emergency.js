import { layout } from '../lib/layout.js';
import { setLocationConsent, requestLocation } from '../lib/location.js';
import { playTap } from '../lib/sounds.js';

export function renderEmergency() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="EMERGENCY HELP NOW">Emergency help now</h1>
      <p style="margin:0 0 1rem 0;">If you or someone you know is in <strong>immediate, life-threatening danger</strong>, please contact <strong>911</strong> by tapping the button on this page. If you are lost or need emergency services to find your location, you can tap “I agree — share location for this purpose” at the bottom.</p>
      <div class="card safe-card">
        <h2>Get help now</h2>
        <p style="margin-top:0.5rem;">
          <a href="tel:911" class="btn btn-standout" style="display:inline-flex; flex-direction:column; gap:0.15rem;">
            <span>Call</span>
            <span style="font-size:1.4em; line-height:1;">911</span>
          </a>
        </p>
      </div>
      <div class="card emergency-card">
        <h2>Share my location for emergency only</h2>
        <div class="btns" style="margin-top:0.75rem;">
          <button type="button" class="btn btn-location" data-share>I agree — share location for this purpose</button>
        </div>
        <p id="emergency-result" style="margin-top:0.5rem; font-size:0.9rem;"></p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    const shareBtn = section.querySelector('[data-share]');
    const callBtn = section.querySelector('a[href^="tel:911"]');
    if (callBtn) {
      callBtn.addEventListener('pointerdown', () => {
        playTap();
      });
    }
    if (shareBtn) {
      shareBtn.addEventListener('pointerdown', () => {
        playTap();
      });
    }
    const resultEl = section.querySelector('#emergency-result');
    shareBtn.addEventListener('click', () => {
      setLocationConsent(true);
      resultEl.textContent = 'Getting location…';
      requestLocation()
        .then((coords) => {
          resultEl.textContent = `Location shared for emergency use only (approx. ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}). Contact 911 or local outreach with this if needed. We do not store it.`;
        })
        .catch(() => {
          resultEl.textContent = 'Could not get location. Please try again or call 911 / 211.';
        });
    });
    return section;
  };
  return layout(inner);
}


