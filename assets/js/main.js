"use strict";

// ===== globals =====
const isMobile = window.matchMedia("(max-width: 1023px)");
const eventsTrigger = ["pageshow ", "scroll"];

// ===== init =====
const init = () => {
  // # #
  console.clear();
  document.body.classList.remove("fadeout");
  // # app height
  appHeight();
  // # init accordions
  initAccordions();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
    elements_selector: ".lazy",
  });
};

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);
  if (!isMobile.matches) return;

  doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
  doc.style.setProperty("--menu-height", `${menuH}px`);
};
window.addEventListener("resize", appHeight);

// ===== href fadeout =====
document.addEventListener("click", (evt) => {
  const link = evt.target.closest(
    'a:not([href^="#"]):not([target]):not([href^="mailto"]):not([href^="tel"])'
  );
  if (!link) return;

  evt.preventDefault();
  const url = link.getAttribute("href");

  if (url && url !== "") {
    const idx = url.indexOf("#");
    const hash = idx !== -1 ? url.substring(idx) : "";

    if (hash && hash !== "#") {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return false;
        }
      } catch (err) {
        console.error("Invalid hash selector:", hash, err);
      }
    }

    document.body.classList.add("fadeout");
    setTimeout(function () {
      window.location = url;
    }, 500);
  }

  return false;
});

// ===== scroll header =====
const header = document.querySelector("[data-header]");
let lastScrollTop = 0;

const scrollHeaderDownUp = () => {
  let st = window.scrollY;
  if (Math.abs(lastScrollTop - st) <= 10) return;

  if (st > lastScrollTop && lastScrollTop > 0) {
    header.classList.add("--hidden");
  } else {
    header.classList.remove("--hidden");
  }
  lastScrollTop = st;
};
eventsTrigger.forEach((evt) => {
  window.addEventListener(evt, scrollHeaderDownUp);
});

// ===== menu =====
const [overlay, menu, menuTogglers] = [
  document.querySelector("[data-menu-overlay]"),
  document.querySelector("[data-menu]"),
  document.querySelectorAll("[data-menu-toggler]"),
];

const detectOverlay = (detect) => {
  if (detect) {
    overlay.classList.add("--show");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("--show");
    document.body.style.removeProperty("overflow");
  }
};

const toggleMenu = () => {
  if (menu.classList.contains("--show")) {
    menu.classList.remove("--show");
    detectOverlay(false);
  } else {
    menu.classList.add("--show");
    detectOverlay(true);
  }
};

menuTogglers.forEach((btn) => btn.addEventListener("click", toggleMenu));
overlay.addEventListener("click", () => {
  toggleMenu();
  detectOverlay(false);
});

// ===== handle accordion =====
const initAccordions = () => {
  const [accordions, contents] = [
    document.querySelectorAll("[data-accordion]"),
    document.querySelectorAll("[data-accordion-content]"),
  ];
  if (!accordions.length || !contents.length) return;

  accordions.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("--show");
      const panel = contents[i];
      const isExpanded = panel.style.maxHeight;
      panel.style.maxHeight = isExpanded ? null : `${panel.scrollHeight}px`;
    });
  });
};

// ===== fv =====
const handleFvOverlay = () => {
  const [overlay, content] = [
    document.querySelector("[data-fv-overlay]"),
    document.querySelector("[data-fv-content]"),
  ];
  let cal = content.getBoundingClientRect().top + window.scrollY;
  let value = window.scrollY / cal;
  overlay.style.opacity = Math.min(Math.max(value, 0), 0.8);
};

eventsTrigger.forEach((evt) => {
  window.addEventListener(evt, handleFvOverlay);
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("pageshow", init);
