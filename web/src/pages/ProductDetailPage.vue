<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
import { useStructuredData } from "../composables/useStructuredData";
import type { CatalogProduct } from "../types/catalog";

type ProductMediaItem = {
  key: string;
  kind: "image" | "visual";
  value: string;
  label: string;
};

const route = useRoute();
const { findProductBySlug, getRelatedProducts, loadPublicData, loading } = usePublicData();

const normalizeRouteSlug = (value: unknown) => {
  const source = Array.isArray(value) ? value[0] : value;

  if (typeof source !== "string") {
    return "";
  }

  try {
    return decodeURIComponent(source);
  } catch {
    return source;
  }
};

const routeSlug = computed(() => normalizeRouteSlug(route.params.slug));
const product = computed(() => findProductBySlug(routeSlug.value));
const relatedProducts = computed(() =>
  product.value ? getRelatedProducts(product.value) : []
);
const bannerEyebrow = computed(() => product.value?.tag?.trim() || "");
const productSummary = computed(() => product.value?.summary?.trim() || "");
const productReferencePrice = computed(() => {
  const value = product.value?.referencePrice?.trim() || "";

  if (!value || value === "$0 MSRP" || value === "$0.00 MSRP") {
    return "";
  }

  return value;
});
const productCategoryLabel = computed(() => product.value?.categoryLabel?.trim() || "");
const productCategorySlug = computed(() => product.value?.categorySlug?.trim() || "");
const hasCategoryLink = computed(() => Boolean(productCategoryLabel.value && productCategorySlug.value));
const isInternalBuyLink = computed(() => (product.value?.buyButtonUrl || "/buy").startsWith("/"));

const getMediaStyle = (imageUrl: string) => ({
  backgroundImage: `url(${imageUrl})`
});

const buildMediaItems = (currentProduct: CatalogProduct | undefined): ProductMediaItem[] => {
  if (!currentProduct) {
    return [];
  }

  const seen = new Set<string>();
  const imageItems = [currentProduct.heroImage, ...(currentProduct.galleryImages ?? [])]
    .filter((item): item is string => Boolean(item))
    .filter((item) => {
      if (seen.has(item)) {
        return false;
      }

      seen.add(item);
      return true;
    })
    .map((item, index) => ({
      key: `image-${index}`,
      kind: "image" as const,
      value: item,
      label: `${currentProduct.title} image ${index + 1}`
    }));

  if (imageItems.length) {
    return imageItems;
  }

  seen.clear();

  return [currentProduct.visualClass, ...(currentProduct.galleryClasses ?? [])]
    .filter(Boolean)
    .filter((item) => {
      if (seen.has(item)) {
        return false;
      }

      seen.add(item);
      return true;
    })
    .map((item, index) => ({
      key: `visual-${index}`,
      kind: "visual" as const,
      value: item,
      label: `${currentProduct.title} preview ${index + 1}`
    }));
};

const mediaItems = computed(() => buildMediaItems(product.value));
const activeMediaKey = ref("");
const thumbnailStartIndex = ref(0);
const heroRef = ref<HTMLElement | null>(null);
const isZoomVisible = ref(false);
const zoomX = ref(50);
const zoomY = ref(50);
const zoomLeft = ref(0);
const zoomTop = ref(0);
const thumbnailWindowSize = 4;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const activeMedia = computed(
  () => mediaItems.value.find((item) => item.key === activeMediaKey.value) ?? mediaItems.value[0] ?? null
);
const activeMediaIndex = computed(() =>
  mediaItems.value.findIndex((item) => item.key === activeMediaKey.value)
);
const visibleMediaItems = computed(() => {
  if (mediaItems.value.length <= thumbnailWindowSize) {
    return mediaItems.value;
  }

  return mediaItems.value.slice(
    thumbnailStartIndex.value,
    thumbnailStartIndex.value + thumbnailWindowSize
  );
});
const canScrollPreviousMedia = computed(() => thumbnailStartIndex.value > 0);
const canScrollNextMedia = computed(
  () => thumbnailStartIndex.value + thumbnailWindowSize < mediaItems.value.length
);
const zoomFrameSize = 132;

const hideZoom = () => {
  isZoomVisible.value = false;
};

watch(
  routeSlug,
  (slug) => {
    if (!slug || product.value || loading.value) {
      return;
    }

    void loadPublicData();
  },
  { immediate: true }
);

watch(
  mediaItems,
  (items) => {
    if (!items.length) {
      activeMediaKey.value = "";
      thumbnailStartIndex.value = 0;
      hideZoom();
      return;
    }

    if (!items.some((item) => item.key === activeMediaKey.value)) {
      activeMediaKey.value = items[0].key;
    }

    const maxStartIndex = Math.max(0, items.length - thumbnailWindowSize);
    thumbnailStartIndex.value = clamp(thumbnailStartIndex.value, 0, maxStartIndex);
    hideZoom();
  },
  { immediate: true }
);

watch(activeMediaIndex, (index) => {
  if (index < 0) {
    return;
  }

  if (index < thumbnailStartIndex.value) {
    thumbnailStartIndex.value = index;
    return;
  }

  if (index >= thumbnailStartIndex.value + thumbnailWindowSize) {
    thumbnailStartIndex.value = index - thumbnailWindowSize + 1;
  }
});

