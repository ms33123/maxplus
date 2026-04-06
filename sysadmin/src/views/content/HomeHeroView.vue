<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useSettingsStore } from "../../stores/settings";
import type { HeroSlideItem } from "../../types/admin";

const settingsStore = useSettingsStore();

const search = ref("");
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const draft = ref<HeroSlideItem>(createHeroSlide());

function createHeroSlide(): HeroSlideItem {
  return {
    id: `hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    eyebrow: "",
    title: "",
    subtitle: "",
    targetUrl: "/products",
    primaryLabel: "Explore Products",
    secondaryLabel: "",
    secondaryTargetUrl: "",
    imageUrl: "",
    enabled: true
  };
}

const visibleSlides = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) {
    return settingsStore.homeContent.heroSlides;
  }

  return settingsStore.homeContent.heroSlides.filter((item) =>
    [
      item.eyebrow,
      item.title,
      item.subtitle,
      item.targetUrl,
      item.primaryLabel,
      item.secondaryLabel,
      item.secondaryTargetUrl
    ]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
});
const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  pagedItems,
  resetPagination
} = useTablePagination(visibleSlides);

watch(search, resetPagination);

const openCreate = () => {
  editingId.value = null;
  draft.value = createHeroSlide();
  dialogVisible.value = true;
};

const openEdit = (item: HeroSlideItem) => {
  editingId.value = item.id;
  draft.value = { ...item };
  dialogVisible.value = true;
};

const saveDraft = async () => {
  const payload: HeroSlideItem = {
    ...draft.value,
    eyebrow: draft.value.eyebrow.trim(),
    title: draft.value.title.trim(),
    subtitle: draft.value.subtitle.trim(),
    targetUrl: draft.value.targetUrl.trim(),
    primaryLabel: draft.value.primaryLabel.trim(),
    secondaryLabel: draft.value.secondaryLabel.trim(),
    secondaryTargetUrl: draft.value.secondaryTargetUrl.trim(),
    imageUrl: draft.value.imageUrl.trim()
  };

  if (!payload.title) {
    ElMessage.warning("轮播标题不能为空。");
    return;
  }

  if (!payload.targetUrl) {
    payload.targetUrl = "/products";
  }

  if (!payload.primaryLabel) {
    payload.primaryLabel = "Explore Products";
  }

  const previousSlides = settingsStore.homeContent.heroSlides.map((item) => ({ ...item }));
  const targetIndex = previousSlides.findIndex((item) => item.id === editingId.value);
  const nextSlides = previousSlides.slice();

  if (targetIndex >= 0) {
    nextSlides.splice(targetIndex, 1, payload);
  } else {
    nextSlides.unshift(payload);
  }

  settingsStore.homeContent.heroSlides = nextSlides;

  try {
    await settingsStore.saveHomeContent();
    dialogVisible.value = false;
    ElMessage.success(targetIndex >= 0 ? "轮播已更新。" : "轮播已新增。");
  } catch (error) {
    settingsStore.homeContent.heroSlides = previousSlides;
    ElMessage.error(error instanceof Error ? error.message : "轮播保存失败。");
  }
};

const removeHeroSlide = async (item: HeroSlideItem) => {
  await ElMessageBox.confirm(`确认删除轮播“${item.title || "未命名轮播"}”吗？`, "提示", {
    type: "warning"
  });

  const previousSlides = settingsStore.homeContent.heroSlides.map((current) => ({ ...current }));
  settingsStore.homeContent.heroSlides = previousSlides.filter((current) => current.id !== item.id);

  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("轮播已删除。");
  } catch (error) {
    settingsStore.homeContent.heroSlides = previousSlides;
    ElMessage.error(error instanceof Error ? error.message : "轮播删除失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首屏轮播</h2>
        </div>
        <div class="header-actions">
          <el-input
            v-model="search"
            placeholder="搜索眉标、标题、按钮或跳转链接"
            clearable
            class="toolbar-input"
          />
          <el-button @click="openCreate">新增轮播</el-button>
        </div>
      </div>

      <div class="table-scroll">
        <el-table :data="pagedItems" stripe>
          <el-table-column type="index" label="#" width="60" />
          <el-table-column prop="eyebrow" label="眉标" min-width="180" show-overflow-tooltip />
          <el-table-column prop="title" label="轮播标题" min-width="220" />
          <el-table-column prop="targetUrl" label="跳转链接" min-width="220" show-overflow-tooltip />
          <el-table-column label="图片" width="120" align="center">
            <template #default="{ row }">
              <el-image
                v-if="row.imageUrl"
                :src="row.imageUrl"
                fit="cover"
                preview-teleported
                class="hero-image"
              />
              <el-tag v-else type="info">无图片</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="subtitle" label="副标题" min-width="360" show-overflow-tooltip />
          <el-table-column label="主按钮" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.primaryLabel || "Explore Products" }}
            </template>
          </el-table-column>
          <el-table-column label="次按钮" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.secondaryLabel || "无" }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'">
                {{ row.enabled ? "启用" : "停用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="removeHeroSlide(row)">删除</el-button>
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
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑轮播' : '新增轮播'"
      width="760px"
      destroy-on-close
    >
      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.eyebrow" placeholder="轮播眉标" />
          <el-input v-model="draft.title" placeholder="轮播标题" />
        </div>
        <el-input v-model="draft.subtitle" placeholder="轮播副标题" type="textarea" :rows="3" />
        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.targetUrl" placeholder="主按钮跳转链接" />
          <el-input v-model="draft.primaryLabel" placeholder="主按钮文案" />
        </div>
        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.secondaryTargetUrl" placeholder="次按钮跳转链接，可留空" />
          <el-input v-model="draft.secondaryLabel" placeholder="次按钮文案，可留空" />
        </div>
        <el-input v-model="draft.imageUrl" placeholder="轮播图片地址，如 /images/hero-training.svg" />

        <div class="inline-row">
          <el-switch v-model="draft.enabled" />
          <span>启用该轮播</span>
        </div>
      </div>

      <template #footer>
        <div class="header-actions">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDraft">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.table-scroll {
  width: 100%;
  overflow: hidden;
}

.hero-image {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 1px solid rgba(16, 33, 58, 0.08);
}
</style>
