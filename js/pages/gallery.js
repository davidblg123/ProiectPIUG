/* Galerie: filtre pe sport, grilă asimetrică, lightbox cu Previous/Next, tastatură și swipe; grilă de locații */
(function (S) {
  const D = () => S.data;
  let list = [], idx = 0, filter = '';

  function render() {
    list = D().gallery.filter(g => !filter || g.sport === filter);
    S.$$('#g-filters [data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    S.$('#g-count').textContent = `${list.length} ${list.length === 1 ? 'imagine' : 'imagini'}`;
    S.$('#g-grid').innerHTML = list.map((g, i) => {
      const s = D().sports[g.sport];
      return `<button class="g-item ${g.span ? 'g-item--' + g.span : ''}" type="button" data-i="${i}" style="--c:var(--sport-${g.sport})" aria-label="Mărește imaginea: ${S.esc(g.title)}, ${S.esc(g.place)}">
        <img src="${g.src.replace('w=1600', 'w=700')}" alt="${S.esc(g.title)}, ${S.esc(g.place)}" data-label="${s.name}" loading="lazy">
        <span class="tag">${s.name}</span>
        <span class="g-cap"><b>${S.esc(g.title)}</b><small>${S.esc(g.place)}</small></span></button>`;
    }).join('');
  }

  function show(i) {
    idx = (i + list.length) % list.length;
    const g = list[idx], s = D().sports[g.sport];
    S.setImg(S.$('#lb-img'), g.src, `${g.title}, ${g.place}`, s.name);
    S.$('#lb-title').textContent = g.title;
    S.$('#lb-place').textContent = `${s.name} · ${g.place}`;
    S.$('#lb-count').textContent = `${idx + 1} / ${list.length}`;
    [idx + 1, idx - 1].forEach(n => { new Image().src = list[(n + list.length) % list.length].src; });
  }

  S.pages.gallery = {
    init() {
      const dlg = S.$('#lightbox');
      S.$('#g-filters').innerHTML = `<button class="chip" type="button" data-filter="" aria-pressed="true">Toate</button>` +
        Object.entries(D().sports).map(([k, s]) => `<button class="chip" type="button" data-filter="${k}" style="--c:var(--sport-${k})" aria-pressed="false">${s.name}</button>`).join('');
      S.$('#loc-grid').innerHTML = D().locations.map(S.ui.locCard).join('');

      S.$('#g-filters').addEventListener('click', e => {
        const b = e.target.closest('[data-filter]');
        if (b) { filter = b.dataset.filter; render(); }
      });
      S.$('#g-grid').addEventListener('click', e => {
        const b = e.target.closest('.g-item');
        if (!b) return;
        show(+b.dataset.i);
        dlg.showModal();
        S.track('gallery_open', { title: list[idx].title });
      });
      S.$('#lb-prev').addEventListener('click', () => show(idx - 1));
      S.$('#lb-next').addEventListener('click', () => show(idx + 1));
      dlg.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      });
      /* Swipe pe touch */
      let x0 = null;
      const stage = S.$('.lb__stage', dlg);
      stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
        x0 = null;
      });

      render();
    }
  };
})(window.SU2M);
