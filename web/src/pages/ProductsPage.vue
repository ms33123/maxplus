<script setup lang="ts">
import { computed, ref } from "vue";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";

const activeCategory = ref("all");
const sortKey = ref("featured");
const { categories: catalogCategories, products: catalogProducts } = usePublicData();

const visibleProducts = computed(() => {
  const base = catalogProducts.value.filter((item) => {
    if (activeCategory.value === "all") {
      return true;
    }

    return item.categorySlug === activeCategory.value;
  });

  const sorted = [...base];

  switch (sortKey.value) {
    case "price-asc":
      sorted.sort((a, b) => Number(a.price.replace("$", "")) - Number(b.price.replace("$", "")));
      break;
    case "price-desc":
      sorted.sort((a, b) => Number(b.price.replace("$", "")) - Number(a.price.replace("$", "")));
      break;
    case "latest":
      sorted.reverse();
      break;
    default:
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      break;
  }

  return sorted;
});

usePageMeta({
  title: "Products | MaxPlus Sporting Goods",
  description: "Browse the MaxPlus product catalog across team sports, training gear, outdoor play, and recovery."
});
</script>

<template>
  <PageBanner eyebrow="Catalog" title="Products" />

  <section class="section catalog-zone products-page">
    <div class="shell">
      <div class="catalog-toolbar reveal" v-reveal>
        <div class="catalog-toolbar__group">
          <span>Category</span>
          <select v-model="activeCategory">
            <option value="all">All Products</option>
            <option
              v-for="category in catalogCategories"
              :key="category.slug"
              :value="category.slug"
            >
              {{ category.title }}
            </option>
          </select>
        </div>

        <div class="catalog-toolbar__group">
          <span>Sort</span>
          <select v-model="sortKey">
            <option value="featured">Featured</option>
            <option value="latest">Latest</option>
            <option value="price-asc">Price Low To High</option>
            <option value="price-desc">Price High To Low</option>
          </select>
        </div>

        <RouterLink class="button button--ghost catalog-toolbar__search" to="/search">
          Search Catalog
        </RouterLink>
      </div>

      <div class="category-strip">
        <RouterLink
          v-for="category in catalogCategories"
          :key="category.slug"
          :to="`/categories/${category.slug}`"
          class="category-strip__card reveal"
          v-reveal
        >
          <strong>{{ category.title }}</strong>
          <span>{{ category.summary }}</span>
        </RouterLink>
      </div>

      <CatalogProductGrid :products="visibleProducts" variant="compact" />
    </div>
  </section>
</template>
