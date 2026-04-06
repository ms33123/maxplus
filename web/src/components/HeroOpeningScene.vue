<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type OpeningMode = "three" | "fallback" | "reduced";

const props = withDefaults(
  defineProps<{
    brand?: string;
    duration?: number;
    impactTime?: number;
    persistAtEnd?: boolean;
    showSkip?: boolean;
  }>(),
  {
    brand: "MAXPLUS",
    duration: 3.55,
    impactTime: 1.52,
    persistAtEnd: false,
    showSkip: true
  }
);

const emit = defineEmits<{
  complete: [];
}>();

const MOBILE_BREAKPOINT = 820;

const canvasHost = ref<HTMLDivElement | null>(null);
const mode = ref<OpeningMode>("three");
const flashOpacity = ref(0);
const shockwaveOpacity = ref(0);
const shockwaveProgress = ref(0);
const brandProgress = ref(0);
const hasSettled = ref(false);

let isFinished = false;
let cleanupScene: (() => void) | null = null;
let frameId: number | null = null;
const timerIds: number[] = [];

const flashStyle = computed(() => ({
  opacity: flashOpacity.value.toFixed(3)
}));

const shockwaveStyle = computed(() => ({
  opacity: shockwaveOpacity.value.toFixed(3),
  transform: `translate(-50%, -50%) scale(${(0.62 + shockwaveProgress.value * 3.45).toFixed(3)})`
}));

const brandStyle = computed(() => {
  const reveal = easeOutCubic(clamp(brandProgress.value, 0, 1));

  return {
    opacity: reveal.toFixed(3),
    transform: `translate(-50%, -50%) translateY(${((1 - reveal) * 28).toFixed(2)}px) scale(${(0.88 + reveal * 0.12).toFixed(3)})`,
    filter: `blur(${((1 - reveal) * 10).toFixed(2)}px)`
  };
});

const brandParts = computed(() => {
  const brand = props.brand.trim();

  if (brand.toUpperCase() === "MAXPLUS") {
    return {
      lead: "MAX",
      tail: "PLUS"
    };
  }

  const splitIndex = Math.max(1, brand.length - 4);

  return {
    lead: brand.slice(0, splitIndex),
    tail: brand.slice(splitIndex)
  };
});

