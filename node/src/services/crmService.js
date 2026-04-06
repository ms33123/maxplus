const { query } = require("../config/database");
const { decryptField, encryptField } = require("../security/hybridCrypto");
const { safeParseJson, stringifyJson } = require("../utils/json");
const {
  sanitizeString,
  sanitizeText,
  sanitizeEmail,
  maskEmail,
  normalizeEnum,
  ensureId
} = require("../utils/normalizers");
const { HttpError } = require("../utils/errors");
const {
  getPublicSiteSettings,
  getSubscribePopup,
  getMailerRuntimeSettings
} = require("./settingsService");
const { findSubscribeEmailField } = require("./settings/subscribeSettings");
const { sendSubscriptionConfirmation } = require("./subscriptionMailService");
const inquiryFieldTypeOptions = ["text", "email", "tel", "textarea", "select"];

function normalizeInquiryFieldKey(value, fallbackValue = "field") {
  return sanitizeString(value, { max: 40, defaultValue: fallbackValue })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || fallbackValue;
}

function normalizeInquiryFields(value) {
  const source = Array.isArray(value) ? value : [];
  const usedKeys = new Set();

  return source
    .slice(0, 20)
    .map((item, index) => {
      const baseKey = normalizeInquiryFieldKey(item?.key, `field_${index + 1}`);
      let key = baseKey;
      let suffix = 2;

      while (usedKeys.has(key)) {
        key = `${baseKey}_${suffix}`;
        suffix += 1;
      }

      usedKeys.add(key);

      return {
        key,
        label: sanitizeString(item?.label, {
          max: 60,
          defaultValue: sanitizeString(item?.key, { max: 60, defaultValue: `Field ${index + 1}` })
        }),
        value: sanitizeText(item?.value, { max: 1000 }),
        type: normalizeEnum(item?.type, inquiryFieldTypeOptions, "text")
      };
    })
    .filter((item) => item.value);
}

function findInquiryFieldValue(fields, aliases, predicate) {
  const lowerAliases = aliases.map((item) => item.toLowerCase());
  const matched = fields.find(
    (item) =>
      lowerAliases.includes(item.key.toLowerCase()) ||
      (predicate ? predicate(item) : false)
  );

  return matched?.value || "";
}

function buildInquiryMetadata(metadata) {
  return {
    phone: sanitizeString(metadata.phone, { max: 80 }),
    interest: sanitizeString(metadata.interest, { max: 160 }),
    fields: normalizeInquiryFields(metadata.fields)
  };
}

function normalizeSubscriberFieldValue(value, type) {
  if (type === "email") {
    return sanitizeEmail(value, false);
  }

  if (type === "textarea") {
    return sanitizeText(value, { max: 2000 });
  }

  return sanitizeString(value, { max: 300 });
}

function buildLegacySubscriberFields(input) {
  return [
    {
      key: "email",
      label: "Email",
      value: sanitizeEmail(input.email, false),
      type: "email"
    },
    {
      key: "order_number",
      label: "Order Number",
      value: sanitizeString(input.orderNumber, { max: 120 }),
      type: "text"
    }
  ].filter((item) => item.value);
}

function findSubscriberFieldValue(fields, aliases, predicate) {
  const lowerAliases = aliases.map((item) => item.toLowerCase());
  const matched = fields.find(
    (item) =>
      lowerAliases.includes(String(item.key || "").toLowerCase()) ||
      (predicate ? predicate(item) : false)
  );

  return matched?.value || "";
}

function normalizeStoredSubscriberFields(value, email, orderNumber) {
  const source = Array.isArray(value) ? value : [];
  const normalized = source
    .map((item, index) => ({
      key: sanitizeString(item?.key, { max: 40, defaultValue: `field_${index + 1}` }),
      label: sanitizeString(item?.label, {
        max: 60,
        defaultValue: sanitizeString(item?.key, { max: 60, defaultValue: `Field ${index + 1}` })
      }),
      value: sanitizeText(item?.value, { max: 2000 }),
      type: normalizeEnum(item?.type, inquiryFieldTypeOptions, "text")
    }))
    .filter((item) => item.value);

  if (!normalized.some((item) => item.key === "email") && email) {
    normalized.unshift({
      key: "email",
      label: "Email",
      value: email,
      type: "email"
    });
  }

  if (orderNumber && !normalized.some((item) => item.key === "order_number")) {
    normalized.push({
      key: "order_number",
      label: "Order Number",
      value: orderNumber,
      type: "text"
    });
  }

  return normalized;
}

