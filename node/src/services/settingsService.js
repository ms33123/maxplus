const { query } = require("../config/database");
const { safeParseJson, stringifyJson } = require("../utils/json");
const {
  seedSiteSettings,
  seedHomeContent,
  seedBrandStory,
  seedBlogPage,
  seedSubscribePopup
} = require("../constants/seeds");
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
const {
  mapMailerSettingsForAdmin,
  normalizeStoredMailerSettings,
  normalizeMailerSettingsInput,
  resolveMailerRuntimeSettings
} = require("./settings/mailerSettings");
const {
  normalizeSubscribePopup,
  assertValidSubscribePopup
} = require("./settings/subscribeSettings");

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

const defaultHomeProductSection = seedHomeContent.productSection;
const defaultHomeVideoSection = seedHomeContent.videoSection;
const defaultHomeCategorySection = seedHomeContent.categorySection;
const defaultHomeContactSection = seedHomeContent.contactSection;
const contactFieldTypeOptions = ["text", "email", "tel", "textarea", "select"];
const siteThemePresetOptions = ["default", "christmas"];

function splitStoredBrandTheme(value) {
  const base = value && typeof value === "object" ? value : {};
  const { theme, ...brand } = base;

  return {
    brand,
    theme
  };
}

function normalizeSiteTheme(value, fallback = seedSiteSettings.theme) {
  const base = value && typeof value === "object" ? value : {};

  return {
    preset: normalizeEnum(base.preset, siteThemePresetOptions, fallback.preset),
    effectsEnabled: normalizeBoolean(base.effectsEnabled, fallback.effectsEnabled)
  };
}

function mapSiteSettings(row) {
  const storedBrand = safeParseJson(row.brand_json, {});
  const { brand, theme } = splitStoredBrandTheme(storedBrand);

  return {
    brand,
    socials: safeParseJson(row.socials_json, []),
    notifications: safeParseJson(row.notifications_json, {}),
    footer: safeParseJson(row.footer_json, {}),
    theme: normalizeSiteTheme(theme),
    mailer: mapMailerSettingsForAdmin(
      safeParseJson(row.mailer_json, seedSiteSettings.mailer),
      seedSiteSettings.mailer
    )
  };
}

function mapPublicSiteSettings(row) {
  const storedBrand = safeParseJson(row.brand_json, {});
  const { brand, theme } = splitStoredBrandTheme(storedBrand);

  return {
    brand,
    socials: safeParseJson(row.socials_json, []),
    footer: safeParseJson(row.footer_json, {}),
    theme: normalizeSiteTheme(theme)
  };
}

function mapHomeContent(row) {
  return {
    heroSlides: safeParseJson(row?.hero_slides_json, seedHomeContent.heroSlides),
    highlights: safeParseJson(row?.highlights_json, seedHomeContent.highlights),
    productSection: safeParseJson(row?.product_section_json, defaultHomeProductSection),
    featuredProductSlugs: safeParseJson(row?.featured_product_slugs_json, seedHomeContent.featuredProductSlugs),
    videoSection: safeParseJson(row?.video_section_json, defaultHomeVideoSection),
    featuredVideoSlugs: safeParseJson(row?.featured_video_slugs_json, seedHomeContent.featuredVideoSlugs),
    categorySection: safeParseJson(row?.category_section_json, defaultHomeCategorySection),
    reviews: safeParseJson(row?.reviews_json, defaultHomeReviews),
    contactSection: safeParseJson(row?.contact_section_json, defaultHomeContactSection),
    sectionToggles: safeParseJson(row?.section_toggles_json, seedHomeContent.sectionToggles)
  };
}

function mapSeoSettings(row) {
  return safeParseJson(row.config_json, {});
}

function mapBrandStory(row) {
  return safeParseJson(row.brand_story_json, seedBrandStory);
}

function mapBlogPage(row) {
  return safeParseJson(row.blog_page_json, seedBlogPage);
}

function mapSubscribePopup(row) {
  return safeParseJson(row.subscribe_popup_json, seedSubscribePopup);
}

async function getSiteSettingsRow() {
  const rows = await query(`SELECT * FROM site_settings WHERE id = 1 LIMIT 1`);
  return rows[0];
}

async function getSiteSettings() {
  return mapSiteSettings(await getSiteSettingsRow());
}

