/* Componente & Ghid: căutare + filtru de status în tabelul de componente, tabel de sporturi generat din date */
(function (S) {
  const D = () => S.data;

  S.pages.components = {
    init() {
      const rows = S.$$('#comp-table tbody tr:not(.empty-row)');
      const empty = S.$('#comp-table .empty-row');
      const input = S.$('#t-q');
      let status = '';

      const apply = () => {
        const q = S.norm(input.value.trim());
        let n = 0;
        rows.forEach(r => {
          const ok = (!q || S.norm(r.textContent).includes(q)) && (!status || r.dataset.status === status);
          r.hidden = !ok;
          n += ok;
        });
        empty.hidden = n > 0;
        S.$('#t-count').innerHTML = `<span><b>${n}</b> din ${rows.length} componente</span>`;
      };

      input.addEventListener('input', apply);
      S.$('#t-status').addEventListener('click', e => {
        const b = e.target.closest('[data-status]');
        if (!b) return;
        status = b.dataset.status;
        S.$$('#t-status [data-status]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        apply();
      });

      S.$('#sports-body').innerHTML = Object.entries(D().sports).map(([k, s]) => {
        const locs = D().locations.filter(l => l.sports.includes(k));
        const minCost = Math.min(...locs.map(l => D().cost(l.id, k, s.max)));
        return `<tr><th scope="row">${S.ui.sportTag(k)}</th><td><b>${s.min}–${s.max}</b></td><td>${String(s.dur).replace('.', ',')} h</td>
          <td class="muted">${s.equip}</td><td>${locs.length}</td><td>${minCost ? `de la ${minCost} lei` : 'Gratuit'}</td></tr>`;
      }).join('');

      apply();
    }
  };
})(window.SU2M);
