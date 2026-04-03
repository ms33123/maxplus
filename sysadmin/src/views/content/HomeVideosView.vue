<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useCatalogStore } from "../../stores/catalog";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();

const publishedVideos = computed(() =>
  catalogStore.videos.filter((item) => item.status === "published")
);

const selectedVideos = computed(() =>
  settingsStore.homeContent.featuredVideoSlugs
    .map((slug) => publishedVideos.value.find((item) => item.slug === slug))
    .filter((item) => Boolean(item))
);

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页视频模块已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页视频模块保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首页视频模块</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <div class="stack-grid">
        <el-form-item label="首页展示视频">
          <el-select
            v-model="settingsStore.homeContent.featuredVideoSlugs"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择首页视频模块展示的视频"
          >
            <el-option
              v-for="item in publishedVideos"
              :key="item.id"
              :label="item.title"
              :value="item.slug"
            />
          </el-select>
        </el-form-item>

        <div class="editor-block">
          <p class="page-card__eyebrow">当前首页视频</p>
          <div v-if="selectedVideos.length" class="simple-list">
            <li v-for="item in selectedVideos" :key="item?.id">
              <span>{{ item?.title }}</span>
              <span>{{ item?.duration }}</span>
            </li>
          </div>
          <p v-else>当前还没有选择首页视频。</p>
        </div>
      </div>
    </section>
  </div>
</template>
