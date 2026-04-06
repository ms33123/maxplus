<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { usePageMeta } from "../composables/usePageMeta";
import { usePublicData } from "../composables/usePublicData";
import { useStructuredData } from "../composables/useStructuredData";

interface ArticleHeading {
  id: string;
  label: string;
  level: 2 | 3;
}

const route = useRoute();
const { findBlogBySlug, getRelatedBlogs, blogPage, seoSettings } = usePublicData();

const post = computed(() => findBlogBySlug(String(route.params.slug ?? "")));
const relatedPosts = computed(() => (post.value ? getRelatedBlogs(post.value) : []));

const formattedPublishDate = computed(() => {
  if (!post.value?.publishDate) {
    return "";
  }

  const date = new Date(post.value.publishDate);

  if (Number.isNaN(date.getTime())) {
    return post.value.publishDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
});

const estimatedRead = computed(() => {
  if (!post.value) {
    return "";
  }

  const text = post.value.body.join(" ").trim();

  if (!text) {
    return "";
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(wordCount / 220))} min read`;
});

const metaItems = computed(() =>
  [
    post.value?.category || "",
    post.value?.author || "",
    formattedPublishDate.value,
    estimatedRead.value
  ].filter(Boolean)
);

function slugifyHeading(text: string, index: number) {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `section-${index + 1}`;
}

function buildArticlePresentation(sourceHtml?: string) {
  const rawHtml = sourceHtml?.trim() || "";

  if (!rawHtml || typeof DOMParser === "undefined") {
    return {
      html: rawHtml,
      headings: [] as ArticleHeading[]
    };
  }

  const doc = new DOMParser().parseFromString(rawHtml, "text/html");
  const headings: ArticleHeading[] = [];

  Array.from(doc.body.querySelectorAll("h2, h3")).forEach((node, index) => {
    const label = node.textContent?.replace(/\s+/g, " ").trim() || "";

    if (!label) {
      return;
    }

    const level = Number(node.tagName.slice(1)) === 2 ? 2 : 3;
    const id = node.id || slugifyHeading(label, index);
    node.id = id;
    headings.push({ id, label, level });
  });

  return {
    html: doc.body.innerHTML,
    headings
  };
}

const articlePresentation = computed(() => buildArticlePresentation(post.value?.bodyHtml));
const articleBodyHtml = computed(() => articlePresentation.value.html);
const articleHeadings = computed(() => articlePresentation.value.headings);
const articleFacts = computed(() =>
  [
    {
      label: "Category",
      value: post.value?.category || ""
    },
    {
      label: "Author",
      value: post.value?.author || ""
    },
    {
      label: "Published",
      value: formattedPublishDate.value
    },
    {
      label: "Reading Time",
      value: estimatedRead.value
    }
  ].filter((item) => item.value)
);

const getBlogLink = (slug: string) => `/blog/${encodeURIComponent(slug)}`;
const getCoverStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.08), rgba(8, 18, 31, 0.5)), url(${imageUrl})`
});
const applyBlogTitleTemplate = (title: string) =>
  (seoSettings.value.blogTemplate || "{post} | MaxPlus Blog").replace("{post}", title);

usePageMeta(
  computed(() => ({
    title: post.value ? applyBlogTitleTemplate(post.value.title) : blogPage.value.metaTitle,
    description:
      post.value?.excerpt || blogPage.value.metaDescription
  }))
);

useStructuredData(
  computed(() => {
    if (!post.value) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.value.title,
      description: post.value.excerpt,
      articleBody: post.value.body.join(" "),
      datePublished: post.value.publishDate || undefined,
      author: post.value.author
        ? {
            "@type": "Person",
            name: post.value.author
          }
        : undefined,
      image: post.value.coverImage || undefined
    };
  })
);
</script>

<template>
  <template v-if="post">
    <section class="section blog-story">
      <div class="shell">
        <div
          :class="['blog-story__frame reveal', { 'is-compact': !post.coverImage }]"
          v-reveal
        >
          <div class="blog-story__intro">
            <RouterLink class="blog-article__breadcrumb" to="/blog">
              Back to Blog
            </RouterLink>

            <p class="eyebrow">{{ post.category }}</p>
            <h1>{{ post.title }}</h1>
            <p class="blog-story__excerpt">{{ post.excerpt }}</p>

            <div class="blog-article__meta">
              <span v-for="item in metaItems" :key="item">{{ item }}</span>
            </div>
          </div>

          <div
            v-if="post.coverImage"
            class="blog-story__cover"
            :style="getCoverStyle(post.coverImage)"
          />
        </div>
      </div>
    </section>

    <section class="section blog-article">
      <div class="shell blog-article__layout">
        <article class="blog-article__main reveal" v-reveal>
          <div class="blog-article__content" v-html="articleBodyHtml" />
        </article>

        <aside class="blog-article__aside reveal" v-reveal>
          <div class="blog-article__aside-card">
            <p class="eyebrow">Article Overview</p>
            <div class="blog-article__facts">
              <div
                v-for="item in articleFacts"
                :key="item.label"
                class="blog-article__fact"
              >
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>

          <div v-if="articleHeadings.length" class="blog-article__aside-card">
            <p class="eyebrow">On This Page</p>
            <nav class="blog-article__outline">
              <a
                v-for="item in articleHeadings"
                :key="item.id"
                :href="`#${item.id}`"
                :class="[`is-level-${item.level}`]"
              >
                {{ item.label }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </section>

    <section v-if="relatedPosts.length" class="section blog-related">
      <div class="shell">
        <div class="blog-related__intro reveal" v-reveal>
          <p class="eyebrow">More Articles</p>
          <h2>Continue Reading</h2>
        </div>

        <div class="blog-related__list">
          <RouterLink
            v-for="item in relatedPosts"
            :key="item.slug"
            :to="getBlogLink(item.slug)"
            class="blog-related__item reveal"
            v-reveal
          >
            <div class="blog-related__item-top">
              <p class="blog-related__tag">{{ item.category }}</p>
              <span class="blog-related__cta">{{ blogPage.readMoreLabel }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p class="blog-related__excerpt">{{ item.excerpt }}</p>
            <span class="blog-related__meta">{{ item.meta || item.author }}</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </template>

  <section v-else class="section">
    <div class="shell">
      <div class="catalog-empty reveal is-visible">
        <h3>This article is not available.</h3>
        <p>Open the blog page to browse the current MaxPlus article list.</p>
      </div>
    </div>
  </section>
</template>
