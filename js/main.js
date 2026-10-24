const CONFIG = {
  telegram: "https://t.me/ivan_labunets",
  instagram: "https://instagram.com/ivan_labunets",
  defaultLang: "uk",
};

const LANGS = ["uk", "en", "ru"];
const htmlLang = { ru: "ru", en: "en", uk: "uk" };

function detectLang() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("lang");
  const fromHash = window.location.hash.replace("#", "");
  const stored = localStorage.getItem("lang");
  const nav = (navigator.language || "").toLowerCase();

  if (LANGS.includes(fromQuery)) return fromQuery;
  if (LANGS.includes(fromHash)) return fromHash;
  if (LANGS.includes(stored)) return stored;
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("en")) return "en";
  return CONFIG.defaultLang;
}

function applyLang(lang) {
  const dict = window.translations[lang] || window.translations.uk;
  document.documentElement.lang = htmlLang[lang] || "uk";
  document.title = dict.metaTitle;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", dict.metaDesc);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });

  const title = document.querySelector("[data-i18n-title]");
  if (title) {
    const raw = dict.heroTitle;
    const accent = dict.heroAccent;
    title.innerHTML = raw.replace(
      accent,
      `<em class="accent">${accent}</em>`
    );
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    btn.setAttribute("aria-current", btn.getAttribute("data-lang") === lang ? "true" : "false");
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    el.setAttribute("href", CONFIG.telegram);
  });
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.setAttribute("href", CONFIG.instagram);
  });

  localStorage.setItem("lang", lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState({}, "", url);
}

function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

function initToTop() {
  const btn = document.querySelector(".to-top");
  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initVideoCarousel() {
  const carousel = document.querySelector("[data-video-carousel]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  const slide = carousel?.querySelector(".video-slide");
  const videos = carousel?.querySelectorAll("video") || [];

  if (!carousel || !slide) return;

  const move = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const slidesPerView = window.matchMedia("(max-width: 700px)").matches ? 1 : 2;
    carousel.scrollBy({
      left: direction * (slide.getBoundingClientRect().width + gap) * slidesPerView,
      behavior: "smooth",
    });
  };

  prev?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));

  videos.forEach((video) => {
    video.volume = 0.3;
    video.addEventListener("play", () => {
      videos.forEach((otherVideo) => {
        if (otherVideo !== video) otherVideo.pause();
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyLang(detectLang());
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang")));
  });
  initNav();
  initToTop();
  initVideoCarousel();
});
