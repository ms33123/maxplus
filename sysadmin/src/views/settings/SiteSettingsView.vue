<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();
const themeOptions = [
  {
    value: "default",
    label: "默认主题",
    description: "保留当前前台默认视觉，不额外叠加节日装饰。"
  },
  {
    value: "christmas",
    label: "圣诞主题",
    description: "切换为红绿节日配色，并可开启雪花和灯串等节日氛围。"
  }
] as const;

const activeThemeOption = computed(
  () =>
    themeOptions.find((item) => item.value === settingsStore.siteSettings.theme.preset) ||
    themeOptions[0]
);

const save = async () => {
  try {
    await settingsStore.saveSiteSettings();
    ElMessage.success("站点设置已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "站点设置保存失败。");
  }
};
</script>

<template>
  <div class="page-grid page-grid--2">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">基础设置</p>
          <h2>品牌与联系方式配置</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <el-form label-position="top" class="editor-form">
        <div class="editor-grid editor-grid--2">
          <el-form-item label="品牌名称">
            <el-input v-model="settingsStore.siteSettings.brand.brandName" />
          </el-form-item>
          <el-form-item label="网站标题">
            <el-input v-model="settingsStore.siteSettings.brand.siteTitle" />
          </el-form-item>
        </div>

        <el-form-item label="网站描述">
          <el-input v-model="settingsStore.siteSettings.brand.siteDescription" type="textarea" :rows="4" />
        </el-form-item>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="售后邮箱">
            <el-input v-model="settingsStore.siteSettings.brand.supportEmail" />
          </el-form-item>
          <el-form-item label="销售邮箱">
            <el-input v-model="settingsStore.siteSettings.brand.salesEmail" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="联系电话">
            <el-input v-model="settingsStore.siteSettings.brand.phone" />
          </el-form-item>
          <el-form-item label="WhatsApp">
            <el-input v-model="settingsStore.siteSettings.brand.whatsapp" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--3">
          <el-form-item label="默认语言">
            <el-input v-model="settingsStore.siteSettings.brand.defaultLanguage" />
          </el-form-item>
          <el-form-item label="默认币种">
            <el-input v-model="settingsStore.siteSettings.brand.defaultCurrency" />
          </el-form-item>
          <el-form-item label="时区">
            <el-input v-model="settingsStore.siteSettings.brand.timezone" />
          </el-form-item>
        </div>

        <el-form-item label="联系地址">
          <el-input v-model="settingsStore.siteSettings.brand.address" />
        </el-form-item>
      </el-form>
    </section>

    <div class="page-stack">
      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">社媒链接</p>
            <h2>外部渠道配置</h2>
          </div>
        </div>

        <div class="stack-grid">
          <div v-for="item in settingsStore.siteSettings.socials" :key="item.name" class="inline-row">
            <el-input v-model="item.name" />
            <el-input v-model="item.url" />
          </div>
        </div>
      </section>

      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">主题设置</p>
            <h2>前台主题风格</h2>
          </div>
        </div>

        <el-form label-position="top" class="editor-form">
          <el-form-item label="主题预设">
            <el-select v-model="settingsStore.siteSettings.theme.preset">
              <el-option
                v-for="item in themeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <div class="editor-block theme-settings__summary">
            <strong>{{ activeThemeOption.label }}</strong>
            <p>{{ activeThemeOption.description }}</p>
          </div>

          <div class="inline-row inline-row--spread theme-settings__toggle">
            <div>
              <strong>节日动效</strong>
              <p>开启后，节日主题会展示飘雪和灯串动效；默认主题不会额外显示这些效果。</p>
            </div>
            <el-switch v-model="settingsStore.siteSettings.theme.effectsEnabled" />
          </div>
        </el-form>
      </section>

      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">通知设置</p>
            <h2>询盘和订阅提醒</h2>
          </div>
        </div>

        <el-form label-position="top" class="editor-form">
          <el-form-item label="询盘通知接收人">
            <el-input v-model="settingsStore.siteSettings.notifications.inquiryRecipients" />
          </el-form-item>
          <el-form-item label="订阅通知接收人">
            <el-input v-model="settingsStore.siteSettings.notifications.subscriberRecipients" />
          </el-form-item>
          <div class="inline-row">
            <el-switch v-model="settingsStore.siteSettings.notifications.enableEmailNotice" />
            <span>启用邮件通知</span>
          </div>
          <div class="inline-row">
            <el-switch v-model="settingsStore.siteSettings.notifications.enableSlackNotice" />
            <span>启用 Slack 通知</span>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>
