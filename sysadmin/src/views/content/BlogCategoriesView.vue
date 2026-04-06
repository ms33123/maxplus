<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { BlogCategoryRecord } from "../../types/admin";

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const draft = reactive<BlogCategoryRecord>(createDraft());

function createDraft(): BlogCategoryRecord {
  return {
    id: "",
    name: "",
    slug: "",
    sortOrder: catalogStore.blogCategories.length + 1,
    enabled: true,
    seoTitle: "",
    description: ""
  };
}

const rows = computed(() =>
  catalogStore.blogCategories
    .map((item) => ({
      ...item,
      blogCount: catalogStore.blogs.filter((post) => post.categoryId === item.id).length
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder)
);
const { currentPage, pageSize, pageSizes, total, pagedItems } = useTablePagination(rows);

const openCreate = () => {
  editingId.value = null;
  Object.assign(draft, createDraft());
  dialogVisible.value = true;
};

const openEdit = (record: BlogCategoryRecord) => {
  editingId.value = record.id;
  Object.assign(draft, record);
  dialogVisible.value = true;
};

const saveCategory = async () => {
  try {
    await catalogStore.saveBlogCategory({
      ...draft,
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      seoTitle: draft.seoTitle.trim(),
      description: draft.description.trim()
    });
    dialogVisible.value = false;
    ElMessage.success(editingId.value ? "文章分类已更新。" : "文章分类已新增。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "文章分类保存失败。");
  }
};

const removeCategory = async (record: BlogCategoryRecord) => {
  await ElMessageBox.confirm(`确认删除文章分类“${record.name}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeBlogCategory(record.id);
    ElMessage.success("文章分类已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "文章分类删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">文章分类</p>
        <p>维护博客分类名称、排序和前台展示描述。</p>
      </div>
      <el-button type="primary" @click="openCreate">新增分类</el-button>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column prop="description" label="分类描述" min-width="260" show-overflow-tooltip />
        <el-table-column prop="blogCount" label="文章数" width="100" />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? "启用" : "隐藏" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeCategory(row)">删除</el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑文章分类' : '新增文章分类'"
      width="620px"
      destroy-on-close
    >
      <div class="stack-grid">
        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.name" placeholder="分类名称" />
          <el-input v-model="draft.slug" placeholder="Slug，可留空自动生成" />
        </div>
        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.seoTitle" placeholder="SEO 标题" />
          <el-input-number v-model="draft.sortOrder" :min="1" :max="9999" class="blog-category__sort" />
        </div>
        <el-input
          v-model="draft.description"
          type="textarea"
          :rows="4"
          placeholder="分类描述"
        />
        <div class="inline-row">
          <el-switch v-model="draft.enabled" />
          <span>启用该分类</span>
        </div>
      </div>

      <template #footer>
        <div class="header-actions">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveCategory">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.blog-category__sort {
  width: 100%;
}
</style>
