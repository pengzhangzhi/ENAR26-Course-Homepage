const storageKey = "enar26-theme";
const body = document.body;
const toggleButton = document.getElementById("theme-toggle");
const toggleText = document.querySelector(".toggle-text");
let heroViewer = null;
let heroViewerSpinTimer = null;

function setTheme(theme) {
  body.dataset.theme = theme;
  if (toggleText) {
    toggleText.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }
  applyHeroViewerTheme();
}

function initTheme() {
  const saved = localStorage.getItem(storageKey);
  if (saved === "dark" || saved === "light") {
    setTheme(saved);
  } else {
    setTheme("light");
  }
}

function initHeroPdbViewer() {
  const viewerElement = document.getElementById("hero-pdb-viewer");
  const viewerWrap = document.getElementById("hero-photo-wrap");

  if (!viewerElement || !viewerWrap || !window.$3Dmol) {
    return;
  }

  const pdbId = viewerElement.dataset.pdbId || "1HV4";

  try {
    heroViewer = window.$3Dmol.createViewer(viewerElement, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--pdb-canvas-bg").trim() || "#f6f9ff",
      antialias: true,
    });

    window.$3Dmol.download(`pdb:${pdbId}`, heroViewer, {}, () => {
      heroViewer.setStyle({}, { cartoon: { color: "spectrum" } });
      heroViewer.addStyle({ elem: ["O", "N", "S"] }, { stick: { radius: 0.16, colorscheme: "default" } });
      heroViewer.zoomTo();
      heroViewer.rotate(22, "y");
      applyHeroViewerTheme();
      heroViewer.render();
      viewerWrap.classList.add("viewer-ready");

      const resizeViewer = () => {
        if (!heroViewer) {
          return;
        }
        heroViewer.resize();
        heroViewer.render();
      };

      window.addEventListener("resize", resizeViewer);
      startHeroViewerSpin();
    });
  } catch (error) {
    console.error("Unable to initialize PDB viewer", error);
  }
}

function applyHeroViewerTheme() {
  if (!heroViewer) {
    return;
  }

  const canvasBackground =
    getComputedStyle(document.documentElement).getPropertyValue("--pdb-canvas-bg").trim() || "#f6f9ff";

  heroViewer.setBackgroundColor(canvasBackground, 1);
  heroViewer.render();
}

function startHeroViewerSpin() {
  if (!heroViewer) {
    return;
  }

  if (heroViewerSpinTimer) {
    window.clearInterval(heroViewerSpinTimer);
  }

  heroViewerSpinTimer = window.setInterval(() => {
    if (!heroViewer) {
      return;
    }
    heroViewer.rotate(0.6, "y");
    heroViewer.render();
  }, 60);
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const next = body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(storageKey, next);
  });
}

initTheme();
initHeroPdbViewer();

const lastUpdated = document.getElementById("last-updated");
if (lastUpdated) {
  const now = new Date();
  lastUpdated.textContent = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
