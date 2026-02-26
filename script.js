const storageKey = "enar26-theme";
const body = document.body;
const toggleButton = document.getElementById("theme-toggle");
const toggleText = document.querySelector(".toggle-text");

function setTheme(theme) {
  body.dataset.theme = theme;
  if (toggleText) {
    toggleText.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }
}

function initTheme() {
  const saved = localStorage.getItem(storageKey);
  if (saved === "dark" || saved === "light") {
    setTheme(saved);
  } else {
    setTheme("light");
  }
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const next = body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(storageKey, next);
  });
}

initTheme();

const lastUpdated = document.getElementById("last-updated");
if (lastUpdated) {
  const now = new Date();
  lastUpdated.textContent = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
