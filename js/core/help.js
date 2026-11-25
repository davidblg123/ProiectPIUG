/* Buton Help (iconiță) + ghid rapid în modal, cu sfaturi specifice paginii curente. Scurtătură: tasta „?” */
(function (S) {
  const STEPS = [
    ['bolt', 'var(--green)', '<b>Răspunde „ShowUpToday?”</b> cu Da sau Nu. Răspunsul e valabil până la miezul nopții.'],
    ['users', 'var(--violet)', '<b>Primești un grup</b> cu oameni disponibili din zona ta, în intervalul ideal pentru sport.'],
    ['crown', 'var(--lime)', '<b>Căpitanul</b> e cel mai de încredere membru. El confirmă ora și terenul.'],
    ['coin', 'var(--sport-alergare)', '<b>Vezi bugetul</b> estimat pe persoană înainte să confirmi prezența.']
  ];
  const PAGE = {
    home: ['Apasă <b>Da, joc azi</b> sau <b>Nu azi</b> în cardul ShowUpToday.', 'La „Pentru cine e azi?” alegi nivelul și sportul. Textele, imaginea și recomandările se schimbă pe loc.', 'Derulează orizontal lista de locații ca să vezi toate terenurile.'],
    events: ['<b>Generează grupuri</b>: alege sportul și zona. Ești inclus doar dacă ai răspuns Da azi.', '<b>Caută</b> după cuvinte (ex. „campus seară”) și combină filtrele. Rezultatele se actualizează pe loc.', '<b>Creează</b> un eveniment: intervalul de jucători și locațiile se ajustează după sportul și zona alese.'],
    gallery: ['Filtrează imaginile după sport cu butoanele de deasupra grilei.', 'Apasă pe o imagine ca s-o mărești. Navighezi cu <b>Previous</b>/<b>Next</b>, cu săgețile ← → sau prin swipe.', '<kbd>Esc</kbd> sau un click în afara imaginii închide galeria.'],
    components: ['Caută în tabelul de componente sau filtrează după status.', 'Tabelul de sporturi arată mărimea ideală a grupului și echipamentul.', 'Răspunsurile la cele mai frecvente întrebări sunt la final.'],
    contact: ['Câmpurile marcate cu * sunt obligatorii și se verifică pe măsură ce scrii.', 'Telefonul acceptă formatele 07xx xxx xxx sau +40 7xx xxx xxx.', 'Butoanele de social media de mai jos se deschid într-un tab nou.']
  };

  S.help = {
    init() {
      const btn = document.createElement('button');
      btn.className = 'fab fab--help';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Ajutor: deschide ghidul rapid');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.innerHTML = S.icon('help');

      const d = document.createElement('dialog');
      d.className = 'modal';
      d.id = 'help';
      d.setAttribute('aria-labelledby', 'help-title');
      const tips = PAGE[document.body.dataset.page] || [];
      d.innerHTML = `<div class="modal__inner">
        <div class="modal__head"><div><span class="eyebrow">Ghid rapid</span><h2 id="help-title">Cum folosești ShowUp2Move</h2></div>
          <button class="icon-btn" type="button" data-close aria-label="Închide ghidul">${S.icon('close')}</button></div>
        <div class="modal__body help">
          <ol class="help-steps">${STEPS.map(([ic, c, t]) => `<li><span class="ic-box" style="--c:${c}">${S.icon(ic)}</span><p>${t}</p></li>`).join('')}</ol>
          ${tips.length ? `<h3>Pe pagina asta</h3><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
          <h3>Scurtături</h3>
          <dl class="kbd-list">
            <div><dt><kbd>?</kbd></dt><dd>Deschide acest ghid</dd></div>
            <div><dt><kbd>Esc</kbd></dt><dd>Închide ferestrele și meniul</dd></div>
            <div><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Navigare în galerie</dd></div>
          </dl>
          <p class="muted" style="margin:0">Mai ai întrebări? Întreabă asistentul Mova (dreapta jos) sau <a href="contact.html">scrie-ne</a>.</p>
        </div></div>`;

      document.body.append(btn, d);
      const open = () => { d.showModal(); S.track('help_open', { page: document.body.dataset.page }); };
      btn.addEventListener('click', open);
      document.addEventListener('keydown', e => {
        const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
        if (e.key === '?' && !typing && !document.querySelector('dialog[open]')) { e.preventDefault(); open(); }
      });
    }
  };
})(window.SU2M);
