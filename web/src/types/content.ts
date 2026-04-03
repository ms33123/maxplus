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

export interface VideoFeaturedContent {
  eyebrow: string;
  title: string;
  duration: string;
  href: string;
  ctaLabel: string;
  visualClass: string;
}

export interface VideoItem {
  tag: string;
  title: string;
  duration: string;
  href: string;
  visualClass: string;
}

export interface VideoContent {
  eyebrow: string;
  title: string;
  text: string;
  featured: VideoFeaturedContent;
  items: VideoItem[];
}

export interface FeaturedProductItem {
  tag: string;
  title: string;
  text: string;
  price: string;
  href: string;
  visualClass: string;
  imageUrl?: string;
}

export interface FeaturedContent {
  eyebrow: string;
  title: string;
  text: string;
  detailsLabel: string;
  items: FeaturedProductItem[];
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
  interestLabel: string;
  chooseOne: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
}

export interface ContactOption {
  value: string;
  label: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  text: string;
  fields: ContactFields;
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

export interface SubscribeContent {
  toggleLabel: string;
  eyebrow: string;
  title: string;
  emailLabel: string;
  emailPlaceholder: string;
  orderLabel: string;
  orderPlaceholder: string;
  benefitsTitle: string;
  benefits: string[];
  buttonLabel: string;
  demoStatus: string;
}

export interface SiteMeta {
  htmlLang: string;
  title: string;
  description: string;
}

export interface SiteContent {
  meta: SiteMeta;
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
