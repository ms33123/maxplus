export type AdminRole = "super-admin" | "operator" | "support";

export interface AdminSession {
  username: string;
  role: AdminRole;
  loggedInAt: string;
}

export interface BrandSettings {
  brandName: string;
  siteTitle: string;
  siteDescription: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
  whatsapp: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
  address: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface NotificationSettings {
  inquiryRecipients: string;
  subscriberRecipients: string;
  enableEmailNotice: boolean;
  enableSlackNotice: boolean;
}

export interface SiteSettingsState {
  brand: BrandSettings;
  socials: SocialLink[];
  notifications: NotificationSettings;
}

export interface HeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  targetUrl: string;
  imageUrl: string;
  enabled: boolean;
}

export interface HomeReviewMetric {
  value: string;
  label: string;
}

export interface HomeReviewSummary {
  label: string;
  value: string;
  detail: string;
  metrics: HomeReviewMetric[];
}

export interface HomeReviewItem {
  id: string;
  quote: string;
  rating: number;
  author: string;
  meta: string;
  imageUrl: string;
}

export interface HomeReviewsState {
  eyebrow: string;
  title: string;
  text: string;
  displayMode: "text" | "image";
  summary: HomeReviewSummary;
  items: HomeReviewItem[];
}

export interface HomeSectionToggle {
  key: string;
  label: string;
  enabled: boolean;
}

export interface HomeContentState {
  heroSlides: HeroSlideItem[];
  highlights: string[];
  featuredProductSlugs: string[];
  featuredVideoSlugs: string[];
  reviews: HomeReviewsState;
  sectionToggles: HomeSectionToggle[];
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parent: string;
  sortOrder: number;
  enabled: boolean;
  seoTitle: string;
}

export interface ProductRecord {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  weight: string;
  status: "draft" | "published" | "archived";
  tags: string[];
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

export interface VideoRecord {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  topic: string;
  duration: string;
  status: "draft" | "published";
  cover: string;
  videoUrl: string;
  summary: string;
  topicSlug?: string;
  tagLabel?: string;
  visualClass?: string;
  featured?: boolean;
}

export interface BlogRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: "draft" | "published";
  publishDate: string;
  excerpt: string;
  body?: string[];
  meta?: string;
}

export interface InquiryRecord {
  id: string;
  source: "product" | "contact" | "wholesale";
  customer: string;
  email: string;
  company: string;
  status: "new" | "processing" | "closed";
  assignee: string;
  sourceDetail?: string;
  message: string;
  createdAt: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  source: string;
  orderNumber: string;
  createdAt: string;
}

export interface SeoSettingsState {
  globalTitle: string;
  globalDescription: string;
  ogImage: string;
  sitemapEnabled: boolean;
  robotsIndex: boolean;
  productTemplate: string;
  categoryTemplate: string;
  blogTemplate: string;
}

export interface LogRecord {
  id: string;
  type: "login" | "operation";
  actor: string;
  role: AdminRole;
  message: string;
  createdAt: string;
}

export interface AdminBootstrapPayload {
  session: AdminSession;
  dashboard: {
    publishedProducts: number;
    publishedVideos: number;
    publishedBlogs: number;
    pendingInquiries: number;
  };
  siteSettings: SiteSettingsState;
  homeContent: HomeContentState;
  seoSettings: SeoSettingsState;
  categories: CategoryRecord[];
  products: ProductRecord[];
  videos: VideoRecord[];
  blogs: BlogRecord[];
  inquiries: InquiryRecord[];
  subscribers: SubscriberRecord[];
  logs: LogRecord[];
}