async function getPublicSiteSettings() {
  return mapPublicSiteSettings(await getSiteSettingsRow());
}

async function getSubscribePopup() {
  return normalizeSubscribePopup(mapSubscribePopup(await getSiteSettingsRow()), seedSubscribePopup);
}

async function getMailerRuntimeSettings() {
  const row = await getSiteSettingsRow();
  return resolveMailerRuntimeSettings(
    safeParseJson(row.mailer_json, seedSiteSettings.mailer),
    seedSiteSettings.mailer
  );
}

async function getBlogPage() {
  const row = await getSiteSettingsRow();
  return normalizeBlogPage(mapBlogPage(row), seedBlogPage);
}

async function saveSiteSettings(payload) {
  const row = await getSiteSettingsRow();
  const current = mapSiteSettings(row);
  const currentStoredMailer = normalizeStoredMailerSettings(
    safeParseJson(row.mailer_json, seedSiteSettings.mailer),
    seedSiteSettings.mailer
  );
  const brandInput = payload.brand || {};
  const notificationsInput = payload.notifications || {};
  const socialsInput = Array.isArray(payload.socials) ? payload.socials : current.socials;
  const themeInput = payload.theme || {};
  const mailerInput = payload.mailer || {};

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
    footer: current.footer,
    theme: normalizeSiteTheme(themeInput, current.theme),
    mailer: normalizeMailerSettingsInput(mailerInput, currentStoredMailer)
  };

  await query(
    `UPDATE site_settings
     SET brand_json = ?, socials_json = ?, notifications_json = ?, footer_json = ?, mailer_json = ?
     WHERE id = 1`,
    [
      stringifyJson({
        ...nextValue.brand,
        theme: nextValue.theme
      }),
      stringifyJson(nextValue.socials),
      stringifyJson(nextValue.notifications),
      stringifyJson(nextValue.footer),
      stringifyJson(nextValue.mailer)
    ]
  );

  return {
    ...nextValue,
    mailer: mapMailerSettingsForAdmin(nextValue.mailer, seedSiteSettings.mailer)
  };
}

async function saveSubscribePopup(payload) {
  const nextValue = normalizeSubscribePopup(payload, seedSubscribePopup);
  assertValidSubscribePopup(nextValue);

  await query(`UPDATE site_settings SET subscribe_popup_json = ? WHERE id = 1`, [
    stringifyJson(nextValue)
  ]);

  return nextValue;
}

async function getHomeContent() {
  const rows = await query(`SELECT * FROM home_content WHERE id = 1 LIMIT 1`);
  return normalizeHomeContent(mapHomeContent(rows[0]), seedHomeContent);
}

function normalizeBlogPage(value, fallback = seedBlogPage) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    metaTitle: sanitizeString(base.metaTitle, { max: 160, defaultValue: fallback.metaTitle }),
    metaDescription: sanitizeText(base.metaDescription, {
      max: 300,
      defaultValue: fallback.metaDescription
    }),
    heroEyebrow: sanitizeString(base.heroEyebrow, { max: 80, defaultValue: fallback.heroEyebrow }),
    heroTitle: sanitizeString(base.heroTitle, { max: 180, defaultValue: fallback.heroTitle }),
    heroText: sanitizeText(base.heroText, { max: 320, defaultValue: fallback.heroText }),
    allCategoriesLabel: sanitizeString(base.allCategoriesLabel, {
      max: 80,
      defaultValue: fallback.allCategoriesLabel
    }),
    searchPlaceholder: sanitizeString(base.searchPlaceholder, {
      max: 120,
      defaultValue: fallback.searchPlaceholder
    }),
    sortLatestLabel: sanitizeString(base.sortLatestLabel, {
      max: 60,
      defaultValue: fallback.sortLatestLabel
    }),
    sortOldestLabel: sanitizeString(base.sortOldestLabel, {
      max: 60,
      defaultValue: fallback.sortOldestLabel
    }),
    resultsLabel: sanitizeString(base.resultsLabel, {
      max: 40,
      defaultValue: fallback.resultsLabel
    }),
    categoriesLabel: sanitizeString(base.categoriesLabel, {
      max: 40,
      defaultValue: fallback.categoriesLabel
    }),
    updatedLabel: sanitizeString(base.updatedLabel, {
      max: 60,
      defaultValue: fallback.updatedLabel
    }),
    readMoreLabel: sanitizeString(base.readMoreLabel, {
      max: 60,
      defaultValue: fallback.readMoreLabel
    }),
    emptyTitle: sanitizeString(base.emptyTitle, {
      max: 160,
      defaultValue: fallback.emptyTitle
    }),
    emptyText: sanitizeText(base.emptyText, {
      max: 300,
      defaultValue: fallback.emptyText
    }),
    previousLabel: sanitizeString(base.previousLabel, {
      max: 40,
      defaultValue: fallback.previousLabel
    }),
    nextLabel: sanitizeString(base.nextLabel, {
      max: 40,
      defaultValue: fallback.nextLabel
    }),
    perPage: normalizeInteger(base.perPage, {
      min: 3,
      max: 24,
      defaultValue: fallback.perPage
    })
  };
}

