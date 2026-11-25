/* Bonus: asistentul „Mova”, un chatbot pe bază de reguli (potrivire de cuvinte cheie, fără diacritice) */
(function (S) {
  const D = () => S.data;
  const RULES = [
    { k: ['salut', 'buna', 'hei', 'hello', 'neata', 'servus'], a: () => 'Salut! Sunt Mova. Te ajut cu ShowUpToday, sporturi, căpitani, costuri sau cu navigarea pe site.' },
    { k: ['showuptoday', 'showup', 'da sau nu', 'raspund', 'intrebarea'], a: () => 'În fiecare zi răspunzi la <b>„ShowUpToday?”</b> cu Da sau Nu. Dacă spui Da, intri în grupurile spontane formate cu oamenii disponibili din zona ta. Răspunsul expiră la miezul nopții. Îl găsești pe <a href="index.html">Acasă</a>.' },
    { k: ['disponibil', 'cati', 'oameni', 'cine joaca', 'azi'], a: () => { const n = D().availableToday().length; return `Azi sunt <b>${n} oameni disponibili</b>. Vezi cum se împart pe grupuri în <a href="evenimente.html#grupuri">generator</a>.`; } },
    { k: ['sport', 'fotbal', 'baschet', 'tenis', 'volei', 'alergare', 'marime', 'jucatori', 'cati jucatori'], a: () => 'Sporturi și mărimea ideală a grupului:<br>' + Object.values(D().sports).map(s => `• ${s.name}: ${s.min}–${s.max}`).join('<br>') },
    { k: ['capitan', 'lider', 'sef'], a: () => 'Căpitanul e membrul cu cel mai mare <b>scor de încredere</b> din grup. El confirmă ora și terenul și anunță grupul. Scorul crește când îți confirmi prezența și chiar vii.' },
    { k: ['cost', 'buget', 'pret', 'bani', 'lei', 'plata', 'cat costa'], a: () => `Bugetul estimat = prețul terenului pe oră × durata ÷ numărul de jucători. Exemplu: fotbal la Arena Urbană, 220 lei × 1,5 h ÷ 14 ≈ <b>${D().cost('arena', 'fotbal', 14)} lei/persoană</b>. Alergarea e gratuită.` },
    { k: ['locatie', 'locatii', 'teren', 'unde', 'zona', 'sala'], a: () => `Avem ${D().locations.length} locații în zonele: ${D().zones.join(', ')}. Le vezi în <a href="galerie.html#locatii">Galerie</a>.` },
    { k: ['creez', 'creeaza', 'eveniment nou', 'organizez', 'adaug', 'creare'], a: () => 'Mergi la <a href="evenimente.html#creeaza">Grupuri & Evenimente → Creează</a>: alegi sportul, zona, locația, data și câți jucători vrei. Evenimentul apare imediat în listă, iar tu ești căpitanul.' },
    { k: ['caut', 'cautare', 'filtru', 'filtrez', 'gasesc'], a: () => 'Pe <a href="evenimente.html#cauta">pagina de evenimente</a> cauți după cuvinte și filtrezi după sport, zonă, nivel și mărimea grupului.' },
    { k: ['nivel', 'incepator', 'avansat', 'intermediar', 'profil'], a: () => 'Ai trei niveluri: Începător, Intermediar și Avansat. Îl alegi pe <a href="index.html#pentru-tine">Acasă</a>, la „Pentru cine e azi?”, iar sugestiile se adaptează.' },
    { k: ['tema', 'dark', 'light', 'culoare', 'font', 'accent', 'text mare'], a: () => 'Apasă iconița cu slidere din bara de sus: alegi tema Dark/Light, culoarea de accent și mărimea textului. Se salvează automat.' },
    { k: ['galerie', 'poze', 'imagini', 'foto'], a: () => 'În <a href="galerie.html">Galerie</a> apeși pe o imagine ca s-o mărești, apoi navighezi cu Previous/Next sau cu săgețile de pe tastatură.' },
    { k: ['contact', 'email', 'telefon', 'mesaj', 'echipa'], a: () => 'Ne scrii din pagina <a href="contact.html">Contact</a>. Formularul îți verifică datele înainte de trimitere.' },
    { k: ['ajutor', 'help', 'ghid', 'cum functioneaza', 'nu inteleg'], a: () => 'Pe scurt: răspunzi la ShowUpToday, primești un grup, confirmi prezența, joci. Ghidul complet se deschide de la butonul <b>?</b> din stânga jos.' },
    { k: ['multumesc', 'mersi', 'merci', 'ms'], a: () => 'Cu plăcere! Ne vedem pe teren. 💚' }
  ];
  const QUICK = ['Ce e ShowUpToday?', 'Ce sporturi sunt?', 'Cine devine căpitan?', 'Cât costă?', 'Cum creez un eveniment?'];

  function answer(text) {
    const q = S.norm(text);
    let best = null, score = 0;
    RULES.forEach(r => {
      const s = r.k.reduce((n, k) => n + (q.includes(k) ? k.length : 0), 0);
      if (s > score) { score = s; best = r; }
    });
    return best ? best.a() : 'Nu sunt sigur că am înțeles. Încearcă să mă întrebi despre <b>ShowUpToday</b>, <b>sporturi</b>, <b>căpitan</b>, <b>cost</b> sau <b>locații</b>.';
  }

  S.chatbot = {
    init() {
      const fab = document.createElement('button');
      fab.className = 'fab fab--chat';
      fab.type = 'button';
      fab.setAttribute('aria-label', 'Deschide asistentul ShowUp2Move');
      fab.setAttribute('aria-expanded', 'false');
      fab.setAttribute('aria-controls', 'chat');
      fab.innerHTML = `<span class="ic-chat">${S.icon('chat')}</span><span class="ic-close">${S.icon('close')}</span>`;

      const box = document.createElement('section');
      box.className = 'chat';
      box.id = 'chat';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Asistent ShowUp2Move');
      box.innerHTML = `<header class="chat__head"><span class="chat__bot" aria-hidden="true">M</span>
          <div><b>Mova</b><small>Asistent ShowUp2Move · online</small></div>
          <button class="icon-btn" type="button" data-chat-close aria-label="Închide asistentul">${S.icon('close')}</button></header>
        <div class="chat__log" aria-live="polite"></div>
        <div class="chat__quick">${QUICK.map(q => `<button type="button">${q}</button>`).join('')}</div>
        <form class="chat__form"><label class="sr-only" for="chat-input">Mesajul tău</label>
          <input id="chat-input" autocomplete="off" maxlength="200" placeholder="Întreabă ceva…">
          <button class="icon-btn" type="submit" aria-label="Trimite mesajul">${S.icon('send')}</button></form>`;
      document.body.append(box, fab);

      const log = S.$('.chat__log', box), input = S.$('#chat-input', box);
      const add = (html, who) => {
        const m = document.createElement('div');
        m.className = 'msg msg--' + who;
        m.innerHTML = html;
        log.appendChild(m);
        log.scrollTop = log.scrollHeight;
        return m;
      };
      const ask = text => {
        if (!text.trim()) return;
        add(S.esc(text), 'me');
        const typing = add('<i></i><i></i><i></i>', 'bot');
        typing.classList.add('msg--typing');
        S.track('chatbot_question');
        setTimeout(() => { typing.remove(); add(answer(text), 'bot'); }, 450);
      };
      const toggle = open => {
        box.classList.toggle('is-open', open);
        document.body.classList.toggle('chat-open', open);
        fab.setAttribute('aria-expanded', String(open));
        fab.setAttribute('aria-label', open ? 'Închide asistentul' : 'Deschide asistentul ShowUp2Move');
        if (open) {
          if (!log.children.length) add('Salut! Sunt <b>Mova</b> 👋 Te pot ajuta cu ShowUpToday, grupuri, căpitani, costuri și navigarea pe site. Alege o întrebare sau scrie-mi.', 'bot');
          input.focus();
        }
      };

      fab.addEventListener('click', () => toggle(!box.classList.contains('is-open')));
      S.$('[data-chat-close]', box).addEventListener('click', () => { toggle(false); fab.focus(); });
      S.$('.chat__quick', box).addEventListener('click', e => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
      S.$('.chat__form', box).addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; });
      box.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); fab.focus(); } });
    }
  };
})(window.SU2M);
