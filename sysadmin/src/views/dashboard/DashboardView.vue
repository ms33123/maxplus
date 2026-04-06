<script setup lang="ts">
import { computed } from "vue";
import StatCard from "../../components/shared/StatCard.vue";
import { useCatalogStore } from "../../stores/catalog";
import { useCrmStore } from "../../stores/crm";
import { useSettingsStore } from "../../stores/settings";

const catalogStore = useCatalogStore();
const crmStore = useCrmStore();
const settingsStore = useSettingsStore();

const publishedProducts = computed(() =>
  catalogStore.products.filter((item) => item.status === "published").length
);
const publishedVideos = computed(() =>
  catalogStore.videos.filter((item) => item.status === "published").length
);
const publishedBlogs = computed(() =>
  catalogStore.blogs.filter((item) => item.status === "published").length
);
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">运营概览</p>
          <h2>当前独立站后台的核心运营数据。</h2>
          <p>从首页内容、商品、视频和线索四条线快速掌握当前站点状态。</p>
        </div>
      </div>

      <div class="dashboard-lead-tags">
        <span>首页运营</span>
        <span>商品中心</span>
        <span>视频管理</span>
        <span>线索管理</span>
      </div>

      <div class="stats-grid">
        <StatCard label="已发布商品" :value="publishedProducts" hint="当前前台可展示的商品数量。" />
        <StatCard label="已发布视频" :value="publishedVideos" hint="当前前台教程视频可用数量。" />
        <StatCard label="已发布博客" :value="publishedBlogs" hint="可用于内容和 SEO 的文章数量。" />
        <StatCard label="待处理询盘" :value="crmStore.inquiries.length" hint="当前需要销售或客服跟进的线索数。" />
      </div>
    </section>

    <div class="page-grid page-grid--2">
      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">品牌资料</p>
            <h2>{{ settingsStore.siteSettings.brand.brandName }}</h2>
          </div>
        </div>

        <dl class="info-grid">
          <div>
            <dt>售后邮箱</dt>
            <dd>{{ settingsStore.siteSettings.brand.supportEmail }}</dd>
          </div>
          <div>
            <dt>销售邮箱</dt>
            <dd>{{ settingsStore.siteSettings.brand.salesEmail }}</dd>
          </div>
          <div>
            <dt>默认语言</dt>
            <dd>{{ settingsStore.siteSettings.brand.defaultLanguage }}</dd>
          </div>
          <div>
            <dt>默认币种</dt>
            <dd>{{ settingsStore.siteSettings.brand.defaultCurrency }}</dd>
          </div>
        </dl>
      </section>

      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">首页模块</p>
            <h2>模块开关状态</h2>
          </div>
        </div>

        <ul class="simple-list">
          <li v-for="item in settingsStore.homeContent.sectionToggles" :key="item.key">
            <span>{{ item.label }}</span>
            <el-tag :type="item.enabled ? 'success' : 'info'">
              {{ item.enabled ? "启用" : "隐藏" }}
            </el-tag>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
