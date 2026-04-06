<script setup lang="ts">
import { computed } from "vue";
import HeroOpeningScene from "../components/HeroOpeningScene.vue";
import HighlightsSection from "../components/HighlightsSection.vue";
import { usePageMeta } from "../composables/usePageMeta";
import { usePublicData } from "../composables/usePublicData";

const { brandStory, categories: catalogCategories } = usePublicData();

usePageMeta(
  computed(() => ({
    title: brandStory.value.metaTitle,
    description: brandStory.value.metaDescription
  }))
);
</script>

<template>
  <main class="brand-story-page">
    <section class="section brand-story-opening">
      <div class="shell">
        <div class="brand-story-opening__frame">
          <HeroOpeningScene class="brand-story-opening__scene" :persist-at-end="true" :show-skip="false" />
        </div>

        <div class="brand-story-opening__intro reveal" v-reveal>
          <p class="eyebrow">{{ brandStory.heroEyebrow }}</p>
          <h1>{{ brandStory.heroTitle }}</h1>
          <p>{{ brandStory.heroText }}</p>
        </div>
      </div>
    </section>

    <section class="section story-zone">
      <div class="shell story-layout">
        <div class="story-copy reveal" v-reveal>
          <p v-for="paragraph in brandStory.storyParagraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div class="story-stats">
          <article
            v-for="item in brandStory.stats"
            :key="item.id"
            class="story-stat reveal"
            v-reveal
          >
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <HighlightsSection :highlights="brandStory.highlights" />

    <section class="section category-overview">
      <div class="shell">
        <div class="section-heading reveal" v-reveal>
          <p class="eyebrow">{{ brandStory.categoryEyebrow }}</p>
          <h2>{{ brandStory.categoryTitle }}</h2>
          <p v-if="brandStory.categoryText">{{ brandStory.categoryText }}</p>
        </div>

        <div class="category-overview__grid">
          <RouterLink
            v-for="category in catalogCategories"
            :key="category.slug"
            :to="`/categories/${category.slug}`"
            class="category-overview__card reveal"
            v-reveal
          >
            <p class="eyebrow">{{ category.eyebrow }}</p>
            <h3>{{ category.title }}</h3>
            <p>{{ category.summary }}</p>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
