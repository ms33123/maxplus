<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import BreadcrumbTrail from "./BreadcrumbTrail.vue";
import { resolvePageTitle } from "../../config/routeMeta";
import { useSessionStore } from "../../stores/session";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const roleLabelMap: Record<string, string> = {
  "super-admin": "超级管理员",
  operator: "运营",
  support: "客服"
};

const logout = async () => {
  sessionStore.logout();
  await router.push("/login");
};
</script>

<template>
  <header class="header-bar">
    <div class="header-bar__copy">
      <div class="header-bar__title-row">
        <h1>{{ resolvePageTitle(typeof route.name === "string" ? route.name : null) }}</h1>
        <BreadcrumbTrail />
      </div>
    </div>

    <div class="header-bar__actions">
      <div class="header-bar__user-card">
        <strong>{{ sessionStore.session?.username ?? "访客" }}</strong>
        <span>{{ roleLabelMap[sessionStore.session?.role ?? ""] ?? "访客" }}</span>
      </div>

      <el-button type="primary" plain @click="logout">
        退出登录
      </el-button>
    </div>
  </header>
</template>
