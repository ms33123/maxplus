import type {
  BlogCategory,
  BlogPageContent,
  BlogPost
} from "../../types/catalog";
import { defaultBlogPageContent } from "./defaults";
import type {
  RawBlog,
  RawBlogCategory,
  RawBlogPage
} from "./types";
import { escapeHtml } from "./utils";

function buildBlogHtml(
  rawBodyHtml: string | undefined,
  rawBody: string[] | undefined,
  excerpt: string
) {
  const bodyHtml = rawBodyHtml?.trim() || "";

  if (bodyHtml) {
    return bodyHtml;
  }

  const paragraphs = rawBody?.length ? rawBody : excerpt ? [excerpt] : [];

  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

export function buildMappedBlogCategories(rawCategories: RawBlogCategory[] = []): BlogCategory[] {
  return rawCategories.map((item, index) => ({
    slug: item.slug,
    title: item.name,
    description: item.description || "",
    sortOrder: item.sortOrder ?? index + 1,
    seoTitle: item.seoTitle || item.name
  }));
}

export function buildMappedBlogs(
  rawBlogs: RawBlog[] = [],
  rawCategories: RawBlogCategory[] = []
): BlogPost[] {
  const categoryMap = new Map(rawCategories.map((item) => [item.id, item]));

  return rawBlogs.map((item) => ({
    categorySlug: item.categoryId ? categoryMap.get(item.categoryId)?.slug || "" : "",
    slug: item.slug,
    category: (item.categoryId ? categoryMap.get(item.categoryId)?.name : "") || item.category,
    title: item.title,
    excerpt: item.excerpt,
    meta: item.meta || "",
    body: item.body?.length ? item.body : item.excerpt ? [item.excerpt] : [],
    bodyHtml: buildBlogHtml(item.bodyHtml, item.body, item.excerpt),
    author: item.author || "",
    publishDate: item.publishDate || "",
    coverImage: item.coverImage || ""
  }));
}

export function buildBlogPageContent(raw?: RawBlogPage | null): BlogPageContent {
  const source = raw ?? ({} as RawBlogPage);

  return {
    metaTitle: source.metaTitle?.trim() || defaultBlogPageContent.metaTitle,
    metaDescription: source.metaDescription?.trim() || defaultBlogPageContent.metaDescription,
    heroEyebrow: source.heroEyebrow?.trim() || defaultBlogPageContent.heroEyebrow,
    heroTitle: source.heroTitle?.trim() || defaultBlogPageContent.heroTitle,
    heroText: source.heroText?.trim() || defaultBlogPageContent.heroText,
    allCategoriesLabel: source.allCategoriesLabel?.trim() || defaultBlogPageContent.allCategoriesLabel,
    searchPlaceholder: source.searchPlaceholder?.trim() || defaultBlogPageContent.searchPlaceholder,
    sortLatestLabel: source.sortLatestLabel?.trim() || defaultBlogPageContent.sortLatestLabel,
    sortOldestLabel: source.sortOldestLabel?.trim() || defaultBlogPageContent.sortOldestLabel,
    resultsLabel: source.resultsLabel?.trim() || defaultBlogPageContent.resultsLabel,
    categoriesLabel: source.categoriesLabel?.trim() || defaultBlogPageContent.categoriesLabel,
    updatedLabel: source.updatedLabel?.trim() || defaultBlogPageContent.updatedLabel,
    readMoreLabel: source.readMoreLabel?.trim() || defaultBlogPageContent.readMoreLabel,
    emptyTitle: source.emptyTitle?.trim() || defaultBlogPageContent.emptyTitle,
    emptyText: source.emptyText?.trim() || defaultBlogPageContent.emptyText,
    previousLabel: source.previousLabel?.trim() || defaultBlogPageContent.previousLabel,
    nextLabel: source.nextLabel?.trim() || defaultBlogPageContent.nextLabel,
    perPage:
      typeof source.perPage === "number" && source.perPage >= 3 && source.perPage <= 24
        ? Math.round(source.perPage)
        : defaultBlogPageContent.perPage
  };
}
