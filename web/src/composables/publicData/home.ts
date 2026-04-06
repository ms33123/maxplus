import { siteContent as defaultSiteContent } from "../../data/siteContent.en";
import type { RawHomeContent } from "./types";
import { cloneValue } from "./utils";

type ContactSection = RawHomeContent["contactSection"];

function normalizeContactFieldOptions(
  value: Array<{ value?: string; label?: string }> | undefined,
  fallback: Array<{ value: string; label: string }> = []
) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .map((item) => ({
      value: item?.value || "",
      label: item?.label || ""
    }))
    .filter((item) => item.value && item.label);
}

function buildLegacyContactFormFields(source: ContactSection | undefined) {
  const fields = {
    ...cloneValue(defaultSiteContent.contact.fields),
    ...(source?.fields ?? {})
  };
  const fieldConfig = {
    ...cloneValue(defaultSiteContent.contact.fieldConfig),
    ...(source?.fieldConfig ?? {}),
    name: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.name),
      ...(source?.fieldConfig?.name ?? {})
    },
    email: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.email),
      ...(source?.fieldConfig?.email ?? {})
    },
    phone: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.phone),
      ...(source?.fieldConfig?.phone ?? {})
    },
    company: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.company),
      ...(source?.fieldConfig?.company ?? {})
    },
    interest: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.interest),
      ...(source?.fieldConfig?.interest ?? {})
    },
    message: {
      ...cloneValue(defaultSiteContent.contact.fieldConfig.message),
      ...(source?.fieldConfig?.message ?? {})
    }
  };
  const interestOptions = normalizeContactFieldOptions(
    source?.interestOptions,
    cloneValue(defaultSiteContent.contact.interestOptions)
  );

  return [
    {
      id: "contact-field-name",
      key: "name",
      type: "text" as const,
      label: fields.nameLabel,
      placeholder: fields.namePlaceholder,
      enabled: fieldConfig.name.enabled,
      required: fieldConfig.name.required,
      options: []
    },
    {
      id: "contact-field-email",
      key: "email",
      type: "email" as const,
      label: fields.emailLabel,
      placeholder: fields.emailPlaceholder,
      enabled: fieldConfig.email.enabled,
      required: fieldConfig.email.required,
      options: []
    },
    {
      id: "contact-field-phone",
      key: "phone",
      type: "tel" as const,
      label: fields.phoneLabel,
      placeholder: fields.phonePlaceholder,
      enabled: fieldConfig.phone.enabled,
      required: fieldConfig.phone.required,
      options: []
    },
    {
      id: "contact-field-company",
      key: "company",
      type: "text" as const,
      label: fields.companyLabel,
      placeholder: fields.companyPlaceholder,
      enabled: fieldConfig.company.enabled,
      required: fieldConfig.company.required,
      options: []
    },
    {
      id: "contact-field-interest",
      key: "interest",
      type: "select" as const,
      label: fields.interestLabel,
      placeholder: fields.chooseOne,
      enabled: fieldConfig.interest.enabled,
      required: fieldConfig.interest.required,
      options: interestOptions
    },
    {
      id: "contact-field-message",
      key: "message",
      type: "textarea" as const,
      label: fields.messageLabel,
      placeholder: fields.messagePlaceholder,
      enabled: fieldConfig.message.enabled,
      required: fieldConfig.message.required,
      options: []
    }
  ];
}

function normalizeContactFormFields(source: ContactSection | undefined) {
  const fallback = cloneValue(defaultSiteContent.contact.formFields);
  const rawFields = Array.isArray(source?.formFields) && source.formFields.length
    ? source.formFields
    : buildLegacyContactFormFields(source);

  return rawFields.map((item, index) => ({
    id: item?.id || `contact-field-${index + 1}`,
    key: item?.key || `field_${index + 1}`,
    type: item?.type || "text",
    label: item?.label || "",
    placeholder: item?.placeholder || "",
    enabled: item?.enabled ?? true,
    required: item?.required ?? false,
    options:
      (item?.type || "text") === "select"
        ? normalizeContactFieldOptions(item?.options, fallback[index]?.options)
        : []
  }));
}

export const defaultHomeContent: RawHomeContent = {
  heroSlides: [],
  featuredProductSlugs: [],
  featuredVideoSlugs: [],
  productSection: {
    eyebrow: defaultSiteContent.featured.eyebrow,
    title: defaultSiteContent.featured.title,
    text: defaultSiteContent.featured.text,
    detailsLabel: defaultSiteContent.featured.detailsLabel,
    moreLabel: defaultSiteContent.featured.moreLabel
  },
  videoSection: {
    eyebrow: defaultSiteContent.videos.eyebrow,
    title: defaultSiteContent.videos.title,
    text: defaultSiteContent.videos.text,
    featuredCtaLabel: defaultSiteContent.videos.featured.ctaLabel,
    moreLabel: defaultSiteContent.videos.moreLabel
  },
  categorySection: {
    eyebrow: defaultSiteContent.categories.eyebrow,
    title: defaultSiteContent.categories.title,
    text: defaultSiteContent.categories.text,
    moreLabel: defaultSiteContent.categories.moreLabel
  },
  reviews: {
    eyebrow: defaultSiteContent.reviews.eyebrow,
    title: defaultSiteContent.reviews.title,
    text: defaultSiteContent.reviews.text,
    displayMode: defaultSiteContent.reviews.displayMode,
    summary: cloneValue(defaultSiteContent.reviews.summary),
    items: cloneValue(defaultSiteContent.reviews.items)
  },
  contactSection: {
    eyebrow: defaultSiteContent.contact.eyebrow,
    title: defaultSiteContent.contact.title,
    text: defaultSiteContent.contact.text,
    successMessage: defaultSiteContent.contact.successMessage,
    formFields: cloneValue(defaultSiteContent.contact.formFields),
    fields: cloneValue(defaultSiteContent.contact.fields),
    fieldConfig: cloneValue(defaultSiteContent.contact.fieldConfig),
    interestOptions: cloneValue(defaultSiteContent.contact.interestOptions)
  },
  sectionToggles: [
    { key: "hero", label: "首屏轮播", enabled: true },
    { key: "videos", label: "视频模块", enabled: true },
    { key: "products", label: "精选商品", enabled: true },
    { key: "categories", label: "分类模块", enabled: true },
    { key: "reviews", label: "评价模块", enabled: true },
    { key: "contact", label: "联系模块", enabled: true }
  ]
};

