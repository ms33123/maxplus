<script setup lang="ts">
import { computed } from "vue";
import type { CategoriesContent } from "../types/content";

const props = defineProps<{
  categories: CategoriesContent;
}>();

const visibleItems = computed(() => props.categories.items.slice(0, 4));
</script>

<template>
  <section class="section category-zone" id="categories">
    <div class="shell category-layout">
      <div class="category-copy reveal" v-reveal>
        <div class="category-copy__header">
          <p class="eyebrow">{{ categories.eyebrow }}</p>
          <div class="category-copy__title-row">
            <h2>{{ categories.title }}</h2>
            <RouterLink class="button category-copy__more" to="/products">
              {{ categories.moreLabel }}
            </RouterLink>
          </div>

          <p v-if="categories.text">{{ categories.text }}</p>
        </div>
      </div>

      <div class="category-grid">
        <RouterLink
          v-for="item in visibleItems"
          :key="item.title"
          :to="item.href"
          class="category-card reveal"
          v-reveal
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