function normalizeHeroSlides(value, fallback = seedHomeContent.heroSlides) {
  const source = Array.isArray(value) ? value : fallback;

  return source.slice(0, 10).map((item, index) => {
    const fallbackItem = fallback[index] || {};

    return {
      id: ensureId(item?.id, `hero-${index + 1}`),
      eyebrow: sanitizeString(item?.eyebrow, {
        max: 80,
        defaultValue: fallbackItem.eyebrow || ""
      }),
      title: sanitizeString(item?.title, {
        max: 160,
        defaultValue: fallbackItem.title || ""
      }),
      subtitle: sanitizeText(item?.subtitle, {
        max: 300,
        defaultValue: fallbackItem.subtitle || ""
      }),
      targetUrl: sanitizeString(item?.targetUrl, {
        max: 200,
        defaultValue: fallbackItem.targetUrl || "/products"
      }),
      primaryLabel: sanitizeString(item?.primaryLabel, {
        max: 60,
        defaultValue: fallbackItem.primaryLabel || "Explore Products"
      }),
      secondaryLabel: sanitizeString(item?.secondaryLabel, {
        max: 60,
        defaultValue: fallbackItem.secondaryLabel || ""
      }),
      secondaryTargetUrl: sanitizeString(item?.secondaryTargetUrl, {
        max: 200,
        defaultValue: fallbackItem.secondaryTargetUrl || ""
      }),
      imageUrl: sanitizeString(item?.imageUrl, {
        max: 255,
        defaultValue: fallbackItem.imageUrl || ""
      }),
      enabled: normalizeBoolean(item?.enabled, fallbackItem.enabled ?? true)
    };
  });
}

function normalizeHomeProductSection(value, fallback = defaultHomeProductSection) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    eyebrow: sanitizeString(base.eyebrow, { max: 80, defaultValue: fallback.eyebrow }),
    title: sanitizeString(base.title, { max: 160, defaultValue: fallback.title }),
    text: sanitizeText(base.text, { max: 300, defaultValue: fallback.text }),
    detailsLabel: sanitizeString(base.detailsLabel, {
      max: 60,
      defaultValue: fallback.detailsLabel
    }),
    moreLabel: sanitizeString(base.moreLabel, {
      max: 60,
      defaultValue: fallback.moreLabel
    })
  };
}

function normalizeHomeVideoSection(value, fallback = defaultHomeVideoSection) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    eyebrow: sanitizeString(base.eyebrow, { max: 80, defaultValue: fallback.eyebrow }),
    title: sanitizeString(base.title, { max: 160, defaultValue: fallback.title }),
    text: sanitizeText(base.text, { max: 300, defaultValue: fallback.text }),
    featuredCtaLabel: sanitizeString(base.featuredCtaLabel, {
      max: 60,
      defaultValue: fallback.featuredCtaLabel
    }),
    moreLabel: sanitizeString(base.moreLabel, {
      max: 60,
      defaultValue: fallback.moreLabel
    })
  };
}

function normalizeHomeCategorySection(value, fallback = defaultHomeCategorySection) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    eyebrow: sanitizeString(base.eyebrow, { max: 80, defaultValue: fallback.eyebrow }),
    title: sanitizeString(base.title, { max: 180, defaultValue: fallback.title }),
    text: sanitizeText(base.text, { max: 320, defaultValue: fallback.text }),
    moreLabel: sanitizeString(base.moreLabel, { max: 60, defaultValue: fallback.moreLabel })
  };
}

