/* Date mock: sporturi, zone, locații, utilizatori, evenimente, galerie, persona pe nivel. Singura sursă de date. */
(function (S) {
  const U = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

  const sports = {
    fotbal:   { name: 'Fotbal',   min: 10, max: 14, dur: 1.5, img: U('1574629810360-7efbbe195018'), equip: 'Minge, ghete pentru sintetic, veste în două culori', pitch: 'Două echipe, un teren, zero organizare pe grupul de chat.' },
    baschet:  { name: 'Baschet',  min: 6,  max: 10, dur: 1.5, img: U('1546519638-68e109498ffc'),  equip: 'Minge mărimea 7, încălțăminte de sală', pitch: 'De la 3x3 pe asfalt la 5x5 în sală, după câți apar.' },
    tenis:    { name: 'Tenis',    min: 2,  max: 4,  dur: 1,   img: U('1554068865-24cecd4e34b8'),  equip: 'Rachetă, un tub de mingi noi', pitch: 'Simplu sau dublu, cu un partener de nivelul tău.' },
    volei:    { name: 'Volei',    min: 6,  max: 12, dur: 1.5, img: U('1612872087720-bb876e2e67d1'), equip: 'Minge de volei, genunchiere (opțional)', pitch: 'Pe nisip sau în sală, cu rotații corecte și multă gălăgie.' },
    alergare: { name: 'Alergare', min: 2,  max: 8,  dur: 1,   img: U('1552674605-db6ffd4facb5'),  equip: 'Încălțări de alergare, apă', pitch: 'Ritm comun, traseu ales de grup, nimeni nu rămâne în urmă.' }
  };

  const levels = { incepator: 'Începător', intermediar: 'Intermediar', avansat: 'Avansat' };
  const zones = ['Centru', 'Campus', 'Parcul Central', 'Zona Nord', 'Zona Sud', 'Malul Râului'];

  const locations = [
    { id: 'arena',      name: 'Arena Urbană',          zone: 'Centru',         sports: ['fotbal', 'baschet'],          price: 220, img: U('1431324155629-1a6deb1dec8d', 800) },
    { id: 'campus',     name: 'Terenurile Campus',     zone: 'Campus',         sports: ['fotbal', 'baschet', 'volei'], price: 150, img: U('1546519638-68e109498ffc', 800) },
    { id: 'tenis-parc', name: 'Club Tenis Parc',       zone: 'Parcul Central', sports: ['tenis'],                      price: 80,  img: U('1595435934249-5df7ed86e1c0', 800) },
    { id: 'pista',      name: 'Pista Parcului Central', zone: 'Parcul Central', sports: ['alergare'],                  price: 0,   img: U('1461896836934-ffe607ba8211', 800) },
    { id: 'sala-nord',  name: 'Sala Polivalentă Nord', zone: 'Zona Nord',      sports: ['baschet', 'volei'],           price: 180, img: U('1519861531473-9200262188bf', 800) },
    { id: 'tenis-nord', name: 'Tenis Club Nord',       zone: 'Zona Nord',      sports: ['tenis'],                      price: 90,  img: U('1554068865-24cecd4e34b8', 800) },
    { id: 'baza-sud',   name: 'Baza Sportivă Sud',     zone: 'Zona Sud',       sports: ['fotbal', 'tenis'],            price: 190, img: U('1579952363873-27f3bade9f55', 800) },
    { id: 'faleza',     name: 'Faleza Râului',         zone: 'Malul Râului',   sports: ['alergare'],                   price: 0,   img: U('1552674605-db6ffd4facb5', 800) },
    { id: 'beach',      name: 'Beach Volley Mal',      zone: 'Malul Râului',   sports: ['volei'],                      price: 90,  img: U('1612872087720-bb876e2e67d1', 800) }
  ];

  /* 80 utilizatori generați determinist */
  const first = ['Andrei', 'Ioana', 'Mihai', 'Elena', 'Radu', 'Maria', 'Vlad', 'Ana', 'Bogdan', 'Diana', 'Cristi', 'Alexandra', 'Tudor', 'Bianca', 'Matei', 'Irina', 'Ștefan', 'Carla', 'Paul', 'Larisa', 'Darius', 'Sara', 'Victor', 'Teodora'];
  const last = ['P.', 'M.', 'I.', 'D.', 'C.', 'S.', 'R.', 'T.', 'B.', 'N.'];
  const sportKeys = Object.keys(sports), levelKeys = Object.keys(levels);
  const r = S.rand(2026);
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const users = Array.from({ length: 80 }, (_, i) => {
    const own = new Set([pick(sportKeys)]);
    if (r() < .65) own.add(pick(sportKeys));
    if (r() < .3) own.add(pick(sportKeys));
    return { id: 'u' + i, name: `${first[i % first.length]} ${pick(last)}`, sports: [...own], zone: pick(zones), level: pick(levelKeys), trust: 60 + Math.floor(r() * 40), hue: Math.floor(r() * 360) };
  });

  const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return S.isoDate(d); };
  const events = [
    { id: 'e1',  title: 'Meci de seară la Arena',               sport: 'fotbal',   loc: 'arena',      date: day(0), time: '19:30', level: 'intermediar', joined: 11, max: 14, captain: 'Andrei P.' },
    { id: 'e2',  title: '3x3 pe asfalt, cine prinde echipa',    sport: 'baschet',  loc: 'campus',     date: day(0), time: '18:00', level: 'incepator',   joined: 5,  max: 8,  captain: 'Ioana M.' },
    { id: 'e3',  title: 'Dublu mixt înainte de birou',          sport: 'tenis',    loc: 'tenis-parc', date: day(1), time: '07:30', level: 'avansat',     joined: 3,  max: 4,  captain: 'Vlad R.' },
    { id: 'e4',  title: 'Volei pe nisip la apus',               sport: 'volei',    loc: 'beach',      date: day(1), time: '19:00', level: 'intermediar', joined: 7,  max: 12, captain: 'Bianca T.' },
    { id: 'e5',  title: '5 km ușor pe faleză',                  sport: 'alergare', loc: 'faleza',     date: day(0), time: '20:00', level: 'incepator',   joined: 4,  max: 8,  captain: 'Matei D.' },
    { id: 'e6',  title: 'Fotbal de weekend, nivel serios',      sport: 'fotbal',   loc: 'baza-sud',   date: day(2), time: '10:00', level: 'avansat',     joined: 12, max: 14, captain: 'Radu C.' },
    { id: 'e7',  title: 'Baschet în sală, 5x5',                 sport: 'baschet',  loc: 'sala-nord',  date: day(2), time: '20:00', level: 'avansat',     joined: 8,  max: 10, captain: 'Tudor B.' },
    { id: 'e8',  title: 'Primul meu meci de tenis',             sport: 'tenis',    loc: 'tenis-nord', date: day(3), time: '17:00', level: 'incepator',   joined: 1,  max: 2,  captain: 'Carla S.' },
    { id: 'e9',  title: 'Intervale pe pista din parc',          sport: 'alergare', loc: 'pista',      date: day(1), time: '18:30', level: 'avansat',     joined: 5,  max: 8,  captain: 'Ștefan N.' },
    { id: 'e10', title: 'Volei de campus, rotații pentru toți', sport: 'volei',    loc: 'campus',     date: day(3), time: '16:00', level: 'incepator',   joined: 6,  max: 12, captain: 'Elena I.' },
    { id: 'e11', title: 'Fotbal după cursuri',                  sport: 'fotbal',   loc: 'campus',     date: day(1), time: '17:30', level: 'incepator',   joined: 9,  max: 14, captain: 'Darius S.' }
  ];

  const gallery = [
    { src: U('1574629810360-7efbbe195018', 1600), sport: 'fotbal',   title: 'Meci de seară',          place: 'Arena Urbană · Centru', span: 'tall' },
    { src: U('1546519638-68e109498ffc', 1600),  sport: 'baschet',  title: 'Aruncare din colț',      place: 'Terenurile Campus' },
    { src: U('1554068865-24cecd4e34b8', 1600),  sport: 'tenis',    title: 'Serviciu la prima oră',  place: 'Club Tenis Parc', span: 'wide' },
    { src: U('1552674605-db6ffd4facb5', 1600),  sport: 'alergare', title: 'Ritm comun',             place: 'Faleza Râului' },
    { src: U('1612872087720-bb876e2e67d1', 1600), sport: 'volei',  title: 'Blocaj la fileu',        place: 'Beach Volley Mal' },
    { src: U('1431324155629-1a6deb1dec8d', 1600), sport: 'fotbal', title: 'Terenul înainte de meci', place: 'Baza Sportivă Sud', span: 'wide' },
    { src: U('1519861531473-9200262188bf', 1600), sport: 'baschet', title: 'Panou la apus',         place: 'Sala Polivalentă Nord', span: 'tall' },
    { src: U('1461896836934-ffe607ba8211', 1600), sport: 'alergare', title: 'Pista de atletism',    place: 'Pista Parcului Central' },
    { src: U('1579952363873-27f3bade9f55', 1600), sport: 'fotbal', title: 'Mingea e pregătită',     place: 'Arena Urbană' },
    { src: U('1595435934249-5df7ed86e1c0', 1600), sport: 'tenis',  title: 'Teren de zgură',         place: 'Tenis Club Nord' },
    { src: U('1504450758481-7338eba7524a', 1600), sport: 'baschet', title: 'Joc rapid 3x3',         place: 'Terenurile Campus' },
    { src: U('1592656094267-764a45160876', 1600), sport: 'volei',  title: 'Volei în sală',          place: 'Sala Polivalentă Nord', span: 'wide' }
  ];

  const personas = {
    incepator: {
      title: 'Primul pas e cel mai greu. Îl facem împreună.',
      text: 'Te punem în grupuri cu ritm relaxat, unde nimeni nu ține scorul pe bune. Căpitanul îți explică regulile din prima.',
      tips: ['Alege evenimente marcate „Începător”: ritmul e relaxat.', 'Spune-i căpitanului că e prima dată, primești o poziție ușoară.', 'Vino cu 10 minute mai devreme pentru încălzire.']
    },
    intermediar: {
      title: 'Ai ritm. Hai să-l folosim.',
      text: 'Grupuri echilibrate, meciuri cu miză mică, dar cu joc bun. Scorul tău de încredere crește cu fiecare prezență confirmată.',
      tips: ['Confirmă prezența din timp: scorul de încredere crește.', 'Încearcă un al doilea sport, grupurile mixte se umplu mai repede.', 'Propune tu o locație dacă știi un teren bun.']
    },
    avansat: {
      title: 'Joc serios, oameni pe măsură.',
      text: 'Te potrivim cu jucători de nivelul tău și îți arătăm mai întâi evenimentele competitive. Ești candidat natural pentru rolul de căpitan.',
      tips: ['Ca jucător avansat, devii de obicei căpitan: tu alegi ora și terenul.', 'Creează evenimente „Avansat” ca să eviți meciurile dezechilibrate.', 'O dată pe lună, joacă cu începătorii: comunitatea crește.']
    }
  };

  const loc = id => locations.find(l => l.id === id);
  const withZone = e => Object.assign({}, e, { zone: (loc(e.loc) || {}).zone || '—' });

  S.data = {
    sports, levels, zones, locations, users, events, gallery, personas, loc,
    /* Disponibilitatea fiecărui utilizator se schimbă zilnic, dar e stabilă în aceeași zi */
    availableToday() {
      const t = S.today();
      return users.filter(u => S.rand(S.hash(t + u.id))() < 0.6);
    },
    allEvents() {
      const mine = S.storage.get('events', []).map(e => Object.assign(withZone(e), { mine: true }));
      return events.map(withZone).concat(mine);
    },
    /* Buget estimat pe persoană = preț teren/oră × durată ÷ jucători */
    cost(locId, sport, people) {
      const l = loc(locId);
      return l && l.price ? Math.ceil(l.price * sports[sport].dur / Math.max(1, people)) : 0;
    }
  };

  S.ui = {
    sportTag: k => `<span class="tag" style="--c:var(--sport-${k})">${sports[k].name}</span>`,
    locCard: l => `<article class="loc-card">
      <div class="loc-card__img"><img src="${l.img}" alt="${S.esc(l.name)}, ${S.esc(l.zone)}" data-label="${S.esc(l.name)}" loading="lazy"></div>
      <div class="loc-card__body">
        <h3>${S.esc(l.name)}</h3>
        <p class="meta"><span>${S.icon('pin')}${S.esc(l.zone)}</span></p>
        <div class="event-card__top">${l.sports.map(S.ui.sportTag).join('')}</div>
        <p class="loc-card__price">${l.price ? `<b>${l.price} lei</b> / oră` : '<b>Gratuit</b>, spațiu public'}</p>
      </div>
    </article>`
  };
})(window.SU2M);
