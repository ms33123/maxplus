<script setup lang="ts">
import type { FeaturedContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

defineProps<{
  featured: FeaturedContent;
}>();

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `url(${imageUrl})`
});
</script>

<template>
  <section class="section featured-products" id="products">
    <div class="shell">
      <div class="featured-products__header">
        <SectionHeading
          :eyebrow="featured.eyebrow"
          :title="featured.title"
          :text="featured.text"
        />

        <RouterLink class="button featured-products__more" to="/products">More Products</RouterLink>
      </div>

      <div class="product-grid">
        <article
          v-for="item in featured.items"
          :key="item.title"
          class="product-card reveal"
          v-reveal
        >
          <div
            v-if="item.imageUrl"
            class="product-card__visual product-card__visual--photo"
            :style="getMediaStyle(item.imageUrl)"
          ></div>
          <div v-else :class="['product-card__visual', item.visualClass]"></div>

          <div class="product-card__content">
            <span class="product-card__tag">{{ item.tag }}</span>
            <h3 class="product-card__title">{{ item.title }}</h3>
            <p>{{ item.text }}</p>

            <div class="product-card__meta">
              <strong>{{ item.price }}</strong>
              <RouterLink :to="item.href">{{ featured.detailsLabel }}</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
