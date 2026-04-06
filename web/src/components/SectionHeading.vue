<script setup lang="ts">
import { useSlots } from "vue";

interface Props {
  eyebrow: string;
  title: string;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: ""
});

const slots = useSlots();
</script>

<template>
  <div class="section-heading reveal" v-reveal>
    <p class="eyebrow">{{ eyebrow }}</p>
    <div class="section-heading__title-row">
      <h2>{{ title }}</h2>
      <div v-if="slots.action" class="section-heading__action">
        <slot name="action" />
      </div>
    </div>
    <p v-if="text">{{ text }}</p>
  </div>
</template>
