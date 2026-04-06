<script setup lang="ts">
import HeaderBar from "../components/layout/HeaderBar.vue";
import RouteTabs from "../components/layout/RouteTabs.vue";
import SidebarNav from "../components/layout/SidebarNav.vue";
</script>

<template>
  <div class="admin-shell">
    <SidebarNav />

    <div class="admin-shell__main">
      <HeaderBar />

      <main class="admin-shell__content">
        <RouteTabs />
        <RouterView />
      </main>
    </div>
  </div>
</template>
