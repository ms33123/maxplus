import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  AdminBootstrapPayload,
  BlogPageState,
  BrandStoryState,
  HomeContactFormFieldState,
  HomeContentState,
  SeoSettingsState,
  SiteSettingsState,
  SubscribePopupState
} from "../types/admin";
import { apiPost } from "../services/http";
import {
  saveMockBlogPage,
  saveMockBrandStory,
  saveMockHomeContent,
  saveMockSeoSettings,
  saveMockSiteSettings,
  saveMockSubscribePopup
} from "../services/mockAdmin";
import { useSessionStore } from "./session";
import {
  createDefaultSiteSettings,
  normalizeSiteSettings
} from "./settings/site";
import {
  createDefaultSubscribePopup,
  normalizeSubscribePopup
} from "./settings/subscribe";

function createDefaultInterestOptions() {
  return [
    { value: "team-sports", label: "Team sports" },
    { value: "training", label: "Training gear" },
    { value: "outdoor-play", label: "Outdoor play" },
    { value: "mixed", label: "Mixed product range" }
  ];
}

function createDefaultContactFormFields(): HomeContactFormFieldState[] {
  const interestOptions = createDefaultInterestOptions();

  return [
    {
      id: "contact-field-name",
      key: "name",
      type: "text",
      label: "Name",
      placeholder: "Your name",
      enabled: true,
      required: true,
      options: []
    },
    {
      id: "contact-field-email",
      key: "email",
      type: "email",
      label: "Email",
      placeholder: "name@email.com",
      enabled: true,
      required: true,
      options: []
    },
    {
      id: "contact-field-phone",
      key: "phone",
      type: "tel",
      label: "Phone",
      placeholder: "Your phone number",
      enabled: false,
      required: false,
      options: []
    },
    {
      id: "contact-field-company",
      key: "company",
      type: "text",
      label: "Company",
      placeholder: "Your company name",
      enabled: false,
      required: false,
      options: []
    },
    {
      id: "contact-field-interest",
      key: "interest",
      type: "select",
      label: "Main Interest",
      placeholder: "Choose one",
      enabled: true,
      required: true,
      options: interestOptions
    },
    {
      id: "contact-field-message",
      key: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Tell us what style or product direction you want to keep.",
      enabled: true,
      required: true,
      options: []
    }
  ];
}

function normalizeFormFieldOptions(value: HomeContactFormFieldState["options"]) {
  return Array.isArray(value)
    ? value
        .map((item) => ({
          value: item?.value || "",
          label: item?.label || ""
        }))
        .filter((item) => item.value && item.label)
    : [];
}

function buildLegacyContactFormFields(source: Partial<HomeContentState["contactSection"]> | undefined) {
  const fallbackFields = createDefaultContactFormFields();
  const legacyFields = source?.fields;
  const legacyConfig = source?.fieldConfig;
  const interestOptions = Array.isArray(source?.interestOptions)
    ? normalizeFormFieldOptions(source.interestOptions)
    : fallbackFields.find((item) => item.key === "interest")?.options || createDefaultInterestOptions();

  return fallbackFields.map((item) => {
    if (item.key === "interest") {
      return {
        ...item,
        label: legacyFields?.interestLabel || item.label,
        placeholder: legacyFields?.chooseOne || item.placeholder,
        enabled: legacyConfig?.interest?.enabled ?? item.enabled,
        required: legacyConfig?.interest?.required ?? item.required,
        options: interestOptions
      };
    }

    if (item.key === "message") {
      return {
        ...item,
        label: legacyFields?.messageLabel || item.label,
        placeholder: legacyFields?.messagePlaceholder || item.placeholder,
        enabled: legacyConfig?.message?.enabled ?? item.enabled,
        required: legacyConfig?.message?.required ?? item.required
      };
    }

    if (item.key === "name") {
      return {
        ...item,
        label: legacyFields?.nameLabel || item.label,
        placeholder: legacyFields?.namePlaceholder || item.placeholder,
        enabled: legacyConfig?.name?.enabled ?? item.enabled,
        required: legacyConfig?.name?.required ?? item.required
      };
    }

    if (item.key === "email") {
      return {
        ...item,
        label: legacyFields?.emailLabel || item.label,
        placeholder: legacyFields?.emailPlaceholder || item.placeholder,
        enabled: legacyConfig?.email?.enabled ?? item.enabled,
        required: legacyConfig?.email?.required ?? item.required
      };
    }

    if (item.key === "phone") {
      return {
        ...item,
        label: legacyFields?.phoneLabel || item.label,
        placeholder: legacyFields?.phonePlaceholder || item.placeholder,
        enabled: legacyConfig?.phone?.enabled ?? item.enabled,
        required: legacyConfig?.phone?.required ?? item.required
      };
    }

    return {
      ...item,
      label: legacyFields?.companyLabel || item.label,
      placeholder: legacyFields?.companyPlaceholder || item.placeholder,
      enabled: legacyConfig?.company?.enabled ?? item.enabled,
      required: legacyConfig?.company?.required ?? item.required
    };
  });
}

