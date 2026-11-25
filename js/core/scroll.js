/* Butoane UP / DOWN injectate: apar doar când au sens (nu ești deja sus / jos) */
(function (S) {
  S.scroll = {
    init() {
      const wrap = document.createElement('div');
      wrap.className = 'scroll-btns';
      wrap.innerHTML = `<button type="button" data-scroll="up" aria-label="Mergi la începutul paginii">${S.icon('up')}</button>
        <button type="button" data-scroll="down" aria-label="Mergi la finalul paginii">${S.icon('down')}</button>`;
      document.body.appendChild(wrap);

      const [up, down] = wrap.children;
      const root = document.documentElement;
      const go = top => scrollTo({ top, behavior: S.reducedMotion() ? 'auto' : 'smooth' });
      up.addEventListener('click', () => go(0));
      down.addEventListener('click', () => go(root.scrollHeight));

      const update = () => {
        const max = root.scrollHeight - innerHeight;
        up.classList.toggle('is-hidden', scrollY < 300);
        down.classList.toggle('is-hidden', max < 400 || scrollY > max - 300);
      };
      addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      addEventListener('load', update);
      this.update = update;
      update();
    }
  };
})(window.SU2M);
