<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useCatalogStore } from "../../stores/catalog";
import { useSettingsStore } from "../../stores/settings";

const router = useRouter();
const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();

const enabledCategories = computed(() =>
  catalogStore.categories.filter((item) => item.enabled)
);

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页分类模块已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页分类模块保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首页分类模块</h2>
        </div>
        <div class="header-actions">
          <el-button @click="router.push('/catalog/categories')">管理产品分类</el-button>
          <el-button type="primary" @click="save">保存设置</el-button>
        </div>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="settingsStore.homeContent.categorySection.eyebrow"
            placeholder="模块眉标"
          />
          <el-input
            v-model="settingsStore.homeContent.categorySection.title"
            placeholder="模块标题"
          />
        </div>

        <el-input
          v-model="settingsStore.homeContent.categorySection.moreLabel"
          placeholder="右侧更多按钮文案"
        />

        <el-input
          v-model="settingsStore.homeContent.categorySection.text"
          type="textarea"
          :rows="3"
          placeholder="模块说明文案"
        />
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">前台来源</p>
          <h2>首页分类卡片</h2>
        </div>
      </div>

      <div class="simple-list" v-if="enabledCategories.length">
        <li v-for="item in enabledCategories" :key="item.id">
          <span>{{ item.name }}</span>
          <span>{{ item.summary || "未填写分类摘要" }}</span>
        </li>
      </div>
      <p v-else>当前没有启用中的产品分类。</p>
    </section>
  </div>
</template>
