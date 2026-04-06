import {
  blogPosts as defaultBlogs,
  defaultBrandStoryContent
} from "../../data/catalog";
import { siteContent as defaultSiteContent } from "../../data/siteContent.en";
import type {
  BlogCategory,
  BlogPageContent,
  CatalogCategory
} from "../../types/catalog";
import type { BrandStoryContent } from "../../types/content";
import type { RawSeoSettings } from "./types";
import { cloneValue } from "./utils";

export const defaultPublicSeo: RawSeoSettings = {
  globalTitle: defaultSiteContent.meta.title,
  globalDescription: defaultSiteContent.meta.description,
  blogTemplate: "{post} | MaxPlus Blog"
};

export const defaultBlogPageContent: BlogPageContent = {
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

export function buildDefaultBlogCategories(): BlogCategory[] {
  const names = Array.from(new Set(defaultBlogs.map((item) => item.category).filter(Boolean)));

  return names.map((name, index) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `blog-${index + 1}`,
    title: name,
    description: "",
    sortOrder: index + 1,
    seoTitle: name
  }));
}

export function buildDefaultBrandStory(): BrandStoryContent {
  return cloneValue(defaultBrandStoryContent);
}

export function buildDefaultCategoryFilterConfig(): CatalogCategory["filterConfig"] {
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