const showFallbackBall = computed(() => mode.value === "fallback");

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function easeInCubic(value: number) {
  return value * value * value;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutBack(value: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
}

function schedule(callback: () => void, delay: number) {
  const timerId = window.setTimeout(callback, delay);
  timerIds.push(timerId);
}

function cancelScheduledTimers() {
  while (timerIds.length) {
    window.clearTimeout(timerIds.pop());
  }
}

function stopFrame() {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function resetOverlays() {
  flashOpacity.value = 0;
  shockwaveOpacity.value = 0;
  shockwaveProgress.value = 0;
  brandProgress.value = 0;
}

function stopOpening() {
  stopFrame();
  cancelScheduledTimers();

  if (cleanupScene) {
    cleanupScene();
    cleanupScene = null;
  }
}

function finishOpening() {
  if (isFinished) {
    return;
  }

  isFinished = true;
  hasSettled.value = true;

  if (props.persistAtEnd) {
    cancelScheduledTimers();
  } else {
    stopOpening();
  }

  emit("complete");
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function startReducedSequence() {
  mode.value = "reduced";
  resetOverlays();
  flashOpacity.value = 0.14;

  schedule(() => {
    flashOpacity.value = 0;
    brandProgress.value = 1;
  }, 80);

  schedule(() => {
    finishOpening();
  }, 1150);
}

function startFallbackSequence() {
  mode.value = "fallback";
  resetOverlays();

  schedule(() => {
    flashOpacity.value = 0.46;
    shockwaveOpacity.value = 0.42;
    shockwaveProgress.value = 0.6;
  }, 240);

  schedule(() => {
    flashOpacity.value = 0.08;
    shockwaveOpacity.value = 0.18;
    shockwaveProgress.value = 1.1;
  }, 420);

  schedule(() => {
    flashOpacity.value = 0;
    shockwaveOpacity.value = 0;
    shockwaveProgress.value = 1.5;
    brandProgress.value = 1;
  }, 500);

  schedule(() => {
    finishOpening();
  }, 1780);
}

async function startThreeSequence() {
  const THREE = await import("three");

  if (isFinished || !canvasHost.value) {
    return () => {};
  }

  const host = canvasHost.value;
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08121f, isMobile ? 0.058 : 0.046);

  const camera = new THREE.PerspectiveCamera(isMobile ? 45 : 38, 1, 0.1, 100);
  const baseCameraPosition = new THREE.Vector3(0, 0.06, 6.95);
  camera.position.copy(baseCameraPosition);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.8));
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 1.24);
  const hemisphere = new THREE.HemisphereLight(0xaec4ff, 0x08111c, 1.45);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  const rimLight = new THREE.DirectionalLight(0x7cc4ff, 1.5);
  const impactLight = new THREE.PointLight(0xff9147, 18, 18, 2);

  keyLight.position.set(3.6, 2.8, 5.4);
  rimLight.position.set(-4.5, 1.4, -2.6);
  impactLight.position.set(0.18, 0.12, 3.8);

  scene.add(ambient, hemisphere, keyLight, rimLight, impactLight);

  const ballGeometry = new THREE.SphereGeometry(1, isMobile ? 52 : 76, isMobile ? 36 : 58);
  const { colorMap, bumpMap, roughnessMap } = createVolleyballMaps(THREE);
  const ballMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    bumpMap,
    bumpScale: isMobile ? 0.028 : 0.04,
    roughnessMap,
    roughness: 0.84,
    metalness: 0.02,
    emissive: new THREE.Color("#070d16"),
    emissiveIntensity: 0.32
  });
  const ballRig = new THREE.Group();
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  const { seamMeshes, seamMaterial, seamGeometries } = createVolleyballSeams(THREE, isMobile);
  ballRig.position.set(0, 0, -25.4);
  ballRig.scale.setScalar(0.44);
  ballRig.add(ball);
  seamMeshes.forEach((mesh) => ballRig.add(mesh));
  scene.add(ballRig);

  const trailGeometry = new THREE.SphereGeometry(1, 24, 24);
  const trailMeshes = Array.from({ length: isMobile ? 4 : 6 }, (_, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: index % 2 === 0 ? 0xffd9c0 : 0xffffff,
      transparent: true,
      opacity: 0.16 - index * 0.02,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(trailGeometry, material);
    mesh.scale.setScalar(0.76);
    scene.add(mesh);

    return mesh;
  });

  const trailHistory = Array.from({ length: trailMeshes.length * 2 + 1 }, () => ballRig.position.clone());

  const particleCount = isMobile ? 54 : 92;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = Array.from({ length: particleCount }, () => new THREE.Vector3());
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffdcc1,
    size: isMobile ? 0.14 : 0.1,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const dustCount = isMobile ? 150 : 220;
  const dustPositions = new Float32Array(dustCount * 3);

  for (let index = 0; index < dustCount; index += 1) {
    const stride = index * 3;
    dustPositions[stride] = (Math.random() - 0.5) * 18;
    dustPositions[stride + 1] = (Math.random() - 0.5) * 10;
    dustPositions[stride + 2] = -4 - Math.random() * 18;
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

  const dustMaterial = new THREE.PointsMaterial({
    color: 0x8eb5ee,
    size: isMobile ? 0.05 : 0.04,
    transparent: true,
    opacity: 0.28,
    depthWrite: false
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.position.z = 1.5;
  scene.add(dust);

  let entryCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(0, 0, 5.52)
  );

  const getFrustumExtentsAtZ = (worldZ: number) => {
    const depth = Math.max(0.01, camera.position.z - worldZ);
    const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * depth;

    return {
      halfHeight,
      halfWidth: halfHeight * camera.aspect
    };
  };

  const buildEntryCurve = () => {
    const startZ = -15.8;
    const control1Z = -11.2;
    const control2Z = -4.2;
    const startExtents = getFrustumExtentsAtZ(startZ);
    const control1Extents = getFrustumExtentsAtZ(control1Z);
    const control2Extents = getFrustumExtentsAtZ(control2Z);
    const start = new THREE.Vector3(
      -startExtents.halfWidth - (isMobile ? 0.24 : 0.34),
      startExtents.halfHeight * (isMobile ? 0.18 : 0.2),
      startZ
    );
    const control1 = new THREE.Vector3(
      -control1Extents.halfWidth * (isMobile ? 0.66 : 0.62) - (isMobile ? 0.14 : 0.2),
      control1Extents.halfHeight * (isMobile ? 0.22 : 0.25),
      control1Z
    );
    const control2 = new THREE.Vector3(
      -control2Extents.halfWidth * (isMobile ? 0.22 : 0.18) - (isMobile ? 0.04 : 0.06),
      control2Extents.halfHeight * (isMobile ? 0.05 : 0.07),
      control2Z
    );

    return {
      start,
      curve: new THREE.CubicBezierCurve3(start, control1, control2, new THREE.Vector3(0, 0, 5.52))
    };
  };

  const updateEntryCurve = (resetTrail = false) => {
    const { start, curve } = buildEntryCurve();
    entryCurve = curve;

    if (resetTrail) {
      ballRig.position.copy(start);
      trailHistory.forEach((point) => point.copy(start));
    }
  };

  const setRendererSize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const handleResize = () => {
    setRendererSize();
    updateEntryCurve();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= MOBILE_BREAKPOINT ? 1.35 : 1.8));
    renderer.render(scene, camera);
  };

  setRendererSize();
  updateEntryCurve(true);
  window.addEventListener("resize", handleResize);

  const impactOrigin = new THREE.Vector3();
  const curvePoint = new THREE.Vector3();
  let impactTriggered = false;
  let previousTime = performance.now();
  const travelStart = 0.14;
  const impactTime = clamp(props.impactTime, 1.3, props.duration - 0.75);
  const reboundEnd = impactTime + 0.62;
  const settleEnd = reboundEnd + 0.72;
  const brandStart = impactTime + 0.16;
  const startTime = performance.now();
  const reboundCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0, 5.52),
    new THREE.Vector3(-0.12, -0.28, 4.38),
    new THREE.Vector3(-0.62, 0.16, 2.16),
    new THREE.Vector3(-0.44, 0.24, 1.12)
  );
  const settleCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.44, 0.24, 1.12),
    new THREE.Vector3(-0.31, 0.2, 0.96),
    new THREE.Vector3(-0.08, 0.1, 0.78),
    new THREE.Vector3(-0.01, 0.04, 0.64)
  );

  const triggerImpact = () => {
    impactOrigin.copy(ballRig.position);
    particleMaterial.opacity = 0.9;

    for (let index = 0; index < particleCount; index += 1) {
      const stride = index * 3;
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * 0.45;
      const speed = lerp(isMobile ? 1.1 : 1.35, isMobile ? 2.1 : 2.8, Math.random());

      particlePositions[stride] = impactOrigin.x + Math.cos(angle) * spread * 0.24;
      particlePositions[stride + 1] = impactOrigin.y + Math.sin(angle) * spread * 0.18;
      particlePositions[stride + 2] = impactOrigin.z - 0.2 + (Math.random() - 0.5) * 0.35;

      particleVelocities[index].set(
        Math.cos(angle) * speed * (0.78 + Math.random() * 0.44),
        Math.sin(angle) * speed * (0.78 + Math.random() * 0.44),
        -0.8 - Math.random() * 1.35
      );
    }

    particleGeometry.attributes.position.needsUpdate = true;
  };

  const animate = (now: number) => {
    const rawElapsed = (now - startTime) / 1000;
    const elapsed = Math.min(rawElapsed, props.duration);
    const delta = Math.min((now - previousTime) / 1000, 0.04);
    previousTime = now;

    const travel = easeInCubic(clamp((elapsed - travelStart) / (impactTime - travelStart), 0, 1));
    const arcLift = Math.sin(travel * Math.PI) * 0.1;
    const rebound = clamp((elapsed - impactTime) / (reboundEnd - impactTime), 0, 1);
    const settle = clamp((elapsed - reboundEnd) / (settleEnd - reboundEnd), 0, 1);
    const brandReveal = clamp((elapsed - brandStart) / 0.68, 0, 1);
    const impactPulse = elapsed < impactTime ? 0 : clamp(1 - (elapsed - impactTime) / 0.18, 0, 1);

    brandProgress.value = brandReveal;
    flashOpacity.value = impactPulse * 1.04;
    shockwaveOpacity.value = clamp(1 - (elapsed - impactTime) / 0.68, 0, 1) * 0.9;
    shockwaveProgress.value = clamp((elapsed - impactTime) / 0.68, 0, 1);

    if (elapsed < impactTime) {
      entryCurve.getPoint(travel, curvePoint);
      curvePoint.y -= Math.sin(travel * Math.PI) * 0.14;
      curvePoint.y += arcLift * 0.14;
      curvePoint.x -= Math.sin(travel * Math.PI) * 0.14;
      ballRig.position.copy(curvePoint);
      ballRig.scale.setScalar(lerp(0.26, 2.1, easeOutCubic(travel)));
    } else if (elapsed < reboundEnd) {
      const bounce = easeOutBack(rebound);

      reboundCurve.getPoint(clamp(bounce, 0, 1), curvePoint);
      ballRig.position.copy(curvePoint);
      ballRig.scale.setScalar(lerp(2.1, 1.06, clamp(bounce, 0, 1)));
    } else {
      const settleEase = easeInOutCubic(settle);

      settleCurve.getPoint(settleEase, curvePoint);
      ballRig.position.copy(curvePoint);
      ballRig.scale.setScalar(lerp(1.06, 0.9, settleEase));
    }

    const settledSpinElapsed = Math.max(0, rawElapsed - props.duration);
    const settledSpinX = settledSpinElapsed * 1.4;
    const settledSpinY = settledSpinElapsed * 1.96;
    const settledSpinZ = settledSpinElapsed * 0.88;

    ballRig.rotation.x = -0.58 + elapsed * 3.5 + travel * 12.2 + settledSpinX;
    ballRig.rotation.y = 0.24 + elapsed * 2.78 + travel * 10.6 + settledSpinY;
    ballRig.rotation.z = -0.18 + elapsed * 1.84 + travel * 7.2 + settledSpinZ;
    ballMaterial.emissiveIntensity = 0.42 + impactPulse * 0.78;

    for (let index = trailHistory.length - 1; index > 0; index -= 1) {
      trailHistory[index].copy(trailHistory[index - 1]);
    }

    trailHistory[0].copy(ballRig.position);

    trailMeshes.forEach((mesh, index) => {
      const target = trailHistory[Math.min(trailHistory.length - 1, (index + 1) * 2)];
      const trailMaterial = mesh.material as import("three").MeshBasicMaterial;
      const trailScale = ballRig.scale.x * Math.max(0.28, 0.96 - index * 0.08);

      mesh.position.copy(target);
      mesh.scale.setScalar(trailScale);
      trailMaterial.opacity = Math.max(0, 0.24 - index * 0.03) * (0.4 + travel * 0.9) * (1 - brandReveal * 0.58);
    });

    dust.rotation.z += delta * (rawElapsed > props.duration ? 0.018 : 0.05);
    dust.rotation.y += delta * (rawElapsed > props.duration ? 0.012 : 0.03);

    if (!impactTriggered && elapsed >= impactTime) {
      impactTriggered = true;
      triggerImpact();
    }

    if (impactTriggered) {
      const burstAge = elapsed - impactTime;
      const burstLife = clamp(1 - burstAge / 0.84, 0, 1);

      particleMaterial.opacity = burstLife * 0.92;

      for (let index = 0; index < particleCount; index += 1) {
        const stride = index * 3;
        const velocity = particleVelocities[index];

        particlePositions[stride] += velocity.x * delta;
        particlePositions[stride + 1] += velocity.y * delta;
        particlePositions[stride + 2] += velocity.z * delta;

        velocity.multiplyScalar(0.986);
        velocity.y -= 0.55 * delta;
      }

      particleGeometry.attributes.position.needsUpdate = true;
    }

    const rush = clamp((elapsed - 0.58) / 0.96, 0, 1);
    const shake = clamp((elapsed - impactTime) / 0.28, 0, 1);

    camera.fov = lerp(isMobile ? 45 : 38, isMobile ? 55 : 47, easeOutCubic(rush)) - clamp((elapsed - impactTime) / 0.32, 0, 1) * 4.4;
    camera.updateProjectionMatrix();
    camera.position.copy(baseCameraPosition);

    if (elapsed >= impactTime && shake < 1) {
      const amplitude = (1 - shake) * 0.34;

      camera.position.x += Math.sin(elapsed * 104) * amplitude;
      camera.position.y += Math.cos(elapsed * 134) * amplitude * 0.92;
      camera.position.z -= amplitude * 0.3;
    }

    impactLight.intensity = 18 + impactPulse * 64;

    renderer.render(scene, camera);

    if (rawElapsed >= props.duration) {
      finishOpening();

      if (!props.persistAtEnd) {
        return;
      }
    }

    frameId = window.requestAnimationFrame(animate);
  };

  frameId = window.requestAnimationFrame(animate);

  return () => {
    window.removeEventListener("resize", handleResize);
    stopFrame();
    scene.clear();
    renderer.dispose();
    ballGeometry.dispose();
    trailGeometry.dispose();
    dustGeometry.dispose();
    particleGeometry.dispose();
    ballMaterial.dispose();
    colorMap.dispose();
    bumpMap.dispose();
    roughnessMap.dispose();
    seamMaterial.dispose();
    particleMaterial.dispose();
    dustMaterial.dispose();
    seamGeometries.forEach((geometry) => geometry.dispose());

    trailMeshes.forEach((mesh) => {
      (mesh.material as import("three").MeshBasicMaterial).dispose();
    });

    while (host.firstChild) {
      host.removeChild(host.firstChild);
    }
  };
}

