<script setup lang="ts">
interface Props {
  eyebrow?: string;
  title: string;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  eyebrow: "",
  text: ""
});
</script>

<template>
  <section class="section page-banner">
    <div class="shell">
      <div class="page-banner__content reveal" v-reveal>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p v-if="text">{{ text }}</p>
      </div>
    </div>
  </section>
</template>
