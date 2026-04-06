<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { breadcrumbMap } from "../../config/routeMeta";

const route = useRoute();

const breadcrumbs = computed(
  () => breadcrumbMap[String(route.name)] ?? [{ label: "后台管理系统" }]
);
</script>

<template>
  <nav class="content-breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in breadcrumbs" :key="`${item.label}-${index}`">
      <RouterLink
        v-if="item.path && index < breadcrumbs.length - 1"
        :to="item.path"
        class="content-breadcrumb__link"
      >
        {{ item.label }}
      </RouterLink>
      <span v-else class="content-breadcrumb__current">{{ item.label }}</span>
      <span v-if="index < breadcrumbs.length - 1" class="content-breadcrumb__sep">/</span>
    </template>
  </nav>
</template>
