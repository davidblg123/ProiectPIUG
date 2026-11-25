/* Navbar fix: link activ după body[data-page], meniu hamburger pe mobil, umbră la scroll */
(function (S) {
  S.nav = {
    init() {
      const nav = S.$('.nav'), btn = S.$('.nav__toggle'), menu = S.$('#nav-menu');
      if (!nav) return;
      const close = () => {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Deschide meniul');
      };

      S.$$('a', menu).forEach(a => {
        if (a.dataset.nav === document.body.dataset.page) a.setAttribute('aria-current', 'page');
        a.addEventListener('click', () => { S.track('nav_click', { to: a.dataset.nav }); close(); });
      });

      btn.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { close(); btn.focus(); } });
      document.addEventListener('click', e => { if (!nav.contains(e.target)) close(); });
      matchMedia('(min-width: 900px)').addEventListener('change', close);

      const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };
})(window.SU2M);
