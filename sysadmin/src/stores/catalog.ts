import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  AdminBootstrapPayload,
  BlogRecord,
  BlogCategoryRecord,
  CategoryRecord,
  CategoryFilterConfigRecord,
  ProductRecord,
  VideoCategoryRecord,
  VideoRecord
} from "../types/admin";
import { apiPost } from "../services/http";
import {
  removeMockBlog,
  removeMockBlogCategory,
  removeMockCategory,
  removeMockProduct,
  removeMockVideoCategory,
  removeMockVideo,
  saveMockBlog,
  saveMockBlogCategory,
  saveMockCategory,
  saveMockProduct,
  saveMockVideoCategory,
  saveMockVideo
} from "../services/mockAdmin";
import { useSessionStore } from "./session";

function upsertById<T extends { id: string }>(source: T[], record: T) {
  const index = source.findIndex((item) => item.id === record.id);

  if (index >= 0) {
    source.splice(index, 1, record);
    return;
  }

  source.unshift(record);
}

function inferCategoryVisual(slug?: string) {
  const map: Record<string, string> = {
    "team-sports": "catalog-hero__visual--team",
    "training-gear": "catalog-hero__visual--training",
    "outdoor-play": "catalog-hero__visual--outdoor",
    recovery: "catalog-hero__visual--recovery"
  };

  return map[slug || ""] || "catalog-hero__visual--training";
}

function createDefaultCategoryFilterConfig(): CategoryFilterConfigRecord {
  return {
    sportLabel: "Sport Type",
    audienceLabel: "Audience",
    useCaseLabel: "Use",
    stockLabel: "Stock",
    sortLabel: "Sort",
    allLabel: "All",
    sortDefaultLabel: "Default",
    sortLatestLabel: "Latest",
    sortPriceAscLabel: "Price Low To High",
    sortPriceDescLabel: "Price High To Low",
    sortBestSellingLabel: "Best Selling"
  };
}

function normalizeCategoryRecord<T extends CategoryRecord>(record: T): T {
  const summary = record.summary?.trim() || `${record.name} category content.`;
  const bannerTitle = record.bannerTitle?.trim() || record.name;
  const bannerText = record.bannerText?.trim() || summary;
  const defaults = createDefaultCategoryFilterConfig();
  const rawFilterConfig = record.filterConfig ?? defaults;
  const filterConfig = {
    sportLabel: rawFilterConfig.sportLabel?.trim() || defaults.sportLabel,
    audienceLabel: rawFilterConfig.audienceLabel?.trim() || defaults.audienceLabel,
    useCaseLabel: rawFilterConfig.useCaseLabel?.trim() || defaults.useCaseLabel,
    stockLabel: rawFilterConfig.stockLabel?.trim() || defaults.stockLabel,
    sortLabel: rawFilterConfig.sortLabel?.trim() || defaults.sortLabel,
    allLabel: rawFilterConfig.allLabel?.trim() || defaults.allLabel,
    sortDefaultLabel: rawFilterConfig.sortDefaultLabel?.trim() || defaults.sortDefaultLabel,
    sortLatestLabel: rawFilterConfig.sortLatestLabel?.trim() || defaults.sortLatestLabel,
    sortPriceAscLabel: rawFilterConfig.sortPriceAscLabel?.trim() || defaults.sortPriceAscLabel,
    sortPriceDescLabel: rawFilterConfig.sortPriceDescLabel?.trim() || defaults.sortPriceDescLabel,
    sortBestSellingLabel:
      rawFilterConfig.sortBestSellingLabel?.trim() || defaults.sortBestSellingLabel
  };

  return {
    ...record,
    eyebrow: record.eyebrow?.trim() || "Category",
    summary,
    bannerTitle,
    bannerText,
    filterConfig,
    visualClass: record.visualClass?.trim() || inferCategoryVisual(record.slug),
    highlights: (record.highlights ?? []).map((item) => item.trim()).filter(Boolean),
    stats: (record.stats ?? []).filter((item) => item?.value?.trim() && item?.label?.trim())
  };
}

