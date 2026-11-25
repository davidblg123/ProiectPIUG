/* Wrapper peste gtag: evenimente custom GA4. Measurement ID-ul se setează în <head>-ul fiecărei pagini. */
(function (S) {
  S.track = (name, params = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
})(window.SU2M);
