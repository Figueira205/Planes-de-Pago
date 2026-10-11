// Tema: oscuro por defecto, la elección se recuerda en el navegador.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("tema"); } catch (e) {}
  root.setAttribute("data-theme", saved === "light" ? "light" : "dark");

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("tema", next); } catch (e) {}
    });
  });
})();
