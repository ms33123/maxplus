import { siteContent as defaultSiteContent } from "../../data/siteContent.en";
import type {
  CatalogCategory,
  CatalogProduct,
  TutorialVideo
} from "../../types/catalog";
import type {
  BrandStoryContent,
  HeroAction,
  HighlightItem,
  SiteContent,
  SiteThemeContent,
  SiteThemePreset
} from "../../types/content";
import { buildDefaultBrandStory } from "./defaults";
import { normalizeHomeContentData } from "./home";
import { normalizeSubscribePopupData } from "./subscribe";
import type {
  PublicBootstrapPayload,
  RawBrandStory,
  RawSiteTheme
} from "./types";
import { buildVideoRoute, cloneValue } from "./utils";

const siteThemePresets = new Set<SiteThemePreset>(["default", "christmas"]);

export function buildBrandStoryContent(raw?: RawBrandStory | null): BrandStoryContent {
  const fallback = buildDefaultBrandStory();
  const source = raw ?? ({} as RawBrandStory);

  return {
    metaTitle: source.metaTitle?.trim() || fallback.metaTitle,
    metaDescription: source.metaDescription?.trim() || fallback.metaDescription,
    heroEyebrow: source.heroEyebrow?.trim() || fallback.heroEyebrow,
    heroTitle: source.heroTitle?.trim() || fallback.heroTitle,
    heroText: source.heroText?.trim() || fallback.heroText,
    storyParagraphs:
      Array.isArray(source.storyParagraphs) && source.storyParagraphs.length
        ? source.storyParagraphs.map((item) => item?.trim()).filter(Boolean)
        : fallback.storyParagraphs,
    stats:
      Array.isArray(source.stats) && source.stats.length
        ? source.stats
            .map((item, index) => ({
              id: item?.id || `brand-stat-${index + 1}`,
              value: item?.value?.trim() || "",
              label: item?.label?.trim() || ""
            }))
            .filter((item) => item.value && item.label)
        : fallback.stats,
    highlights:
      Array.isArray(source.highlights) && source.highlights.length
        ? source.highlights
            .map((item) => ({
              tag: item?.tag?.trim() || "",
              title: item?.title?.trim() || "",
              text: item?.text?.trim() || ""
            }))
            .filter((item): item is HighlightItem => Boolean(item.title && item.text))
        : fallback.highlights,
    categoryEyebrow: source.categoryEyebrow?.trim() || fallback.categoryEyebrow,
    categoryTitle: source.categoryTitle?.trim() || fallback.categoryTitle,
    categoryText: source.categoryText?.trim() || fallback.categoryText
  };
}

function buildSiteThemeContent(raw?: RawSiteTheme | null): SiteThemeContent {
  const preset = raw?.preset && siteThemePresets.has(raw.preset) ? raw.preset : "default";

  return {
    preset,
    effectsEnabled: raw?.effectsEnabled ?? true
  };
}

