<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import VideoEditorDialog from "../../components/media/VideoEditorDialog.vue";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { VideoRecord } from "../../types/admin";

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<VideoRecord | null>(null);
const categoryFilter = ref("all");

const visibleVideos = computed(() =>
  catalogStore.videos.filter((item) =>
    categoryFilter.value === "all" ? true : item.categoryId === categoryFilter.value
  )
);
const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  pagedItems,
  resetPagination
} = useTablePagination(visibleVideos);

watch(categoryFilter, resetPagination);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: VideoRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveVideo = async (record: VideoRecord) => {
  try {
    await catalogStore.saveVideo(record);
    ElMessage.success("视频已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频保存失败。");
  }
};

const removeVideo = async (record: VideoRecord) => {
  await ElMessageBox.confirm(`确认删除视频“${record.title}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeVideo(record.id);
    ElMessage.success("视频已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频删除失败。");
  }
};

const getCategoryLabel = (id: string) =>
  catalogStore.videoCategories.find((item) => item.id === id)?.name ?? "未知分类";
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">视频列表</p>
      </div>

      <div class="header-actions">
        <el-select v-model="categoryFilter" class="toolbar-input">
          <el-option label="全部分类" value="all" />
          <el-option
            v-for="item in catalogStore.videoCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="openCreate">新增视频</el-button>
      </div>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="title" label="视频标题" min-width="260" />
        <el-table-column label="所属分类" width="160">
          <template #default="{ row }">{{ getCategoryLabel(row.categoryId) }}</template>
        </el-table-column>
        <el-table-column prop="topic" label="主题" width="120" />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column label="视频外链" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link v-if="row.videoUrl" :href="row.videoUrl" target="_blank" type="primary">
              预览视频
            </el-link>
            <span v-else>未设置</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeVideo(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <TablePagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
    />

    <VideoEditorDialog
      v-model="dialogVisible"
      :video="currentRecord"
      :categories="catalogStore.videoCategories"
      @save="saveVideo"
    />
  </div>
</template>
