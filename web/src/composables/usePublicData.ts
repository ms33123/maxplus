import { computed, ref } from "vue";
import { apiPost } from "../services/http";
import { blogPosts as defaultBlogs, catalogCategories as defaultCategories, catalogProducts as defaultProducts, tutorialVideos as defaultVideos } from "../data/catalog";
import { siteContent as defaultSiteContent } from "../data/siteContent.en";
import type { BlogPost, CatalogCategory, CatalogProduct, TutorialVideo } from "../types/catalog";
import type { SiteContent } from "../types/content";

interface RawSocialLink {
  name: string;
  url: string;
}

interface RawSiteSettings {
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
  footer?: {
    text?: string;
    meta1?: string;
    meta2?: string;
  };
}

interface RawHomeContent {
  heroSlides: Array<{
    id: string;
    title: string;
    subtitle: string;
    targetUrl: string;
    imageUrl: string;
    enabled: boolean;
  }>;
  featuredProductSlugs: string[];
  featuredVideoSlugs: string[];
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
  sectionToggles: Array<{
    key: string;
    label: string;
    enabled: boolean;
  }>;
}

interface RawCategory {
  id: string;
  name: string;
  slug: string;
  summary: string;
  bannerTitle?: string;
  bannerText?: string;
  visualClass?: string;
  highlights?: string[];
  stats?: Array<{ value: string; label: string }>;
}

