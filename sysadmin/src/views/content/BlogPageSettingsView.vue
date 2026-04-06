<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const save = async () => {
  try {
    await settingsStore.saveBlogPage();
    ElMessage.success("博客页面配置已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "博客页面配置保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">博客路由页</p>
          <p>维护前台 `/blog` 列表页的 SEO、页头文案、筛选文案和分页配置。</p>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="Meta Title">
          <el-input v-model="settingsStore.blogPage.metaTitle" />
        </el-form-item>
        <el-form-item label="Meta Description">
          <el-input v-model="settingsStore.blogPage.metaDescription" type="textarea" :rows="3" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="页头眉标">
          <el-input v-model="settingsStore.blogPage.heroEyebrow" />
        </el-form-item>
        <el-form-item label="页头标题">
          <el-input v-model="settingsStore.blogPage.heroTitle" />
        </el-form-item>
        <el-form-item label="全部分类文案">
          <el-input v-model="settingsStore.blogPage.allCategoriesLabel" />
        </el-form-item>
      </div>

      <el-form-item label="页头说明">
        <el-input v-model="settingsStore.blogPage.heroText" type="textarea" :rows="3" />
      </el-form-item>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">交互文案</p>
          <p>这些字段会直接显示在前台 blog 列表页中。</p>
        </div>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="搜索占位文案">
          <el-input v-model="settingsStore.blogPage.searchPlaceholder" />
        </el-form-item>
        <el-form-item label="最新优先文案">
          <el-input v-model="settingsStore.blogPage.sortLatestLabel" />
        </el-form-item>
        <el-form-item label="最早优先文案">
          <el-input v-model="settingsStore.blogPage.sortOldestLabel" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="文章数量单位">
          <el-input v-model="settingsStore.blogPage.resultsLabel" />
        </el-form-item>
        <el-form-item label="分类数量单位">
          <el-input v-model="settingsStore.blogPage.categoriesLabel" />
        </el-form-item>
        <el-form-item label="最近更新文案">
          <el-input v-model="settingsStore.blogPage.updatedLabel" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="阅读按钮文案">
          <el-input v-model="settingsStore.blogPage.readMoreLabel" />
        </el-form-item>
        <el-form-item label="上一页文案">
          <el-input v-model="settingsStore.blogPage.previousLabel" />
        </el-form-item>
        <el-form-item label="下一页文案">
          <el-input v-model="settingsStore.blogPage.nextLabel" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="每页文章数">
          <el-input-number v-model="settingsStore.blogPage.perPage" :min="3" :max="24" />
        </el-form-item>
        <el-form-item label="空状态标题">
          <el-input v-model="settingsStore.blogPage.emptyTitle" />
        </el-form-item>
        <el-form-item label="空状态说明">
          <el-input v-model="settingsStore.blogPage.emptyText" type="textarea" :rows="3" />
        </el-form-item>
      </div>
    </section>
  </div>
</template>
