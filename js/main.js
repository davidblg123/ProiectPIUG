/* Punct de intrare: inițializează modulele comune, apoi scriptul paginii curente (body[data-page]) */
(function (S) {
  ['theme', 'nav', 'scroll', 'help', 'chatbot'].forEach(m => S[m] && S[m].init());
  S.fillIcons();

  /* Modale: [data-close] sau click pe fundal închide <dialog>-ul */
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-close]');
    if (c) c.closest('dialog').close();
    if (e.target.tagName === 'DIALOG') e.target.close();
  });

  /* ShowUpToday: butoanele pot apărea pe orice pagină */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-showup]');
    if (b) {
      S.showup.set(b.dataset.showup);
      S.toast(b.dataset.showup === 'da' ? 'Super! Ești disponibil azi. Îți căutăm grupul.' : 'Ok, azi pauză. Te întrebăm din nou mâine.');
    }
    if (e.target.closest('[data-showup-reset]')) S.showup.clear();
  });

  /* Fallback pentru imaginile care nu se încarcă (inclusiv cele randate ulterior) */
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') S.fixImg(e.target); }, true);
  S.$$('img').forEach(img => { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) S.fixImg(img); });

  S.$$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const page = S.pages[document.body.dataset.page];
  if (page) page.init();
  S.fillIcons();
  if (S.scroll.update) S.scroll.update();
})(window.SU2M);
