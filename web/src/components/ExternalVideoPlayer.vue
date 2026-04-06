<script setup lang="ts">
import { computed } from "vue";
import { resolveVideoSource } from "../utils/video";

const props = withDefaults(
  defineProps<{
    url: string;
    title: string;
    poster?: string;
    autoplay?: boolean;
  }>(),
  {
    poster: "",
    autoplay: false
  }
);

const source = computed(() => resolveVideoSource(props.url, props.autoplay));
const frameTitle = computed(() => `${props.title || "Video"} player`);
const playerKey = computed(() => `${source.value.kind}:${source.value.src}`);
</script>

<template>
  <div class="external-video-player">
    <iframe
      v-if="source.kind === 'iframe'"
      :key="playerKey"
      class="external-video-player__frame"
      :src="source.src"
      :title="frameTitle"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>

    <video
      v-else-if="source.kind === 'file'"
      :key="playerKey"
      class="external-video-player__frame"
      :poster="poster || undefined"
      controls
      playsinline
      preload="metadata"
    >
      <source :src="source.src" />
    </video>

    <div v-else class="external-video-player__empty">
      <strong>Video Link Needed</strong>
      <p>Add a valid external video URL in the admin panel to enable playback.</p>
    </div>
  </div>
</template>

<style scoped>
.external-video-player {
  width: 100%;
}

.external-video-player__frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(16, 33, 58, 0.08), rgba(16, 33, 58, 0.02));
}

.external-video-player__empty {
  display: grid;
  gap: 0.45rem;
  place-items: center;
  min-height: 280px;
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px dashed rgba(16, 33, 58, 0.16);
  background: rgba(255, 255, 255, 0.68);
  text-align: center;
}

.external-video-player__empty strong {
  color: #10213a;
  font-size: 1rem;
}

.external-video-player__empty p {
  margin: 0;
  color: #627086;
}
</style>