function createVolleyballMaps(THREE: typeof import("three")) {
  const size = 1024;
  const colorCanvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  const roughnessCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  roughnessCanvas.width = size;
  roughnessCanvas.height = size;

  const colorContext = colorCanvas.getContext("2d");
  const bumpContext = bumpCanvas.getContext("2d");
  const roughnessContext = roughnessCanvas.getContext("2d");

  if (!colorContext || !bumpContext || !roughnessContext) {
    return {
      colorMap: new THREE.CanvasTexture(colorCanvas),
      bumpMap: new THREE.CanvasTexture(bumpCanvas),
      roughnessMap: new THREE.CanvasTexture(roughnessCanvas)
    };
  }

  const colorGradient = colorContext.createLinearGradient(0, 0, size, size);
  colorGradient.addColorStop(0, "#faf3e7");
  colorGradient.addColorStop(0.55, "#f1e7d8");
  colorGradient.addColorStop(1, "#ddd0bb");
  colorContext.fillStyle = colorGradient;
  colorContext.fillRect(0, 0, size, size);

  const roughnessGradient = roughnessContext.createLinearGradient(0, 0, 0, size);
  roughnessGradient.addColorStop(0, "rgb(194, 194, 194)");
  roughnessGradient.addColorStop(1, "rgb(174, 174, 174)");
  roughnessContext.fillStyle = roughnessGradient;
  roughnessContext.fillRect(0, 0, size, size);

  bumpContext.fillStyle = "rgb(128, 128, 128)";
  bumpContext.fillRect(0, 0, size, size);

  const panels = [
    { center: 0.02, topWidth: 0.16, bottomWidth: 0.18, bend: -0.18, color: "#f3762f" },
    { center: 0.34, topWidth: 0.14, bottomWidth: 0.2, bend: 0.16, color: "#ff9251" },
    { center: 0.64, topWidth: 0.18, bottomWidth: 0.15, bend: -0.12, color: "#ef6b26" },
    { center: 0.96, topWidth: 0.17, bottomWidth: 0.19, bend: 0.18, color: "#f67f38" }
  ];

  panels.forEach((panel, index) => {
    drawWrappedPanelBand(colorContext, size, panel.center, panel.topWidth, panel.bottomWidth, panel.bend, panel.color);
    drawWrappedPanelBand(
      bumpContext,
      size,
      panel.center,
      panel.topWidth,
      panel.bottomWidth,
      panel.bend,
      `rgb(${142 + index * 4}, ${142 + index * 4}, ${142 + index * 4})`
    );
    drawWrappedPanelBand(
      roughnessContext,
      size,
      panel.center,
      panel.topWidth,
      panel.bottomWidth,
      panel.bend,
      `rgb(${156 + index * 6}, ${156 + index * 6}, ${156 + index * 6})`
    );
    drawWrappedPanelSeams(colorContext, size, panel.center, panel.topWidth, panel.bottomWidth, panel.bend, "rgba(59, 67, 78, 0.78)", 5);
    drawWrappedPanelSeams(bumpContext, size, panel.center, panel.topWidth, panel.bottomWidth, panel.bend, "rgb(90, 90, 90)", 11);
    drawWrappedPanelSeams(roughnessContext, size, panel.center, panel.topWidth, panel.bottomWidth, panel.bend, "rgb(196, 196, 196)", 7);
  });

  addFabricNoise(colorContext, size, 10000, 18, "color");
  addFabricNoise(bumpContext, size, 12000, 16, "bump");
  addFabricNoise(roughnessContext, size, 9000, 10, "roughness");

  const colorHighlight = colorContext.createRadialGradient(size * 0.32, size * 0.24, size * 0.04, size * 0.5, size * 0.5, size * 0.62);
  colorHighlight.addColorStop(0, "rgba(255, 255, 255, 0.84)");
  colorHighlight.addColorStop(0.26, "rgba(255, 255, 255, 0.18)");
  colorHighlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  colorContext.fillStyle = colorHighlight;
  colorContext.fillRect(0, 0, size, size);

  const colorShadow = colorContext.createRadialGradient(size * 0.78, size * 0.82, size * 0.08, size * 0.52, size * 0.54, size * 0.7);
  colorShadow.addColorStop(0, "rgba(72, 56, 38, 0.2)");
  colorShadow.addColorStop(1, "rgba(72, 56, 38, 0)");
  colorContext.fillStyle = colorShadow;
  colorContext.fillRect(0, 0, size, size);

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapS = THREE.RepeatWrapping;

  return {
    colorMap,
    bumpMap,
    roughnessMap
  };
}

