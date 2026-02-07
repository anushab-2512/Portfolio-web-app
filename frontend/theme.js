(function () {
  const key = "twenty20:theme";
  const get = () => document.documentElement.getAttribute("data-theme") || "light";
  const updateIcon = (v) => {
    const icon = document.getElementById("theme-icon");
    if (icon) icon.textContent = v === "dark" ? "☀" : "🌙";
  };
  const set = (v) => {
    document.documentElement.setAttribute("data-theme", v);
    localStorage.setItem(key, v);
    updateIcon(v);
  };
  const stored = localStorage.getItem(key) || "light";
  set(stored);

  document.addEventListener("click", (e) => {
    if (e.target.closest("#theme-toggle")) {
      set(get() === "dark" ? "light" : "dark");
    }
  });
})();
