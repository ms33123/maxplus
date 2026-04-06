<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import type { HeaderContent } from "../types/content";
import BrandLogo from "./BrandLogo.vue";

const props = defineProps<{
  header: HeaderContent;
  holidayMode?: boolean;
}>();
const isMenuOpen = ref(false);
const route = useRoute();
const header = computed(() => props.header);
const holidayMessage = "Christmas Exclusive: Gift-ready picks and festive holiday offers.";
const showHolidayBar = computed(() => Boolean(props.holidayMode) && route.path === "/");

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = (): void => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="site-header">
    <div v-if="showHolidayBar" class="topline topline--xmas">
      <span class="topline__spark" aria-hidden="true"></span>
      <span class="topline__pill">Holiday Gifts</span>
      <span class="topline__text">{{ holidayMessage }}</span>
    </div>

    <nav class="nav shell" :aria-label="header.navLabel">
      <BrandLogo :sub-label="header.logoSub" :ariaLabel="header.logoLabel" />

      <button
        class="nav-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="sporting-nav-menu"
        @click="toggleMenu"
      >
        {{ header.toggleLabel }}
      </button>

      <div :class="['nav__menu', { 'is-open': isMenuOpen }]" id="sporting-nav-menu">
        <RouterLink
          v-for="link in header.links"
          :key="link.href"
          :to="link.href"
          class="nav__link"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <RouterLink class="button button--primary nav__cta" to="/buy">
        {{ header.ctaLabel }}
      </RouterLink>
    </nav>
  </header>
</template>
