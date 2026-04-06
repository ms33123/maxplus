<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    total: number;
    currentPage: number;
    pageSize: number;
    pageSizes?: number[];
  }>(),
  {
    pageSizes: () => [10, 20, 50, 100]
  }
);

const emit = defineEmits<{
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
}>();

const handleCurrentChange = (value: number) => {
  emit("update:currentPage", value);
};

const handleSizeChange = (value: number) => {
  emit("update:pageSize", value);
  emit("update:currentPage", 1);
};
</script>

<template>
  <div v-if="total > 0" class="table-pagination">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped>
.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 760px) {
  .table-pagination {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.15rem;
  }
}
</style>
