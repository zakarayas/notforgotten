/**
 * 211 National Data Platform API client (optional).
 * Get your API base URL and subscription key from https://apiportal.211.org/
 * Set in .env: VITE_211_API_BASE_URL, VITE_211_API_KEY
 */

const baseUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_211_API_BASE_URL;
const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_211_API_KEY;

export const has211Api = !!(baseUrl && apiKey);

/**
 * Search 211 for shelters / warming centers near a location.
 * @param {{ lat?: number, lon?: number, zipCode?: string, city?: string }} location - lat/lon or zipCode or city
 * @param {{ keyword?: string, radiusMiles?: number }} options - optional keyword (default shelter) and radius
 * @returns {Promise<{ results?: Array<unknown>, error?: string }>}
 */
export async function search211(location, options = {}) {
  if (!baseUrl || !apiKey) {
    return { error: '211 API not configured. Add VITE_211_API_BASE_URL and VITE_211_API_KEY to .env' };
  }
  const keyword = options.keyword || 'shelter';
  const params = new URLSearchParams();
  params.set('keyword', keyword);
  if (options.radiusMiles != null) params.set('radius', String(options.radiusMiles));
  if (location.lat != null && location.lon != null) {
    params.set('lat', String(location.lat));
    params.set('lon', String(location.lon));
  } else if (location.zipCode) {
    params.set('zipCode', location.zipCode);
  } else if (location.city) {
    params.set('city', location.city);
  } else {
    return { error: 'Provide lat/lon, zipCode, or city.' };
  }
  const url = `${baseUrl.replace(/\/$/, '')}/search?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `211 API error: ${res.status} ${text.slice(0, 100)}` };
    }
    const data = await res.json();
    return { results: data?.results ?? data?.data ?? data };
  } catch (err) {
    return { error: err.message || 'Failed to reach 211 API.' };
  }
}
