<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { VideoCategoryRecord, VideoRecord } from "../../types/admin";

interface VideoCategoryOption {
  value: string;
  label: string;
  sortOrder: number;
  children?: VideoCategoryOption[];
}

const treeSelectProps = {
  label: "label",
  children: "children"
} as const;

const props = defineProps<{
  modelValue: boolean;
  video: VideoRecord | null;
  categories: VideoCategoryRecord[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: VideoRecord];
}>();

const createDraft = (): VideoRecord => ({
  id: "",
  title: "",
  slug: "",
  categoryId: props.categories.find((item) => item.enabled)?.id ?? props.categories[0]?.id ?? "",
  topic: "",
  duration: "",
  status: "draft",
  cover: "",
  videoUrl: "",
  summary: ""
});

const draft = reactive<VideoRecord>(createDraft());

const categoryOptions = computed<VideoCategoryOption[]>(() => {
  const optionMap = new Map<string, VideoCategoryOption & { parent: string }>();

  for (const category of props.categories) {
    optionMap.set(category.id, {
      value: category.id,
      label: category.name,
      sortOrder: category.sortOrder,
      parent: category.parent,
      children: []
    });
  }

  const roots: Array<VideoCategoryOption & { parent: string }> = [];

  for (const option of optionMap.values()) {
    if (!option.parent || option.parent === "顶级分类") {
      roots.push(option);
      continue;
    }

    const parent = Array.from(optionMap.values()).find((item) => item.label === option.parent);

    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(option);
      continue;
    }

    roots.push(option);
  }

  const sortOptions = (items: Array<VideoCategoryOption & { parent: string }>): VideoCategoryOption[] =>
    items
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item) => ({
        value: item.value,
        label: item.label,
        sortOrder: item.sortOrder,
        children: item.children?.length
          ? sortOptions(item.children as Array<VideoCategoryOption & { parent: string }>)
          : undefined
      }));

  return sortOptions(roots);
});

watch(
  () => props.video,
  (value) => {
    Object.assign(draft, value ?? createDraft());
  },
  { immediate: true }
);

watch(
  () => props.categories,
  (categories) => {
    if (categories.some((item) => item.id === draft.categoryId)) {
      return;
    }

    draft.categoryId = categories.find((item) => item.enabled)?.id ?? categories[0]?.id ?? "";
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    id: draft.id || `vid-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="680px"
    :title="video ? '编辑视频' : '新增视频'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="视频标题">
          <el-input v-model="draft.title" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="所属分类">
          <el-tree-select
            v-model="draft.categoryId"
            :data="categoryOptions"
            :props="treeSelectProps"
            node-key="value"
            value-key="value"
            check-strictly
            default-expand-all
            :render-after-expand="false"
            placeholder="请选择视频分类"
          />
        </el-form-item>
        <el-form-item label="主题标签">
          <el-input v-model="draft.topic" />
        </el-form-item>
        <el-form-item label="时长">
          <el-input v-model="draft.duration" placeholder="例如 03:42" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="状态">
          <el-select v-model="draft.status">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面地址">
          <el-input v-model="draft.cover" />
        </el-form-item>
      </div>

      <el-form-item label="视频外链地址">
        <el-input
          v-model="draft.videoUrl"
          placeholder="支持 YouTube、Vimeo、Bilibili、直链 MP4 或可嵌入外链"
        />
        <div class="editor-form__hint">
          填写 YouTube 的 watch、share、shorts 等外链时，前台会自动转成 iframe 嵌入播放。
        </div>
      </el-form-item>

      <el-form-item label="视频摘要">
        <el-input v-model="draft.summary" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存视频</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.editor-form__hint {
  margin-top: 0.45rem;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}
</style>
