<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import BlogEditorDialog from "../../components/content/BlogEditorDialog.vue";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { BlogRecord } from "../../types/admin";

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<BlogRecord | null>(null);
const { currentPage, pageSize, pageSizes, total, pagedItems } = useTablePagination(
  () => catalogStore.blogs
);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: BlogRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const savePost = async (record: BlogRecord) => {
  try {
    await catalogStore.saveBlog(record);
    ElMessage.success("博客已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "博客保存失败。");
  }
};

const removePost = async (record: BlogRecord) => {
  await ElMessageBox.confirm(`确认删除文章“${record.title}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeBlog(record.id);
    ElMessage.success("博客已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "博客删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">内容中心</p>
        <h2>博客管理</h2>
      </div>
      <el-button type="primary" @click="openCreate">新增文章</el-button>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="title" label="文章标题" min-width="280" />
        <el-table-column prop="category" label="分类" width="140" />
        <el-table-column prop="author" label="作者" width="140" />
        <el-table-column prop="publishDate" label="发布日期" width="140" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removePost(row)">删除</el-button>
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

    <BlogEditorDialog v-model="dialogVisible" :post="currentRecord" @save="savePost" />
  </div>
</template>