function normalizeSubscriberSubmissionFields(inputFields, configuredFields, fallbackInput) {
  const source = Array.isArray(inputFields) && inputFields.length
    ? inputFields
    : buildLegacySubscriberFields(fallbackInput);
  const sourceMap = new Map(
    source.map((item) => [sanitizeString(item?.key, { max: 40 }).toLowerCase(), item])
  );

  return configuredFields.reduce((accumulator, field) => {
    if (!field.enabled) {
      return accumulator;
    }

    const matched = sourceMap.get(field.key.toLowerCase());
    let value = normalizeSubscriberFieldValue(matched?.value, field.type);

    if (field.type === "select" && value) {
      const optionMatch = field.options.find(
        (option) => option.value === value || option.label === value
      );

      if (!optionMatch) {
        throw new HttpError(400, `${field.label} 的选项值无效。`);
      }

      value = optionMatch.value;
    }

    if (!value) {
      if (field.required) {
        throw new HttpError(400, `${field.label}不能为空。`);
      }

      return accumulator;
    }

    accumulator.push({
      key: field.key,
      label: field.label,
      value,
      type: field.type
    });
    return accumulator;
  }, []);
}

function mapInquiry(row) {
  const metadata = buildInquiryMetadata(safeParseJson(row.metadata_json, {}));

  return {
    id: row.id,
    source: row.source,
    customer: row.customer,
    email: decryptField(row.email_cipher),
    phone: metadata.phone,
    interest: metadata.interest,
    fields: metadata.fields,
    company: row.company,
    status: row.status,
    assignee: row.assignee,
    sourceDetail: row.source_detail,
    message: decryptField(row.message_cipher),
    createdAt: row.created_at
  };
}

function mapSubscriber(row) {
  const email = decryptField(row.email_cipher);
  const orderNumber = decryptField(row.order_number_cipher);

  return {
    id: row.id,
    email,
    source: row.source,
    orderNumber,
    fields: normalizeStoredSubscriberFields(
      safeParseJson(row.metadata_json, []),
      email,
      orderNumber
    ),
    emailStatus: sanitizeString(row.confirmation_status, {
      max: 40,
      defaultValue: "pending"
    }),
    emailSentAt: sanitizeString(row.confirmation_sent_at, {
      max: 40,
      defaultValue: ""
    }),
    emailError: sanitizeText(row.confirmation_error, {
      max: 500,
      defaultValue: ""
    }),
    createdAt: row.created_at
  };
}

async function listInquiries() {
  const rows = await query(
    `SELECT
       id,
       source,
       customer,
       email_cipher,
       company,
       status,
       assignee,
       source_detail,
       message_cipher,
       metadata_json,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM inquiries
     ORDER BY created_at DESC`
  );

  return rows.map(mapInquiry);
}

async function updateInquiry(input) {
  const id = sanitizeString(input.id, { max: 40 });
  const status = normalizeEnum(input.status, ["new", "processing", "closed"], "new");
  const assignee = sanitizeString(input.assignee, {
    max: 120,
    defaultValue: "Unassigned"
  });

  if (!id) {
    throw new HttpError(400, "询盘 ID 不能为空。");
  }

  await query(`UPDATE inquiries SET status = ?, assignee = ? WHERE id = ?`, [
    status,
    assignee,
    id
  ]);

  const rows = await query(
    `SELECT
       id,
       source,
       customer,
       email_cipher,
       company,
       status,
       assignee,
       source_detail,
       message_cipher,
       metadata_json,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM inquiries
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? mapInquiry(rows[0]) : null;
}

async function createInquiry(input) {
  const formFields = normalizeInquiryFields(input.formFields);
  const nameFromFields = findInquiryFieldValue(formFields, ["name", "full_name", "customer"]);
  const email = sanitizeEmail(
    input.email || findInquiryFieldValue(formFields, ["email", "email_address"]),
    false
  );
  const phone = sanitizeString(
    input.phone || findInquiryFieldValue(formFields, ["phone", "telephone", "tel"]),
    { max: 80 }
  );
  const company = sanitizeString(
    input.company || findInquiryFieldValue(formFields, ["company", "company_name", "organization"]),
    { max: 160 }
  );
  const interest = sanitizeString(
    input.interest ||
      findInquiryFieldValue(
        formFields,
        ["interest", "main_interest", "topic", "category"],
        (item) => item.type === "select"
      ),
    { max: 160 }
  );
  const message = sanitizeText(
    input.message ||
      findInquiryFieldValue(formFields, ["message", "comment", "comments", "note"], (item) => item.type === "textarea"),
    {
      max: 5000,
      defaultValue: ""
    }
  );
  const sourceDetail = sanitizeString(input.sourceDetail, {
    max: 200,
    defaultValue: interest
  });
  const payload = {
    id: ensureId(input.id, "inq"),
    source: normalizeEnum(input.source, ["product", "contact", "wholesale"], "contact"),
    customer: sanitizeString(input.customer || input.name || nameFromFields, {
      max: 120,
      defaultValue: "Anonymous visitor"
    }),
    email,
    phone,
    interest,
    company: sanitizeString(company, {
      max: 160,
      defaultValue: interest || "Unknown"
    }),
    status: "new",
    assignee: "Unassigned",
    sourceDetail,
    message: sanitizeText(message, {
      max: 5000,
      defaultValue: sourceDetail || "Homepage feedback submission."
    }),
    fields: formFields
  };

  if (!payload.customer && !payload.email && !payload.phone && !payload.message) {
    throw new HttpError(400, "至少需要提交一项联系信息或留言。");
  }

  await query(
    `INSERT INTO inquiries (
       id,
       source,
       customer,
       email_cipher,
       email_mask,
       company,
       status,
       assignee,
       source_detail,
       message_cipher,
       metadata_json
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.id,
      payload.source,
      payload.customer,
      encryptField(payload.email),
      maskEmail(payload.email),
      payload.company || "Unknown",
      payload.status,
      payload.assignee,
      payload.sourceDetail || "",
      encryptField(payload.message),
      stringifyJson(
        buildInquiryMetadata({
          phone: payload.phone,
          interest: payload.interest,
          fields: payload.fields
        })
      )
    ]
  );

  return payload;
}

