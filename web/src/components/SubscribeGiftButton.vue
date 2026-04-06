<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { SubscribeGiftStylePreset } from "../types/content";

type GiftParticleShape = "confetti" | "streamer" | "gift";

interface GiftParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  gravity: number;
  drag: number;
  rotation: number;
  rotationSpeed: number;
  fill: string;
  accent: string;
  shape: GiftParticleShape;
}

const OPEN_DELAY = 360;

const props = defineProps<{
  label: string;
  open: boolean;
  controlsId: string;
  stylePreset: SubscribeGiftStylePreset;
}>();

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const hostRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const boxRef = ref<HTMLSpanElement | null>(null);
const isBursting = ref(false);
const className = computed(() => `subscribe-gift subscribe-gift--${props.stylePreset}`);
const hintEyebrow = computed(() => {
  if (typeof document !== "undefined" && document.documentElement.lang.toLowerCase().startsWith("zh")) {
    return "点击礼盒";
  }

  return "Tap the gift";
});

const themePalettes: Record<
  SubscribeGiftStylePreset,
  { fills: string[]; accents: string[] }
> = {
  "classic-gift": {
    fills: ["#ffd869", "#ffb84d", "#ffffff", "#ff8a3d"],
    accents: ["#d3481f", "#10213a", "#fff3c2"]
  },
  "sport-burst": {
    fills: ["#d8ff4d", "#7ce0d8", "#ffffff", "#ffad52"],
    accents: ["#0d6f83", "#14532d", "#10213a"]
  },
  "midnight-gift": {
    fills: ["#7ce0d8", "#f7f3e8", "#ff8f70", "#ffd36e"],
    accents: ["#17325c", "#0b1830", "#d54820"]
  }
};

const particles: GiftParticle[] = [];

let frameId: number | null = null;
let openTimer: number | null = null;
let canvasWidth = 0;
let canvasHeight = 0;
let context: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | null = null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function syncCanvas() {
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

function clearOpenTimer() {
  if (openTimer !== null) {
    window.clearTimeout(openTimer);
    openTimer = null;
  }
}

function resetBurst() {
  particles.length = 0;
  isBursting.value = false;

  if (context) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

function resolveBurstOrigin() {
  if (!hostRef.value || !boxRef.value) {
    return {
      x: canvasWidth * 0.72,
      y: canvasHeight * 0.66
    };
  }

  const hostRect = hostRef.value.getBoundingClientRect();
  const boxRect = boxRef.value.getBoundingClientRect();

  return {
    x: boxRect.left - hostRect.left + boxRect.width / 2,
    y: boxRect.top - hostRect.top + boxRect.height * 0.24
  };
}

function createParticle(
  index: number,
  originX: number,
  originY: number
): GiftParticle {
  const palette = themePalettes[props.stylePreset];
  const angle = -2.62 + Math.random() * 2.24;
  const speed = 2.6 + Math.random() * 4.8;
  const shape: GiftParticleShape =
    index % 7 === 0 ? "gift" : index % 4 === 0 ? "streamer" : "confetti";
  const life = 34 + Math.random() * 16;

  return {
    x: originX + (Math.random() - 0.5) * 18,
    y: originY + (Math.random() - 0.5) * 10,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 1.2,
    size:
      shape === "gift"
        ? 14 + Math.random() * 7
        : shape === "streamer"
          ? 12 + Math.random() * 8
          : 7 + Math.random() * 6,
    life,
    maxLife: life,
    gravity: shape === "gift" ? 0.12 : 0.18,
    drag: shape === "streamer" ? 0.992 : 0.986,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.42,
    fill: palette.fills[index % palette.fills.length],
    accent: palette.accents[index % palette.accents.length],
    shape
  };
}

function spawnBurst() {
  const { x, y } = resolveBurstOrigin();

  particles.length = 0;

  for (let index = 0; index < 34; index += 1) {
    particles.push(createParticle(index, x, y));
  }
}

function drawParticle(particle: GiftParticle, opacity: number) {
  if (!context) {
    return;
  }

  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation);
  context.globalAlpha = opacity;
  context.shadowColor = particle.fill;
  context.shadowBlur = particle.shape === "gift" ? 12 : 8;

  if (particle.shape === "streamer") {
    context.fillStyle = particle.fill;
    context.fillRect(-particle.size * 0.72, -particle.size * 0.14, particle.size * 1.44, particle.size * 0.28);
  } else if (particle.shape === "gift") {
    context.fillStyle = particle.fill;
    context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    context.fillStyle = particle.accent;
    context.fillRect(-particle.size * 0.12, -particle.size / 2, particle.size * 0.24, particle.size);
    context.fillRect(-particle.size / 2, -particle.size * 0.12, particle.size, particle.size * 0.24);
  } else {
    context.fillStyle = particle.fill;
    context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.7);
  }

  context.restore();
}

