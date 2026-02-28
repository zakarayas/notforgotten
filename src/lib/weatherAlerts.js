/**
 * Fetch active NWS weather alerts for a point. Used to show "call 211 for shelter/warming/cooling" during extreme weather.
 * API: https://api.weather.gov/alerts/active?point=lat,lon (no key required)
 */

const RELEVANT_EVENT_KEYWORDS = [
  'cold',
  'heat',
  'winter',
  'wind chill',
  'freeze',
  'frost',
  'hypothermia',
  'cooling',
  'warming',
];

function isRelevantAlert(properties) {
  if (!properties || !properties.event) return false;
  const event = String(properties.event).toLowerCase();
  return RELEVANT_EVENT_KEYWORDS.some((kw) => event.includes(kw));
}

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Array<{ event: string, headline: string, severity: string }>>}
 */
export async function fetchAlertsForPoint(lat, lon) {
  const url = `https://api.weather.gov/alerts/active?point=${encodeURIComponent(lat)},${encodeURIComponent(lon)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/geo+json, application/json',
      'User-Agent': 'HelpStartsHere/1.0 (homeless-connect-app; contact for support)',
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const features = data?.features || [];
  return features
    .filter((f) => isRelevantAlert(f?.properties))
    .map((f) => ({
      event: f.properties?.event || 'Alert',
      headline: f.properties?.headline || f.properties?.event || '',
      severity: f.properties?.severity || '',
    }));
}
