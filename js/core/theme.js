/* Light/Dark, accent, mărime text: panou de personalizare injectat + salvare în localStorage (su2m:prefs) */
(function (S) {
  const DEF = { theme: 'dark', accent: 'green', scale: 1 };
  const SCALES = [[0.9, 'A−'], [1, 'A'], [1.12, 'A+'], [1.25, 'A++']];
  const get = () => Object.assign({}, DEF, S.storage.get('prefs', {}));

  function apply(p) {
    const r = document.documentElement;
    r.dataset.theme = p.theme;
    r.dataset.accent = p.accent;
    r.style.setProperty('--font-scale', p.scale);
  }

  function sync(p) {
    S.$$('[name="pref-theme"]').forEach(i => { i.checked = i.value === p.theme; });
    S.$$('[name="pref-accent"]').forEach(i => { i.checked = i.value === p.accent; });
    S.$$('[data-action="scale"]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.value === +p.scale)));
    S.$$('[data-action="theme-toggle"]').forEach(b => b.setAttribute('aria-label', p.theme === 'dark' ? 'Activează Light mode' : 'Activează Dark mode'));
  }

  function save(patch) {
    const p = Object.assign(get(), patch);
    S.storage.set('prefs', p);
    apply(p);
    sync(p);
    S.track('prefs_change', patch);
  }

  function inject() {
    const d = document.createElement('dialog');
    d.className = 'modal modal--sm';
    d.id = 'prefs';
    d.setAttribute('aria-labelledby', 'prefs-title');
    d.innerHTML = `<div class="modal__inner">
      <div class="modal__head"><div><span class="eyebrow">Personalizare</span><h2 id="prefs-title">Fă-l al tău</h2></div>
        <button class="icon-btn" type="button" data-close aria-label="Închide personalizarea">${S.icon('close')}</button></div>
      <div class="modal__body prefs">
        <fieldset><legend>Temă</legend><div class="seg">
          <label><input type="radio" name="pref-theme" value="dark"><span>Dark</span></label>
          <label><input type="radio" name="pref-theme" value="light"><span>Light</span></label>
        </div></fieldset>
        <fieldset><legend>Culoare accent</legend><div class="swatches">
          <label class="swatch" style="--sw:#2EE59D"><input type="radio" name="pref-accent" value="green"><span>Verde</span></label>
          <label class="swatch" style="--sw:#B26BFF"><input type="radio" name="pref-accent" value="purple"><span>Mov</span></label>
          <label class="swatch" style="--sw:#C6F432"><input type="radio" name="pref-accent" value="lime"><span>Lime</span></label>
        </div></fieldset>
        <fieldset><legend>Mărime text</legend><div class="seg" role="group" aria-label="Mărime text">
          ${SCALES.map(([v, l]) => `<button type="button" data-action="scale" data-value="${v}" aria-label="Text ${l}">${l}</button>`).join('')}
        </div></fieldset>
        <p class="muted" style="margin:0">Preferințele se salvează în browser și se aplică pe toate paginile.</p>
        <button class="btn btn--ghost btn--block" type="button" data-action="prefs-reset">Revino la setările implicite</button>
      </div></div>`;
    document.body.appendChild(d);
    d.addEventListener('change', e => {
      if (e.target.name === 'pref-theme') save({ theme: e.target.value });
      if (e.target.name === 'pref-accent') save({ accent: e.target.value });
    });
  }

  S.theme = {
    init() {
      inject();
      const p = get();
      apply(p);
      sync(p);
      document.addEventListener('click', e => {
        const t = e.target.closest('[data-action]');
        if (!t) return;
        const a = t.dataset.action;
        if (a === 'theme-toggle') save({ theme: get().theme === 'dark' ? 'light' : 'dark' });
        if (a === 'prefs-open') S.$('#prefs').showModal();
        if (a === 'scale') save({ scale: +t.dataset.value });
        if (a === 'prefs-reset') { S.storage.remove('prefs'); apply(DEF); sync(DEF); S.toast('Setările au revenit la implicit.'); }
      });
    }
  };
})(window.SU2M);
