<script setup lang="ts">
import { ElMessage } from "element-plus";
import MailerSettingsPanel from "../../components/settings/MailerSettingsPanel.vue";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const save = async () => {
  try {
    await settingsStore.saveSiteSettings();
    ElMessage.success("邮件配置已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "邮件配置保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <div class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">系统配置</p>
          <h2>邮件配置</h2>
        </div>
        <el-button type="primary" @click="save">保存邮件配置</el-button>
      </div>
      <p class="mailer-settings-view__text">
        单独维护订阅确认邮件的 SMTP、发件人和模板设置，不再和站点基础信息放在同一页。
      </p>
    </div>

    <MailerSettingsPanel />
  </div>
</template>

<style scoped>
.mailer-settings-view__text {
  margin: 0;
  color: var(--admin-text-soft);
}
</style>
