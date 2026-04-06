<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { BlogRecord } from "../../types/admin";

const router = useRouter();
const catalogStore = useCatalogStore();
const search = ref("");
const categoryFilter = ref("all");
const statusFilter = ref("all");

const categoryMap = computed(
  () => new Map(catalogStore.blogCategories.map((item) => [item.id, item.name]))
);

const visibleBlogs = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return catalogStore.blogs.filter((item) => {
    if (categoryFilter.value !== "all" && item.categoryId !== categoryFilter.value) {
      return false;
    }

    if (statusFilter.value !== "all" && item.status !== statusFilter.value) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return [item.title, item.slug, item.author, item.category, item.excerpt]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
});
const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  pagedItems,
  resetPagination
} = useTablePagination(visibleBlogs);

watch([search, categoryFilter, statusFilter], resetPagination);

const openCreate = async () => {
  await router.push("/content/blog/editor/new");
};

const openEdit = async (record: BlogRecord) => {
  await router.push(`/content/blog/editor/${record.id}`);
};

const removePost = async (record: BlogRecord) => {
  await ElMessageBox.confirm(`确认删除文章“${record.title}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeBlog(record.id);
    ElMessage.success("文章已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "文章删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">博客文章</p>
        <p>统一管理文章列表、草稿和发布时间。</p>
      </div>

      <div class="header-actions">
        <el-input
          v-model="search"
          placeholder="搜索标题、作者、分类或摘要"
          clearable
          class="toolbar-input"
        />
        <el-select v-model="categoryFilter" class="toolbar-input">
          <el-option label="全部分类" value="all" />
          <el-option
            v-for="item in catalogStore.blogCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="statusFilter" class="toolbar-input">
          <el-option label="全部状态" value="all" />
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
        </el-select>
        <el-button type="primary" @click="openCreate">新增文章</el-button>
      </div>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="title" label="文章标题" min-width="260" />
        <el-table-column label="文章分类" width="160">
          <template #default="{ row }">
            {{ categoryMap.get(row.categoryId) || row.category || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="140" />
        <el-table-column prop="publishDate" label="发布日期" width="140" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="excerpt" label="摘要" min-width="320" show-overflow-tooltip />
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
  </div>
</template>
