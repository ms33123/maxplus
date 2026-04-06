import type {
  HomeContactFormFieldState,
  SubscribePopupState
} from "../../types/admin";

const subscribeStylePresets = new Set([
  "classic-button",
  "classic-gift",
  "sport-burst",
  "midnight-gift"
]);

function normalizeFormFieldOptions(value: HomeContactFormFieldState["options"]) {
  return Array.isArray(value)
    ? value
        .map((item) => ({
          value: item?.value || "",
          label: item?.label || ""
        }))
        .filter((item) => item.value && item.label)
    : [];
}

export function createDefaultSubscribePopup(): SubscribePopupState {
  return {
    enabled: true,
    stylePreset: "classic-gift",
    toggleLabel: "Subscribe For Perks",
    eyebrow: "Member Benefits",
    title: "Subscribe with your email and order number.",
    text: "Use the popup to collect after-sales updates, member offers, and restock notices.",
    benefitsTitle: "After subscribing you can receive:",
    benefits: [
      "Early access to new product drops and restock alerts.",
      "Order-based after-sales updates and tutorial reminders.",
      "Member-only coupons and selected seasonal offers."
    ],
    submitLabel: "Subscribe",
    successMessage: "Subscription received. Please check your email inbox.",
    sourceLabel: "Website Subscribe Widget",
    formFields: [
      {
        id: "subscribe-field-email",
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "Email address",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "subscribe-field-order-number",
        key: "order_number",
        type: "text",
        label: "Order Number",
        placeholder: "Order number",
        enabled: true,
        required: true,
        options: []
      }
    ]
  };
}

export function createDefaultSubscribeField(): HomeContactFormFieldState {
  return {
    id: `subscribe-field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    key: `field_${Date.now()}`,
    type: "text",
    label: "",
    placeholder: "",
    enabled: true,
    required: false,
    options: []
  };
}

export function normalizeSubscribePopup(
  value?: Partial<SubscribePopupState> | null
): SubscribePopupState {
  const fallback = createDefaultSubscribePopup();
  const source = value ?? {};

  return {
    enabled: source.enabled ?? fallback.enabled,
    stylePreset: subscribeStylePresets.has(source.stylePreset || "")
      ? source.stylePreset || fallback.stylePreset
      : fallback.stylePreset,
    toggleLabel: source.toggleLabel?.trim() || fallback.toggleLabel,
    eyebrow: source.eyebrow?.trim() || fallback.eyebrow,
    title: source.title?.trim() || fallback.title,
    text: source.text || fallback.text,
    benefitsTitle: source.benefitsTitle?.trim() || fallback.benefitsTitle,
    benefits: Array.isArray(source.benefits)
      ? source.benefits.map((item) => item || "").filter(Boolean)
      : fallback.benefits,
    submitLabel: source.submitLabel?.trim() || fallback.submitLabel,
    successMessage: source.successMessage?.trim() || fallback.successMessage,
    sourceLabel: source.sourceLabel?.trim() || fallback.sourceLabel,
    formFields: Array.isArray(source.formFields) && source.formFields.length
      ? source.formFields.map((item, index) => ({
          id: item?.id || `subscribe-field-${index + 1}`,
          key: item?.key || `field_${index + 1}`,
          type: item?.type || "text",
          label: item?.label || "",
          placeholder: item?.placeholder || "",
          enabled: item?.enabled ?? true,
          required: item?.required ?? false,
          options: normalizeFormFieldOptions(item?.options)
        }))
      : fallback.formFields
  };
}