function animateBurst() {
  if (!context) {
    resetBurst();
    stopFrame();
    return;
  }

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= particle.drag;
    particle.vy += particle.gravity;
    particle.rotation += particle.rotationSpeed;
    particle.life -= 1;

    if (particle.life <= 0) {
      particles.splice(index, 1);
      continue;
    }

    drawParticle(particle, particle.life / particle.maxLife);
  }

  if (!particles.length) {
    resetBurst();
    stopFrame();
    return;
  }

  frameId = window.requestAnimationFrame(animateBurst);
}

function openWithBurst() {
  if (isBursting.value) {
    return;
  }

  syncCanvas();

  if (!context) {
    emit("open");
    return;
  }

  isBursting.value = true;
  spawnBurst();
  stopFrame();
  clearOpenTimer();
  frameId = window.requestAnimationFrame(animateBurst);
  openTimer = window.setTimeout(() => {
    openTimer = null;
    emit("open");
  }, OPEN_DELAY);
}

function handleClick() {
  if (props.open) {
    emit("close");
    return;
  }

  if (prefersReducedMotion()) {
    emit("open");
    return;
  }

  openWithBurst();
}

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  syncCanvas();
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      syncCanvas();
    });

    if (hostRef.value) {
      resizeObserver.observe(hostRef.value);
    }
  } else {
    window.addEventListener("resize", syncCanvas);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", syncCanvas);
  }
  stopFrame();
  clearOpenTimer();
  resetBurst();
});
</script>

<template>
  <div
    ref="hostRef"
    :class="[className, { 'is-bursting': isBursting, 'is-open': open }]"
  >
    <canvas ref="canvasRef" class="subscribe-gift__canvas" aria-hidden="true"></canvas>

    <button
      type="button"
      class="subscribe-gift__button"
      :aria-controls="controlsId"
      :aria-expanded="open"
      :aria-label="open ? 'Close subscribe dialog' : label"
      :disabled="isBursting"
      @click="handleClick"
    >
      <span class="subscribe-gift__halo" aria-hidden="true"></span>
      <span class="subscribe-gift__hint">
        <span class="subscribe-gift__hint-kicker">{{ hintEyebrow }}</span>
        <span>{{ label }}</span>
      </span>

      <span ref="boxRef" class="subscribe-gift__box" aria-hidden="true">
        <span class="subscribe-gift__spark subscribe-gift__spark--one"></span>
        <span class="subscribe-gift__spark subscribe-gift__spark--two"></span>
        <span class="subscribe-gift__spark subscribe-gift__spark--three"></span>
        <span class="subscribe-gift__lid"></span>
        <span class="subscribe-gift__base"></span>
        <span class="subscribe-gift__ribbon subscribe-gift__ribbon--vertical"></span>
        <span class="subscribe-gift__ribbon subscribe-gift__ribbon--horizontal"></span>
        <span class="subscribe-gift__bow">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </span>
    </button>
  </div>
</template>
