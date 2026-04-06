import type {
  MailerSettingsState,
  SiteSettingsState,
  SiteThemeState
} from "../../types/admin";

export function createDefaultSiteTheme(): SiteThemeState {
  return {
    preset: "default",
    effectsEnabled: true
  };
}

export function normalizeSiteTheme(value?: Partial<SiteThemeState> | null): SiteThemeState {
  const fallback = createDefaultSiteTheme();
  const source = value ?? {};

  return {
    preset: source.preset === "christmas" ? "christmas" : fallback.preset,
    effectsEnabled: source.effectsEnabled ?? fallback.effectsEnabled
  };
}

export function createDefaultMailerSettings(): MailerSettingsState {
  return {
    enabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    smtpPassword: "",
    hasPassword: false,
    clearPassword: false,
    fromEmail: "hello@maxplus-sport.com",
    fromName: "MaxPlus Sporting Goods",
    replyTo: "support@maxplus-sport.com",
    subjectTemplate: "Thanks for subscribing to {{brandName}}",
    htmlTemplate: "",
    textTemplate: ""
  };
}

export function normalizeMailerSettings(
  value?: Partial<MailerSettingsState> | null
): MailerSettingsState {
  const fallback = createDefaultMailerSettings();
  const source = value ?? {};

  return {
    enabled: source.enabled ?? fallback.enabled,
    host: source.host?.trim() || fallback.host,
    port:
      typeof source.port === "number" && source.port >= 1 && source.port <= 65535
        ? Math.round(source.port)
        : fallback.port,
    secure: source.secure ?? fallback.secure,
    username: source.username?.trim() || fallback.username,
    smtpPassword: source.smtpPassword || "",
    hasPassword: source.hasPassword ?? fallback.hasPassword,
    clearPassword: source.clearPassword ?? false,
    fromEmail: source.fromEmail?.trim() || fallback.fromEmail,
    fromName: source.fromName?.trim() || fallback.fromName,
    replyTo: source.replyTo?.trim() || fallback.replyTo,
    subjectTemplate: source.subjectTemplate?.trim() || fallback.subjectTemplate,
    htmlTemplate: source.htmlTemplate || fallback.htmlTemplate,
    textTemplate: source.textTemplate || fallback.textTemplate
  };
}

export function createDefaultSiteSettings(): SiteSettingsState {
  return {
    brand: {
      brandName: "",
      siteTitle: "",
      siteDescription: "",
      supportEmail: "",
      salesEmail: "",
      phone: "",
      whatsapp: "",
      defaultLanguage: "",
      defaultCurrency: "",
      timezone: "",
      address: ""
    },
    socials: [],
    notifications: {
      inquiryRecipients: "",
      subscriberRecipients: "",
      enableEmailNotice: false,
      enableSlackNotice: false
    },
    theme: createDefaultSiteTheme(),
    mailer: createDefaultMailerSettings()
  };
}

export function normalizeSiteSettings(
  value?: Partial<SiteSettingsState> | null
): SiteSettingsState {
  const fallback = createDefaultSiteSettings();
  const source = value ?? {};

  return {
    brand: {
      ...fallback.brand,
      ...(source.brand ?? {})
    },
    socials: Array.isArray(source.socials)
      ? source.socials.map((item) => ({
          name: item?.name || "",
          url: item?.url || ""
        }))
      : fallback.socials,
    notifications: {
      ...fallback.notifications,
      ...(source.notifications ?? {})
    },
    theme: normalizeSiteTheme(source.theme),
    mailer: normalizeMailerSettings(source.mailer)
  };
}