interface RawProduct {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  sku: string;
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

interface RawVideo {
  slug: string;
  categoryId: string;
  title: string;
  topic: string;
  topicSlug?: string;
  duration: string;
  summary: string;
  tagLabel?: string;
  visualClass?: string;
  featured?: boolean;
}

interface RawBlog {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  meta?: string;
  body?: string[];
}

interface PublicBootstrapPayload {
  siteSettings: RawSiteSettings;
  homeContent: RawHomeContent;
  seo: {
    globalTitle: string;
    globalDescription: string;
  };
  categories: RawCategory[];
  products: RawProduct[];
  videos: RawVideo[];
  blogs: RawBlog[];
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function formatPrice(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function formatComparePrice(value: number): string {
  return Number.isInteger(value) ? `$${value} MSRP` : `$${value.toFixed(2)} MSRP`;
}

function mapStockStatus(stock: number): CatalogProduct["stockStatus"] {
  if (stock > 100) {
    return "In Stock";
  }

  if (stock > 0) {
    return "Limited Stock";
  }

  return "Made To Order";
}

function inferGalleryClasses(product: RawProduct): string[] {
  if (product.visualClass?.includes("cones")) {
    return [
      "catalog-gallery__item--cone-main",
      "catalog-gallery__item--cone-session",
      "catalog-gallery__item--cone-pack"
    ];
  }

  if (product.visualClass?.includes("bands")) {
    return [
      "catalog-gallery__item--band-main",
      "catalog-gallery__item--band-routine",
      "catalog-gallery__item--band-pack"
    ];
  }

  if (product.visualClass?.includes("balls")) {
    return [
      "catalog-gallery__item--ball-main",
      "catalog-gallery__item--ball-club",
      "catalog-gallery__item--ball-pack"
    ];
  }

  return [
    "catalog-gallery__item--net-main",
    "catalog-gallery__item--net-detail",
    "catalog-gallery__item--net-pack"
  ];
}

const defaultHomeContent: RawHomeContent = {
  heroSlides: [],
  featuredProductSlugs: [],
  featuredVideoSlugs: [],
  reviews: {
    eyebrow: defaultSiteContent.reviews.eyebrow,
    title: defaultSiteContent.reviews.title,
    text: defaultSiteContent.reviews.text,
    displayMode: defaultSiteContent.reviews.displayMode,
    summary: cloneValue(defaultSiteContent.reviews.summary),
    items: cloneValue(defaultSiteContent.reviews.items)
  },
  sectionToggles: [
    { key: "hero", label: "首屏轮播", enabled: true },
    { key: "videos", label: "视频模块", enabled: true },
    { key: "products", label: "精选商品", enabled: true },
    { key: "reviews", label: "评价模块", enabled: true },
    { key: "contact", label: "联系模块", enabled: true }
  ]
};

function buildMappedCategories(rawCategories: RawCategory[]): CatalogCategory[] {
  return rawCategories.map((item) => ({
    slug: item.slug,
    title: item.name,
    eyebrow: "Category",
    summary: item.summary,
    bannerTitle: item.bannerTitle || item.name,
    bannerText: item.bannerText || item.summary,
    visualClass: item.visualClass || "catalog-hero__visual--team",
    highlights: item.highlights?.length ? item.highlights : [item.summary],
    stats: item.stats?.length ? item.stats : [{ value: "Live", label: "category" }]
  }));
}

function buildMappedProducts(
  rawProducts: RawProduct[],
  rawCategories: RawCategory[]
): CatalogProduct[] {
  const categoryMap = new Map(rawCategories.map((item) => [item.id, item]));

  return rawProducts.map((item) => {
    const category = categoryMap.get(item.categoryId);

    return {
      slug: item.slug,
      title: item.title,
      categorySlug: category?.slug || "",
      categoryLabel: category?.name || "Catalog",
      tag: item.tagLabel || "Catalog",
      summary: item.summary,
      description: item.description || item.summary,
      price: formatPrice(item.price),
      referencePrice: formatComparePrice(item.compareAtPrice),
      stockStatus: mapStockStatus(item.stock),
      sku: item.sku,
      orderMinimum: item.orderMinimum || "24 sets",
      leadTime: item.leadTime || "10-15 business days",
      sportType: item.sportType || "Multi-Sport",
      audience: item.audience || "Retail / Wholesale",
      useCase: item.useCase || "Catalog Entry",
      visualClass: item.visualClass || "product-card__visual--net",
      galleryClasses: inferGalleryClasses(item),
      heroImage: item.heroImage || "",
      galleryImages: item.gallery?.length ? item.gallery : item.heroImage ? [item.heroImage] : [],
      highlights: item.highlights?.length ? item.highlights : [item.summary],
      specifications:
        item.specifications?.length
          ? item.specifications
          : [
              { label: "SKU", value: item.sku },
              { label: "Status", value: mapStockStatus(item.stock) }
            ],
      applications: item.applications?.length ? item.applications : [item.useCase || "General use"],
      shipping: item.shipping || "Standard export packaging available.",
      support: item.support || "Wholesale support available on request.",
      relatedSlugs: item.relatedSlugs?.length ? item.relatedSlugs : [],
      featured: Boolean(item.featured),
      buyButtonLabel: item.buyButtonLabel || "Go To Buy",
      buyButtonUrl: item.buyButtonUrl || "/buy"
    };
  });
}

function buildMappedVideos(rawVideos: RawVideo[], rawCategories: RawCategory[]): TutorialVideo[] {
  const categoryMap = new Map(rawCategories.map((item) => [item.id, item]));

  return rawVideos.map((item) => ({
    slug: item.slug,
    tag: item.tagLabel || item.topic,
    title: item.title,
    duration: item.duration,
    summary: item.summary,
    visualClass: item.visualClass || "video-card__media--net",
    categorySlug: categoryMap.get(item.categoryId)?.slug || "",
    topicSlug: item.topicSlug || item.topic.toLowerCase(),
    topicLabel: item.topic,
    featured: Boolean(item.featured)
  }));
}

function buildMappedBlogs(rawBlogs: RawBlog[]): BlogPost[] {
  return rawBlogs.map((item) => ({
    slug: item.slug,
    category: item.category,
    title: item.title,
    excerpt: item.excerpt,
    meta: item.meta || "",
    body: item.body?.length ? item.body : [item.excerpt]
  }));
}

function buildSiteContent(payload: PublicBootstrapPayload, categories: CatalogCategory[], products: CatalogProduct[], videos: TutorialVideo[]): SiteContent {
  const content = cloneValue(defaultSiteContent);
  const enabledHeroSlides = payload.homeContent.heroSlides.filter((item) => item.enabled);

  content.meta.title = payload.siteSettings.brand.siteTitle || content.meta.title;
  content.meta.description =
    payload.siteSettings.brand.siteDescription || payload.seo.globalDescription || content.meta.description;
  content.header.logoSub = payload.siteSettings.brand.brandName || content.header.logoSub;

  if (enabledHeroSlides.length) {
    content.hero.dotLabels = enabledHeroSlides.map((_, index) => `Show slide ${index + 1}`);
    content.hero.slides = enabledHeroSlides.map((item, index) => {
      const template = defaultSiteContent.hero.slides[index % defaultSiteContent.hero.slides.length];

      return {
        ...template,
        backgroundImage: item.imageUrl || template.backgroundImage,
        title: item.title || template.title,
        text: item.subtitle || template.text,
        actions: [
          {
            href: item.targetUrl || template.actions[0]?.href || "/products",
            label: template.actions[0]?.label || "Explore Products",
            kind: "primary"
          },
          ...(template.actions[1] ? [template.actions[1]] : [])
        ]
      };
    });
  }

  const featuredProducts = payload.homeContent.featuredProductSlugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter((item): item is CatalogProduct => Boolean(item));

  if (featuredProducts.length) {
    content.featured.items = featuredProducts.slice(0, 4).map((item) => ({
      tag: item.tag,
      title: item.title,
      text: item.summary,
      price: item.price,
      href: `/products/${item.slug}`,
      visualClass: item.visualClass,
      imageUrl: item.heroImage
    }));
  }

  content.categories.items = categories.map((item) => ({
    title: item.title,
    text: item.summary,
    href: `/categories/${item.slug}`
  }));

  const preferredVideos = payload.homeContent.featuredVideoSlugs
    .map((slug) => videos.find((item) => item.slug === slug))
    .filter((item): item is TutorialVideo => Boolean(item));
  const orderedVideos = preferredVideos.length
    ? [...preferredVideos, ...videos.filter((item) => !preferredVideos.some((entry) => entry.slug === item.slug))]
    : videos;

  if (orderedVideos.length) {
    const [featuredVideo, ...otherVideos] = orderedVideos;
    content.videos.featured = {
      eyebrow: featuredVideo.tag,
      title: featuredVideo.title,
      duration: featuredVideo.duration,
      href: "/videos",
      ctaLabel: "Watch Tutorial",
      visualClass: featuredVideo.visualClass
    };
    content.videos.items = otherVideos.slice(0, 3).map((item) => ({
      tag: item.tag,
      title: item.title,
      duration: item.duration,
      href: "/videos",
      visualClass: item.visualClass
    }));
  }

  if (payload.homeContent.reviews) {
    content.reviews = {
      eyebrow: payload.homeContent.reviews.eyebrow || content.reviews.eyebrow,
      title: payload.homeContent.reviews.title || content.reviews.title,
      text: payload.homeContent.reviews.text || content.reviews.text,
      displayMode: payload.homeContent.reviews.displayMode === "image" ? "image" : "text",
      summary: {
        label: payload.homeContent.reviews.summary?.label || content.reviews.summary.label,
        value: payload.homeContent.reviews.summary?.value || content.reviews.summary.value,
        detail: payload.homeContent.reviews.summary?.detail || content.reviews.summary.detail,
        metrics: payload.homeContent.reviews.summary?.metrics?.length
          ? payload.homeContent.reviews.summary.metrics.map((item) => ({
              value: item.value,
              label: item.label
            }))
          : content.reviews.summary.metrics
      },
      items: payload.homeContent.reviews.items?.length
        ? payload.homeContent.reviews.items.map((item, index) => ({
            id: item.id || `review-${index + 1}`,
            quote: item.quote,
            rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
            author: item.author || "Anonymous Buyer",
            meta: item.meta || "",
            imageUrl: item.imageUrl || ""
          }))
        : content.reviews.items
    };
  }

  content.footer.text = payload.siteSettings.footer?.text || content.footer.text;
  content.footer.meta1 = payload.siteSettings.footer?.meta1 || content.footer.meta1;
  content.footer.meta2 = payload.siteSettings.footer?.meta2 || content.footer.meta2;
  content.footer.contactLinks = [
    {
      href: `mailto:${payload.siteSettings.brand.salesEmail}`,
      label: payload.siteSettings.brand.salesEmail
    },
    {
      href: `tel:${payload.siteSettings.brand.phone.replace(/[^\d+]/g, "")}`,
      label: payload.siteSettings.brand.phone
    }
  ];
  if (payload.siteSettings.socials.length) {
    content.footer.socialLinks = payload.siteSettings.socials.map((item) => ({
      href: item.url,
      label: item.name
    }));
  }

  return content;
}

const siteContent = ref<SiteContent>(cloneValue(defaultSiteContent));
const categories = ref<CatalogCategory[]>(cloneValue(defaultCategories));
const products = ref<CatalogProduct[]>(cloneValue(defaultProducts));
const videos = ref<TutorialVideo[]>(cloneValue(defaultVideos));
const blogs = ref<BlogPost[]>(cloneValue(defaultBlogs));
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
    const mappedProducts = buildMappedProducts(data.products, data.categories);
    const mappedVideos = buildMappedVideos(data.videos, data.categories);
    const mappedBlogs = buildMappedBlogs(data.blogs);

    categories.value = mappedCategories;
    products.value = mappedProducts;
    videos.value = mappedVideos;
    blogs.value = mappedBlogs;
    siteSettings.value = data.siteSettings;
    homeContent.value = {
      ...cloneValue(defaultHomeContent),
      ...data.homeContent,
      reviews: {
        ...cloneValue(defaultHomeContent.reviews),
        ...(data.homeContent.reviews ?? {}),
        summary: {
          ...cloneValue(defaultHomeContent.reviews.summary),
          ...(data.homeContent.reviews?.summary ?? {}),
          metrics: data.homeContent.reviews?.summary?.metrics?.length
            ? data.homeContent.reviews.summary.metrics
            : cloneValue(defaultHomeContent.reviews.summary.metrics)
        },
        items: data.homeContent.reviews?.items?.length
          ? data.homeContent.reviews.items
          : cloneValue(defaultHomeContent.reviews.items)
      }
    };
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
  const productMap = computed(() => new Map(products.value.map((item) => [item.slug, item])));
  const blogMap = computed(() => new Map(blogs.value.map((item) => [item.slug, item])));

  const findCategoryBySlug = (slug: string) => categoryMap.value.get(slug);
  const findProductBySlug = (slug: string) => productMap.value.get(slug);
  const findBlogBySlug = (slug: string) => blogMap.value.get(slug);
  const getProductsByCategory = (slug: string) =>
    products.value.filter((item) => item.categorySlug === slug);
  const getRelatedProducts = (product: CatalogProduct) =>
    products.value.filter((item) => product.relatedSlugs.includes(item.slug));

  return {
    siteContent,
    categories,
    products,
    videos,
    blogs,
    siteSettings,
    homeContent,
    loading,
    error,
    loadPublicData,
    findCategoryBySlug,
    findProductBySlug,
    findBlogBySlug,
    getProductsByCategory,
    getRelatedProducts
  };
}
