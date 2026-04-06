<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const groups = [
  {
    key: "overview",
    label: "总览",
    items: [{ label: "仪表盘", path: "/dashboard" }]
  },
  {
    key: "homepage",
    label: "首页运营",
    items: [
      { label: "首页轮播", path: "/content/home/hero" },
      { label: "首页产品", path: "/content/home/products" },
      { label: "首页视频", path: "/content/home/videos" },
      { label: "首页分类", path: "/content/home/categories" },
      { label: "首页评价配置", path: "/content/home/reviews" },
      { label: "评论内容管理", path: "/content/reviews/manage" },
      { label: "首页联系", path: "/content/home/contact" },
      { label: "订阅弹窗", path: "/content/home/subscribe" },
      { label: "首页模块开关", path: "/content/modules" }
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
    key: "media",
    label: "视频管理",
    items: [
      { label: "视频管理", path: "/media/videos" },
      { label: "视频分类", path: "/media/categories" }
    ]
  },
  {
    key: "content",
    label: "内容管理",
    items: [{ label: "品牌故事", path: "/content/brand-story" }]
  },
  {
    key: "blog",
    label: "博客管理",
    items: [
      { label: "文章列表", path: "/content/blog/posts" },
      { label: "文章分类", path: "/content/blog/categories" },
      { label: "博客页面", path: "/content/blog/settings" }
    ]
  },
  {
    key: "crm",
    label: "线索管理",
    items: [
      { label: "询盘管理", path: "/crm/inquiries" },
      { label: "订阅管理", path: "/crm/subscribers" }
    ]
  },
  {
    key: "configuration",
    label: "系统配置",
    items: [
      { label: "站点设置", path: "/settings/site" },
      { label: "邮件配置", path: "/settings/mailer" },
      { label: "SEO 设置", path: "/seo" },
      { label: "系统日志", path: "/system/logs" }
    ]
  }
];

</script>

<template>
  <aside class="sidebar-nav">
    <div class="sidebar-nav__brand">
      <strong>MAXPLUS</strong>
      <span class="sidebar-nav__brand-sub">后台管理系统</span>
    </div>

    <el-menu
      class="sidebar-nav__menu"
      :default-active="route.path"
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
        <template #title>
          <div class="sidebar-nav__group-line">
            <span>{{ group.label }}</span>
          </div>
        </template>

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
