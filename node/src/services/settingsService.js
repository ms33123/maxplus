const { query } = require("../config/database");
const { safeParseJson, stringifyJson } = require("../utils/json");
const {
  sanitizeString,
  sanitizeText,
  sanitizeEmail,
  normalizeBoolean,
  normalizeEnum,
  normalizeInteger,
  normalizeStringArray,
  ensureId
} = require("../utils/normalizers");

const defaultHomeReviews = {
  eyebrow: "Partner Feedback",
  title: "Reviews",
  text: "",
  displayMode: "text",
  summary: {
    label: "Average sentiment from early review rounds",
    value: "4.8/5",
    detail: "",
    metrics: [
      { value: "92%", label: "felt the site looked established" },
      { value: "3/3", label: "mentioned product clarity" },
      { value: "Fast Read", label: "more credible first read" }
    ]
  },
  items: [
    {
      id: "review-1",
      quote: "The brand block feels like a real company introduction, not a placeholder.",
      rating: 5,
      author: "Anna Reed",
      meta: "Retail Buyer",
      imageUrl: ""
    }
  ]
};

function mapSiteSettings(row) {
  return {
    brand: safeParseJson(row.brand_json, {}),
    socials: safeParseJson(row.socials_json, []),
    notifications: safeParseJson(row.notifications_json, {}),
    footer: safeParseJson(row.footer_json, {})
  };
}

function mapHomeContent(row) {
  return {
    heroSlides: safeParseJson(row.hero_slides_json, []),
    highlights: safeParseJson(row.highlights_json, []),
    featuredProductSlugs: safeParseJson(row.featured_product_slugs_json, []),
    featuredVideoSlugs: safeParseJson(row.featured_video_slugs_json, []),
    reviews: safeParseJson(row.reviews_json, defaultHomeReviews),
    sectionToggles: safeParseJson(row.section_toggles_json, [])
  };
}

function mapSeoSettings(row) {
  return safeParseJson(row.config_json, {});
}

async function getSiteSettings() {
  const rows = await query(`SELECT * FROM site_settings WHERE id = 1 LIMIT 1`);
  return mapSiteSettings(rows[0]);
}

async function saveSiteSettings(payload) {
  const current = await getSiteSettings();
  const brandInput = payload.brand || {};
  const notificationsInput = payload.notifications || {};
  const socialsInput = Array.isArray(payload.socials) ? payload.socials : current.socials;

  const nextValue = {
    brand: {
      brandName: sanitizeString(brandInput.brandName, { max: 120, defaultValue: current.brand.brandName }),
      siteTitle: sanitizeString(brandInput.siteTitle, { max: 120, defaultValue: current.brand.siteTitle }),
      siteDescription: sanitizeText(brandInput.siteDescription, {
        max: 500,
        defaultValue: current.brand.siteDescription
      }),
      supportEmail: sanitizeEmail(brandInput.supportEmail || current.brand.supportEmail),
      salesEmail: sanitizeEmail(brandInput.salesEmail || current.brand.salesEmail),
      phone: sanitizeString(brandInput.phone, { max: 80, defaultValue: current.brand.phone }),
      whatsapp: sanitizeString(brandInput.whatsapp, { max: 80, defaultValue: current.brand.whatsapp }),
      defaultLanguage: sanitizeString(brandInput.defaultLanguage, {
        max: 40,
        defaultValue: current.brand.defaultLanguage
      }),
      defaultCurrency: sanitizeString(brandInput.defaultCurrency, {
        max: 20,
        defaultValue: current.brand.defaultCurrency
      }),
      timezone: sanitizeString(brandInput.timezone, { max: 80, defaultValue: current.brand.timezone }),
      address: sanitizeText(brandInput.address, { max: 300, defaultValue: current.brand.address })
    },
    socials: socialsInput.slice(0, 8).map((item, index) => ({
      id: ensureId(item.id, `social-${index + 1}`),
      name: sanitizeString(item.name, { max: 40 }),
      url: sanitizeString(item.url, { max: 255 })
    })),
    notifications: {
      inquiryRecipients: sanitizeText(notificationsInput.inquiryRecipients, {
        max: 300,
        defaultValue: current.notifications.inquiryRecipients
      }),
      subscriberRecipients: sanitizeText(notificationsInput.subscriberRecipients, {
        max: 300,
        defaultValue: current.notifications.subscriberRecipients
      }),
      enableEmailNotice: normalizeBoolean(
        notificationsInput.enableEmailNotice,
        current.notifications.enableEmailNotice
      ),
      enableSlackNotice: normalizeBoolean(
        notificationsInput.enableSlackNotice,
        current.notifications.enableSlackNotice
      )
    },
    footer: current.footer
  };

  await query(
    `UPDATE site_settings
     SET brand_json = ?, socials_json = ?, notifications_json = ?, footer_json = ?
     WHERE id = 1`,
    [
      stringifyJson(nextValue.brand),
      stringifyJson(nextValue.socials),
      stringifyJson(nextValue.notifications),
      stringifyJson(nextValue.footer)
    ]
  );

  return nextValue;
}

async function getHomeContent() {
  const rows = await query(`SELECT * FROM home_content WHERE id = 1 LIMIT 1`);
  return mapHomeContent(rows[0]);
}

function normalizeReviewMetricArray(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 6)
    .map((item) => ({
      value: sanitizeString(item?.value, { max: 40 }),
      label: sanitizeString(item?.label, { max: 120 })
    }))
    .filter((item) => item.value && item.label);
}

