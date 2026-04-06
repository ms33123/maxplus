<script setup lang="ts">
import { computed } from "vue";
import CatalogProductGrid from "./CatalogProductGrid.vue";
import type { FeaturedContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

const props = defineProps<{
  featured: FeaturedContent;
  holidayMode?: boolean;
}>();

const holidayBadge = computed(() => (props.holidayMode ? "Christmas Pick" : undefined));
</script>

<template>
  <section :class="['section', 'featured-products', { 'featured-products--christmas': holidayMode }]" id="products">
    <div class="shell">
      <div class="featured-products__header">
        <SectionHeading
          :eyebrow="featured.eyebrow"
          :title="featured.title"
          :text="featured.text"
        >
          <template #action>
            <RouterLink class="button featured-products__more" to="/products">
              {{ featured.moreLabel }}
            </RouterLink>
          </template>
        </SectionHeading>
      </div>

      <CatalogProductGrid
        :products="featured.items"
        variant="compact"
        :details-label="featured.detailsLabel"
        :holiday-badge="holidayBadge"
      />
    </div>
  </section>
</template>
