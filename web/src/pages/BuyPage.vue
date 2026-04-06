<script setup lang="ts">
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import InquiryForm from "../components/InquiryForm.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
const { products: catalogProducts } = usePublicData();

const buyPoints = [
  "Bulk inquiry routing for clubs, schools, and retailers.",
  "Fast access to featured catalog lines with clear detail pages.",
  "Structured path from product discovery to quote request."
];

usePageMeta({
  title: "Go To Buy | MaxPlus Sporting Goods",
  description: "Start a MaxPlus wholesale inquiry and review the catalog products best suited for bulk buying."
});
</script>

<template>
  <PageBanner eyebrow="Wholesale Entry" title="Go To Buy" />

  <section class="section buy-zone">
    <div class="shell buy-layout">
      <div class="buy-card reveal" v-reveal>
        <p class="eyebrow">Why This Page</p>
        <h3>Built for direct buying traffic.</h3>
        <ul class="buy-card__list">
          <li v-for="point in buyPoints" :key="point">{{ point }}</li>
        </ul>
      </div>

      <InquiryForm
        eyebrow="Wholesale Quote"
        title="Request a wholesale quote"
        submit-label="Request Quote"
        demo-status="Demo mode only. The wholesale form is styled and ready for later integration."
        source="wholesale"
        source-label="Lead Source"
        source-value="Go To Buy"
        message-placeholder="Tell us which products, quantities, and timeline you want to quote."
      />
    </div>
  </section>

  <section class="section catalog-zone buy-picks-zone">
    <div class="shell">
      <div class="section-heading reveal" v-reveal>
        <p class="eyebrow">Buyer Picks</p>
        <h2>Start from the products most often used as lead-entry items.</h2>
      </div>

      <CatalogProductGrid :products="catalogProducts.filter((item) => item.featured)" variant="compact" />
    </div>
  </section>
</template>