function normalizeReviewItems(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 10)
    .map((item, index) => ({
      id: ensureId(item?.id, `review-${index + 1}`),
      quote: sanitizeText(item?.quote, { max: 500 }),
      rating: normalizeInteger(item?.rating, { min: 1, max: 5, defaultValue: 5 }),
      author: sanitizeString(item?.author, { max: 80 }),
      meta: sanitizeString(item?.meta, { max: 120 }),
      imageUrl: sanitizeString(item?.imageUrl, { max: 255 })
    }))
    .filter((item) => item.quote);
}

function normalizeReviews(value, fallback = defaultHomeReviews) {
  const base = value && typeof value === "object" ? value : fallback;
  const summary = base.summary && typeof base.summary === "object" ? base.summary : fallback.summary;

  return {
    eyebrow: sanitizeString(base.eyebrow, { max: 60, defaultValue: fallback.eyebrow }),
    title: sanitizeString(base.title, { max: 160, defaultValue: fallback.title }),
    text: sanitizeText(base.text, { max: 300, defaultValue: fallback.text }),
    displayMode: normalizeEnum(base.displayMode, ["text", "image"], fallback.displayMode),
    summary: {
      label: sanitizeString(summary.label, { max: 160, defaultValue: fallback.summary.label }),
      value: sanitizeString(summary.value, { max: 40, defaultValue: fallback.summary.value }),
      detail: sanitizeText(summary.detail, { max: 240, defaultValue: fallback.summary.detail }),
      metrics: normalizeReviewMetricArray(summary.metrics, fallback.summary.metrics)
    },
    items: normalizeReviewItems(base.items, fallback.items)
  };
}

async function saveHomeContent(payload) {
  const current = await getHomeContent();
  const nextValue = {
    heroSlides: (Array.isArray(payload.heroSlides) ? payload.heroSlides : current.heroSlides)
      .slice(0, 10)
      .map((item, index) => ({
        id: ensureId(item.id, `hero-${index + 1}`),
        title: sanitizeString(item.title, { max: 160 }),
        subtitle: sanitizeText(item.subtitle, { max: 300 }),
        targetUrl: sanitizeString(item.targetUrl, { max: 200, defaultValue: "/" }),
        imageUrl: sanitizeString(item.imageUrl, { max: 255 }),
        enabled: normalizeBoolean(item.enabled, true)
      })),
    highlights: normalizeStringArray(payload.highlights ?? current.highlights, {
      maxItems: 8,
      maxItemLength: 120
    }),
    featuredProductSlugs: normalizeStringArray(
      payload.featuredProductSlugs ?? current.featuredProductSlugs,
      { maxItems: 8, maxItemLength: 180 }
    ),
    featuredVideoSlugs: normalizeStringArray(
      payload.featuredVideoSlugs ?? current.featuredVideoSlugs,
      { maxItems: 8, maxItemLength: 180 }
    ),
    reviews: normalizeReviews(payload.reviews ?? current.reviews, current.reviews ?? defaultHomeReviews),
    sectionToggles: (Array.isArray(payload.sectionToggles) ? payload.sectionToggles : current.sectionToggles)
      .slice(0, 12)
      .map((item) => ({
        key: sanitizeString(item.key, { max: 60 }),
        label: sanitizeString(item.label, { max: 60 }),
        enabled: normalizeBoolean(item.enabled, true)
      }))
  };

  await query(
    `UPDATE home_content
     SET hero_slides_json = ?, highlights_json = ?, featured_product_slugs_json = ?, featured_video_slugs_json = ?, reviews_json = ?, section_toggles_json = ?
     WHERE id = 1`,
    [
      stringifyJson(nextValue.heroSlides),
      stringifyJson(nextValue.highlights),
      stringifyJson(nextValue.featuredProductSlugs),
      stringifyJson(nextValue.featuredVideoSlugs),
      stringifyJson(nextValue.reviews),
      stringifyJson(nextValue.sectionToggles)
    ]
  );

  return nextValue;
}

async function getSeoSettings() {
  const rows = await query(`SELECT * FROM seo_settings WHERE id = 1 LIMIT 1`);
  return mapSeoSettings(rows[0]);
}

async function saveSeoSettings(payload) {
  const current = await getSeoSettings();
  const nextValue = {
    globalTitle: sanitizeString(payload.globalTitle, {
      max: 160,
      defaultValue: current.globalTitle
    }),
    globalDescription: sanitizeText(payload.globalDescription, {
      max: 300,
      defaultValue: current.globalDescription
    }),
    ogImage: sanitizeString(payload.ogImage, { max: 255, defaultValue: current.ogImage }),
    sitemapEnabled: normalizeBoolean(payload.sitemapEnabled, current.sitemapEnabled),
    robotsIndex: normalizeBoolean(payload.robotsIndex, current.robotsIndex),
    productTemplate: sanitizeString(payload.productTemplate, {
      max: 160,
      defaultValue: current.productTemplate
    }),
    categoryTemplate: sanitizeString(payload.categoryTemplate, {
      max: 160,
      defaultValue: current.categoryTemplate
    }),
    blogTemplate: sanitizeString(payload.blogTemplate, {
      max: 160,
      defaultValue: current.blogTemplate
    })
  };

  await query(`UPDATE seo_settings SET config_json = ? WHERE id = 1`, [
    stringifyJson(nextValue)
  ]);

  return nextValue;
}

module.exports = {
  getSiteSettings,
  saveSiteSettings,
  getHomeContent,
  saveHomeContent,
  getSeoSettings,
  saveSeoSettings
};
