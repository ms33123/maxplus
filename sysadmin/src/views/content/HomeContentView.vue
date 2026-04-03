<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useCatalogStore } from "../../stores/catalog";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();
const catalogStore = useCatalogStore();

const publishedProducts = computed(() =>
  catalogStore.products.filter((item) => item.status === "published")
);
const publishedVideos = computed(() =>
  catalogStore.videos.filter((item) => item.status === "published")
);

const createHeroSlide = () => ({
  id: `hero-${Date.now()}`,
  title: "",
  subtitle: "",
  targetUrl: "/products",
  imageUrl: "",
  enabled: true
});

const createReviewMetric = () => ({
  value: "",
  label: ""
});

const createReviewItem = () => ({
  id: `review-${Date.now()}`,
  quote: "",
  rating: 5,
  author: "",
  meta: "",
  imageUrl: ""
});

const addHeroSlide = () => {
  settingsStore.homeContent.heroSlides.push(createHeroSlide());
};

const removeHeroSlide = (index: number) => {
  settingsStore.homeContent.heroSlides.splice(index, 1);
};

const addReviewMetric = () => {
  settingsStore.homeContent.reviews.summary.metrics.push(createReviewMetric());
};

const removeReviewMetric = (index: number) => {
  settingsStore.homeContent.reviews.summary.metrics.splice(index, 1);
};

const addReviewItem = () => {
  settingsStore.homeContent.reviews.items.push(createReviewItem());
};

const removeReviewItem = (index: number) => {
  settingsStore.homeContent.reviews.items.splice(index, 1);
};

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页内容已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页内容保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页配置</p>
          <h2>首屏轮播和推荐模块</h2>
        </div>
        <div class="header-actions">
          <el-button @click="addHeroSlide">新增轮播</el-button>
          <el-button type="primary" @click="save">保存内容</el-button>
        </div>
      </div>

      <div class="stack-grid">
        <div
          v-for="(item, index) in settingsStore.homeContent.heroSlides"
          :key="item.id"
          class="editor-block"
        >
          <div class="inline-row inline-row--spread">
            <strong>轮播 {{ index + 1 }}</strong>
            <el-button
              link
              type="danger"
              :disabled="settingsStore.homeContent.heroSlides.length <= 1"
              @click="removeHeroSlide(index)"
            >
              删除
            </el-button>
          </div>
          <div class="editor-grid editor-grid--2">
            <el-input v-model="item.title" placeholder="轮播标题" />
            <el-input v-model="item.targetUrl" placeholder="跳转链接" />
          </div>
          <el-input v-model="item.imageUrl" placeholder="轮播图片地址，如 /images/hero-training.svg" />
          <el-input v-model="item.subtitle" placeholder="轮播副标题" />
          <div class="inline-row">
            <el-switch v-model="item.enabled" />
            <span>启用该轮播</span>
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">亮点卡片</p>
          <h2>首页亮点和推荐内容</h2>
        </div>
      </div>

      <div class="stack-grid">
        <el-input
          v-for="(item, index) in settingsStore.homeContent.highlights"
          :key="`${item}-${index}`"
          v-model="settingsStore.homeContent.highlights[index]"
        />
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="首页产品推荐">
          <el-select
            v-model="settingsStore.homeContent.featuredProductSlugs"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择首页产品模块展示的商品"
          >
            <el-option
              v-for="item in publishedProducts"
              :key="item.id"
              :label="item.title"
              :value="item.slug"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="首页视频推荐">
          <el-select
            v-model="settingsStore.homeContent.featuredVideoSlugs"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择首页视频模块展示的视频"
          >
            <el-option
              v-for="item in publishedVideos"
              :key="item.id"
              :label="item.title"
              :value="item.slug"
            />
          </el-select>
        </el-form-item>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">Reviews 模块</p>
          <h2>评分信息、评论信息和展示模式</h2>
        </div>
      </div>

      <div class="stack-grid">
        <div class="editor-grid editor-grid--3">
          <el-input v-model="settingsStore.homeContent.reviews.eyebrow" placeholder="模块眉标" />
          <el-input v-model="settingsStore.homeContent.reviews.title" placeholder="模块标题" />
          <el-select v-model="settingsStore.homeContent.reviews.displayMode" placeholder="展示模式">
            <el-option label="纯文字模式" value="text" />
            <el-option label="带图片模式" value="image" />
          </el-select>
        </div>

        <el-input
          v-model="settingsStore.homeContent.reviews.text"
          type="textarea"
          :rows="2"
          placeholder="模块说明文案"
        />

        <div class="editor-block">
          <div class="page-card__header">
            <div>
              <p class="page-card__eyebrow">评分摘要</p>
              <h3>顶部评分概览</h3>
            </div>
            <el-button @click="addReviewMetric">新增评分指标</el-button>
          </div>

          <div class="editor-grid editor-grid--3">
            <el-input
              v-model="settingsStore.homeContent.reviews.summary.label"
              placeholder="摘要标签"
            />
            <el-input
              v-model="settingsStore.homeContent.reviews.summary.value"
              placeholder="评分值，如 4.9/5"
            />
            <el-input
              v-model="settingsStore.homeContent.reviews.summary.detail"
              placeholder="补充说明"
            />
          </div>

          <div class="stack-grid">
            <div
              v-for="(metric, index) in settingsStore.homeContent.reviews.summary.metrics"
              :key="`${metric.label}-${index}`"
              class="editor-grid editor-grid--2"
            >
              <el-input v-model="metric.value" placeholder="指标值，如 92%" />
              <div class="inline-row">
                <el-input v-model="metric.label" placeholder="指标说明" />
                <el-button
                  link
                  type="danger"
                  :disabled="settingsStore.homeContent.reviews.summary.metrics.length <= 1"
                  @click="removeReviewMetric(index)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="editor-block">
          <div class="page-card__header">
            <div>
              <p class="page-card__eyebrow">评论列表</p>
              <h3>可设置评分、作者和图片</h3>
            </div>
            <el-button @click="addReviewItem">新增评论</el-button>
          </div>

          <div class="stack-grid">
            <div
              v-for="(item, index) in settingsStore.homeContent.reviews.items"
              :key="item.id"
              class="editor-block"
            >
              <div class="inline-row inline-row--spread">
                <strong>评论 {{ index + 1 }}</strong>
                <el-button
                  link
                  type="danger"
                  :disabled="settingsStore.homeContent.reviews.items.length <= 1"
                  @click="removeReviewItem(index)"
                >
                  删除
                </el-button>
              </div>

              <div class="editor-grid editor-grid--3">
                <el-input v-model="item.author" placeholder="评论人" />
                <el-input v-model="item.meta" placeholder="身份 / 职位" />
                <el-input-number v-model="item.rating" :min="1" :max="5" :controls="false" />
              </div>

              <el-input
                v-model="item.imageUrl"
                placeholder="评论图片地址，纯文字模式可留空"
              />
              <el-input v-model="item.quote" type="textarea" :rows="3" placeholder="评论内容" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
