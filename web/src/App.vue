<script setup lang="ts">
import { computed, onMounted } from "vue";
import BackToTopRocket from "./components/BackToTopRocket.vue";
import CookieBanner from "./components/CookieBanner.vue";
import SeasonalThemeLayer from "./components/SeasonalThemeLayer.vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteHeader from "./components/SiteHeader.vue";
import SubscribeWidget from "./components/SubscribeWidget.vue";
import { useDocumentMeta } from "./composables/useDocumentMeta";
import { useSiteTheme } from "./composables/useSiteTheme";
import { usePublicData } from "./composables/usePublicData";

const publicData = usePublicData();
const content = computed(() => publicData.siteContent.value);
const siteTheme = computed(() => content.value.theme);

onMounted(() => {
  void publicData.loadPublicData();
});

useDocumentMeta(content);
useSiteTheme(siteTheme);
</script>

<template>
  <SeasonalThemeLayer :theme="siteTheme" />
  <SiteHeader :header="content.header" :holiday-mode="siteTheme.preset === 'christmas'" />

  <main>
    <RouterView />
  </main>

  <SiteFooter :footer="content.footer" :header="content.header" />
  <CookieBanner />
  <SubscribeWidget :subscribe="content.subscribe" />
  <BackToTopRocket />
</template>
