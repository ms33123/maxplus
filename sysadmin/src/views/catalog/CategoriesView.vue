<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProductCategoryEditorDialog from "../../components/catalog/ProductCategoryEditorDialog.vue";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { CategoryRecord } from "../../types/admin";

interface CategoryTableRow extends CategoryRecord {
  productCount: number;
}

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<CategoryRecord | null>(null);

const categoryRows = computed<CategoryTableRow[]>(() =>
  catalogStore.categories.map((item) => ({
    ...item,
    productCount: catalogStore.products.filter((product) => product.categoryId === item.id).length
  }))
);
const { currentPage, pageSize, pageSizes, total, pagedItems } = useTablePagination(categoryRows);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: CategoryRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveCategory = async (record: CategoryRecord) => {
  try {
    await catalogStore.saveCategory(record);
    ElMessage.success("分类已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "分类保存失败。");
  }
};

const removeCategory = async (record: CategoryRecord) => {
  await ElMessageBox.confirm(`确认删除分类“${record.name}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeCategory(record.id);
    ElMessage.success("分类已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "分类删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">分类中心</p>
        <h2>分类管理</h2>
      </div>
      <el-button type="primary" @click="openCreate">新增分类</el-button>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="name" label="分类名称" min-width="220" />
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column prop="parent" label="上级分类" width="140" />
        <el-table-column prop="summary" label="分类摘要" min-width="320" show-overflow-tooltip />
        <el-table-column prop="productCount" label="关联商品" width="100" />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="启用状态" width="120">
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

    <ProductCategoryEditorDialog
      v-model="dialogVisible"
      :category="currentRecord"
      @save="saveCategory"
    />
  </div>
</template>
