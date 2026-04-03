<script setup lang="ts">
import CategorySection from "../components/CategorySection.vue";
import ContactSection from "../components/ContactSection.vue";
import FeaturedProductsSection from "../components/FeaturedProductsSection.vue";
import HeroSlider from "../components/HeroSlider.vue";
import ReviewsSection from "../components/ReviewsSection.vue";
import VideoSection from "../components/VideoSection.vue";
import { usePublicData } from "../composables/usePublicData";

const { siteContent, homeContent } = usePublicData();

const isSectionEnabled = (key: string) =>
  homeContent.value.sectionToggles.find((item) => item.key === key)?.enabled ?? true;
</script>

<template>
  <HeroSlider v-if="isSectionEnabled('hero')" :hero="siteContent.hero" />
  <VideoSection v-if="isSectionEnabled('videos')" :videos="siteContent.videos" />
  <FeaturedProductsSection v-if="isSectionEnabled('products')" :featured="siteContent.featured" />
  <CategorySection :categories="siteContent.categories" />
  <ReviewsSection v-if="isSectionEnabled('reviews')" :reviews="siteContent.reviews" />
  <ContactSection v-if="isSectionEnabled('contact')" :contact="siteContent.contact" />
</template>
