<script setup lang="ts">
import CatalogProductCard from "./CatalogProductCard.vue";
import type { CatalogProduct } from "../types/catalog";

withDefaults(
  defineProps<{
    products: CatalogProduct[];
    variant?: "default" | "compact";
    detailsLabel?: string;
    holidayBadge?: string;
    emptyTitle?: string;
    emptyText?: string;
  }>(),
  {
    variant: "default",
    detailsLabel: "View Details",
    emptyTitle: "No products match this filter.",
    emptyText: "Try another combination."
  }
);
</script>

<template>
  <div
    v-if="products.length"
    :class="[
      'catalog-grid',
      {
        'catalog-grid--compact': variant === 'compact'
      }
    ]"
  >
    <CatalogProductCard
      v-for="item in products"
      :key="item.slug"
      :product="item"
      :variant="variant"
      :details-label="detailsLabel"
      :holiday-badge="holidayBadge"
    />
  </div>

  <div v-else class="catalog-empty reveal is-visible">
    <h3>{{ emptyTitle }}</h3>
    <p>{{ emptyText }}</p>
  </div>
</template>
