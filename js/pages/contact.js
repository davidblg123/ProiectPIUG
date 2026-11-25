/* Contact: validare reală pe câmpuri (la blur, apoi live), confirmare vizibilă, salvare locală a mesajelor */
(function (S) {
  const RULES = {
    nume: v => !v ? 'Scrie-ți numele.'
      : v.length < 3 ? 'Numele trebuie să aibă cel puțin 3 caractere.'
      : !/^[\p{L}][\p{L}' -]*$/u.test(v) ? 'Folosește doar litere, spații, apostrof sau cratimă.'
      : !/\s/.test(v) ? 'Scrie numele complet (prenume și nume).' : '',
    email: v => !v ? 'Adaugă adresa de email.'
      : !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v) ? 'Emailul nu pare valid (ex: nume@domeniu.ro).' : '',
    telefon: v => {
      const d = v.replace(/[\s.()-]/g, '');
      return !d ? 'Adaugă un număr de telefon.'
        : !/^(\+40|0040|0)[237]\d{8}$/.test(d) ? 'Număr invalid. Exemplu: 0722 123 456 sau +40 722 123 456.' : '';
    },
    sport: v => !v ? 'Alege sportul care te interesează.' : '',
    subiect: v => !v ? 'Alege subiectul mesajului.' : '',
    mesaj: v => v.length < 20 ? `Mesajul e prea scurt: ${v.length}/20 caractere minim.` : '',
    acord: (v, el) => !el.checked ? 'Avem nevoie de acordul tău ca să-ți putem răspunde.' : ''
  };

  S.pages.contact = {
    init() {
      const f = S.$('#contact-form'), alertBox = S.$('#form-alert'), touched = new Set();
      S.$('#sport').innerHTML = '<option value="">Alege sportul</option>' +
        Object.entries(S.data.sports).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join('') + '<option value="altul">Altceva / mai multe</option>';
      const fieldEl = name => name === 'subiect' ? f.querySelector('[name="subiect"]') : f.elements[name];
      const value = name => name === 'subiect' ? (f.querySelector('[name="subiect"]:checked') || {}).value || '' : String(f.elements[name].value).trim();
      const check = name => S.fieldError(fieldEl(name), RULES[name](value(name), f.elements[name]));

      f.addEventListener('focusout', e => { if (RULES[e.target.name]) { touched.add(e.target.name); check(e.target.name); } });
      f.addEventListener('input', e => {
        if (e.target.name === 'mesaj') S.$('#mesaj-count').textContent = `${e.target.value.length} / 500`;
        if (touched.has(e.target.name)) check(e.target.name);
      });
      f.addEventListener('change', e => { if (e.target.type === 'radio' || e.target.type === 'checkbox') { touched.add(e.target.name); check(e.target.name); } });

      f.addEventListener('submit', e => {
        e.preventDefault();
        const bad = Object.keys(RULES).filter(n => !check(n));
        Object.keys(RULES).forEach(n => touched.add(n));
        if (bad.length) {
          alertBox.hidden = false;
          alertBox.textContent = `Mai ai ${bad.length} ${bad.length === 1 ? 'câmp de corectat' : 'câmpuri de corectat'}.`;
          fieldEl(bad[0]).focus();
          return;
        }
        alertBox.hidden = true;
        const msg = { nume: value('nume'), email: value('email'), telefon: value('telefon'), sport: value('sport'), subiect: value('subiect'), mesaj: value('mesaj'), date: new Date().toISOString() };
        S.storage.set('messages', S.storage.get('messages', []).concat(msg));
        S.track('contact_submit', { subiect: msg.subiect, sport: msg.sport });

        S.$('#success-text').innerHTML = `Mulțumim, <b>${S.esc(msg.nume.split(' ')[0])}</b>! Am primit mesajul despre „${S.esc(msg.subiect)}” și îți răspundem în 24 de ore la <b>${S.esc(msg.email)}</b>.`;
        f.hidden = true;
        const ok = S.$('#contact-success');
        ok.hidden = false;
        ok.focus();
        S.toast('Mesaj trimis cu succes!');
      });

      S.$('#contact-again').addEventListener('click', () => {
        f.reset();
        touched.clear();
        S.$$('.field', f).forEach(x => x.classList.remove('is-valid', 'is-invalid'));
        S.$$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid'));
        S.$$('.field__error', f).forEach(x => { x.textContent = ''; });
        S.$('#mesaj-count').textContent = '0 / 500';
        S.$('#contact-success').hidden = true;
        f.hidden = false;
        S.$('#nume').focus();
      });
    }
  };
})(window.SU2M);