function normalizeContactFieldSet(value, fallback = defaultHomeContactSection.fields) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    nameLabel: sanitizeString(base.nameLabel, { max: 40, defaultValue: fallback.nameLabel }),
    namePlaceholder: sanitizeString(base.namePlaceholder, {
      max: 80,
      defaultValue: fallback.namePlaceholder
    }),
    emailLabel: sanitizeString(base.emailLabel, { max: 40, defaultValue: fallback.emailLabel }),
    emailPlaceholder: sanitizeString(base.emailPlaceholder, {
      max: 80,
      defaultValue: fallback.emailPlaceholder
    }),
    phoneLabel: sanitizeString(base.phoneLabel, { max: 40, defaultValue: fallback.phoneLabel }),
    phonePlaceholder: sanitizeString(base.phonePlaceholder, {
      max: 80,
      defaultValue: fallback.phonePlaceholder
    }),
    companyLabel: sanitizeString(base.companyLabel, {
      max: 40,
      defaultValue: fallback.companyLabel
    }),
    companyPlaceholder: sanitizeString(base.companyPlaceholder, {
      max: 80,
      defaultValue: fallback.companyPlaceholder
    }),
    interestLabel: sanitizeString(base.interestLabel, {
      max: 60,
      defaultValue: fallback.interestLabel
    }),
    chooseOne: sanitizeString(base.chooseOne, { max: 40, defaultValue: fallback.chooseOne }),
    messageLabel: sanitizeString(base.messageLabel, {
      max: 40,
      defaultValue: fallback.messageLabel
    }),
    messagePlaceholder: sanitizeString(base.messagePlaceholder, {
      max: 180,
      defaultValue: fallback.messagePlaceholder
    }),
    submitLabel: sanitizeString(base.submitLabel, {
      max: 60,
      defaultValue: fallback.submitLabel
    })
  };
}

function normalizeContactFieldRules(value, fallback) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    enabled: normalizeBoolean(base.enabled, fallback.enabled),
    required: normalizeBoolean(base.required, fallback.required)
  };
}

function normalizeContactFieldConfig(value, fallback = defaultHomeContactSection.fieldConfig) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    name: normalizeContactFieldRules(base.name, fallback.name),
    email: normalizeContactFieldRules(base.email, fallback.email),
    phone: normalizeContactFieldRules(base.phone, fallback.phone),
    company: normalizeContactFieldRules(base.company, fallback.company),
    interest: normalizeContactFieldRules(base.interest, fallback.interest),
    message: normalizeContactFieldRules(base.message, fallback.message)
  };
}

function normalizeContactOptions(value, fallback = defaultHomeContactSection.interestOptions) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 12)
    .map((item, index) => {
      const fallbackItem = fallback[index] || {};
      return {
        value: sanitizeString(item?.value, {
          max: 60,
          defaultValue: fallbackItem.value || ""
        }),
        label: sanitizeString(item?.label, {
          max: 80,
          defaultValue: fallbackItem.label || ""
        })
      };
    })
    .filter((item) => item.value && item.label);
}

function normalizeContactFormFieldKey(value, fallbackValue, usedKeys) {
  const raw = sanitizeString(value, { max: 40, defaultValue: fallbackValue })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const base = raw || fallbackValue;
  let key = base;
  let suffix = 2;

  while (usedKeys.has(key)) {
    key = `${base}_${suffix}`;
    suffix += 1;
  }

  usedKeys.add(key);
  return key;
}

function normalizeContactFormFieldOptions(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 20)
    .map((item) => ({
      value: sanitizeString(item?.value, { max: 60 }),
      label: sanitizeString(item?.label, { max: 80 })
    }))
    .filter((item) => item.value && item.label);
}

