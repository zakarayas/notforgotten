import { layout } from '../lib/layout.js';
import { playTap } from '../lib/sounds.js';

export function renderServices() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="SERVICES &amp; SUPPORT">Services &amp; support</h1>
      <p style="margin:0 0 1rem 0;">Meals, health care, benefits, rehab, and safety resources. Enter a city or browse.</p>
      <form class="services-search" data-services-search>
        <div class="services-search-row">
          <input id="services-city" name="city" type="text" autocomplete="address-level2" placeholder="Type a city (for example: Seattle)" aria-label="Search by city" />
          <button type="submit" class="btn">Search</button>
        </div>
      </form>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;

    const results = document.createElement('div');
    results.className = 'services-search-result';
    section.appendChild(results);

    renderServiceList(section, null);

    const form = section.querySelector('[data-services-search]');
    const input = form.querySelector('input[name="city"]');
    const searchBtn = form.querySelector('button[type="submit"]');
    if (searchBtn) {
      searchBtn.addEventListener('pointerdown', () => playTap());
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) {
        results.innerHTML = '';
        return;
      }
      const googleQuery = encodeURIComponent(`${raw} homeless shelter emergency housing services 211`);
      const mapsQuery = encodeURIComponent(`${raw} homeless shelter emergency housing`);
      const rehabQuery = encodeURIComponent(`${raw} rehab addiction treatment detox center`);
      const govServicesQuery = encodeURIComponent(`${raw} official city government human services site`);
      const safe = raw.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c]));
      results.innerHTML = `
        <div class="services-result-card">
          <h2>Resources for ${safe}</h2>
          <p>Tap a link below to jump straight to results for <strong>${safe}</strong>:</p>
          <ul>
            <li><a href="https://www.google.com/search?q=${govServicesQuery}" target="_blank" rel="noopener">Get help with official local government services for ${safe}</a></li>
            <li><a href="https://www.google.com/search?q=${googleQuery}" target="_blank" rel="noopener">Find shelters and services in ${safe}</a></li>
            <li><a href="https://www.google.com/maps/search/${mapsQuery}" target="_blank" rel="noopener">View shelters near ${safe} on a map</a></li>
            <li><a href="https://www.google.com/search?q=${rehabQuery}" target="_blank" rel="noopener">Find rehab &amp; treatment in ${safe}</a></li>
            <li><a href="https://www.211.org" target="_blank" rel="noopener">Open 211.org</a> and search using your city or ZIP code.</li>
          </ul>
          <p class="muted" style="font-size:0.85rem;">Search happens in your browser; this app doesn’t store or track what you type.</p>
        </div>
      `;
    });

    return section;
  };
  return layout(inner);
}

function renderServiceList(container, coords) {
  let listEl = container.querySelector('.services-list');
  if (!listEl) {
    listEl = document.createElement('div');
    listEl.className = 'services-list';
    container.appendChild(listEl);
  }
  listEl.innerHTML = `
    <div class="card">
      <h2>Meals &amp; food banks</h2>
      <p>Food banks and community meals change often. Use trusted national directories to find the most current options near you.</p>
      <p><a href="https://www.feedingamerica.org/find-your-local-foodbank" target="_blank" rel="noopener">Find your local food bank</a> on Feeding America.</p>
    </div>
    <div class="card">
      <h2>Health & benefits</h2>
      <p>If you need Medicaid, SNAP (food stamps), or other benefits, you can start by calling 211 and asking for help with applications or your local human services office.</p>
      <p>You can also go to a nearby community health center or county benefits office in person and ask about signing up for Medicaid, food assistance, or disability benefits where you live.</p>
      <p style="margin-top:0.75rem;"><a href="https://www.benefits.gov" target="_blank" rel="noopener" class="btn btn-tile">Benefits.gov — find benefits you may qualify for</a></p>
      <p style="margin-top:0.5rem;"><a href="https://www.healthcare.gov" target="_blank" rel="noopener" class="btn btn-tile">Healthcare.gov — Medicaid &amp; health insurance</a></p>
    </div>
    <div class="card">
      <h2>Rehab & treatment</h2>
      <p>For detox, rehab, and substance use treatment, you can search confidentially for programs near you using the official SAMHSA locator.</p>
      <p><a href="https://findtreatment.gov" target="_blank" rel="noopener">findtreatment.gov</a> — US Substance Abuse &amp; Mental Health Services Administration.</p>
    </div>
    <div class="card">
      <h2>Domestic violence &amp; safety</h2>
      <p>For confidential help with abuse or safety planning in the US, contact the National Domestic Violence Hotline.</p>
      <p><a href="https://www.thehotline.org" target="_blank" rel="noopener">thehotline.org</a> or call 1-800-799-SAFE (7233).</p>
    </div>
  `;
}

