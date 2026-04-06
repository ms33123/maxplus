<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { CategoryRecord } from "../../types/admin";

const props = defineProps<{
  modelValue: boolean;
  category: CategoryRecord | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: CategoryRecord];
}>();

const createDraft = (): CategoryRecord => ({
  id: "",
  name: "",
  slug: "",
  parent: "顶级分类",
  sortOrder: 1,
  enabled: true,
  seoTitle: "",
  eyebrow: "Category",
  summary: "",
  bannerTitle: "",
  bannerText: "",
  filterConfig: {
    sportLabel: "Sport Type",
    audienceLabel: "Audience",
    useCaseLabel: "Use",
    stockLabel: "Stock",
    sortLabel: "Sort",
    allLabel: "All",
    sortDefaultLabel: "Default",
    sortLatestLabel: "Latest",
    sortPriceAscLabel: "Price Low To High",
    sortPriceDescLabel: "Price High To Low",
    sortBestSellingLabel: "Best Selling"
  },
  visualClass: "",
  highlights: [],
  stats: []
});

const draft = reactive<CategoryRecord>(createDraft());
const maxHighlights = 5;
const statsText = ref("");

const formatStats = (stats: CategoryRecord["stats"] = []) =>
  (stats ?? []).map((item) => `${item.value} | ${item.label}`).join("\n");

const parseStats = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart, ...labelParts] = line.split("|");
      return {
        value: valuePart?.trim() || "",
        label: labelParts.join("|").trim()
      };
    })
    .filter((item) => item.value && item.label);

watch(
  () => props.category,
  (value) => {
    Object.assign(draft, createDraft(), value ?? {});
    draft.highlights = Array.isArray(draft.highlights) ? draft.highlights.slice(0, maxHighlights) : [];
    statsText.value = formatStats(draft.stats);
  },
  { immediate: true }
);

const addHighlight = () => {
  if ((draft.highlights?.length ?? 0) >= maxHighlights) {
    return;
  }

  draft.highlights = [...(draft.highlights ?? []), ""];
};

const removeHighlight = (index: number) => {
  draft.highlights = (draft.highlights ?? []).filter((_, itemIndex) => itemIndex !== index);
};

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    highlights: (draft.highlights ?? []).map((item) => item.trim()).filter(Boolean),
    stats: parseStats(statsText.value),
    id: draft.id || `cat-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="760px"
    :title="category ? '编辑产品分类' : '新增产品分类'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="分类名称">
          <el-input v-model="draft.name" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="上级分类">
          <el-input v-model="draft.parent" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="draft.sortOrder" :min="1" :controls="false" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="SEO 标题">
          <el-input v-model="draft.seoTitle" />
        </el-form-item>
        <el-form-item label="Banner Eyebrow">
          <el-input v-model="draft.eyebrow" placeholder="如：Category" />
        </el-form-item>
      </div>

      <el-form-item label="分类摘要">
        <el-input v-model="draft.summary" type="textarea" :rows="3" />
      </el-form-item>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="Banner 标题">
          <el-input v-model="draft.bannerTitle" />
        </el-form-item>
        <el-form-item label="视觉类名">
          <el-input v-model="draft.visualClass" placeholder="如：catalog-hero__visual--team" />
        </el-form-item>
      </div>

      <el-form-item label="Banner 说明">
        <el-input v-model="draft.bannerText" type="textarea" :rows="3" />
      </el-form-item>

      <div class="editor-block">
        <p class="page-card__eyebrow">筛选卡片</p>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="运动类型标签">
            <el-input v-model="draft.filterConfig!.sportLabel" />
          </el-form-item>
          <el-form-item label="受众标签">
            <el-input v-model="draft.filterConfig!.audienceLabel" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="用途标签">
            <el-input v-model="draft.filterConfig!.useCaseLabel" />
          </el-form-item>
          <el-form-item label="库存标签">
            <el-input v-model="draft.filterConfig!.stockLabel" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="排序标签">
            <el-input v-model="draft.filterConfig!.sortLabel" />
          </el-form-item>
          <el-form-item label="全部选项文案">
            <el-input v-model="draft.filterConfig!.allLabel" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="默认排序文案">
            <el-input v-model="draft.filterConfig!.sortDefaultLabel" />
          </el-form-item>
          <el-form-item label="最新排序文案">
            <el-input v-model="draft.filterConfig!.sortLatestLabel" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="价格升序文案">
            <el-input v-model="draft.filterConfig!.sortPriceAscLabel" />
          </el-form-item>
          <el-form-item label="价格降序文案">
            <el-input v-model="draft.filterConfig!.sortPriceDescLabel" />
          </el-form-item>
        </div>

        <el-form-item label="热销排序文案">
          <el-input v-model="draft.filterConfig!.sortBestSellingLabel" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="是否启用">
          <el-switch v-model="draft.enabled" />
        </el-form-item>
        <div></div>
      </div>

      <div class="editor-block">
        <div class="category-highlight-editor__header">
          <p class="page-card__eyebrow">亮点列表</p>
          <el-button :disabled="(draft.highlights?.length ?? 0) >= maxHighlights" @click="addHighlight">
            添加亮点
          </el-button>
        </div>

        <div class="stack-grid">
          <div
            v-for="(item, index) in draft.highlights"
            :key="`highlight-${index}`"
            class="category-highlight-editor__item"
          >
            <div class="category-highlight-editor__top">
              <strong>亮点 {{ index + 1 }}</strong>
              <el-button type="danger" text @click="removeHighlight(index)">删除</el-button>
            </div>
            <el-input
              v-model="draft.highlights![index]"
              placeholder="请输入亮点内容"
            />
          </div>
        </div>
      </div>

      <el-form-item label="统计数据">
        <el-input
          v-model="statsText"
          type="textarea"
          :rows="4"
          placeholder="每行格式：值 | 说明，例如：12+ | club-friendly SKUs"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存分类</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.category-highlight-editor__header,
.category-highlight-editor__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.category-highlight-editor__header {
  margin-bottom: 0.9rem;
}

.category-highlight-editor__top strong {
  font-size: 0.95rem;
}

.category-highlight-editor__item {
  display: grid;
  gap: 0.65rem;
  padding: 0.85rem;
  border-radius: 14px;
  border: 1px solid rgba(199, 206, 217, 0.9);
  background: rgba(255, 255, 255, 0.82);
}
</style>
