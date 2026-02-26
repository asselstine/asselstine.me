function getPreferTheme() {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) return currentTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function reflectPreference() {
  document.documentElement.setAttribute("data-theme", themeValue);

  const moonIcon = document.querySelector("#moon-icon");
  const sunIcon = document.querySelector("#sun-icon");
  if (moonIcon && sunIcon) {
    if (themeValue === "dark") {
      moonIcon.classList.add("hidden");
      sunIcon.classList.remove("hidden");
    } else {
      moonIcon.classList.remove("hidden");
      sunIcon.classList.add("hidden");
    }
  }
}

reflectPreference();

window.onload = () => {
  reflectPreference();

  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    reflectPreference();
  });
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    reflectPreference();
  });
