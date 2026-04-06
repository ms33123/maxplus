import { onBeforeUnmount, watch, type WatchSource } from "vue";
import type { SiteThemeContent } from "../types/content";

const defaultSiteTheme: SiteThemeContent = {
  preset: "default",
  effectsEnabled: true
};

function applySiteTheme(theme: SiteThemeContent) {
  const root = document.documentElement;
  const body = document.body;
  const isChristmasTheme = theme.preset === "christmas";

  root.dataset.siteTheme = theme.preset;
  root.dataset.themeEffects = theme.effectsEnabled ? "on" : "off";
  root.classList.toggle("theme-christmas", isChristmasTheme);
  root.classList.toggle("holiday-mode", isChristmasTheme);

  if (body) {
    body.classList.toggle("theme-christmas", isChristmasTheme);
    body.classList.toggle("holiday-mode", isChristmasTheme);
  }
}

export function useSiteTheme(theme: WatchSource<SiteThemeContent | undefined>) {
  if (typeof document === "undefined") {
    return;
  }

  watch(
    theme,
    (value) => {
      applySiteTheme(value ?? defaultSiteTheme);
    },
    {
      immediate: true,
      deep: true
    }
  );

  onBeforeUnmount(() => {
    const root = document.documentElement;
    const body = document.body;

    delete root.dataset.siteTheme;
    delete root.dataset.themeEffects;
    root.classList.remove("theme-christmas", "holiday-mode");

    if (body) {
      body.classList.remove("theme-christmas", "holiday-mode");
    }
  });
}
