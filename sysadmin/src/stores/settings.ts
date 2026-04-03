import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  AdminBootstrapPayload,
  HomeContentState,
  SeoSettingsState,
  SiteSettingsState
} from "../types/admin";
import { apiPost } from "../services/http";
import {
  saveMockHomeContent,
  saveMockSeoSettings,
  saveMockSiteSettings
} from "../services/mockAdmin";
import { useSessionStore } from "./session";

function createDefaultHomeContent(): HomeContentState {
  return {
    heroSlides: [],
    highlights: [],
    featuredProductSlugs: [],
    featuredVideoSlugs: [],
    reviews: {
      eyebrow: "",
      title: "",
      text: "",
      displayMode: "text",
      summary: {
        label: "",
        value: "",
        detail: "",
        metrics: []
      },
      items: []
    },
    sectionToggles: []
  };
}

function normalizeHomeContent(value?: Partial<HomeContentState> | null): HomeContentState {
  const fallback = createDefaultHomeContent();
  const source = value ?? {};

  return {
    ...fallback,
    ...source,
    heroSlides: Array.isArray(source.heroSlides)
      ? source.heroSlides.map((item, index) => ({
          id: item?.id || `hero-${index + 1}`,
          title: item?.title || "",
          subtitle: item?.subtitle || "",
          targetUrl: item?.targetUrl || "/products",
          imageUrl: item?.imageUrl || "",
          enabled: item?.enabled ?? true
        }))
      : fallback.heroSlides,
    highlights: Array.isArray(source.highlights) ? source.highlights : fallback.highlights,
    featuredProductSlugs: Array.isArray(source.featuredProductSlugs)
      ? source.featuredProductSlugs
      : fallback.featuredProductSlugs,
    featuredVideoSlugs: Array.isArray(source.featuredVideoSlugs)
      ? source.featuredVideoSlugs
      : fallback.featuredVideoSlugs,
    reviews: {
      ...fallback.reviews,
      ...(source.reviews ?? {}),
      summary: {
        ...fallback.reviews.summary,
        ...(source.reviews?.summary ?? {}),
        metrics: Array.isArray(source.reviews?.summary?.metrics)
          ? source.reviews.summary.metrics
          : fallback.reviews.summary.metrics
      },
      items: Array.isArray(source.reviews?.items)
        ? source.reviews.items.map((item, index) => ({
            id: item?.id || `review-${index + 1}`,
            quote: item?.quote || "",
            rating: item?.rating ?? 5,
            author: item?.author || "",
            meta: item?.meta || "",
            imageUrl: item?.imageUrl || ""
          }))
        : fallback.reviews.items
    },
    sectionToggles: Array.isArray(source.sectionToggles)
      ? source.sectionToggles
      : fallback.sectionToggles
  };
}

export const useSettingsStore = defineStore("settings", () => {
  const siteSettings = ref<SiteSettingsState>({
    brand: {
      brandName: "",
      siteTitle: "",
      siteDescription: "",
      supportEmail: "",
      salesEmail: "",
      phone: "",
      whatsapp: "",
      defaultLanguage: "",
      defaultCurrency: "",
      timezone: "",
      address: ""
    },
    socials: [],
    notifications: {
      inquiryRecipients: "",
      subscriberRecipients: "",
      enableEmailNotice: false,
      enableSlackNotice: false
    }
  });
  const homeContent = ref<HomeContentState>(createDefaultHomeContent());
  const seoSettings = ref<SeoSettingsState>({
    globalTitle: "",
    globalDescription: "",
    ogImage: "",
    sitemapEnabled: false,
    robotsIndex: false,
    productTemplate: "",
    categoryTemplate: "",
    blogTemplate: ""
  });

  const hydrate = (payload: Pick<AdminBootstrapPayload, "siteSettings" | "homeContent" | "seoSettings">) => {
    siteSettings.value = payload.siteSettings;
    homeContent.value = normalizeHomeContent(payload.homeContent);
    seoSettings.value = payload.seoSettings;
  };

  const getToken = () => {
    const sessionStore = useSessionStore();

    if (!sessionStore.token) {
      throw new Error("未登录或登录已过期。");
    }

    return sessionStore.token;
  };

  const saveSiteSettings = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      siteSettings.value = saveMockSiteSettings(siteSettings.value);
      return;
    }

    siteSettings.value = await apiPost<SiteSettingsState>("/admin/site/save", siteSettings.value, {
      token: getToken(),
      secure: true
    });
  };

  const saveHomeContent = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      homeContent.value = normalizeHomeContent(saveMockHomeContent(homeContent.value));
      return;
    }

    homeContent.value = normalizeHomeContent(
      await apiPost<HomeContentState>("/admin/home/save", homeContent.value, {
        token: getToken()
      })
    );
  };

  const saveSeoSettings = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      seoSettings.value = saveMockSeoSettings(seoSettings.value);
      return;
    }

    seoSettings.value = await apiPost<SeoSettingsState>("/admin/seo/save", seoSettings.value, {
      token: getToken()
    });
  };

  return {
    siteSettings,
    homeContent,
    seoSettings,
    hydrate,
    saveSiteSettings,
    saveHomeContent,
    saveSeoSettings
  };
});