function buildLegacyContactFormFields(source, fallback = defaultHomeContactSection) {
  const fields = normalizeContactFieldSet(source?.fields, fallback.fields);
  const fieldConfig = normalizeContactFieldConfig(source?.fieldConfig, fallback.fieldConfig);
  const interestOptions = normalizeContactOptions(source?.interestOptions, fallback.interestOptions);

  return [
    {
      id: "contact-field-name",
      key: "name",
      type: "text",
      label: fields.nameLabel,
      placeholder: fields.namePlaceholder,
      enabled: fieldConfig.name.enabled,
      required: fieldConfig.name.required,
      options: []
    },
    {
      id: "contact-field-email",
      key: "email",
      type: "email",
      label: fields.emailLabel,
      placeholder: fields.emailPlaceholder,
      enabled: fieldConfig.email.enabled,
      required: fieldConfig.email.required,
      options: []
    },
    {
      id: "contact-field-phone",
      key: "phone",
      type: "tel",
      label: fields.phoneLabel,
      placeholder: fields.phonePlaceholder,
      enabled: fieldConfig.phone.enabled,
      required: fieldConfig.phone.required,
      options: []
    },
    {
      id: "contact-field-company",
      key: "company",
      type: "text",
      label: fields.companyLabel,
      placeholder: fields.companyPlaceholder,
      enabled: fieldConfig.company.enabled,
      required: fieldConfig.company.required,
      options: []
    },
    {
      id: "contact-field-interest",
      key: "interest",
      type: "select",
      label: fields.interestLabel,
      placeholder: fields.chooseOne,
      enabled: fieldConfig.interest.enabled,
      required: fieldConfig.interest.required,
      options: interestOptions
    },
    {
      id: "contact-field-message",
      key: "message",
      type: "textarea",
      label: fields.messageLabel,
      placeholder: fields.messagePlaceholder,
      enabled: fieldConfig.message.enabled,
      required: fieldConfig.message.required,
      options: []
    }
  ];
}

function normalizeContactFormFields(value, fallback = defaultHomeContactSection.formFields, source) {
  const rawFields = Array.isArray(value) && value.length ? value : buildLegacyContactFormFields(source);
  const usedKeys = new Set();

  return rawFields.slice(0, 12).map((item, index) => {
    const fallbackItem = fallback?.[index] || {};
    const type = normalizeEnum(item?.type, contactFieldTypeOptions, fallbackItem.type || "text");
    const key = normalizeContactFormFieldKey(
      item?.key,
      fallbackItem.key || `field_${index + 1}`,
      usedKeys
    );

    return {
      id: ensureId(item?.id, `contact-field-${index + 1}`),
      key,
      type,
      label: sanitizeString(item?.label, {
        max: 60,
        defaultValue: fallbackItem.label || `Field ${index + 1}`
      }),
      placeholder: sanitizeString(item?.placeholder, {
        max: 120,
        defaultValue: fallbackItem.placeholder || ""
      }),
      enabled: normalizeBoolean(item?.enabled, fallbackItem.enabled ?? true),
      required: normalizeBoolean(item?.required, fallbackItem.required ?? false),
      options:
        type === "select"
          ? normalizeContactFormFieldOptions(item?.options, fallbackItem.options)
          : []
    };
  });
}

function findContactFormField(fields, key) {
  return fields.find((item) => item.key === key);
}

function buildLegacyContactFieldSetFromFormFields(formFields, fields) {
  const nameField = findContactFormField(formFields, "name");
  const emailField = findContactFormField(formFields, "email");
  const phoneField = findContactFormField(formFields, "phone");
  const companyField = findContactFormField(formFields, "company");
  const interestField = findContactFormField(formFields, "interest");
  const messageField = findContactFormField(formFields, "message");

  return {
    nameLabel: nameField?.label || fields.nameLabel,
    namePlaceholder: nameField?.placeholder || fields.namePlaceholder,
    emailLabel: emailField?.label || fields.emailLabel,
    emailPlaceholder: emailField?.placeholder || fields.emailPlaceholder,
    phoneLabel: phoneField?.label || fields.phoneLabel,
    phonePlaceholder: phoneField?.placeholder || fields.phonePlaceholder,
    companyLabel: companyField?.label || fields.companyLabel,
    companyPlaceholder: companyField?.placeholder || fields.companyPlaceholder,
    interestLabel: interestField?.label || fields.interestLabel,
    chooseOne: interestField?.placeholder || fields.chooseOne,
    messageLabel: messageField?.label || fields.messageLabel,
    messagePlaceholder: messageField?.placeholder || fields.messagePlaceholder,
    submitLabel: fields.submitLabel
  };
}

