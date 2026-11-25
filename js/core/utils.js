/* Namespace global, iconițe SVG, helperi DOM/text/date, toast, fallback imagini, validare câmpuri */
window.SU2M = window.SU2M || {};
(function (S) {
  S.pages = S.pages || {};

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    prev: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    pin: '<path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    crown: '<path d="M3 18h18M4 15 3 7l5 4 4-6 4 6 5-4-1 8z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    facebook: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.2 4 5 4.3"/>',
    x: '<path d="M4 4l6.6 8.6L4 20h2l5.5-6.2L16 20h4l-6.9-9L19.5 4h-2l-5.1 5.7L8 4z"/>'
  };
  const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="su2m-lg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2EE59D"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#su2m-lg)"/><path d="M8 21l5-5 3 3 7-8" fill="none" stroke="#0E0A18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="23.5" cy="7.5" r="2.4" fill="#0E0A18"/></svg>';

  S.icon = name => name === 'logo' ? LOGO
    : `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  S.$ = (sel, root = document) => root.querySelector(sel);
  S.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  S.fillIcons = (root = document) => S.$$('[data-icon]', root).forEach(el => {
    if (!el.querySelector('svg')) el.innerHTML = S.icon(el.dataset.icon);
  });

  S.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  S.norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  S.initials = name => name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  S.reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  S.isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  S.today = () => S.isoDate(new Date());
  S.fmtDate = iso => {
    if (iso === S.today()) return 'Azi';
    const t = new Date(); t.setDate(t.getDate() + 1);
    if (iso === S.isoDate(t)) return 'Mâine';
    return new Date(iso + 'T00:00').toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  /* PRNG determinist (mulberry32) + hash FNV-1a: date mock stabile, dar diferite de la o zi la alta */
  S.hash = str => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  S.rand = seed => () => {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let toastEl, toastTimer;
  S.toast = msg => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  };

  /* Imagine de rezervă (gradient verde → mov + etichetă) când Unsplash nu răspunde */
  S.fallbackImg = label => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2EE59D"/><stop offset="1" stop-color="#4C1D95"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="640" cy="140" r="90" fill="none" stroke="#0E0A18" stroke-opacity=".25" stroke-width="18"/><text x="60" y="520" fill="#0E0A18" font-family="Arial, sans-serif" font-size="64" font-weight="700">${S.esc(label)}</text></svg>`
  );
  S.fixImg = img => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.classList.add('is-fallback');
    img.src = S.fallbackImg(img.dataset.label || img.alt || 'ShowUp2Move');
  };
  S.setImg = (img, src, alt, label) => {
    delete img.dataset.fallback;
    img.classList.remove('is-fallback');
    img.alt = alt;
    img.dataset.label = label;
    img.src = src;
  };

  /* Afișează/șterge eroarea unui câmp din .field; returnează true dacă e valid */
  S.fieldError = (input, msg) => {
    const f = input.closest('.field');
    const filled = input.type === 'checkbox' ? input.checked : String(input.value).trim() !== '';
    f.classList.toggle('is-invalid', !!msg);
    f.classList.toggle('is-valid', !msg && filled);
    input.setAttribute('aria-invalid', String(!!msg));
    const err = f.querySelector('.field__error');
    if (err) err.textContent = msg || '';
    return !msg;
  };
})(window.SU2M);
