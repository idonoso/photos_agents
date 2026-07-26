// portfolio-data.jsx — carga los datos horneados por scripts/build-portfolio-pages.mjs
window.PORTFOLIO_DATA = null;
window.PORTFOLIO_READY = fetch('portfolio-pages.json')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    window.PORTFOLIO_DATA = data;
    return data;
  });
