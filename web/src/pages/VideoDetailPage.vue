<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ExternalVideoPlayer from "../components/ExternalVideoPlayer.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePageMeta } from "../composables/usePageMeta";
import { usePublicData } from "../composables/usePublicData";
import { useStructuredData } from "../composables/useStructuredData";

const route = useRoute();
const { findVideoCategoryBySlug, findVideoBySlug, getRelatedVideos } = usePublicData();

const video = computed(() => findVideoBySlug(String(route.params.slug ?? "")));
const relatedVideos = computed(() =>
  video.value ? getRelatedVideos(video.value) : []
);

const getCategoryLabel = (slug: string) =>
  findVideoCategoryBySlug(slug)?.title ?? "Videos";

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.12), rgba(8, 18, 31, 0.52)), url(${imageUrl})`
});

const getVideoLink = (slug: string) => `/videos/${encodeURIComponent(slug)}`;

usePageMeta(
  computed(() => ({
    title: video.value ? `${video.value.title} | MaxPlus Videos` : "Video | MaxPlus Sporting Goods",
    description: video.value?.summary || "Watch tutorial videos from MaxPlus Sporting Goods."
  }))
);

useStructuredData(
  computed(() => {
    if (!video.value) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.value.title,
      description: video.value.summary,
      thumbnailUrl: video.value.coverImage || undefined,
      embedUrl: video.value.videoUrl || undefined
    };
  })
);
</script>

<template>
  <PageBanner
    class="page-banner--video-detail"
    eyebrow="Tutorials"
    :title="video?.title ?? 'Video Not Found'"
  />

  <template v-if="video">
    <section class="section video-detail">
      <div class="shell video-detail__layout">
        <article class="video-detail__panel reveal" v-reveal>
          <div class="video-detail__media">
            <ExternalVideoPlayer
              :url="video.videoUrl"
              :title="video.title"
              :poster="video.coverImage"
              autoplay
            />
          </div>

          <div class="video-detail__body">
            <div>
              <RouterLink class="video-detail__breadcrumb" to="/videos">
                Back to Videos
              </RouterLink>

              <div class="video-library__labels">
                <span class="video-card__tag">{{ getCategoryLabel(video.categorySlug) }}</span>
                <span class="video-library__topic">{{ video.topicLabel }}</span>
                <span class="video-library__topic">{{ video.duration }}</span>
              </div>

              <h2 class="video-detail__title">{{ video.title }}</h2>
              <p class="video-detail__summary">{{ video.summary }}</p>
            </div>

          </div>
        </article>
      </div>
    </section>

    <section v-if="relatedVideos.length" class="section video-detail__related">
      <div class="shell">
        <div class="section-heading reveal" v-reveal>
          <p class="eyebrow">More Videos</p>
        </div>

        <div class="video-library__grid">
          <RouterLink
            v-for="item in relatedVideos"
            :key="item.slug"
            :to="getVideoLink(item.slug)"
            class="video-card reveal"
            v-reveal
          >
            <div
              v-if="item.coverImage"
              class="video-card__media video-card__media--photo"
              :style="getMediaStyle(item.coverImage)"
            >
              <span class="video-card__play" aria-hidden="true">▶</span>
              <span class="video-card__duration">{{ item.duration }}</span>
            </div>
            <div v-else :class="['video-card__media', item.visualClass]">
              <span class="video-card__play" aria-hidden="true">▶</span>
              <span class="video-card__duration">{{ item.duration }}</span>
            </div>

            <div class="video-card__body">
              <div class="video-library__labels">
                <p class="video-card__tag">{{ getCategoryLabel(item.categorySlug) }}</p>
                <span class="video-library__topic">{{ item.topicLabel }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
              <span class="video-card__cta-link">Watch Video</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </template>

  <section v-else class="section">
    <div class="shell">
      <div class="catalog-empty reveal is-visible">
        <h3>This video is not available.</h3>
        <p>Open the videos page to browse the current tutorial library.</p>
      </div>
    </div>
  </section>
</template>
