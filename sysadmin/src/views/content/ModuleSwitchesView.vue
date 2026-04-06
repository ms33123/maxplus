<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";
import type { HomeSectionToggle } from "../../types/admin";

const settingsStore = useSettingsStore();
const savingKeys = ref<string[]>([]);

const isSaving = (key: string) => savingKeys.value.includes(key);

const handleToggle = (item: HomeSectionToggle, value: string | number | boolean) => {
  void toggleSection(item, value);
};

const toggleSection = async (item: HomeSectionToggle, value: string | number | boolean) => {
  const enabled = Boolean(value);
  const previous = !enabled;

  if (isSaving(item.key)) {
    return;
  }

  savingKeys.value.push(item.key);

  try {
    await settingsStore.saveHomeContent();
    ElMessage.success(`${item.label}${enabled ? "已开启" : "已关闭"}。`);
  } catch (error) {
    item.enabled = previous;
    ElMessage.error(error instanceof Error ? error.message : "模块开关保存失败。");
  } finally {
    savingKeys.value = savingKeys.value.filter((key) => key !== item.key);
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <p class="page-card__eyebrow">模块控制</p>
      </div>

      <div class="module-toggle-grid">
        <article
          v-for="item in settingsStore.homeContent.sectionToggles"
          :key="item.key"
          class="editor-block module-toggle-card"
        >
          <div class="module-toggle-card__top">
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.enabled ? "当前显示中" : "当前已隐藏" }}</p>
            </div>
            <el-switch
              v-model="item.enabled"
              :loading="isSaving(item.key)"
              :disabled="isSaving(item.key)"
              @change="handleToggle(item, $event)"
            />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
