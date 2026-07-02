(function () {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var p = location.pathname;
    if (p.indexOf("/admin") === 0) return;
    var s = sessionStorage.getItem("honda-tien-dat-session-loader");
    if (p === "/" || s !== "1") {
      document.documentElement.classList.add("splash-active");
    }
  } catch (e) {}
})();
