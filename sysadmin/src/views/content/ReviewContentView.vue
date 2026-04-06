<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useSettingsStore } from "../../stores/settings";
import type { HomeReviewItem } from "../../types/admin";

const settingsStore = useSettingsStore();

const search = ref("");
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const draft = ref<HomeReviewItem>(createReviewDraft());

function createReviewDraft(): HomeReviewItem {
  return {
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    quote: "",
    rating: 5,
    author: "",
    meta: "",
    imageUrl: ""
  };
}

const visibleItems = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) {
    return settingsStore.homeContent.reviews.items;
  }

  return settingsStore.homeContent.reviews.items.filter((item) =>
    [item.author, item.meta, item.quote].join(" ").toLowerCase().includes(keyword)
  );
});
const { currentPage, pageSize, pageSizes, total, pagedItems, resetPagination } = useTablePagination(
  visibleItems
);

watch(search, () => {
  resetPagination();
});

const openCreate = () => {
  editingId.value = null;
  draft.value = createReviewDraft();
  dialogVisible.value = true;
};

const openEdit = (item: HomeReviewItem) => {
  editingId.value = item.id;
  draft.value = { ...item };
  dialogVisible.value = true;
};

const saveDraft = async () => {
  const payload: HomeReviewItem = {
    ...draft.value,
    author: draft.value.author.trim(),
    meta: draft.value.meta.trim(),
    quote: draft.value.quote.trim(),
    imageUrl: draft.value.imageUrl.trim(),
    rating: Number(draft.value.rating) || 5
  };

  if (!payload.author || !payload.quote) {
    ElMessage.warning("评论人和评论内容不能为空。");
    return;
  }

  payload.rating = Math.min(5, Math.max(1, payload.rating));

  const previousItems = settingsStore.homeContent.reviews.items.map((item) => ({ ...item }));
  const targetIndex = previousItems.findIndex((item) => item.id === editingId.value);
  const nextItems = previousItems.slice();

  if (targetIndex >= 0) {
    nextItems.splice(targetIndex, 1, payload);
  } else {
    nextItems.unshift(payload);
  }

  settingsStore.homeContent.reviews.items = nextItems;

  try {
    await settingsStore.saveHomeContent();
    dialogVisible.value = false;
    ElMessage.success(targetIndex >= 0 ? "评论已更新。" : "评论已新增。");
  } catch (error) {
    settingsStore.homeContent.reviews.items = previousItems;
    ElMessage.error(error instanceof Error ? error.message : "评论保存失败。");
  }
};

const removeItem = async (item: HomeReviewItem) => {
  await ElMessageBox.confirm(`确认删除评论“${item.author}”吗？`, "提示", { type: "warning" });

  const previousItems = settingsStore.homeContent.reviews.items.map((current) => ({ ...current }));
  settingsStore.homeContent.reviews.items = previousItems.filter((current) => current.id !== item.id);

  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("评论已删除。");
  } catch (error) {
    settingsStore.homeContent.reviews.items = previousItems;
    ElMessage.error(error instanceof Error ? error.message : "评论删除失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">内容运营</p>
          <h2>评论内容管理</h2>
        </div>

        <div class="header-actions">
          <el-input
            v-model="search"
            placeholder="搜索评论人、身份或评论内容"
            clearable
            class="toolbar-input"
          />
          <el-button @click="openCreate">新增评论</el-button>
        </div>
      </div>

      <div class="table-scroll">
        <el-table :data="pagedItems" stripe>
          <el-table-column type="index" label="#" width="60" />
          <el-table-column prop="author" label="评论人" min-width="160" />
          <el-table-column prop="meta" label="身份 / 职位" min-width="180" />
          <el-table-column label="评分" width="170">
            <template #default="{ row }">
              <el-rate :model-value="row.rating" disabled show-score text-color="#ff6a2a" />
            </template>
          </el-table-column>
          <el-table-column label="图片" width="120" align="center">
            <template #default="{ row }">
              <el-image
                v-if="row.imageUrl"
                :src="row.imageUrl"
                fit="cover"
                preview-teleported
                class="review-image"
              />
              <el-tag v-else type="info">无图片</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quote" label="评论内容" min-width="360" show-overflow-tooltip />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="removeItem(row)">删除</el-button>
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
      :title="editingId ? '编辑评论' : '新增评论'"
      width="720px"
      destroy-on-close
    >
      <div class="stack-grid">
        <div class="editor-grid editor-grid--3">
          <el-input v-model="draft.author" placeholder="评论人" />
          <el-input v-model="draft.meta" placeholder="身份 / 职位" />
          <el-input-number v-model="draft.rating" :min="1" :max="5" :controls="false" />
        </div>

        <el-input v-model="draft.imageUrl" placeholder="评论图片地址，纯文字模式可留空" />
        <el-input v-model="draft.quote" type="textarea" :rows="5" placeholder="评论内容" />
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

.review-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(16, 33, 58, 0.08);
}
</style>