async function listSubscribers() {
  const rows = await query(
    `SELECT
       id,
       email_cipher,
       source,
       order_number_cipher,
       metadata_json,
       confirmation_status,
       DATE_FORMAT(confirmation_sent_at, '%Y-%m-%d %H:%i:%s') AS confirmation_sent_at,
       confirmation_error,
       DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
     FROM subscribers
     ORDER BY created_at DESC`
  );

  return rows.map(mapSubscriber);
}

async function createSubscriber(input) {
  const [subscribePopup, mailerSettings, publicSiteSettings] = await Promise.all([
    getSubscribePopup(),
    getMailerRuntimeSettings(),
    getPublicSiteSettings()
  ]);
  const configuredFields = Array.isArray(subscribePopup.formFields)
    ? subscribePopup.formFields.filter((item) => item.enabled)
    : [];
  const emailField = findSubscribeEmailField(configuredFields);

  if (!emailField) {
    throw new HttpError(500, "订阅弹窗缺少有效的邮箱字段配置。");
  }

  const formFields = normalizeSubscriberSubmissionFields(
    input.formFields,
    configuredFields,
    input
  );
  const email = sanitizeEmail(
    findSubscriberFieldValue(
      formFields,
      [emailField.key, "email"],
      (item) => item.type === "email"
    )
  );
  const orderNumber = sanitizeString(
    findSubscriberFieldValue(formFields, ["order_number", "order", "order_no", "order_number"]),
    { max: 120 }
  );
  const source = sanitizeString(input.source, {
    max: 120,
    defaultValue: subscribePopup.sourceLabel || "订阅弹窗"
  });

  const payload = {
    id: ensureId(input.id, "sub"),
    email,
    source,
    orderNumber,
    formFields
  };

  await query(
    `INSERT INTO subscribers (
       id,
       email_cipher,
       email_mask,
       source,
       order_number_cipher,
       metadata_json,
       confirmation_status,
       confirmation_sent_at,
       confirmation_error
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.id,
      encryptField(payload.email),
      maskEmail(payload.email),
      payload.source,
      encryptField(payload.orderNumber),
      stringifyJson(payload.formFields),
      "pending",
      null,
      null
    ]
  );

  const mailResult = await sendSubscriptionConfirmation({
    mailerSettings,
    brandSettings: publicSiteSettings.brand,
    subscribePopup,
    subscriber: {
      email: payload.email,
      source: payload.source,
      orderNumber: payload.orderNumber,
      formFields: payload.formFields,
      createdAt: new Date().toISOString()
    }
  }).catch((error) => ({
    status: "failed",
    error: error instanceof Error ? error.message : "Unknown mail delivery error."
  }));

  await query(
    `UPDATE subscribers
        SET confirmation_status = ?,
            confirmation_sent_at = ?,
            confirmation_error = ?
      WHERE id = ?`,
    [
      mailResult.status,
      mailResult.status === "sent" ? new Date() : null,
      mailResult.error || null,
      payload.id
    ]
  );

  return {
    ...payload,
    emailStatus: mailResult.status,
    emailError: mailResult.error || ""
  };
}

module.exports = {
  listInquiries,
  updateInquiry,
  createInquiry,
  listSubscribers,
  createSubscriber
};
