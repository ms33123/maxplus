<script setup lang="ts">
import type { VideoContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

defineProps<{
  videos: VideoContent;
}>();

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.12), rgba(8, 18, 31, 0.52)), url(${imageUrl})`
});
</script>

<template>
  <section class="section video-showcase" id="videos">
    <div class="shell">
      <div class="video-showcase__header">
        <SectionHeading
          :eyebrow="videos.eyebrow"
          :title="videos.title"
          :text="videos.text"
        >
          <template #action>
            <RouterLink class="button video-showcase__more" to="/videos">
              {{ videos.moreLabel }}
            </RouterLink>
          </template>
        </SectionHeading>
      </div>

      <div class="video-showcase__layout video-showcase__layout--single">
        <RouterLink
          :to="videos.featured.href"
          class="video-feature reveal"
          v-reveal
        >
          <div
            v-if="videos.featured.coverImage"
            class="video-feature__media video-feature__media--photo"
            :style="getMediaStyle(videos.featured.coverImage)"
          >
            <span class="video-feature__eyebrow">{{ videos.featured.eyebrow }}</span>
            <span class="video-feature__play" aria-hidden="true">▶</span>
            <span class="video-feature__duration">{{ videos.featured.duration }}</span>
          </div>
          <div v-else :class="['video-feature__media', videos.featured.visualClass]">
            <span class="video-feature__eyebrow">{{ videos.featured.eyebrow }}</span>
            <span class="video-feature__play" aria-hidden="true">▶</span>
            <span class="video-feature__duration">{{ videos.featured.duration }}</span>
          </div>

          <div class="video-feature__body">
            <h3>{{ videos.featured.title }}</h3>
            <span class="video-feature__cta">{{ videos.featured.ctaLabel }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