function createVolleyballSeams(THREE: typeof import("three"), isMobile: boolean) {
  const seamMaterial = new THREE.MeshStandardMaterial({
    color: 0x3f4b57,
    roughness: 0.8,
    metalness: 0.02
  });
  const seamGeometries: import("three").TubeGeometry[] = [];
  const seamConfigs = [
    { rotation: new THREE.Euler(0.12, 0.64, 0.18), amplitude: 0.18 },
    { rotation: new THREE.Euler(-0.18, -0.7, 1.08), amplitude: 0.16 },
    { rotation: new THREE.Euler(0.36, 1.44, -0.54), amplitude: 0.14 }
  ];
  const seamMeshes = seamConfigs.map((config) => {
    const points: import("three").Vector3[] = [];

    for (let index = 0; index <= 120; index += 1) {
      const t = index / 120;
      const angle = t * Math.PI * 2;
      const point = new THREE.Vector3(
        Math.cos(angle),
        Math.sin(angle) * 0.82,
        Math.sin(angle * 2.1) * config.amplitude
      )
        .normalize()
        .multiplyScalar(1.01);

      point.applyEuler(config.rotation);
      points.push(point);
    }

    const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
    const geometry = new THREE.TubeGeometry(curve, isMobile ? 120 : 168, isMobile ? 0.012 : 0.014, 10, true);
    const mesh = new THREE.Mesh(geometry, seamMaterial);
    seamGeometries.push(geometry);

    return mesh;
  });

  return {
    seamMeshes,
    seamMaterial,
    seamGeometries
  };
}

