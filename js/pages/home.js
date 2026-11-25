/* Acasă: ShowUpToday, statistici, conținut adaptat profilului (nivel + sport), bandă de locații */
(function (S) {
  const D = () => S.data;

  function renderShowUp() {
    const a = S.showup.get(), box = S.$('#showup-result');
    S.$$('[data-showup]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.showup === a)));
    if (!a) { box.innerHTML = '<p class="muted">Răspunsul expiră la miezul nopții. Mâine te întrebăm din nou.</p>'; return; }
    if (a === 'nu') {
      box.innerHTML = '<p>Ok, azi pauză. Te întrebăm din nou mâine.</p><button class="btn btn--ghost btn--sm" type="button" data-showup-reset>M-am răzgândit</button>';
      return;
    }
    const p = S.profile.get(), sp = D().sports[p.sport];
    const n = D().availableToday().filter(u => u.sports.includes(p.sport)).length + 1;
    const need = Math.max(0, sp.min - n);
    box.innerHTML = `<p><strong>${n} oameni</strong> vor să joace ${sp.name.toLowerCase()} azi, inclusiv tu. ${need ? `Mai lipsesc ${need} ca grupul să pornească.` : 'Sunt destui pentru cel puțin un grup complet.'}</p>
      <a class="btn btn--primary btn--sm" href="evenimente.html#grupuri">Vezi grupul tău ${S.icon('next')}</a>`;
  }

  function renderPersona() {
    const p = S.profile.get(), sp = D().sports[p.sport], per = D().personas[p.level];
    S.$$('[data-level]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.level === p.level)));
    S.$$('[data-sport-pick]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sportPick === p.sport)));

    const evs = D().allEvents().filter(e => e.sport === p.sport)
      .sort((a, b) => (b.level === p.level) - (a.level === p.level) || (a.date + a.time).localeCompare(b.date + b.time));
    const recs = evs.slice(0, 3).map(e => `<a href="evenimente.html#cauta">
        <span><b>${S.esc(e.title)}</b><br><small>${S.fmtDate(e.date)} · ${e.time} · ${S.esc(e.zone)}</small></span>
        <span class="tag tag--level">${D().levels[e.level]}</span></a>`).join('');

    S.$('#persona').innerHTML = `
      <div class="persona__img"><img src="${sp.img}" alt="${sp.name}: imagine reprezentativă" data-label="${sp.name}" loading="lazy">
        <span class="tag" style="--c:var(--sport-${p.sport})">${sp.name} · ${D().levels[p.level]}</span></div>
      <div class="persona__body">
        <h3>${per.title}</h3>
        <p class="muted">${per.text} ${sp.pitch}</p>
        <ol class="tips">${per.tips.map(t => `<li>${t}</li>`).join('')}</ol>
        <h4>Recomandate pentru tine</h4>
        <div class="rec">${recs || '<p class="muted">Niciun eveniment încă. <a href="evenimente.html#creeaza">Creează primul</a>.</p>'}</div>
      </div>`;

    /* Hero-ul urmează sportul ales */
    S.setImg(S.$('#hero-img'), sp.img, `${sp.name}: imagine reprezentativă`, sp.name);
    const tag = S.$('#hero-tag');
    tag.textContent = sp.name;
    tag.style.setProperty('--c', `var(--sport-${p.sport})`);
    const e = evs[0];
    if (e) {
      S.$('#hero-ev').innerHTML = `${e.joined}/${e.max}<small>${S.esc(D().loc(e.loc).name)} · ${e.time}</small>`;
      S.$('#hero-cap').innerHTML = `${S.esc(e.captain)}<small>căpitan, ${sp.name.toLowerCase()}</small>`;
    }
  }

  function countUp() {
    const vals = { available: D().availableToday().length, events: D().allEvents().length, locations: D().locations.length, sports: Object.keys(D().sports).length };
    S.$$('[data-stat]').forEach(el => {
      const to = vals[el.dataset.stat];
      if (S.reducedMotion()) { el.textContent = to; return; }
      let t0;
      const step = ts => {
        t0 = t0 || ts;
        const k = Math.min(1, (ts - t0) / 900);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  S.pages.home = {
    init() {
      S.$('#sport-picks').innerHTML = Object.entries(D().sports).map(([k, s]) =>
        `<button class="chip" type="button" data-sport-pick="${k}" style="--c:var(--sport-${k})" aria-pressed="false">${s.name} <small>${s.min}–${s.max}</small></button>`).join('');
      S.$('#loc-strip').innerHTML = D().locations.map(S.ui.locCard).join('');

      document.addEventListener('click', e => {
        const lv = e.target.closest('[data-level]'), sp = e.target.closest('[data-sport-pick]');
        if (lv) S.profile.set({ level: lv.dataset.level });
        if (sp) S.profile.set({ sport: sp.dataset.sportPick });
      });
      document.addEventListener('su2m:profile', () => { renderPersona(); renderShowUp(); });
      document.addEventListener('su2m:showup', renderShowUp);

      renderShowUp();
      renderPersona();
      countUp();
    }
  };
})(window.SU2M);