function normalizeContactFormFields(source: Partial<HomeContentState["contactSection"]> | undefined) {
  if (!Array.isArray(source?.formFields) || !source.formFields.length) {
    return buildLegacyContactFormFields(source);
  }

  return source.formFields.map((item, index) => ({
    id: item?.id || `contact-field-${index + 1}`,
    key: item?.key || `field_${index + 1}`,
    type: item?.type || "text",
    label: item?.label || "",
    placeholder: item?.placeholder || "",
    enabled: item?.enabled ?? true,
    required: item?.required ?? false,
    options: normalizeFormFieldOptions(item?.options)
  }));
}

function createDefaultHomeContent(): HomeContentState {
  const defaultInterestOptions = createDefaultInterestOptions();

  return {
    heroSlides: [],
    highlights: [
      "Multi-category catalog",
      "Wholesale-ready inquiry flow",
      "Video content support",
      "SEO-first content structure"
    ],
    productSection: {
      eyebrow: "Featured Products",
      title: "Featured Products",
      text: "",
      detailsLabel: "View Details",
      moreLabel: "More Products"
    },
    featuredProductSlugs: [],
    videoSection: {
      eyebrow: "Video Guides",
      title: "Tutorial Videos",
      text: "",
      featuredCtaLabel: "Watch Tutorial",
      moreLabel: "More Videos"
    },
    featuredVideoSlugs: [],
    categorySection: {
      eyebrow: "Category Layout",
      title: "A homepage that can scale across multiple sports categories.",
      text: "",
      moreLabel: "More Categories"
    },
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
    contactSection: {
      eyebrow: "Feedback",
      title: "Feedback",
      text: "",
      successMessage: "Thanks. We will get back to you soon.",
      formFields: createDefaultContactFormFields(),
      fields: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "name@email.com",
        phoneLabel: "Phone",
        phonePlaceholder: "Your phone number",
        companyLabel: "Company",
        companyPlaceholder: "Your company name",
        interestLabel: "Main Interest",
        chooseOne: "Choose one",
        messageLabel: "Message",
        messagePlaceholder: "Tell us what style or product direction you want to keep.",
        submitLabel: "Send Feedback"
      },
      fieldConfig: {
        name: { enabled: true, required: true },
        email: { enabled: true, required: true },
        phone: { enabled: false, required: false },
        company: { enabled: false, required: false },
        interest: { enabled: true, required: true },
        message: { enabled: true, required: true }
      },
      interestOptions: [
        ...defaultInterestOptions
      ]
    },
    sectionToggles: [
      { key: "hero", label: "首屏轮播", enabled: true },
      { key: "videos", label: "视频模块", enabled: true },
      { key: "products", label: "精选商品", enabled: true },
      { key: "categories", label: "分类模块", enabled: true },
      { key: "reviews", label: "评价模块", enabled: true },
      { key: "contact", label: "联系模块", enabled: true }
    ]
  };
}

function createDefaultBrandStory(): BrandStoryState {
  return {
    metaTitle: "",
    metaDescription: "",
    heroEyebrow: "",
    heroTitle: "",
    heroText: "",
    storyParagraphs: [],
    stats: [],
    highlights: [],
    categoryEyebrow: "",
    categoryTitle: "",
    categoryText: ""
  };
}