export const defaultHomeContactFieldConfig = cloneValue(defaultSiteContent.contact.fieldConfig);

export function normalizeHomeContentData(value?: Partial<RawHomeContent> | null): RawHomeContent {
  const source = value ?? {};

  return {
    ...cloneValue(defaultHomeContent),
    ...source,
    heroSlides: Array.isArray(source.heroSlides)
      ? source.heroSlides.map((item, index) => ({
          id: item?.id || `hero-${index + 1}`,
          eyebrow: item?.eyebrow || "",
          title: item?.title || "",
          subtitle: item?.subtitle || "",
          targetUrl: item?.targetUrl || "/products",
          primaryLabel: item?.primaryLabel || "",
          secondaryLabel: item?.secondaryLabel || "",
          secondaryTargetUrl: item?.secondaryTargetUrl || "",
          imageUrl: item?.imageUrl || "",
          enabled: item?.enabled ?? true
        }))
      : cloneValue(defaultHomeContent.heroSlides),
    productSection: {
      ...cloneValue(defaultHomeContent.productSection),
      ...(source.productSection ?? {})
    },
    featuredProductSlugs: Array.isArray(source.featuredProductSlugs)
      ? source.featuredProductSlugs
      : cloneValue(defaultHomeContent.featuredProductSlugs),
    videoSection: {
      ...cloneValue(defaultHomeContent.videoSection),
      ...(source.videoSection ?? {})
    },
    featuredVideoSlugs: Array.isArray(source.featuredVideoSlugs)
      ? source.featuredVideoSlugs
      : cloneValue(defaultHomeContent.featuredVideoSlugs),
    categorySection: {
      ...cloneValue(defaultHomeContent.categorySection),
      ...(source.categorySection ?? {})
    },
    reviews: {
      ...cloneValue(defaultHomeContent.reviews),
      ...(source.reviews ?? {}),
      summary: {
        ...cloneValue(defaultHomeContent.reviews.summary),
        ...(source.reviews?.summary ?? {}),
        metrics: source.reviews?.summary?.metrics?.length
          ? source.reviews.summary.metrics
          : cloneValue(defaultHomeContent.reviews.summary.metrics)
      },
      items: source.reviews?.items?.length
        ? source.reviews.items
        : cloneValue(defaultHomeContent.reviews.items)
    },
    contactSection: {
      ...cloneValue(defaultHomeContent.contactSection),
      ...(source.contactSection ?? {}),
      formFields: normalizeContactFormFields(source.contactSection),
      fields: {
        ...cloneValue(defaultHomeContent.contactSection.fields),
        ...(source.contactSection?.fields ?? {})
      },
      fieldConfig: {
        ...cloneValue(defaultHomeContactFieldConfig),
        ...(source.contactSection?.fieldConfig ?? {}),
        name: {
          ...cloneValue(defaultHomeContactFieldConfig.name),
          ...(source.contactSection?.fieldConfig?.name ?? {})
        },
        email: {
          ...cloneValue(defaultHomeContactFieldConfig.email),
          ...(source.contactSection?.fieldConfig?.email ?? {})
        },
        phone: {
          ...cloneValue(defaultHomeContactFieldConfig.phone),
          ...(source.contactSection?.fieldConfig?.phone ?? {})
        },
        company: {
          ...cloneValue(defaultHomeContactFieldConfig.company),
          ...(source.contactSection?.fieldConfig?.company ?? {})
        },
        interest: {
          ...cloneValue(defaultHomeContactFieldConfig.interest),
          ...(source.contactSection?.fieldConfig?.interest ?? {})
        },
        message: {
          ...cloneValue(defaultHomeContactFieldConfig.message),
          ...(source.contactSection?.fieldConfig?.message ?? {})
        }
      },
      interestOptions: Array.isArray(source.contactSection?.interestOptions)
        ? source.contactSection.interestOptions
            .map((item) => ({
              value: item?.value || "",
              label: item?.label || ""
            }))
            .filter((item) => item.value && item.label)
        : cloneValue(defaultHomeContent.contactSection.interestOptions)
    },
    sectionToggles: cloneValue(defaultHomeContent.sectionToggles).map((item) => {
      const matched = Array.isArray(source.sectionToggles)
        ? source.sectionToggles.find((entry) => entry?.key === item.key)
        : null;

      return {
        key: item.key,
        label: matched?.label || item.label,
        enabled: matched?.enabled ?? item.enabled
      };
    })
  };
}
