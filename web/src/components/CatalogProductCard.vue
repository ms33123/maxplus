<script setup lang="ts">
import { computed } from "vue";
import { buildProductRoute } from "../composables/publicData/utils";
import type { CatalogProduct } from "../types/catalog";

const props = withDefaults(
  defineProps<{
    product: CatalogProduct;
    variant?: "default" | "compact";
    detailsLabel?: string;
    holidayBadge?: string;
  }>(),
  {
    variant: "default",
    detailsLabel: "View Details"
  }
);

const cardClass = computed(() => [
  "catalog-card",
  {
    "catalog-card--compact": props.variant === "compact"
  }
]);

const bodyClass = computed(() => [
  "catalog-card__body",
  {
    "catalog-card__body--compact": props.variant === "compact"
  }
]);

const titleClass = computed(() => [
  "catalog-card__title",
  {
    "catalog-card__title--compact": props.variant === "compact"
  }
]);

const chipsClass = computed(() => [
  "catalog-card__chips",
  {
    "catalog-card__chips--compact": props.variant === "compact"
  }
]);

const footerClass = computed(() => [
  "catalog-card__footer",
  {
    "catalog-card__footer--compact": props.variant === "compact"
  }
]);

const mediaClass = computed(() => [
  "product-card__visual",
  {
    "product-card__visual--compact": props.variant === "compact"
  }
]);

const mediaPhotoClass = computed(() => [
  "product-card__visual",
  "product-card__visual--photo",
  {
    "product-card__visual--compact": props.variant === "compact",
    "product-card__visual--photo-compact": props.variant === "compact"
  }
]);

const stockClass = computed(() => [
  "catalog-card__stock",
  {
    "catalog-card__stock--compact": props.variant === "compact"
  }
]);

const chipItemClass = computed(() => [
  {
    "catalog-card__chip-item--compact": props.variant === "compact"
  }
]);

const summaryClass = computed(() => [
  {
    "catalog-card__summary--compact": props.variant === "compact"
  }
]);

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `url(${imageUrl})`
});

const chipItems = computed(() =>
  [props.product.sportType, props.product.audience, props.product.useCase].filter((item) => item?.trim())
);

const productRoute = computed(() => buildProductRoute(props.product.slug));
</script>

<template>
  <article :class="cardClass" class="reveal" v-reveal>
    <RouterLink :to="productRoute" class="catalog-card__surface">
      <div
        v-if="product.heroImage"
        :class="mediaPhotoClass"
        :style="getMediaStyle(product.heroImage)"
      ></div>
      <div v-else :class="[mediaClass, product.visualClass]"></div>

      <div :class="bodyClass">
        <div class="catalog-card__topline">
          <div class="catalog-card__labels">
            <span v-if="holidayBadge" class="catalog-card__holiday-badge">{{ holidayBadge }}</span>
            <span v-if="product.tag" class="product-card__tag">{{ product.tag }}</span>
          </div>
          <span :class="stockClass">{{ product.stockStatus }}</span>
        </div>

        <h3 :class="titleClass">{{ product.title }}</h3>
        <p :class="summaryClass">{{ product.summary }}</p>

        <div v-if="chipItems.length" :class="chipsClass">
          <span v-for="item in chipItems" :key="item" :class="chipItemClass">{{ item }}</span>
        </div>

        <div :class="footerClass">
          <div>
            <strong>{{ product.price }}</strong>
            <small>{{ product.referencePrice }}</small>
          </div>

          <span class="catalog-card__link">{{ detailsLabel }}</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
