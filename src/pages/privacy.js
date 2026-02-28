import { layout } from '../lib/layout.js';

export function renderPrivacy() {
  const inner = () => {
    const section = document.createElement('div');
    section.innerHTML = `
      <h1 class="page-title" data-shadow="PRIVACY">Why your privacy matters</h1>
      <div class="card">
        <h2>When you choose to share location</h2>
        <ul style="margin:0; padding-left:1.2rem; color:var(--muted);">
          <li><strong>You stay in control:</strong> If you tap “Use my location” (for example, to find services close to you), we use it only for that specific request. You can always say no.</li>
          <li><strong>Focused on safety and reconnection:</strong> If you use the Emergency or Missing Person flows and agree to share your location, it is used only to support that situation — such as helping trusted services, outreach, or authorities respond.</li>
          <li><strong>A real commitment, not a slogan:</strong> We work to collect as little as possible, use it only when it genuinely helps, and explain clearly what is happening so you can make your own choice.</li>
        </ul>
      </div>
      <div class="card">
        <h2>Why we are careful with location</h2>
        <p>Location can be powerful — it can help find nearby services, reconnect families, or guide outreach teams. But it can also put people at risk if it is misused or shared in the wrong way.</p>
        <p>Because of that, this app is built to work <strong>without</strong> tracking where you are. We do not quietly collect your location in the background, and we do not build profiles of where you go or who you are with.</p>
      </div>
      <p style="margin-top:1rem; text-align:center;">
        <a href="#/" class="btn secondary" data-nav>Back to home</a>
      </p>
    `;
    return section;
  };
  return layout(inner);
}
