const { seedSubscribePopup } = require("../../constants/seeds");
const {
  sanitizeString,
  sanitizeText,
  normalizeBoolean,
  normalizeEnum,
  ensureId
} = require("../../utils/normalizers");
const { HttpError } = require("../../utils/errors");

const subscribeFieldTypeOptions = ["text", "email", "tel", "textarea", "select"];
const subscribeStylePresetOptions = [
  "classic-button",
  "classic-gift",
  "sport-burst",
  "midnight-gift"
];

function normalizeSubscribeBenefits(value, fallback = seedSubscribePopup.benefits) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 8)
    .map((item) => sanitizeText(item, { max: 160 }))
    .filter(Boolean);
}

function normalizeSubscribeFieldKey(value, fallbackValue, usedKeys) {
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

function normalizeSubscribeFieldOptions(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;

  return source
    .slice(0, 20)
    .map((item) => ({
      value: sanitizeString(item?.value, { max: 60 }),
      label: sanitizeString(item?.label, { max: 80 })
    }))
    .filter((item) => item.value && item.label);
}

function normalizeSubscribeFormFields(value, fallback = seedSubscribePopup.formFields) {
  const source = Array.isArray(value) && value.length ? value : fallback;
  const usedKeys = new Set();

  return source.slice(0, 12).map((item, index) => {
    const fallbackItem = fallback[index] || {};
    const type = normalizeEnum(item?.type, subscribeFieldTypeOptions, fallbackItem.type || "text");

    return {
      id: ensureId(item?.id, `subscribe-field-${index + 1}`),
      key: normalizeSubscribeFieldKey(
        item?.key,
        fallbackItem.key || `field_${index + 1}`,
        usedKeys
      ),
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
          ? normalizeSubscribeFieldOptions(item?.options, fallbackItem.options)
          : []
    };
  });
}

function normalizeSubscribePopup(value, fallback = seedSubscribePopup) {
  const base = value && typeof value === "object" ? value : fallback;

  return {
    enabled: normalizeBoolean(base.enabled, fallback.enabled),
    stylePreset: normalizeEnum(
      base.stylePreset,
      subscribeStylePresetOptions,
      fallback.stylePreset || "classic-gift"
    ),
    toggleLabel: sanitizeString(base.toggleLabel, {
      max: 60,
      defaultValue: fallback.toggleLabel
    }),
    eyebrow: sanitizeString(base.eyebrow, {
      max: 80,
      defaultValue: fallback.eyebrow
    }),
    title: sanitizeString(base.title, {
      max: 180,
      defaultValue: fallback.title
    }),
    text: sanitizeText(base.text, {
      max: 320,
      defaultValue: fallback.text
    }),
    benefitsTitle: sanitizeString(base.benefitsTitle, {
      max: 120,
      defaultValue: fallback.benefitsTitle
    }),
    benefits: normalizeSubscribeBenefits(base.benefits, fallback.benefits),
    submitLabel: sanitizeString(base.submitLabel, {
      max: 60,
      defaultValue: fallback.submitLabel
    }),
    successMessage: sanitizeString(base.successMessage, {
      max: 160,
      defaultValue: fallback.successMessage
    }),
    sourceLabel: sanitizeString(base.sourceLabel, {
      max: 120,
      defaultValue: fallback.sourceLabel
    }),
    formFields: normalizeSubscribeFormFields(base.formFields, fallback.formFields)
  };
}

function findSubscribeEmailField(fields) {
  return fields.find(
    (item) => item.enabled && (item.key.toLowerCase() === "email" || item.type === "email")
  );
}

function assertValidSubscribePopup(value) {
  const enabledFields = value.formFields.filter((item) => item.enabled);

  if (!enabledFields.length) {
    throw new HttpError(400, "订阅弹窗至少需要启用一个表单字段。");
  }

  const emailField = findSubscribeEmailField(enabledFields);

  if (!emailField) {
    throw new HttpError(400, "订阅弹窗至少需要一个启用中的邮箱字段。");
  }
}

module.exports = {
  normalizeSubscribePopup,
  normalizeSubscribeFormFields,
  findSubscribeEmailField,
  assertValidSubscribePopup
};
