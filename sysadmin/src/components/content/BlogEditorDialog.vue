<script setup lang="ts">
import { reactive, watch } from "vue";
import type { BlogRecord } from "../../types/admin";

const props = defineProps<{
  modelValue: boolean;
  post: BlogRecord | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: BlogRecord];
}>();

const createDraft = (): BlogRecord => ({
  id: "",
  title: "",
  slug: "",
  categoryId: "",
  category: "",
  author: "",
  status: "draft",
  publishDate: new Date().toISOString().slice(0, 10),
  excerpt: "",
  body: [],
  bodyHtml: "",
  coverImage: "",
  meta: ""
});

const draft = reactive<BlogRecord>(createDraft());

watch(
  () => props.post,
  (value) => {
    Object.assign(draft, value ?? createDraft());
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    id: draft.id || `blog-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="700px"
    :title="post ? '编辑博客' : '新增博客'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="文章标题">
          <el-input v-model="draft.title" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="文章分类">
          <el-input v-model="draft.category" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="draft.author" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker v-model="draft.publishDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </div>

      <el-form-item label="状态">
        <el-segmented
          v-model="draft.status"
          :options="[
            { label: '草稿', value: 'draft' },
            { label: '已发布', value: 'published' }
          ]"
        />
      </el-form-item>

      <el-form-item label="摘要">
        <el-input v-model="draft.excerpt" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存文章</el-button>
    </template>
  </el-dialog>
</template>