function createDefaultBlogPage(): BlogPageState {
  return {
    metaTitle: "Blog | MaxPlus Sporting Goods",
    metaDescription:
      "Browse MaxPlus blog articles for buying guides, training notes, merchandising ideas, and catalog planning updates.",
    heroEyebrow: "Brand Blog",
    heroTitle: "Blog",
    heroText: "Buying guides, training notes, and product planning ideas for a stronger sporting goods catalog.",
    allCategoriesLabel: "All Articles",
    searchPlaceholder: "Search articles by title, excerpt, or keyword",
    sortLatestLabel: "Newest First",
    sortOldestLabel: "Oldest First",
    resultsLabel: "articles",
    categoriesLabel: "categories",
    updatedLabel: "Latest update",
    readMoreLabel: "Read Article",
    emptyTitle: "No blog content matches the current filters.",
    emptyText: "Adjust the category or search keyword, or publish more articles from the admin panel.",
    previousLabel: "Previous",
    nextLabel: "Next",
    perPage: 6
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
          eyebrow: item?.eyebrow || "",
          title: item?.title || "",
          subtitle: item?.subtitle || "",
          targetUrl: item?.targetUrl || "/products",
          primaryLabel: item?.primaryLabel || "Explore Products",
          secondaryLabel: item?.secondaryLabel || "",
          secondaryTargetUrl: item?.secondaryTargetUrl || "",
          imageUrl: item?.imageUrl || "",
          enabled: item?.enabled ?? true
        }))
      : fallback.heroSlides,
    highlights: Array.isArray(source.highlights) ? source.highlights : fallback.highlights,
    productSection: {
      ...fallback.productSection,
      ...(source.productSection ?? {})
    },
    featuredProductSlugs: Array.isArray(source.featuredProductSlugs)
      ? source.featuredProductSlugs
      : fallback.featuredProductSlugs,
    videoSection: {
      ...fallback.videoSection,
      ...(source.videoSection ?? {})
    },
    featuredVideoSlugs: Array.isArray(source.featuredVideoSlugs)
      ? source.featuredVideoSlugs
      : fallback.featuredVideoSlugs,
    categorySection: {
      ...fallback.categorySection,
      ...(source.categorySection ?? {})
    },
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
    contactSection: {
      ...fallback.contactSection,
      ...(source.contactSection ?? {}),
      formFields: normalizeContactFormFields(source.contactSection),
      fields: {
        ...fallback.contactSection.fields,
        ...(source.contactSection?.fields ?? {})
      },
      fieldConfig: {
        ...fallback.contactSection.fieldConfig,
        ...(source.contactSection?.fieldConfig ?? {}),
        name: {
          ...fallback.contactSection.fieldConfig.name,
          ...(source.contactSection?.fieldConfig?.name ?? {})
        },
        email: {
          ...fallback.contactSection.fieldConfig.email,
          ...(source.contactSection?.fieldConfig?.email ?? {})
        },
        phone: {
          ...fallback.contactSection.fieldConfig.phone,
          ...(source.contactSection?.fieldConfig?.phone ?? {})
        },
        company: {
          ...fallback.contactSection.fieldConfig.company,
          ...(source.contactSection?.fieldConfig?.company ?? {})
        },
        interest: {
          ...fallback.contactSection.fieldConfig.interest,
          ...(source.contactSection?.fieldConfig?.interest ?? {})
        },
        message: {
          ...fallback.contactSection.fieldConfig.message,
          ...(source.contactSection?.fieldConfig?.message ?? {})
        }
      },
      interestOptions: Array.isArray(source.contactSection?.interestOptions)
        ? source.contactSection.interestOptions
            .map((item) => ({
              value: item?.value || "",
              label: item?.label || ""
            }))
            .filter((item) => item.value && item.label)
        : fallback.contactSection.interestOptions
    },
    sectionToggles: fallback.sectionToggles.map((item) => {
      const matched = Array.isArray(source.sectionToggles)
        ? source.sectionToggles.find((entry) => entry?.key === item.key)
        : null;

      return {
        key: item.key,
        label: matched?.label || item.label,
        enabled: matched?.enabled ?? item.enabled
      };
    })
  };
}

function normalizeBrandStory(value?: Partial<BrandStoryState> | null): BrandStoryState {
  const fallback = createDefaultBrandStory();
  const source = value ?? {};

  return {
    ...fallback,
    ...source,
    storyParagraphs: Array.isArray(source.storyParagraphs)
      ? source.storyParagraphs.map((item) => item || "")
      : fallback.storyParagraphs,
    stats: Array.isArray(source.stats)
      ? source.stats.map((item, index) => ({
          id: item?.id || `brand-stat-${index + 1}`,
          value: item?.value || "",
          label: item?.label || ""
        }))
      : fallback.stats,
    highlights: Array.isArray(source.highlights)
      ? source.highlights.map((item, index) => ({
          id: item?.id || `brand-highlight-${index + 1}`,
          tag: item?.tag || "",
          title: item?.title || "",
          text: item?.text || ""
        }))
      : fallback.highlights
  };
}

