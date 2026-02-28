import { layout } from '../lib/layout.js';

export function renderHelp211() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="211 &amp; HELP LINES">211 &amp; help lines</h1>
      <p class="muted" style="margin:0 0 1rem 0;">Free, confidential help for shelter, food, health, and crisis.</p>
      <div class="card">
        <h2>211</h2>
        <p style="margin-top:0.75rem;"><a href="tel:211" class="btn btn-tile" data-explain="Information and referral for local services: shelter, meals, counseling, and more. Available in many areas across the US and Canada.">Call 211</a></p>
      </div>
      <div class="card">
        <h2>988 Suicide &amp; Crisis Lifeline</h2>
        <p style="margin-top:0.75rem;"><a href="tel:988" class="btn btn-tile" data-explain="24/7 free support for anyone in distress or crisis. After connecting, press 1 for the Veterans Crisis Line.">Call or text 988</a></p>
      </div>
      <div class="card">
        <h2>National Runaway Safeline</h2>
        <p style="margin-top:0.75rem;"><a href="tel:18007862929" class="btn btn-tile" data-explain="1-800-RUNAWAY — for youth and families. Confidential, 24/7.">Call 1-800-RUNAWAY</a></p>
      </div>
      <div class="card">
        <h2>Domestic violence support</h2>
        <p style="margin-top:0.75rem;"><a href="tel:18007997233" class="btn btn-tile" data-explain="National Domestic Violence Hotline (US). 24/7 confidential support, safety planning, and help finding local resources.">Call 1-800-799-SAFE (7233)</a></p>
      </div>
      <div class="card">
        <h2>Human trafficking help</h2>
        <p style="margin-top:0.75rem;"><a href="tel:18883737888" class="btn btn-tile" data-explain="National Human Trafficking Hotline (US). 24/7 confidential help for victims and people who are concerned about trafficking.">Call 1-888-373-7888</a></p>
      </div>
      <div class="card">
        <h2>Veterans &amp; housing</h2>
        <p style="margin-top:0.75rem;"><a href="tel:18774243838" class="btn btn-tile" data-explain="VA Homeless Veterans line (US). Ask about shelter, housing, or HUD-VASH (housing vouchers with VA support).">Call 1-877-4AID-VET (424-3838)</a></p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    return section;
  };
  return layout(inner);
}


