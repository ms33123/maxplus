import { siteContent as defaultSiteContent } from "../../data/siteContent.en";
import type { RawSubscribePopup } from "./types";
import { cloneValue } from "./utils";

const subscribeStylePresets = new Set([
  "classic-button",
  "classic-gift",
  "sport-burst",
  "midnight-gift"
]);

function normalizeSubscribeFieldOptions(
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

function normalizeSubscribeFormFields(source: RawSubscribePopup | undefined) {
  const fallback = cloneValue(defaultSiteContent.subscribe.formFields);
  const rawFields = Array.isArray(source?.formFields) && source.formFields.length
    ? source.formFields
    : fallback;

  return rawFields.map((item, index) => ({
    id: item?.id || `subscribe-field-${index + 1}`,
    key: item?.key || `field_${index + 1}`,
    type: item?.type || "text",
    label: item?.label || "",
    placeholder: item?.placeholder || "",
    enabled: item?.enabled ?? true,
    required: item?.required ?? false,
    options:
      (item?.type || "text") === "select"
        ? normalizeSubscribeFieldOptions(item?.options, fallback[index]?.options)
        : []
  }));
}

export const defaultSubscribePopup = cloneValue(defaultSiteContent.subscribe);

export function normalizeSubscribePopupData(
  value?: Partial<RawSubscribePopup> | null
) {
  const source = value ?? {};

  return {
    ...cloneValue(defaultSubscribePopup),
    ...source,
    enabled: source.enabled ?? defaultSubscribePopup.enabled,
    stylePreset: subscribeStylePresets.has(source.stylePreset || "")
      ? source.stylePreset || defaultSubscribePopup.stylePreset
      : defaultSubscribePopup.stylePreset,
    toggleLabel: source.toggleLabel?.trim() || defaultSubscribePopup.toggleLabel,
    eyebrow: source.eyebrow?.trim() || defaultSubscribePopup.eyebrow,
    title: source.title?.trim() || defaultSubscribePopup.title,
    text: source.text || defaultSubscribePopup.text,
    benefitsTitle: source.benefitsTitle?.trim() || defaultSubscribePopup.benefitsTitle,
    benefits: Array.isArray(source.benefits)
      ? source.benefits.map((item) => item || "").filter(Boolean)
      : cloneValue(defaultSubscribePopup.benefits),
    submitLabel: source.submitLabel?.trim() || defaultSubscribePopup.submitLabel,
    successMessage: source.successMessage?.trim() || defaultSubscribePopup.successMessage,
    sourceLabel: source.sourceLabel?.trim() || defaultSubscribePopup.sourceLabel,
    formFields: normalizeSubscribeFormFields(source)
  };
}
