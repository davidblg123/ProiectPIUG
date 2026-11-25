/* Grupuri & Evenimente: generator de grupuri spontane, căutare/filtrare live, creare eveniment */
(function (S) {
  const D = () => S.data;
  const SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00'];
  const st = { q: '', sport: '', zone: '', level: '', size: '' };
  const joined = () => S.storage.get('joined', []);

  const options = (pairs, all) => (all ? `<option value="">${all}</option>` : '') + pairs.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  const sportPairs = () => Object.entries(D().sports).map(([k, s]) => [k, `${s.name} (${s.min}–${s.max})`]);
  const zonePairs = () => D().zones.map(z => [z, z]);
  const levelPairs = () => Object.entries(D().levels);

  /* ---------- Generator de grupuri ---------- */
  function makeGroup(k, members, zone, need) {
    const s = D().sports[k];
    const cap = members.reduce((a, b) => (b.trust > a.trust ? b : a));
    const loc = D().locations.filter(l => l.sports.includes(k))
      .sort((a, b) => (b.zone === zone) - (a.zone === zone) || a.price - b.price)[0];
    return { k, s, members, cap, loc, need, cost: loc ? D().cost(loc.id, k, members.length) : 0, hasMe: members.some(m => m.me) };
  }

  function generate() {
    const sportSel = S.$('#g-sport').value, zone = S.$('#g-zone').value;
    const ans = S.showup.get(), p = S.profile.get();
    const avail = D().availableToday();
    const groups = [];

    (sportSel ? [sportSel] : Object.keys(D().sports)).forEach(k => {
      const s = D().sports[k];
      const pool = avail.filter(u => u.sports.includes(k))
        .sort((a, b) => (b.zone === zone) - (a.zone === zone) || b.trust - a.trust);
      if (ans === 'da' && (sportSel || k === p.sport)) {
        pool.unshift({ id: 'me', me: true, name: 'Tu', zone, level: p.level, trust: p.level === 'avansat' ? 99 : 70 });
      }
      if (pool.length >= s.min) {
        const n = Math.max(1, Math.min(Math.ceil(pool.length / s.max), Math.floor(pool.length / s.min)));
        for (let i = 0; i < n; i++) groups.push(makeGroup(k, pool.splice(0, Math.min(s.max, Math.ceil(pool.length / (n - i)))), zone, 0));
      }
      if (pool.length) groups.push(makeGroup(k, pool, zone, s.min - pool.length));
    });

    groups.sort((a, b) => b.hasMe - a.hasMe);
    renderGroups(groups, avail.length);
    S.track('groups_generate', { sport: sportSel || 'toate', zone });
  }

  function renderGroups(groups, availCount) {
    const ans = S.showup.get(), p = S.profile.get();
    const ready = groups.filter(g => !g.need).length;
    S.$('#g-notice').innerHTML = ans === 'da'
      ? `<div class="notice notice--ok"><p><b>Ești disponibil azi.</b> Te-am pus în grupul de ${D().sports[S.$('#g-sport').value || p.sport].name.toLowerCase()}.</p></div>`
      : `<div class="notice"><p>${ans === 'nu' ? 'Ai răspuns <b>Nu</b> azi' : 'Nu ai răspuns încă la <b>ShowUpToday?</b>'}, deci vezi grupurile fără tine.</p><button class="btn btn--primary btn--sm" type="button" data-showup="da">${S.icon('bolt')} Da, joc azi</button></div>`;
    S.$('#g-meta').innerHTML = `<span><b>${availCount}</b> oameni disponibili azi · <b>${ready}</b> ${ready === 1 ? 'grup gata' : 'grupuri gata'} de joc</span><span>Actualizat pentru ${S.fmtDate(S.today()).toLowerCase()}</span>`;

    const confirmed = S.storage.get('confirmed') === S.today();
    S.$('#g-grid').innerHTML = groups.length ? groups.map((g, i) => {
      const shown = g.members.slice(0, 8), extra = g.members.length - shown.length;
      return `<article class="group-card ${g.need ? 'group-card--forming' : ''}" style="--c:var(--sport-${g.k});--i:${i}">
        <div class="group-card__head">${S.ui.sportTag(g.k)}${g.hasMe ? '<span class="tag tag--mine">Grupul tău</span>' : ''}</div>
        <div><div class="group-card__size">${g.members.length}<small> / ${g.s.max}</small></div>
          <small class="muted">${g.need ? `În formare: mai lipsesc ${g.need} ${g.need === 1 ? 'jucător' : 'jucători'}` : `Gata de joc · ideal ${g.s.min}–${g.s.max}`}</small></div>
        <div class="cap"><span class="avatar ${g.cap.me ? 'is-me' : ''}" style="--h:${g.cap.hue || 150}">${S.initials(g.cap.name)}</span>
          <div><span class="badge-cap">${S.icon('crown')}Căpitan</span><b>${S.esc(g.cap.name)}</b><small class="muted">încredere ${g.cap.trust}</small></div></div>
        <div class="avatars" aria-label="Membri: ${g.members.map(m => m.name).join(', ')}">
          ${shown.map(m => `<span class="avatar ${m.me ? 'is-me' : ''}" style="--h:${m.hue || 150}" title="${S.esc(m.name)}">${S.initials(m.name)}</span>`).join('')}
          ${extra > 0 ? `<span class="avatar avatar--more">+${extra}</span>` : ''}</div>
        <ul class="meta">
          <li>${S.icon('pin')}${g.loc ? `${S.esc(g.loc.name)} · ${S.esc(g.loc.zone)}` : 'Locație de stabilit'}</li>
          <li>${S.icon('clock')}Azi, ${SLOTS[i % SLOTS.length]} · ${String(g.s.dur).replace('.', ',')} h</li>
          <li>${S.icon('coin')}${g.cost ? `~${g.cost} lei / persoană` : 'Gratuit'}</li>
        </ul>
        ${g.hasMe && !g.need ? `<button class="btn btn--sm ${confirmed ? 'btn--ghost is-joined' : 'btn--primary'}" type="button" data-confirm>${confirmed ? S.icon('check') + ' Prezență confirmată' : 'Confirm prezența'}</button>` : ''}
      </article>`;
    }).join('') : '<div class="empty"><h3>Nimeni disponibil pentru acest sport azi.</h3><p>Încearcă alt sport sau creează un eveniment pentru zilele următoare.</p></div>';
  }

  /* ---------- Căutare & filtre ---------- */
  function matches(e) {
    const s = D().sports[e.sport], l = D().loc(e.loc);
    const hay = S.norm([e.title, s.name, l && l.name, e.zone, D().levels[e.level], e.captain, S.fmtDate(e.date)].join(' '));
    if (st.q && !S.norm(st.q).split(/\s+/).filter(Boolean).every(w => hay.includes(w))) return false;
    if (st.sport && e.sport !== st.sport) return false;
    if (st.zone && e.zone !== st.zone) return false;
    if (st.level && e.level !== st.level) return false;
    if (st.size === 'mic' && e.max > 4) return false;
    if (st.size === 'mediu' && (e.max < 5 || e.max > 10)) return false;
    if (st.size === 'mare' && e.max < 11) return false;
    return true;
  }

  function card(e, isIn) {
    const s = D().sports[e.sport], l = D().loc(e.loc);
    const n = e.joined + (isIn ? 1 : 0), full = n >= e.max, cost = D().cost(e.loc, e.sport, e.max);
    const action = e.mine
      ? `<button class="btn btn--ghost btn--sm" type="button" data-del="${e.id}">${S.icon('trash')} Șterge</button>`
      : isIn
        ? `<button class="btn btn--ghost btn--sm is-joined" type="button" data-join="${e.id}">${S.icon('check')} Ești înscris</button>`
        : `<button class="btn btn--primary btn--sm" type="button" data-join="${e.id}" ${full ? 'disabled' : ''}>${full ? 'Complet' : S.icon('plus') + ' Mă alătur'}</button>`;
    return `<article class="event-card" id="ev-${e.id}" style="--c:var(--sport-${e.sport})">
      <div class="event-card__top">${S.ui.sportTag(e.sport)}<span class="tag tag--level">${D().levels[e.level]}</span>${e.mine ? '<span class="tag tag--mine">Creat de tine</span>' : ''}</div>
      <h3>${S.esc(e.title)}</h3>
      <ul class="meta">
        <li>${S.icon('pin')}${S.esc(l ? l.name : '—')} · ${S.esc(e.zone)}</li>
        <li>${S.icon('clock')}${S.fmtDate(e.date)}, ${e.time}</li>
        <li>${S.icon('coin')}${cost ? `~${cost} lei / persoană` : 'Gratuit'}</li>
      </ul>
      <div class="bar" aria-hidden="true"><span style="width:${Math.min(100, n / e.max * 100)}%"></span></div>
      <div class="event-card__foot"><span><b>${n}/${e.max}</b> jucători</span><span class="badge-cap">${S.icon('crown')}${S.esc(e.captain)}</span></div>
      <div class="actions">${action}</div>
    </article>`;
  }

  function renderEvents() {
    const j = joined();
    const list = D().allEvents().filter(matches).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    S.$('#ev-count').innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'eveniment găsit' : 'evenimente găsite'}`;
    S.$('#ev-grid').innerHTML = list.length ? list.map(e => card(e, j.includes(e.id))).join('')
      : `<div class="empty"><h3>Nimic pe radar${st.q ? ` pentru „${S.esc(st.q)}”` : ''}.</h3>
          <p>Niciun eveniment nu se potrivește filtrelor. Încearcă alt sport sau altă zonă, ori creează tu evenimentul.</p>
          <div class="chips"><button class="btn btn--ghost btn--sm" type="button" data-reset>Resetează filtrele</button><a class="btn btn--primary btn--sm" href="#creeaza">Creează eveniment</a></div></div>`;
  }

  /* ---------- Creare eveniment ---------- */
  function refreshCreate() {
    const k = S.$('#c-sport').value, z = S.$('#c-zone').value, locSel = S.$('#c-loc'), max = S.$('#c-max');
    const locs = D().locations.filter(l => (!k || l.sports.includes(k)) && (!z || l.zone === z));
    locSel.innerHTML = locs.length
      ? options(locs.map(l => [l.id, `${l.name} · ${l.price ? l.price + ' lei/oră' : 'gratuit'}`]), 'Alege locația')
      : '<option value="">Nicio locație pentru alegerea ta</option>';
    S.$('#c-loc-hint').textContent = k && z && !locs.length ? 'Nu există teren pentru acest sport în zona aleasă. Încearcă altă zonă.' : 'Lista arată doar locațiile potrivite pentru sport și zonă.';
    if (k) {
      const s = D().sports[k];
      max.min = s.min; max.max = s.max;
      if (!max.value || +max.value < s.min || +max.value > s.max) max.value = s.max;
      S.$('#c-max-hint').textContent = `${s.name}: între ${s.min} și ${s.max} jucători.`;
    }
  }

  function validateCreate(f) {
    const v = n => f.elements[n].value.trim();
    const s = D().sports[v('sport')];
    const now = new Date(), nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const rules = {
      title: () => v('title').length < 3 ? 'Titlul trebuie să aibă cel puțin 3 caractere.' : '',
      sport: () => !s ? 'Alege sportul.' : '',
      zone: () => !v('zone') ? 'Alege zona.' : '',
      loc: () => !v('loc') ? 'Alege o locație.' : '',
      date: () => !v('date') ? 'Alege data.' : v('date') < S.today() ? 'Data nu poate fi în trecut.' : '',
      time: () => !v('time') ? 'Alege ora.' : v('date') === S.today() && v('time') <= nowTime ? 'Ora a trecut deja pentru azi.' : '',
      max: () => { const n = +v('max'); return !s ? 'Alege întâi sportul.' : !Number.isInteger(n) || n < s.min || n > s.max ? `Pentru ${s.name.toLowerCase()} alege între ${s.min} și ${s.max} jucători.` : ''; },
      level: () => !v('level') ? 'Alege nivelul.' : ''
    };
    let first = null;
    Object.entries(rules).forEach(([name, rule]) => {
      const ok = S.fieldError(f.elements[name], rule());
      if (!ok && !first) first = f.elements[name];
    });
    return first;
  }

  S.pages.events = {
    init() {
      const p = S.profile.get();
      S.$('#g-sport').innerHTML = options(sportPairs(), 'Toate sporturile');
      S.$('#g-zone').innerHTML = options(zonePairs());
      S.$('#g-sport').value = p.sport;
      S.$('#g-zone').value = p.zone;
      S.$('#f-sport').innerHTML = options(sportPairs(), 'Toate sporturile');
      S.$('#f-zone').innerHTML = options(zonePairs(), 'Toate zonele');
      S.$('#f-level').innerHTML = options(levelPairs(), 'Toate nivelurile');
      S.$('#c-sport').innerHTML = options(sportPairs(), 'Alege sportul');
      S.$('#c-zone').innerHTML = options(zonePairs(), 'Alege zona');
      S.$('#c-level').innerHTML = options(levelPairs(), 'Alege nivelul');
      S.$('#c-date').min = S.today();
      S.$('#c-date').value = S.today();
      refreshCreate();

      S.$('#gen-form').addEventListener('submit', e => {
        e.preventDefault();
        S.profile.set({ zone: S.$('#g-zone').value });
        generate();
      });
      document.addEventListener('su2m:showup', generate);

      /* Filtre live */
      const filters = S.$('#filters');
      const map = { 'f-q': 'q', 'f-sport': 'sport', 'f-zone': 'zone', 'f-level': 'level', 'f-size': 'size' };
      filters.addEventListener('input', e => { if (map[e.target.id]) { st[map[e.target.id]] = e.target.value.trim(); renderEvents(); } });
      filters.addEventListener('submit', e => e.preventDefault());
      filters.addEventListener('reset', () => setTimeout(() => { Object.keys(st).forEach(k => { st[k] = ''; }); renderEvents(); }));
      let searchTimer;
      S.$('#f-q').addEventListener('input', e => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { if (e.target.value.trim()) S.track('search', { search_term: e.target.value.trim() }); }, 800); });

      document.addEventListener('click', e => {
        const join = e.target.closest('[data-join]'), del = e.target.closest('[data-del]');
        if (e.target.closest('[data-reset]')) { filters.reset(); S.$('#f-q').focus(); }
        if (join) {
          const id = join.dataset.join, j = joined(), i = j.indexOf(id);
          i >= 0 ? j.splice(i, 1) : j.push(id);
          S.storage.set('joined', j);
          S.toast(i >= 0 ? 'Te-ai retras din eveniment.' : 'Gata, ești în echipă! Căpitanul a fost anunțat.');
          S.track('event_join', { id, joined: i < 0 });
          renderEvents();
        }
        if (del) {
          S.storage.set('events', S.storage.get('events', []).filter(x => x.id !== del.dataset.del));
          S.toast('Evenimentul a fost șters.');
          renderEvents();
        }
        if (e.target.closest('[data-confirm]')) {
          S.storage.set('confirmed', S.today());
          S.toast('Prezență confirmată. Scorul tău de încredere crește.');
          generate();
        }
      });

      /* Creare */
      const cf = S.$('#create-form');
      cf.addEventListener('change', e => { if (e.target.name === 'sport' || e.target.name === 'zone') refreshCreate(); });
      cf.addEventListener('focusout', e => { if (e.target.name && e.target.closest('.field.is-invalid')) validateCreate(cf); });
      cf.addEventListener('submit', e => {
        e.preventDefault();
        const bad = validateCreate(cf);
        if (bad) { bad.focus(); return; }
        const v = n => cf.elements[n].value.trim();
        const ev = { id: 'u' + Date.now(), title: v('title'), sport: v('sport'), loc: v('loc'), date: v('date'), time: v('time'), level: v('level'), joined: 1, max: +v('max'), captain: 'Tu' };
        S.storage.set('events', S.storage.get('events', []).concat(ev));
        S.track('event_create', { sport: ev.sport });
        cf.reset();
        S.$$('.field', cf).forEach(f => f.classList.remove('is-valid', 'is-invalid'));
        S.$('#c-date').value = S.today();
        refreshCreate();
        filters.reset();
        setTimeout(() => {
          const el = S.$('#ev-' + ev.id);
          if (!el) return;
          el.classList.add('is-new');
          el.scrollIntoView({ behavior: S.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
          setTimeout(() => el.classList.remove('is-new'), 2500);
        }, 50);
        S.toast('Evenimentul a fost publicat. Ești căpitanul lui!');
      });

      generate();
      renderEvents();
    }
  };
})(window.SU2M);