export const useCatalogStore = defineStore("catalog", () => {
  const products = ref<ProductRecord[]>([]);
  const videos = ref<VideoRecord[]>([]);
  const blogs = ref<BlogRecord[]>([]);
  const categories = ref<CategoryRecord[]>([]);
  const videoCategories = ref<VideoCategoryRecord[]>([]);
  const blogCategories = ref<BlogCategoryRecord[]>([]);

  const hydrate = (payload: Pick<AdminBootstrapPayload, "products" | "videos" | "blogs" | "categories" | "videoCategories" | "blogCategories">) => {
    products.value = payload.products;
    videos.value = payload.videos;
    blogs.value = payload.blogs;
    categories.value = payload.categories.map((item) => normalizeCategoryRecord(item));
    videoCategories.value = payload.videoCategories.map((item) => normalizeCategoryRecord(item));
    blogCategories.value = payload.blogCategories;
  };

  const getToken = () => {
    const sessionStore = useSessionStore();

    if (!sessionStore.token) {
      throw new Error("未登录或登录已过期。");
    }

    return sessionStore.token;
  };

  const saveProduct = async (record: ProductRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockProduct(record);
      upsertById(products.value, saved);
      return saved;
    }

    const saved = await apiPost<ProductRecord>("/admin/products/save", record, {
      token: getToken()
    });
    upsertById(products.value, saved);
    return saved;
  };

  const saveVideo = async (record: VideoRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockVideo(record);
      upsertById(videos.value, saved);
      return saved;
    }

    const saved = await apiPost<VideoRecord>("/admin/videos/save", record, {
      token: getToken()
    });
    upsertById(videos.value, saved);
    return saved;
  };

  const saveBlog = async (record: BlogRecord) => {
    const sessionStore = useSessionStore();
    const categoryLabel =
      blogCategories.value.find((item) => item.id === record.categoryId)?.name || record.category || "";
    const payload = {
      ...record,
      category: categoryLabel
    };

    if (sessionStore.isMockMode) {
      const saved = saveMockBlog(payload);
      upsertById(blogs.value, saved);
      return saved;
    }

    const saved = await apiPost<BlogRecord>("/admin/blogs/save", payload, {
      token: getToken()
    });
    upsertById(blogs.value, saved);
    return saved;
  };

  const saveBlogCategory = async (record: BlogCategoryRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockBlogCategory(record);
      upsertById(blogCategories.value, saved);
      blogs.value = blogs.value.map((item) =>
        item.categoryId === saved.id ? { ...item, category: saved.name } : item
      );
      return saved;
    }

    const saved = await apiPost<BlogCategoryRecord>("/admin/blog-categories/save", record, {
      token: getToken()
    });
    upsertById(blogCategories.value, saved);
    blogs.value = blogs.value.map((item) =>
      item.categoryId === saved.id ? { ...item, category: saved.name } : item
    );
    return saved;
  };

  const saveCategory = async (record: CategoryRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockCategory(normalizeCategoryRecord(record));
      upsertById(categories.value, saved);
      return saved;
    }

    const saved = await apiPost<CategoryRecord>("/admin/categories/save", normalizeCategoryRecord(record), {
      token: getToken()
    });
    upsertById(categories.value, normalizeCategoryRecord(saved));
    return saved;
  };

  const saveVideoCategory = async (record: VideoCategoryRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockVideoCategory(normalizeCategoryRecord(record));
      upsertById(videoCategories.value, saved);
      return saved;
    }

    const saved = await apiPost<VideoCategoryRecord>("/admin/video-categories/save", normalizeCategoryRecord(record), {
      token: getToken()
    });
    upsertById(videoCategories.value, normalizeCategoryRecord(saved));
    return saved;
  };

  const removeProduct = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockProduct(id);
      products.value = products.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/products/delete", { id }, { token: getToken() });
    products.value = products.value.filter((item) => item.id !== id);
  };

  const removeVideo = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockVideo(id);
      videos.value = videos.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/videos/delete", { id }, { token: getToken() });
    videos.value = videos.value.filter((item) => item.id !== id);
  };

  const removeBlog = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockBlog(id);
      blogs.value = blogs.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/blogs/delete", { id }, { token: getToken() });
    blogs.value = blogs.value.filter((item) => item.id !== id);
  };

  const removeBlogCategory = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockBlogCategory(id);
      blogCategories.value = blogCategories.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/blog-categories/delete", { id }, { token: getToken() });
    blogCategories.value = blogCategories.value.filter((item) => item.id !== id);
  };

  const removeCategory = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockCategory(id);
      categories.value = categories.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/categories/delete", { id }, { token: getToken() });
    categories.value = categories.value.filter((item) => item.id !== id);
  };

  const removeVideoCategory = async (id: string) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      removeMockVideoCategory(id);
      videoCategories.value = videoCategories.value.filter((item) => item.id !== id);
      return;
    }

    await apiPost("/admin/video-categories/delete", { id }, { token: getToken() });
    videoCategories.value = videoCategories.value.filter((item) => item.id !== id);
  };

  return {
    products,
    videos,
    blogs,
    categories,
    videoCategories,
    blogCategories,
    hydrate,
    saveProduct,
    saveVideo,
    saveBlog,
    saveBlogCategory,
    saveCategory,
    saveVideoCategory,
    removeProduct,
    removeVideo,
    removeBlog,
    removeBlogCategory,
    removeCategory,
    removeVideoCategory
  };
});
