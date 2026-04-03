<script setup lang="ts">
import { ref } from "vue";
import type { ReviewsContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

defineProps<{
  reviews: ReviewsContent;
}>();

const railRef = ref<HTMLElement | null>(null);

const scrollReviews = (direction: number) => {
  const rail = railRef.value;

  if (!rail) {
    return;
  }

  const card = rail.querySelector<HTMLElement>(".review-card");
  const step = card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * 0.9;

  rail.scrollBy({
    left: direction * step,
    behavior: "smooth"
  });
};

const getAvatarStyle = (imageUrl: string) => ({
  backgroundImage: `url(${imageUrl})`
});

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");
</script>

<template>
  <section class="section review-zone" id="reviews">
    <div class="shell">
      <div class="review-zone__header">
        <SectionHeading
          :eyebrow="reviews.eyebrow"
          :title="reviews.title"
          :text="reviews.text"
        />
      </div>

      <aside class="review-zone__summary reveal" v-reveal>
        <div class="review-zone__summary-main">
          <p class="review-zone__summary-label">{{ reviews.summary.label }}</p>
          <p v-if="reviews.summary.detail" class="review-zone__summary-text">
            {{ reviews.summary.detail }}
          </p>
        </div>

        <div class="review-zone__summary-score">
          <strong>{{ reviews.summary.value }}</strong>
        </div>

        <div class="review-zone__summary-metrics">
          <article
            v-for="metric in reviews.summary.metrics"
            :key="metric.label"
            class="review-zone__summary-metric"
          >
            <span>{{ metric.value }}</span>
            <small>{{ metric.label }}</small>
          </article>
        </div>
      </aside>

      <div class="review-zone__carousel reveal" v-reveal>
        <button
          class="review-zone__control review-zone__control--prev"
          type="button"
          aria-label="Show previous review"
          @click="scrollReviews(-1)"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div ref="railRef" class="review-grid">
          <article
            v-for="item in reviews.items"
            :key="item.id"
            :class="['review-card', { 'review-card--with-image': reviews.displayMode === 'image' }]"
          >
            <div v-if="reviews.displayMode === 'image'" class="review-card__profile">
              <div
                v-if="item.imageUrl"
                class="review-card__avatar review-card__avatar--image"
                :style="getAvatarStyle(item.imageUrl)"
              ></div>
              <div v-else class="review-card__avatar">
                {{ getInitials(item.author) || "MP" }}
              </div>

              <div class="review-card__identity">
                <strong>{{ item.author }}</strong>
                <span v-if="item.meta">{{ item.meta }}</span>
              </div>
            </div>

            <div class="review-card__stars" :aria-label="`${item.rating} out of 5 stars`">
              <span
                v-for="star in 5"
                :key="star"
                :class="{ 'is-active': star <= item.rating }"
              >
                ★
              </span>
            </div>

            <blockquote class="review-card__quote">
              “{{ item.quote }}”
            </blockquote>

            <div
              v-if="reviews.displayMode === 'text' && (item.author || item.meta)"
              class="review-card__footer"
            >
              <strong v-if="item.author">{{ item.author }}</strong>
              <span v-if="item.meta">{{ item.meta }}</span>
            </div>
          </article>
        </div>

        <button
          class="review-zone__control review-zone__control--next"
          type="button"
          aria-label="Show next review"
          @click="scrollReviews(1)"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </section>
</template>
