/* Acces localStorage (prefix su2m:, JSON, try/catch) + starea ShowUpToday și profilul utilizatorului */
(function (S) {
  const P = 'su2m:';

  S.storage = {
    get(key, def = null) {
      try { const v = localStorage.getItem(P + key); return v === null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set(key, val) {
      try { localStorage.setItem(P + key, JSON.stringify(val)); return true; } catch (e) { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(P + key); } catch (e) { /* storage indisponibil */ }
    }
  };

  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  /* Răspunsul „ShowUpToday?” e valabil doar în ziua în care a fost dat */
  S.showup = {
    get() {
      const s = S.storage.get('showup');
      return s && s.date === S.today() ? s.answer : null;
    },
    set(answer) {
      S.storage.set('showup', { answer, date: S.today() });
      S.track('showup_answer', { answer });
      emit('su2m:showup', answer);
    },
    clear() {
      S.storage.remove('showup');
      emit('su2m:showup', null);
    }
  };

  S.profile = {
    defaults: { level: 'intermediar', sport: 'fotbal', zone: 'Centru' },
    get() { return Object.assign({}, this.defaults, S.storage.get('profile', {})); },
    set(patch) {
      S.storage.set('profile', Object.assign(this.get(), patch));
      S.track('profile_change', patch);
      emit('su2m:profile', this.get());
    }
  };
})(window.SU2M);
