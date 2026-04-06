<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const templateTokens = computed(() => [
  "{{brandName}}",
  "{{siteTitle}}",
  "{{subscriberEmail}}",
  "{{sourceLabel}}",
  "{{submittedAt}}",
  "{{fieldSummaryText}}",
  "{{fieldSummaryHtml}}",
  "{{subscriber.fields.email}}",
  "{{subscriber.fields.order_number}}"
]);

const clearSavedPassword = () => {
  settingsStore.siteSettings.mailer.smtpPassword = "";
  settingsStore.siteSettings.mailer.clearPassword = true;
  settingsStore.siteSettings.mailer.hasPassword = false;
};

const handlePasswordInput = () => {
  if (settingsStore.siteSettings.mailer.smtpPassword) {
    settingsStore.siteSettings.mailer.clearPassword = false;
  }
};
</script>

<template>
  <section class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">邮件发送</p>
        <h2>订阅确认邮件配置</h2>
      </div>
    </div>

    <el-form label-position="top" class="editor-form">
      <div class="inline-row">
        <el-switch v-model="settingsStore.siteSettings.mailer.enabled" />
        <span>启用订阅成功后的自动邮件发送</span>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="SMTP 主机">
          <el-input v-model="settingsStore.siteSettings.mailer.host" placeholder="smtp.example.com" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number
            v-model="settingsStore.siteSettings.mailer.port"
            :min="1"
            :max="65535"
            controls-position="right"
            class="full-width"
          />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="SMTP 用户名">
          <el-input v-model="settingsStore.siteSettings.mailer.username" placeholder="mailer@example.com" />
        </el-form-item>
        <el-form-item label="SMTP 密码">
          <el-input
            v-model="settingsStore.siteSettings.mailer.smtpPassword"
            type="password"
            show-password
            placeholder="留空则保留已保存密码"
            @input="handlePasswordInput"
          />
          <div class="mailer-password-row">
            <el-tag
              v-if="settingsStore.siteSettings.mailer.hasPassword && !settingsStore.siteSettings.mailer.clearPassword"
              type="success"
              effect="plain"
            >
              已保存密码
            </el-tag>
            <el-tag v-if="settingsStore.siteSettings.mailer.clearPassword" type="warning" effect="plain">
              本次保存会清空密码
            </el-tag>
            <el-button
              v-if="settingsStore.siteSettings.mailer.hasPassword || settingsStore.siteSettings.mailer.clearPassword"
              link
              type="danger"
              @click="clearSavedPassword"
            >
              清空已保存密码
            </el-button>
          </div>
        </el-form-item>
      </div>

      <div class="inline-row">
        <el-switch v-model="settingsStore.siteSettings.mailer.secure" />
        <span>使用 SSL / TLS 安全连接</span>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="发件邮箱">
          <el-input v-model="settingsStore.siteSettings.mailer.fromEmail" placeholder="hello@example.com" />
        </el-form-item>
        <el-form-item label="发件人名称">
          <el-input v-model="settingsStore.siteSettings.mailer.fromName" placeholder="MaxPlus Sporting Goods" />
        </el-form-item>
        <el-form-item label="Reply-To">
          <el-input v-model="settingsStore.siteSettings.mailer.replyTo" placeholder="support@example.com" />
        </el-form-item>
      </div>

      <el-form-item label="邮件主题模板">
        <el-input
          v-model="settingsStore.siteSettings.mailer.subjectTemplate"
          placeholder="Thanks for subscribing to {{brandName}}"
        />
      </el-form-item>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="HTML 模板">
          <el-input
            v-model="settingsStore.siteSettings.mailer.htmlTemplate"
            type="textarea"
            :rows="10"
            placeholder="<p>Hi {{subscriberEmail}},</p>"
          />
        </el-form-item>
        <el-form-item label="纯文本模板">
          <el-input
            v-model="settingsStore.siteSettings.mailer.textTemplate"
            type="textarea"
            :rows="10"
            placeholder="Hi {{subscriberEmail}},"
          />
        </el-form-item>
      </div>
    </el-form>

    <div class="mailer-help">
      <strong>可用模板变量</strong>
      <div class="mailer-token-list">
        <el-tag v-for="token in templateTokens" :key="token" effect="plain">{{ token }}</el-tag>
      </div>
    </div>
  </section>
</template>

<style scoped>
.full-width {
  width: 100%;
}

.mailer-password-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.55rem;
}

.mailer-help {
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: var(--admin-surface-soft);
}

.mailer-help strong {
  display: block;
  margin-bottom: 0.75rem;
}

.mailer-token-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
</style>
