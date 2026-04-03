<script setup lang="ts">
import type { CatalogProduct } from "../types/catalog";

withDefaults(
  defineProps<{
    products: CatalogProduct[];
    emptyTitle?: string;
    emptyText?: string;
  }>(),
  {
    emptyTitle: "No products match this filter.",
    emptyText: "Try another combination."
  }
);

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `url(${imageUrl})`
});
</script>

<template>
  <div v-if="products.length" class="catalog-grid">
    <article
      v-for="item in products"
      :key="item.slug"
      class="catalog-card reveal"
      v-reveal
    >
      <div
        v-if="item.heroImage"
        class="product-card__visual product-card__visual--photo"
        :style="getMediaStyle(item.heroImage)"
      ></div>
      <div v-else :class="['product-card__visual', item.visualClass]"></div>

      <div class="catalog-card__body">
        <div class="catalog-card__topline">
          <span class="product-card__tag">{{ item.tag }}</span>
          <span class="catalog-card__stock">{{ item.stockStatus }}</span>
        </div>

        <h3 class="catalog-card__title">{{ item.title }}</h3>
        <p>{{ item.summary }}</p>

        <div class="catalog-card__chips">
          <span>{{ item.sportType }}</span>
          <span>{{ item.audience }}</span>
          <span>{{ item.useCase }}</span>
        </div>

        <div class="catalog-card__footer">
          <div>
            <strong>{{ item.price }}</strong>
            <small>{{ item.referencePrice }}</small>
          </div>

          <RouterLink :to="`/products/${item.slug}`" class="catalog-card__link">
            View Details
          </RouterLink>
        </div>
      </div>
    </article>
  </div>

  <div v-else class="catalog-empty reveal is-visible">
    <h3>{{ emptyTitle }}</h3>
    <p>{{ emptyText }}</p>
  </div>
</template>
