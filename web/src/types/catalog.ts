export interface CategoryStat {
  value: string;
  label: string;
}

export interface CategoryFilterConfig {
  sportLabel: string;
  audienceLabel: string;
  useCaseLabel: string;
  stockLabel: string;
  sortLabel: string;
  allLabel: string;
  sortDefaultLabel: string;
  sortLatestLabel: string;
  sortPriceAscLabel: string;
  sortPriceDescLabel: string;
  sortBestSellingLabel: string;
}

export interface CatalogCategory {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  bannerTitle: string;
  bannerText: string;
  filterConfig: CategoryFilterConfig;
  visualClass: string;
  highlights: string[];
  stats: CategoryStat[];
}

export interface VideoCategory {
  slug: string;
  title: string;
  parentTitle?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface CatalogProduct {
  slug: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  tag: string;
  summary: string;
  description: string;
  price: string;
  referencePrice: string;
  stockStatus: "In Stock" | "Limited Stock" | "Made To Order";
  sku: string;
  orderMinimum: string;
  leadTime: string;
  sportType: string;
  audience: string;
  useCase: string;
  visualClass: string;
  galleryClasses: string[];
  heroImage?: string;
  galleryImages?: string[];
  highlights: string[];
  specifications: ProductSpecification[];
  applications: string[];
  shipping: string;
  support: string;
  relatedSlugs: string[];
  featured?: boolean;
  buyButtonLabel?: string;
  buyButtonUrl?: string;
}

export interface TutorialVideo {
  slug: string;
  tag: string;
  title: string;
  duration: string;
  summary: string;
  visualClass: string;
  coverImage?: string;
  videoUrl: string;
  categorySlug: string;
  topicSlug: string;
  topicLabel: string;
  featured?: boolean;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
  sortOrder?: number;
  seoTitle?: string;
}

export interface BlogPageContent {
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

export interface BlogPost {
  slug: string;
  categorySlug?: string;
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  body: string[];
  bodyHtml?: string;
  author?: string;
  publishDate?: string;
  coverImage?: string;
}

export interface PolicySection {
  title: string;
  items: string[];
}

export interface PolicyDocument {
  type: string;
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: PolicySection[];
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface SearchSuggestion {
  label: string;
  href: string;
}
