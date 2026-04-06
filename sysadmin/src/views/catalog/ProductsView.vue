<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProductEditorDialog from "../../components/catalog/ProductEditorDialog.vue";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { ProductRecord } from "../../types/admin";

const catalogStore = useCatalogStore();

const dialogVisible = ref(false);
const currentRecord = ref<ProductRecord | null>(null);
const search = ref("");

const visibleProducts = computed(() =>
  catalogStore.products.filter((item) =>
    [item.title, item.slug, item.sku, item.tags.join(" "), item.tagLabel, item.sportType, item.audience, item.useCase]
      .join(" ")
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
);
const {
  currentPage,
  pageSize,
  pageSizes,
  total,
  pagedItems,
  resetPagination
} = useTablePagination(visibleProducts);

watch(search, resetPagination);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: ProductRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveProduct = async (record: ProductRecord) => {
  try {
    await catalogStore.saveProduct(record);
    ElMessage.success("商品已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "商品保存失败。");
  }
};

const removeProduct = async (record: ProductRecord) => {
  await ElMessageBox.confirm(`确认删除商品“${record.title}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeProduct(record.id);
    ElMessage.success("商品已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "商品删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">商品中心</p>
        <h2>商品管理</h2>
      </div>

      <div class="header-actions">
        <el-input
          v-model="search"
          placeholder="搜索商品名称、Slug、SKU、卡片标签"
          clearable
          class="toolbar-input"
        />
        <el-button type="primary" @click="openCreate">新增商品</el-button>
      </div>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column prop="title" label="商品名称" min-width="240" />
        <el-table-column prop="tagLabel" label="卡片标签" width="140" />
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column label="售价" width="120">
          <template #default="{ row }">${{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : 'info'">
              {{ row.status === "published" ? "已发布" : row.status === "draft" ? "草稿" : "已归档" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeProduct(row)">删除</el-button>
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

    <ProductEditorDialog
      v-model="dialogVisible"
      :product="currentRecord"
      :categories="catalogStore.categories"
      @save="saveProduct"
    />
  </div>
</template>
