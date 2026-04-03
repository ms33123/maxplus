<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
import { useStructuredData } from "../composables/useStructuredData";

const route = useRoute();
const { findProductBySlug, getRelatedProducts } = usePublicData();

const product = computed(() => findProductBySlug(String(route.params.slug ?? "")));
const relatedProducts = computed(() =>
  product.value ? getRelatedProducts(product.value) : []
);
const isInternalBuyLink = computed(() => (product.value?.buyButtonUrl || "/buy").startsWith("/"));

const getMediaStyle = (imageUrl: string) => ({
  backgroundImage: `url(${imageUrl})`
});

usePageMeta(
  computed(() => ({
    title: product.value ? `${product.value.title} | MaxPlus Sporting Goods` : "Product | MaxPlus",
    description: product.value
      ? product.value.summary
      : "Review MaxPlus product details, specs, and inquiry options."
  }))
);

useStructuredData(
  computed(() => {
    if (!product.value) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.value.title,
      sku: product.value.sku,
      description: product.value.summary,
      category: product.value.categoryLabel,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: Number(product.value.price.replace("$", "")),
        availability:
          product.value.stockStatus === "In Stock"
            ? "https://schema.org/InStock"
            : "https://schema.org/LimitedAvailability"
      }
    };
  })
);
</script>

<template>
  <PageBanner
    class="page-banner--product-detail"
    :eyebrow="product?.tag ?? 'Product'"
    :title="product?.title ?? 'Product Not Found'"
  />

  <template v-if="product">
    <section class="section product-detail">
      <div class="shell product-detail__layout">
        <div class="product-detail__media reveal" v-reveal>
          <div
            v-if="product.heroImage"
            class="product-card__visual product-detail__hero product-card__visual--photo"
            :style="getMediaStyle(product.heroImage)"
          ></div>
          <div v-else :class="['product-card__visual', 'product-detail__hero', product.visualClass]"></div>

          <div v-if="product.galleryImages?.length" class="product-detail__gallery">
            <div
              v-for="item in product.galleryImages"
              :key="item"
              class="catalog-gallery__item catalog-gallery__item--photo"
              :style="getMediaStyle(item)"
            ></div>
          </div>

          <div v-else class="product-detail__gallery">
            <div
              v-for="item in product.galleryClasses"
              :key="item"
              :class="['catalog-gallery__item', item]"
            ></div>
          </div>
        </div>

        <div class="product-detail__summary reveal" v-reveal>
          <RouterLink class="product-detail__breadcrumb" :to="`/categories/${product.categorySlug}`">
            {{ product.categoryLabel }}
          </RouterLink>

          <h2 class="product-detail__title">{{ product.title }}</h2>
          <p class="product-detail__intro">{{ product.summary }}</p>

          <div class="product-detail__price">
            <strong>{{ product.price }}</strong>
            <span>{{ product.referencePrice }}</span>
          </div>

          <div class="product-detail__facts">
            <article class="product-detail__fact">
              <small>SKU</small>
              <strong>{{ product.sku }}</strong>
            </article>
            <article class="product-detail__fact">
              <small>Status</small>
              <strong>{{ product.stockStatus }}</strong>
            </article>
            <article class="product-detail__fact">
              <small>MOQ</small>
              <strong>{{ product.orderMinimum }}</strong>
            </article>
            <article class="product-detail__fact">
              <small>Lead Time</small>
              <strong>{{ product.leadTime }}</strong>
            </article>
          </div>

          <div class="product-detail__actions">
            <RouterLink
              v-if="isInternalBuyLink"
              class="button button--primary"
              :to="product.buyButtonUrl || '/buy'"
            >
              {{ product.buyButtonLabel || "Go To Buy" }}
            </RouterLink>
            <a
              v-else
              class="button button--primary"
              :href="product.buyButtonUrl || '/buy'"
              target="_blank"
              rel="noreferrer"
            >
              {{ product.buyButtonLabel || "Go To Buy" }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section product-detail__description">
      <div class="shell">
        <article class="detail-card product-detail__description-card reveal" v-reveal>
          <p class="eyebrow">Product Details</p>
          <p>{{ product.description }}</p>
        </article>
      </div>
    </section>

    <section v-if="relatedProducts.length" class="section catalog-zone">
      <div class="shell">
        <div class="section-heading reveal" v-reveal>
          <p class="eyebrow">Related Products</p>
          <h2>More products in the same buying conversation.</h2>
        </div>

        <CatalogProductGrid :products="relatedProducts" />
      </div>
    </section>
  </template>

  <section v-else class="section">
    <div class="shell">
      <div class="catalog-empty reveal is-visible">
        <h3>This product is not available.</h3>
        <p>Open the products page to browse the current catalog.</p>
      </div>
    </div>
  </section>
</template>
