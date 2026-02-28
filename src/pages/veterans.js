import { layout } from '../lib/layout.js';

export function renderVeterans() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="VETERANS">Veterans</h1>
      <p class="muted" style="margin:0 0 1rem 0;">Crisis support, VA resources, and housing help for veterans and their families.</p>
      <div class="card">
        <h2>Non-government &amp; community</h2>
        <p style="margin:0 0 0.75rem 0;">National nonprofits and veteran service organizations (not VA). Housing, benefits help, and crisis support.</p>
        <ul style="margin:0 0 0.75rem 1.2rem; padding:0; font-size:0.95rem; color:var(--text);">
          <li style="margin-bottom:0.6rem;"><strong>U.S.VETS</strong> — Housing, counseling, employment. <a href="tel:8775487838" data-explain="U.S.VETS emergency support and housing.">877-548-VETS (7838)</a> · <a href="https://usvets.org" target="_blank" rel="noopener">usvets.org</a></li>
          <li style="margin-bottom:0.6rem;"><strong>DAV (Disabled American Veterans)</strong> — VA benefits, homeless assistance, transportation. <a href="tel:18774262838" data-explain="DAV help line.">1-877-426-2838</a> · <a href="https://www.dav.org" target="_blank" rel="noopener">dav.org</a></li>
          <li style="margin-bottom:0.6rem;"><strong>VFW National Home</strong> — Housing for military &amp; veteran families. <a href="tel:18003134200" data-explain="VFW National Home eligibility and assistance.">1-800-313-4200</a> · <a href="https://vfwnationalhome.org" target="_blank" rel="noopener">vfwnationalhome.org</a></li>
          <li style="margin-bottom:0.6rem;"><strong>Operation Homefront</strong> — Financial help, housing stability, emergency relief. <a href="https://operationhomefront.org" target="_blank" rel="noopener">operationhomefront.org</a></li>
          <li style="margin-bottom:0.6rem;"><strong>Tunnel to Towers</strong> — Housing (Veterans Villages) and supportive services. <a href="https://t2t.org" target="_blank" rel="noopener">t2t.org</a></li>
          <li style="margin-bottom:0.6rem;"><strong>Wounded Warrior Project</strong> — Post-9/11 veterans: benefits, wellness, family support. <a href="https://www.woundedwarriorproject.org" target="_blank" rel="noopener">woundedwarriorproject.org</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>Veterans Crisis Line</h2>
        <p style="margin:0 0 0.5rem 0;">24/7 free, confidential support. Call or text 988, then press 1 for veterans.</p>
        <p style="margin-top:0.75rem;"><a href="tel:988" class="btn btn-tile" data-explain="Call 988, then press 1 to reach the Veterans Crisis Line. Confidential support for veterans in crisis.">Call 988 (press 1)</a></p>
        <p style="margin-top:0.5rem; font-size:0.9rem;"><a href="https://www.veteranscrisisline.net" target="_blank" rel="noopener">veteranscrisisline.net</a> — Chat online 24/7</p>
      </div>
      <div class="card">
        <h2>VA homeless &amp; housing</h2>
        <p style="margin:0 0 0.5rem 0;">Shelter, housing programs, and HUD-VASH vouchers. Ask about eligibility and local VA services.</p>
        <p style="margin-top:0.75rem;"><a href="tel:18774243838" class="btn btn-tile" data-explain="VA Homeless Veterans line (US). Shelter, housing, HUD-VASH, and support.">Call 1-877-4AID-VET</a></p>
      </div>
      <div class="card">
        <h2>Vouchers &amp; grants</h2>
        <p style="margin:0 0 0.5rem 0;"><strong>HUD-VASH</strong> — Government rental vouchers for homeless veterans, plus VA case management and support. You pay a portion of rent; the voucher covers the rest. Eligibility: experiencing homelessness; income up to 80% of area median. Apply through your local VA medical center or the National Call Center below.</p>
        <p style="margin-top:0.75rem; text-align:center;">
          <a href="https://www.google.com/maps/search/VA+locations+near+me" target="_blank" rel="noopener" class="btn btn-pill">Find my VA</a>
        </p>
        <p style="margin:0.5rem 0 0.5rem 0;"><strong>SSVF (Supportive Services for Veteran Families)</strong> — Grants fund rapid re-housing and homelessness prevention for veteran families (rent help, case management, outreach). Services are delivered by local nonprofits and VA partners. Ask the VA or call 1-877-4AID-VET to find SSVF providers near you.</p>
        <p style="margin:0.5rem 0 0;"><strong>Grant and Per Diem (GPD)</strong> — Transitional housing and services for homeless veterans; community organizations receive GPD funding and offer beds and support. The VA can refer you to GPD programs in your area.</p>
        <p style="margin-top:0.75rem; text-align:center;">
          <a href="https://www.va.gov/homeless/gpd.asp" target="_blank" rel="noopener" class="btn btn-pill">GPD program info and referral</a>
        </p>
      </div>
      <div class="card">
        <h2>More resources</h2>
        <ul style="margin:0 0 0.75rem 1.2rem; padding:0; font-size:0.95rem; color:var(--text);">
          <li style="margin-bottom:0.5rem;"><strong>VA.gov</strong> — Benefits, health care, and housing: <a href="https://www.va.gov" target="_blank" rel="noopener">va.gov</a></li>
          <li style="margin-bottom:0.5rem;"><strong>National Call Center for Homeless Veterans</strong> — 1-877-4AID-VET (424-3838), 24/7</li>
        </ul>
        <p style="margin-top:0.75rem; font-size:0.9rem;"><a href="https://www.va.gov/homeless" target="_blank" rel="noopener">va.gov/homeless</a> — Programs and eligibility</p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    return section;
  };
  return layout(inner);
}