const supportsHoverZoom = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const selectMedia = (key: string) => {
  activeMediaKey.value = key;
  hideZoom();
};

const scrollThumbnailWindow = (step: number) => {
  const maxStartIndex = Math.max(0, mediaItems.value.length - thumbnailWindowSize);
  const nextStartIndex = clamp(thumbnailStartIndex.value + step, 0, maxStartIndex);

  if (nextStartIndex === thumbnailStartIndex.value) {
    return;
  }

  thumbnailStartIndex.value = nextStartIndex;
};

const handleHeroMouseMove = (event: MouseEvent) => {
  if (!heroRef.value || activeMedia.value?.kind !== "image" || !supportsHoverZoom()) {
    hideZoom();
    return;
  }

  const rect = heroRef.value.getBoundingClientRect();
  const localX = clamp(event.clientX - rect.left, 0, rect.width);
  const localY = clamp(event.clientY - rect.top, 0, rect.height);
  const frameRadius = zoomFrameSize / 2;

  zoomX.value = rect.width ? (localX / rect.width) * 100 : 50;
  zoomY.value = rect.height ? (localY / rect.height) * 100 : 50;
  zoomLeft.value = clamp(localX, frameRadius, rect.width - frameRadius);
  zoomTop.value = clamp(localY, frameRadius, rect.height - frameRadius);
  isZoomVisible.value = true;
};

const zoomFrameStyle = computed(() => ({
  width: `${zoomFrameSize}px`,
  height: `${zoomFrameSize}px`,
  left: `${zoomLeft.value}px`,
  top: `${zoomTop.value}px`
}));

const zoomPreviewStyle = computed(() => {
  if (activeMedia.value?.kind !== "image") {
    return {};
  }

  return {
    backgroundImage: `url(${activeMedia.value.value})`,
    backgroundPosition: `${zoomX.value}% ${zoomY.value}%`
  };
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
    :eyebrow="bannerEyebrow"
    :title="product?.title ?? 'Product Not Found'"
  />

  <template v-if="product">
    <section class="section product-detail">
      <div class="shell product-detail__layout">
        <div class="product-detail__media reveal is-visible">
          <div
            v-if="activeMedia?.kind === 'image'"
            ref="heroRef"
            class="product-card__visual product-detail__hero product-card__visual--photo product-detail__hero--interactive"
            @mousemove="handleHeroMouseMove"
            @mouseleave="hideZoom"
          >
            <img :src="activeMedia.value" :alt="activeMedia.label" class="product-detail__hero-image" />
            <div
              v-if="isZoomVisible"
              class="product-detail__zoom-frame"
              :style="zoomFrameStyle"
            ></div>
          </div>
          <div
            v-else-if="activeMedia"
            :class="['product-card__visual', 'product-detail__hero', activeMedia.value]"
          ></div>
          <div
            v-if="activeMedia?.kind === 'image' && isZoomVisible"
            class="product-detail__zoom-preview"
            :style="zoomPreviewStyle"
          ></div>

          <div v-if="mediaItems.length > 1" class="product-detail__gallery">
            <button
              type="button"
              class="product-detail__gallery-nav"
              :disabled="!canScrollPreviousMedia"
              aria-label="Scroll previous thumbnails"
              @click="scrollThumbnailWindow(-1)"
            >
              ‹
            </button>

            <div class="product-detail__gallery-track">
              <button
                v-for="item in visibleMediaItems"
                :key="item.key"
                type="button"
                class="catalog-gallery__item product-detail__thumb"
                :class="[
                  item.kind === 'image' ? 'catalog-gallery__item--photo' : item.value,
                  { 'product-detail__thumb--active': item.key === activeMediaKey }
                ]"
                :style="item.kind === 'image' ? getMediaStyle(item.value) : undefined"
                :aria-label="item.label"
                :aria-pressed="item.key === activeMediaKey"
                @click="selectMedia(item.key)"
              >
                <span class="sr-only">{{ item.label }}</span>
              </button>
            </div>

            <button
              type="button"
              class="product-detail__gallery-nav"
              :disabled="!canScrollNextMedia"
              aria-label="Scroll next thumbnails"
              @click="scrollThumbnailWindow(1)"
            >
              ›
            </button>
          </div>
        </div>

        <div class="product-detail__summary reveal is-visible">
          <RouterLink v-if="hasCategoryLink" class="product-detail__breadcrumb" :to="`/categories/${productCategorySlug}`">
            {{ productCategoryLabel }}
          </RouterLink>

          <h2 class="product-detail__title">{{ product.title }}</h2>
          <p v-if="productSummary" class="product-detail__intro">{{ productSummary }}</p>

          <div class="product-detail__price">
            <strong>{{ product.price }}</strong>
            <span v-if="productReferencePrice">{{ productReferencePrice }}</span>
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
        <article class="detail-card product-detail__description-card reveal is-visible">
          <p class="eyebrow">Product Details</p>
          <p class="product-detail__description-text">{{ product.description }}</p>
        </article>
      </div>
    </section>

    <section v-if="relatedProducts.length" class="section catalog-zone">
      <div class="shell">
        <div class="section-heading reveal is-visible">
          <p class="eyebrow">Related Products</p>
          <h2>More products in the same buying conversation.</h2>
        </div>

        <CatalogProductGrid :products="relatedProducts" variant="compact" />
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
