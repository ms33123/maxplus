<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import RichTextEditor from "../../components/content/RichTextEditor.vue";
import { useCatalogStore } from "../../stores/catalog";
import type { BlogRecord } from "../../types/admin";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalogStore();

function createDraft(): BlogRecord {
  return {
    id: "",
    title: "",
    slug: "",
    categoryId: catalogStore.blogCategories[0]?.id || "",
    category: catalogStore.blogCategories[0]?.name || "",
    author: "Operations Team",
    status: "draft",
    publishDate: new Date().toISOString().slice(0, 10),
    excerpt: "",
    body: [],
    bodyHtml: "",
    coverImage: "",
    meta: ""
  };
}

const draft = reactive<BlogRecord>(createDraft());

const pageMode = computed(() => (route.name === "blog-editor-new" ? "create" : "edit"));
const currentId = computed(() => String(route.params.id || ""));
const currentCategoryLabel = computed(
  () => catalogStore.blogCategories.find((item) => item.id === draft.categoryId)?.name || ""
);
const bodyHtmlModel = computed({
  get: () => draft.bodyHtml || "",
  set: (value: string) => {
    draft.bodyHtml = normalizeRichTextHtml(value);
  }
});

function normalizeRichTextHtml(value?: string | null) {
  const html = (value || "").trim();
  return html === "<p><br></p>" ? "" : html;
}

function extractParagraphsFromHtml(value?: string | null) {
  const html = normalizeRichTextHtml(value);

  if (!html) {
    return [];
  }

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const blocks = Array.from(doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote, pre"));
    const paragraphs = blocks
      .map((node) => node.textContent?.replace(/\s+/g, " ").trim() || "")
      .filter(Boolean);

    if (paragraphs.length) {
      return paragraphs;
    }

    const plainText = doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
    return plainText ? [plainText] : [];
  }

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|pre)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split(/\n+/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const syncDraft = () => {
  if (pageMode.value === "create") {
    Object.assign(draft, createDraft());
    return;
  }

  const record = catalogStore.blogs.find((item) => item.id === currentId.value);

  if (!record) {
    ElMessage.warning("未找到对应文章，已返回文章列表。");
    void router.replace("/content/blog/posts");
    return;
  }

  Object.assign(draft, {
    ...createDraft(),
    ...record,
    bodyHtml:
      record.bodyHtml ||
      (record.body?.length ? record.body.map((paragraph) => `<p>${paragraph}</p>`).join("") : "")
  });
};

watch(
  [() => route.name, () => route.params.id, () => catalogStore.blogs.length, () => catalogStore.blogCategories.length],
  syncDraft,
  { immediate: true }
);

watch(
  () => draft.categoryId,
  (value) => {
    draft.category = catalogStore.blogCategories.find((item) => item.id === value)?.name || "";
  }
);

const saveArticle = async (status: BlogRecord["status"]) => {
  try {
    const bodyHtml = normalizeRichTextHtml(draft.bodyHtml);

    const saved = await catalogStore.saveBlog({
      ...draft,
      status,
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      author: draft.author.trim(),
      excerpt: draft.excerpt.trim(),
      meta: draft.meta?.trim() || "",
      coverImage: draft.coverImage?.trim() || "",
      body: extractParagraphsFromHtml(bodyHtml),
      bodyHtml,
      category: currentCategoryLabel.value
    });

    Object.assign(draft, saved);
    ElMessage.success(status === "published" ? "文章已发布。" : "草稿已保存。");

    if (status === "published") {
      await router.replace("/content/blog/posts");
      return;
    }

    if (pageMode.value === "create") {
      await router.replace(`/content/blog/editor/${saved.id}`);
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "文章保存失败。");
  }
};

const goBack = async () => {
  await router.push("/content/blog/posts");
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">文章信息</p>
          <p>维护文章标题、分类、发布时间、摘要和封面图。</p>
        </div>

        <div class="header-actions">
          <el-button @click="goBack">返回列表</el-button>
          <el-button @click="saveArticle('draft')">保存草稿</el-button>
          <el-button type="primary" @click="saveArticle('published')">发布文章</el-button>
        </div>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="文章标题">
          <el-input v-model="draft.title" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" placeholder="可留空自动生成" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="文章分类">
          <el-select v-model="draft.categoryId" placeholder="选择文章分类">
            <el-option
              v-for="item in catalogStore.blogCategories.filter((entry) => entry.enabled || entry.id === draft.categoryId)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="draft.author" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker v-model="draft.publishDate" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="封面图地址">
          <el-input v-model="draft.coverImage" placeholder="如 /images/hero-training.svg" />
        </el-form-item>
        <el-form-item label="Meta 文案">
          <el-input v-model="draft.meta" placeholder="如 Brand Team / 2026-04-02" />
        </el-form-item>
      </div>

      <el-form-item label="摘要">
        <el-input v-model="draft.excerpt" type="textarea" :rows="4" />
      </el-form-item>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">正文内容</p>
          <p>使用富文本方式编辑文章正文，支持标题、列表和基础排版。</p>
        </div>
      </div>

      <RichTextEditor v-model="bodyHtmlModel" placeholder="输入博客正文内容" />
    </section>
  </div>
</template>
