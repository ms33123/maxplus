<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
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

const saveDraft = () => {
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

  const targetIndex = settingsStore.homeContent.reviews.items.findIndex(
    (item) => item.id === editingId.value
  );

  if (targetIndex >= 0) {
    settingsStore.homeContent.reviews.items.splice(targetIndex, 1, payload);
  } else {
    settingsStore.homeContent.reviews.items.unshift(payload);
  }

  dialogVisible.value = false;
  ElMessage.success(targetIndex >= 0 ? "评论已更新，记得保存到服务器。" : "评论已新增，记得保存到服务器。");
};

const removeItem = async (item: HomeReviewItem) => {
  await ElMessageBox.confirm(`确认删除评论“${item.author}”吗？`, "提示", { type: "warning" });

  const targetIndex = settingsStore.homeContent.reviews.items.findIndex(
    (current) => current.id === item.id
  );

  if (targetIndex >= 0) {
    settingsStore.homeContent.reviews.items.splice(targetIndex, 1);
  }

  ElMessage.success("评论已删除，记得保存到服务器。");
};

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("评论内容已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "评论内容保存失败。");
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
          <el-button type="primary" @click="save">保存更改</el-button>
        </div>
      </div>

      <div class="table-scroll">
        <el-table :data="visibleItems" stripe>
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
  overflow-x: auto;
}

.table-scroll :deep(.el-table) {
  min-width: 1080px;
}

.review-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(16, 33, 58, 0.08);
}
</style>
