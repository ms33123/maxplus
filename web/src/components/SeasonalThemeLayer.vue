<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { SiteThemeContent } from "../types/content";

interface GarlandLight {
  row: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
}

interface StarPoint {
  x: number;
  y: number;
  size: number;
  phase: number;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  drift: number;
  phase: number;
  opacity: number;
}

const props = defineProps<{
  theme: SiteThemeContent;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isChristmasTheme = computed(() => props.theme.preset === "christmas");

const lightPalette = ["#d94757", "#f3ca68", "#2e8d71", "#fff7ef"];
const garlandLights: GarlandLight[] = [];
const starPoints: StarPoint[] = [];
const snowflakes: Snowflake[] = [];

let frameId: number | null = null;
let context: CanvasRenderingContext2D | null = null;
let canvasWidth = 0;
let canvasHeight = 0;
let mounted = false;
let animationStartedAt = 0;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const shouldAnimate = () =>
  isChristmasTheme.value && props.theme.effectsEnabled && !prefersReducedMotion();

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function stopFrame() {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function syncCanvas() {
  if (typeof window === "undefined" || !canvasRef.value) {
    return false;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvasRef.value.width = Math.round(canvasWidth * dpr);
  canvasRef.value.height = Math.round(canvasHeight * dpr);
  context = canvasRef.value.getContext("2d");

  if (!context) {
    return false;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  return true;
}

function getHeaderOffset() {
  return canvasWidth <= 820 ? 74 : 108;
}

function garlandY(progress: number, row: number, wobble = 0) {
  const topOffset = getHeaderOffset() + row * (canvasWidth <= 820 ? 0 : 28);
  const sag = canvasWidth <= 820 ? 11 : 18 + row * 5;

  return topOffset + Math.sin(progress * Math.PI * (row === 0 ? 1.1 : 1.34) + wobble) * sag;
}

function resetSnowflake(flake: Snowflake, randomY = false) {
  flake.x = randomBetween(-30, canvasWidth + 30);
  flake.y = randomY ? randomBetween(-canvasHeight, canvasHeight) : randomBetween(-60, -10);
  flake.radius = randomBetween(1.4, canvasWidth <= 820 ? 4.4 : 5.4);
  flake.speedY = randomBetween(0.55, canvasWidth <= 820 ? 1.05 : 1.35);
  flake.drift = randomBetween(-0.45, 0.45);
  flake.phase = randomBetween(0, Math.PI * 2);
  flake.opacity = randomBetween(0.38, 0.9);
}

function buildGarlandLights() {
  garlandLights.length = 0;
  const rowCount = canvasWidth <= 820 ? 1 : 2;

  for (let row = 0; row < rowCount; row += 1) {
    const count = canvasWidth <= 820 ? 8 : row === 0 ? 11 : 9;

    for (let index = 0; index < count; index += 1) {
      const progress = (index + 0.45) / (count + 0.15);

      garlandLights.push({
        row,
        x: progress * (canvasWidth + 120) - 60,
        y: garlandY(progress, row),
        radius: randomBetween(canvasWidth <= 820 ? 4.4 : 5.2, canvasWidth <= 820 ? 5.6 : 6.8),
        color: lightPalette[(index + row) % lightPalette.length],
        phase: randomBetween(0, Math.PI * 2)
      });
    }
  }
}

function buildStars() {
  starPoints.length = 0;
  const topBase = getHeaderOffset() + (canvasWidth <= 820 ? 28 : 34);
  const seeds =
    canvasWidth <= 820
      ? [
          { x: 0.13, y: topBase + 18, size: 10.5 },
          { x: 0.31, y: topBase + 58, size: 8.4 },
          { x: 0.84, y: topBase + 34, size: 9.2 }
        ]
      : [
          { x: 0.08, y: topBase + 20, size: 13 },
          { x: 0.17, y: topBase + 72, size: 10.2 },
          { x: 0.31, y: topBase + 134, size: 9.4 },
          { x: 0.82, y: topBase + 38, size: 11.6 },
          { x: 0.92, y: topBase + 112, size: 14 }
        ];

  seeds.forEach((item) => {
    starPoints.push({
      x: canvasWidth * item.x,
      y: item.y,
      size: item.size,
      phase: randomBetween(0, Math.PI * 2)
    });
  });
}

function buildSnowflakes() {
  snowflakes.length = 0;

  if (!shouldAnimate()) {
    return;
  }

  const count = canvasWidth <= 820 ? 16 : 26;

  for (let index = 0; index < count; index += 1) {
    const flake: Snowflake = {
      x: 0,
      y: 0,
      radius: 0,
      speedY: 0,
      drift: 0,
      phase: 0,
      opacity: 0
    };

    resetSnowflake(flake, true);
    snowflakes.push(flake);
  }
}

function initializeScene() {
  buildGarlandLights();
  buildStars();
  buildSnowflakes();
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number
) {
  const step = Math.PI / 5;

  ctx.beginPath();

  for (let index = 0; index < 10; index += 1) {
    const angle = -Math.PI / 2 + step * index;
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const pointX = x + Math.cos(angle) * radius;
    const pointY = y + Math.sin(angle) * radius;

    if (index === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }

  ctx.closePath();
}

function drawBulb(light: GarlandLight, time: number) {
  if (!context) {
    return;
  }

  const glowStrength = shouldAnimate()
    ? 0.74 + ((Math.sin(time * 0.004 + light.phase) + 1) / 2) * 0.32
    : 0.9;
  const bulbWidth = light.radius * 1.55;
  const bulbHeight = light.radius * 2.45;
  const glow = context.createRadialGradient(
    light.x,
    light.y,
    0,
    light.x,
    light.y,
    light.radius * 4.6
  );

  glow.addColorStop(0, `${light.color}bb`);
  glow.addColorStop(0.52, `${light.color}3c`);
  glow.addColorStop(1, `${light.color}00`);

  context.save();
  context.globalCompositeOperation = "lighter";
  context.fillStyle = glow;
  context.beginPath();
  context.arc(light.x, light.y, light.radius * 4.2, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.translate(light.x, light.y);
  context.scale(1, glowStrength);
  context.fillStyle = light.color;
  context.shadowColor = light.color;
  context.shadowBlur = 18;
  context.beginPath();
  context.moveTo(0, -bulbHeight * 0.88);
  context.bezierCurveTo(
    bulbWidth,
    -bulbHeight * 0.74,
    bulbWidth,
    bulbHeight * 0.5,
    0,
    bulbHeight
  );
  context.bezierCurveTo(
    -bulbWidth,
    bulbHeight * 0.5,
    -bulbWidth,
    -bulbHeight * 0.74,
    0,
    -bulbHeight * 0.88
  );
  context.closePath();
  context.fill();
  context.restore();

  context.fillStyle = "rgba(48, 74, 62, 0.85)";
  drawRoundedRectPath(
    context,
    light.x - bulbWidth * 0.36,
    light.y - bulbHeight * 1.24,
    bulbWidth * 0.72,
    bulbHeight * 0.28,
    2
  );
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.34)";
  context.beginPath();
  context.ellipse(
    light.x - bulbWidth * 0.24,
    light.y - bulbHeight * 0.1,
    bulbWidth * 0.18,
    bulbHeight * 0.32,
    0,
    0,
    Math.PI * 2
  );
  context.fill();
}

function drawGarlands(time: number) {
  if (!context) {
    return;
  }

  const rowCount = canvasWidth <= 820 ? 1 : 2;

  for (let row = 0; row < rowCount; row += 1) {
    context.beginPath();

    for (let step = 0; step <= 36; step += 1) {
      const progress = step / 36;
      const x = progress * (canvasWidth + 120) - 60;
      const wobble = shouldAnimate() ? Math.sin(time * 0.0011 + progress * 5 + row) * 0.08 : 0;
      const y = garlandY(progress, row, wobble);

      if (step === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.lineWidth = row === 0 ? 3.2 : 2.6;
    context.strokeStyle = row === 0 ? "rgba(38, 88, 71, 0.34)" : "rgba(30, 64, 53, 0.28)";
    context.stroke();
  }

  garlandLights.forEach((light) => {
    drawBulb(light, time);
  });
}

function drawStars(time: number) {
  if (!context) {
    return;
  }

  const ctx = context;

  starPoints.forEach((star) => {
    const brightness = shouldAnimate()
      ? 0.7 + ((Math.sin(time * 0.003 + star.phase) + 1) / 2) * 0.3
      : 0.92;
    const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3.6);

    glow.addColorStop(0, `rgba(255, 248, 204, ${0.42 * brightness})`);
    glow.addColorStop(0.52, `rgba(244, 207, 104, ${0.26 * brightness})`);
    glow.addColorStop(1, "rgba(244, 207, 104, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 3.3, 0, Math.PI * 2);
    ctx.fill();

    drawStarPath(ctx, star.x, star.y, star.size, star.size * 0.45);
    ctx.fillStyle = "rgba(251, 238, 174, 0.98)";
    ctx.fill();
  });
}

function drawGroundSnow(x: number, y: number, width: number, height: number) {
  if (!context) {
    return;
  }

  const ctx = context;
  const gradient = ctx.createRadialGradient(x, y - height * 0.15, width * 0.12, x, y, width * 0.72);

  gradient.addColorStop(0, "rgba(255, 255, 255, 0.94)");
  gradient.addColorStop(0.6, "rgba(250, 252, 255, 0.82)");
  gradient.addColorStop(1, "rgba(250, 252, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawGift(
  x: number,
  y: number,
  width: number,
  height: number,
  bodyTop: string,
  bodyBottom: string,
  ribbon: string
) {
  if (!context) {
    return;
  }

  const ctx = context;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(14, 30, 26, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 4, width * 0.48, height * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyGradient = ctx.createLinearGradient(0, -height, 0, 0);
  bodyGradient.addColorStop(0, bodyTop);
  bodyGradient.addColorStop(1, bodyBottom);

  drawRoundedRectPath(ctx, -width / 2, -height, width, height, Math.min(width, height) * 0.16);
  ctx.fillStyle = bodyGradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = ribbon;
  drawRoundedRectPath(ctx, -width * 0.08, -height, width * 0.16, height, width * 0.08);
  ctx.fill();

  drawRoundedRectPath(ctx, -width / 2, -height * 0.6, width, height * 0.16, height * 0.08);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 250, 236, 0.92)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(-width * 0.12, -height - 2, width * 0.12, height * 0.14, -0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(width * 0.12, -height - 2, width * 0.12, height * 0.14, 0.45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawTree(x: number, y: number, scale: number, time: number, phaseShift: number) {
  if (!context) {
    return;
  }

  const ctx = context;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  if (shouldAnimate()) {
    ctx.rotate(Math.sin(time * 0.0009 + phaseShift) * 0.024);
  }

  drawGroundSnow(0, 0, 130, 26);

  const glow = ctx.createRadialGradient(0, -84, 8, 0, -84, 108);
  glow.addColorStop(0, "rgba(246, 218, 131, 0.18)");
  glow.addColorStop(0.52, "rgba(46, 141, 113, 0.12)");
  glow.addColorStop(1, "rgba(46, 141, 113, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(0, -72, 86, 94, 0, 0, Math.PI * 2);
  ctx.fill();

  const tiers = [
    { top: -130, width: 52, height: 36 },
    { top: -104, width: 74, height: 44 },
    { top: -74, width: 96, height: 56 },
    { top: -36, width: 120, height: 68 }
  ];

  tiers.forEach((tier, index) => {
    const gradient = ctx.createLinearGradient(0, tier.top, 0, tier.top + tier.height);

    gradient.addColorStop(0, index === 0 ? "#3f9475" : "#2f7f62");
    gradient.addColorStop(0.55, "#215744");
    gradient.addColorStop(1, "#16362d");

    ctx.beginPath();
    ctx.moveTo(0, tier.top);
    ctx.quadraticCurveTo(tier.width * 0.2, tier.top + tier.height * 0.3, tier.width / 2, tier.top + tier.height);
    ctx.quadraticCurveTo(0, tier.top + tier.height * 0.78, -tier.width / 2, tier.top + tier.height);
    ctx.quadraticCurveTo(-tier.width * 0.2, tier.top + tier.height * 0.3, 0, tier.top);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(-tier.width * 0.22, tier.top + tier.height * 0.35);
    ctx.quadraticCurveTo(0, tier.top + tier.height * 0.16, tier.width * 0.22, tier.top + tier.height * 0.35);
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(247, 228, 164, 0.7)";
  ctx.lineWidth = 2.1;
  ctx.beginPath();
  ctx.moveTo(-24, -92);
  ctx.quadraticCurveTo(-6, -88, 12, -84);
  ctx.quadraticCurveTo(28, -80, 34, -68);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-38, -56);
  ctx.quadraticCurveTo(-10, -50, 18, -44);
  ctx.quadraticCurveTo(34, -40, 42, -26);
  ctx.stroke();

  const ornaments = [
    { x: -16, y: -88, color: "#e8be56" },
    { x: 18, y: -74, color: "#d84f60" },
    { x: -26, y: -52, color: "#fff5ef" },
    { x: 8, y: -46, color: "#2e8d71" },
    { x: 30, y: -24, color: "#e8be56" }
  ];

  ornaments.forEach((item) => {
    const ornament = ctx.createRadialGradient(item.x - 1, item.y - 1, 0, item.x, item.y, 8);
    ornament.addColorStop(0, "rgba(255, 255, 255, 0.92)");
    ornament.addColorStop(0.2, item.color);
    ornament.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    ctx.fillStyle = ornament;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#7f4d2a";
  drawRoundedRectPath(ctx, -8, -10, 16, 22, 4);
  ctx.fill();

  const starGlow = ctx.createRadialGradient(0, -144, 0, 0, -144, 26);
  starGlow.addColorStop(0, "rgba(255, 244, 187, 0.7)");
  starGlow.addColorStop(0.55, "rgba(243, 200, 106, 0.25)");
  starGlow.addColorStop(1, "rgba(243, 200, 106, 0)");
  ctx.fillStyle = starGlow;
  ctx.beginPath();
  ctx.arc(0, -144, 26, 0, Math.PI * 2);
  ctx.fill();

  drawStarPath(ctx, 0, -144, 11, 5);
  ctx.fillStyle = "rgba(255, 241, 168, 0.98)";
  ctx.fill();

  ctx.restore();
}

function updateSnowflakes(time: number) {
  snowflakes.forEach((flake) => {
    flake.x += flake.drift + Math.sin(time * 0.001 + flake.phase) * 0.18;
    flake.y += flake.speedY;

    if (flake.y > canvasHeight + 20 || flake.x < -40 || flake.x > canvasWidth + 40) {
      resetSnowflake(flake);
    }
  });
}

function drawSnowflakes() {
  if (!context) {
    return;
  }

  const ctx = context;

  snowflakes.forEach((flake) => {
    const gradient = ctx.createRadialGradient(flake.x, flake.y, 0, flake.x, flake.y, flake.radius * 3.2);

    gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity})`);
    gradient.addColorStop(0.6, `rgba(255, 255, 255, ${flake.opacity * 0.35})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius * 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCornerDecorations(time: number) {
  const mobile = canvasWidth <= 820;
  const leftScale = mobile ? 0.62 : 0.92;
  const rightScale = mobile ? 0.48 : 0.72;
  const baseline = canvasHeight - (mobile ? 10 : 18);

  drawTree(mobile ? 54 : 86, baseline, leftScale, time, 0.5);
  drawGift(
    canvasWidth - (mobile ? 92 : 132),
    canvasHeight - (mobile ? 14 : 22),
    mobile ? 34 : 48,
    mobile ? 30 : 42,
    "#2c8b6c",
    "#1d5a47",
    "#f5e6bf"
  );
  drawGift(
    canvasWidth - (mobile ? 54 : 84),
    canvasHeight - (mobile ? 8 : 16),
    mobile ? 42 : 58,
    mobile ? 36 : 50,
    "#da5b6a",
    "#ba2742",
    "#fff2e2"
  );
  drawTree(canvasWidth - (mobile ? 42 : 72), baseline, rightScale, time, 1.5);
}

function renderScene(timestamp: number) {
  if (!context) {
    return;
  }

  const time = timestamp - animationStartedAt;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawGarlands(time);
  drawStars(time);
  drawCornerDecorations(time);

  if (shouldAnimate()) {
    updateSnowflakes(time);
  }

  drawSnowflakes();
}

function animate(timestamp: number) {
  frameId = null;
  renderScene(timestamp);

  if (shouldAnimate()) {
    frameId = window.requestAnimationFrame(animate);
  }
}

async function refreshScene() {
  stopFrame();

  if (!isChristmasTheme.value) {
    return;
  }

  await nextTick();

  if (!syncCanvas()) {
    return;
  }

  initializeScene();
  animationStartedAt = performance.now();
  renderScene(animationStartedAt);

  if (shouldAnimate()) {
    frameId = window.requestAnimationFrame(animate);
  }
}

function handleResize() {
  if (!isChristmasTheme.value) {
    return;
  }

  void refreshScene();
}

watch(
  () => [props.theme.preset, props.theme.effectsEnabled],
  () => {
    if (mounted) {
      void refreshScene();
    }
  }
);

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  mounted = true;
  window.addEventListener("resize", handleResize);
  void refreshScene();
});

onBeforeUnmount(() => {
  mounted = false;

  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }

  stopFrame();
});
</script>

<template>
  <div v-if="isChristmasTheme" class="seasonal-layer" aria-hidden="true">
    <canvas ref="canvasRef" class="seasonal-layer__canvas"></canvas>
  </div>
</template>
