/**
 * Shows a dismissible banner at the top of main when NWS reports extreme cold/heat alerts for the user's area.
 * Prompts them to call 211 for warming/cooling centers and shelter.
 */
import { fetchAlertsForPoint } from './weatherAlerts.js';

const DISMISS_KEY = 'weather-banner-dismissed';

export function initWeatherBanner(mainEl) {
  if (!mainEl || typeof navigator === 'undefined' || !navigator.geolocation) return;

  if (sessionStorage.getItem(DISMISS_KEY)) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const alerts = await fetchAlertsForPoint(latitude, longitude);
      if (!alerts.length) return;

      const banner = document.createElement('div');
      banner.className = 'weather-alert-banner';
      banner.setAttribute('role', 'alert');
      banner.innerHTML = `
        <div class="weather-alert-banner-inner" style="padding:0.75rem 1rem; background:rgba(217,119,6,0.15); border:1px solid rgba(217,119,6,0.4); border-radius:var(--radius); margin:0 0 1rem 0;">
          <p style="margin:0 0 0.35rem 0; font-weight:600;">Extreme weather in your area</p>
          <p style="margin:0 0 0.5rem 0; font-size:0.9rem;">${alerts[0].event}${alerts[0].headline ? ': ' + alerts[0].headline.slice(0, 120) + (alerts[0].headline.length > 120 ? '…' : '') : ''}</p>
          <p style="margin:0 0 0.5rem 0; font-size:0.9rem;">211 updates with warming/cooling centers and shelter during extreme weather — call for current options.</p>
          <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            <a href="#/help211" class="btn" data-nav data-weather-banner-link>Go to 211 & help</a>
            <button type="button" class="btn secondary" aria-label="Dismiss">Dismiss</button>
          </div>
        </div>
      `;

      const dismissBtn = banner.querySelector('button[aria-label="Dismiss"]');
      const link = banner.querySelector('[data-weather-banner-link]');

      dismissBtn.addEventListener('click', () => {
        sessionStorage.setItem(DISMISS_KEY, '1');
        banner.remove();
      });

      link.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.setItem(DISMISS_KEY, '1');
        banner.remove();
        if (window.navTo) window.navTo('help211');
      });

      mainEl.insertBefore(banner, mainEl.firstChild);
    },
    () => {},
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
  );
}
