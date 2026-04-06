<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { apiPost } from "../services/http";
import type { ContactContent, ContactFormField } from "../types/content";

const props = defineProps<{
  contact: ContactContent;
}>();

const form = reactive<Record<string, string>>({});
const status = ref("");
const isSubmitting = ref(false);

const enabledFields = computed(() =>
  props.contact.formFields.filter((item) => item.enabled)
);

const syncForm = () => {
  const keys = new Set(props.contact.formFields.map((item) => item.key));

  for (const field of props.contact.formFields) {
    if (form[field.key] === undefined) {
      form[field.key] = "";
    }
  }

  for (const key of Object.keys(form)) {
    if (!keys.has(key)) {
      delete form[key];
    }
  }
};

watch(
  () => props.contact.formFields,
  () => {
    syncForm();
  },
  {
    deep: true,
    immediate: true
  }
);

const reset = () => {
  for (const field of props.contact.formFields) {
    form[field.key] = "";
  }
};

const mapFieldValue = (field: ContactFormField) => (form[field.key] || "").trim();

const findFieldValue = (keys: string[], fallback?: (field: ContactFormField) => boolean) => {
  const matched = enabledFields.value.find(
    (field) => keys.includes(field.key) || (fallback ? fallback(field) : false)
  );

  return matched ? mapFieldValue(matched) : "";
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  const submittedFields = enabledFields.value
    .map((field) => ({
      key: field.key,
      label: field.label,
      value: mapFieldValue(field),
      type: field.type
    }))
    .filter((item) => item.value);

  try {
    const interest =
      findFieldValue(["interest", "main_interest"], (field) => field.type === "select") || "";

    await apiPost(
      "/public/inquiry",
      {
        source: "contact",
        name: findFieldValue(["name", "full_name", "customer"]),
        email: findFieldValue(["email", "email_address"]),
        phone: findFieldValue(["phone", "telephone", "tel"]),
        company: findFieldValue(["company", "company_name", "organization"]),
        interest,
        message: findFieldValue(["message", "comment", "comments"], (field) => field.type === "textarea"),
        formFields: submittedFields,
        sourceDetail: interest || "Homepage Feedback"
      },
      {
        secure: true
      }
    );
    status.value = props.contact.successMessage;
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to submit right now.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="section contact-zone" id="feedback">
    <div class="shell contact-layout">
      <div class="contact-copy reveal" v-reveal>
        <p class="eyebrow">{{ contact.eyebrow }}</p>
        <h2>{{ contact.title }}</h2>
        <p v-if="contact.text">{{ contact.text }}</p>
      </div>

      <form class="contact-form reveal" v-reveal @submit.prevent="submit">
        <div class="contact-form__grid">
          <label
            v-for="field in enabledFields"
            :key="field.id"
            :class="{ 'contact-form__field--full': field.type === 'textarea' }"
          >
            <span>{{ field.label }}</span>

            <select
              v-if="field.type === 'select'"
              v-model="form[field.key]"
              :name="field.key"
              :required="field.required"
            >
              <option value="">{{ field.placeholder || contact.fields.chooseOne }}</option>
              <option
                v-for="option in field.options"
                :key="`${field.id}-${option.value}`"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="form[field.key]"
              :name="field.key"
              rows="5"
              :placeholder="field.placeholder"
              :required="field.required"
            ></textarea>

            <input
              v-else
              v-model="form[field.key]"
              :type="field.type"
              :name="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
            />
          </label>
        </div>

        <button
          class="button button--primary"
          type="submit"
          :disabled="isSubmitting || !enabledFields.length"
        >
          {{ isSubmitting ? "Submitting..." : contact.fields.submitLabel }}
        </button>

        <p class="form-status" aria-live="polite">{{ status }}</p>
      </form>
    </div>
  </section>
</template>
