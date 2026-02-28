import { layout } from '../lib/layout.js';
import { playTap } from '../lib/sounds.js';

export function renderMissing() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="MISSING PERSONS">Missing persons</h1>
      <div class="missing-ticker" aria-label="Official missing children resources">
        <div class="missing-ticker-track">
          <a href="https://www.missingkids.org/gethelpnow/search" target="_blank" rel="noopener">View current missing children cases on NCMEC (missingkids.org)</a>
          <a href="https://www.missingkids.org/gethelpnow/search" target="_blank" rel="noopener">Open missing children posters on NCMEC</a>
          <a href="https://www.missingkids.org/gethelpnow/search#byCity" target="_blank" rel="noopener">Search missing children by city on NCMEC</a>
          <a href="https://namus.nij.ojp.gov" target="_blank" rel="noopener">Search NamUs — national missing &amp; unidentified persons system</a>
        </div>
      </div>
      <p style="margin:0 0 0.75rem 0;">
        If you have found someone who may be missing, or you need to report someone missing, you can follow these steps:
      </p>
      <ol class="missing-steps">
        <li>
          <div>
            <div class="missing-step-title">Check for immediate danger</div>
            <p>If there is any <strong>immediate, life-threatening danger</strong> (weapons, medical emergency, active violence), treat it as an emergency and call <strong>911</strong> first.</p>
          </div>
        </li>
        <li>
          <div>
            <div class="missing-step-title">Write down key details</div>
            <p>Name (if known), age, what they look like, clothing, license plate (if a vehicle is involved), last seen location and time, and any medical or mental health needs.</p>
            <form class="missing-notes-form">
              <div class="missing-notes-row">
                <label for="missing-name">Name</label>
                <input id="missing-name" type="text" placeholder="Full name or nickname (if known)" />
              </div>
              <div class="missing-notes-row">
                <label for="missing-age">Age</label>
                <input id="missing-age" type="text" placeholder="Approximate age" />
              </div>
              <div class="missing-notes-row">
                <label for="missing-appearance">What they look like &amp; clothing</label>
                <textarea id="missing-appearance" rows="3" placeholder="Height, build, hair, clothing, glasses, tattoos, etc."></textarea>
              </div>
              <div class="missing-notes-row">
                <label for="missing-last-seen">Last seen</label>
                <textarea id="missing-last-seen" rows="2" placeholder="Where and when they were last seen."></textarea>
              </div>
              <div class="missing-notes-row">
                <label for="missing-medical">Medical or mental health needs</label>
                <textarea id="missing-medical" rows="2" placeholder="Medications, diagnoses, or other safety concerns."></textarea>
              </div>
            </form>
            <p class="missing-notes-hint">This page does not send or save what you type. It’s just a place to gather details before you call.</p>
            <p style="margin-top:0.4rem; text-align:center;">
              <button type="button" class="btn" data-download-missing>Download these notes (.txt)</button>
            </p>
          </div>
        </li>
        <li>
          <div>
            <div class="missing-step-title">Contact police about a missing person report</div>
            <p>Call your local police department. Tell them you are reporting or asking about a <strong>missing person report</strong> and share the details you wrote down.</p>
          </div>
        </li>
        <li>
          <div>
            <div class="missing-step-title">Get extra help if you feel stuck</div>
            <p>If you’re unsure what to do next, you can call <strong>211</strong> in the US to ask about outreach teams, shelters, or other local services that may be able to help.</p>
          </div>
        </li>
      </ol>
      <div class="card">
        <h2>If you believe they are in immediate danger</h2>
        <p style="margin-top:0.75rem;">
          <a href="#/emergency" class="btn btn-tile btn-standout" data-nav data-explain="If you think the missing person is in immediate, life-threatening danger, treat it as an emergency and go to the Emergency page.">Go to Emergency page</a>
        </p>
      </div>
      <div class="card">
        <h2>Who to contact</h2>
        <p style="margin-bottom:0.5rem;">If it is not an immediate emergency, you can:</p>
        <ul style="margin:0 0 0.75rem 1.1rem; padding:0; font-size:0.95rem; color:#64748b;">
          <li>Contact your local police department's <strong>non-emergency</strong> line to file a missing person report.</li>
          <li>If the missing person is a child (in the US), contact the <strong>National Center for Missing &amp; Exploited Children (NCMEC)</strong> at 1-800-THE-LOST (843-5678) or visit <a href="https://www.missingkids.org" target="_blank" rel="noopener">missingkids.org</a>.</li>
          <li>In the US, dial <strong>211</strong> for help connecting with local resources and outreach.</li>
        </ul>
        <p style="font-size:0.9rem; color:#64748b;">
          Keep recent photos and details (name, age, last seen location, clothing, medical needs) ready when you contact authorities.
        </p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    const downloadBtn = section.querySelector('[data-download-missing]');
    if (downloadBtn) {
      downloadBtn.addEventListener('pointerdown', () => playTap());
      downloadBtn.addEventListener('click', () => {
        const name = (document.getElementById('missing-name') || {}).value || '';
        const age = (document.getElementById('missing-age') || {}).value || '';
        const appearance = (document.getElementById('missing-appearance') || {}).value || '';
        const lastSeen = (document.getElementById('missing-last-seen') || {}).value || '';
        const medical = (document.getElementById('missing-medical') || {}).value || '';
        const lines = [
          'Missing person notes',
          '=====================',
          '',
          `Name: ${name}`,
          `Age: ${age}`,
          '',
          'What they look like & clothing:',
          appearance,
          '',
          'Last seen (place, time):',
          lastSeen,
          '',
          'Medical or mental health needs:',
          medical,
          '',
          'These are your personal notes. Share only what feels safe with responders.'
        ];
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'missing-person-notes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
    return section;
  };
  return layout(inner);
}



