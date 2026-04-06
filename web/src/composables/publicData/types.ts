import type { CatalogCategory } from "../../types/catalog";

export interface RawSocialLink {
  name: string;
  url: string;
}

export interface RawSiteTheme {
  preset?: "default" | "christmas";
  effectsEnabled?: boolean;
}

export interface RawSiteSettings {
  brand: {
    brandName: string;
    siteTitle: string;
    siteDescription: string;
    supportEmail: string;
    salesEmail: string;
    phone: string;
    defaultLanguage: string;
  };
  socials: RawSocialLink[];
  theme?: RawSiteTheme;
  footer?: {
    text?: string;
    meta1?: string;
    meta2?: string;
  };
}

export interface RawHomeContent {
  heroSlides: Array<{
    id: string;
    eyebrow?: string;
    title: string;
    subtitle: string;
    targetUrl: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    secondaryTargetUrl?: string;
    imageUrl: string;
    enabled: boolean;
  }>;
  productSection: {
    eyebrow?: string;
    title?: string;
    text?: string;
    detailsLabel?: string;
    moreLabel?: string;
  };
  featuredProductSlugs: string[];
  videoSection: {
    eyebrow?: string;
    title?: string;
    text?: string;
    featuredCtaLabel?: string;
    moreLabel?: string;
  };
  featuredVideoSlugs: string[];
  categorySection: {
    eyebrow?: string;
    title?: string;
    text?: string;
    moreLabel?: string;
  };
  reviews: {
    eyebrow: string;
    title: string;
    text: string;
    displayMode: "text" | "image";
    summary: {
      label: string;
      value: string;
      detail: string;
      metrics: Array<{ value: string; label: string }>;
    };
    items: Array<{
      id: string;
      quote: string;
      rating: number;
      author: string;
      meta: string;
      imageUrl: string;
    }>;
  };
  contactSection: {
    eyebrow?: string;
    title?: string;
    text?: string;
    successMessage?: string;
    formFields?: Array<{
      id?: string;
      key?: string;
      type?: "text" | "email" | "tel" | "textarea" | "select";
      label?: string;
      placeholder?: string;
      enabled?: boolean;
      required?: boolean;
      options?: Array<{
        value?: string;
        label?: string;
      }>;
    }>;
    fields?: {
      nameLabel?: string;
      namePlaceholder?: string;
      emailLabel?: string;
      emailPlaceholder?: string;
      phoneLabel?: string;
      phonePlaceholder?: string;
      companyLabel?: string;
      companyPlaceholder?: string;
      interestLabel?: string;
      chooseOne?: string;
      messageLabel?: string;
      messagePlaceholder?: string;
      submitLabel?: string;
    };
    fieldConfig?: {
      name?: { enabled?: boolean; required?: boolean };
      email?: { enabled?: boolean; required?: boolean };
      phone?: { enabled?: boolean; required?: boolean };
      company?: { enabled?: boolean; required?: boolean };
      interest?: { enabled?: boolean; required?: boolean };
      message?: { enabled?: boolean; required?: boolean };
    };
    interestOptions?: Array<{
      value?: string;
      label?: string;
    }>;
  };
  sectionToggles: Array<{
    key: string;
    label: string;
    enabled: boolean;
  }>;
}

export interface RawBrandStory {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  storyParagraphs: string[];
  stats: Array<{ id?: string; value: string; label: string }>;
  highlights: Array<{ id?: string; tag: string; title: string; text: string }>;
  categoryEyebrow: string;
  categoryTitle: string;
  categoryText: string;
}

export interface RawSubscribePopup {
  enabled?: boolean;
  stylePreset?: "classic-button" | "classic-gift" | "sport-burst" | "midnight-gift";
  toggleLabel?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  benefitsTitle?: string;
  benefits?: string[];
  submitLabel?: string;
  successMessage?: string;
  sourceLabel?: string;
  formFields?: Array<{
    id?: string;
    key?: string;
    type?: "text" | "email" | "tel" | "textarea" | "select";
    label?: string;
    placeholder?: string;
    enabled?: boolean;
    required?: boolean;
    options?: Array<{
      value?: string;
      label?: string;
    }>;
  }>;
}

export interface RawCategory {
  id: string;
  name: string;
  slug: string;
  parent?: string;
  eyebrow?: string;
  summary: string;
  bannerTitle?: string;
  bannerText?: string;
  filterConfig?: Partial<CatalogCategory["filterConfig"]>;
  visualClass?: string;
  highlights?: string[];
  stats?: Array<{ value: string; label: string }>;
}

export interface RawProduct {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  sku: string;
  tags?: string[];
  price: number;
  compareAtPrice: number;
  stock: number;
  heroImage: string;
  gallery: string[];
  summary: string;
  description?: string;
  tagLabel?: string;
  orderMinimum?: string;
  leadTime?: string;
  sportType?: string;
  audience?: string;
  useCase?: string;
  visualClass?: string;
  highlights?: string[];
  specifications?: Array<{ label: string; value: string }>;
  applications?: string[];
  shipping?: string;
  support?: string;
  relatedSlugs?: string[];
  featured?: boolean;
  buyButtonLabel?: string;
  buyButtonUrl?: string;
}

export interface RawVideo {
  slug: string;
  categoryId: string;
  title: string;
  topic: string;
  topicSlug?: string;
  duration: string;
  cover: string;
  videoUrl: string;
  summary: string;
  tagLabel?: string;
  visualClass?: string;
  featured?: boolean;
}

export interface RawBlogCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder?: number;
  description?: string;
  seoTitle?: string;
}

export interface RawBlogPage {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  allCategoriesLabel: string;
  searchPlaceholder: string;
  sortLatestLabel: string;
  sortOldestLabel: string;
  resultsLabel: string;
  categoriesLabel: string;
  updatedLabel: string;
  readMoreLabel: string;
  emptyTitle: string;
  emptyText: string;
  previousLabel: string;
  nextLabel: string;
  perPage: number;
}

export interface RawBlog {
  categoryId?: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  meta?: string;
  body?: string[];
  bodyHtml?: string;
  author?: string;
  publishDate?: string;
  coverImage?: string;
}

export interface RawSeoSettings {
  globalTitle: string;
  globalDescription: string;
  blogTemplate?: string;
}

export interface PublicBootstrapPayload {
  siteSettings: RawSiteSettings;
  homeContent: RawHomeContent;
  subscribePopup: RawSubscribePopup;
  brandStory: RawBrandStory;
  blogPage: RawBlogPage;
  seo: RawSeoSettings;
  categories: RawCategory[];
  videoCategories: RawCategory[];
  blogCategories: RawBlogCategory[];
  products: RawProduct[];
  videos: RawVideo[];
  blogs: RawBlog[];
}
