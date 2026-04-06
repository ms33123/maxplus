<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
import { searchSuggestions } from "../data/catalog";

const route = useRoute();
const router = useRouter();
const { blogs: blogPosts, categories: catalogCategories, products: catalogProducts } = usePublicData();

const searchInput = ref(typeof route.query.q === "string" ? route.query.q : "");

watch(
  () => route.query.q,
  (value) => {
    searchInput.value = typeof value === "string" ? value : "";
  }
);

const query = computed(() => searchInput.value.trim().toLowerCase());

const matchedProducts = computed(() => {
  if (!query.value) {
    return [];
  }

  return catalogProducts.value.filter((item) =>
    [item.title, item.summary, item.tag, item.categoryLabel, item.sportType, item.useCase]
      .join(" ")
      .toLowerCase()
      .includes(query.value)
  );
});

const matchedCategories = computed(() => {
  if (!query.value) {
    return [];
  }

  return catalogCategories.value.filter((item) =>
    [item.title, item.summary, ...item.highlights]
      .join(" ")
      .toLowerCase()
      .includes(query.value)
  );
});

const matchedPosts = computed(() => {
  if (!query.value) {
    return [];
  }

  return blogPosts.value.filter((item) =>
    [item.title, item.excerpt, item.category, item.author || "", ...item.body]
      .join(" ")
      .toLowerCase()
      .includes(query.value)
  );
});

const hasResults = computed(
  () => Boolean(matchedProducts.value.length || matchedCategories.value.length || matchedPosts.value.length)
);

const submitSearch = () => {
  router.push({
    path: "/search",
    query: searchInput.value.trim() ? { q: searchInput.value.trim() } : {}
  });
};

const getBlogLink = (slug: string) => `/blog/${encodeURIComponent(slug)}`;

usePageMeta(
  computed(() => ({
    title: query.value ? `Search: ${searchInput.value} | MaxPlus` : "Search | MaxPlus Sporting Goods",
    description: query.value
      ? `Search results for ${searchInput.value} across the MaxPlus catalog and category pages.`
      : "Search the MaxPlus catalog, categories, and buying guidance."
  }))
);
</script>

<template>
  <PageBanner eyebrow="Search" title="Search" />

  <section class="section search-zone">
    <div class="shell">
      <form class="search-panel reveal" v-reveal @submit.prevent="submitSearch">
        <input
          v-model="searchInput"
          type="search"
          name="search"
          placeholder="Search products, categories, or keywords"
        />
        <button class="button button--primary" type="submit">Search</button>
      </form>

      <div v-if="!query" class="search-suggestions reveal" v-reveal>
        <p class="eyebrow">Hot Keywords</p>
        <div class="search-suggestions__list">
          <RouterLink
            v-for="item in searchSuggestions"
            :key="item.label"
            :to="item.href"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <template v-else>
        <section v-if="matchedCategories.length" class="search-block">
          <div class="section-heading reveal" v-reveal>
            <p class="eyebrow">Categories</p>
            <h2>Matching categories</h2>
          </div>

          <div class="category-overview__grid">
            <RouterLink
              v-for="category in matchedCategories"
              :key="category.slug"
              :to="`/categories/${category.slug}`"
              class="category-overview__card reveal"
              v-reveal
            >
              <h3>{{ category.title }}</h3>
              <p>{{ category.summary }}</p>
            </RouterLink>
          </div>
        </section>

        <section class="search-block">
          <div class="section-heading reveal" v-reveal>
            <p class="eyebrow">Products</p>
            <h2>Matching products</h2>
          </div>

          <CatalogProductGrid
            :products="matchedProducts"
            variant="compact"
            empty-title="No matching products."
            empty-text="Try a broader keyword or check the hot keywords below."
          />
        </section>

        <section v-if="matchedPosts.length" class="search-block">
          <div class="section-heading reveal" v-reveal>
            <p class="eyebrow">Guides</p>
            <h2>Matching blog topics</h2>
          </div>

          <div class="blog-grid">
            <RouterLink
              v-for="post in matchedPosts"
              :key="post.slug"
              :to="getBlogLink(post.slug)"
              class="blog-card reveal"
              v-reveal
            >
              <p class="blog-card__tag">{{ post.category }}</p>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <span class="blog-card__meta">{{ post.meta }}</span>
              <span class="blog-card__cta">Read Article</span>
            </RouterLink>
          </div>
        </section>

        <section v-if="!hasResults" class="catalog-empty reveal is-visible">
          <h3>No results for "{{ searchInput }}"</h3>
          <p>Try a shorter keyword or start from the suggestions below.</p>

          <div class="search-suggestions__list">
            <RouterLink
              v-for="item in searchSuggestions"
              :key="item.label"
              :to="item.href"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </section>
      </template>
    </div>
  </section>
</template>
