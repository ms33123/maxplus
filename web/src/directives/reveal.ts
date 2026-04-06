import type { Directive } from "vue";

const observers = new WeakMap<HTMLElement, IntersectionObserver>();
const fallbackTimers = new WeakMap<HTMLElement, number>();

const isRevealSupported = () =>
  typeof window !== "undefined" && "IntersectionObserver" in window;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clearFallbackTimer(el: HTMLElement) {
  const timerId = fallbackTimers.get(el);

  if (timerId !== undefined) {
    window.clearTimeout(timerId);
    fallbackTimers.delete(el);
  }
}

function disconnectObserver(el: HTMLElement) {
  const observer = observers.get(el);

  if (observer) {
    observer.disconnect();
    observers.delete(el);
  }
}

function markVisible(el: HTMLElement) {
  el.classList.add("is-visible");
  clearFallbackTimer(el);
  disconnectObserver(el);
}

function isElementNearViewport(el: HTMLElement, offset = 180) {
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom >= -offset &&
    rect.top <= viewportHeight + offset &&
    rect.right >= 0 &&
    rect.left <= viewportWidth
  );
}

export function syncRevealVisibility(scope: ParentNode = document) {
  if (typeof window === "undefined") {
    return;
  }

  scope.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => {
    if (isElementNearViewport(el)) {
      markVisible(el);
    }
  });
}

export const reveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReducedMotion() || !isRevealSupported()) {
      el.classList.add("is-visible");
      return;
    }

    if (isElementNearViewport(el)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0) {
            return;
          }

          markVisible(entry.target as HTMLElement);
        });
      },
      {
        threshold: 0.01,
        rootMargin: "180px 0px -8% 0px"
      }
    );

    observer.observe(el);
    observers.set(el, observer);

    const fallbackTimer = window.setTimeout(() => {
      if (el.isConnected && isElementNearViewport(el, 260)) {
        markVisible(el);
      }
    }, 280);

    fallbackTimers.set(el, fallbackTimer);
  },
  updated(el) {
    if (el.classList.contains("is-visible")) {
      return;
    }

    if (prefersReducedMotion() || isElementNearViewport(el)) {
      markVisible(el);
    }
  },
  unmounted(el) {
    clearFallbackTimer(el);
    disconnectObserver(el);
  }
};