function buildLegacyContactFieldConfigFromFormFields(formFields, fieldConfig) {
  const findRule = (key, fallbackRule) => {
    const field = findContactFormField(formFields, key);

    return {
      enabled: field?.enabled ?? fallbackRule.enabled,
      required: field?.required ?? fallbackRule.required
    };
  };

  return {
    name: findRule("name", fieldConfig.name),
    email: findRule("email", fieldConfig.email),
    phone: findRule("phone", fieldConfig.phone),
    company: findRule("company", fieldConfig.company),
    interest: findRule("interest", fieldConfig.interest),
    message: findRule("message", fieldConfig.message)
  };
}

function buildLegacyInterestOptionsFromFormFields(formFields, fallback) {
  const selectField =
    findContactFormField(formFields, "interest") || formFields.find((item) => item.type === "select");

  return selectField?.options?.length ? selectField.options : fallback;
}

function normalizeHomeContactSection(value, fallback = defaultHomeContactSection) {
  const base = value && typeof value === "object" ? value : fallback;
  const fields = normalizeContactFieldSet(base.fields, fallback.fields);
  const fieldConfig = normalizeContactFieldConfig(base.fieldConfig, fallback.fieldConfig);
  const interestOptions = normalizeContactOptions(base.interestOptions, fallback.interestOptions);
  const formFields = normalizeContactFormFields(base.formFields, fallback.formFields, {
    fields,
    fieldConfig,
    interestOptions
  });

  return {
    eyebrow: sanitizeString(base.eyebrow, { max: 80, defaultValue: fallback.eyebrow }),
    title: sanitizeString(base.title, { max: 160, defaultValue: fallback.title }),
    text: sanitizeText(base.text, { max: 320, defaultValue: fallback.text }),
    successMessage: sanitizeString(base.successMessage, {
      max: 120,
      defaultValue: fallback.successMessage
    }),
    formFields,
    fields: buildLegacyContactFieldSetFromFormFields(formFields, fields),
    fieldConfig: buildLegacyContactFieldConfigFromFormFields(formFields, fieldConfig),
    interestOptions: buildLegacyInterestOptionsFromFormFields(formFields, interestOptions)
  };
}

function normalizeSectionToggles(value, fallback = seedHomeContent.sectionToggles) {
  const source = Array.isArray(value) ? value : [];

  return fallback.map((item) => {
    const matched = source.find((entry) => entry?.key === item.key) || {};

    return {
      key: item.key,
      label: sanitizeString(matched.label, { max: 60, defaultValue: item.label }),
      enabled: normalizeBoolean(matched.enabled, item.enabled)
    };
  });
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

function normalizeHomeContent(value, fallback = seedHomeContent) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    heroSlides: normalizeHeroSlides(base.heroSlides, fallback.heroSlides),
    highlights: normalizeStringArray(base.highlights ?? fallback.highlights, {
      maxItems: 8,
      maxItemLength: 120
    }),
    productSection: normalizeHomeProductSection(base.productSection, fallback.productSection),
    featuredProductSlugs: normalizeStringArray(
      base.featuredProductSlugs ?? fallback.featuredProductSlugs,
      { maxItems: 8, maxItemLength: 180 }
    ),
    videoSection: normalizeHomeVideoSection(base.videoSection, fallback.videoSection),
    featuredVideoSlugs: normalizeStringArray(
      base.featuredVideoSlugs ?? fallback.featuredVideoSlugs,
      { maxItems: 8, maxItemLength: 180 }
    ),
    categorySection: normalizeHomeCategorySection(base.categorySection, fallback.categorySection),
    reviews: normalizeReviews(base.reviews ?? fallback.reviews, fallback.reviews ?? defaultHomeReviews),
    contactSection: normalizeHomeContactSection(base.contactSection, fallback.contactSection),
    sectionToggles: normalizeSectionToggles(base.sectionToggles, fallback.sectionToggles)
  };
}

