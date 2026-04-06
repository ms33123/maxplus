<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import type {
  HomeContactFieldType,
  HomeContactFormFieldState,
  HomeContactOption
} from "../../types/admin";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const fieldTypeOptions: Array<{ value: HomeContactFieldType; label: string }> = [
  { value: "text", label: "单行文本" },
  { value: "email", label: "邮箱" },
  { value: "tel", label: "电话" },
  { value: "textarea", label: "多行文本" },
  { value: "select", label: "下拉选择" }
];

const fieldTypeLabelMap: Record<HomeContactFieldType, string> = {
  text: "单行文本",
  email: "邮箱",
  tel: "电话",
  textarea: "多行文本",
  select: "下拉选择"
};

const getFieldTypeLabel = (type: HomeContactFieldType) => fieldTypeLabelMap[type];

const search = ref("");
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const draft = ref<HomeContactFormFieldState>(createFormField());

function cloneField(field: HomeContactFormFieldState): HomeContactFormFieldState {
  return {
    ...field,
    options: field.options.map((item) => ({ ...item }))
  };
}

function createFieldOption(): HomeContactOption {
  return {
    value: "",
    label: ""
  };
}

function normalizeFieldKey(value: string, fallback: string) {
  return (value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || fallback;
}

function buildUniqueFieldKey(rawValue: string, indexFallback: string, excludeId?: string | null) {
  const base = normalizeFieldKey(rawValue, indexFallback);
  const keys = new Set(
    settingsStore.homeContent.contactSection.formFields
      .filter((item) => item.id !== excludeId)
      .map((item) => item.key)
  );

  if (!keys.has(base)) {
    return base;
  }

  let suffix = 2;
  let nextKey = `${base}_${suffix}`;

  while (keys.has(nextKey)) {
    suffix += 1;
    nextKey = `${base}_${suffix}`;
  }

  return nextKey;
}

function createFormField(): HomeContactFormFieldState {
  return {
    id: `contact-field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    key: buildUniqueFieldKey(
      `custom_${settingsStore.homeContent.contactSection.formFields.length + 1}`,
      `field_${settingsStore.homeContent.contactSection.formFields.length + 1}`
    ),
    type: "text",
    label: "",
    placeholder: "",
    enabled: true,
    required: false,
    options: []
  };
}

const visibleFields = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) {
    return settingsStore.homeContent.contactSection.formFields;
  }

  return settingsStore.homeContent.contactSection.formFields.filter((field) =>
    [field.label, field.key, fieldTypeLabelMap[field.type], field.placeholder]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
});
const { currentPage, pageSize, pageSizes, total, pagedItems, resetPagination } = useTablePagination(
  visibleFields
);

const enabledFields = computed(() =>
  settingsStore.homeContent.contactSection.formFields.filter((field) => field.enabled)
);

const requiredCount = computed(
  () => enabledFields.value.filter((field) => field.required).length
);

const selectCount = computed(
  () => settingsStore.homeContent.contactSection.formFields.filter((field) => field.type === "select").length
);

watch(search, () => {
  resetPagination();
});

const openCreate = () => {
  editingId.value = null;
  draft.value = createFormField();
  dialogVisible.value = true;
};

const openEdit = (field: HomeContactFormFieldState) => {
  editingId.value = field.id;
  draft.value = cloneField(field);
  dialogVisible.value = true;
};

const addOption = () => {
  draft.value.options.push(createFieldOption());
};

const removeOption = (index: number) => {
  draft.value.options.splice(index, 1);
};

const handleTypeChange = () => {
  if (draft.value.type === "select" && !draft.value.options.length) {
    draft.value.options.push(createFieldOption());
    return;
  }

  if (draft.value.type !== "select") {
    draft.value.options = [];
  }
};

const saveModuleSettings = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("联系模块设置已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "联系模块保存失败。");
  }
};

const saveFieldDraft = async () => {
  const label = draft.value.label.trim();

  if (!label) {
    ElMessage.warning("字段标题不能为空。");
    return;
  }

  const normalizedKey = buildUniqueFieldKey(
    draft.value.key || label,
    `field_${settingsStore.homeContent.contactSection.formFields.length + 1}`,
    editingId.value
  );

  const nextField: HomeContactFormFieldState = {
    ...cloneField(draft.value),
    label,
    key: normalizedKey,
    placeholder: draft.value.placeholder.trim(),
    options:
      draft.value.type === "select"
        ? draft.value.options
            .map((option) => ({
              value: option.value.trim(),
              label: option.label.trim()
            }))
            .filter((option) => option.value && option.label)
        : []
  };

  if (nextField.type === "select" && !nextField.options.length) {
    ElMessage.warning("下拉字段至少需要一个有效选项。");
    return;
  }

  const previousFields = settingsStore.homeContent.contactSection.formFields.map(cloneField);
  const nextFields = previousFields.slice();
  const targetIndex = nextFields.findIndex((item) => item.id === editingId.value);

  if (targetIndex >= 0) {
    nextFields.splice(targetIndex, 1, nextField);
  } else {
    nextFields.unshift(nextField);
  }

  settingsStore.homeContent.contactSection.formFields = nextFields;

  try {
    await settingsStore.saveHomeContent();
    dialogVisible.value = false;
    ElMessage.success(targetIndex >= 0 ? "字段已更新。" : "字段已新增。");
  } catch (error) {
    settingsStore.homeContent.contactSection.formFields = previousFields;
    ElMessage.error(error instanceof Error ? error.message : "字段保存失败。");
  }
};

const removeField = async (field: HomeContactFormFieldState) => {
  await ElMessageBox.confirm(`确认删除字段“${field.label || field.key}”吗？`, "提示", {
    type: "warning"
  });

  const previousFields = settingsStore.homeContent.contactSection.formFields.map(cloneField);
  settingsStore.homeContent.contactSection.formFields = previousFields.filter(
    (item) => item.id !== field.id
  );

  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("字段已删除。");
  } catch (error) {
    settingsStore.homeContent.contactSection.formFields = previousFields;
    ElMessage.error(error instanceof Error ? error.message : "字段删除失败。");
  }
};
</script>

<template>
  <div class="page-stack contact-config-page">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页模块</p>
          <h2>首页联系模块</h2>
        </div>
        <el-button type="primary" @click="saveModuleSettings">保存模块设置</el-button>
      </div>

      <div class="stack-grid">
        <div class="contact-config-lead">
          <strong>模块基础信息</strong>
          <p>控制首页联系区标题文案、成功提示和提交按钮文案。</p>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="settingsStore.homeContent.contactSection.eyebrow"
            placeholder="模块眉标"
          />
          <el-input
            v-model="settingsStore.homeContent.contactSection.title"
            placeholder="模块标题"
          />
        </div>

        <el-input
          v-model="settingsStore.homeContent.contactSection.text"
          type="textarea"
          :rows="3"
          placeholder="模块说明文案"
        />

        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="settingsStore.homeContent.contactSection.successMessage"
            placeholder="提交成功提示语"
          />
          <el-input
            v-model="settingsStore.homeContent.contactSection.fields.submitLabel"
            placeholder="提交按钮文案"
          />
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">表单字段</p>
          <h2>联系表单收集配置</h2>
        </div>
        <div class="header-actions">
          <el-input
            v-model="search"
            placeholder="搜索字段标题、key、类型"
            clearable
            class="toolbar-input"
          />
          <el-button @click="openCreate">新增字段</el-button>
        </div>
      </div>

      <div class="contact-summary-grid">
        <div class="contact-summary-card">
          <span>全部字段</span>
          <strong>{{ settingsStore.homeContent.contactSection.formFields.length }}</strong>
        </div>
        <div class="contact-summary-card">
          <span>已启用</span>
          <strong>{{ enabledFields.length }}</strong>
        </div>
        <div class="contact-summary-card">
          <span>必填</span>
          <strong>{{ requiredCount }}</strong>
        </div>
        <div class="contact-summary-card">
          <span>下拉字段</span>
          <strong>{{ selectCount }}</strong>
        </div>
      </div>

      <div class="table-scroll">
        <el-table :data="pagedItems" stripe>
          <el-table-column type="index" label="#" width="56" />
          <el-table-column label="字段信息" min-width="250">
            <template #default="{ row }">
              <div class="contact-table__primary">
                <strong>{{ row.label || "未命名字段" }}</strong>
                <span>{{ row.key }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template #default="{ row }">
              <el-tag type="info" effect="plain">
                {{ getFieldTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="140">
            <template #default="{ row }">
              <div class="contact-table__tags">
                <el-tag :type="row.enabled ? 'success' : 'info'" effect="plain">
                  {{ row.enabled ? "启用" : "停用" }}
                </el-tag>
                <el-tag v-if="row.required" type="warning" effect="plain">必填</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="placeholder" label="占位文案" min-width="220" show-overflow-tooltip />
          <el-table-column label="选项数" width="100" align="center">
            <template #default="{ row }">
              {{ row.type === "select" ? row.options.length : "-" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="removeField(row)">删除</el-button>
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
      :title="editingId ? '编辑表单字段' : '新增表单字段'"
      width="720px"
      destroy-on-close
    >
      <div class="stack-grid">
        <div class="contact-dialog__lead">
          <strong>{{ editingId ? "更新字段配置" : "创建新字段" }}</strong>
          <p>标题面向前台用户展示，key 用于提交识别，建议保持简洁稳定。</p>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-input v-model="draft.label" placeholder="字段标题，例如 Company Name" />
          <el-select v-model="draft.type" @change="handleTypeChange">
            <el-option
              v-for="option in fieldTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-input
            v-model="draft.key"
            placeholder="字段 key，例如 company / whatsapp / budget"
          />
          <el-input
            v-model="draft.placeholder"
            :placeholder="draft.type === 'select' ? '默认提示文案，例如 Choose one' : '占位文案'"
          />
        </div>

        <div class="contact-dialog__switches">
          <div class="contact-dialog__switch-item">
            <span>字段启用</span>
            <el-switch v-model="draft.enabled" />
          </div>
          <div class="contact-dialog__switch-item">
            <span>是否必填</span>
            <el-switch v-model="draft.required" />
          </div>
        </div>

        <div v-if="draft.type === 'select'" class="contact-option-editor">
          <div class="inline-row inline-row--spread">
            <div>
              <strong>下拉选项</strong>
              <p>配置用户实际可选择的值和显示文案。</p>
            </div>
            <el-button size="small" @click="addOption">新增选项</el-button>
          </div>

          <div
            v-for="(option, optionIndex) in draft.options"
            :key="`draft-option-${optionIndex}`"
            class="contact-option-row"
          >
            <el-input v-model="option.value" placeholder="选项值，例如 wholesale" />
            <el-input v-model="option.label" placeholder="显示文案，例如 Wholesale Inquiry" />
            <el-button link type="danger" @click="removeOption(optionIndex)">删除</el-button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="header-actions">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFieldDraft">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.contact-config-lead,
.contact-dialog__lead {
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background:
    radial-gradient(circle at right top, rgba(255, 106, 42, 0.12), transparent 30%),
    linear-gradient(180deg, #fdfefe 0%, #f7f9fd 100%);
  border: 1px solid rgba(16, 33, 58, 0.08);
}

.contact-config-lead strong,
.contact-dialog__lead strong {
  display: block;
  font-size: 1rem;
}

.contact-config-lead p,
.contact-dialog__lead p,
.contact-option-editor p {
  margin: 0.45rem 0 0;
  color: var(--admin-text-soft);
}

.contact-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.contact-summary-card {
  padding: 0.95rem 1rem;
  border-radius: 18px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: var(--admin-surface-soft);
}

.contact-summary-card span {
  display: block;
  color: var(--admin-text-soft);
  font-size: 0.8rem;
  font-weight: 700;
}

.contact-summary-card strong {
  display: block;
  margin-top: 0.45rem;
  color: var(--admin-navy);
  font-size: 1.45rem;
}

.table-scroll {
  width: 100%;
  overflow: hidden;
}

.contact-table__primary {
  display: grid;
  gap: 0.2rem;
}

.contact-table__primary strong {
  font-size: 0.95rem;
}

.contact-table__primary span {
  color: var(--admin-text-soft);
  font-size: 0.82rem;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.contact-table__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.contact-dialog__switches {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.contact-dialog__switch-item,
.contact-option-row {
  display: grid;
  align-items: center;
  gap: 0.75rem;
}

.contact-dialog__switch-item {
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: var(--admin-surface-soft);
}

.contact-dialog__switch-item span {
  font-weight: 600;
}

.contact-option-editor {
  display: grid;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: var(--admin-surface-soft);
}

.contact-option-row {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
}

@media (max-width: 1100px) {
  .contact-summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .contact-dialog__switches,
  .contact-option-row {
    grid-template-columns: 1fr;
  }
}
</style>