function drawWrappedPanelBand(
  context: CanvasRenderingContext2D,
  size: number,
  center: number,
  topWidth: number,
  bottomWidth: number,
  bend: number,
  color: string
) {
  [-size, 0, size].forEach((offset) => {
    const centerX = center * size + offset;
    const top = -size * 0.08;
    const bottom = size * 1.08;
    const topHalf = topWidth * size * 0.5;
    const bottomHalf = bottomWidth * size * 0.5;
    const bendOffset = bend * size;

    context.save();
    context.beginPath();
    context.moveTo(centerX - topHalf, top);
    context.bezierCurveTo(
      centerX + bendOffset * 0.15 - topHalf * 1.08,
      size * 0.24,
      centerX - bendOffset * 0.35 - bottomHalf * 0.9,
      size * 0.64,
      centerX - bottomHalf,
      bottom
    );
    context.lineTo(centerX + bottomHalf, bottom);
    context.bezierCurveTo(
      centerX - bendOffset * 0.15 + bottomHalf * 0.92,
      size * 0.68,
      centerX + bendOffset * 0.34 + topHalf * 1.04,
      size * 0.26,
      centerX + topHalf,
      top
    );
    context.closePath();

    const gradient = context.createLinearGradient(centerX - topHalf, 0, centerX + topHalf, size);

    if (color.startsWith("rgb")) {
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color);
    } else {
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.55, lightenHex(color, 0.12));
      gradient.addColorStop(1, darkenHex(color, 0.08));
    }

    context.fillStyle = gradient;
    context.fill();
    context.restore();
  });
}

