<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { apiPost } from "../services/http";
import SubscribeClassicButton from "./SubscribeClassicButton.vue";
import SubscribeGiftButton from "./SubscribeGiftButton.vue";
import type { SubscribeContent } from "../types/content";

const props = defineProps<{
  subscribe: SubscribeContent;
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const status = ref("");
const formValues = reactive<Record<string, string>>({});

const enabledFields = computed(() =>
  props.subscribe.formFields.filter((field) => field.enabled)
);

const reset = () => {
  enabledFields.value.forEach((field) => {
    formValues[field.key] = "";
  });
};

const panelId = "subscribe-panel-sporting";
const isClassicButton = computed(() => props.subscribe.stylePreset === "classic-button");
const giftStylePreset = computed(() =>
  props.subscribe.stylePreset === "classic-button" ? "classic-gift" : props.subscribe.stylePreset
);

const openPanel = (): void => {
  status.value = "";
  isOpen.value = true;
};

const closePanel = (): void => {
  isOpen.value = false;
};

const syncFormState = () => {
  const activeKeys = new Set(enabledFields.value.map((field) => field.key));

  Object.keys(formValues).forEach((key) => {
    if (!activeKeys.has(key)) {
      delete formValues[key];
    }
  });

  enabledFields.value.forEach((field) => {
    if (!(field.key in formValues)) {
      formValues[field.key] = "";
    }
  });
};

const resolveInputType = (type: string) => {
  if (type === "email" || type === "tel") {
    return type;
  }

  return "text";
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  try {
    await apiPost(
      "/public/subscribe",
      {
        source: props.subscribe.sourceLabel,
        formFields: enabledFields.value.map((field) => ({
          key: field.key,
          label: field.label,
          value: formValues[field.key] || "",
          type: field.type
        }))
      },
      {
        secure: true
      }
    );
    status.value = props.subscribe.successMessage;
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to subscribe right now.";
  } finally {
    isSubmitting.value = false;
  }
};

watch(enabledFields, syncFormState, {
  deep: true,
  immediate: true
});

onMounted(() => {
  syncFormState();

  if (!props.subscribe.enabled) {
    return;
  }

  if (!window.matchMedia("(max-width: 820px)").matches) {
    return;
  }

  try {
    const storageKey = "maxplus-mobile-subscribe-shown";

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    openPanel();
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    openPanel();
  }
});
</script>

<template>
  <div
    v-if="subscribe.enabled"
    :class="[
      'subscribe-widget',
      `subscribe-widget--${subscribe.stylePreset}`,
      { 'is-open': isOpen }
    ]"
    id="newsletter-sporting"
  >
    <SubscribeClassicButton
      v-if="isClassicButton"
      :controls-id="panelId"
      :label="subscribe.toggleLabel"
      :open="isOpen"
      @open="openPanel"
      @close="closePanel"
    />

    <SubscribeGiftButton
      v-else
      :controls-id="panelId"
      :label="subscribe.toggleLabel"
      :open="isOpen"
      :style-preset="giftStylePreset"
      @open="openPanel"
      @close="closePanel"
    />

    <button
      v-if="isOpen"
      class="subscribe-widget__backdrop"
      type="button"
      aria-label="Close subscribe dialog"
      @click="closePanel"
    ></button>

    <div class="subscribe-widget__panel" :id="panelId">
      <button
        class="subscribe-widget__close"
        type="button"
        aria-label="Close subscribe dialog"
        @click="closePanel"
      >
        ×
      </button>

      <div class="subscribe-widget__dialog">
        <div class="subscribe-widget__benefit-copy">
          <p class="eyebrow">{{ subscribe.eyebrow }}</p>
          <h3 class="subscribe-widget__title">{{ subscribe.title }}</h3>
          <p v-if="subscribe.text" class="subscribe-widget__text">{{ subscribe.text }}</p>
          <p class="subscribe-widget__benefits-title">{{ subscribe.benefitsTitle }}</p>

          <ul class="subscribe-widget__benefits">
            <li v-for="benefit in subscribe.benefits" :key="benefit">
              {{ benefit }}
            </li>
          </ul>
        </div>

        <form class="subscribe-form" @submit.prevent="submit">
          <template v-for="field in enabledFields" :key="field.id">
            <label class="sr-only" :for="field.id">
              {{ field.label }}
            </label>

            <select
              v-if="field.type === 'select'"
              :id="field.id"
              v-model="formValues[field.key]"
              :name="field.key"
              :required="field.required"
            >
              <option value="">
                {{ field.placeholder || field.label }}
              </option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.id"
              v-model="formValues[field.key]"
              :name="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="4"
            ></textarea>

            <input
              v-else
              :id="field.id"
              v-model="formValues[field.key]"
              :type="resolveInputType(field.type)"
              :name="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
            />
          </template>

          <button class="button button--primary" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Submitting..." : subscribe.submitLabel }}
          </button>

          <p class="form-status" aria-live="polite">{{ status }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
