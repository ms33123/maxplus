<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
import type { VideoCategory } from "../types/catalog";

const { videoCategories, videos: tutorialVideos } = usePublicData();

const activeParentCategory = ref("all");
const activeCategory = ref("all");

const videoCategoryMap = computed(() => new Map(videoCategories.value.map((category) => [category.slug, category])));

const primaryCategoryOptions = computed(() => {
  const parentTitlesWithVideos = new Set(
    videoCategories.value
      .filter(
        (category) =>
          Boolean(category.parentTitle) &&
          tutorialVideos.value.some((video) => video.categorySlug === category.slug)
      )
      .map((category) => category.parentTitle as string)
  );

  return videoCategories.value.filter(
    (category) => !category.parentTitle && parentTitlesWithVideos.has(category.title)
  );
});

const activeParentTitle = computed(() =>
  primaryCategoryOptions.value.find((category) => category.slug === activeParentCategory.value)?.title ?? ""
);

const secondaryCategoryOptions = computed(() => {
  if (!activeParentTitle.value) {
    return [];
  }

  return videoCategories.value.filter(
    (category) =>
      category.parentTitle === activeParentTitle.value &&
      tutorialVideos.value.some((video) => video.categorySlug === category.slug)
  );
});

const filteredVideos = computed(() =>
  tutorialVideos.value.filter((video) => {
    if (activeParentCategory.value === "all") {
      return true;
    }

    const videoCategory = videoCategoryMap.value.get(video.categorySlug);

    if (!videoCategory || videoCategory.parentTitle !== activeParentTitle.value) {
      return false;
    }

    if (activeCategory.value === "all") {
      return true;
    }

    return video.categorySlug === activeCategory.value;
  })
);

const activeCategoryLabel = computed(() => {
  if (activeParentCategory.value === "all") {
    return "All Categories";
  }

  if (activeCategory.value !== "all") {
    const secondary = secondaryCategoryOptions.value.find((item) => item.slug === activeCategory.value);

    if (secondary) {
      return `${activeParentTitle.value} / ${secondary.title}`;
    }
  }

  return activeParentTitle.value || "All Categories";
});

const getCategoryLabel = (slug: string) => {
  const category = videoCategoryMap.value.get(slug);

  if (!category) {
    return "Videos";
  }

  return category.parentTitle ? `${category.parentTitle} / ${category.title}` : category.title;
};

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.12), rgba(8, 18, 31, 0.52)), url(${imageUrl})`
});

const getVideoLink = (slug: string) => `/videos/${encodeURIComponent(slug)}`;

watch(activeParentCategory, () => {
  activeCategory.value = "all";
});

usePageMeta({
  title: "Videos | MaxPlus Sporting Goods",
  description: "Browse MaxPlus tutorial videos in a grid layout and open each guide on its own playback page."
});
</script>

<template>
  <PageBanner eyebrow="Tutorials" title="Videos" />

  <section class="section video-library">
    <div class="shell">
      <div class="video-library__filters reveal" v-reveal>
        <div class="video-library__filter-group">
          <span>Category</span>
          <div class="video-library__chips">
            <button
              type="button"
              :class="['video-library__chip', { 'is-active': activeParentCategory === 'all' }]"
              @click="activeParentCategory = 'all'"
            >
              All Videos
            </button>

            <button
              v-for="item in primaryCategoryOptions"
              :key="item.slug"
              type="button"
              :class="['video-library__chip', { 'is-active': activeParentCategory === item.slug }]"
              @click="activeParentCategory = item.slug"
            >
              {{ item.title }}
            </button>
          </div>
        </div>

        <div
          v-if="activeParentCategory !== 'all' && secondaryCategoryOptions.length"
          class="video-library__filter-group"
        >
          <span>Subcategory</span>
          <div class="video-library__chips">
            <button
              type="button"
              :class="['video-library__chip', { 'is-active': activeCategory === 'all' }]"
              @click="activeCategory = 'all'"
            >
              All In {{ activeParentTitle }}
            </button>

            <button
              v-for="item in secondaryCategoryOptions"
              :key="item.slug"
              type="button"
              :class="['video-library__chip', { 'is-active': activeCategory === item.slug }]"
              @click="activeCategory = item.slug"
            >
              {{ item.title }}
            </button>
          </div>
        </div>

        <div class="video-library__meta">
          <strong>{{ filteredVideos.length }}</strong>
          <span>{{ activeCategoryLabel }}</span>
        </div>
      </div>

      <div v-if="filteredVideos.length" class="video-library__grid">
        <RouterLink
          v-for="item in filteredVideos"
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
              <span v-if="item.topicLabel" class="video-library__topic">{{ item.topicLabel }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <span class="video-card__cta-link">Watch Video</span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="catalog-empty reveal is-visible">
        <h3>No videos in this filter.</h3>
        <p>Try another video category to find the corresponding tutorial.</p>
      </div>
    </div>
  </section>
</template>
