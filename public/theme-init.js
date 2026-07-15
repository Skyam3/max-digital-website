(function () {
  try {
    var stored = localStorage.getItem("max-digital-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch {}
})();
