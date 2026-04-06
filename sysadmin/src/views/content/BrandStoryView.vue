<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";
import type { BrandStoryHighlightItem, BrandStoryStatItem } from "../../types/admin";

const settingsStore = useSettingsStore();

const createParagraph = () => "";
const createStat = (): BrandStoryStatItem => ({
  id: `brand-stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  value: "",
  label: ""
});
const createHighlight = (): BrandStoryHighlightItem => ({
  id: `brand-highlight-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  tag: "",
  title: "",
  text: ""
});

const addParagraph = () => {
  settingsStore.brandStory.storyParagraphs.push(createParagraph());
};

const removeParagraph = (index: number) => {
  settingsStore.brandStory.storyParagraphs.splice(index, 1);
};

const addStat = () => {
  settingsStore.brandStory.stats.push(createStat());
};

const removeStat = (index: number) => {
  settingsStore.brandStory.stats.splice(index, 1);
};

const addHighlight = () => {
  settingsStore.brandStory.highlights.push(createHighlight());
};

const removeHighlight = (index: number) => {
  settingsStore.brandStory.highlights.splice(index, 1);
};

const save = async () => {
  try {
    await settingsStore.saveBrandStory();
    ElMessage.success("品牌故事内容已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "品牌故事内容保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">内容运营</p>
          <h2>品牌故事</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input v-model="settingsStore.brandStory.metaTitle" placeholder="页面 Meta Title" />
          <el-input v-model="settingsStore.brandStory.heroEyebrow" placeholder="首屏眉标" />
        </div>

        <el-input
          v-model="settingsStore.brandStory.metaDescription"
          type="textarea"
          :rows="2"
          placeholder="页面 Meta Description"
        />

        <el-input v-model="settingsStore.brandStory.heroTitle" placeholder="首屏标题" />

        <el-input
          v-model="settingsStore.brandStory.heroText"
          type="textarea"
          :rows="3"
          placeholder="首屏说明文案"
        />
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">故事正文</p>
          <h2>品牌介绍与统计</h2>
        </div>
        <div class="header-actions">
          <el-button @click="addParagraph">新增段落</el-button>
          <el-button @click="addStat">新增统计</el-button>
        </div>
      </div>

      <div class="stack-grid">
        <div
          v-for="(paragraph, index) in settingsStore.brandStory.storyParagraphs"
          :key="`paragraph-${index}`"
          class="editor-block"
        >
          <div class="inline-row">
            <strong>段落 {{ index + 1 }}</strong>
            <el-button
              link
              type="danger"
              :disabled="settingsStore.brandStory.storyParagraphs.length <= 1"
              @click="removeParagraph(index)"
            >
              删除
            </el-button>
          </div>
          <el-input
            v-model="settingsStore.brandStory.storyParagraphs[index]"
            type="textarea"
            :rows="3"
            placeholder="品牌故事段落"
          />
        </div>

        <div
          v-for="(stat, index) in settingsStore.brandStory.stats"
          :key="stat.id"
          class="editor-block"
        >
          <div class="inline-row">
            <strong>统计卡 {{ index + 1 }}</strong>
            <el-button
              link
              type="danger"
              :disabled="settingsStore.brandStory.stats.length <= 1"
              @click="removeStat(index)"
            >
              删除
            </el-button>
          </div>

          <div class="editor-grid editor-grid--2">
            <el-input v-model="stat.value" placeholder="数值，如 4 / 12+ / 48h" />
            <el-input v-model="stat.label" placeholder="说明文字" />
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">亮点卡片</p>
          <h2>品牌亮点模块</h2>
        </div>
        <el-button @click="addHighlight">新增亮点</el-button>
      </div>

      <div class="stack-grid">
        <div
          v-for="(highlight, index) in settingsStore.brandStory.highlights"
          :key="highlight.id"
          class="editor-block"
        >
          <div class="inline-row">
            <strong>亮点 {{ index + 1 }}</strong>
            <el-button
              link
              type="danger"
              :disabled="settingsStore.brandStory.highlights.length <= 1"
              @click="removeHighlight(index)"
            >
              删除
            </el-button>
          </div>

          <div class="editor-grid editor-grid--3">
            <el-input v-model="highlight.tag" placeholder="标签，如 Growth" />
            <el-input v-model="highlight.title" placeholder="亮点标题" />
            <el-input v-model="highlight.text" placeholder="亮点说明" />
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">分类引导</p>
          <h2>分类概览标题区</h2>
        </div>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input v-model="settingsStore.brandStory.categoryEyebrow" placeholder="分类区眉标" />
          <el-input v-model="settingsStore.brandStory.categoryTitle" placeholder="分类区标题" />
        </div>

        <el-input
          v-model="settingsStore.brandStory.categoryText"
          type="textarea"
          :rows="2"
          placeholder="分类区补充说明"
        />
      </div>
    </section>
  </div>
</template>
