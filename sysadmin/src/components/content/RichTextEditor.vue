<script setup lang="ts">
import { computed } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    readOnly?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "请输入内容",
    readOnly: false
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block", "link"],
  ["clean"]
];

const editorContent = computed(() => normalizeHtml(props.modelValue));

function normalizeHtml(value?: string | null) {
  const html = (value || "").trim();
  return html === "<p><br></p>" ? "" : html;
}

function handleUpdate(value: string) {
  emit("update:modelValue", normalizeHtml(value));
}
</script>

<template>
  <div class="rich-text-editor" data-testid="rich-text-editor">
    <QuillEditor
      class="rich-text-editor__field"
      :content="editorContent"
      content-type="html"
      theme="snow"
      :toolbar="toolbarOptions"
      :read-only="readOnly"
      :placeholder="placeholder"
      @update:content="handleUpdate"
    />
  </div>
</template>

<style scoped>
.rich-text-editor {
  min-width: 0;
}

.rich-text-editor__field {
  border: 1px solid rgba(16, 33, 58, 0.08);
  border-radius: var(--admin-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--admin-shadow-soft);
}

.rich-text-editor__field:focus-within {
  border-color: rgba(255, 106, 42, 0.32);
  box-shadow:
    0 0 0 1px rgba(255, 106, 42, 0.14),
    0 12px 24px rgba(17, 35, 63, 0.08);
}

.rich-text-editor :deep(.ql-toolbar.ql-snow) {
  border: 0;
  border-bottom: 1px solid rgba(16, 33, 58, 0.08);
  padding: 0.72rem 0.78rem;
  background: linear-gradient(180deg, #f9fbfe 0%, #f3f7fc 100%);
}

.rich-text-editor :deep(.ql-container.ql-snow) {
  border: 0;
  font-family: inherit;
}

.rich-text-editor :deep(.ql-editor) {
  min-height: 320px;
  padding: 1rem 1.05rem;
  color: var(--admin-text);
  font-size: 0.96rem;
  line-height: 1.75;
}

.rich-text-editor :deep(.ql-editor.ql-blank::before) {
  left: 1.05rem;
  right: 1.05rem;
  color: var(--admin-text-soft);
  font-style: normal;
}

.rich-text-editor :deep(.ql-snow .ql-picker) {
  color: var(--admin-navy-2);
}

.rich-text-editor :deep(.ql-snow .ql-stroke) {
  stroke: var(--admin-navy-2);
}

.rich-text-editor :deep(.ql-snow .ql-fill) {
  fill: var(--admin-navy-2);
}

.rich-text-editor :deep(.ql-snow .ql-picker-options) {
  border-color: rgba(16, 33, 58, 0.12);
  border-radius: 10px;
  box-shadow: var(--admin-shadow-soft);
}
</style>
