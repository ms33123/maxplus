import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { resolvePageTitle } from "../config/routeMeta";
import { readStorage, removeStorage, writeStorage } from "../utils/storage";

export interface NavTabItem {
  path: string;
  name: string;
  title: string;
  closable: boolean;
}

export const NAV_TABS_KEY = "maxplus-sysadmin-nav-tabs";
export const NAV_ACTIVE_TAB_KEY = "maxplus-sysadmin-nav-active";

const dashboardTab: NavTabItem = {
  path: "/dashboard",
  name: "dashboard",
  title: resolvePageTitle("dashboard"),
  closable: false
};

function isNavTabItem(value: unknown): value is NavTabItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<NavTabItem>;
  return (
    typeof candidate.path === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.closable === "boolean"
  );
}

function normalizeTabs(input: unknown): NavTabItem[] {
  const restored = Array.isArray(input) ? input.filter(isNavTabItem) : [];
  const uniqueTabs = restored.filter(
    (tab, index, items) =>
      tab.path !== "/login" && items.findIndex((item) => item.path === tab.path) === index
  );

  if (!uniqueTabs.some((tab) => tab.path === dashboardTab.path)) {
    uniqueTabs.unshift(dashboardTab);
  } else {
    const dashboardIndex = uniqueTabs.findIndex((tab) => tab.path === dashboardTab.path);
    uniqueTabs.splice(dashboardIndex, 1);
    uniqueTabs.unshift(dashboardTab);
  }

  return uniqueTabs;
}

function enforceDashboardFirst(items: NavTabItem[]) {
  const normalized = items.filter((tab) => tab.path !== "/login");
  const dashboardIndex = normalized.findIndex((tab) => tab.path === dashboardTab.path);
  const dashboard = dashboardIndex >= 0 ? normalized[dashboardIndex] : dashboardTab;
  const others = normalized.filter((tab) => tab.path !== dashboardTab.path);
  return [dashboardTab.path === dashboard.path ? dashboardTab : dashboard, ...others];
}

export const useNavTabsStore = defineStore("nav-tabs", () => {
  const tabs = ref<NavTabItem[]>(
    normalizeTabs(readStorage<unknown>(NAV_TABS_KEY, [dashboardTab]))
  );
  const activePath = ref<string>(
    readStorage<string>(NAV_ACTIVE_TAB_KEY, dashboardTab.path) || dashboardTab.path
  );

  const persist = () => {
    tabs.value = enforceDashboardFirst(tabs.value);
    writeStorage(NAV_TABS_KEY, tabs.value);
    writeStorage(NAV_ACTIVE_TAB_KEY, activePath.value);
  };

  const syncRoute = (path: string, routeName?: string | null) => {
    if (!path || path === "/login") {
      return;
    }

    const name = routeName ?? path;
    const nextTab: NavTabItem = {
      path,
      name,
      title: resolvePageTitle(routeName, name),
      closable: path !== dashboardTab.path
    };
    const existingIndex = tabs.value.findIndex((tab) => tab.path === path);

    if (existingIndex === -1) {
      tabs.value = [...tabs.value, nextTab];
    } else {
      tabs.value.splice(existingIndex, 1, nextTab);
    }

    activePath.value = path;
    persist();
  };

  const activate = (path: string) => {
    if (!tabs.value.some((tab) => tab.path === path)) {
      return;
    }

    activePath.value = path;
    persist();
  };

  const close = (path: string) => {
    const closingIndex = tabs.value.findIndex((tab) => tab.path === path);

    if (closingIndex === -1 || tabs.value[closingIndex]?.closable === false) {
      return activePath.value;
    }

    const isClosingActive = activePath.value === path;
    const sibling =
      tabs.value[closingIndex + 1] ??
      tabs.value[closingIndex - 1] ??
      dashboardTab;

    tabs.value = tabs.value.filter((tab) => tab.path !== path);

    if (isClosingActive) {
      activePath.value = sibling.path;
    }

    persist();
    return activePath.value;
  };

  const move = (dragPath: string, dropPath: string) => {
    if (
      !dragPath ||
      !dropPath ||
      dragPath === dropPath ||
      dragPath === dashboardTab.path ||
      dropPath === dashboardTab.path
    ) {
      return;
    }

    const currentTabs = tabs.value.slice();
    const dragIndex = currentTabs.findIndex((tab) => tab.path === dragPath);
    const dropIndex = currentTabs.findIndex((tab) => tab.path === dropPath);

    if (dragIndex === -1 || dropIndex === -1) {
      return;
    }

    const [dragTab] = currentTabs.splice(dragIndex, 1);
    const adjustedIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
    currentTabs.splice(adjustedIndex, 0, dragTab);
    tabs.value = enforceDashboardFirst(currentTabs);
    persist();
  };

  const reset = () => {
    tabs.value = [dashboardTab];
    activePath.value = dashboardTab.path;
    removeStorage(NAV_TABS_KEY);
    removeStorage(NAV_ACTIVE_TAB_KEY);
  };

  const visibleTabs = computed(() => tabs.value.filter((tab) => tab.path !== "/login"));

  return {
    tabs: visibleTabs,
    activePath,
    syncRoute,
    activate,
    close,
    move,
    reset
  };
});