function drawWrappedPanelSeams(
  context: CanvasRenderingContext2D,
  size: number,
  center: number,
  topWidth: number,
  bottomWidth: number,
  bend: number,
  strokeStyle: string,
  lineWidth: number
) {
  [-size, 0, size].forEach((offset) => {
    const centerX = center * size + offset;
    const top = -size * 0.08;
    const bottom = size * 1.08;
    const topHalf = topWidth * size * 0.5;
    const bottomHalf = bottomWidth * size * 0.5;
    const bendOffset = bend * size;

    context.save();
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(centerX - topHalf, top);
    context.bezierCurveTo(
      centerX + bendOffset * 0.15 - topHalf * 1.08,
      size * 0.24,
      centerX - bendOffset * 0.35 - bottomHalf * 0.9,
      size * 0.64,
      centerX - bottomHalf,
      bottom
    );
    context.stroke();

    context.beginPath();
    context.moveTo(centerX + topHalf, top);
    context.bezierCurveTo(
      centerX + bendOffset * 0.34 + topHalf * 1.04,
      size * 0.26,
      centerX - bendOffset * 0.15 + bottomHalf * 0.92,
      size * 0.68,
      centerX + bottomHalf,
      bottom
    );
    context.stroke();
    context.restore();
  });
}

function addFabricNoise(
  context: CanvasRenderingContext2D,
  size: number,
  count: number,
  range: number,
  mode: "color" | "bump" | "roughness"
) {
  for (let index = 0; index < count; index += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const sizeFactor = mode === "color" ? 1 : 1.15;
    const width = 0.7 + Math.random() * sizeFactor;
    const height = 0.7 + Math.random() * sizeFactor;

    if (mode === "color") {
      const alpha = 0.02 + Math.random() * 0.035;
      const tint = 214 + Math.floor(Math.random() * range);
      context.fillStyle = `rgba(${tint}, ${tint - 6}, ${tint - 10}, ${alpha})`;
    } else if (mode === "bump") {
      const value = 122 + Math.floor(Math.random() * range);
      context.fillStyle = `rgb(${value}, ${value}, ${value})`;
    } else {
      const value = 170 + Math.floor(Math.random() * range);
      context.fillStyle = `rgb(${value}, ${value}, ${value})`;
    }

    context.fillRect(x, y, width, height);
  }
}

