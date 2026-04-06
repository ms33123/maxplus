<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNavTabsStore } from "../../stores/navTabs";

const route = useRoute();
const router = useRouter();
const navTabsStore = useNavTabsStore();
const tabsContainer = ref<HTMLDivElement | null>(null);
const tabRefs = ref<Record<string, HTMLDivElement | null>>({});
const draggingPath = ref<string | null>(null);
const dropTargetPath = ref<string | null>(null);

watch(
  [() => route.path, () => route.name],
  ([path, routeName]) => {
    navTabsStore.syncRoute(path, typeof routeName === "string" ? routeName : null);
  },
  {
    immediate: true
  }
);

const tabs = computed(() => navTabsStore.tabs);
const dashboardPath = "/dashboard";

watch(
  [() => route.path, () => tabs.value.map((tab) => tab.path).join("|")],
  async () => {
    await nextTick();
    centerActiveTab(route.path);
  },
  {
    immediate: true
  }
);

const centerActiveTab = (path: string) => {
  const container = tabsContainer.value;
  const tab = tabRefs.value[path];

  if (!container || !tab) {
    return;
  }

  const nextLeft = Math.max(0, tab.offsetLeft - (container.clientWidth - tab.clientWidth) / 2);
  container.scrollTo({
    left: nextLeft,
    behavior: "smooth"
  });
};

const setTabRef = (path: string, element: HTMLDivElement | null) => {
  if (!element) {
    delete tabRefs.value[path];
    return;
  }

  tabRefs.value[path] = element;
};

const openTab = async (path: string) => {
  navTabsStore.activate(path);

  if (route.path === path) {
    return;
  }

  await router.push(path);
};

const closeTab = async (path: string) => {
  const nextPath = navTabsStore.close(path);

  if (route.path !== path || !nextPath) {
    return;
  }

  await router.push(nextPath);
};

const startDrag = (path: string, event: DragEvent) => {
  if (path === dashboardPath) {
    return;
  }

  draggingPath.value = path;
  dropTargetPath.value = null;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", path);
  }
};

const handleDragOver = (path: string, event: DragEvent) => {
  if (!draggingPath.value || path === draggingPath.value || path === dashboardPath) {
    return;
  }

  event.preventDefault();
  dropTargetPath.value = path;

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const handleDrop = (path: string) => {
  if (!draggingPath.value || path === draggingPath.value || path === dashboardPath) {
    draggingPath.value = null;
    dropTargetPath.value = null;
    return;
  }

  navTabsStore.move(draggingPath.value, path);
  draggingPath.value = null;
  dropTargetPath.value = null;
};

const clearDragState = () => {
  draggingPath.value = null;
  dropTargetPath.value = null;
};
</script>

<template>
  <div ref="tabsContainer" class="route-tabs" aria-label="页面标签">
    <div class="route-tabs__list" role="tablist">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="route-tab"
        :class="{
          'is-active': tab.path === route.path,
          'is-fixed': tab.path === dashboardPath,
          'is-dragging': tab.path === draggingPath,
          'is-drop-target': tab.path === dropTargetPath
        }"
        tabindex="0"
        role="tab"
        :aria-selected="tab.path === route.path"
        :draggable="tab.closable"
        :ref="(element) => setTabRef(tab.path, element as HTMLDivElement | null)"
        @click="openTab(tab.path)"
        @keydown.enter.prevent="openTab(tab.path)"
        @keydown.space.prevent="openTab(tab.path)"
        @dragstart="startDrag(tab.path, $event)"
        @dragover="handleDragOver(tab.path, $event)"
        @drop.prevent="handleDrop(tab.path)"
        @dragend="clearDragState"
      >
        <span class="route-tab__label">{{ tab.title }}</span>
        <button
          v-if="tab.closable"
          type="button"
          class="route-tab__close"
          aria-label="关闭标签页"
          @click.stop="closeTab(tab.path)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
