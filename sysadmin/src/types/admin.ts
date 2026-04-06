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

export type SiteThemePreset = "default" | "christmas";

export interface SiteThemeState {
  preset: SiteThemePreset;
  effectsEnabled: boolean;
}

export interface MailerSettingsState {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  smtpPassword: string;
  hasPassword: boolean;
  clearPassword: boolean;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  subjectTemplate: string;
  htmlTemplate: string;
  textTemplate: string;
}

export interface SiteSettingsState {
  brand: BrandSettings;
  socials: SocialLink[];
  notifications: NotificationSettings;
  theme: SiteThemeState;
  mailer: MailerSettingsState;
}

export interface HeroSlideItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  targetUrl: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryTargetUrl: string;
  imageUrl: string;
  enabled: boolean;
}

export interface HomeProductSectionState {
  eyebrow: string;
  title: string;
  text: string;
  detailsLabel: string;
  moreLabel: string;
}

export interface HomeVideoSectionState {
  eyebrow: string;
  title: string;
  text: string;
  featuredCtaLabel: string;
  moreLabel: string;
}

export interface HomeCategorySectionState {
  eyebrow: string;
  title: string;
  text: string;
  moreLabel: string;
}

export interface HomeContactOption {
  value: string;
  label: string;
}

export type HomeContactFieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface HomeContactFieldsState {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  interestLabel: string;
  chooseOne: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
}

export interface HomeContactFieldRuleState {
  enabled: boolean;
  required: boolean;
}

export interface HomeContactFieldConfigState {
  name: HomeContactFieldRuleState;
  email: HomeContactFieldRuleState;
  phone: HomeContactFieldRuleState;
  company: HomeContactFieldRuleState;
  interest: HomeContactFieldRuleState;
  message: HomeContactFieldRuleState;
}

export interface HomeContactFormFieldState {
  id: string;
  key: string;
  type: HomeContactFieldType;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
  options: HomeContactOption[];
}

export interface HomeContactSectionState {
  eyebrow: string;
  title: string;
  text: string;
  successMessage: string;
  formFields: HomeContactFormFieldState[];
  fields: HomeContactFieldsState;
  fieldConfig: HomeContactFieldConfigState;
  interestOptions: HomeContactOption[];
}

export type SubscribeGiftStylePreset = "classic-gift" | "sport-burst" | "midnight-gift";
export type SubscribeStylePreset = "classic-button" | SubscribeGiftStylePreset;

export interface SubscribePopupState {
  enabled: boolean;
  stylePreset: SubscribeStylePreset;
  toggleLabel: string;
  eyebrow: string;
  title: string;
  text: string;
  benefitsTitle: string;
  benefits: string[];
  submitLabel: string;
  successMessage: string;
  sourceLabel: string;
  formFields: HomeContactFormFieldState[];
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
  productSection: HomeProductSectionState;
  featuredProductSlugs: string[];
  videoSection: HomeVideoSectionState;
  featuredVideoSlugs: string[];
  categorySection: HomeCategorySectionState;
  reviews: HomeReviewsState;
  contactSection: HomeContactSectionState;
  sectionToggles: HomeSectionToggle[];
}

export interface BrandStoryStatItem {
  id: string;
  value: string;
  label: string;
}

export interface BrandStoryHighlightItem {
  id: string;
  tag: string;
  title: string;
  text: string;
}

export interface BrandStoryState {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  storyParagraphs: string[];
  stats: BrandStoryStatItem[];
  highlights: BrandStoryHighlightItem[];
  categoryEyebrow: string;
  categoryTitle: string;
  categoryText: string;
}

export interface BlogPageState {
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

export interface CategoryStatRecord {
  value: string;
  label: string;
}

export interface CategoryFilterConfigRecord {
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

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parent: string;
  sortOrder: number;
  enabled: boolean;
  seoTitle: string;
  eyebrow?: string;
  summary?: string;
  bannerTitle?: string;
  bannerText?: string;
  filterConfig?: CategoryFilterConfigRecord;
  visualClass?: string;
  highlights?: string[];
  stats?: CategoryStatRecord[];
}

export type VideoCategoryRecord = CategoryRecord;

export interface BlogCategoryRecord {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  enabled: boolean;
  seoTitle: string;
  description: string;
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
  categoryId: string;
  category: string;
  author: string;
  status: "draft" | "published";
  publishDate: string;
  excerpt: string;
  body?: string[];
  bodyHtml?: string;
  coverImage?: string;
  meta?: string;
}

export interface InquiryRecord {
  id: string;
  source: "product" | "contact" | "wholesale";
  customer: string;
  email: string;
  phone?: string;
  interest?: string;
  fields?: Array<{
    key: string;
    label: string;
    value: string;
    type?: string;
  }>;
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
  fields: Array<{
    key: string;
    label: string;
    value: string;
    type?: HomeContactFieldType;
  }>;
  emailStatus: "pending" | "sent" | "failed" | "skipped";
  emailSentAt?: string;
  emailError?: string;
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
  subscribePopup: SubscribePopupState;
  blogPage: BlogPageState;
  brandStory: BrandStoryState;
  seoSettings: SeoSettingsState;
  categories: CategoryRecord[];
  videoCategories: VideoCategoryRecord[];
  blogCategories: BlogCategoryRecord[];
  products: ProductRecord[];
  videos: VideoRecord[];
  blogs: BlogRecord[];
  inquiries: InquiryRecord[];
  subscribers: SubscriberRecord[];
  logs: LogRecord[];
}
