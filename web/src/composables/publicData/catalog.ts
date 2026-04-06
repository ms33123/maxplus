import type {
  CatalogCategory,
  CatalogProduct,
  TutorialVideo,
  VideoCategory
} from "../../types/catalog";
import type { RawCategory, RawProduct, RawVideo } from "./types";
import { buildDefaultCategoryFilterConfig } from "./defaults";
import {
  formatComparePrice,
  formatPrice,
  inferGalleryClasses,
  mapStockStatus
} from "./utils";

export function buildMappedCategories(rawCategories: RawCategory[]): CatalogCategory[] {
  return rawCategories.map((item) => {
    const defaults = buildDefaultCategoryFilterConfig();
    const rawFilterConfig = item.filterConfig ?? defaults;

    return {
      slug: item.slug,
      title: item.name,
      eyebrow: item.eyebrow || "Category",
      summary: item.summary,
      bannerTitle: item.bannerTitle || item.name,
      bannerText: item.bannerText || item.summary,
      filterConfig: {
        sportLabel: rawFilterConfig.sportLabel?.trim() || defaults.sportLabel,
        audienceLabel: rawFilterConfig.audienceLabel?.trim() || defaults.audienceLabel,
        useCaseLabel: rawFilterConfig.useCaseLabel?.trim() || defaults.useCaseLabel,
        stockLabel: rawFilterConfig.stockLabel?.trim() || defaults.stockLabel,
        sortLabel: rawFilterConfig.sortLabel?.trim() || defaults.sortLabel,
        allLabel: rawFilterConfig.allLabel?.trim() || defaults.allLabel,
        sortDefaultLabel: rawFilterConfig.sortDefaultLabel?.trim() || defaults.sortDefaultLabel,
        sortLatestLabel: rawFilterConfig.sortLatestLabel?.trim() || defaults.sortLatestLabel,
        sortPriceAscLabel:
          rawFilterConfig.sortPriceAscLabel?.trim() || defaults.sortPriceAscLabel,
        sortPriceDescLabel:
          rawFilterConfig.sortPriceDescLabel?.trim() || defaults.sortPriceDescLabel,
        sortBestSellingLabel:
          rawFilterConfig.sortBestSellingLabel?.trim() || defaults.sortBestSellingLabel
      },
      visualClass: item.visualClass || "catalog-hero__visual--team",
      highlights: item.highlights?.length ? item.highlights : [item.summary],
      stats: item.stats?.length ? item.stats : [{ value: "Live", label: "category" }]
    };
  });
}

export function buildMappedVideoCategories(rawCategories: RawCategory[]): VideoCategory[] {
  return rawCategories.map((item) => ({
    slug: item.slug,
    title: item.name,
    parentTitle: item.parent && item.parent !== "顶级分类" ? item.parent : ""
  }));
}

export function buildMappedProducts(
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
      tag: item.tagLabel?.trim() || item.tags?.find((tag) => tag?.trim())?.trim() || "",
      summary: item.summary,
      description: item.description || item.summary,
      price: formatPrice(item.price),
      referencePrice: formatComparePrice(item.compareAtPrice),
      stockStatus: mapStockStatus(item.stock),
      sku: item.sku,
      orderMinimum: item.orderMinimum?.trim() || "",
      leadTime: item.leadTime?.trim() || "",
      sportType: item.sportType?.trim() || "",
      audience: item.audience?.trim() || "",
      useCase: item.useCase?.trim() || "",
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
      applications:
        item.applications?.length
          ? item.applications
          : item.useCase?.trim()
            ? [item.useCase.trim()]
            : [],
      shipping: item.shipping || "Standard export packaging available.",
      support: item.support || "Wholesale support available on request.",
      relatedSlugs: item.relatedSlugs?.length ? item.relatedSlugs : [],
      featured: Boolean(item.featured),
      buyButtonLabel: item.buyButtonLabel || "Go To Buy",
      buyButtonUrl: item.buyButtonUrl || "/buy"
    };
  });
}

export function buildMappedVideos(
  rawVideos: RawVideo[],
  rawCategories: RawCategory[]
): TutorialVideo[] {
  const categoryMap = new Map(rawCategories.map((item) => [item.id, item]));

  return rawVideos.map((item) => ({
    slug: item.slug,
    tag: item.tagLabel || item.topic,
    title: item.title,
    duration: item.duration,
    summary: item.summary,
    visualClass: item.visualClass || "video-card__media--net",
    coverImage: item.cover || "",
    videoUrl: item.videoUrl || "",
    categorySlug: categoryMap.get(item.categoryId)?.slug || "",
    topicSlug: item.topicSlug || item.topic.toLowerCase(),
    topicLabel: item.topic,
    featured: Boolean(item.featured)
  }));
}
