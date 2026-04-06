<script setup lang="ts">
import { ElMessage } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCrmStore } from "../../stores/crm";

const crmStore = useCrmStore();
const { currentPage, pageSize, pageSizes, total, pagedItems } = useTablePagination(
  () => crmStore.subscribers
);

const resolveStatusType = (status: string) => {
  if (status === "sent") {
    return "success";
  }

  if (status === "failed") {
    return "danger";
  }

  if (status === "skipped") {
    return "warning";
  }

  return "info";
};

const resolveStatusLabel = (status: string) => {
  if (status === "sent") {
    return "已发送";
  }

  if (status === "failed") {
    return "发送失败";
  }

  if (status === "skipped") {
    return "已跳过";
  }

  return "待发送";
};

const exportCsv = () => {
  const rows = crmStore.subscribers.map((item) =>
    [
      item.email,
      item.source,
      item.orderNumber,
      item.emailStatus,
      item.emailSentAt || "",
      item.createdAt,
      JSON.stringify(item.fields || [])
    ].join(",")
  );
  const csv = ["email,source,orderNumber,emailStatus,emailSentAt,createdAt,fields", ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "订阅列表.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  ElMessage.success("订阅列表已导出。");
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">线索中心</p>
        <h2>订阅管理</h2>
      </div>
      <el-button type="primary" plain @click="exportCsv">导出 CSV</el-button>
    </div>

    <div class="table-scroll">
      <el-table :data="pagedItems" stripe>
        <el-table-column type="expand" width="56">
          <template #default="{ row }">
            <div class="subscriber-expand">
              <div class="subscriber-expand__section">
                <strong>提交字段</strong>
                <div v-if="row.fields?.length" class="subscriber-field-list">
                  <div v-for="field in row.fields" :key="`${row.id}-${field.key}`" class="subscriber-field-item">
                    <span>{{ field.label }}</span>
                    <strong>{{ field.value }}</strong>
                  </div>
                </div>
                <p v-else>无字段记录。</p>
              </div>

              <div class="subscriber-expand__section">
                <strong>邮件状态</strong>
                <p>发送结果：{{ resolveStatusLabel(row.emailStatus) }}</p>
                <p v-if="row.emailSentAt">发送时间：{{ row.emailSentAt }}</p>
                <p v-if="row.emailError">错误信息：{{ row.emailError }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="220" />
        <el-table-column prop="source" label="来源" width="180" />
        <el-table-column prop="orderNumber" label="订单号" width="160" />
        <el-table-column label="邮件发送" width="120">
          <template #default="{ row }">
            <el-tag :type="resolveStatusType(row.emailStatus)" effect="plain">
              {{ resolveStatusLabel(row.emailStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
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

<style scoped>
.subscriber-expand {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.subscriber-expand__section {
  display: grid;
  gap: 0.55rem;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: var(--admin-surface-soft);
}

.subscriber-expand__section p {
  margin: 0;
  color: var(--admin-text-soft);
}

.subscriber-field-list {
  display: grid;
  gap: 0.55rem;
}

.subscriber-field-item {
  display: grid;
  gap: 0.2rem;
}

.subscriber-field-item span {
  color: var(--admin-text-soft);
  font-size: 0.82rem;
}

@media (max-width: 760px) {
  .subscriber-expand {
    grid-template-columns: 1fr;
  }
}
</style>
