<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const groups = [
  {
    key: "overview",
    label: "总览",
    items: [{ label: "仪表盘", path: "/dashboard" }]
  },
  {
    key: "configuration",
    label: "系统配置",
    items: [
      { label: "站点设置", path: "/settings/site" },
      { label: "SEO 设置", path: "/seo" },
      { label: "系统日志", path: "/system/logs" }
    ]
  },
  {
    key: "catalog",
    label: "商品中心",
    items: [
      { label: "商品管理", path: "/catalog/products" },
      { label: "商品分类", path: "/catalog/categories" }
    ]
  },
  {
    key: "content",
    label: "内容运营",
    items: [
      { label: "视频管理", path: "/media/videos" },
      { label: "博客管理", path: "/content/blog" },
      { label: "首页轮播", path: "/content/home/hero" },
      { label: "首页产品", path: "/content/home/products" },
      { label: "首页视频", path: "/content/home/videos" },
      { label: "首页评价配置", path: "/content/home/reviews" },
      { label: "评论内容管理", path: "/content/reviews/manage" },
      { label: "首页模块开关", path: "/content/modules" }
    ]
  },
  {
    key: "crm",
    label: "线索管理",
    items: [
      { label: "询盘管理", path: "/crm/inquiries" },
      { label: "订阅管理", path: "/crm/subscribers" }
    ]
  }
];

const defaultOpeneds = computed(() => {
  const activeGroup = groups.find((group) =>
    group.items.some((item) => item.path === route.path)
  );

  return activeGroup ? [activeGroup.key] : ["overview"];
});
</script>

<template>
  <aside class="sidebar-nav">
    <div class="sidebar-nav__brand">
      <strong>MAXPLUS</strong>
      <span>后台管理系统</span>
    </div>

    <el-menu
      class="sidebar-nav__menu"
      :default-active="route.path"
      :default-openeds="defaultOpeneds"
      unique-opened
      router
      background-color="transparent"
      text-color="rgba(255, 255, 255, 0.82)"
      active-text-color="#ffffff"
    >
      <el-sub-menu
        v-for="group in groups"
        :key="group.key"
        :index="group.key"
      >
        <template #title>{{ group.label }}</template>

        <el-menu-item
          v-for="item in group.items"
          :key="item.path"
          :index="item.path"
        >
          {{ item.label }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>
