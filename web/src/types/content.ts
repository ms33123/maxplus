import type { CatalogProduct } from "./catalog";

export interface NavLink {
  href: string;
  label: string;
}

export interface HeaderContent {
  navLabel: string;
  logoLabel: string;
  logoSub: string;
  toggleLabel: string;
  ctaLabel: string;
  links: NavLink[];
}

export type HeroActionKind = "primary" | "ghost";

export interface HeroAction {
  href: string;
  label: string;
  kind: HeroActionKind;
}

export interface HeroStackItem {
  label: string;
  className: string;
}

export interface HeroMetricItem {
  title: string;
  body: string;
}

export interface HeroStackPanel {
  type: "stack";
  eyebrow: string;
  items: HeroStackItem[];
}

export interface HeroMetricsPanel {
  type: "metrics";
  items: HeroMetricItem[];
}

export interface HeroQuotePanel {
  type: "quote";
  quote: string;
  caption: string;
}

export type HeroPanel = HeroStackPanel | HeroMetricsPanel | HeroQuotePanel;

export interface HeroSlide {
  variant: string;
  backgroundImage: string;
  backgroundPosition?: string;
  eyebrow: string;
  title: string;
  text: string;
  actions: HeroAction[];
  panel: HeroPanel;
}

export interface HeroContent {
  dotLabels: string[];
  slides: HeroSlide[];
}

export interface HighlightItem {
  tag: string;
  title: string;
  text: string;
}

export interface BrandStoryStat {
  id: string;
  value: string;
  label: string;
}

export interface BrandStoryContent {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  storyParagraphs: string[];
  stats: BrandStoryStat[];
  highlights: HighlightItem[];
  categoryEyebrow: string;
  categoryTitle: string;
  categoryText: string;
}

export interface VideoFeaturedContent {
  eyebrow: string;
  title: string;
  duration: string;
  href: string;
  videoUrl?: string;
  coverImage?: string;
  ctaLabel: string;
  visualClass: string;
}

export interface VideoItem {
  tag: string;
  title: string;
  duration: string;
  href: string;
  videoUrl?: string;
  coverImage?: string;
  visualClass: string;
}

export interface VideoContent {
  eyebrow: string;
  title: string;
  text: string;
  moreLabel: string;
  featured: VideoFeaturedContent;
  items: VideoItem[];
}

export interface FeaturedContent {
  eyebrow: string;
  title: string;
  text: string;
  detailsLabel: string;
  moreLabel: string;
  items: CatalogProduct[];
}

export interface CategoryItem {
  title: string;
  text: string;
  href: string;
}

export interface CategoriesContent {
  eyebrow: string;
  title: string;
  text: string;
  moreLabel: string;
  items: CategoryItem[];
}

export interface ReviewSummaryMetric {
  value: string;
  label: string;
}

export interface ReviewSummary {
  label: string;
  value: string;
  detail: string;
  metrics: ReviewSummaryMetric[];
}

export interface ReviewCardItem {
  id: string;
  quote: string;
  rating: number;
  author: string;
  meta: string;
  imageUrl: string;
}

export interface ReviewsContent {
  eyebrow: string;
  title: string;
  text: string;
  displayMode: "text" | "image";
  summary: ReviewSummary;
  items: ReviewCardItem[];
}

export interface ContactFields {
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

export interface ContactFieldRule {
  enabled: boolean;
  required: boolean;
}

export interface ContactFieldConfig {
  name: ContactFieldRule;
  email: ContactFieldRule;
  phone: ContactFieldRule;
  company: ContactFieldRule;
  interest: ContactFieldRule;
  message: ContactFieldRule;
}

export interface ContactOption {
  value: string;
  label: string;
}

export type ContactFormFieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface ContactFormField {
  id: string;
  key: string;
  type: ContactFormFieldType;
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
  options: ContactOption[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  text: string;
  successMessage: string;
  formFields: ContactFormField[];
  fields: ContactFields;
  fieldConfig: ContactFieldConfig;
  interestOptions: ContactOption[];
  demoStatus: string;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterContent {
  text: string;
  contactTitle: string;
  socialTitle: string;
  quickLinksTitle: string;
  policyTitle: string;
  contactLinks: FooterLink[];
  socialLinks: FooterLink[];
  quickLinks: FooterLink[];
  policyLinks: FooterLink[];
  meta1: string;
  meta2: string;
}

export type SubscribeGiftStylePreset = "classic-gift" | "sport-burst" | "midnight-gift";
export type SubscribeStylePreset = "classic-button" | SubscribeGiftStylePreset;

export interface SubscribeContent {
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
  formFields: ContactFormField[];
}

export type SiteThemePreset = "default" | "christmas";

export interface SiteThemeContent {
  preset: SiteThemePreset;
  effectsEnabled: boolean;
}

export interface SiteMeta {
  htmlLang: string;
  title: string;
  description: string;
}

export interface SiteContent {
  meta: SiteMeta;
  theme: SiteThemeContent;
  header: HeaderContent;
  hero: HeroContent;
  videos: VideoContent;
  featured: FeaturedContent;
  categories: CategoriesContent;
  reviews: ReviewsContent;
  contact: ContactContent;
  footer: FooterContent;
  subscribe: SubscribeContent;
}
