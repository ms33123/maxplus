import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  AdminBootstrapPayload,
  BlogRecord,
  CategoryRecord,
  ProductRecord,
  VideoRecord
} from "../types/admin";
import { apiPost } from "../services/http";
import {
  removeMockBlog,
  removeMockCategory,
  removeMockProduct,
  removeMockVideo,
  saveMockBlog,
  saveMockCategory,
  saveMockProduct,
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

export const useCatalogStore = defineStore("catalog", () => {
  const products = ref<ProductRecord[]>([]);
  const videos = ref<VideoRecord[]>([]);
  const blogs = ref<BlogRecord[]>([]);
  const categories = ref<CategoryRecord[]>([]);

  const hydrate = (payload: Pick<AdminBootstrapPayload, "products" | "videos" | "blogs" | "categories">) => {
    products.value = payload.products;
    videos.value = payload.videos;
    blogs.value = payload.blogs;
    categories.value = payload.categories;
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

    if (sessionStore.isMockMode) {
      const saved = saveMockBlog(record);
      upsertById(blogs.value, saved);
      return saved;
    }

    const saved = await apiPost<BlogRecord>("/admin/blogs/save", record, {
      token: getToken()
    });
    upsertById(blogs.value, saved);
    return saved;
  };

  const saveCategory = async (record: CategoryRecord) => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      const saved = saveMockCategory(record);
      upsertById(categories.value, saved);
      return saved;
    }

    const saved = await apiPost<CategoryRecord>("/admin/categories/save", record, {
      token: getToken()
    });
    upsertById(categories.value, saved);
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

  return {
    products,
    videos,
    blogs,
    categories,
    hydrate,
    saveProduct,
    saveVideo,
    saveBlog,
    saveCategory,
    removeProduct,
    removeVideo,
    removeBlog,
    removeCategory
  };
});
