<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useCatalogStore } from "../../stores/catalog";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();

const publishedProducts = computed(() =>
  catalogStore.products.filter((item) => item.status === "published")
);

const selectedProducts = computed(() =>
  settingsStore.homeContent.featuredProductSlugs
    .map((slug) => publishedProducts.value.find((item) => item.slug === slug))
    .filter((item) => Boolean(item))
);

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页产品模块已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页产品模块保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首页产品模块</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="settingsStore.homeContent.productSection.eyebrow"
            placeholder="模块眉标"
          />
          <el-input
            v-model="settingsStore.homeContent.productSection.title"
            placeholder="模块标题"
          />
        </div>

        <el-input
          v-model="settingsStore.homeContent.productSection.text"
          type="textarea"
          :rows="2"
          placeholder="模块说明文案"
        />

        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="settingsStore.homeContent.productSection.detailsLabel"
            placeholder="卡片按钮文案"
          />
          <el-input
            v-model="settingsStore.homeContent.productSection.moreLabel"
            placeholder="右侧更多按钮文案"
          />
        </div>

        <el-form-item label="首页展示商品">
          <el-select
            v-model="settingsStore.homeContent.featuredProductSlugs"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择首页产品模块展示的商品"
          >
            <el-option
              v-for="item in publishedProducts"
              :key="item.id"
              :label="item.title"
              :value="item.slug"
            />
          </el-select>
        </el-form-item>

        <div class="editor-block">
          <p class="page-card__eyebrow">当前首页商品</p>
          <div v-if="selectedProducts.length" class="simple-list">
            <li v-for="item in selectedProducts" :key="item?.id">
              <span>{{ item?.title }}</span>
              <span>{{ item?.sku }}</span>
            </li>
          </div>
          <p v-else>当前还没有选择首页产品。</p>
        </div>
      </div>
    </section>
  </div>
</template>