async function saveHomeContent(payload) {
  const current = await getHomeContent();
  const nextValue = normalizeHomeContent(payload, current || seedHomeContent);

  await query(
    `UPDATE home_content
     SET hero_slides_json = ?, highlights_json = ?, product_section_json = ?, featured_product_slugs_json = ?, video_section_json = ?, featured_video_slugs_json = ?, category_section_json = ?, reviews_json = ?, contact_section_json = ?, section_toggles_json = ?
     WHERE id = 1`,
    [
      stringifyJson(nextValue.heroSlides),
      stringifyJson(nextValue.highlights),
      stringifyJson(nextValue.productSection),
      stringifyJson(nextValue.featuredProductSlugs),
      stringifyJson(nextValue.videoSection),
      stringifyJson(nextValue.featuredVideoSlugs),
      stringifyJson(nextValue.categorySection),
      stringifyJson(nextValue.reviews),
      stringifyJson(nextValue.contactSection),
      stringifyJson(nextValue.sectionToggles)
    ]
  );

  return nextValue;
}

async function saveBlogPage(payload) {
  const current = await getBlogPage();
  const nextValue = normalizeBlogPage(payload, current || seedBlogPage);

  await query(`UPDATE site_settings SET blog_page_json = ? WHERE id = 1`, [
    stringifyJson(nextValue)
  ]);

  return nextValue;
}

async function getSeoSettings() {
  const rows = await query(`SELECT * FROM seo_settings WHERE id = 1 LIMIT 1`);
  return mapSeoSettings(rows[0]);
}

async function getBrandStory() {
  const row = await getSiteSettingsRow();
  return mapBrandStory(row);
}

function normalizeBrandStoryStats(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 6)
    .map((item, index) => ({
      id: ensureId(item?.id, `brand-stat-${index + 1}`),
      value: sanitizeString(item?.value, { max: 40 }),
      label: sanitizeString(item?.label, { max: 120 })
    }))
    .filter((item) => item.value && item.label);
}

function normalizeBrandStoryHighlights(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 8)
    .map((item, index) => ({
      id: ensureId(item?.id, `brand-highlight-${index + 1}`),
      tag: sanitizeString(item?.tag, { max: 40 }),
      title: sanitizeString(item?.title, { max: 120 }),
      text: sanitizeText(item?.text, { max: 320 })
    }))
    .filter((item) => item.title && item.text);
}

function normalizeBrandStoryParagraphs(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 8)
    .map((item) => sanitizeText(item, { max: 500 }))
    .filter(Boolean);
}

function normalizeBrandStory(value, fallback = seedBrandStory) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    metaTitle: sanitizeString(base.metaTitle, { max: 160, defaultValue: fallback.metaTitle }),
    metaDescription: sanitizeText(base.metaDescription, {
      max: 300,
      defaultValue: fallback.metaDescription
    }),
    heroEyebrow: sanitizeString(base.heroEyebrow, { max: 80, defaultValue: fallback.heroEyebrow }),
    heroTitle: sanitizeString(base.heroTitle, { max: 180, defaultValue: fallback.heroTitle }),
    heroText: sanitizeText(base.heroText, { max: 500, defaultValue: fallback.heroText }),
    storyParagraphs: normalizeBrandStoryParagraphs(base.storyParagraphs, fallback.storyParagraphs),
    stats: normalizeBrandStoryStats(base.stats, fallback.stats),
    highlights: normalizeBrandStoryHighlights(base.highlights, fallback.highlights),
    categoryEyebrow: sanitizeString(base.categoryEyebrow, {
      max: 80,
      defaultValue: fallback.categoryEyebrow
    }),
    categoryTitle: sanitizeString(base.categoryTitle, {
      max: 180,
      defaultValue: fallback.categoryTitle
    }),
    categoryText: sanitizeText(base.categoryText, {
      max: 300,
      defaultValue: fallback.categoryText
    })
  };
}

async function saveBrandStory(payload) {
  const current = await getBrandStory();
  const nextValue = normalizeBrandStory(payload, current || seedBrandStory);

  await query(`UPDATE site_settings SET brand_story_json = ? WHERE id = 1`, [
    stringifyJson(nextValue)
  ]);

  return nextValue;
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
  getPublicSiteSettings,
  saveSiteSettings,
  getSubscribePopup,
  saveSubscribePopup,
  getMailerRuntimeSettings,
  getHomeContent,
  saveHomeContent,
  getBlogPage,
  saveBlogPage,
  getBrandStory,
  saveBrandStory,
  getSeoSettings,
  saveSeoSettings
};
