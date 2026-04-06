const nodemailer = require("nodemailer");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getContextValue(source, path) {
  return path.split(".").reduce((current, segment) => {
    if (!current || typeof current !== "object") {
      return "";
    }

    return current[segment];
  }, source);
}

function renderTemplate(template, context, { html = false } = {}) {
  return String(template || "").replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const value = getContextValue(context, key);

    if (value === null || value === undefined) {
      return "";
    }

    if (html && key === "fieldSummaryHtml") {
      return String(value);
    }

    return html ? escapeHtml(String(value)) : String(value);
  });
}

function buildFieldSummary(formFields) {
  const rows = Array.isArray(formFields) ? formFields.filter((item) => item.value) : [];

  if (!rows.length) {
    return {
      text: "",
      html: ""
    };
  }

  return {
    text: rows.map((item) => `${item.label}: ${item.value}`).join("\n"),
    html: `<ul>${rows
      .map((item) => `<li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</li>`)
      .join("")}</ul>`
  };
}

function buildTemplateContext({ brandSettings, subscribePopup, subscriber }) {
  const formFields = Array.isArray(subscriber.formFields) ? subscriber.formFields : [];
  const fieldsByKey = formFields.reduce((accumulator, item) => {
    accumulator[item.key] = item.value;
    return accumulator;
  }, {});
  const fieldSummary = buildFieldSummary(formFields);

  return {
    brandName: brandSettings.brandName || "",
    siteTitle: brandSettings.siteTitle || "",
    subscriberEmail: subscriber.email || "",
    sourceLabel: subscriber.source || subscribePopup.sourceLabel || "",
    submittedAt: subscriber.createdAt || "",
    fieldSummaryText: fieldSummary.text,
    fieldSummaryHtml: fieldSummary.html,
    subscriber: {
      email: subscriber.email || "",
      source: subscriber.source || "",
      orderNumber: subscriber.orderNumber || "",
      fields: fieldsByKey
    }
  };
}

async function sendSubscriptionConfirmation({
  mailerSettings,
  brandSettings,
  subscribePopup,
  subscriber
}) {
  if (!mailerSettings.enabled) {
    return {
      status: "skipped",
      error: "Email delivery disabled in settings."
    };
  }

  if (!mailerSettings.host || !mailerSettings.fromEmail) {
    return {
      status: "failed",
      error: "SMTP transport is incomplete."
    };
  }

  const transporter = nodemailer.createTransport({
    host: mailerSettings.host,
    port: Number(mailerSettings.port) || 587,
    secure: Boolean(mailerSettings.secure),
    auth: mailerSettings.username
      ? {
          user: mailerSettings.username,
          pass: mailerSettings.password || ""
        }
      : undefined
  });

  const templateContext = buildTemplateContext({
    brandSettings,
    subscribePopup,
    subscriber
  });
  const subject = renderTemplate(mailerSettings.subjectTemplate, templateContext);
  const html = mailerSettings.htmlTemplate
    ? renderTemplate(mailerSettings.htmlTemplate, templateContext, { html: true })
    : "";
  const text = mailerSettings.textTemplate
    ? renderTemplate(mailerSettings.textTemplate, templateContext)
    : "";

  await transporter.sendMail({
    from: {
      name: mailerSettings.fromName || brandSettings.brandName || "",
      address: mailerSettings.fromEmail
    },
    to: subscriber.email,
    replyTo: mailerSettings.replyTo || undefined,
    subject,
    html: html || undefined,
    text: text || undefined
  });

  return {
    status: "sent",
    error: ""
  };
}

module.exports = {
  sendSubscriptionConfirmation
};
