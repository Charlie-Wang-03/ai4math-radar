(function () {
  "use strict";

  const root = document.documentElement;
  const themeKey = "ai4math-static-theme";
  const starKey = "ai4math-static-starred";
  const input = document.querySelector("[data-search]");
  const categoryTabs = () => [...document.querySelectorAll(".tabs .tab[data-category]")];

  function starIds() {
    try {
      const value = JSON.parse(localStorage.getItem(starKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function applyTheme(mode) {
    const resolved = mode === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    root.setAttribute("data-theme", resolved);
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.classList.toggle("active", button.dataset.themeChoice === mode);
    });
  }

  let themePreference = localStorage.getItem(themeKey) || "system";
  applyTheme(themePreference);

  function currentCategory() {
    return categoryTabs().find((tab) => tab.classList.contains("active"))?.dataset.category || "all";
  }

  function filter() {
    const category = currentCategory();
    const query = (input?.value || "").trim().toLowerCase();
    const starredOnly = document.body.dataset.view === "starred";
    const stars = new Set(starIds());
    let visibleTotal = 0;

    document.querySelectorAll("[data-day]").forEach((day) => {
      const slots = [...day.querySelectorAll("[data-feed-item-shell]")];
      let lastVisible = null;
      let visibleCount = 0;

      slots.forEach((slot) => {
        slot.classList.remove("is-last-visible");
        const card = slot.querySelector("[data-feed-item]");
        if (!card) return;
        const id = card.querySelector("[data-star-id]")?.dataset.starId;
        const matchesCategory = category === "all" || card.dataset.category === category;
        const matchesSearch = !query || (card.dataset.search || "").toLowerCase().includes(query);
        const matchesStar = !starredOnly || (id && stars.has(id));
        const visible = Boolean(matchesCategory && matchesSearch && matchesStar);
        // Hide the entire slot, including its time label and rail—not just the article.
        slot.classList.toggle("hidden", !visible);
        if (visible) {
          visibleCount++;
          lastVisible = slot;
        }
      });

      lastVisible?.classList.add("is-last-visible");
      day.classList.toggle("hidden", visibleCount === 0);
      const counter = day.querySelector("[data-day-count]");
      if (counter) counter.textContent = String(visibleCount);
      visibleTotal += visibleCount;
    });

    const emptyState = document.querySelector("[data-filter-empty]");
    if (emptyState) emptyState.classList.toggle("hidden", visibleTotal > 0);
  }

  function syncStars() {
    const ids = new Set(starIds());
    document.querySelectorAll("[data-star-id]").forEach((button) => {
      const on = ids.has(button.dataset.starId);
      button.classList.toggle("on", on);
      button.textContent = on ? "★" : "☆";
      button.setAttribute("aria-pressed", String(on));
    });
    filter();
  }

  function syncCategoryFromUrl() {
    const fromUrl = new URL(location.href).searchParams.get("category") || "all";
    const selected = categoryTabs().find((tab) => tab.dataset.category === fromUrl)
      || categoryTabs().find((tab) => tab.dataset.category === "all");
    categoryTabs().forEach((tab) => {
      const active = tab === selected;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const theme = event.target.closest("[data-theme-choice]");
    if (theme) {
      themePreference = theme.dataset.themeChoice;
      localStorage.setItem(themeKey, themePreference);
      applyTheme(themePreference);
      return;
    }

    // Only tabs are category controls. Feed articles also carry data-category.
    const tab = event.target.closest(".tabs .tab[data-category]");
    if (tab) {
      event.preventDefault();
      categoryTabs().forEach((button) => {
        const active = button === tab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const url = new URL(location.href);
      if (tab.dataset.category === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", tab.dataset.category);
      history.replaceState(null, "", url);
      filter();
      return;
    }

    const star = event.target.closest("[data-star-id]");
    if (star) {
      const id = star.dataset.starId;
      const ids = starIds();
      const next = ids.includes(id) ? ids.filter((value) => value !== id) : [id, ...ids].slice(0, 500);
      localStorage.setItem(starKey, JSON.stringify(next));
      syncStars();
    }
  });

  if (input) {
    input.addEventListener("input", filter);
    addEventListener("keydown", (event) => {
      if (event.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || "")) {
        event.preventDefault();
        input.focus();
      }
    });
  }

  window.addEventListener("popstate", () => {
    syncCategoryFromUrl();
    filter();
  });
  syncCategoryFromUrl();
  syncStars();

  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    if (themePreference === "system") applyTheme(themePreference);
  });
})();