function normalizeBlogPage(value?: Partial<BlogPageState> | null): BlogPageState {
  const fallback = createDefaultBlogPage();
  const source = value ?? {};

  return {
    metaTitle: source.metaTitle?.trim() || fallback.metaTitle,
    metaDescription: source.metaDescription?.trim() || fallback.metaDescription,
    heroEyebrow: source.heroEyebrow?.trim() || fallback.heroEyebrow,
    heroTitle: source.heroTitle?.trim() || fallback.heroTitle,
    heroText: source.heroText?.trim() || fallback.heroText,
    allCategoriesLabel: source.allCategoriesLabel?.trim() || fallback.allCategoriesLabel,
    searchPlaceholder: source.searchPlaceholder?.trim() || fallback.searchPlaceholder,
    sortLatestLabel: source.sortLatestLabel?.trim() || fallback.sortLatestLabel,
    sortOldestLabel: source.sortOldestLabel?.trim() || fallback.sortOldestLabel,
    resultsLabel: source.resultsLabel?.trim() || fallback.resultsLabel,
    categoriesLabel: source.categoriesLabel?.trim() || fallback.categoriesLabel,
    updatedLabel: source.updatedLabel?.trim() || fallback.updatedLabel,
    readMoreLabel: source.readMoreLabel?.trim() || fallback.readMoreLabel,
    emptyTitle: source.emptyTitle?.trim() || fallback.emptyTitle,
    emptyText: source.emptyText?.trim() || fallback.emptyText,
    previousLabel: source.previousLabel?.trim() || fallback.previousLabel,
    nextLabel: source.nextLabel?.trim() || fallback.nextLabel,
    perPage:
      typeof source.perPage === "number" && source.perPage >= 3 && source.perPage <= 24
        ? Math.round(source.perPage)
        : fallback.perPage
  };
}

export const useSettingsStore = defineStore("settings", () => {
  const siteSettings = ref<SiteSettingsState>(createDefaultSiteSettings());
  const homeContent = ref<HomeContentState>(createDefaultHomeContent());
  const subscribePopup = ref<SubscribePopupState>(createDefaultSubscribePopup());
  const blogPage = ref<BlogPageState>(createDefaultBlogPage());
  const brandStory = ref<BrandStoryState>(createDefaultBrandStory());
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

  const hydrate = (
    payload: Pick<
      AdminBootstrapPayload,
      "siteSettings" | "homeContent" | "subscribePopup" | "blogPage" | "brandStory" | "seoSettings"
    >
  ) => {
    siteSettings.value = normalizeSiteSettings(payload.siteSettings);
    homeContent.value = normalizeHomeContent(payload.homeContent);
    subscribePopup.value = normalizeSubscribePopup(payload.subscribePopup);
    blogPage.value = normalizeBlogPage(payload.blogPage);
    brandStory.value = normalizeBrandStory(payload.brandStory);
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
      siteSettings.value = normalizeSiteSettings(saveMockSiteSettings(siteSettings.value));
      return;
    }

    siteSettings.value = normalizeSiteSettings(
      await apiPost<SiteSettingsState>("/admin/site/save", siteSettings.value, {
        token: getToken(),
        secure: true
      })
    );
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

  const saveBlogPage = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      blogPage.value = normalizeBlogPage(saveMockBlogPage(blogPage.value));
      return;
    }

    blogPage.value = normalizeBlogPage(
      await apiPost<BlogPageState>("/admin/blog-page/save", blogPage.value, {
        token: getToken()
      })
    );
  };

  const saveBrandStory = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      brandStory.value = normalizeBrandStory(saveMockBrandStory(brandStory.value));
      return;
    }

    brandStory.value = normalizeBrandStory(
      await apiPost<BrandStoryState>("/admin/brand-story/save", brandStory.value, {
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

  const saveSubscribePopup = async () => {
    const sessionStore = useSessionStore();

    if (sessionStore.isMockMode) {
      subscribePopup.value = normalizeSubscribePopup(saveMockSubscribePopup(subscribePopup.value));
      return;
    }

    subscribePopup.value = normalizeSubscribePopup(
      await apiPost<SubscribePopupState>("/admin/subscribe-popup/save", subscribePopup.value, {
        token: getToken()
      })
    );
  };

  return {
    siteSettings,
    homeContent,
    subscribePopup,
    blogPage,
    brandStory,
    seoSettings,
    hydrate,
    saveSiteSettings,
    saveHomeContent,
    saveSubscribePopup,
    saveBlogPage,
    saveBrandStory,
    saveSeoSettings
  };
});
