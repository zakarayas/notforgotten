/**
 * Location is never collected unless:
 * 1. User explicitly opts in (e.g. "Find services near me"), or
 * 2. Emergency / missing persons flow with explicit consent.
 * No background or passive location collection.
 */

const STORAGE_KEY = 'connect_location_consent';

export function hasLocationConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function setLocationConsent(granted) {
  try {
    localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
  } catch {}
}

export function requestLocation(opts = {}) {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation not supported'));
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000, ...opts }
    );
  });
}

/**
 * Only call after user has explicitly consented (e.g. tapped "Use my location").
 */
export function getLocationIfConsented() {
  if (!hasLocationConsent()) return Promise.resolve(null);
  return requestLocation().catch(() => null);
}
