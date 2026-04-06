import { computed, ref } from "vue";
import { apiPost } from "../../services/http";
import {
  blogPosts as defaultBlogs,
  catalogCategories as defaultCategories,
  catalogProducts as defaultProducts,
  tutorialVideos as defaultVideos,
  videoCategories as defaultVideoCategories
} from "../../data/catalog";
import { siteContent as defaultSiteContent } from "../../data/siteContent.en";
import type {
  BlogCategory,
  BlogPost,
  CatalogProduct,
  TutorialVideo,
  VideoCategory
} from "../../types/catalog";
import type { SiteContent } from "../../types/content";
import {
  buildBlogPageContent,
  buildMappedBlogCategories,
  buildMappedBlogs
} from "./blog";
import {
  buildMappedCategories,
  buildMappedProducts,
  buildMappedVideoCategories,
  buildMappedVideos
} from "./catalog";
import { buildBrandStoryContent, buildSiteContent } from "./content";
import {
  buildDefaultBlogCategories,
  buildDefaultBrandStory,
  defaultBlogPageContent,
  defaultPublicSeo
} from "./defaults";
import { defaultHomeContent, normalizeHomeContentData } from "./home";
import type {
  PublicBootstrapPayload,
  RawHomeContent,
  RawSeoSettings,
  RawSiteSettings
} from "./types";
import { cloneValue } from "./utils";

const siteContent = ref<SiteContent>(cloneValue(defaultSiteContent));
const brandStory = ref(buildDefaultBrandStory());
const categories = ref(cloneValue(defaultCategories));
const videoCategories = ref<VideoCategory[]>(cloneValue(defaultVideoCategories));
const blogCategories = ref<BlogCategory[]>(buildDefaultBlogCategories());
const products = ref(cloneValue(defaultProducts));
const videos = ref<TutorialVideo[]>(cloneValue(defaultVideos));
const blogs = ref<BlogPost[]>(cloneValue(defaultBlogs));
const blogPage = ref(cloneValue(defaultBlogPageContent));
const seoSettings = ref<RawSeoSettings>(cloneValue(defaultPublicSeo));
const siteSettings = ref<RawSiteSettings | null>(null);
const homeContent = ref<RawHomeContent>(cloneValue(defaultHomeContent));
const loading = ref(false);
const loaded = ref(false);
const error = ref("");

export async function loadPublicData(force = false) {
  if (loading.value || (loaded.value && !force)) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const data = await apiPost<PublicBootstrapPayload>("/public/bootstrap", {});
    const mappedCategories = buildMappedCategories(data.categories);
    const mappedVideoCategories = buildMappedVideoCategories(data.videoCategories);
    const mappedBlogCategories = buildMappedBlogCategories(
      Array.isArray(data.blogCategories) ? data.blogCategories : []
    );
    const mappedProducts = buildMappedProducts(data.products, data.categories);
    const mappedVideos = buildMappedVideos(data.videos, data.videoCategories);
    const mappedBlogs = buildMappedBlogs(
      Array.isArray(data.blogs) ? data.blogs : [],
      Array.isArray(data.blogCategories) ? data.blogCategories : []
    );

    categories.value = mappedCategories;
    videoCategories.value = mappedVideoCategories;
    blogCategories.value = mappedBlogCategories.length ? mappedBlogCategories : buildDefaultBlogCategories();
    products.value = mappedProducts;
    videos.value = mappedVideos;
    blogs.value = mappedBlogs;
    blogPage.value = buildBlogPageContent(data.blogPage);
    seoSettings.value = {
      ...cloneValue(defaultPublicSeo),
      ...(data.seo ?? {})
    };
    siteSettings.value = data.siteSettings;
    brandStory.value = buildBrandStoryContent(data.brandStory);
    homeContent.value = normalizeHomeContentData(data.homeContent);
    siteContent.value = buildSiteContent(data, mappedCategories, mappedProducts, mappedVideos);
    loaded.value = true;
  } catch (loadError) {
    error.value = loadError instanceof Error ? loadError.message : "Unable to load live content.";
  } finally {
    loading.value = false;
  }
}

export function usePublicData() {
  const categoryMap = computed(() => new Map(categories.value.map((item) => [item.slug, item])));
  const videoCategoryMap = computed(() => new Map(videoCategories.value.map((item) => [item.slug, item])));
  const blogCategoryMap = computed(() => new Map(blogCategories.value.map((item) => [item.slug, item])));
  const productMap = computed(() => new Map(products.value.map((item) => [item.slug, item])));
  const videoMap = computed(() => new Map(videos.value.map((item) => [item.slug, item])));
  const blogMap = computed(() => new Map(blogs.value.map((item) => [item.slug, item])));

  const findCategoryBySlug = (slug: string) => categoryMap.value.get(slug);
  const findVideoCategoryBySlug = (slug: string) => videoCategoryMap.value.get(slug);
  const findBlogCategoryBySlug = (slug: string) => blogCategoryMap.value.get(slug);
  const findProductBySlug = (slug: string) => productMap.value.get(slug);
  const findVideoBySlug = (slug: string) => videoMap.value.get(slug);
  const findBlogBySlug = (slug: string) => blogMap.value.get(slug);
  const getProductsByCategory = (slug: string) =>
    products.value.filter((item) => item.categorySlug === slug);
  const getRelatedProducts = (product: CatalogProduct) =>
    products.value.filter((item) => product.relatedSlugs.includes(item.slug));
  const getRelatedVideos = (video: TutorialVideo) => {
    const preferred = videos.value.filter(
      (item) =>
        item.slug !== video.slug &&
        (item.categorySlug === video.categorySlug || item.topicSlug === video.topicSlug)
    );
    const fallback = videos.value.filter(
      (item) => item.slug !== video.slug && !preferred.some((entry) => entry.slug === item.slug)
    );

    return [...preferred, ...fallback].slice(0, 4);
  };
  const getRelatedBlogs = (blog: BlogPost) => {
    const preferred = blogs.value.filter(
      (item) =>
        item.slug !== blog.slug &&
        (
          (blog.categorySlug && item.categorySlug === blog.categorySlug) ||
          item.category === blog.category
        )
    );
    const fallback = blogs.value.filter(
      (item) => item.slug !== blog.slug && !preferred.some((entry) => entry.slug === item.slug)
    );

    return [...preferred, ...fallback].slice(0, 3);
  };

  return {
    siteContent,
    brandStory,
    categories,
    videoCategories,
    blogCategories,
    products,
    videos,
    blogs,
    blogPage,
    seoSettings,
    siteSettings,
    homeContent,
    loading,
    error,
    loadPublicData,
    findCategoryBySlug,
    findVideoCategoryBySlug,
    findBlogCategoryBySlug,
    findProductBySlug,
    findVideoBySlug,
    findBlogBySlug,
    getProductsByCategory,
    getRelatedProducts,
    getRelatedVideos,
    getRelatedBlogs
  };
}
