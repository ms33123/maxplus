const { seedSiteSettings } = require("../../constants/seeds");
const { decryptField, encryptField } = require("../../security/hybridCrypto");
const {
  sanitizeString,
  sanitizeText,
  sanitizeEmail,
  normalizeBoolean,
  normalizeInteger
} = require("../../utils/normalizers");
const { HttpError } = require("../../utils/errors");

const defaultMailerSettings = seedSiteSettings.mailer;

function normalizeStoredMailerSettings(value, fallback = defaultMailerSettings) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    enabled: normalizeBoolean(base.enabled, fallback.enabled),
    host: sanitizeString(base.host, { max: 160, defaultValue: fallback.host }),
    port: normalizeInteger(base.port, {
      min: 1,
      max: 65535,
      defaultValue: fallback.port
    }),
    secure: normalizeBoolean(base.secure, fallback.secure),
    username: sanitizeString(base.username, {
      max: 160,
      defaultValue: fallback.username
    }),
    passwordCipher: sanitizeText(base.passwordCipher, {
      max: 4000,
      defaultValue: fallback.passwordCipher
    }),
    fromEmail: sanitizeEmail(base.fromEmail || fallback.fromEmail, false),
    fromName: sanitizeString(base.fromName, {
      max: 120,
      defaultValue: fallback.fromName
    }),
    replyTo: sanitizeEmail(base.replyTo || fallback.replyTo, false),
    subjectTemplate: sanitizeString(base.subjectTemplate, {
      max: 200,
      defaultValue: fallback.subjectTemplate
    }),
    htmlTemplate: sanitizeText(base.htmlTemplate, {
      max: 12000,
      defaultValue: fallback.htmlTemplate
    }),
    textTemplate: sanitizeText(base.textTemplate, {
      max: 6000,
      defaultValue: fallback.textTemplate
    })
  };
}

function mapMailerSettingsForAdmin(value, fallback = defaultMailerSettings) {
  const stored = normalizeStoredMailerSettings(value, fallback);

  return {
    enabled: stored.enabled,
    host: stored.host,
    port: stored.port,
    secure: stored.secure,
    username: stored.username,
    smtpPassword: "",
    hasPassword: Boolean(stored.passwordCipher),
    clearPassword: false,
    fromEmail: stored.fromEmail,
    fromName: stored.fromName,
    replyTo: stored.replyTo,
    subjectTemplate: stored.subjectTemplate,
    htmlTemplate: stored.htmlTemplate,
    textTemplate: stored.textTemplate
  };
}

function normalizeMailerSettingsInput(input, currentStored = defaultMailerSettings) {
  const base = input && typeof input === "object" ? input : {};
  const current = normalizeStoredMailerSettings(currentStored, defaultMailerSettings);
  const smtpPassword = sanitizeText(base.smtpPassword, { max: 1000 });
  const clearPassword = normalizeBoolean(base.clearPassword, false);

  const nextValue = {
    enabled: normalizeBoolean(base.enabled, current.enabled),
    host: sanitizeString(base.host, { max: 160, defaultValue: current.host }),
    port: normalizeInteger(base.port, {
      min: 1,
      max: 65535,
      defaultValue: current.port || defaultMailerSettings.port
    }),
    secure: normalizeBoolean(base.secure, current.secure),
    username: sanitizeString(base.username, {
      max: 160,
      defaultValue: current.username
    }),
    passwordCipher: current.passwordCipher,
    fromEmail: sanitizeEmail(base.fromEmail || current.fromEmail || defaultMailerSettings.fromEmail, false),
    fromName: sanitizeString(base.fromName, {
      max: 120,
      defaultValue: current.fromName || defaultMailerSettings.fromName
    }),
    replyTo: sanitizeEmail(base.replyTo || current.replyTo || defaultMailerSettings.replyTo, false),
    subjectTemplate: sanitizeString(base.subjectTemplate, {
      max: 200,
      defaultValue: current.subjectTemplate || defaultMailerSettings.subjectTemplate
    }),
    htmlTemplate: sanitizeText(base.htmlTemplate, {
      max: 12000,
      defaultValue: current.htmlTemplate || defaultMailerSettings.htmlTemplate
    }),
    textTemplate: sanitizeText(base.textTemplate, {
      max: 6000,
      defaultValue: current.textTemplate || defaultMailerSettings.textTemplate
    })
  };

  if (clearPassword) {
    nextValue.passwordCipher = "";
  } else if (smtpPassword) {
    nextValue.passwordCipher = encryptField(smtpPassword);
  }

  if (nextValue.enabled) {
    if (!nextValue.host) {
      throw new HttpError(400, "启用邮件发送时必须填写 SMTP 主机。");
    }

    nextValue.fromEmail = sanitizeEmail(nextValue.fromEmail);

    if (nextValue.replyTo) {
      nextValue.replyTo = sanitizeEmail(nextValue.replyTo, false);
    }

    if (nextValue.username && !nextValue.passwordCipher) {
      throw new HttpError(400, "填写 SMTP 用户名后必须提供密码。");
    }

    if (!nextValue.subjectTemplate) {
      throw new HttpError(400, "请填写订阅确认邮件主题模板。");
    }

    if (!nextValue.htmlTemplate && !nextValue.textTemplate) {
      throw new HttpError(400, "HTML 模板和纯文本模板至少需要填写一个。");
    }
  }

  return nextValue;
}

function resolveMailerRuntimeSettings(value, fallback = defaultMailerSettings) {
  const stored = normalizeStoredMailerSettings(value, fallback);

  return {
    ...stored,
    password: stored.passwordCipher ? decryptField(stored.passwordCipher) : ""
  };
}

module.exports = {
  defaultMailerSettings,
  normalizeStoredMailerSettings,
  mapMailerSettingsForAdmin,
  normalizeMailerSettingsInput,
  resolveMailerRuntimeSettings
};
