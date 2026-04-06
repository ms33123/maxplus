<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
  alpha: number;
};

const VISIBILITY_THRESHOLD = 420;
const LAUNCH_DURATION = 980;
const LIFT_DISTANCE = 138;

const hostRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isVisible = ref(false);
const isLaunching = ref(false);
const launchProgress = ref(0);

let frameId: number | null = null;
let launchTimer: number | null = null;
let launchStartedAt = 0;
let visibilitySuppressed = false;
let canvasWidth = 0;
let canvasHeight = 0;
let context: CanvasRenderingContext2D | null = null;

const particles: Particle[] = [];

const showButton = computed(() => isVisible.value || isLaunching.value);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const buttonStyle = computed(() => {
  const lift = easeOutCubic(launchProgress.value) * LIFT_DISTANCE;
  const tilt = launchProgress.value > 0 ? -3 + launchProgress.value * 3 : 0;

  return {
    transform: `translate3d(0, ${(-lift).toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
  };
});

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function syncVisibility() {
  if (visibilitySuppressed || typeof window === "undefined") {
    isVisible.value = false;
    return;
  }

  isVisible.value = window.scrollY > VISIBILITY_THRESHOLD;
}

function resizeCanvas() {
  if (!hostRef.value || !canvasRef.value) {
    return;
  }

  const rect = hostRef.value.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvasRef.value.width = Math.round(rect.width * dpr);
  canvasRef.value.height = Math.round(rect.height * dpr);

  context = canvasRef.value.getContext("2d");

  if (!context) {
    return;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function stopFrame() {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function clearLaunchTimer() {
  if (launchTimer !== null) {
    window.clearTimeout(launchTimer);
    launchTimer = null;
  }
}

function resetCanvas() {
  particles.length = 0;

  if (context) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

function emitTrail(progress: number) {
  const eased = easeOutCubic(progress);
  const originX = canvasWidth / 2;
  const originY = canvasHeight - 68 - eased * LIFT_DISTANCE;
  const burstCount = progress < 0.25 ? 8 : 5;

  for (let index = 0; index < burstCount; index += 1) {
    const speed = 1.9 + Math.random() * 2.8;
    const spread = (Math.random() - 0.5) * 1.8;
    const life = 16 + Math.random() * 12;

    particles.push({
      x: originX + spread * 11,
      y: originY + 12 + Math.random() * 10,
      vx: spread * 1.5,
      vy: speed,
      size: 5 + Math.random() * 8,
      life,
      maxLife: life,
      hue: Math.random() > 0.5 ? 24 : 198,
      alpha: 0.55 + Math.random() * 0.28
    });
  }
}

function drawParticles() {
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.save();
  context.globalCompositeOperation = "lighter";

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy += 0.08;
    particle.life -= 1;

    if (particle.life <= 0) {
      particles.splice(index, 1);
      continue;
    }

    const opacity = particle.alpha * (particle.life / particle.maxLife);
    const radius = particle.size * (0.35 + particle.life / particle.maxLife);
    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      radius
    );

    gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 74%, ${opacity})`);
    gradient.addColorStop(0.58, `hsla(${particle.hue}, 95%, 60%, ${opacity * 0.7})`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function animateLaunch(timestamp: number) {
  if (!isLaunching.value) {
    stopFrame();
    resetCanvas();
    return;
  }

  const progress = clamp((timestamp - launchStartedAt) / LAUNCH_DURATION, 0, 1);
  launchProgress.value = progress;
  emitTrail(progress);
  drawParticles();

  frameId = window.requestAnimationFrame(animateLaunch);
}

function launchToTop() {
  if (typeof window === "undefined" || isLaunching.value) {
    return;
  }

  if (window.scrollY <= 0) {
    return;
  }

  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0, behavior: "auto" });
    syncVisibility();
    return;
  }

  visibilitySuppressed = true;
  isVisible.value = false;
  isLaunching.value = true;
  launchProgress.value = 0;
  resetCanvas();
  resizeCanvas();
  clearLaunchTimer();
  stopFrame();
  launchStartedAt = performance.now();
  frameId = window.requestAnimationFrame(animateLaunch);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  launchTimer = window.setTimeout(() => {
    isLaunching.value = false;
    launchProgress.value = 0;
    visibilitySuppressed = false;
    resetCanvas();
    syncVisibility();
  }, LAUNCH_DURATION);
}

function handleScroll() {
  syncVisibility();
}

function handleResize() {
  resizeCanvas();
}

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  resizeCanvas();
  syncVisibility();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  }

  stopFrame();
  clearLaunchTimer();
  resetCanvas();
});
</script>

<template>
  <div
    ref="hostRef"
    class="rocket-top"
    :class="{
      'rocket-top--visible': showButton,
      'rocket-top--launching': isLaunching
    }"
  >
    <canvas ref="canvasRef" class="rocket-top__canvas" aria-hidden="true"></canvas>

    <button
      type="button"
      class="rocket-top__button"
      :style="buttonStyle"
      :disabled="isLaunching"
      aria-label="Back to top"
      @click="launchToTop"
    >
      <span class="rocket-top__shadow" aria-hidden="true"></span>
      <svg class="rocket-top__icon" viewBox="0 0 96 136" aria-hidden="true">
        <defs>
          <linearGradient id="rocket-body-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#f7fbff" />
            <stop offset="56%" stop-color="#d9e7f7" />
            <stop offset="100%" stop-color="#9db7d9" />
          </linearGradient>
          <linearGradient id="rocket-fin-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff9a5d" />
            <stop offset="100%" stop-color="#ff6a2a" />
          </linearGradient>
          <linearGradient id="rocket-core-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#24456f" />
            <stop offset="100%" stop-color="#10213a" />
          </linearGradient>
          <linearGradient id="rocket-flame-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stop-color="#fff1ad" />
            <stop offset="52%" stop-color="#ff9f54" />
            <stop offset="100%" stop-color="#ff5c2a" />
          </linearGradient>
        </defs>

        <path
          d="M48 8C63 20 70 39 70 62V83H26V62C26 39 33 20 48 8Z"
          fill="url(#rocket-body-gradient)"
          stroke="#ffffff"
          stroke-width="2.2"
        />
        <path
          d="M34 83H62V102C62 111 56 118 48 123C40 118 34 111 34 102V83Z"
          fill="url(#rocket-core-gradient)"
        />
        <path d="M26 70L11 92L28 88L33 76Z" fill="url(#rocket-fin-gradient)" />
        <path d="M70 70L85 92L68 88L63 76Z" fill="url(#rocket-fin-gradient)" />
        <path d="M41 102L48 132L55 102Z" fill="url(#rocket-flame-gradient)" class="rocket-top__flame" />
        <circle cx="48" cy="43" r="12" fill="#c9ebff" stroke="#ffffff" stroke-width="3" />
        <circle cx="48" cy="43" r="5.5" fill="#7bc6ff" opacity="0.9" />
        <path d="M37 24H59" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.64" />
      </svg>
      <span class="sr-only">Back to top</span>
    </button>
  </div>
</template>
