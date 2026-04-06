<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PageBanner from "../components/PageBanner.vue";
import { usePageMeta } from "../composables/usePageMeta";
import { usePublicData } from "../composables/usePublicData";
import type { BlogPost } from "../types/catalog";

type BlogSortMode = "latest" | "oldest";

const { blogs: blogPosts, blogCategories, blogPage } = usePublicData();

const activeCategory = ref("all");
const searchQuery = ref("");
const activeSort = ref<BlogSortMode>("latest");
const currentPage = ref(1);

const pageSize = computed(() => Math.max(3, blogPage.value.perPage || 6));
const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase());

const categoryOptions = computed(() => [
  {
    slug: "all",
    title: blogPage.value.allCategoriesLabel,
    description: blogPage.value.heroText
  },
  ...blogCategories.value
]);

function parseDateValue(value?: string) {
  if (!value) {
    return 0;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDisplayDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function getReadTime(post: BlogPost) {
  const text = (post.body?.join(" ") || post.excerpt || "").trim();

  if (!text) {
    return "1 min read";
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function getSearchSource(post: BlogPost) {
  return [
    post.title,
    post.excerpt,
    post.author || "",
    post.category,
    ...(post.body ?? [])
  ]
    .join(" ")
    .toLowerCase();
}

function getCoverStyle(imageUrl?: string) {
  const gradient = "linear-gradient(135deg, rgba(8, 18, 31, 0.9), rgba(255, 106, 42, 0.68))";

  return imageUrl
    ? {
        backgroundImage: `${gradient}, url(${imageUrl})`
      }
    : {
        backgroundImage: gradient
      };
}

const sortedPosts = computed(() => {
  const items = [...blogPosts.value];

  return items.sort((left, right) => {
    const leftDate = parseDateValue(left.publishDate);
    const rightDate = parseDateValue(right.publishDate);
    return activeSort.value === "oldest" ? leftDate - rightDate : rightDate - leftDate;
  });
});

const visiblePosts = computed(() =>
  sortedPosts.value.filter((post) => {
    const matchesCategory =
      activeCategory.value === "all" ||
      post.categorySlug === activeCategory.value ||
      post.category === activeCategory.value;
    const matchesSearch =
      !normalizedSearch.value || getSearchSource(post).includes(normalizedSearch.value);

    return matchesCategory && matchesSearch;
  })
);

const activeCategoryDetails = computed(
  () => categoryOptions.value.find((item) => item.slug === activeCategory.value) || categoryOptions.value[0]
);

const latestPublishLabel = computed(() => {
  if (!blogPosts.value.length) {
    return "--";
  }

  const latest = [...blogPosts.value].sort(
    (left, right) => parseDateValue(right.publishDate) - parseDateValue(left.publishDate)
  )[0];

  return formatDisplayDate(latest?.publishDate) || "--";
});

const totalPages = computed(() => Math.max(1, Math.ceil(visiblePosts.value.length / pageSize.value)));
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1));
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return visiblePosts.value.slice(start, start + pageSize.value);
});

const getBlogLink = (slug: string) => `/blog/${encodeURIComponent(slug)}`;

watch([activeCategory, searchQuery, activeSort], () => {
  currentPage.value = 1;
});

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

usePageMeta(
  computed(() => ({
    title: blogPage.value.metaTitle,
    description: blogPage.value.metaDescription
  }))
);
</script>

<template>
  <PageBanner
    :eyebrow="blogPage.heroEyebrow"
    :title="blogPage.heroTitle"
    :text="blogPage.heroText"
  />

  <section class="section blog-zone">
    <div class="shell">
      <div class="blog-hub reveal" v-reveal>
        <div class="blog-hub__stats">
          <div class="blog-hub__stat">
            <strong>{{ blogPosts.length }}</strong>
            <span>{{ blogPage.resultsLabel }}</span>
          </div>
          <div class="blog-hub__stat">
            <strong>{{ blogCategories.length }}</strong>
            <span>{{ blogPage.categoriesLabel }}</span>
          </div>
          <div class="blog-hub__stat">
            <strong>{{ latestPublishLabel }}</strong>
            <span>{{ blogPage.updatedLabel }}</span>
          </div>
        </div>

        <div class="blog-toolbar">
          <label class="blog-toolbar__search">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="blogPage.searchPlaceholder"
            >
          </label>

          <label class="blog-toolbar__sort">
            <select v-model="activeSort">
              <option value="latest">{{ blogPage.sortLatestLabel }}</option>
              <option value="oldest">{{ blogPage.sortOldestLabel }}</option>
            </select>
          </label>
        </div>

        <div class="blog-filter-chips">
          <button
            v-for="item in categoryOptions"
            :key="item.slug"
            type="button"
            :class="['blog-filter-chip', { 'is-active': activeCategory === item.slug }]"
            @click="activeCategory = item.slug"
          >
            {{ item.title }}
          </button>
        </div>

        <p v-if="activeCategoryDetails?.description" class="blog-category-note">
          {{ activeCategoryDetails.description }}
        </p>
      </div>

      <div v-if="visiblePosts.length" class="blog-list">
        <RouterLink
          v-for="post in paginatedPosts"
          :key="post.slug"
          :to="getBlogLink(post.slug)"
          class="blog-list-item reveal"
          v-reveal
        >
          <div class="blog-list-item__media" :style="getCoverStyle(post.coverImage)">
            <span class="blog-list-item__tag">{{ post.category }}</span>
          </div>

          <div class="blog-list-item__body">
            <div class="blog-list-item__meta">
              <span v-if="post.author">{{ post.author }}</span>
              <span v-if="post.publishDate">{{ formatDisplayDate(post.publishDate) }}</span>
              <span>{{ getReadTime(post) }}</span>
            </div>

            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <span class="blog-list-item__cta">{{ blogPage.readMoreLabel }}</span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="catalog-empty reveal is-visible">
        <h3>{{ blogPage.emptyTitle }}</h3>
        <p>{{ blogPage.emptyText }}</p>
      </div>

      <div v-if="visiblePosts.length > pageSize" class="pagination-row">
        <button
          class="button button--ghost pagination-row__button"
          type="button"
          :disabled="currentPage === 1"
          @click="currentPage -= 1"
        >
          {{ blogPage.previousLabel }}
        </button>

        <button
          v-for="page in pageNumbers"
          :key="page"
          :class="['button button--ghost pagination-row__button', { 'is-active': currentPage === page }]"
          type="button"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <button
          class="button button--ghost pagination-row__button"
          type="button"
          :disabled="currentPage === totalPages"
          @click="currentPage += 1"
        >
          {{ blogPage.nextLabel }}
        </button>
      </div>
    </div>
  </section>
</template>