function lightenHex(color: string, amount: number) {
  return mixHex(color, "#ffffff", amount);
}

function darkenHex(color: string, amount: number) {
  return mixHex(color, "#000000", amount);
}

function mixHex(color: string, target: string, amount: number) {
  const [red, green, blue] = hexToRgb(color);
  const [targetRed, targetGreen, targetBlue] = hexToRgb(target);
  const ratio = clamp(amount, 0, 1);

  return `rgb(${Math.round(lerp(red, targetRed, ratio))}, ${Math.round(lerp(green, targetGreen, ratio))}, ${Math.round(lerp(blue, targetBlue, ratio))})`;
}

function hexToRgb(color: string) {
  const normalized = color.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((part) => part + part).join("") : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return [red, green, blue];
}

function handleSkip() {
  finishOpening();
}

onMounted(async () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    startReducedSequence();
    return;
  }

  if (!supportsWebGL()) {
    startFallbackSequence();
    return;
  }

  try {
    cleanupScene = await startThreeSequence();

    if (isFinished && cleanupScene) {
      cleanupScene();
      cleanupScene = null;
    }
  } catch {
    stopOpening();
    startFallbackSequence();
  }
});

onBeforeUnmount(() => {
  stopOpening();
});
</script>

<template>
  <div
    class="hero-opening"
    :class="[
      `hero-opening--${mode}`,
      { 'hero-opening--persist': props.persistAtEnd, 'hero-opening--settled': hasSettled }
    ]"
  >
    <div class="hero-opening__background">
      <div class="hero-opening__arena"></div>
      <div class="hero-opening__spotlights"></div>
      <div class="hero-opening__crowd"></div>
      <div class="hero-opening__court"></div>
      <div class="hero-opening__net"></div>
    </div>
    <div ref="canvasHost" class="hero-opening__canvas"></div>
    <div v-if="showFallbackBall" class="hero-opening__fallback-ball"></div>
    <div class="hero-opening__shockwave" :style="shockwaveStyle"></div>
    <div class="hero-opening__flash" :style="flashStyle"></div>
    <div class="hero-opening__grain"></div>

    <div class="hero-opening__brand" :style="brandStyle">
      <span class="hero-opening__kicker">POWER • SPIN • CONTROL</span>
      <strong>
        <span class="hero-opening__brand-max">{{ brandParts.lead }}</span>
        <span class="hero-opening__brand-plus">{{ brandParts.tail }}</span>
      </strong>
    </div>

    <button
      v-if="props.showSkip && !hasSettled"
      class="hero-opening__skip"
      type="button"
      @click="handleSkip"
    >
      Skip Intro
    </button>
  </div>
</template>
