<script setup lang="ts">
import { computed } from "vue";
import CategorySection from "../components/CategorySection.vue";
import ContactSection from "../components/ContactSection.vue";
import FeaturedProductsSection from "../components/FeaturedProductsSection.vue";
import HeroSlider from "../components/HeroSlider.vue";
import ReviewsSection from "../components/ReviewsSection.vue";
import VideoSection from "../components/VideoSection.vue";
import { usePublicData } from "../composables/usePublicData";

const { siteContent, homeContent } = usePublicData();
const isChristmasTheme = computed(() => siteContent.value.theme.preset === "christmas");

const isSectionEnabled = (key: string) =>
  homeContent.value.sectionToggles.find((item) => item.key === key)?.enabled ?? true;
</script>

<template>
  <main class="home-page">
    <HeroSlider
      v-if="isSectionEnabled('hero')"
      :hero="siteContent.hero"
      :holiday-mode="isChristmasTheme"
    />
    <VideoSection v-if="isSectionEnabled('videos')" :videos="siteContent.videos" />
    <FeaturedProductsSection
      v-if="isSectionEnabled('products')"
      :featured="siteContent.featured"
      :holiday-mode="isChristmasTheme"
    />
    <CategorySection v-if="isSectionEnabled('categories')" :categories="siteContent.categories" />
    <ReviewsSection v-if="isSectionEnabled('reviews')" :reviews="siteContent.reviews" />
    <ContactSection v-if="isSectionEnabled('contact')" :contact="siteContent.contact" />
  </main>
</template>
