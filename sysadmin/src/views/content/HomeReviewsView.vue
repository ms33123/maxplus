<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useSettingsStore } from "../../stores/settings";

const router = useRouter();
const settingsStore = useSettingsStore();

const createReviewMetric = () => ({
  value: "",
  label: ""
});

const addReviewMetric = () => {
  settingsStore.homeContent.reviews.summary.metrics.push(createReviewMetric());
};

const removeReviewMetric = (index: number) => {
  settingsStore.homeContent.reviews.summary.metrics.splice(index, 1);
};

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页评价模块已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页评价模块保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首页评价配置</h2>
        </div>
        <div class="header-actions">
          <el-button @click="router.push('/content/reviews/manage')">评论内容管理</el-button>
          <el-button type="primary" @click="save">保存设置</el-button>
        </div>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--3">
          <el-input v-model="settingsStore.homeContent.reviews.eyebrow" placeholder="模块眉标" />
          <el-input v-model="settingsStore.homeContent.reviews.title" placeholder="模块标题" />
          <el-select v-model="settingsStore.homeContent.reviews.displayMode" placeholder="展示模式">
            <el-option label="纯文字模式" value="text" />
            <el-option label="带图片模式" value="image" />
          </el-select>
        </div>

        <el-input
          v-model="settingsStore.homeContent.reviews.text"
          type="textarea"
          :rows="2"
          placeholder="模块说明文案"
        />
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">评分摘要</p>
          <h2>顶部评分概览</h2>
        </div>
        <el-button @click="addReviewMetric">新增评分指标</el-button>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--3">
          <el-input
            v-model="settingsStore.homeContent.reviews.summary.label"
            placeholder="摘要标签"
          />
          <el-input
            v-model="settingsStore.homeContent.reviews.summary.value"
            placeholder="评分值，如 4.9/5"
          />
          <el-input
            v-model="settingsStore.homeContent.reviews.summary.detail"
            placeholder="补充说明"
          />
        </div>

        <div
          v-for="(metric, index) in settingsStore.homeContent.reviews.summary.metrics"
          :key="`${metric.label}-${index}`"
          class="editor-block"
        >
          <div class="editor-grid editor-grid--2">
            <el-input v-model="metric.value" placeholder="指标值，如 92%" />
            <div class="inline-row">
              <el-input v-model="metric.label" placeholder="指标说明" />
              <el-button
                link
                type="danger"
                :disabled="settingsStore.homeContent.reviews.summary.metrics.length <= 1"
                @click="removeReviewMetric(index)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