export function buildSiteContent(
  payload: PublicBootstrapPayload,
  categories: CatalogCategory[],
  products: CatalogProduct[],
  videos: TutorialVideo[]
): SiteContent {
  const content = cloneValue(defaultSiteContent);
  const normalizedHomeContent = normalizeHomeContentData(payload.homeContent);
  const normalizedSubscribePopup = normalizeSubscribePopupData(payload.subscribePopup);
  const enabledHeroSlides = normalizedHomeContent.heroSlides.filter((item) => item.enabled);

  content.meta.title = payload.siteSettings.brand.siteTitle || content.meta.title;
  content.meta.description =
    payload.siteSettings.brand.siteDescription || payload.seo.globalDescription || content.meta.description;
  content.theme = buildSiteThemeContent(payload.siteSettings.theme);
  content.header.logoSub = payload.siteSettings.brand.brandName || content.header.logoSub;

  if (enabledHeroSlides.length) {
    content.hero.dotLabels = enabledHeroSlides.map((_, index) => `Show slide ${index + 1}`);
    content.hero.slides = enabledHeroSlides.map((item, index) => {
      const template = defaultSiteContent.hero.slides[index % defaultSiteContent.hero.slides.length];
      const primaryAction = template.actions[0];
      const secondaryAction = template.actions[1];
      const actions: HeroAction[] = [
        {
          href: item.targetUrl || primaryAction?.href || "/products",
          label: item.primaryLabel || primaryAction?.label || "Explore Products",
          kind: "primary"
        }
      ];

      if (item.secondaryLabel || item.secondaryTargetUrl || secondaryAction) {
        actions.push({
          href: item.secondaryTargetUrl || secondaryAction?.href || "/brand-story",
          label: item.secondaryLabel || secondaryAction?.label || "Brand Story",
          kind: "ghost"
        });
      }

      return {
        ...template,
        backgroundImage: item.imageUrl || template.backgroundImage,
        eyebrow: item.eyebrow || template.eyebrow,
        title: item.title || template.title,
        text: item.subtitle || template.text,
        actions
      };
    });
  }

  const featuredProducts = normalizedHomeContent.featuredProductSlugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter((item): item is CatalogProduct => Boolean(item));

  content.featured.eyebrow =
    normalizedHomeContent.productSection?.eyebrow || content.featured.eyebrow;
  content.featured.title = normalizedHomeContent.productSection?.title || content.featured.title;
  content.featured.text = normalizedHomeContent.productSection?.text || content.featured.text;
  content.featured.detailsLabel =
    normalizedHomeContent.productSection?.detailsLabel || content.featured.detailsLabel;
  content.featured.moreLabel =
    normalizedHomeContent.productSection?.moreLabel || content.featured.moreLabel;

  if (featuredProducts.length) {
    content.featured.items = featuredProducts.slice(0, 4);
  }

  content.categories.eyebrow =
    normalizedHomeContent.categorySection?.eyebrow || content.categories.eyebrow;
  content.categories.title =
    normalizedHomeContent.categorySection?.title || content.categories.title;
  content.categories.text = normalizedHomeContent.categorySection?.text || content.categories.text;
  content.categories.moreLabel =
    normalizedHomeContent.categorySection?.moreLabel || content.categories.moreLabel;

  content.categories.items = categories.map((item) => ({
    title: item.title,
    text: item.summary,
    href: `/categories/${item.slug}`
  }));

  const preferredVideos = normalizedHomeContent.featuredVideoSlugs
    .map((slug) => videos.find((item) => item.slug === slug))
    .filter((item): item is TutorialVideo => Boolean(item));
  const orderedVideos = preferredVideos.length
    ? [...preferredVideos, ...videos.filter((item) => !preferredVideos.some((entry) => entry.slug === item.slug))]
    : videos;

  content.videos.eyebrow = normalizedHomeContent.videoSection?.eyebrow || content.videos.eyebrow;
  content.videos.title = normalizedHomeContent.videoSection?.title || content.videos.title;
  content.videos.text = normalizedHomeContent.videoSection?.text || content.videos.text;
  content.videos.moreLabel = normalizedHomeContent.videoSection?.moreLabel || content.videos.moreLabel;

  if (orderedVideos.length) {
    const [featuredVideo, ...otherVideos] = orderedVideos;
    content.videos.featured = {
      eyebrow: featuredVideo.tag,
      title: featuredVideo.title,
      duration: featuredVideo.duration,
      href: buildVideoRoute(featuredVideo.slug),
      videoUrl: featuredVideo.videoUrl,
      coverImage: featuredVideo.coverImage,
      ctaLabel:
        normalizedHomeContent.videoSection?.featuredCtaLabel ||
        content.videos.featured.ctaLabel,
      visualClass: featuredVideo.visualClass
    };
    content.videos.items = otherVideos.slice(0, 3).map((item) => ({
      tag: item.tag,
      title: item.title,
      duration: item.duration,
      href: buildVideoRoute(item.slug),
      videoUrl: item.videoUrl,
      coverImage: item.coverImage,
      visualClass: item.visualClass
    }));
  }

  if (normalizedHomeContent.reviews) {
    content.reviews = {
      eyebrow: normalizedHomeContent.reviews.eyebrow || content.reviews.eyebrow,
      title: normalizedHomeContent.reviews.title || content.reviews.title,
      text: normalizedHomeContent.reviews.text || content.reviews.text,
      displayMode: normalizedHomeContent.reviews.displayMode === "image" ? "image" : "text",
      summary: {
        label: normalizedHomeContent.reviews.summary?.label || content.reviews.summary.label,
        value: normalizedHomeContent.reviews.summary?.value || content.reviews.summary.value,
        detail: normalizedHomeContent.reviews.summary?.detail || content.reviews.summary.detail,
        metrics: normalizedHomeContent.reviews.summary?.metrics?.length
          ? normalizedHomeContent.reviews.summary.metrics.map((item) => ({
              value: item.value,
              label: item.label
            }))
          : content.reviews.summary.metrics
      },
      items: normalizedHomeContent.reviews.items?.length
        ? normalizedHomeContent.reviews.items.map((item, index) => ({
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

  content.contact = {
    ...content.contact,
    eyebrow: normalizedHomeContent.contactSection?.eyebrow || content.contact.eyebrow,
    title: normalizedHomeContent.contactSection?.title || content.contact.title,
    text: normalizedHomeContent.contactSection?.text || content.contact.text,
    successMessage:
      normalizedHomeContent.contactSection?.successMessage || content.contact.successMessage,
    formFields:
      normalizedHomeContent.contactSection?.formFields?.length
        ? normalizedHomeContent.contactSection.formFields.map((item) => ({
            id: item.id || "",
            key: item.key || "",
            type: item.type || "text",
            label: item.label || "",
            placeholder: item.placeholder || "",
            enabled: item.enabled ?? true,
            required: item.required ?? false,
            options: (item.options ?? []).map((option) => ({
              value: option.value || "",
              label: option.label || ""
            }))
          }))
        : content.contact.formFields,
    fields: {
      ...content.contact.fields,
      ...(normalizedHomeContent.contactSection?.fields ?? {})
    },
    fieldConfig: {
      ...content.contact.fieldConfig,
      ...(normalizedHomeContent.contactSection?.fieldConfig ?? {}),
      name: {
        ...content.contact.fieldConfig.name,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.name ?? {})
      },
      email: {
        ...content.contact.fieldConfig.email,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.email ?? {})
      },
      phone: {
        ...content.contact.fieldConfig.phone,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.phone ?? {})
      },
      company: {
        ...content.contact.fieldConfig.company,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.company ?? {})
      },
      interest: {
        ...content.contact.fieldConfig.interest,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.interest ?? {})
      },
      message: {
        ...content.contact.fieldConfig.message,
        ...(normalizedHomeContent.contactSection?.fieldConfig?.message ?? {})
      }
    },
    interestOptions:
      normalizedHomeContent.contactSection?.interestOptions?.length
        ? normalizedHomeContent.contactSection.interestOptions.map((item) => ({
            value: item.value || "",
            label: item.label || ""
          }))
        : content.contact.interestOptions
  };

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

  content.subscribe = {
    ...content.subscribe,
    ...normalizedSubscribePopup,
    benefits: normalizedSubscribePopup.benefits.length
      ? normalizedSubscribePopup.benefits
      : content.subscribe.benefits,
    formFields: normalizedSubscribePopup.formFields.length
      ? normalizedSubscribePopup.formFields
      : content.subscribe.formFields
  };

  return content;
}
