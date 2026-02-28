import { layout } from '../lib/layout.js';

export function renderRehab() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="REHAB &amp; TREATMENT">Rehab &amp; treatment</h1>
      <p class="muted" style="margin:0 0 1rem 0;">Emergency help for overdose, crisis support, and finding substance use treatment.</p>
      <div class="card safe-card">
        <h2>Overdose or medical emergency</h2>
        <p style="margin-top:0.5rem;">If someone is unresponsive, not breathing, or you suspect an overdose, <strong>call 911</strong> immediately. If you have naloxone (Narcan), use it as directed while waiting for help.</p>
        <p style="margin-top:0.75rem;"><a href="tel:911" class="btn btn-standout">Call 911</a></p>
      </div>
      <div class="card rehab-naloxone-card">
        <div class="rehab-naloxone-heading">
          <span class="rehab-naloxone-icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg></span>
          <h2>Naloxone (overdose reversal)</h2>
        </div>
        <p style="margin:0;">Naloxone can reverse an opioid overdose and save lives. Many pharmacies offer it without a prescription; 211 or your local health department can point you to free distribution.</p>
      </div>
      <div class="card">
        <h2>24/7 treatment &amp; crisis referral</h2>
        <p style="margin:0 0 0.5rem 0;"><strong>SAMHSA National Helpline</strong> — Free, confidential information and referral for substance use and mental health treatment (US).</p>
        <p style="margin-top:0.75rem;"><a href="tel:18006624357" class="btn btn-tile" data-explain="1-800-662-4357 (HELP). 24/7 free referral to treatment and support.">Call 1-800-662-HELP (4357)</a></p>
        <p style="margin-top:0.5rem; font-size:0.9rem;"><a href="https://findtreatment.gov" target="_blank" rel="noopener">findtreatment.gov</a> — Search for treatment near you (SAMHSA)</p>
      </div>
      <div class="card">
        <h2>Support &amp; recovery</h2>
        <p style="margin:0 0 0.5rem 0;">Free peer support, family help, and alternatives to find treatment and stay in recovery.</p>
        <ul style="margin:0.5rem 0 0 1.2rem; padding:0; font-size:0.95rem;">
          <li style="margin-bottom:0.5rem;"><strong>Narcotics Anonymous (NA)</strong> — 24/7 helpline and free meetings worldwide. <a href="tel:18772766880">1-877-276-6880</a> · <a href="https://na.org" target="_blank" rel="noopener">na.org</a></li>
          <li style="margin-bottom:0.5rem;"><strong>Partnership to End Addiction</strong> — Help for families and individuals; support finding treatment. <a href="tel:18553784373">1-855-DRUGFREE (378-4373)</a> · <a href="https://drugfree.org" target="_blank" rel="noopener">drugfree.org</a></li>
          <li style="margin-bottom:0.5rem;"><strong>Crisis Text Line</strong> — 24/7 free crisis support by text (including substance use). Text <strong>HOME</strong> to <a href="sms:741741">741741</a></li>
        </ul>
      </div>
      <div class="card">
        <h2>Crisis support</h2>
        <p style="margin-top:0.75rem;"><a href="tel:988" class="btn btn-tile" data-explain="24/7 free support for anyone in distress or crisis. Call or text.">Call or text 988</a></p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    return section;
  };
  return layout(inner);
}
